import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';

// Rule-based checks (simple keyword matching for now, can be expanded)
const RISKY_KEYWORDS = [
    'indemnification',
    'limitation of liability',
    'automatic renewal',
    'termination for convenience',
    'arbitration',
    'exclusivity',
];

export interface RiskFinding {
    type: 'missing_clause' | 'risky_clause' | 'general_risk';
    description: string;
    severity: 'low' | 'medium' | 'high';
    location?: string;
}

export interface RiskAssessment {
    score: number;
    summary: string;
    findings: RiskFinding[];
}

export async function analyzeRisk(text: string): Promise<RiskAssessment> {
    const findings: RiskFinding[] = [];
    let riskScore = 100; // Start with perfect score, deduct for risks

    // 1. Rule-based checks
    const lowerText = text.toLowerCase();
    for (const keyword of RISKY_KEYWORDS) {
        if (lowerText.includes(keyword)) {
            findings.push({
                type: 'risky_clause',
                description: `Contains potential risk: ${keyword}`,
                severity: 'medium',
            });
            riskScore -= 5;
        }
    }

    // 2. LLM Analysis
    const llm = new ChatOpenAI({
        modelName: 'gpt-4o', // Use a capable model
        temperature: 0,
    });

    const prompt = PromptTemplate.fromTemplate(`
    Analyze the following contract text for potential risks, missing standard clauses, and unfair terms.
    Focus on obligations, dates, and liabilities.
    
    Contract Text (truncated):
    {text}
    
    Provide a summary of the risks and a list of specific findings.
    Format the output as JSON with keys: "summary" (string), "findings" (array of objects with "type", "description", "severity").
    "severity" should be "low", "medium", or "high".
    "type" should be "missing_clause", "risky_clause", or "general_risk".
    Do not include markdown formatting in the JSON.
  `);

    const chain = RunnableSequence.from([
        prompt,
        llm,
        new StringOutputParser(),
    ]);

    // Truncate text to avoid token limits if necessary (simple truncation for now)
    const truncatedText = text.slice(0, 15000);

    try {
        const result = await chain.invoke({ text: truncatedText });
        // Parse JSON from LLM response (handling potential markdown code blocks)
        const cleanResult = result.replace(/```json/g, '').replace(/```/g, '').trim();
        const llmAnalysis = JSON.parse(cleanResult);

        if (llmAnalysis.findings) {
            findings.push(...llmAnalysis.findings);

            // Adjust score based on LLM findings
            for (const finding of llmAnalysis.findings) {
                if (finding.severity === 'high') riskScore -= 15;
                if (finding.severity === 'medium') riskScore -= 5;
                if (finding.severity === 'low') riskScore -= 2;
            }
        }

        return {
            score: Math.max(0, riskScore),
            summary: llmAnalysis.summary || 'Analysis complete.',
            findings,
        };

    } catch (error) {
        console.error('Error in LLM analysis:', error);
        return {
            score: riskScore,
            summary: 'Automated analysis failed, showing rule-based results only.',
            findings,
        };
    }
}
