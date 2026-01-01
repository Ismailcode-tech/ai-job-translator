import { createClient } from '@/utils/supabase/server';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    ShieldCheck,
    ShieldAlert,
    XCircle,
    Building2,
    Clock,
    ArrowLeft,
    Shield,
    Lock,
    Eye
} from 'lucide-react';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';

export default async function ConsentManagementPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/login');

    // Fetch Active Consents (Active Matches)
    // Fetch Active Consents (Active Matches)
    const { data: consentsData } = await supabase
        .from('mediator_matches')
        .select(`
            *,
            job_posts (title, company_id)
        `)
        .eq('user_id', user.id)
        .eq('status', 'active'); // Only active connections

    // Manual fetch for companies
    const companyIds = new Set<string>();
    consentsData?.forEach((r: any) => {
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

    const consents = consentsData?.map((item: any) => ({
        ...item,
        company_name: detailsMap[item.job_posts?.company_id]?.company_name || 'Confidential Partner'
    }));

    async function handleRevoke(matchId: string) {
        'use server';
        const supabase = await createClient();
        await supabase
            .from('mediator_matches')
            .update({ status: 'closed' }) // Or 'revoked' if we had that state. 'closed' works for now.
            .eq('id', matchId);

        revalidatePath('/dashboard/settings/consent');
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/settings">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight">Consent Management</h1>
                        <p className="text-gray-400 mt-1">Manage corporate access to your private profile details.</p>
                    </div>
                </div>
            </div>

            {/* Information Banner */}
            <Card className="bg-slate-900/40 backdrop-blur-md border-indigo-500/20 overflow-hidden shadow-2xl">
                <CardContent className="p-6">
                    <div className="flex items-start gap-5">
                        <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 border border-indigo-500/10">
                            <Eye className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-white mb-1 uppercase tracking-tight">Access Control</h3>
                            <p className="text-gray-400 text-sm leading-relaxed font-medium">
                                Companies listed below have received your <span className="text-indigo-400 font-black">explicit consent</span> to view your contact information and full resume. You can revoke this access at any time.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6">
                {consents?.map((item: any) => (
                    <Card key={item.id} className="bg-slate-900/40 backdrop-blur-md border-white/5 hover:border-indigo-500/30 transition-all duration-300 group overflow-hidden shadow-2xl relative">
                        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                            <ShieldCheck className="h-48 w-48 text-emerald-400" />
                        </div>
                        <CardHeader className="p-8 pb-4">
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors">
                                            <Building2 className="w-5 h-5 text-indigo-400" />
                                        </div>
                                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] uppercase font-black tracking-widest px-2 py-0.5">
                                            Active Connection
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors tracking-tight">
                                        {item.company_name}
                                    </CardTitle>
                                    <CardDescription className="text-gray-400 font-bold flex items-center gap-2 text-base">
                                        for <span className="text-gray-200">{item.job_posts?.title}</span>
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 pt-4 space-y-6">
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                                <p className="text-sm text-gray-300 font-medium leading-relaxed">
                                    Full access granted on <span className="text-emerald-400 font-bold">{new Date(item.created_at).toLocaleDateString()}</span>
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-8 text-xs font-black uppercase tracking-widest text-gray-500">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-indigo-500/60" />
                                    Last Sync: {new Date(item.updated_at).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-2 text-emerald-400/80">
                                    <Lock className="w-4 h-4" />
                                    Encrypted Channel
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex gap-4 justify-end border-t border-white/5 bg-white/5 p-8">
                            <form action={handleRevoke.bind(null, item.id)}>
                                <Button
                                    className="h-12 px-8 bg-rose-500/10 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-500/20 border-0 font-black text-sm uppercase tracking-widest transition-all rounded-xl"
                                >
                                    <XCircle className="w-5 h-5 mr-3" />
                                    Revoke Access
                                </Button>
                            </form>
                        </CardFooter>
                    </Card>
                ))}

                {(!consents || consents.length === 0) && (
                    <Card className="bg-slate-900/40 backdrop-blur-md border-white/5 border-dashed p-16 text-center shadow-xl">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShieldAlert className="w-10 h-10 text-gray-700" />
                        </div>
                        <h3 className="text-xl font-black text-gray-300">No Active Connections</h3>
                        <p className="text-gray-500 text-sm mt-3 max-w-sm mx-auto font-medium">
                            You haven't granted persistent access to any companies yet. When you do, they will appear here for management.
                        </p>
                    </Card>
                )}
            </div>
        </div>
    );
}
