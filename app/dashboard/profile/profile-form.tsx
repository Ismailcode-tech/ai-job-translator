'use client';

import { User, Mail, MapPin, Briefcase, Save, Loader2 } from 'lucide-react';
import { updateProfile } from './actions';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ResumeUpload from './resume-upload';

interface ProfileFormProps {
    user: any;
    profile: any;
}

export default function ProfileForm({ user, profile }: ProfileFormProps) {
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
        <div className="grid gap-8 md:grid-cols-3">
            {/* Sidebar / Avatar */}
            <div className="md:col-span-1">
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sticky top-8">
                    <div className="mx-auto mb-6 h-32 w-32 rounded-full bg-teal-50 border-4 border-white shadow-lg flex items-center justify-center text-teal-600 text-4xl font-bold ring-2 ring-teal-100">
                        {profile?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-1">
                        {profile?.first_name} {profile?.last_name}
                    </h2>
                    <p className="text-sm font-medium text-slate-500 mb-4">{profile?.target_role || 'User'}</p>
                    <div className="w-full h-px bg-slate-100 my-4" />
                    <div className="text-xs text-slate-400">
                        Profile Completion
                        <div className="mt-2 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                            <div className="h-full bg-teal-500 rounded-full" style={{ width: '80%' }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Form */}
            <div className="md:col-span-2 space-y-6">
                <form action={handleSubmit}>
                    {/* Personal Information Card */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <User className="h-5 w-5" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName" className="text-slate-700 font-medium">First Name</Label>
                                    <div className="relative">
                                        <Input
                                            id="firstName"
                                            name="firstName"
                                            defaultValue={profile?.first_name || ''}
                                            className="h-11 border-slate-200 focus:border-teal-500 focus:ring-teal-500/20"
                                            placeholder="John"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName" className="text-slate-700 font-medium">Last Name</Label>
                                    <div className="relative">
                                        <Input
                                            id="lastName"
                                            name="lastName"
                                            defaultValue={profile?.last_name || ''}
                                            className="h-11 border-slate-200 focus:border-teal-500 focus:ring-teal-500/20"
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        defaultValue={user?.email || ''}
                                        className="pl-10 h-11 bg-slate-50 border-slate-200 text-slate-500"
                                        disabled
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location" className="text-slate-700 font-medium">Location</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <Input
                                        id="location"
                                        name="location"
                                        defaultValue={profile?.location || ''}
                                        className="pl-10 h-11 border-slate-200 focus:border-teal-500 focus:ring-teal-500/20"
                                        placeholder="e.g. New York, USA"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Skills & Preferences Card */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                <Briefcase className="h-5 w-5" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Professional Profile</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="targetRole" className="text-slate-700 font-medium">Target Role</Label>
                                <Input
                                    id="targetRole"
                                    name="targetRole"
                                    defaultValue={profile?.target_role || ''}
                                    className="h-11 border-slate-200 focus:border-teal-500 focus:ring-teal-500/20"
                                    placeholder="e.g. Senior Frontend Developer"
                                />
                                <p className="text-xs text-slate-500">Also used as your default job search title.</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="skills" className="text-slate-700 font-medium">Top Skills</Label>
                                <textarea
                                    id="skills"
                                    name="skills"
                                    rows={3}
                                    defaultValue={profile?.skills?.join(', ') || ''}
                                    className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 focus:outline-none transition-all resize-none"
                                    placeholder="e.g. React, TypeScript, Node.js, AWS..."
                                />
                                <p className="text-xs text-slate-500">Separate skills with commas. These help prioritize analysis results.</p>
                            </div>
                        </div>
                    </div>

                    <div className="my-6">
                        <ResumeUpload initialResumeUrl={profile?.resume_url} />
                    </div>

                    {message && (
                        <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="flex justify-end pt-4">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-6 h-auto text-base font-semibold shadow-lg shadow-teal-600/20 transition-all hover:scale-[1.02]"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Saving Changes...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-5 w-5" />
                                    Save Profile Changes
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
