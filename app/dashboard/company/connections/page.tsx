import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Users,
    Mail,
    Phone,
    MessageSquare,
    Search,
    UserCircle,
    Building2,
    Briefcase,
    ChevronRight,
    MapPin,
    ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { MessageDialog } from './message-dialog';

export const dynamic = 'force-dynamic';

export default async function ConnectionsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/login');

    // Fetch Profile for security & activation check
    const { data: profile } = await supabase
        .from('profiles')
        .select('user_type, is_activated')
        .eq('id', user.id)
        .single();

    if (profile?.user_type !== 'company') redirect('/dashboard');

    // Fetch Active Connections
    // A connection is an 'active' match in mediator_matches table
    const { data: connections, error } = await supabase
        .from('mediator_matches')
        .select(`
            id,
            status,
            created_at,
            candidate:profiles (
                id,
                name,
                first_name,
                last_name,
                email,
                phone,
                location,
                bio,
                resume_url,
                preferred_job_categories
            ),
            job_posts (
                id,
                title,
                company_id
            )
        `)
        .eq('status', 'active')
        .eq('job_posts.company_id', user.id)
        .order('created_at', { ascending: false });

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight">Active Connections</h1>
                        <p className="text-gray-400 mt-1 font-medium">Manage your approved candidate connections and direct communication.</p>
                    </div>
                </div>

                {/* Search / Filter Placeholder */}
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search connections..."
                        className="bg-white/5 border border-white/10 text-white pl-12 pr-6 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 w-full md:w-64 transition-all"
                    />
                </div>
            </div>

            {/* Connections Grid */}
            {!connections || connections.length === 0 ? (
                <Card className="bg-slate-900/40 backdrop-blur-md border-white/5 border-dashed p-20 text-center shadow-xl">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <UserCircle className="w-10 h-10 text-gray-700" />
                    </div>
                    <h3 className="text-xl font-black text-gray-300">No Active Connections Yet</h3>
                    <p className="text-gray-500 text-sm mt-3 max-w-sm mx-auto font-medium leading-relaxed">
                        When candidates grant access to their full profile, they will appear here for direct outreach.
                    </p>
                    <div className="mt-8">
                        <Link href="/dashboard/company/pipeline">
                            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-xs px-8 h-12 rounded-xl">
                                Review Match Pipeline
                            </Button>
                        </Link>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {connections.map((conn: any) => {
                        const candidate = conn.candidate || {};
                        const fullName = candidate.name || `${candidate.first_name || ''} ${candidate.last_name || ''}`.trim() || 'Candidate Name';
                        const title = candidate.preferred_job_categories?.[0] || 'Professional';

                        return (
                            <Card key={conn.id} className="bg-slate-900/40 backdrop-blur-md border-white/5 hover:border-indigo-500/30 transition-all duration-300 group overflow-hidden shadow-2xl relative">
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row items-stretch">
                                        {/* Profile Summary Side */}
                                        <div className="p-8 flex-1 flex flex-col md:flex-row items-center md:items-start gap-6 border-b md:border-b-0 md:border-r border-white/5">
                                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-3xl shadow-inner overflow-hidden flex-shrink-0">
                                                {fullName[0].toUpperCase()}
                                            </div>
                                            <div className="text-center md:text-left space-y-2 py-1">
                                                <div className="flex items-center justify-center md:justify-start gap-3">
                                                    <h3 className="text-2xl font-black text-white tracking-tight group-hover:text-indigo-400 transition-colors">
                                                        {fullName}
                                                    </h3>
                                                    <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] uppercase font-black px-2 py-0.5">
                                                        Active
                                                    </Badge>
                                                </div>
                                                <p className="text-gray-400 font-bold text-sm tracking-wide uppercase">
                                                    {title}
                                                </p>
                                                {candidate.location && (
                                                    <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs text-gray-500 font-medium">
                                                        <MapPin className="w-3 h-3 text-indigo-500/60" />
                                                        {candidate.location}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Contact & Action Side */}
                                        <div className="p-8 bg-white/5 md:w-96 flex flex-col justify-between gap-6">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3 group/item">
                                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover/item:border-indigo-500/30 transition-all">
                                                        <Mail className="w-4 h-4 text-gray-400 group-hover/item:text-indigo-400" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Email Address</p>
                                                        <p className="text-sm font-bold text-white truncate">{candidate.email}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 group/item">
                                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover/item:border-indigo-500/30 transition-all">
                                                        <Phone className="w-4 h-4 text-gray-400 group-hover/item:text-indigo-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Phone Number</p>
                                                        <p className="text-sm font-bold text-white">{candidate.phone || '+1 (555) 000-0000'}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-3 mt-2">
                                                {candidate.resume_url ? (
                                                    <Link href={candidate.resume_url} target="_blank" className="flex-1">
                                                        <Button variant="outline" className="w-full bg-white/5 border-white/10 hover:bg-white/10 border-0 h-12 rounded-xl font-black text-xs uppercase tracking-widest text-gray-300">
                                                            View CV
                                                        </Button>
                                                    </Link>
                                                ) : (
                                                    <Button variant="outline" disabled className="flex-1 bg-white/5 border-white/10 border-0 h-12 rounded-xl font-black text-xs uppercase tracking-widest text-gray-500 cursor-not-allowed">
                                                        No CV
                                                    </Button>
                                                )}

                                                <MessageDialog
                                                    candidateEmail={candidate.email}
                                                    candidateName={fullName}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Role Link Info */}
                                    <div className="px-8 py-3 bg-indigo-500/5 border-t border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Briefcase className="w-3.5 h-3.5 text-indigo-400/60" />
                                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                                Matched for: <span className="text-gray-300">{conn.job_posts?.title}</span>
                                            </span>
                                        </div>
                                        <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                            Approved on {new Date(conn.created_at).toLocaleDateString()}
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
