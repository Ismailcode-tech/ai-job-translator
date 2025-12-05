'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Upload, ArrowRight, Clock, CheckCircle, AlertCircle, Sparkles, FileText } from 'lucide-react';
import { getDashboardData } from './actions';

interface DashboardData {
    user: {
        name: string;
        email?: string;
    };
    stats?: {
        totalAnalyses: number;
        averageScore: number;
    };
    recentJobs: {
        id: string;
        title: string;
        company: string;
        date: string;
        score: number;
        status: string;
    }[];
}

export default function DashboardPage() {
    const router = useRouter();
    const [jobText, setJobText] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const dashboardData = await getDashboardData();
                if (dashboardData) {
                    setData(dashboardData);
                }
            } catch (error) {
                console.error('Failed to load dashboard data:', error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!jobText.trim()) return;

        setIsAnalyzing(true);

        try {
            const res = await fetch('/api/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: jobText }),
            });

            if (res.ok) {
                const data = await res.json();
                router.push(`/dashboard/analysis/${data.id}`);
            }
        } catch (error) {
            console.error('Analysis failed', error);
            setIsAnalyzing(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Loading dashboard...</div>;
    }

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 md:p-12 text-white shadow-2xl">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

                <div className="relative z-10">
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">
                        Welcome back, {data?.user.name}
                    </h1>
                    <p className="text-indigo-100 text-lg max-w-xl">
                        Ready to land your next role? Paste a job description below to get started with your AI-powered analysis.
                    </p>
                </div>
            </div>

            {/* New Analysis Widget */}
            <div className="relative rounded-2xl border border-border bg-card p-1 shadow-sm">
                <div className="rounded-xl bg-background p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <h2 className="text-xl font-semibold text-foreground">New Job Analysis</h2>
                    </div>

                    <form onSubmit={handleAnalyze}>
                        <div className="mb-4 relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                            <textarea
                                className="relative w-full rounded-xl border border-input bg-background p-4 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none transition-all"
                                rows={6}
                                placeholder="Paste the job description here (e.g. from LinkedIn, Indeed)..."
                                value={jobText}
                                onChange={(e) => setJobText(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/50 border border-border">
                                    <Upload className="h-3.5 w-3.5" /> Auto-detect category
                                </span>
                            </div>
                            <button
                                type="submit"
                                disabled={isAnalyzing || !jobText}
                                className="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-3 text-sm font-medium text-white shadow-lg shadow-primary/25 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 transition-all duration-200"
                            >
                                {isAnalyzing ? (
                                    <>
                                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        Analyze Job <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Recent Analyses */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-foreground">Recent Analyses</h2>
                    <Link href="/dashboard/analyses" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                        View all
                    </Link>
                </div>

                {data?.recentJobs && data.recentJobs.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {data.recentJobs.map((job) => (
                            <div key={job.id} className="group cursor-pointer relative overflow-hidden rounded-2xl border border-border bg-card p-5 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300" onClick={() => router.push(`/dashboard/analysis/${job.id}`)}>
                                <div className="mb-4 flex items-start justify-between">
                                    <div className="rounded-xl bg-muted p-2.5 group-hover:bg-primary/10 transition-colors">
                                        <Clock className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </div>
                                    {job.status === 'complete' ? (
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${job.score >= 80 ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'}`}>
                                            {job.score}% Match
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-600 border border-blue-500/20">
                                            Processing
                                        </span>
                                    )}
                                </div>
                                <h3 className="font-semibold text-foreground truncate mb-1">{job.title}</h3>
                                <p className="text-sm text-muted-foreground">{job.date}</p>

                                <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-12 text-center">
                        <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                            <FileText className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium text-foreground mb-1">No analyses yet</h3>
                        <p className="text-muted-foreground">Paste a job description above to create your first analysis.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
