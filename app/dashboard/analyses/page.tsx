'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Clock, ArrowRight, Search, Sparkles, Filter, Loader2, Zap, Target } from 'lucide-react';
import { getAnalyses } from '../actions';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Job {
    id: string;
    title: string;
    company: string;
    date: string;
    score: number;
    status: string;
}

export default function AnalysesPage() {
    const t = useTranslations('analyses');
    const [analyses, setAnalyses] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All Status');
    const [search, setSearch] = useState('');

    useEffect(() => {
        async function loadAnalyses() {
            try {
                const data = await getAnalyses();
                setAnalyses(data);
            } catch (error) {
                console.error('Failed to load analyses:', error);
            } finally {
                setLoading(false);
            }
        }
        loadAnalyses();
    }, []);

    const filteredAnalyses = analyses.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'All Status' ||
            (filter === 'Complete' && job.status === 'complete') ||
            (filter === 'Processing' && job.status !== 'complete');
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-indigo-500 mb-4" />
                <p className="text-gray-400 font-medium">Synchronizing Intelligence...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight">AI Analysis Archive</h1>
                        <p className="text-gray-400 mt-1">Review your matches and tailored career strategies.</p>
                    </div>
                </div>
                <Link href="/dashboard">
                    <Button className="h-12 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black rounded-xl shadow-xl shadow-indigo-600/20 border-0 transition-all hover:scale-[1.02] active:scale-[0.98]">
                        <Zap className="w-4 h-4 mr-2 fill-current" />
                        New Analysis
                    </Button>
                </Link>
            </div>

            {/* Quick Stats Grid can be added here if needed */}

            {/* Search & Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                        type="text"
                        placeholder={t('searchPlaceholder')}
                        className="w-full bg-slate-900/40 border-white/5 pl-12 h-12 rounded-xl text-white placeholder:text-gray-500 focus:ring-indigo-500/50"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-4">
                    <div className="relative min-w-[160px]">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                        <select
                            className="w-full bg-slate-900/40 border-white/5 pl-12 pr-4 h-12 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="All Status">{t('filterAll')}</option>
                            <option value="Complete">{t('filterComplete')}</option>
                            <option value="Processing">{t('filterProcessing')}</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            {filteredAnalyses.length === 0 ? (
                <Card className="bg-slate-900/40 backdrop-blur-md border-white/5 p-16 text-center shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                        <Target className="h-64 w-64 text-indigo-400" />
                    </div>
                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-indigo-500/10">
                            <Sparkles className="h-10 w-10 text-indigo-400" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-2">{t('emptyTitle')}</h3>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto">{t('emptyDesc')}</p>
                        <Link href="/dashboard">
                            <Button className="h-14 px-8 bg-white/5 hover:bg-white/10 text-white font-bold border border-white/10 rounded-2xl transition-all">
                                {t('createFirst')}
                            </Button>
                        </Link>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAnalyses.map((job) => (
                        <Link key={job.id} href={`/dashboard/analysis/${job.id}`}>
                            <Card className="group bg-slate-900/40 backdrop-blur-md border-white/5 hover:border-indigo-500/30 transition-all duration-300 overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-indigo-500/10 active:scale-[0.98]">
                                <CardHeader className="p-6 pb-0">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2.5 bg-indigo-500/10 rounded-xl group-hover:bg-indigo-500/20 transition-colors">
                                            <FileText className="w-5 h-5 text-indigo-400" />
                                        </div>
                                        {job.status === 'complete' ? (
                                            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-bold px-2.5 py-1">
                                                {t('status.complete')}
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 font-bold px-2.5 py-1 animate-pulse">
                                                {t('status.processing')}
                                            </Badge>
                                        )}
                                    </div>
                                    <CardTitle className="text-lg font-black text-white line-clamp-1 group-hover:text-indigo-400 transition-colors">
                                        {job.title}
                                    </CardTitle>
                                    <CardDescription className="text-gray-500 font-medium">
                                        {job.company}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                        <div className="flex items-center text-xs text-gray-400 font-bold">
                                            <Clock className="w-3.5 h-3.5 mr-2 text-indigo-500/60" />
                                            {job.date}
                                        </div>
                                        {job.status === 'complete' && (
                                            <div className="flex items-center gap-2">
                                                <div className="h-1.5 w-12 rounded-full bg-white/5 overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${job.score >= 80 ? 'bg-emerald-500' : job.score >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                                        style={{ width: `${job.score}%` }}
                                                    />
                                                </div>
                                                <span className={`text-sm font-black ${job.score >= 80 ? 'text-emerald-400' : job.score >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                                                    {job.score}%
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-4 flex items-center justify-end">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                            Review Analysis <ArrowRight className="inline-block w-3 h-3 ml-1" />
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
