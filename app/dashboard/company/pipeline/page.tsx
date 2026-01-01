import { createClient } from '@/utils/supabase/server';
export const dynamic = 'force-dynamic';
import { redirect } from 'next/navigation';
import { ActivationOverlay } from '@/components/dashboard/activation-overlay';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
    CheckCircle,
    Clock,
    Lock,
    Sparkles,
    User,
    Filter,
    Layers,
    ArrowRight,
    Eye,
    TrendingUp,
    Shield
} from 'lucide-react';

export default async function PipelinePage({ searchParams }: { searchParams: { status?: string } }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/login');

    // Check activation status
    const { data: profile } = await supabase.from('profiles').select('is_activated').eq('id', user.id).single();
    if (!profile?.is_activated) {
        return <ActivationOverlay />;
    }

    const activeTab = searchParams.status || 'suggested';

    // Fetch all matches for the current company to calculate counts
    // In a larger app, we might do separate count queries
    const { data: allMatches } = await supabase
        .from('mediator_matches')
        .select(`
            id,
            status,
            ai_score,
            updated_at,
            job_posts (title),
            profiles (experience_years, bio)
        `)
        .order('updated_at', { ascending: false });

    const counts = {
        suggested: allMatches?.filter(m => m.status === 'suggested').length || 0,
        consented: allMatches?.filter(m => m.status === 'consented').length || 0,
        active: allMatches?.filter(m => m.status === 'active').length || 0,
        closed: allMatches?.filter(m => m.status === 'closed').length || 0,
    };

    const filteredMatches = activeTab === 'all'
        ? allMatches
        : allMatches?.filter(m => m.status === activeTab);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Layers className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">Talent Pipeline</h1>
                        <p className="text-gray-400 mt-1">Track and manage candidates through your recruitment funnel.</p>
                    </div>
                </div>
            </div>

            <Tabs defaultValue={activeTab} className="w-full space-y-8">
                <TabsList className="bg-slate-900/50 border border-white/5 p-1 rounded-xl h-auto flex flex-wrap gap-1">
                    {[
                        { id: 'suggested', label: 'Suggested', count: counts.suggested, color: 'text-amber-400' },
                        { id: 'consented', label: 'Consented', count: counts.consented, color: 'text-blue-400' },
                        { id: 'active', label: 'Active', count: counts.active, color: 'text-emerald-400' },
                        { id: 'closed', label: 'Closed', count: counts.closed, color: 'text-gray-400' }
                    ].map((tab) => (
                        <Link key={tab.id} href={`/dashboard/company/pipeline?status=${tab.id}`} className="flex-1 min-w-[120px]">
                            <TabsTrigger
                                value={tab.id}
                                className={`
                                    w-full h-11 rounded-lg font-bold transition-all
                                    data-[state=active]:bg-indigo-600 data-[state=active]:text-white
                                    data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:bg-white/5 data-[state=inactive]:hover:text-gray-300
                                `}
                            >
                                <span className="flex items-center justify-center gap-2">
                                    {tab.label}
                                    <Badge className="bg-white/10 text-current border-0 py-0 px-2 h-5 text-[10px] font-black">
                                        {tab.count}
                                    </Badge>
                                </span>
                            </TabsTrigger>
                        </Link>
                    ))}
                </TabsList>

                <div className="grid gap-6">
                    {(!filteredMatches || filteredMatches.length === 0) ? (
                        <Card className="bg-slate-900/40 backdrop-blur-md border-dashed border-white/10">
                            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                                    <Filter className="h-8 w-8 text-gray-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">No Candidates Found</h3>
                                <p className="text-gray-400 max-w-sm">
                                    There are currently no candidates in the <span className="text-indigo-400 font-bold uppercase">{activeTab}</span> stage.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredMatches.map((match: any) => (
                            <Card key={match.id} className="bg-slate-900/40 backdrop-blur-md border-white/5 hover:border-white/10 transition-all duration-300 group overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                                        <div className="flex-1 flex gap-5">
                                            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 flex items-center justify-center shrink-0 border border-indigo-500/20 shadow-inner">
                                                {match.status === 'active' ? (
                                                    <User className="h-7 w-7 text-indigo-400" />
                                                ) : (
                                                    <Shield className="h-7 w-7 text-indigo-400 opacity-50" />
                                                )}
                                            </div>
                                            <div className="space-y-1.5">
                                                <h3 className="text-xl font-black text-white flex items-center gap-3">
                                                    {match.status === 'active' ? 'Unlocked Candidate' : 'Anonymous Matching Candidate'}
                                                    <Badge className="bg-white/5 text-gray-400 border-white/10 text-[10px] font-black uppercase tracking-tighter">
                                                        {match.profiles?.experience_years ? `${match.profiles.experience_years}y Experience` : 'Exp N/A'}
                                                    </Badge>
                                                </h3>
                                                <p className="text-sm font-medium text-gray-400">
                                                    Applied for: <span className="text-indigo-400 font-bold">{match.job_posts?.title}</span>
                                                </p>
                                                <div className="flex items-center gap-4 pt-1">
                                                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                                                        <Clock className="h-3 w-3" />
                                                        Last Active {new Date(match.updated_at).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-8 w-full md:w-auto shrink-0">
                                            <div className="flex flex-col items-center md:items-end gap-1">
                                                <div className="flex items-center gap-2">
                                                    <Sparkles className="h-4 w-4 text-indigo-400" />
                                                    <span className="text-3xl font-black text-white italic">{match.ai_score}%</span>
                                                </div>
                                                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Match Compatibility</div>
                                            </div>

                                            <div className="h-12 w-px bg-white/5 hidden md:block" />

                                            <Link href={`/dashboard/company/matches/${match.id}`} className="w-full md:w-auto">
                                                <Button className="w-full bg-white/5 hover:bg-white/10 border-white/10 text-white font-black h-12 px-8 rounded-xl flex items-center justify-center gap-2 group/btn transition-all">
                                                    Review Profile
                                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="h-1 w-full bg-white/5 relative">
                                        <div
                                            className={`h-full absolute left-0 top-0 transition-all duration-1000
                                                ${match.status === 'active' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' :
                                                    match.status === 'consented' ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' :
                                                        match.status === 'suggested' ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' :
                                                            'bg-gray-500'}
                                            `}
                                            style={{ width: `${match.ai_score}%` }}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </Tabs>
        </div>
    );
}
