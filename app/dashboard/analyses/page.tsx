'use client';

import Link from 'next/link';
import { FileText, Clock, ArrowRight, Search } from 'lucide-react';

export default function AnalysesPage() {
    // Mock data
    const analyses = [
        { id: 'job_123', title: 'Senior Frontend Developer', company: 'TechCorp', date: '2 hours ago', score: 85, status: 'complete' },
        { id: 'job_456', title: 'Product Manager', company: 'StartupInc', date: '1 day ago', score: 60, status: 'complete' },
        { id: 'job_789', title: 'Backend Engineer', company: 'CloudSys', date: '2 days ago', score: 0, status: 'processing' },
        { id: 'job_101', title: 'UX Designer', company: 'DesignStudio', date: '3 days ago', score: 92, status: 'complete' },
        { id: 'job_102', title: 'DevOps Engineer', company: 'InfraCo', date: '1 week ago', score: 45, status: 'complete' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">My Analyses</h1>
                    <p className="text-slate-600">History of all your job scans</p>
                </div>
                <Link href="/dashboard" className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 transition-colors">
                    New Analysis
                </Link>
            </div>

            {/* Search/Filter Bar */}
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search analyses..."
                        className="w-full rounded-lg border border-slate-200 pl-10 pr-4 py-2 text-sm focus:border-teal-500 focus:outline-none"
                    />
                </div>
                <select className="rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-teal-500 focus:outline-none">
                    <option>All Status</option>
                    <option>Complete</option>
                    <option>Processing</option>
                </select>
            </div>

            {/* List */}
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                            <tr>
                                <th className="px-6 py-3">Job Title</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Match Score</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {analyses.map((job) => (
                                <tr key={job.id} className="hover:bg-slate-50 group">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900">{job.title}</div>
                                        <div className="text-xs text-slate-500">{job.company}</div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-3 w-3" />
                                            {job.date}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {job.status === 'complete' ? (
                                            <span className={`font-medium ${job.score >= 80 ? 'text-teal-600' : job.score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                {job.score}%
                                            </span>
                                        ) : (
                                            <span className="text-slate-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {job.status === 'complete' ? (
                                            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                                                Complete
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                                                Processing
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link href={`/dashboard/analysis/${job.id}`} className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                            View <ArrowRight className="ml-1 h-4 w-4" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
