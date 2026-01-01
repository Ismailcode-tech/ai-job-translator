import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { ActivationOverlay } from '@/components/dashboard/activation-overlay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Building2,
    Globe,
    Mail,
    MapPin,
    Save,
    User,
    Users,
    ShieldCheck,
    TrendingUp,
    Briefcase
} from 'lucide-react';
import { revalidatePath } from 'next/cache';
import { Badge } from '@/components/ui/badge';

export default async function CompanyProfilePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/login');

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (!profile?.is_activated) {
        return <ActivationOverlay />;
    }

    // Fetch some quick stats for the profile view
    const { count: opportunitiesCount } = await supabase
        .from('job_posts')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', user.id);

    const { count: matchesCount } = await supabase
        .from('mediator_matches')
        .select('*', { count: 'exact', head: true });

    async function updateCompanyProfile(formData: FormData) {
        'use server';
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const company_name = formData.get('company_name') as string;
        const company_website = formData.get('company_website') as string;
        const location = formData.get('location') as string;
        const bio = formData.get('bio') as string;

        const { error } = await supabase
            .from('profiles')
            .update({
                company_name,
                company_website,
                location,
                bio,
                updated_at: new Date().toISOString()
            })
            .eq('id', user.id);

        if (error) throw error;
        revalidatePath('/dashboard/company/profile');
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">Company Profile</h1>
                        <p className="text-gray-400 mt-1">Manage your organization's identity and culture.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="bg-slate-900/40 backdrop-blur-md border-white/5 p-6 text-center flex flex-col items-center justify-center space-y-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center border border-indigo-500/20 shadow-xl group hover:scale-105 transition-transform duration-500">
                        <Building2 className="w-12 h-12 text-indigo-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white">{profile?.company_name || 'Organization'}</h2>
                        <div className="flex items-center justify-center mt-2 gap-2">
                            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] font-black uppercase tracking-widest px-2 h-5">
                                <ShieldCheck className="w-3 h-3 mr-1" />
                                Verified Entity
                            </Badge>
                        </div>
                    </div>
                </Card>

                <Card className="bg-slate-900/40 backdrop-blur-md border-white/5 p-6 flex items-center gap-5">
                    <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center text-indigo-400">
                        <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Active Roles</p>
                        <p className="text-2xl font-black text-white italic leading-tight">{opportunitiesCount || 0}</p>
                    </div>
                </Card>

                <Card className="bg-slate-900/40 backdrop-blur-md border-white/5 p-6 flex items-center gap-5">
                    <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center text-cyan-400">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Matches In Pipeline</p>
                        <p className="text-2xl font-black text-white italic leading-tight">{matchesCount || 0}</p>
                    </div>
                </Card>
            </div>

            <form action={updateCompanyProfile} className="space-y-6">
                <Card className="bg-slate-900/40 backdrop-blur-md border-white/5 p-0 overflow-hidden">
                    <CardHeader className="p-8 border-b border-white/5">
                        <CardTitle className="text-xl font-black text-white flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-indigo-400" />
                            Profile Configuration
                        </CardTitle>
                        <CardDescription className="text-gray-400 font-medium">
                            These details represent your organization to prospective talent.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <Label htmlFor="company_name" className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Organization Name</Label>
                                <Input
                                    id="company_name"
                                    name="company_name"
                                    defaultValue={profile?.company_name || profile?.name || ''}
                                    placeholder="Acme Inc."
                                    required
                                    className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:ring-indigo-500/50"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="company_website" className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Official Website</Label>
                                <div className="relative">
                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-400" />
                                    <Input
                                        id="company_website"
                                        name="company_website"
                                        defaultValue={profile?.company_website || ''}
                                        placeholder="https://acme.org"
                                        className="bg-white/5 border-white/10 text-white h-12 pl-12 rounded-xl focus:ring-indigo-500/50"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="location" className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Headquarters Location</Label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-400" />
                                <Input
                                    id="location"
                                    name="location"
                                    defaultValue={profile?.location || ''}
                                    placeholder="San Francisco, CA (or Remote)"
                                    className="bg-white/5 border-white/10 text-white h-12 pl-12 rounded-xl focus:ring-indigo-500/50"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center px-1">
                                <Label htmlFor="bio" className="text-[10px] font-black text-gray-500 uppercase tracking-widest">About the Organization</Label>
                                <span className="text-[10px] font-bold text-indigo-400/60 uppercase">Vision & Mission</span>
                            </div>
                            <Textarea
                                id="bio"
                                name="bio"
                                defaultValue={profile?.bio || ''}
                                placeholder="Describe your company culture, mission, and unique value proposition..."
                                className="bg-white/5 border-white/10 text-white min-h-[180px] rounded-2xl focus:ring-indigo-500/50 p-4 leading-relaxed"
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end pt-4">
                    <Button type="submit" className="h-14 px-12 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 border-0 text-white font-black text-lg shadow-xl shadow-indigo-600/20 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]">
                        <Save className="mr-2 h-5 w-5" />
                        Synchronize Profile
                    </Button>
                </div>
            </form>
        </div>
    );
}
