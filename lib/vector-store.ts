import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';

if (!process.env.PINECONE_API_KEY) {
    throw new Error('PINECONE_API_KEY is not defined');
}

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
});

const indexName = process.env.PINECONE_INDEX || 'saascribe-v2';

export async function getVectorStore() {
    const index = pinecone.Index(indexName);

    return PineconeStore.fromExistingIndex(
        new OpenAIEmbeddings({
            modelName: 'text-embedding-3-small',
        }),
        { pineconeIndex: index }
    );
}

export { pinecone };
