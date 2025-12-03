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
                <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                    <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 text-3xl font-bold">
                        {profile?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">
                        {profile?.first_name} {profile?.last_name}
                    </h2>
                    <p className="text-sm text-slate-500">{profile?.target_role || 'User'}</p>
                </div>
            </div>

            {/* Main Form */}
            <div className="md:col-span-2 space-y-6">
                <form action={handleSubmit}>
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm mb-6">
                        <h3 className="mb-4 text-lg font-semibold text-slate-900">Personal Information</h3>
                        <div className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="firstName">First Name</Label>
                                    <div className="relative mt-1">
                                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <Input
                                            id="firstName"
                                            name="firstName"
                                            defaultValue={profile?.first_name || ''}
                                            className="pl-10"
                                            placeholder="John"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <div className="relative mt-1">
                                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <Input
                                            id="lastName"
                                            name="lastName"
                                            defaultValue={profile?.last_name || ''}
                                            className="pl-10"
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <div className="relative mt-1">
                                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        defaultValue={user?.email || ''}
                                        className="pl-10 bg-gray-50"
                                        disabled
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="location">Location</Label>
                                <div className="relative mt-1">
                                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <Input
                                        id="location"
                                        name="location"
                                        defaultValue={profile?.location || ''}
                                        className="pl-10"
                                        placeholder="New York, USA"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm mb-6">
                        <h3 className="mb-4 text-lg font-semibold text-slate-900">Skills & Preferences</h3>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="targetRole">Target Role</Label>
                                <div className="relative mt-1">
                                    <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <Input
                                        id="targetRole"
                                        name="targetRole"
                                        defaultValue={profile?.target_role || ''}
                                        className="pl-10"
                                        placeholder="Senior Frontend Developer"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="skills">Top Skills (Comma separated)</Label>
                                <textarea
                                    id="skills"
                                    name="skills"
                                    rows={3}
                                    defaultValue={profile?.skills?.join(', ') || ''}
                                    className="w-full mt-1 rounded-lg border border-slate-200 p-3 text-sm focus:border-teal-500 focus:outline-none"
                                    placeholder="React, TypeScript, Next.js"
                                />
                            </div>
                        </div>
                    </div>

                    <ResumeUpload initialResumeUrl={profile?.resume_url} />

                    {message && (
                        <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="flex justify-end">
                        <Button type="submit" disabled={isLoading} className="bg-teal-600 hover:bg-teal-700">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
