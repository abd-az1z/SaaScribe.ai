// actions/generateEmbeddings.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { generateEmbeddingsInPineconeVectorStore } from "@/lib/langChain";
import { revalidatePath } from "next/cache";

export async function generateEmbeddings(docId: string) {
  try {
    console.log(`[generateEmbeddings] Starting embeddings generation for docId: ${docId}`);
    
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User ID is required");
    }

    if (!docId) {
      throw new Error("Document ID is required");
    }

    // Generate and store embeddings
    console.log(`[generateEmbeddings] Generating embeddings for user ${userId}, doc ${docId}`);
    await generateEmbeddingsInPineconeVectorStore(docId);

    // Revalidate cache for updated file
    console.log(`[generateEmbeddings] Revalidating dashboard path`);
    revalidatePath("/dashboard");

    console.log(`[generateEmbeddings] Successfully completed for docId: ${docId}`);
    return { completed: true };
  } catch (error) {
    console.error(`[generateEmbeddings] Error for docId ${docId}:`, error);
    throw new Error(`Failed to generate embeddings: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}