'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react';

function SignupConfirmationContent() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';

    return (
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
            <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-8 w-8 text-blue-600" />
            </div>

            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Check your email
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    We sent a verification link to
                </p>
                <p className="font-medium text-gray-900 dark:text-white mt-1">
                    {email}
                </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                    Click the link in the email to verify your account and get started.
                </p>
            </div>

            <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Didn't receive the email? Check your spam folder or contact support.
                </p>

                <Link href="/login">
                    <Button variant="outline" className="w-full">
                        Back to Login
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}

export default function SignupConfirmationPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <Suspense fallback={<div>Loading...</div>}>
                <SignupConfirmationContent />
            </Suspense>
        </div>
    );
}
