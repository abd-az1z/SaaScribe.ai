import { analyzeRisk } from '../lib/risk-engine';
import { parsePDF } from '../lib/pdf-service';
import fs from 'fs';
import path from 'path';

// Mock PDF buffer (since we can't easily create a real PDF in this script without more deps)
// We'll just test the text analysis part directly for now, and mock the PDF parse result.

async function verifyRiskEngine() {
    console.log('Starting verification...');

    // 1. Test Risk Engine with sample text
    const sampleContract = `
    This Agreement shall automatically renew for successive one-year terms.
    Provider shall indemnify Customer against all claims.
    Liability is limited to the amount paid in the last 12 months.
    Any dispute shall be resolved by binding arbitration.
  `;

    console.log('\nAnalyzing sample contract text...');
    const analysis = await analyzeRisk(sampleContract);

    console.log('Risk Score:', analysis.score);
    console.log('Findings:', JSON.stringify(analysis.findings, null, 2));

    if (analysis.score < 100 && analysis.findings.length > 0) {
        console.log('✅ Risk engine correctly identified risks.');
    } else {
        console.error('❌ Risk engine failed to identify obvious risks.');
    }

    // 2. Test PDF Service (Mock)
    // Since we don't have a real PDF file handy, we'll verify the function exists and imports work.
    if (typeof parsePDF === 'function') {
        console.log('✅ PDF Service imported successfully.');
    }

    console.log('\nVerification complete.');
}

verifyRiskEngine().catch(console.error);
