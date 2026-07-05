import { ChatOpenAI } from "@langchain/openai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import fs from "fs";

import path from "path";

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"; //check for @
import { OpenAIEmbeddings } from "@langchain/openai";
import { createStuffDocumentsChain } from "@langchain/classic/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createRetrievalChain } from "@langchain/classic/chains/retrieval";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { pineconeClient } from "./pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { VectorStore } from "@langchain/core/vectorstores";
import { Index, RecordMetadata } from "@pinecone-database/pinecone";
import { adminDb } from "@/firebase/firebaseAdmin";
import { auth } from "@clerk/nextjs/server";
import { Buffer } from "buffer";
import { v4 as uuidv4 } from "uuid";

// Lazily initialize the OpenAI model so importing this module during the
// Next.js build never requires OPENAI_API_KEY to be present.
let _model: ChatOpenAI | undefined;
function getModel(): ChatOpenAI {
  if (!_model) {
    _model = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-4o",
    });
  }
  return _model;
}

export const indexName = "projects-aziz";

// ---------
export async function generateDocs(docId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("User not found");

  const firebaseRef = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(docId)
    .get();

  const downloadUrl = firebaseRef.data()?.downloadUrl;
  if (!downloadUrl) throw new Error("Download URL not found");

 const response = await fetch(downloadUrl);
const arrayBuffer = await response.arrayBuffer();
const buffer = Buffer.from(arrayBuffer);

const tempDir = path.join(process.cwd(), "temp");
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

const tempFilePath = path.join(tempDir, `${uuidv4()}.pdf`);
fs.writeFileSync(tempFilePath, buffer);
console.log("Temp file exists?", fs.existsSync(tempFilePath)); // ✅ should be true

const loader = new PDFLoader(tempFilePath);
const docs = await loader.load(); // ✅ should now work

  const splitter = new RecursiveCharacterTextSplitter();
  const splitDocs = await splitter.splitDocuments(docs);
  return splitDocs;
}

// ---------
export async function generateEmbeddingsInPineconeVectorStore(docId: string): Promise<PineconeStore> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found");
  }

  let pineconeVectorStore;

  // Generate embeddings numerical for the split document
  console.log("---Generating embeddings---");
  const embeddings = new OpenAIEmbeddings();

  if (!pineconeClient) {
    throw new Error("Pinecone client is not initialized");
  }

  
  // Get the Pinecone index
  const index = pineconeClient.index;
  
  try {
    // Check if namespace exists
    const stats = await index.describeIndexStats();
    const namespaceExists = stats.namespaces?.[docId] !== undefined;

    if (namespaceExists) {
      console.log(
        `---Namespace ${docId} already exists, reusing existing embeddings---`
      );

      pineconeVectorStore = await PineconeStore.fromExistingIndex(embeddings, {
        pineconeIndex: index as unknown as Index<RecordMetadata>,
        namespace: docId,
      });

      return pineconeVectorStore;
    } else {
      // If namespace does not exist, download the PDF and generate embeddings
      const splitDocs = await generateDocs(docId);

      console.log(
        `---Storing the embeddings in ${docId} in the Pinecone Vector Store---`
      );

      pineconeVectorStore = await PineconeStore.fromDocuments(
        splitDocs,
        embeddings,
        {
          pineconeIndex: index as unknown as Index<RecordMetadata>,
          namespace: docId,
        }
      );

      return pineconeVectorStore;
    }
  } catch (error) {
    console.error('Error in Pinecone operations:', error);
    throw new Error(`Failed to process embeddings: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ---------
export async function generateLangchainCompletion(
  docId: string,
  question: string
) {
  console.log("[generateLangchainCompletion] Starting with docId:", docId, "question:", question);

  const { userId } = await auth();

  if (!userId) {
    console.error("[generateLangchainCompletion] No userId found");
    throw new Error("User not found");
  }
  console.log("[generateLangchainCompletion] userId:", userId);

  // Get the vector store for the document
  console.log("[generateLangchainCompletion] Getting vector store...");
  const pineconeVectorStore = await generateEmbeddingsInPineconeVectorStore(docId);
  console.log("[generateLangchainCompletion] Vector store retrieved:", !!pineconeVectorStore);

  if (!pineconeVectorStore) {
    throw new Error("Pinecone vector store not found");
  }

  // Create a retriever
  console.log("[generateLangchainCompletion] Creating retriever...");
  const retriever = (pineconeVectorStore as unknown as VectorStore).asRetriever();
  console.log("[generateLangchainCompletion] Retriever created");

  // Fetch chat history from Firestore
  const chatHistory = await fetchMessagesFromDb(docId);
  console.log("[generateLangchainCompletion] Chat history length:", chatHistory.length);

  // Build chat history string for context
  const chatHistoryText = chatHistory.length > 0
    ? chatHistory.map((msg) => {
        const role = msg._getType() === "human" ? "User" : "Assistant";
        return `${role}: ${msg.content}`;
      }).join("\n")
    : "";

  // Create a simple prompt that includes context and optional chat history
  const systemPrompt = chatHistoryText
    ? `You are a helpful assistant that answers questions based on the provided document context. Use the context below to answer the user's question. If you don't know the answer based on the context, say so.

Previous conversation:
${chatHistoryText}

Document context:
{context}`
    : `You are a helpful assistant that answers questions based on the provided document context. Use the context below to answer the user's question. If you don't know the answer based on the context, say so.

Document context:
{context}`;

  const answerPrompt = ChatPromptTemplate.fromMessages([
    ["system", systemPrompt],
    ["user", "{input}"],
  ]);

  // Create a documents chain
  const combineDocsChain = await createStuffDocumentsChain({
    llm: getModel(),
    prompt: answerPrompt,
  });

  // Create the retrieval chain
  const retrievalChain = await createRetrievalChain({
    retriever,
    combineDocsChain,
  });

  // Invoke the chain with the question
  console.log("[generateLangchainCompletion] Invoking retrieval chain with input:", question);
  try {
    const reply = await retrievalChain.invoke({
      input: question,
    });
    console.log("[generateLangchainCompletion] Reply received:", reply);
    console.log("[generateLangchainCompletion] Answer:", reply.answer);
    return reply.answer;
  } catch (error) {
    console.error("[generateLangchainCompletion] Error invoking chain:", error);
    throw error;
  }
}

// Helper function to fetch chat messages from Firestore
async function fetchMessagesFromDb(docId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found");
  }

  console.log("[fetchMessagesFromDb] Fetching from path:", `users/${userId}/files/${docId}/chat`);

  // Use "files" path to match ChatWithPdf component and askQuestion action
  const chats = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(docId)
    .collection("chat")
    .orderBy("createdAt", "asc")
    .get();

  const chatHistory = chats.docs.map((doc) =>
    doc.data().role === "human"
      ? new HumanMessage(doc.data().message)
      : new AIMessage(doc.data().message)
  );

  console.log(`---Fetched ${chatHistory.length} messages from chat history---`);

  return chatHistory;
}
