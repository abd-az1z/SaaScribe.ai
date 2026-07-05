import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';

// Lazy singleton so importing this module never requires PINECONE_API_KEY at
// build time — the client is only built on first use at request time.
let _pinecone: Pinecone | undefined;
function getPinecone(): Pinecone {
    if (!_pinecone) {
        if (!process.env.PINECONE_API_KEY) {
            throw new Error('PINECONE_API_KEY is not defined');
        }
        _pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
    }
    return _pinecone;
}

const indexName = process.env.PINECONE_INDEX || 'saascribe-v2';

export async function getVectorStore() {
    const index = getPinecone().Index(indexName);

    return PineconeStore.fromExistingIndex(
        new OpenAIEmbeddings({
            modelName: 'text-embedding-3-small',
        }),
        { pineconeIndex: index }
    );
}

