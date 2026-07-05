'use client';

import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

interface RiskFinding {
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
}

interface RiskDashboardProps {
    assessment: {
        overallScore: number;
        summary: string;
        findings: RiskFinding[];
    };
    document: {
        fileName: string;
        pageCount: number;
    };
}

export function RiskDashboard({ assessment, document }: RiskDashboardProps) {
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 50) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'high': return <AlertCircle className="h-5 w-5 text-red-500" />;
            case 'medium': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
            case 'low': return <AlertTriangle className="h-5 w-5 text-blue-500" />;
            default: return <CheckCircle className="h-5 w-5 text-green-500" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500">Risk Score</h3>
                    <p className={`text-3xl font-bold mt-2 ${getScoreColor(assessment.overallScore)}`}>
                        {assessment.overallScore}/100
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500">Document</h3>
                    <p className="text-lg font-semibold mt-2 truncate">{document.fileName}</p>
                    <p className="text-sm text-gray-500">{document.pageCount} pages</p>
                </div>
                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500">Issues Found</h3>
                    <p className="text-3xl font-bold mt-2 text-gray-900">
                        {assessment.findings.length}
                    </p>
                </div>
            </div>

            {/* Summary */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h3 className="text-lg font-semibold mb-3">Executive Summary</h3>
                <p className="text-gray-700 leading-relaxed">{assessment.summary}</p>
            </div>

            {/* Findings List */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Detailed Findings</h3>
                <div className="space-y-4">
                    {assessment.findings.map((finding, index) => (
                        <div key={index} className="flex gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100">
                            <div className="flex-shrink-0 mt-1">
                                {getSeverityIcon(finding.severity)}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full uppercase
                    ${finding.severity === 'high' ? 'bg-red-100 text-red-700' :
                                            finding.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-blue-100 text-blue-700'}`}>
                                        {finding.severity}
                                    </span>
                                    <span className="text-sm font-medium text-gray-900 capitalize">
                                        {finding.type.replace('_', ' ')}
                                    </span>
                                </div>
                                <p className="mt-1 text-gray-600">{finding.description}</p>
                            </div>
                        </div>
                    ))}
                    {assessment.findings.length === 0 && (
                        <p className="text-gray-500 text-center py-4">No significant risks found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
