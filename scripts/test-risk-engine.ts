import { analyzeRisk } from '../lib/risk-engine';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testRiskEngine() {
  try {
    console.log('🚀 Starting risk engine test...');
    
    const sampleText = `
    SERVICE AGREEMENT

    This Agreement includes an automatic renewal clause that will charge your account annually. 
    The liability is limited to the amount paid in the last 12 months.
    
    Additional terms include:
    - Binding arbitration for all disputes
    - Indemnification requirements
    - Termination for convenience with 30 days notice
    `;

    console.log('⚠️  Analyzing sample contract text...');
    const result = await analyzeRisk(sampleText);
    
    console.log('\n📊 Risk Assessment Results:');
    console.log(`Overall Score: ${result.score}/100`);
    console.log('Summary:', result.summary);
    
    console.log('\n🔍 Findings:');
    result.findings.forEach((finding, index) => {
      console.log(`\n${index + 1}. [${finding.severity.toUpperCase()}] ${finding.type}`);
      console.log(`   ${finding.description}`);
      if (finding.location) console.log(`   Location: ${finding.location}`);
    });
    
    console.log('\n✅ Risk engine test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:');
    console.error(error);
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  testRiskEngine();
}
