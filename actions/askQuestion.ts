"use server";

import { Message } from "@/components/ChatWithPdf";
import { adminDb } from "@/firebase/firebaseAdmin";
import { generateLangchainCompletion } from "@/lib/langChain";
import { auth } from "@clerk/nextjs/server";

const FREE_PLAN_LIMIT = 3;
const PRO_PLAN_LIMIT = 100;

export async function askQuestion(id: string, question: string) {
  console.log("[askQuestion] Starting with id:", id, "question:", question);

  const { userId } = await auth();
  if (!userId) {
    console.error("[askQuestion] No userId found");
    throw new Error("User ID is required");
  }
  console.log("[askQuestion] userId:", userId);

  // Use "files" path to match ChatWithPdf component
  const chatRef = adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(id)
    .collection("chat");

  console.log("[askQuestion] Chat ref path:", `users/${userId}/files/${id}/chat`);

  // Check user's subscription FIRST (before processing)
  // Try new structure first, fall back to old structure
  let hasActiveMembership = false;

  const subscriptionRef = await adminDb
    .collection("users")
    .doc(userId)
    .collection("subscription")
    .doc("details")
    .get();

  if (subscriptionRef.exists) {
    const subscriptionData = subscriptionRef.data();
    hasActiveMembership = subscriptionData?.plan === "pro";
    console.log("[askQuestion] User plan (new structure):", subscriptionData?.plan);
  } else {
    // Fallback to old structure on main user document
    const userRef = await adminDb.collection("users").doc(userId).get();
    hasActiveMembership = userRef.data()?.hasActiveMembership === true;
    console.log("[askQuestion] User plan (old structure):", userRef.data()?.hasActiveMembership);
  }

  console.log("[askQuestion] hasActiveMembership:", hasActiveMembership);

  // Check how many messages are in chat
  const chatSnapshot = await chatRef.get();
  const userMessagesCount = chatSnapshot.docs.filter(
    (doc) => doc.data().role === "human"
  ).length;

  console.log("[askQuestion] Current user messages count:", userMessagesCount);

  // Check limits BEFORE processing the question
  if (!hasActiveMembership && userMessagesCount >= FREE_PLAN_LIMIT) {
    console.log("[askQuestion] Free plan limit reached");
    return {
      success: false,
      message: `You've reached the free plan limit of ${FREE_PLAN_LIMIT} questions per document. Upgrade to PRO to ask more questions!`
    };
  }

  if (hasActiveMembership && userMessagesCount >= PRO_PLAN_LIMIT) {
    console.log("[askQuestion] Pro plan limit reached");
    return {
      success: false,
      message: `You have reached the PRO plan limit of ${PRO_PLAN_LIMIT} questions per document!`
    };
  }

  // Now add the user message
  const userMessage: Message = {
    role: "human",
    message: question,
    createdAt: new Date(),
  };

  console.log("[askQuestion] Adding user message to Firestore");
  await chatRef.add(userMessage);
  console.log("[askQuestion] User message added successfully");

  // Generate the AI response
  console.log("[askQuestion] Calling generateLangchainCompletion");
  const reply = await generateLangchainCompletion(id, question);
  console.log("[askQuestion] Got reply:", reply);

  const aiMessage: Message = {
    role: "ai",
    message: reply,
    createdAt: new Date(),
  };

  await chatRef.add(aiMessage);

  return { success: true, message: reply };
}
