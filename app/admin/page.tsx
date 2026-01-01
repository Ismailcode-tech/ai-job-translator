'use client';

import { useEffect, useState } from 'react';
import { Users, CreditCard, TrendingUp, Activity, ShieldCheck, FileText } from 'lucide-react';
import { getAdminData } from './actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface User {
    id: string;
    email: string;
    name: string;
    created_at: string;
    subscription_status: string | null;
    subscription_end_date: string | null;
}

interface Match {
    id: string;
    status: string;
    ai_score: number;
    match_reason: string;
    created_at: string;
    job_posts: {
        title: string;
        company: { name: string } | null;
    } | null;
    candidate: { name: string; email: string } | null;
}

export default function AdminPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [matches, setMatches] = useState<Match[]>([]);
    const [auditLogs, setAuditLogs] = useState<any[]>([]); // Add state
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeSubscriptions: 0,
        revenue: 0,
        totalMatches: 0,
        matchesActive: 0
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getAdminData();
                if (data.error) {
                    console.error(data.error);
                    return;
                }
                if (data.users) setUsers(data.users as any);
                if (data.matches) setMatches(data.matches as any);
                if (data.auditLogs) setAuditLogs(data.auditLogs as any); // Correctly set Audit Logs
                if (data.stats) setStats(data.stats as any);
            } catch (error) {
                console.error('Failed to fetch admin data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Activity className="h-8 w-8 animate-spin text-teal-600 mx-auto mb-4" />
                    <p className="text-slate-600">Loading mediator data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Mediator Administration</h1>
                    <p className="text-slate-600 mt-2">Platform Overview & Compliance Ledger</p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalUsers}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Matches</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalMatches}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
                            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.matchesActive}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* THE LEDGER (Mediator Matches) */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-slate-900">The Mediator Ledger</h2>
                        <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Live Feed</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-white border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-3 text-left font-medium text-slate-500">Timestamp</th>
                                    <th className="px-6 py-3 text-left font-medium text-slate-500">Status</th>
                                    <th className="px-6 py-3 text-left font-medium text-slate-500">Score</th>
                                    <th className="px-6 py-3 text-left font-medium text-slate-500">Candidate</th>
                                    <th className="px-6 py-3 text-left font-medium text-slate-500">Company / Role</th>
                                    <th className="px-6 py-3 text-left font-medium text-slate-500">Reason</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {matches.map((match) => (
                                    <tr key={match.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 text-slate-500">
                                            {new Date(match.created_at).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold uppercase ${match.status === 'active' ? 'bg-green-100 text-green-800' :
                                                match.status === 'consented' ? 'bg-purple-100 text-purple-800' :
                                                    match.status === 'suggested' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-gray-100 text-slate-600'
                                                }`}>
                                                {match.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono font-bold text-slate-700">
                                            {match.ai_score}%
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            {match.candidate?.name || 'Unknown'}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            <div className="font-medium text-slate-900">{match.job_posts?.company?.name || 'Unknown Company'}</div>
                                            <div className="text-xs">{match.job_posts?.title}</div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 max-w-xs truncate" title={match.match_reason}>
                                            {match.match_reason}
                                        </td>
                                    </tr>
                                ))}
                                {matches.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                            No matches recorded in the ledger yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200">
                        <h2 className="text-lg font-semibold text-slate-900">User Registry</h2>
                    </div>
                    {/* ... Existing User Table Code or Simplified ... */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <tbody className="divide-y divide-slate-200">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-slate-900">{user.name}</div>
                                            <div className="text-sm text-slate-500">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {user.subscription_status === 'active' ? (
                                                <span className="text-green-600 font-medium">Active</span>
                                            ) : (
                                                <span className="text-slate-400">Free</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Audit Logs Table (Phase 7) */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                        <h2 className="text-lg font-semibold text-slate-900 flex items-center">
                            <ShieldCheck className="w-5 h-5 mr-2 text-slate-500" />
                            Security & Compliance Logs
                        </h2>
                        <span className="text-xs text-slate-500 font-mono">Immutable Ledger</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-white border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-3 text-left font-medium text-slate-500">Timestamp</th>
                                    <th className="px-6 py-3 text-left font-medium text-slate-500">Actor</th>
                                    <th className="px-6 py-3 text-left font-medium text-slate-500">Action</th>
                                    <th className="px-6 py-3 text-left font-medium text-slate-500">Target</th>
                                    <th className="px-6 py-3 text-left font-medium text-slate-500">Metadata</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {auditLogs.map((log: any) => (
                                    <tr key={log.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                                            {new Date(log.created_at).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            {log.actor?.name || 'System'}
                                            <div className="text-xs text-slate-500">{log.actor?.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase bg-slate-100 text-slate-700">
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {log.entity_type}:{log.entity_id?.substring(0, 8)}...
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-xs font-mono max-w-xs truncate">
                                            {JSON.stringify(log.metadata)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
