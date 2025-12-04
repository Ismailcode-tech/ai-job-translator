'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { verifyEmail, resendVerificationEmail } from '../login/actions';

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const email = searchParams.get('email') || '';

    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isResending, setIsResending] = useState(false);

    async function handleVerify(e: React.FormEvent) {
        e.preventDefault();
        if (!email || !code) return;

        setIsLoading(true);
        setMessage(null);

        const result = await verifyEmail(email, code);

        if (result?.error) {
            setMessage({ type: 'error', text: result.error });
            setIsLoading(false);
        } else {
            setMessage({ type: 'success', text: 'Email verified successfully! Redirecting...' });
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);
        }
    }

    async function handleResend() {
        if (!email) return;
        setIsResending(true);
        setMessage(null);

        const result = await resendVerificationEmail(email);

        if (result?.error) {
            setMessage({ type: 'error', text: result.error });
        } else {
            setMessage({ type: 'success', text: 'Verification code sent! Please check your email.' });
        }
        setIsResending(false);
    }

    if (!email) {
        return (
            <div className="text-center">
                <p className="text-red-500">Invalid link. Please sign up again.</p>
                <Button onClick={() => router.push('/signup')} className="mt-4">
                    Go to Signup
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
            <div className="text-center">
                <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Verify your email
                </h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    We sent a verification code to <span className="font-medium text-gray-900 dark:text-white">{email}</span>
                </p>
            </div>

            <form onSubmit={handleVerify} className="mt-8 space-y-6">
                <div>
                    <Label htmlFor="code">Verification Code</Label>
                    <Input
                        id="code"
                        name="code"
                        type="text"
                        required
                        className="mt-1 text-center text-2xl tracking-widest"
                        placeholder="123456"
                        maxLength={6}
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    />
                </div>

                {message && (
                    <div className={`text-sm text-center p-2 rounded ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                        }`}>
                        {message.text}
                    </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading || code.length < 6}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Verifying...
                        </>
                    ) : (
                        <>
                            Verify Email
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                    )}
                </Button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Didn't receive the code?{' '}
                    <button
                        onClick={handleResend}
                        disabled={isResending}
                        className="font-medium text-blue-600 hover:text-blue-500 disabled:opacity-50"
                    >
                        {isResending ? 'Sending...' : 'Resend code'}
                    </button>
                </p>
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <Suspense fallback={<div>Loading...</div>}>
                <VerifyEmailContent />
            </Suspense>
        </div>
    );
}
