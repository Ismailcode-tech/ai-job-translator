'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Building2, Loader2 } from 'lucide-react';
import { signup } from '../login/actions';

export default function SignUp() {
    const searchParams = useSearchParams();
    const [userType, setUserType] = useState<'individual' | 'company'>('individual');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const typeParam = searchParams.get('type');
        if (typeParam === 'company' || typeParam === 'individual') {
            setUserType(typeParam);
        }
    }, [searchParams]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        // Add user type to form data
        formData.append('userType', userType);

        const result = await signup(formData);

        if (result?.error) {
            setError(result.error);
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950/20 to-gray-950 flex items-center justify-center p-6">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <Logo className="justify-center mb-4" />
                    <h1 className="text-2xl font-bold text-white">Create Your Account</h1>
                    <p className="text-gray-400 mt-2">Join MEDYX today</p>
                </div>

                <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
                    <CardHeader>
                        <CardTitle>Sign Up</CardTitle>
                        <CardDescription>Choose your account type to get started</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={userType} onValueChange={(v) => setUserType(v as 'individual' | 'company')}>
                            <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="individual" className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Individual
                                </TabsTrigger>
                                <TabsTrigger value="company" className="flex items-center gap-2">
                                    <Building2 className="w-4 h-4" />
                                    Company
                                </TabsTrigger>
                            </TabsList>

                            <form onSubmit={handleSubmit}>
                                <TabsContent value="individual" className="space-y-4 mt-0">
                                    <div className="space-y-2">
                                        <Label htmlFor="fullName">Full Name</Label>
                                        <Input
                                            id="fullName"
                                            name="fullName"
                                            type="text"
                                            placeholder="John Doe"
                                            required
                                            className="bg-gray-800 border-gray-700"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="you@example.com"
                                            required
                                            className="bg-gray-800 border-gray-700"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            placeholder="+1 (555) 000-0000"
                                            className="bg-gray-800 border-gray-700"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            placeholder="••••••••"
                                            required
                                            className="bg-gray-800 border-gray-700"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400">
                                        Your profile will remain anonymous until you grant consent to companies.
                                    </p>
                                </TabsContent>

                                <TabsContent value="company" className="space-y-4 mt-0">
                                    <div className="space-y-2">
                                        <Label htmlFor="companyName">Company Name</Label>
                                        <Input
                                            id="companyName"
                                            name="companyName"
                                            type="text"
                                            placeholder="Acme Corp"
                                            required
                                            className="bg-gray-800 border-gray-700"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Work Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="you@company.com"
                                            required
                                            className="bg-gray-800 border-gray-700"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            placeholder="+1 (555) 000-0000"
                                            className="bg-gray-800 border-gray-700"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            placeholder="••••••••"
                                            required
                                            className="bg-gray-800 border-gray-700"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400">
                                        You'll need to activate your subscription before accessing the platform.
                                    </p>
                                </TabsContent>

                                {error && (
                                    <div className="mt-4 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded p-3">
                                        {error}
                                    </div>
                                )}

                                <div className="mt-6 space-y-4">
                                    <div className="text-xs text-gray-400">
                                        By signing up, you agree to our{' '}
                                        <Link href="/terms" className="text-cyan-400 hover:text-cyan-300">Terms of Service</Link>
                                        {' '}and{' '}
                                        <Link href="/privacy" className="text-cyan-400 hover:text-cyan-300">Privacy Policy</Link>
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Creating account...
                                            </>
                                        ) : (
                                            'Create Account'
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Tabs>
                    </CardContent>
                    <CardFooter>
                        <p className="text-sm text-center text-gray-400 w-full">
                            Already have an account?{' '}
                            <Link href="/login" className="text-cyan-400 hover:text-cyan-300">
                                Sign in
                            </Link>
                        </p>
                    </CardFooter>
                </Card>

                <div className="mt-6 text-center">
                    <Link href="/" className="text-sm text-gray-400 hover:text-cyan-400">
                        ← Back to home
                    </Link>
                </div>
            </div>
        </div>
    );
}
