'use client';

import { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, Zap, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BillingPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [subscription, setSubscription] = useState<any>(null);

    async function handleUpgrade() {
        setIsLoading(true);

        try {
            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || 'price_1234567890',
                }),
            });

            const { url } = await response.json();

            if (url) {
                window.location.href = url;
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Failed to start checkout. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="max-w-4xl space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Billing & Subscription</h1>
                <p className="text-slate-600">Manage your plan and payment details</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Free Plan */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600 mb-1">Current Plan</p>
                            <h2 className="text-2xl font-bold text-slate-900">Free</h2>
                            <p className="text-sm text-slate-600 mt-1">$0.00 / month</p>
                        </div>
                    </div>
                    <div className="mt-6 space-y-3">
                        <div className="flex items-center text-sm text-slate-700">
                            <CheckCircle className="mr-2 h-4 w-4 text-slate-400" /> 5 Analyses / month
                        </div>
                        <div className="flex items-center text-sm text-slate-700">
                            <CheckCircle className="mr-2 h-4 w-4 text-slate-400" /> Basic Analysis
                        </div>
                    </div>
                </div>

                {/* Pro Plan */}
                <div className="rounded-xl border border-teal-200 bg-teal-50 p-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-teal-600 mb-1">Upgrade to</p>
                            <h2 className="text-2xl font-bold text-slate-900">Pro Plan</h2>
                            <p className="text-sm text-slate-600 mt-1">$9.00 / month</p>
                        </div>
                        <div className="rounded-full bg-white p-2 shadow-sm">
                            <Zap className="h-6 w-6 text-teal-600" />
                        </div>
                    </div>
                    <div className="mt-6 space-y-3">
                        <div className="flex items-center text-sm text-slate-700">
                            <CheckCircle className="mr-2 h-4 w-4 text-teal-600" /> Unlimited Analyses
                        </div>
                        <div className="flex items-center text-sm text-slate-700">
                            <CheckCircle className="mr-2 h-4 w-4 text-teal-600" /> Full Learning Roadmap
                        </div>
                        <div className="flex items-center text-sm text-slate-700">
                            <CheckCircle className="mr-2 h-4 w-4 text-teal-600" /> PDF Downloads
                        </div>
                        <div className="flex items-center text-sm text-slate-700">
                            <CheckCircle className="mr-2 h-4 w-4 text-teal-600" /> Priority Support
                        </div>
                    </div>
                    <div className="mt-6">
                        <Button
                            onClick={handleUpgrade}
                            disabled={isLoading}
                            className="w-full bg-teal-600 hover:bg-teal-700"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                'Upgrade to Pro'
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Payment Method */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-slate-900">Payment Method</h3>
                <p className="text-sm text-slate-600">
                    Payment details will appear here after you subscribe to a plan.
                </p>
            </div>
        </div>
    );
}
