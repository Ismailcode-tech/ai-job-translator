'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    CheckCircle, AlertTriangle, BookOpen, Copy, Download, Share2,
    FileText, ArrowLeft, Briefcase, Calendar, Check, ExternalLink,
    Sparkles, Zap, Target, Award, Rocket, ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { AnalysisReportPDF } from '@/components/pdf/AnalysisReportPDF';
import { TailoredCVPDF } from '@/components/pdf/TailoredCVPDF';
import PDFDownloadWrapper from '@/components/pdf/PDFDownloadWrapper';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// Define types for our data
interface Skill {
    name: string;
    must: boolean;
    priority: number;
    explanation: string;
    confidence: number;
}

interface Gap {
    skill: string;
    reason: string;
    recommended_days: number;
}

interface RoadmapTask {
    day: number;
    task: string;
}

interface AnalysisData {
    id: string;
    title: string;
    match_score: number;
    skills: Skill[];
    gaps: Gap[];
    roadmap: Record<string, RoadmapTask[]>;
    cv_suggestions: string[];
    category?: string;
}

export default function AnalysisPage() {
    const t = useTranslations('analysis');
    const tPdf = useTranslations('pdf');
    const params = useParams();
    const router = useRouter();
    const [data, setData] = useState<AnalysisData | null>(null);
    const [loading, setLoading] = useState(true);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    useEffect(() => {
        // Fetch data
        fetch(`/api/jobs/${params.id}`)
            .then(res => res.json())
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [params.id]);

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleShareReport = async () => {
        if (!data) return;

        const shareData = {
            title: `${t('shareTitle')}: ${data.title}`,
            text: t('shareText', { title: data.title, score: data.match_score }),
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            // Simple feedback via alert since toast might be tricky
            alert(t('clipboard'));
        }
    };

    if (loading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
            <Zap className="h-12 w-12 animate-pulse text-indigo-500 mb-4" />
            <p className="text-gray-400 font-medium">Synthesizing Market Intelligence...</p>
        </div>
    );

    if (!data) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
            <div className="rounded-2xl bg-rose-500/10 p-6 mb-6 border border-rose-500/20">
                <AlertTriangle className="h-10 w-10 text-rose-500" />
            </div>
            <h2 className="text-2xl font-black text-white">{t('notFound')}</h2>
            <p className="mt-2 text-gray-400 max-w-md mx-auto">{t('notFoundDesc')}</p>
            <Button
                variant="ghost"
                onClick={() => router.push('/dashboard')}
                className="mt-8 text-indigo-400 hover:text-white hover:bg-white/5 font-bold"
            >
                <ArrowLeft className="mr-2 h-4 w-4" /> {t('return')}
            </Button>
        </div>
    );

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-in fade-in duration-500">
            {/* Navigation & Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push('/dashboard/analyses')}
                        className="h-10 w-10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-black text-white tracking-tight">{data.title}</h1>
                            <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 font-black uppercase tracking-widest text-[10px]">
                                {data.category || t('general')}
                            </Badge>
                        </div>
                        <p className="text-gray-400 mt-1">{t('subtitle')}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <PDFDownloadWrapper
                        document={<AnalysisReportPDF data={{
                            ...data,
                            translations: {
                                title: tPdf('report.title'),
                                subtitle: tPdf('report.subtitle'),
                                matchScore: tPdf('report.matchScore'),
                                matchScoreDesc: tPdf('report.matchScoreDesc'),
                                requiredSkills: tPdf('report.requiredSkills'),
                                mustHave: tPdf('report.mustHave'),
                                skillGaps: tPdf('report.skillGaps'),
                                estTime: tPdf('report.estTime'),
                                days: tPdf('report.days'),
                                noGaps: tPdf('report.noGaps'),
                                roadmap: tPdf('report.roadmap')
                            }
                        }} />}
                        fileName={`Analysis-${data.id.slice(0, 8)}.pdf`}
                        className="inline-flex items-center justify-center rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm font-bold text-gray-300 hover:bg-white/10 hover:text-white transition-all h-11"
                    >
                        <Download className="mr-2 h-4 w-4" /> {t('saveAsPDF')}
                    </PDFDownloadWrapper>

                    <Button
                        variant="ghost"
                        onClick={handleShareReport}
                        className="h-11 px-4 bg-white/5 border border-white/10 text-gray-300 hover:text-white rounded-xl"
                    >
                        <Share2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Core Intelligence Hero */}
            <Card className="bg-slate-900/40 backdrop-blur-md border-white/5 overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                    <Award className="h-64 w-64 text-indigo-400" />
                </div>
                <CardContent className="p-8 md:p-12 relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        {/* Match Score Ring */}
                        <div className="flex flex-col items-center">
                            <div className="relative h-48 w-48">
                                <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="45" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="transparent" />
                                    <circle
                                        cx="50" cy="50" r="45"
                                        stroke="url(#gradient-score)"
                                        strokeWidth="8"
                                        strokeDasharray={282.7}
                                        strokeDashoffset={282.7 - (data.match_score / 100) * 282.7}
                                        strokeLinecap="round"
                                        fill="transparent"
                                        className="transition-all duration-1000 ease-out"
                                    />
                                    <defs>
                                        <linearGradient id="gradient-score" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#6366f1" />
                                            <stop offset="100%" stopColor="#d946ef" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-5xl font-black text-white tracking-tighter">{data.match_score}%</span>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mt-1">Match Potential</span>
                                </div>
                            </div>
                        </div>

                        {/* Summary & CV Action */}
                        <div className="flex-1 space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="h-5 w-5 text-emerald-400" />
                                    <span className="text-gray-300 font-bold">{t('verified')}</span>
                                </div>
                                <h3 className="text-xl font-bold text-white max-w-xl">
                                    Our AI has synthesized a tailored acquisition strategy for your profile.
                                </h3>
                                <p className="text-gray-400 leading-relaxed font-medium">
                                    We've analyzed {data.skills.length} core competencies and identified {data.gaps.length} critical growth areas to maximize your technical resonance with this position.
                                </p>
                            </div>

                            <div className="pt-4 flex flex-wrap gap-4">
                                <PDFDownloadWrapper
                                    document={<TailoredCVPDF data={{
                                        jobTitle: data.title,
                                        cv_suggestions: data.cv_suggestions,
                                        skills: data.skills,
                                        translations: {
                                            namePlaceholder: tPdf('cv.namePlaceholder'),
                                            professionalProfile: tPdf('cv.professionalProfile'),
                                            profileTemplate: tPdf('cv.profileTemplate'),
                                            coreCompetencies: tPdf('cv.coreCompetencies'),
                                            relevantExperience: tPdf('cv.relevantExperience'),
                                            aiDisclaimer: tPdf('cv.aiDisclaimer'),
                                            placeholderRole: tPdf('cv.placeholderRole'),
                                            placeholderDesc: tPdf('cv.placeholderDesc'),
                                            education: tPdf('cv.education'),
                                            degreePlaceholder: tPdf('cv.degreePlaceholder'),
                                            universityPlaceholder: tPdf('cv.universityPlaceholder')
                                        }
                                    }} />}
                                    fileName={`Tailored-CV-${data.id.slice(0, 8)}.pdf`}
                                    className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-8 py-3 text-sm font-black text-white shadow-xl shadow-indigo-600/20 transition-all hover:scale-[1.02] h-14"
                                >
                                    <FileText className="mr-3 h-5 w-5" /> {t('generateCV')}
                                </PDFDownloadWrapper>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-8 lg:grid-cols-12">
                {/* Main Content: Skills & Roadmap */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Skills Detected */}
                    <Card className="bg-slate-900/40 backdrop-blur-md border-white/5 overflow-hidden">
                        <CardHeader className="p-8 border-b border-white/5 bg-white/5">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl font-black text-white flex items-center gap-3">
                                    <Award className="h-6 w-6 text-indigo-400" />
                                    {t('skills.title')}
                                </CardTitle>
                                <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 font-black px-3 py-1">
                                    {data.skills.length} Detected
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-white/5">
                                {data.skills.map((skill, i) => (
                                    <div key={i} className="p-8 hover:bg-white/5 transition-all group">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                                                    <Target className="h-5 w-5 text-indigo-400" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white text-lg">{skill.name}</h4>
                                                    {skill.must && (
                                                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                                                            {t('skills.required')}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-1.5 p-2 bg-white/5 rounded-xl border border-white/5 h-fit">
                                                {[...Array(5)].map((_, j) => (
                                                    <div
                                                        key={j}
                                                        className={`h-2 w-4 rounded-sm transition-all duration-500 ${j < skill.priority ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-white/10'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-gray-400 leading-relaxed font-medium pl-0 md:pl-13">
                                            {skill.explanation}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Roadmap Timeline */}
                    <Card className="bg-slate-900/40 backdrop-blur-md border-white/5 overflow-hidden">
                        <CardHeader className="p-8 border-b border-white/5 bg-white/5">
                            <CardTitle className="text-xl font-black text-white flex items-center gap-3">
                                <Rocket className="h-6 w-6 text-indigo-400" />
                                {t('roadmap.title')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="relative pl-6 md:pl-8 space-y-12 before:absolute before:left-[11px] md:before:left-[15px] before:top-4 before:bottom-4 before:w-[2px] before:bg-gradient-to-b before:from-indigo-600 before:to-purple-600/20">
                                {Object.entries(data.roadmap).map(([topic, tasks], i) => (
                                    <div key={i} className="relative group">
                                        <div className="absolute -left-[20px] md:-left-[24px] top-1.5 h-4 w-4 rounded-full border-4 border-slate-900 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] z-10 transition-transform group-hover:scale-125" />

                                        <h4 className="font-black text-white text-lg mb-4 pl-4 group-hover:text-indigo-400 transition-colors uppercase tracking-tight">
                                            {topic}
                                        </h4>

                                        <div className="grid grid-cols-1 gap-3 pl-4">
                                            {tasks.map((task, j) => (
                                                <div key={j} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-500/20 transition-all">
                                                    <div className="flex-shrink-0">
                                                        <div className="bg-indigo-500/20 px-3 py-1 rounded-lg">
                                                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{t('roadmap.day')} {task.day}</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-300 font-medium leading-relaxed">{task.task}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar: Gaps & Insights */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Knowledge Gaps */}
                    <Card className="bg-slate-900/40 backdrop-blur-md border-white/5 overflow-hidden">
                        <div className="px-6 py-5 bg-rose-500/10 border-b border-rose-500/20">
                            <h3 className="font-black text-rose-500 flex items-center gap-3 uppercase tracking-widest text-sm">
                                <AlertTriangle className="h-5 w-5" />
                                {t('gaps.title')}
                            </h3>
                        </div>
                        <CardContent className="p-6 space-y-4">
                            {data.gaps.map((gap, i) => (
                                <div key={i} className="bg-white/5 border border-rose-500/10 p-5 rounded-2xl group hover:border-rose-500/20 transition-all">
                                    <div className="font-black text-white mb-2 tracking-tight group-hover:text-rose-400 transition-colors">{gap.skill}</div>
                                    <p className="text-xs text-gray-400 font-medium leading-relaxed mb-4">{gap.reason}</p>
                                    <div className="flex items-center gap-2 text-[10px] font-black text-rose-500 bg-rose-500/10 w-fit px-3 py-1 rounded-full uppercase tracking-widest">
                                        <Calendar className="h-3 w-3" />
                                        {t('gaps.expected')}: {gap.recommended_days} Days
                                    </div>
                                </div>
                            ))}
                            {data.gaps.length === 0 && (
                                <div className="text-center py-6 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl font-black text-xs uppercase tracking-widest">
                                    {t('gaps.none')}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* CV Strategy Highlights */}
                    <Card className="bg-gradient-to-br from-indigo-900/40 via-slate-900/40 to-slate-900/40 border-indigo-500/20 shadow-2xl overflow-hidden">
                        <CardHeader className="p-6 border-b border-white/5">
                            <CardTitle className="text-lg font-black text-white flex items-center gap-3 uppercase tracking-widest">
                                <Sparkles className="h-5 w-5 text-indigo-400" />
                                Strategic Bullets
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <p className="text-xs text-gray-400 font-medium leading-relaxed italic">
                                "{t('cv.subtitle')}"
                            </p>
                            <div className="space-y-4">
                                {data.cv_suggestions.map((suggestion, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleCopy(suggestion, i)}
                                        className="w-full text-left group relative bg-white/5 hover:bg-white/10 rounded-2xl p-5 text-sm transition-all border border-white/5 hover:border-indigo-500/20 active:scale-[0.98]"
                                    >
                                        <p className="text-gray-300 font-medium leading-relaxed pr-8 group-hover:text-white transition-colors">{suggestion}</p>
                                        <div className="absolute top-5 right-5 text-indigo-400/40 group-hover:text-indigo-400 transition-colors">
                                            {copiedIndex === i ? (
                                                <Check className="h-5 w-5 text-emerald-400" />
                                            ) : (
                                                <Copy className="h-5 w-5" />
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    navigator.clipboard.writeText(data.cv_suggestions.join('\n'));
                                    setCopiedIndex(999);
                                    setTimeout(() => setCopiedIndex(null), 2000);
                                }}
                                className="w-full h-12 bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10 font-black text-[10px] uppercase tracking-[0.2em] rounded-xl"
                            >
                                {copiedIndex === 999 ? 'Sync Complete' : 'Harvest All Insights'}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
