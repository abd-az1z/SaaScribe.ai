// actions/generateEmbeddings.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { generateEmbeddingsInPineconeVectorStore } from "@/lib/langChain";
import { revalidatePath } from "next/cache";

export async function generateEmbeddings(docId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User ID is required");
  }

  // Generate and store embeddings
  await generateEmbeddingsInPineconeVectorStore(docId);

  // Revalidate cache for updated file
  revalidatePath("/dashboard");

  return { completed: true };
}