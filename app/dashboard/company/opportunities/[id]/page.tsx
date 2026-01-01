import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Briefcase, MapPin, DollarSign, Clock, Save } from 'lucide-react';
import Link from 'next/link';
import { updateJob } from '../actions';

export default async function EditOpportunityPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/login');

    const { id } = await params;

    const { data: job } = await supabase
        .from('job_posts')
        .select('*')
        .eq('id', id)
        .eq('company_id', user.id)
        .single();

    if (!job) {
        redirect('/dashboard/company/opportunities');
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/company/opportunities">
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-white mb-1">Edit Opportunity</h1>
                    <p className="text-gray-400 font-medium">Update job details and requirements.</p>
                </div>
            </div>

            <form action={updateJob}>
                <input type="hidden" name="id" value={job.id} />
                <Card className="bg-slate-900/40 backdrop-blur-md border-white/5 overflow-hidden">
                    <CardHeader className="border-b border-white/5 bg-white/5 px-8 py-6">
                        <CardTitle className="text-xl text-white">Job Details</CardTitle>
                        <CardDescription className="text-gray-400">Define the core attributes of the role.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="space-y-3">
                            <Label htmlFor="title" className="text-gray-300 font-medium ml-1">Job Title</Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Briefcase className="h-4 w-4 text-gray-500" />
                                </div>
                                <Input
                                    id="title"
                                    name="title"
                                    defaultValue={job.title}
                                    required
                                    className="bg-white/5 border-white/10 text-white pl-11 h-12 rounded-xl focus:ring-indigo-500/50 focus:border-indigo-500"
                                    placeholder="e.g. Senior Frontend Engineer"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label htmlFor="location" className="text-gray-300 font-medium ml-1">Location</Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <MapPin className="h-4 w-4 text-gray-500" />
                                    </div>
                                    <Input
                                        id="location"
                                        name="location"
                                        defaultValue={job.location}
                                        required
                                        className="bg-white/5 border-white/10 text-white pl-11 h-12 rounded-xl focus:ring-indigo-500/50 focus:border-indigo-500"
                                        placeholder="e.g. Remote, London, NYC"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="type" className="text-gray-300 font-medium ml-1">Employment Type</Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Clock className="h-4 w-4 text-gray-500" />
                                    </div>
                                    <select
                                        id="type"
                                        name="type"
                                        defaultValue={job.employment_type}
                                        className="w-full bg-white/5 border border-white/10 text-white pl-11 h-12 rounded-xl focus:ring-indigo-500/50 focus:border-indigo-500 appearance-none"
                                    >
                                        <option value="Full-time" className="bg-slate-900 text-white">Full-time</option>
                                        <option value="Contract" className="bg-slate-900 text-white">Contract</option>
                                        <option value="Part-time" className="bg-slate-900 text-white">Part-time</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="salary_range" className="text-gray-300 font-medium ml-1">Salary Range</Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <DollarSign className="h-4 w-4 text-gray-500" />
                                </div>
                                <Input
                                    id="salary_range"
                                    name="salary_range"
                                    defaultValue={job.salary_range}
                                    className="bg-white/5 border-white/10 text-white pl-11 h-12 rounded-xl focus:ring-indigo-500/50 focus:border-indigo-500"
                                    placeholder="e.g. $120k - $160k"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="description" className="text-gray-300 font-medium ml-1">Job Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                defaultValue={job.description || job.original_text}
                                required
                                rows={8}
                                className="bg-white/5 border-white/10 text-white rounded-xl focus:ring-indigo-500/50 focus:border-indigo-500 resize-y min-h-[150px]"
                                placeholder="Paste the full job description here..."
                            />
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button type="submit" className="h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 rounded-xl shadow-lg shadow-indigo-600/20 transition-all">
                                <Save className="mr-2 h-5 w-5" />
                                Save Changes
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}
