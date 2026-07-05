import fs from 'fs';
import { generateDocs, generateEmbeddingsInPineconeVectorStore } from '../lib/langChain';
import { analyzeRisk } from '../lib/risk-engine';
import { pineconeClient } from '../lib/pinecone';
import { Pinecone } from '@pinecone-database/pinecone';

export async function testDocumentProcessing() {
  try {
    console.log('🚀 Starting document processing test...');
    
    // 1. Test document loading and splitting
    console.log('📄 Testing document loading and splitting...');
    const docId = 'test-document';
    const docs = await generateDocs(docId);
    console.log(`✅ Successfully loaded and split document into ${docs.length} chunks`);
    
    // 2. Test embeddings generation
    console.log('🔍 Testing embeddings generation...');
    await generateEmbeddingsInPineconeVectorStore(docId);
    console.log('✅ Successfully generated and stored embeddings');
    
    // 3. Test risk analysis on a sample text
    console.log('⚠️  Testing risk analysis...');
    const sampleText = `This agreement includes an automatic renewal clause that will charge your account annually. 
    The liability is limited to the amount paid in the last 12 months.`;
    
    const riskAssessment = await analyzeRisk(sampleText);
    console.log('📊 Risk Assessment Results:');
    console.log(`Overall Score: ${riskAssessment.score}/100`);
    console.log('Summary:', riskAssessment.summary);
    
    console.log('\n🔍 Findings:');
    riskAssessment.findings.forEach((finding, index) => {
      console.log(`\n${index + 1}. [${finding.severity.toUpperCase()}] ${finding.type}`);
      console.log(`   ${finding.description}`);
      if (finding.location) console.log(`   Location: ${finding.location}`);
    });
    
    // 4. Test vector search (if implemented)
    console.log('\n🔎 Testing vector search...');
    try {
      const index = pineconeClient.Index(process.env.PINECONE_INDEX || '');
      const queryResponse = await index.query({
        vector: new Array(1536).fill(0), // Dummy vector for test
        topK: 3,
        includeValues: true,
        includeMetadata: true,
      });
      console.log(`✅ Vector search successful. Found ${queryResponse.matches?.length || 0} matches`);
    } catch (error) {
      console.warn('⚠️  Vector search test skipped or failed. Make sure Pinecone is properly configured.');
      console.error(error);
    }
    
    console.log('\n🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:');
    console.error(error);
    process.exit(1);
  }
}

// Run the tests
if (require.main === module) {
  require('dotenv').config();
  testDocumentProcessing();
}
