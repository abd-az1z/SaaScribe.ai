'use client';

import { useState } from 'react';
import { UploadZone } from '@/components/upload-zone';
import { RiskDashboard } from '@/components/risk-dashboard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function RiskLensPage() {
    const [analysisResult, setAnalysisResult] = useState<any>(null);

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-[#f0f9ff] to-[#e0f2fe] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Contract Risk Lens</h1>
                            <p className="text-gray-500 mt-1">AI-powered contract analysis and risk scoring</p>
                        </div>
                    </div>
                    {analysisResult && (
                        <Button onClick={() => setAnalysisResult(null)} variant="outline">
                            Analyze Another
                        </Button>
                    )}
                </div>

                <div className="mt-8">
                    {!analysisResult ? (
                        <div className="max-w-2xl mx-auto">
                            <UploadZone onUploadComplete={setAnalysisResult} />

                            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                                <div className="p-4">
                                    <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl">🔍</span>
                                    </div>
                                    <h3 className="font-semibold text-gray-900">Deep Analysis</h3>
                                    <p className="text-sm text-gray-500 mt-2">Extracts obligations and hidden risks from long documents.</p>
                                </div>
                                <div className="p-4">
                                    <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl">🛡️</span>
                                    </div>
                                    <h3 className="font-semibold text-gray-900">Risk Scoring</h3>
                                    <p className="text-sm text-gray-500 mt-2">Get a quantified risk score based on legal best practices.</p>
                                </div>
                                <div className="p-4">
                                    <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl">⚡</span>
                                    </div>
                                    <h3 className="font-semibold text-gray-900">Instant Results</h3>
                                    <p className="text-sm text-gray-500 mt-2">Reduce review time from 45 mins to minutes.</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <RiskDashboard
                            assessment={analysisResult.assessment}
                            document={analysisResult.document}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
