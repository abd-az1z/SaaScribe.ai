import { Pinecone } from "@pinecone-database/pinecone";

// Initialize Pinecone client
let pineconeClient: {
  client: Pinecone;
  index: ReturnType<Pinecone['Index']>;
} | null = null;

export const initializePinecone = async () => {
  if (pineconeClient) {
    return pineconeClient;
  }

  const pineconeApiKey = process.env.PINECONE_API_KEY;
  const pineconeIndexName = process.env.PINECONE_INDEX_NAME;

  if (!pineconeApiKey) {
    throw new Error("PINECONE_API_KEY is not set in environment variables");
  }

  if (!pineconeIndexName) {
    throw new Error("PINECONE_INDEX_NAME is not set in environment variables");
  }

  try {
    const client = new Pinecone({
      apiKey: pineconeApiKey,
    });

    const index = client.Index(pineconeIndexName);
    
    pineconeClient = {
      client,
      index
    };

    return pineconeClient;
  } catch (error) {
    console.error('Error initializing Pinecone client:', error);
    throw new Error(`Failed to initialize Pinecone client: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Initialize Pinecone client when this module is imported
initializePinecone().catch(error => {
  console.error('Failed to initialize Pinecone client:', error);
});

export { pineconeClient };