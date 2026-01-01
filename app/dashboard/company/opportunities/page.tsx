import { createClient } from '@/utils/supabase/server';
export const dynamic = 'force-dynamic';
import { redirect } from 'next/navigation';
import { ActivationOverlay } from '@/components/dashboard/activation-overlay';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { duplicateJob, deleteJob } from './actions';
import {
    Plus,
    MoreVertical,
    Edit,
    Copy,
    Trash,
    Eye,
    Briefcase,
    MapPin,
    Calendar,
    Clock,
    Trash2
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default async function OpportunitiesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/login');

    // Check activation status
    const { data: profile } = await supabase.from('profiles').select('is_activated').eq('id', user.id).single();
    if (!profile?.is_activated) {
        return <ActivationOverlay />;
    }

    // Fetch jobs/opportunities
    const { data: jobs } = await supabase
        .from('job_posts')
        .select(`
            *,
            mediator_matches(count)
        `)
        .eq('company_id', user.id)
        .order('created_at', { ascending: false });

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">Opportunities</h1>
                        <p className="text-gray-400 mt-1">Manage your active job postings and candidate requirements.</p>
                    </div>
                </div>
                <Link href="/dashboard/company/opportunities/create">
                    <Button className="h-12 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 border-0 text-white shadow-xl shadow-indigo-600/20 font-bold px-6 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]">
                        <Plus className="mr-2 h-5 w-5" />
                        Create Opportunity
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6">
                {(!jobs || jobs.length === 0) ? (
                    <Card className="bg-slate-900/40 backdrop-blur-md border-dashed border-white/10">
                        <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                                <Plus className="h-10 w-10 text-gray-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Build Your Pipeline</h3>
                            <p className="text-gray-400 max-w-sm mb-8">
                                Create your first opportunity to allow our AI to match you with vetted, anonymous talent.
                            </p>
                            <Link href="/dashboard/company/opportunities/create">
                                <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-11 px-8 rounded-xl shadow-lg shadow-indigo-600/20">
                                    Launch First Opportunity
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    jobs.map((job: any) => (
                        <Card key={job.id} className="bg-slate-900/40 backdrop-blur-md border-white/5 hover:border-white/10 transition-all duration-300 group overflow-hidden">
                            <CardContent className="p-0">
                                <div className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <h3 className="text-xl font-black text-white group-hover:text-indigo-400 transition-colors">{job.title}</h3>
                                            <Badge className={`
                                                px-2.5 py-0.5 rounded-lg border text-[10px] font-black uppercase tracking-widest
                                                ${job.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                    job.status === 'draft' ? 'bg-gray-500/10 text-gray-400 border-gray-500/20' :
                                                        'bg-amber-500/10 text-amber-400 border-amber-500/20'}
                                            `}>
                                                {job.status || 'Draft'}
                                            </Badge>
                                        </div>

                                        <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-400">
                                            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg">
                                                <MapPin className="h-3.5 w-3.5 text-indigo-400" />
                                                {job.location || 'Remote'}
                                            </div>
                                            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg">
                                                <Clock className="h-3.5 w-3.5 text-indigo-400" />
                                                {job.employment_type || 'Full-time'}
                                            </div>
                                            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg">
                                                <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                                                Posted {new Date(job.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 w-full md:w-auto">
                                        <Link href={`/dashboard/company/matches?job=${job.id}`} className="flex-1 md:flex-none">
                                            <Button className="w-full bg-white/5 hover:bg-white/10 border-white/10 text-white font-bold h-11 px-6 rounded-xl flex items-center justify-center gap-2 transition-all">
                                                <Eye className="h-4 w-4" />
                                                <span>{job.mediator_matches?.[0]?.count || 0} Matches</span>
                                            </Button>
                                        </Link>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-11 w-11 rounded-xl bg-white/5 hover:bg-white/10 text-white">
                                                    <MoreVertical className="h-5 w-5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48 bg-slate-900 border-white/10 rounded-xl overflow-hidden shadow-2xl">
                                                <Link href={`/dashboard/company/opportunities/${job.id}`}>
                                                    <DropdownMenuItem className="py-2.5 focus:bg-white/5 text-white flex items-center gap-2 cursor-pointer">
                                                        <Edit className="h-4 w-4 text-indigo-400" />
                                                        <span className="font-bold">Edit Details</span>
                                                    </DropdownMenuItem>
                                                </Link>

                                                <form action={duplicateJob}>
                                                    <input type="hidden" name="id" value={job.id} />
                                                    <button type="submit" className="w-full">
                                                        <DropdownMenuItem className="py-2.5 focus:bg-white/5 text-white flex items-center gap-2 cursor-pointer">
                                                            <Copy className="h-4 w-4 text-indigo-400" />
                                                            <span className="font-bold">Duplicate</span>
                                                        </DropdownMenuItem>
                                                    </button>
                                                </form>

                                                <DropdownMenuSeparator className="bg-white/5" />

                                                <form action={deleteJob}>
                                                    <input type="hidden" name="id" value={job.id} />
                                                    <button type="submit" className="w-full">
                                                        <DropdownMenuItem className="py-2.5 focus:bg-red-500/10 text-red-500 flex items-center gap-2 cursor-pointer">
                                                            <Trash2 className="h-4 w-4" />
                                                            <span className="font-bold">Delete</span>
                                                        </DropdownMenuItem>
                                                    </button>
                                                </form>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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
