'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
    CheckCircle, AlertTriangle, BookOpen, Copy, Download, Share2,
    FileText, ArrowRight, Briefcase, Calendar, Check, ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { AnalysisReportPDF } from '@/components/pdf/AnalysisReportPDF';
import { TailoredCVPDF } from '@/components/pdf/TailoredCVPDF';
import PDFDownloadWrapper from '@/components/pdf/PDFDownloadWrapper';
import { useTranslations } from '@/lib/i18n-client';

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
    const params = useParams();
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
            // Simple feedback
            const btn = document.getElementById('share-btn');
            if (btn) {
                const originalText = btn.innerText;
                btn.innerText = t('copied');
                setTimeout(() => btn.innerText = originalText, 2000);
            } else {
                alert(t('clipboard'));
            }
        }
    };

    if (loading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-teal-600"></div>
            <p className="mt-4 text-slate-500 font-medium">{t('loading')}</p>
        </div>
    );

    if (!data) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
            <div className="rounded-full bg-red-100 p-4 mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">{t('notFound')}</h2>
            <p className="mt-2 text-slate-500">{t('notFoundDesc')}</p>
            <Link href="/dashboard" className="mt-6 inline-flex items-center text-teal-600 hover:underline">
                {t('return')} <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
        </div>
    );

    // Circular Progress Component
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (data.match_score / 100) * circumference;

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-12">
            {/* Hero Header */}
            <div className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm border border-slate-200">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Briefcase className="h-64 w-64 text-teal-900" />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-sm font-medium text-teal-600 mb-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-100">
                                {data.category || t('general')}
                            </span>
                            <span className="text-slate-400">•</span>
                            <span className="text-slate-500">{t('verified')}</span>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">{data.title}</h1>
                        <p className="text-slate-500 max-w-2xl">
                            {t('subtitle')}
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Match Score Ring */}
                        <div className="flex flex-col items-center">
                            <div className="relative h-20 w-20">
                                <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 70 70">
                                    <circle cx="35" cy="35" r={radius} stroke="#e2e8f0" strokeWidth="6" fill="transparent" />
                                    <circle
                                        cx="35" cy="35" r={radius}
                                        stroke={data.match_score > 70 ? "#0d9488" : data.match_score > 40 ? "#f59e0b" : "#ef4444"}
                                        strokeWidth="6"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={strokeDashoffset}
                                        strokeLinecap="round"
                                        fill="transparent"
                                        className="transition-all duration-1000 ease-out"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-lg font-bold text-slate-900">{data.match_score}%</span>
                                </div>
                            </div>
                            <span className="text-xs font-medium text-slate-500 mt-1">{t('matchScore')}</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="relative z-10 mt-8 flex flex-wrap gap-3 pt-6 border-t border-slate-100">
                    <PDFDownloadWrapper
                        document={<AnalysisReportPDF data={data} />}
                        fileName={`Analysis-${data.id.slice(0, 8)}.pdf`}
                        className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        <Download className="mr-2 h-4 w-4" /> {t('saveAsPDF')}
                    </PDFDownloadWrapper>

                    <button
                        id="share-btn"
                        onClick={handleShareReport}
                        className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        <Share2 className="mr-2 h-4 w-4" /> {t('shareReport')}
                    </button>
                    <div className="flex-1" />

                    <PDFDownloadWrapper
                        document={<TailoredCVPDF data={{
                            jobTitle: data.title,
                            cv_suggestions: data.cv_suggestions,
                            skills: data.skills
                        }} />}
                        fileName={`Tailored-CV-${data.id.slice(0, 8)}.pdf`}
                        className="inline-flex items-center justify-center rounded-lg bg-teal-600 px-6 py-2 text-sm font-medium text-white hover:bg-teal-700 shadow-sm transition-all hover:shadow-md"
                    >
                        <FileText className="mr-2 h-4 w-4" /> {t('generateCV')}
                    </PDFDownloadWrapper>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-12">
                {/* Main Content: Skills & Roadmap */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Skills Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-teal-600" />
                                {t('skills.title')}
                            </h3>
                            <span className="text-xs font-medium bg-white px-2 py-1 rounded border border-slate-200 text-slate-500">
                                {data.skills.length} {t('skills.detected')}
                            </span>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {data.skills.map((skill, i) => (
                                <div key={i} className="p-4 hover:bg-slate-50 transition-colors group">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <h4 className="font-semibold text-slate-900">{skill.name}</h4>
                                            {skill.must && (
                                                <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 text-[10px] font-bold uppercase tracking-wider border border-teal-100">
                                                    {t('skills.required')}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex gap-0.5" title={`${t('skills.priority')}: ${skill.priority}/5`}>
                                            {[...Array(5)].map((_, j) => (
                                                <div key={j} className={`h-1.5 w-3 rounded-full ${j < skill.priority ? 'bg-teal-500' : 'bg-slate-200'}`} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed">{skill.explanation}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Learning Roadmap - Timeline Style */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-6">
                            <BookOpen className="h-5 w-5 text-indigo-600" />
                            {t('roadmap.title')}
                        </h3>

                        <div className="relative pl-4 space-y-8 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                            {Object.entries(data.roadmap).map(([topic, tasks], i) => (
                                <div key={i} className="relative pl-8 group">
                                    <div className="absolute left-[10px] top-1.5 h-5 w-5 rounded-full border-2 border-indigo-600 bg-white group-hover:bg-indigo-50 transition-colors z-10" />

                                    <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                        {topic}
                                    </h4>

                                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 space-y-3">
                                        {tasks.map((task, j) => (
                                            <div key={j} className="flex gap-3 text-sm">
                                                <div className="flex-shrink-0 w-12 pt-0.5">
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('roadmap.day')} {task.day}</span>
                                                </div>
                                                <p className="text-slate-700">{task.task}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar: Gaps & CV */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Missing Skills */}
                    <div className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden">
                        <div className="px-5 py-4 bg-red-50/50 border-b border-red-100">
                            <h3 className="font-bold text-red-900 flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                                {t('gaps.title')}
                            </h3>
                        </div>
                        <div className="p-5 space-y-4">
                            {data.gaps.map((gap, i) => (
                                <div key={i} className="bg-white rounded-lg border border-red-100 p-3 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="font-semibold text-slate-900 mb-1">{gap.skill}</div>
                                    <p className="text-xs text-slate-500 mb-3">{gap.reason}</p>
                                    <div className="flex items-center gap-1.5 text-xs font-medium text-red-600 bg-red-50 w-fit px-2 py-1 rounded">
                                        <Calendar className="h-3 w-3" />
                                        {t('gaps.expected')}: {gap.recommended_days} {t('gaps.days')}
                                    </div>
                                </div>
                            ))}
                            {data.gaps.length === 0 && (
                                <div className="text-center py-4 text-green-600 bg-green-50 rounded-lg text-sm font-medium">
                                    {t('gaps.none')}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* CV Bullet Points */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-lg text-white overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-700/50">
                            <h3 className="font-bold flex items-center gap-2">
                                <FileText className="h-5 w-5 text-teal-400" />
                                {t('cv.title')}
                            </h3>
                        </div>
                        <div className="p-5 space-y-4">
                            <p className="text-xs text-slate-400">
                                {t('cv.subtitle')}
                            </p>
                            {data.cv_suggestions.map((suggestion, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleCopy(suggestion, i)}
                                    className="w-full text-left group relative bg-white/5 hover:bg-white/10 rounded-lg p-3 text-sm text-slate-200 transition-all border border-transparent hover:border-slate-600"
                                >
                                    <p className="pr-6">{suggestion}</p>
                                    <div className="absolute top-3 right-3 text-slate-400 group-hover:text-white">
                                        {copiedIndex === i ? (
                                            <Check className="h-4 w-4 text-green-400" />
                                        ) : (
                                            <Copy className="h-4 w-4" />
                                        )}
                                    </div>
                                </button>
                            ))}
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(data.cv_suggestions.join('\n'));
                                    setCopiedIndex(999);
                                    setTimeout(() => setCopiedIndex(null), 2000);
                                }}
                                className="w-full mt-2 py-2 text-xs font-semibold text-center text-teal-400 hover:text-teal-300 border border-teal-500/30 rounded hover:bg-teal-500/10 transition-colors"
                            >
                                {copiedIndex === 999 ? t('cv.allCopied') : t('cv.copyAll')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
