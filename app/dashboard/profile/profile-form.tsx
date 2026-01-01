'use client';

import { User, Mail, MapPin, Briefcase, Save, Loader2, UserCircle2, Phone, FileText, Award } from 'lucide-react';
import { updateProfile } from './actions';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import ResumeUpload from './resume-upload';
import { useTranslations } from 'next-intl';

interface ProfileFormProps {
    user: any;
    profile: any;
}

export default function ProfileForm({ user, profile }: ProfileFormProps) {
    const t = useTranslations('profile');
    const tCommon = useTranslations('common');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setMessage(null);

        const result = await updateProfile(formData);

        if (result.error) {
            setMessage({ type: 'error', text: result.error });
        } else if (result.success) {
            setMessage({ type: 'success', text: result.success });
        }

        setIsLoading(false);
    }

    return (
        <div className="grid gap-8 lg:grid-cols-3">
            {/* Sidebar / Avatar Preview */}
            <div className="lg:col-span-1">
                <Card className="bg-slate-900/40 backdrop-blur-md border-white/5 sticky top-8 shadow-xl">
                    <CardContent className="p-8 text-center">
                        <div className="mx-auto mb-6 h-32 w-32 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 p-1 shadow-xl shadow-cyan-500/20">
                            <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center text-white text-4xl font-bold border-4 border-slate-900">
                                {profile?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                            </div>
                        </div>
                        <h2 className="text-xl font-bold text-white mb-1">
                            {profile?.first_name} {profile?.last_name || ''}
                        </h2>
                        <p className="text-sm font-medium text-gray-400 mb-6">{profile?.target_role || 'Individual Partner'}</p>

                        <div className="space-y-4 text-left">
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                Profile Identity Locked
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                                <div className="flex items-center gap-3 text-sm text-gray-300 font-medium">
                                    <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
                                    Name hidden
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-300 font-medium">
                                    <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
                                    Email protected
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-300 font-medium">
                                    <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
                                    Phone number hidden
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Form Fields */}
            <div className="lg:col-span-2 space-y-8">
                <form action={handleSubmit} className="space-y-8">

                    {/* Professional Profile - Moved to top as per design */}
                    <Card className="bg-slate-900/40 backdrop-blur-md border-white/5 overflow-hidden shadow-xl">
                        <CardHeader className="border-b border-white/5 bg-white/5 px-8 py-6">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
                                    <Briefcase className="h-6 w-6" />
                                </div>
                                <div>
                                    <CardTitle className="text-white text-xl">Professional Information</CardTitle>
                                    <CardDescription className="text-gray-400">This information is shown anonymously to companies</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-3">
                                    <Label htmlFor="targetRole" className="text-gray-300 font-medium ml-1">Current Title</Label>
                                    <Input
                                        id="targetRole"
                                        name="targetRole"
                                        defaultValue={profile?.target_role || ''}
                                        className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:ring-cyan-500/50 focus:border-cyan-500 placeholder:text-gray-600"
                                        placeholder="Senior Developer"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="yearsOfExperience" className="text-gray-300 font-medium ml-1">Years of Experience</Label>
                                    <Input
                                        id="yearsOfExperience"
                                        name="yearsOfExperience"
                                        type="number"
                                        min="0"
                                        max="60"
                                        step="1"
                                        defaultValue={profile?.years_of_experience || ''}
                                        className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:ring-cyan-500/50 focus:border-cyan-500 placeholder:text-gray-600"
                                        placeholder="5"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="skills" className="text-gray-300 font-medium ml-1">Skills</Label>
                                <Input
                                    id="skills"
                                    name="skills"
                                    defaultValue={profile?.skills?.join(', ') || ''}
                                    className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:ring-cyan-500/50 focus:border-cyan-500 placeholder:text-gray-600"
                                    placeholder="React, Node.js, TypeScript, AWS, MongoDB"
                                />
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="professionalSummary" className="text-gray-300 font-medium ml-1">Professional Summary</Label>
                                <textarea
                                    id="professionalSummary"
                                    name="professionalSummary"
                                    rows={4}
                                    defaultValue={profile?.professional_summary || ''}
                                    className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white focus:ring-cyan-500/50 focus:border-cyan-500 focus:outline-none transition-all resize-none shadow-inner placeholder:text-gray-600"
                                    placeholder="Experienced full-stack developer passionate about building scalable web applications."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Personal Information */}
                    <Card className="bg-slate-900/40 backdrop-blur-md border-white/5 overflow-hidden shadow-xl">
                        <CardHeader className="border-b border-white/5 bg-white/5 px-8 py-6">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                                    <UserCircle2 className="h-6 w-6" />
                                </div>
                                <div>
                                    <CardTitle className="text-white text-xl">{t('personalInfo')}</CardTitle>
                                    <CardDescription className="text-gray-400">Basic identification details (Private)</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-3">
                                    <Label htmlFor="firstName" className="text-gray-300 font-medium ml-1">{t('firstName')}</Label>
                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        defaultValue={profile?.first_name || ''}
                                        className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:ring-cyan-500/50 focus:border-cyan-500 placeholder:text-gray-600"
                                        placeholder="John"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="lastName" className="text-gray-300 font-medium ml-1">{t('lastName')}</Label>
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        defaultValue={profile?.last_name || ''}
                                        className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:ring-cyan-500/50 focus:border-cyan-500 placeholder:text-gray-600"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-3">
                                    <Label htmlFor="email" className="text-gray-300 font-medium ml-1">{t('emailAddress')}</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        defaultValue={user?.email || ''}
                                        className="bg-white/5 border-white/10 text-gray-500 h-12 rounded-xl cursor-not-allowed opacity-60"
                                        disabled
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="phone" className="text-gray-300 font-medium ml-1">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        pattern="[0-9+ \(\)-]*"
                                        title="Please enter a valid phone number (digits, spaces, parentheses, and hyphens allowed)"
                                        defaultValue={profile?.phone || ''}
                                        className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:ring-cyan-500/50 focus:border-cyan-500 placeholder:text-gray-600"
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="location" className="text-gray-300 font-medium ml-1">{t('location')}</Label>
                                <Input
                                    id="location"
                                    name="location"
                                    defaultValue={profile?.location || ''}
                                    className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:ring-cyan-500/50 focus:border-cyan-500 placeholder:text-gray-600"
                                    placeholder="e.g. New York, USA"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Resume Upload */}
                    <div className="lg:col-span-2">
                        <ResumeUpload initialResumeUrl={profile?.resume_url} />
                    </div>

                    {/* Feedback Messages */}
                    {message && (
                        <div className={`p-4 rounded-2xl animate-in slide-in-from-top-2 flex items-center gap-3 font-medium border ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                            {message.type === 'success' ? <Save className="w-5 h-5" /> : <Loader2 className="w-5 h-5 scroll-m-0" />}
                            {message.text}
                        </div>
                    )}

                    {/* Simple Save Button as in design */}
                    <div className="pb-10">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-[#0f172a] hover:bg-[#1e293b] text-white px-8 py-6 h-auto text-sm font-bold rounded-xl border border-white/10 shadow-lg transition-all"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
