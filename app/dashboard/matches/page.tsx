import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, MapPin, Building2, Layers } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function MatchesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/login');

    // Fetch Profile for security
    const { data: profile } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', user.id)
        .single();

    if (profile?.user_type !== 'individual') redirect('/dashboard/company');

    // Fetch Matches with Job and Company details
    // We assume job_posts has company_id which links to profiles(id)
    const { data: matches, error } = await supabase
        .from('mediator_matches')
        .select(`
            id,
            status,
            ai_score,
            created_at,
            job_posts (
                id,
                title,
                location,
                company_id,
                employment_type
            )
        `)
        .eq('user_id', user.id)
        .order('ai_score', { ascending: false });

    // We need to fetch company names separately or via join if schema allowed.
    // For now, let's fetch unique company IDs to get names.
    const companyIds = Array.from(new Set((matches as any[])?.map(m => m.job_posts?.company_id).filter(Boolean)));

    let companiesMap: Record<string, any> = {};
    if (companyIds.length > 0) {
        const { data: companies } = await supabase
            .from('profiles')
            .select('id, company_name, name, location')
            .in('id', companyIds);

        companies?.forEach(c => {
            companiesMap[c.id] = c;
        });
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Layers className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight">Matches</h1>
                        <p className="text-gray-400 mt-1 font-medium">AI-suggested opportunities based on your profile</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            {!matches || matches.length === 0 ? (
                <Card className="bg-slate-900/40 backdrop-blur-md border-white/5 border-dashed p-20 text-center shadow-xl">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Sparkles className="w-10 h-10 text-gray-700" />
                    </div>
                    <h3 className="text-xl font-black text-gray-300">No Matches Found Yet</h3>
                    <p className="text-gray-500 text-sm mt-3 max-w-sm mx-auto font-medium leading-relaxed">
                        Our AI is analyzing your profile against open opportunities. Check back soon or refine your profile.
                    </p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {matches.map((match: any) => {
                        const job = match.job_posts;
                        const company = companiesMap[job?.company_id] || {};
                        const companyName = company.company_name || company.name || 'Unknown Company';
                        const score = match.ai_score || 0;
                        const status = match.status || 'suggested';
                        const isHighMatch = score >= 90;

                        return (
                            <Card key={match.id} className="bg-slate-900/40 backdrop-blur-md border-white/5 hover:border-indigo-500/30 transition-all duration-300 group relative overflow-hidden">
                                {/* Decorator for high match */}
                                {isHighMatch && (
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[50px] pointer-events-none"></div>
                                )}

                                <CardContent className="p-6 md:p-8">
                                    <div className="flex flex-col gap-6">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-black text-white group-hover:text-indigo-400 transition-colors mb-2">
                                                    {companyName}
                                                </h3>
                                                <p className="text-gray-400 font-bold">{job?.title}</p>
                                            </div>
                                            <Badge className={`
                                                uppercase text-[10px] font-black tracking-widest px-3 py-1 border-0
                                                ${status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-gray-400'}
                                            `}>
                                                {status}
                                            </Badge>
                                        </div>

                                        {/* Match Score Bar */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-500">
                                                <span>Match Score</span>
                                                <span className={isHighMatch ? 'text-indigo-400' : 'text-gray-400'}>{score}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-1000 ${isHighMatch ? 'bg-gradient-to-r from-indigo-500 to-cyan-400' : 'bg-gray-600'}`}
                                                    style={{ width: `${score}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="w-3.5 h-3.5" />
                                                {job?.location || company.location || 'Remote'}
                                            </div>
                                            {job?.employment_type && (
                                                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/5 rounded-md">
                                                    {job.employment_type}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
