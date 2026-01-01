import { createClient } from '@/utils/supabase/server';
export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { redirect } from 'next/navigation';
import { ActivationOverlay } from '@/components/dashboard/activation-overlay';
import {
    PlusCircle,
    Users,
    Clock,
    CheckCircle,
    ArrowRight,
    Zap,
    TrendingUp,
    AlertCircle,
    LayoutDashboard,
    Briefcase
} from 'lucide-react';

export default async function CompanyDashboard() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/login');

    // Verify User Type
    const { data: profile } = await supabase.from('profiles').select('user_type, is_activated').eq('id', user.id).single();
    if (profile?.user_type !== 'company') redirect('/dashboard');

    // Fetch Stats (Pipeline Counts)
    const { count: suggestedCount } = await supabase.from('mediator_matches').select('*', { count: 'exact', head: true }).eq('status', 'suggested');
    const { count: consentedCount } = await supabase.from('mediator_matches').select('*', { count: 'exact', head: true }).eq('status', 'consented');
    const { count: activeCount } = await supabase.from('mediator_matches').select('*', { count: 'exact', head: true }).eq('status', 'active');

    // Fetch Recent Pipeline Activity (Top 5)
    const { data: recentMatches } = await supabase
        .from('mediator_matches')
        .select(`
            id,
            ai_score,
            status,
            created_at,
            job_posts (title),
            profiles (experience_years)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

    const stats = [
        {
            label: 'Suggested Matches',
            value: suggestedCount || 0,
            icon: Users,
            color: 'from-blue-500 to-cyan-500',
            description: 'Awaiting your review'
        },
        {
            label: 'Awaiting Consent',
            value: consentedCount || 0,
            icon: Clock,
            color: 'from-amber-500 to-orange-500',
            description: 'Requests sent to candidates'
        },
        {
            label: 'Active Connections',
            value: activeCount || 0,
            icon: CheckCircle,
            color: 'from-green-500 to-emerald-500',
            description: 'Contact details unlocked'
        },
        {
            label: 'Credits Remaining',
            value: 45, // Mock for now, integrate with billing later
            icon: Zap,
            color: 'from-purple-500 to-pink-500',
            description: 'Connection credits available'
        },
    ];

    const totalMatches = (suggestedCount || 0) + (consentedCount || 0) + (activeCount || 0);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Header & Primary Action */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <LayoutDashboard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">Control Room</h1>
                        <p className="text-gray-400 mt-1">Overview of your recruitment and candidate mediation.</p>
                    </div>
                </div>
                <Link href="/dashboard/company/opportunities/new">
                    <Button className="h-12 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 border-0 text-white shadow-xl shadow-indigo-600/20 font-bold px-6 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]">
                        <PlusCircle className="mr-2 h-5 w-5" />
                        New Opportunity
                    </Button>
                </Link>
            </div>

            {/* Decision Summary Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => (
                    <Card key={i} className="bg-slate-900/40 backdrop-blur-md border-white/5 hover:border-white/10 transition-all duration-300 group overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">{stat.label}</div>
                                    <div className="text-3xl font-black text-white">{stat.value}</div>
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 font-medium">{stat.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Sections */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Pipeline Activity */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-indigo-400" />
                            Recent Pipeline Activity
                        </h2>
                        <Link href="/dashboard/company/pipeline" className="text-sm font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors group">
                            Full Pipeline
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <Card className="bg-slate-900/40 backdrop-blur-md border-white/5 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white/5 border-b border-white/5">
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Candidate / Role</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">AI Score</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Status</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {recentMatches?.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-gray-500 italic">
                                                No active matches. Submit an opportunity to get started.
                                            </td>
                                        </tr>
                                    ) : (
                                        recentMatches?.map((match: any) => (
                                            <tr key={match.id} className="hover:bg-white/[0.02] transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-white">
                                                        {match.profiles?.experience_years ? `Candidate (${match.profiles.experience_years}y exp)` : 'Candidate'}
                                                    </div>
                                                    <div className="text-xs text-gray-400 truncate max-w-[200px]">{match.job_posts?.title}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col items-center gap-1.5">
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-1.5 w-16 bg-white/5 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500"
                                                                    style={{ width: `${match.ai_score}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-xs font-black text-white">{match.ai_score}%</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <Badge className={`
                                                        px-2.5 py-0.5 rounded-lg border text-[10px] font-black uppercase tracking-widest
                                                        ${match.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                            match.status === 'suggested' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                                match.status === 'consented' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                                    'bg-gray-500/10 text-gray-400 border-gray-500/20'}
                                                    `}>
                                                        {match.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Link href={`/dashboard/company/matches/${match.id}`}>
                                                        <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                                                            <ArrowRight className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        )
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-8">
                    {/* Pipeline Health */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-indigo-400" />
                            Pipeline Health
                        </h2>
                        <Card className="bg-slate-900/40 backdrop-blur-md border-white/5 p-6 space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-400 font-medium">Suggested</span>
                                    <span className="text-white font-black">{suggestedCount || 0}</span>
                                </div>
                                <Progress value={suggestedCount ? (suggestedCount / (totalMatches || 1)) * 100 : 0} className="h-2 bg-white/5" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-400 font-medium">Consented</span>
                                    <span className="text-white font-black">{consentedCount || 0}</span>
                                </div>
                                <Progress value={consentedCount ? (consentedCount / (totalMatches || 1)) * 100 : 0} className="h-2 bg-white/5" indicatorClassName="bg-amber-500" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-400 font-medium">Active</span>
                                    <span className="text-white font-black">{activeCount || 0}</span>
                                </div>
                                <Progress value={activeCount ? (activeCount / (totalMatches || 1)) * 100 : 0} className="h-2 bg-white/5" indicatorClassName="bg-emerald-500" />
                            </div>
                            <div className="pt-4 border-t border-white/5">
                                <Link href="/dashboard/company/pipeline">
                                    <Button variant="outline" className="w-full h-11 border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl">
                                        View Breakdown
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    </div>

                    {/* Quick Tips */}
                    <Card className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border-indigo-500/20 p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
                            <AlertCircle className="w-24 h-24 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-indigo-400" />
                            Recruiter Tips
                        </h3>
                        <ul className="space-y-3 relative z-10">
                            {[
                                'Detailed job posts get 40% better matches.',
                                'Fast response times increase consent rates.',
                                'Use anonymous data to reduce bias.'
                            ].map((tip, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </Card>
                </div>
            </div>
        </div>
    );
}
