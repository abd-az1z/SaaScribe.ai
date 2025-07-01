"use server";

import { Message } from "@/components/ChatWithPdf";
import { adminDb } from "@/firebase/firebaseAdmin";
import { generateLangchainCompletion } from "@/lib/langChain";
import { auth } from "@clerk/nextjs/server";

const FREE_PLAN_LIMIT = 3;
const PRO_PLAN_LIMIT = 100;

export async function askQuestion(id: string, question: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User ID is required");
  }

  const chatRef = adminDb
    .collection("users")
    .doc(userId)
    .collection("chats")
    .doc(id)
    .collection("chat");

  // check how many message are in chat
  const chatSnapshot = await chatRef.get();
  const userMessagesCount = chatSnapshot.docs.filter(
    (doc) => doc.data().role === "human"
  );

  //   limiting the pro of free users
  const userMessage: Message = {
    role: "human",
    message: question,
    createdAt: new Date(),
  };
  await chatRef.add(userMessage);

  // generate the ai response for the question
  const reply = await generateLangchainCompletion(id, question);

  const aiMessage: Message = {
    role: "ai",
    message: reply,
    createdAt: new Date(),
  };
  await chatRef.add(aiMessage);

  return { success: true, message: reply };
}
