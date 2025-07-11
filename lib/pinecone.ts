import { Pinecone } from "@pinecone-database/pinecone";

// Helper function to initialize Pinecone client
const initializePinecone = () => {
  if (!process.env.PINECONE_API_KEY) {
    throw new Error("PINECONE_API_KEY is not set");
  }

  try {
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
    
    return pinecone;
  } catch (error) {
    console.error('Error initializing Pinecone client:', error);
    throw new Error('Failed to initialize Pinecone client');
  }
};

// Initialize Pinecone client
export const pineconeClient = initializePinecone();

export default pineconeClient;