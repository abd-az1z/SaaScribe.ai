// actions/generateEmbeddings.ts
"use server";

import { generateEmbeddingsInPineconeVectorStore } from "@/lib/langChain";
import { revalidatePath } from "next/cache";

export async function generateEmbeddings(docId: string, userId: string) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  // Generate and store embeddings
  await generateEmbeddingsInPineconeVectorStore(docId, userId);

  // Revalidate cache for updated file
  revalidatePath("/dashboard");

  return { completed: true };
}