'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, ArrowRight, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
    const router = useRouter();
    const [jobText, setJobText] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!jobText.trim()) return;

        setIsAnalyzing(true);

        // Simulate API call
        try {
            const res = await fetch('/api/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: jobText }),
            });

            if (res.ok) {
                const data = await res.json();
                // In a real app, we'd redirect to the new job ID
                // For demo, we'll redirect to a mock ID or the one returned
                router.push(`/dashboard/analysis/${data.id}`);
            }
        } catch (error) {
            console.error('Analysis failed', error);
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Welcome back, John</h1>
                <p className="text-slate-600">Ready to land your next role?</p>
            </div>

            {/* New Analysis Widget */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-slate-900">New Job Analysis</h2>
                <form onSubmit={handleAnalyze}>
                    <div className="mb-4">
                        <textarea
                            className="w-full rounded-lg border border-slate-300 p-4 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                            rows={6}
                            placeholder="Paste the job description here..."
                            value={jobText}
                            onChange={(e) => setJobText(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                                <Upload className="h-4 w-4" /> Auto-detect category
                            </span>
                        </div>
                        <button
                            type="submit"
                            disabled={isAnalyzing || !jobText}
                            className="inline-flex items-center rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50 transition-colors"
                        >
                            {isAnalyzing ? 'Analyzing...' : 'Analyze Job'}
                            {!isAnalyzing && <ArrowRight className="ml-2 h-4 w-4" />}
                        </button>
                    </div>
                </form>
            </div>

            {/* Recent Analyses */}
            <div>
                <h2 className="mb-4 text-lg font-semibold text-slate-900">Recent Analyses</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[
                        { title: 'Senior Frontend Developer', company: 'TechCorp', date: '2h ago', score: 85, status: 'complete' },
                        { title: 'Product Manager', company: 'StartupInc', date: '1d ago', score: 60, status: 'complete' },
                        { title: 'Backend Engineer', company: 'CloudSys', date: '2d ago', score: 0, status: 'processing' },
                    ].map((job, i) => (
                        <div key={i} className="group cursor-pointer rounded-lg border border-slate-200 bg-white p-4 hover:border-teal-500 hover:shadow-md transition-all" onClick={() => router.push(`/dashboard/analysis/job_123`)}>
                            <div className="mb-2 flex items-start justify-between">
                                <div className="rounded bg-slate-100 p-2 group-hover:bg-teal-50">
                                    <Clock className="h-5 w-5 text-slate-500 group-hover:text-teal-600" />
                                </div>
                                {job.status === 'complete' ? (
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${job.score >= 80 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {job.score}% Match
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                        Processing
                                    </span>
                                )}
                            </div>
                            <h3 className="font-medium text-slate-900 truncate">{job.title}</h3>
                            <p className="text-sm text-slate-500">{job.company} • {job.date}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
