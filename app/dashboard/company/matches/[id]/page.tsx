import { createClient } from '@/utils/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
    ArrowLeft,
    CheckCircle,
    Lock,
    ShieldAlert,
    Sparkles,
    User,
    FileText,
    Clock,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    Zap,
    History
} from 'lucide-react';
import Link from 'next/link';
import { requestCandidate } from '../../actions';
import { redirect } from 'next/navigation';

export default async function MatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/login');

    // Parallel Data Fetching
    const [matchResponse, auditResponse] = await Promise.all([
        supabase
            .from('mediator_matches')
            .select(`
                *,
                candidate:profiles(id, experience_years, bio, skills, location, employment_type), 
                job:job_posts(title)
            `)
            .select(`
                *,
                candidate:profiles(id, experience_years, bio, skills, location), 
                job:job_posts!inner(title, company_id)
            `)
            .eq('id', (await params).id)
            .eq('job.company_id', user.id) // Security Check
            .single(),
        supabase
            .from('audit_logs')
            .select('*')
            .eq('entity_id', (await params).id)
            .order('created_at', { ascending: true })
    ]);

    const match = matchResponse.data;
    const auditLogs = auditResponse.data || [];

    if (!match) return <div className="p-12 text-center text-gray-500 italic">Match decision not found.</div>;

    const isAnonymized = match.status === 'suggested' || match.status === 'consented';
    const statusColor = {
        'suggested': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        'consented': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        'active': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        'closed': 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }[match.status as string] || 'bg-gray-500/10';

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/company/pipeline">
                        <Button variant="ghost" size="icon" className="h-10 w-10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition-all">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-black text-white tracking-tight">Match Review</h1>
                            <Badge className={`px-2.5 py-0.5 rounded-lg border text-[10px] font-black uppercase tracking-widest ${statusColor}`}>
                                {match.status}
                            </Badge>
                        </div>
                        <p className="text-gray-400 mt-1 flex items-center gap-2">
                            Reviewing for <span className="font-bold text-indigo-400">{match.job?.title}</span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: Profile & AI Analysis */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Hero Card */}
                    <Card className="bg-slate-900/40 backdrop-blur-md border-white/5 overflow-hidden group">
                        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-600/10 p-6 border-b border-white/5">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div className="flex items-center gap-5">
                                    <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 flex items-center justify-center border border-indigo-500/20 shadow-xl group-hover:scale-105 transition-transform duration-500">
                                        {match.status === 'active' ? (
                                            <User className="h-10 w-10 text-indigo-400" />
                                        ) : (
                                            <Lock className="h-10 w-10 text-indigo-400 opacity-50" />
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-white">
                                            {isAnonymized ? `Candidate Profile` : 'Unlocked Candidate'}
                                        </h2>
                                        <div className="flex items-center mt-2 gap-3">
                                            <Badge variant="outline" className="bg-white/5 border-white/10 text-[10px] font-black uppercase text-gray-400 h-6">
                                                ID: {match.candidate?.id.slice(0, 8)}
                                            </Badge>
                                            <div className="flex items-center text-xs font-bold text-gray-500 gap-1.5">
                                                <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                                                {match.candidate?.experience_years}y Experience
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center md:text-right bg-white/5 p-4 rounded-2xl border border-white/5 min-w-[120px]">
                                    <div className="text-4xl font-black text-indigo-400 italic leading-none">{match.ai_score}%</div>
                                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Match Score</div>
                                </div>
                            </div>
                        </div>

                        <CardContent className="p-8 space-y-8">
                            {/* AI Insights Section */}
                            <div className="space-y-6">
                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-indigo-400" />
                                    AI Matching Intelligence
                                </h3>
                                <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5">
                                        <Zap className="w-16 h-16 text-indigo-400" />
                                    </div>
                                    <p className="text-sm font-medium leading-relaxed text-gray-300 italic relative z-10">
                                        "{match.match_reason}"
                                    </p>
                                </div>
                            </div>

                            <Tabs defaultValue="experience" className="w-full">
                                <TabsList className="bg-white/5 border border-white/5 p-1 rounded-xl h-11 mb-6">
                                    <TabsTrigger value="experience" className="rounded-lg data-[state=active]:bg-indigo-600 font-bold px-6">Overview</TabsTrigger>
                                    <TabsTrigger value="skills" className="rounded-lg data-[state=active]:bg-indigo-600 font-bold px-6">Skills</TabsTrigger>
                                    <TabsTrigger value="background" className="rounded-lg data-[state=active]:bg-indigo-600 font-bold px-6">Bio</TabsTrigger>
                                </TabsList>

                                <TabsContent value="experience" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            { label: 'Total Experience', value: `${match.candidate?.experience_years} Years`, icon: Clock },
                                            { label: 'Work Preference', value: match.candidate?.employment_type || 'Full-time', icon: Briefcase },
                                            { label: 'Location', value: match.candidate?.location || 'Remote', icon: MapPin },
                                            { label: 'Identity Status', value: isAnonymized ? 'Fully Anonymous' : 'Revealed', icon: ShieldAlert }
                                        ].map((item, i) => (
                                            <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-indigo-400">
                                                    <item.icon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{item.label}</div>
                                                    <div className="text-sm font-bold text-white uppercase">{item.value}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>

                                <TabsContent value="skills" className="animate-in fade-in slide-in-from-bottom-2">
                                    <div className="flex flex-wrap gap-2.5">
                                        {match.candidate?.skills?.map((skill: string) => (
                                            <Badge key={skill} className="px-4 py-2 bg-indigo-500/10 border-indigo-500/20 text-indigo-400 text-xs font-black rounded-xl">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </TabsContent>

                                <TabsContent value="background" className="animate-in fade-in slide-in-from-bottom-2">
                                    <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                                        <p className="text-sm text-gray-400 leading-relaxed font-medium">
                                            {match.candidate?.bio || "No professional summary provided."}
                                        </p>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>

                    {/* Timeline */}
                    <Card className="bg-slate-900/40 backdrop-blur-md border-white/5 overflow-hidden">
                        <CardHeader className="p-6 border-b border-white/5 bg-white/5">
                            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                                <History className="w-5 h-5 text-indigo-400" />
                                Audit Activity Timeline
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="relative border-l-2 border-white/5 ml-4 space-y-10">
                                {/* Base Event */}
                                <div className="relative pl-8">
                                    <div className="absolute -left-[11px] top-1.5 h-5 w-5 rounded-full bg-slate-900 border-4 border-white/10 group flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">AI Match Synthesized</p>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
                                            {new Date(match.created_at).toLocaleString()} • LOGGED BY MEDYX-CORE
                                        </p>
                                    </div>
                                </div>

                                {auditLogs.map((log: any) => (
                                    <div key={log.id} className="relative pl-8">
                                        <div className={`
                                            absolute -left-[11px] top-1.5 h-5 w-5 rounded-full bg-slate-900 border-4 flex items-center justify-center
                                            ${log.action === 'request_contact' ? 'border-amber-500/20' :
                                                log.action === 'grant_consent' ? 'border-emerald-500/20' : 'border-white/10'}
                                        `}>
                                            <div className={`
                                                w-1.5 h-1.5 rounded-full
                                                ${log.action === 'request_contact' ? 'bg-amber-500' :
                                                    log.action === 'grant_consent' ? 'bg-emerald-500' : 'bg-gray-500'}
                                            `} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white capitalize">{log.action.replace('_', ' ')}</p>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
                                                {new Date(log.created_at).toLocaleString()} • PID: {log.actor_id.slice(0, 8)}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                {match.status === 'active' && (
                                    <div className="relative pl-8">
                                        <div className="absolute -left-[11px] top-1.5 h-5 w-5 rounded-full bg-slate-900 border-4 border-emerald-500/20 animate-pulse flex items-center justify-center">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-emerald-400">Connection Fully Established</p>
                                            <p className="text-[10px] text-emerald-500/60 font-bold uppercase tracking-widest mt-0.5">RECRUITER REVEAL COMPLETE</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar: Actions */}
                <div className="space-y-8">
                    <Card className="bg-slate-900/40 backdrop-blur-md border border-indigo-500/20 overflow-hidden">
                        <div className="bg-indigo-600/10 p-6 border-b border-indigo-500/10">
                            <h3 className="text-lg font-black text-white flex items-center gap-2">
                                <Zap className="w-5 h-5 text-indigo-400" />
                                Action Panel
                            </h3>
                        </div>
                        <CardContent className="p-6 space-y-6">
                            {match.status === 'suggested' && (
                                <div className="space-y-4">
                                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-3">
                                        <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0" />
                                        <p className="text-xs font-medium text-amber-400 leading-relaxed">
                                            Requesting contact information uses <b>1 Opportunity Credit</b>. Candidates must explicitly grant consent.
                                        </p>
                                    </div>
                                    <form action={async () => {
                                        'use server';
                                        await requestCandidate(match.id);
                                    }}>
                                        <Button className="w-full h-14 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 border-0 text-white font-black text-lg shadow-xl shadow-indigo-600/20 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]">
                                            Request Contact
                                        </Button>
                                    </form>
                                </div>
                            )}

                            {match.status === 'consented' && (
                                <div className="space-y-4">
                                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3">
                                        <Clock className="w-5 h-5 text-blue-400 shrink-0" />
                                        <p className="text-xs font-medium text-blue-400 leading-relaxed">
                                            Consent request sent. The candidate has been notified via the MEDYX portal.
                                        </p>
                                    </div>
                                    <Button disabled className="w-full h-14 bg-white/5 border border-white/10 text-gray-500 font-black rounded-xl cursor-not-allowed">
                                        Awaiting Candidate...
                                    </Button>
                                </div>
                            )}

                            {match.status === 'active' && (
                                <div className="space-y-6">
                                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex gap-3">
                                        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                                        <div>
                                            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Access Granted</p>
                                            <p className="text-[10px] text-emerald-500/70 font-medium leading-relaxed mt-1">
                                                Identity lock released. You can now view contact details below.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="p-4 bg-white/5 border border-white/5 rounded-xl shadow-inner group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                                                    <Mail className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 overflow-hidden">
                                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Email Address</p>
                                                    <p className="text-sm font-bold text-white truncate">Contact details on profile...</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-white/5 border border-white/5 rounded-xl shadow-inner group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                                                    <Phone className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 overflow-hidden">
                                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Phone Number</p>
                                                    <p className="text-sm font-bold text-white truncate">Unlocked via MEDYX</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Link href="/dashboard/company/pipeline" className="block">
                                        <Button className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl shadow-xl shadow-emerald-600/20 transition-all">
                                            Message Candidate
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Info Card */}
                    <Card className="bg-gradient-to-br from-slate-900 to-indigo-950/20 border-white/5 p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-12 transition-transform duration-700">
                            <Sparkles className="w-24 h-24 text-white" />
                        </div>
                        <h4 className="text-sm font-black text-white mb-4 uppercase tracking-widest">Mediator Insights</h4>
                        <ul className="space-y-4 relative z-10">
                            {[
                                'Matches are refreshed every 24 hours based on AI updates.',
                                'Expired opportunities automatically archive matches.',
                                'Credits are non-refundable after contact reveals.'
                            ].map((note, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                                    <p className="text-xs text-gray-400 font-medium leading-relaxed">{note}</p>
                                </li>
                            ))}
                        </ul>
                    </Card>
                </div>
            </div>
        </div>
    );
}
