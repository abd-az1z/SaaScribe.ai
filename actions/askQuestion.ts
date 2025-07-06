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

  // 
  const userRef = await adminDb.collection("users").doc(userId).get();

  // Check user's plan and apply appropriate limits
  const hasActiveMembership = userRef.data()?.hasActiveMembership;
  
  if (!hasActiveMembership && userMessagesCount.length >= FREE_PLAN_LIMIT) {
    return {
      success: false,
      message: `You've reached the free plan limit of ${FREE_PLAN_LIMIT} questions per document. Upgrade to PRO to ask more questions!`
    };
  }

  if (hasActiveMembership && userMessagesCount.length >= PRO_PLAN_LIMIT) {
    return {
      success: false,
      message: `You have reached the PRO plan limit of ${PRO_PLAN_LIMIT} questions per document!`
    };
  }





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
