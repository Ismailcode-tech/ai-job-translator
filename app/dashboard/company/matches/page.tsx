import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Sparkles, Eye, Briefcase, MapPin, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CompanyMatchesPage({ searchParams }: { searchParams: Promise<{ job?: string }> }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/login');

    const { job: jobId } = await searchParams;

    let query = supabase
        .from('mediator_matches')
        .select(`
            id,
            ai_score,
            status,
            match_reason,
            created_at,
            candidate:profiles(id, experience_years, skills, location),
            job:job_posts!inner(title, company_id)
        `)
        .eq('job.company_id', user.id)
        .order('ai_score', { ascending: false });

    if (jobId) {
        query = query.eq('job_id', jobId);
    }

    const { data: matches, error } = await query;

    // Fetch job details for header if filtering by job
    let jobTitle = 'All Opportunities';
    if (jobId) {
        const { data: job } = await supabase.from('job_posts').select('title').eq('id', jobId).single();
        if (job) jobTitle = job.title;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    {jobId && (
                        <Link href="/dashboard/company/opportunities">
                            <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                    )}
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-white mb-2">Opportunity Matches</h1>
                        <p className="text-gray-400 font-medium">
                            AI-matched candidates for <span className="text-indigo-400 font-bold">{jobTitle}</span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6">
                {!matches || matches.length === 0 ? (
                    <Card className="bg-slate-900/40 backdrop-blur-md border-dashed border-white/10">
                        <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                                <Sparkles className="h-10 w-10 text-gray-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No Matches Yet</h3>
                            <p className="text-gray-400 max-w-md mb-8">
                                We're still analyzing the talent pool for this opportunity. Check back soon for AI-curated matches.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    matches.map((match: any) => (
                        <Card key={match.id} className="bg-slate-900/40 backdrop-blur-md border-white/5 hover:border-indigo-500/30 transition-all duration-300 group overflow-hidden">
                            <CardContent className="p-0">
                                <div className="p-8">
                                    <div className="flex flex-col md:flex-row gap-8 items-start">
                                        {/* Match Score */}
                                        <div className="flex flex-col items-center justify-center bg-white/5 rounded-2xl p-4 min-w-[100px] border border-white/5">
                                            <span className="text-4xl font-black text-indigo-400">{match.ai_score}%</span>
                                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Match Score</span>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 space-y-4 w-full">
                                            <div className="flex flex-wrap justify-between items-start gap-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="text-xl font-bold text-white">
                                                            {match.status === 'suggested' ? 'Anonymous Candidate' : 'Candidate Revealed'}
                                                        </h3>
                                                        <Badge className={`
                                                            px-2.5 py-0.5 rounded-lg border text-[10px] font-black uppercase tracking-widest
                                                            ${match.status === 'suggested' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                                match.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                                    'bg-blue-500/10 text-blue-400 border-blue-500/20'}
                                                        `}>
                                                            {match.status}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
                                                        {match.match_reason}
                                                    </p>
                                                </div>
                                                <Link href={`/dashboard/company/matches/${match.id}`}>
                                                    <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 shadow-lg shadow-indigo-600/20 rounded-xl transition-all">
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        View Details
                                                    </Button>
                                                </Link>
                                            </div>

                                            {/* Match Quality Bar */}
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest">
                                                    <span>Match Quality</span>
                                                    <span>{match.ai_score}/100</span>
                                                </div>
                                                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                                                        style={{ width: `${match.ai_score}%` }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Skills & Info */}
                                            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/5 mt-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Experience</span>
                                                    <span className="text-sm font-bold text-white">{match.candidate?.experience_years || 0} Years</span>
                                                </div>

                                                <div className="flex flex-wrap gap-2 flex-1 justify-end">
                                                    {match.candidate?.skills?.slice(0, 3).map((skill: string) => (
                                                        <Badge key={skill} variant="outline" className="bg-white/5 border-white/10 text-xs text-gray-300 font-medium px-3 py-1">
                                                            {skill}
                                                        </Badge>
                                                    ))}
                                                    {match.candidate?.skills?.length > 3 && (
                                                        <Badge variant="outline" className="bg-white/5 border-white/10 text-xs text-gray-300 font-medium px-3 py-1">
                                                            +{match.candidate.skills.length - 3}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
