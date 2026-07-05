import pdf from 'pdf-parse';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { Document } from '@langchain/core/documents';

export async function parsePDF(buffer: Buffer): Promise<{ text: string; pageCount: number }> {
    const data = await pdf(buffer);
    return {
        text: data.text,
        pageCount: data.numpages,
    };
}

export async function chunkText(text: string, metadata: Record<string, any>): Promise<Document[]> {
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });

    const docs = await splitter.createDocuments([text], [metadata]);
    return docs;
}
