export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { documents, riskAssessments } from '@/lib/schema';
import { parsePDF } from '@/lib/pdf-service';
import { analyzeRisk } from '@/lib/risk-engine';

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        if (file.type !== 'application/pdf') {
            return NextResponse.json({ error: 'Only PDF files are supported' }, { status: 400 });
        }

        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ error: 'File must be under 10 MB' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const { text, pageCount } = await parsePDF(buffer);

        const [doc] = await db.insert(documents).values({
            userId,
            fileName: file.name,
            // Risk Lens does not persist to cloud storage — analysis is done in-request
            fileUrl: `risk-lens://${userId}/${file.name}`,
            pageCount,
            content: text,
        }).returning();

        const analysis = await analyzeRisk(text);

        const [assessment] = await db.insert(riskAssessments).values({
            documentId: doc.id,
            overallScore: analysis.score,
            summary: analysis.summary,
            findings: analysis.findings,
        }).returning();

        return NextResponse.json({ document: doc, assessment });

    } catch (error) {
        console.error('Error processing Risk Lens upload:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
