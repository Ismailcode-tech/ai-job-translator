import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Shield,
    CheckCircle,
    XCircle,
    Building2,
    Lock,
    Clock,
    AlertCircle,
    BrainCircuit,
    Sparkles,
    Zap,
    Target
} from 'lucide-react';
import { grantConsent, rejectConsent } from './actions';
import { GrantAccessButton } from './grant-button';

export default async function ConsentRequestsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/login');

    // Fetch Incoming Requests (status = 'consented')
    // Fetch Incoming Requests (status = 'consented')
    const { data: requestsData } = await supabase
        .from('mediator_matches')
        .select(`
            *,
            job_posts (
                title,
                company_id
            )
        `)
        .eq('user_id', user.id)
        .eq('status', 'consented')
        .order('updated_at', { ascending: false });

    // Fetch Processed Requests
    const { data: processedData } = await supabase
        .from('mediator_matches')
        .select(`
            *,
            job_posts (
                title,
                company_id
            )
        `)
        .eq('user_id', user.id)
        .in('status', ['active', 'closed'])
        .order('updated_at', { ascending: false })
        .limit(5);

    // Collect all company IDs to fetch names manually (Workaround for missing FK)
    const companyIds = new Set<string>();
    requestsData?.forEach((r: any) => {
        if (r.job_posts?.company_id) companyIds.add(r.job_posts.company_id);
    });
    processedData?.forEach((r: any) => {
        if (r.job_posts?.company_id) companyIds.add(r.job_posts.company_id);
    });

    let detailsMap: Record<string, any> = {};
    if (companyIds.size > 0) {
        const { data: companies } = await supabase
            .from('profiles')
            .select('id, company_name')
            .in('id', Array.from(companyIds));

        companies?.forEach(c => {
            detailsMap[c.id] = c;
        });
    }

    // Merge data
    const requests = requestsData?.map((r: any) => ({
        ...r,
        company_name: detailsMap[r.job_posts?.company_id]?.company_name || 'Confidential Partner'
    }));

    const processed = processedData?.map((r: any) => ({
        ...r,
        company_name: detailsMap[r.job_posts?.company_id]?.company_name || 'Partner'
    }));

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight">Privacy Inbox</h1>
                        <p className="text-gray-400 mt-1">Manage company access requests to your private identity.</p>
                    </div>
                </div>
            </div>

            {/* Information Banner */}
            <Card className="bg-slate-900/40 backdrop-blur-md border-indigo-500/20 overflow-hidden shadow-2xl">
                <CardContent className="p-6">
                    <div className="flex items-start gap-5">
                        <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 border border-indigo-500/10">
                            <Lock className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-white mb-1 uppercase tracking-tight">Identity Lock Active</h3>
                            <p className="text-gray-400 text-sm leading-relaxed font-medium">
                                Your full name, email, and resume remain <span className="text-indigo-400 font-black">permanently locked</span> until you click "Grant Access". Companies have only seen your match score and anonymous skill synthesis.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Requests Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                            Incoming Requests
                        </h2>
                        <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 font-black px-2.5">
                            {requests?.length || 0}
                        </Badge>
                    </div>
                </div>

                {requests?.length === 0 ? (
                    <Card className="bg-slate-900/40 backdrop-blur-md border-white/5 border-dashed p-16 text-center shadow-xl">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Target className="w-10 h-10 text-gray-700" />
                        </div>
                        <h3 className="text-xl font-black text-gray-300">Your Privacy is Safe</h3>
                        <p className="text-gray-500 text-sm mt-3 max-w-sm mx-auto font-medium">
                            No companies are currently requesting access. We'll alert you via email when a high-value match appears.
                        </p>
                    </Card>
                ) : (
                    <div className="grid gap-6">
                        {requests?.map((req: any) => (
                            <Card key={req.id} className="bg-slate-900/40 backdrop-blur-md border-white/5 hover:border-indigo-500/30 transition-all duration-300 group overflow-hidden shadow-2xl relative">
                                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                                    <Sparkles className="h-48 w-48 text-indigo-400" />
                                </div>
                                <CardHeader className="p-8 pb-4">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 text-[10px] uppercase font-black tracking-widest px-2 py-0.5">
                                                    High Potential Match
                                                </Badge>
                                            </div>
                                            <CardTitle className="text-3xl font-black text-white group-hover:text-indigo-400 transition-colors tracking-tight">
                                                {req.job_posts?.title}
                                            </CardTitle>
                                            <CardDescription className="text-gray-400 font-bold flex items-center gap-2 text-base">
                                                at <span className="text-gray-200">{req.company_name}</span>
                                            </CardDescription>
                                        </div>
                                        <div className="text-right flex flex-col items-end">
                                            <div className="text-5xl font-black bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tighter">
                                                {req.ai_score}%
                                            </div>
                                            <div className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1">Match Index</div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 pt-4 space-y-6">
                                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 relative group/reason overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover/reason:opacity-40 transition-opacity">
                                            <BrainCircuit className="w-10 h-10 text-indigo-400" />
                                        </div>
                                        <div className="relative z-10 font-black text-indigo-400/60 text-[10px] uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                            <Zap className="w-3 h-3 fill-current" />
                                            AI Selection Reasoning
                                        </div>
                                        <p className="text-gray-200 text-lg italic leading-relaxed relative z-10 font-medium tracking-tight">
                                            "{req.match_reason}"
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-8 text-xs py-2 font-black uppercase tracking-widest text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-indigo-500/60" />
                                            Received {new Date(req.updated_at).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-2 text-indigo-400/80">
                                            <Lock className="w-4 h-4" />
                                            Identity Masked
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex gap-4 justify-end border-t border-white/5 bg-white/5 p-8">
                                    <form action={async () => {
                                        'use server';
                                        await rejectConsent(req.id);
                                    }}>
                                        <Button variant="ghost" className="text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 h-14 px-8 rounded-xl transition-all font-black text-sm uppercase tracking-widest">
                                            <XCircle className="w-5 h-5 mr-2" />
                                            Decline
                                        </Button>
                                    </form>
                                    <GrantAccessButton matchId={req.id} />
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* History Section */}
            {processed && processed.length > 0 && (
                <div className="space-y-6 pt-12">
                    <h2 className="text-xl font-black text-white uppercase tracking-tight px-1 flex items-center gap-3">
                        Recent Decisions
                    </h2>
                    <div className="grid gap-4">
                        {processed.map((item: any) => (
                            <div key={item.id} className="p-6 bg-slate-900/40 rounded-2xl border border-white/5 flex items-center justify-between group transition-all hover:bg-white/5">
                                <div className="flex items-center gap-5">
                                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/5 group-hover:bg-indigo-500/10 transition-colors">
                                        <Building2 className="w-5 h-5 text-gray-400 group-hover:text-indigo-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-white text-lg tracking-tight">{item.company_name}</h3>
                                        <p className="text-sm text-gray-500 font-medium">{item.job_posts?.title}</p>
                                    </div>
                                </div>
                                <Badge className={
                                    item.status === 'active'
                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-black px-4 py-1.5'
                                        : 'bg-white/5 text-gray-500 border-white/10 font-black px-4 py-1.5 uppercase tracking-widest text-[10px]'
                                }>
                                    {item.status === 'active' ? 'ACCESS GRANTED' : item.status.toUpperCase()}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
