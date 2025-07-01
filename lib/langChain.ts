import { ChatOpenAI } from "@langchain/openai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import pineconeClient from "@/lib/pinecone";
// import { PineconeStore } from "@langchain/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { PineconeConflictError } from "@pinecone-database/pinecone/dist/errors";
import { Index, RecordMetadata } from "@pinecone-database/pinecone";
import { adminDb } from "@/firebase/firebaseAdmin";
import { auth } from "@clerk/nextjs/server";

// Function to verify vectors were stored in Pinecone
async function verifyPineconeStore(
  index: Index<RecordMetadata>,
  namespace: string,
  expectedCount: number
) {
  try {
    console.log(`--- Verifying Pinecone store for namespace: ${namespace} ---`);

    // Get index stats
    const stats = await index.describeIndexStats();
    console.log("Pinecone index stats:", JSON.stringify(stats, null, 2));

    // Check if namespace exists and has vectors
    if (stats.namespaces && stats.namespaces[namespace]) {
      const recordCount = stats.namespaces[namespace].recordCount;
      console.log(
        `--- Found ${recordCount} records in namespace ${namespace} ---`
      );

      if (recordCount >= expectedCount) {
        console.log("✅ Success: Vectors stored correctly in Pinecone");
      } else {
        console.warn(
          `⚠️ Warning: Expected ${expectedCount} records but found ${recordCount}`
        );
      }
    } else {
      console.error("❌ Error: Namespace not found in Pinecone index");
    }
  } catch (error) {
    console.error("❌ Error verifying Pinecone store:", error);
  }
}

// initialize open ai model with api key and model name
const model = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4o",
});

export const indexName = "aziz-projects";

// helper for fetchMessagesFromDB on generateLangchainCompletion

async function fetchMessagesFromDB(docId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not found");
  }

  console.log("--- Fetching chat history from the firestore database... ---");
  //get the last messages from the chat history
  const chat = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(docId)
    .collection("chat")
    .orderBy("createdAt", "desc")
    // .limit(6)
    .get();

  const chatHistory = chat.docs.map((doc) =>
    doc.data().role === "human"
      ? new HumanMessage(doc.data().message)
      : new AIMessage(doc.data().message)
  );

  console.log(
    `---  Fetched last $(chatHistory.lenght) messages successfully ---`
  );
  console.log(chatHistory.map((msg) => msg.content.toString()));

  return chatHistory;
}

export async function generateDocs(docId: string, userId: string) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  console.log("---Fetching the downloaded Url from the firebase...---");
  // accessing firebase Admin
  const firebaseRef = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(docId)
    .get();

  const downloadUrl = firebaseRef.data()?.downloadUrl;

  if (!downloadUrl) {
    throw new Error("Downloaded URL not found");
  }
  console.log(`--- Download URL fetched successfully:${downloadUrl}---`);

  try {
    console.log("--- Fetching PDF content...");
    const response = await fetch(downloadUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch PDF: ${response.status} ${response.statusText}`
      );
    }

    console.log("--- Converting response to Blob...");
    const blob = await response.blob();

    if (blob.size === 0) {
      throw new Error("Received empty PDF blob");
    }

    console.log(`--- PDF Blob size: ${blob.size} bytes ---`);

    // Create a File-like object with a name
    const file = new File([blob], "document.pdf", { type: "application/pdf" });

    console.log("--- Creating PDF loader...");
    const loader = new PDFLoader(file, {
      splitPages: true,
    });

    console.log("--- Loading PDF document...");
    const docs = await loader.load();
    console.log(`--- Loaded ${docs.length} pages ---`);

    if (docs.length === 0) {
      throw new Error("No pages found in the PDF");
    }

    // Configure the text splitter
    console.log("--- Splitting document into chunks...");
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const splitDocs = await splitter.splitDocuments(docs);
    console.log(`--- Split into ${splitDocs.length} chunks ---`);

    if (splitDocs.length === 0) {
      throw new Error("Failed to split document into chunks");
    }

    return splitDocs;
  } catch (error) {
    console.error("Error in generateDocs:", error);
    throw new Error(
      `Failed to process PDF: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

// helper function
async function nameSpaceExists(
  index: Index<RecordMetadata>,
  namespace: string
) {
  if (!namespace) throw new Error("No name space value provided");

  const { namespaces } = await index.describeIndexStats();
  return namespaces?.[namespace] !== undefined;
}

export async function generateEmbeddingsInPineconeVectorStore(
  docId: string,
  userId: string
) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  let pineconeVectorStore;

  // generating embedding (numerical representation) for the split document.
  console.log("---Generating Embedding for the split document...---");
  const embeddings = new OpenAIEmbeddings({
    modelName: "text-embedding-3-small", // This model can be configured to output 1024 dimensions
    dimensions: 1024, // Explicitly set to match Pinecone's free tier limit
  });

  // connecting to pinecone
  console.log("--- Initializing Pinecone client... ---");
  let index;
  let nameSpaceAlreadyExists = false;

  try {
    index = await pineconeClient.index(indexName);
    console.log("--- Successfully connected to Pinecone index ---");

    // Verify index exists
    const stats = await index.describeIndexStats();
    console.log("Pinecone index stats:", JSON.stringify(stats, null, 2));

    nameSpaceAlreadyExists = await nameSpaceExists(index, docId);
    console.log(`Namespace ${docId} already exists: ${nameSpaceAlreadyExists}`);
  } catch (error) {
    console.error("❌ Error initializing Pinecone client:", error);
    throw error;
  }

  if (nameSpaceAlreadyExists) {
    console.log(
      `---Namespace ${docId} already exists, reusing exsiting embeddings....----`
    );

    pineconeVectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      namespace: docId,
    });

    return pineconeVectorStore;
  } else {
    // if the namespace does not exists, download the pdf from firestore via the stored document URL then generate the embeddings and store them in the pinecone vector store

    const splitDocs = await generateDocs(docId, userId);

    console.log(`
        --- Storing the embeddings in namespace ${docId} in the ${indexName} Pinecone vector store...---
        `);

    try {
      console.log("--- Starting to store documents in Pinecone... ---");
      console.log(`- Document count: ${splitDocs.length}`);
      console.log(
        `- First document preview: ${JSON.stringify(
          splitDocs[0].pageContent.substring(0, 100)
        )}...`
      );

      pineconeVectorStore = await PineconeStore.fromDocuments(
        splitDocs,
        embeddings,
        {
          pineconeIndex: index,
          namespace: docId,
          maxConcurrency: 5, // Reduce concurrency for reliability
          onFailedAttempt: (error) => {
            console.error("❌ Pinecone storage attempt failed:", error);
          },
        }
      );

      console.log("--- Documents stored in Pinecone, verifying... ---");

      // Verify the vectors were stored
      await verifyPineconeStore(index, docId, splitDocs.length);
      return pineconeVectorStore;
    } catch (error) {
      console.error("❌ Error in Pinecone document storage:", error);
      if (error instanceof Error) {
        console.error("Error details:", {
          message: error.message,
          stack: error.stack,
          name: error.name,
        });
      }
      throw error;
    }
  }
}

// { ------------------------------------------------------------------------------------ ----------------------------
// ---------------------------- ---------------------------- ---------------------------- ---------------------------- ----------------------------  }

// generateLangchainCompletion
const generateLangchainCompletion = async (docId: string, question: string) => {
  let pineconeVectorStore;

  // Get userId for downstream functions
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User ID is required");
  }

  pineconeVectorStore = await generateEmbeddingsInPineconeVectorStore(docId, userId);
  if (!pineconeVectorStore) {
    throw new Error("Pinecone vector store not initialized");
  }
  // create a retriever tp search through the vector store
  console.log("--- Creating a retriever... ---");
  const retriever = pineconeVectorStore.asRetriever();

  //fetch the chat history from the database
  const chatHistory = await fetchMessagesFromDB(docId);

  // define a prompt template for generating search search queries based on conversation history
  console.log("---Defining a prompt template---");
  const historyAwarePrompt = ChatPromptTemplate.fromMessages([
    ...chatHistory, // insert the chat history here

    ["user", "{input}"],
    [
      "user",
      "Given the above conversation generate a search query to look up in order to get information relevent to the conversation",
    ],
  ]);

  // create a history aware retreiver chain that uses the model, retriever  and prompt
  console.log("---Creating a history aware retriever chain---");
  const historyAwareRetrieverChain = await createHistoryAwareRetriever({
    llm: model,
    retriever,
    rephrasePrompt: historyAwarePrompt,
  });

  // define a prompt template for answering questions based on retreived context
  console.log("---Defining a prompt template for answering questions---");
  const historyAwareRetrieverPrompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "Answer the users quetion based on the below context:\n\n{context}",
    ],
    ...chatHistory, //

    ["user", "{question}"],
  ]);

  // create a chain to combine the retrieved documents into a coherent response
  console.log("---Creating a chain to combine the retrieved documents---");
  const historyAwareCombineDocsChain = await createStuffDocumentsChain({
    llm: model,
    prompt: historyAwareRetrieverPrompt,
  });

  // create the main retriever chain that combines the history-aware retriever and document combining chains
  console.log("---Creating the main retriever chain---");
  const conversationalRetrievalChain = await createRetrievalChain({
    retriever: historyAwareRetrieverChain,
    combineDocsChain: historyAwareCombineDocsChain,
  });

  // sample conversation
  console.log("--- Running the chain with sample conversation... ---");
  const reply = await conversationalRetrievalChain.invoke({
    chat_history: chatHistory,
    input: question,
    question: question, // Ensure 'question' is provided for prompt variables
  });

  // print the result to the console
  console.log(reply.answer);
  return reply.answer;
 
};

export { model, generateLangchainCompletion }
