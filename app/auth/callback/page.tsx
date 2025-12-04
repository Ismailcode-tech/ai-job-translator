'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleCallback = async () => {
            const code = searchParams.get('code');

            if (!code) {
                setError('No verification code found');
                setTimeout(() => router.push('/login'), 2000);
                return;
            }

            try {
                const supabase = createClient();

                // Exchange code for session
                const { data, error } = await supabase.auth.exchangeCodeForSession(code);

                if (error) {
                    console.error('Verification error:', error.message);
                    setError('Verification failed. Please try logging in.');
                    setTimeout(() => router.push('/login'), 2000);
                    return;
                }

                // Session established successfully
                console.log('Session established:', data.session);
                router.push('/dashboard');
            } catch (err: any) {
                console.error('Unexpected error:', err.message);
                setError('An unexpected error occurred');
                setTimeout(() => router.push('/login'), 2000);
            }
        };

        handleCallback();
    }, [searchParams, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
                {error ? (
                    <div>
                        <p className="text-red-500 mb-4">{error}</p>
                        <p className="text-sm text-gray-600">Redirecting...</p>
                    </div>
                ) : (
                    <div>
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                        <p className="text-gray-700 dark:text-gray-300">Verifying your email...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
