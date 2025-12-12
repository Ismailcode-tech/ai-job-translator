'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Github, Mail, Lock, User, ArrowRight, Loader2, MapPin } from 'lucide-react';
import { signup } from '../login/actions';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function SignupPage() {
    const t = useTranslations('auth.signup');
    const tCommon = useTranslations('common');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setError(null);

        const result = await signup(formData);

        if (result?.error) {
            console.error('Signup error:', result.error);
            console.error('Full result:', result);
            setError(result.error);
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
                        {t('title')}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {t('subtitle')}
                    </p>
                </div>

                <form action={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="fullName">{t('name')}</Label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <Input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    className="pl-10"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="location">Location</Label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MapPin className="h-5 w-5 text-gray-400" />
                                </div>
                                <Input
                                    id="location"
                                    name="location"
                                    type="text"
                                    autoComplete="address-level2"
                                    required
                                    className="pl-10"
                                    placeholder="New York, USA"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="email">{t('email')}</Label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="pl-10"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="password">{t('password')}</Label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="pl-10"
                                    placeholder="••••••••"
                                    minLength={6}
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                            {error}
                        </div>
                    )}

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating account...
                            </>
                        ) : (
                            <>
                                Create account
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-700" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <Button variant="outline" className="w-full" disabled>
                            <Github className="mr-2 h-4 w-4" />
                            GitHub (Coming Soon)
                        </Button>
                    </div>
                </div>

                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?{' '}
                    <Link
                        href="/login"
                        className="font-medium text-blue-600 hover:text-blue-500"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
