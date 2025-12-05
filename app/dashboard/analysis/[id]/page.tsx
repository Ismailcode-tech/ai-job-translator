'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CheckCircle, AlertTriangle, BookOpen, Copy, Download, Share2, FileText } from 'lucide-react';

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

    useEffect(() => {
        // Fetch mock data
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

    if (loading) return <div className="p-12 text-center">Loading analysis...</div>;
    if (!data) return <div className="p-12 text-center">Analysis not found</div>;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{data.title}</h1>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span>Job ID: {data.id}</span>
                        {data.category && (
                            <>
                                <span>•</span>
                                <span className="font-medium text-slate-700">{data.category}</span>
                            </>
                        )}
                        <span>•</span>
                        <span className="text-teal-600 font-medium">{data.match_score}% Match</span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                        <Share2 className="mr-2 h-4 w-4" /> Share
                    </button>
                    <button className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                        <Download className="mr-2 h-4 w-4" /> PDF
                    </button>
                    <button className="inline-flex items-center justify-center rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 shadow-sm">
                        <Copy className="mr-2 h-4 w-4" /> Generate CV
                    </button>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Left Column: Skills & Gaps */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Skills Table */}
                    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                        <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
                            <h3 className="font-semibold text-slate-900">Extracted Skills</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                                    <tr>
                                        <th className="px-6 py-3">Skill</th>
                                        <th className="px-6 py-3">Priority</th>
                                        <th className="px-6 py-3">Explanation</th>
                                        <th className="px-6 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {data.skills.map((skill, i) => (
                                        <tr key={i} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 font-medium text-slate-900">{skill.name}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-1">
                                                    {[...Array(5)].map((_, j) => (
                                                        <div key={j} className={`h-1.5 w-1.5 rounded-full ${j < skill.priority ? 'bg-teal-500' : 'bg-slate-200'}`} />
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 max-w-xs truncate" title={skill.explanation}>{skill.explanation}</td>
                                            <td className="px-6 py-4">
                                                {skill.must ? (
                                                    <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">Must Have</span>
                                                ) : (
                                                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">Nice to Have</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Learning Roadmap */}
                    <div className="rounded-xl border border-slate-200 bg-white p-6">
                        <h3 className="mb-6 font-semibold text-slate-900 flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-teal-600" />
                            Learning Roadmap
                        </h3>
                        <div className="space-y-6">
                            {Object.entries(data.roadmap).map(([topic, tasks], i) => (
                                <div key={i} className="border-l-2 border-slate-200 pl-4">
                                    <h4 className="font-medium text-slate-900 mb-2">{topic}</h4>
                                    <ul className="space-y-3">
                                        {tasks.map((task, j) => (
                                            <li key={j} className="flex items-start gap-3 text-sm text-slate-600">
                                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-500">
                                                    {task.day}
                                                </span>
                                                <span>{task.task}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Gaps & CV */}
                <div className="space-y-8">
                    {/* Gaps Summary */}
                    <div className="rounded-xl border border-red-100 bg-red-50 p-6">
                        <h3 className="mb-4 font-semibold text-red-900 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" />
                            Missing Skills
                        </h3>
                        <div className="space-y-3">
                            {data.gaps.map((gap, i) => (
                                <div key={i} className="rounded-lg bg-white p-3 shadow-sm">
                                    <div className="font-medium text-slate-900">{gap.skill}</div>
                                    <div className="text-xs text-slate-500 mt-1">{gap.reason}</div>
                                    <div className="mt-2 text-xs font-medium text-teal-600">
                                        +{gap.recommended_days} days to learn
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CV Suggestions */}
                    <div className="rounded-xl border border-slate-200 bg-white p-6">
                        <h3 className="mb-4 font-semibold text-slate-900 flex items-center gap-2">
                            <FileText className="h-5 w-5 text-teal-600" />
                            CV Bullet Points
                        </h3>
                        <p className="text-sm text-slate-500 mb-4">Copy these into your resume to highlight your match.</p>
                        <div className="space-y-3">
                            {data.cv_suggestions.map((suggestion, i) => (
                                <div key={i} className="group relative rounded-lg bg-slate-50 p-3 text-sm text-slate-700 hover:bg-slate-100">
                                    {suggestion}
                                    <button className="absolute right-2 top-2 hidden text-slate-400 hover:text-teal-600 group-hover:block">
                                        <Copy className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
