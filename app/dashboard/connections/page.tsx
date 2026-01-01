import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Building2, MapPin, Mail, Phone, Briefcase } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function IndividualConnectionsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/login');

    const { data: profile } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', user.id)
        .single();

    if (profile?.user_type !== 'individual') redirect('/dashboard/company');

    // Fetch Active Connections
    // For individuals, a connection is a match where status = 'active'
    // We join job_posts to get company_id, then profiles for company details
    const { data: connections, error } = await supabase
        .from('mediator_matches')
        .select(`
            id,
            status,
            created_at,
            updated_at,
            job_posts (
                id,
                title,
                location,
                company_id,
                employment_type
            )
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('updated_at', { ascending: false });

    // Fetch company details
    const companyIds = Array.from(new Set((connections as any[])?.map(c => c.job_posts?.company_id).filter(Boolean)));

    let companiesMap: Record<string, any> = {};
    if (companyIds.length > 0) {
        const { data: companies } = await supabase
            .from('profiles')
            .select('id, company_name, name, location, company_website, contact_email:email')
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
                        <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight">Active Connections</h1>
                        <p className="text-gray-400 mt-1 font-medium">Companies you've granted consent to</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            {!connections || connections.length === 0 ? (
                <Card className="bg-slate-900/40 backdrop-blur-md border-white/5 border-dashed p-20 text-center shadow-xl">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Building2 className="w-10 h-10 text-gray-700" />
                    </div>
                    <h3 className="text-xl font-black text-gray-300">No Active Connections</h3>
                    <p className="text-gray-500 text-sm mt-3 max-w-sm mx-auto font-medium leading-relaxed">
                        When you approve a match request, the company connection will appear here.
                    </p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {connections.map((conn: any) => {
                        const job = conn.job_posts;
                        const company = companiesMap[job?.company_id] || {};
                        const companyName = company.company_name || company.name || 'Unknown Company';

                        return (
                            <Card key={conn.id} className="bg-slate-900/40 backdrop-blur-md border-white/5 hover:border-indigo-500/30 transition-all duration-300 group overflow-hidden shadow-xl">
                                <CardContent className="p-0">
                                    <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                                        <div className="flex items-start gap-6 w-full">
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 flex items-center justify-center border border-indigo-500/20 flex-shrink-0">
                                                <Building2 className="w-8 h-8 text-indigo-400" />
                                            </div>

                                            <div className="space-y-3 flex-1 min-w-0">
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <h3 className="text-xl font-black text-white group-hover:text-cyan-400 transition-colors truncate">
                                                        {companyName}
                                                    </h3>
                                                    <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] uppercase font-black px-2 py-0.5">
                                                        Active
                                                    </Badge>
                                                </div>

                                                <p className="text-gray-400 font-bold text-sm tracking-wide uppercase">
                                                    {job?.title}
                                                </p>

                                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 pt-1">
                                                    {company.contact_email && (
                                                        <div className="flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-gray-300 transition-colors">
                                                            <Mail className="w-3.5 h-3.5 text-indigo-500/60" />
                                                            {company.contact_email}
                                                        </div>
                                                    )}
                                                    {/* Company phone implies we fetch it, currently not standard for orgs but we can show placeholder if wanted, or omit */}
                                                </div>

                                                <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest pt-1">
                                                    Connected on {new Date(conn.updated_at || conn.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex-shrink-0 w-full md:w-auto">
                                            <Link href="/dashboard/requests">
                                                <Button className="w-full md:w-auto bg-white hover:bg-gray-100 text-slate-900 font-black uppercase text-xs tracking-widest px-6 h-10 rounded-lg shadow-lg shadow-white/5 transition-all">
                                                    View Details
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Footer with Job Context */}
                                    <div className="bg-white/5 px-8 py-3 border-t border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                                            <MapPin className="w-3.5 h-3.5 text-cyan-500/60" />
                                            {job?.location || company.location || 'Remote'}
                                        </div>
                                        {company.company_website && (
                                            <a
                                                href={company.company_website.startsWith('http') ? company.company_website : `https://${company.company_website}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-wider flex items-center gap-1"
                                            >
                                                Visit Website
                                                <span className="sr-only">external link</span>
                                            </a>
                                        )}
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
