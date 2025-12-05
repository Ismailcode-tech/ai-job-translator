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

    jobTitle: data.title,
        cv_suggestions: data.cv_suggestions,
            skills: data.skills
}} />}
fileName = {`Tailored-CV-${data.id.slice(0, 8)}.pdf`}
className = "inline-flex items-center justify-center rounded-lg bg-teal-600 px-6 py-2 text-sm font-medium text-white hover:bg-teal-700 shadow-sm transition-all hover:shadow-md"
    >
    <FileText className="mr-2 h-4 w-4" /> Generate Tailored CV
                    </PDFDownloadWrapper >
                </div >
            </div >

    <div className="grid gap-8 lg:grid-cols-12">
        {/* Main Content: Skills & Roadmap */}
        <div className="lg:col-span-8 space-y-8">
            {/* Skills Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-teal-600" />
                        Required Skills Breakdown
                    </h3>
                    <span className="text-xs font-medium bg-white px-2 py-1 rounded border border-slate-200 text-slate-500">
                        {data.skills.length} detected
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
                                            Required
                                        </span>
                                    )}
                                </div>
                                <div className="flex gap-0.5" title={`Priority: ${skill.priority}/5`}>
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
                    3-Day Learning Sprint
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
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Day {task.day}</span>
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
                        Skill Gaps
                    </h3>
                </div>
                <div className="p-5 space-y-4">
                    {data.gaps.map((gap, i) => (
                        <div key={i} className="bg-white rounded-lg border border-red-100 p-3 shadow-sm hover:shadow-md transition-shadow">
                            <div className="font-semibold text-slate-900 mb-1">{gap.skill}</div>
                            <p className="text-xs text-slate-500 mb-3">{gap.reason}</p>
                            <div className="flex items-center gap-1.5 text-xs font-medium text-red-600 bg-red-50 w-fit px-2 py-1 rounded">
                                <Calendar className="h-3 w-3" />
                                Expected: {gap.recommended_days} days
                            </div>
                        </div>
                    ))}
                    {data.gaps.length === 0 && (
                        <div className="text-center py-4 text-green-600 bg-green-50 rounded-lg text-sm font-medium">
                            No major gaps detected! 🎉
                        </div>
                    )}
                </div>
            </div>

            {/* CV Bullet Points */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-lg text-white overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-700/50">
                    <h3 className="font-bold flex items-center gap-2">
                        <FileText className="h-5 w-5 text-teal-400" />
                        Tailored CV Bullets
                    </h3>
                </div>
                <div className="p-5 space-y-4">
                    <p className="text-xs text-slate-400">
                        Click to copy these enhancements for your resume:
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
                        {copiedIndex === 999 ? 'Copied All!' : 'Copy All Suggestions'}
                    </button>
                </div>
            </div>
        </div>
    </div>
        </div >
    );
}
