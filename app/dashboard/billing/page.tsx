'use client';

import { useState } from 'react';
import { CheckCircle, Zap, Loader2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export default function BillingPage() {
    const t = useTranslations('billing');
    const tCommon = useTranslations('common');
    const [isLoading, setIsLoading] = useState<string | null>(null);

    async function handleUpgrade(priceId: string, planName: string) {
        setIsLoading(planName);

        try {
            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    priceId: priceId,
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
            setIsLoading(null);
        }
    }

    return (
        <div className="max-w-6xl space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-foreground">{t('title')}</h1>
                <p className="text-muted-foreground">{t('subtitle')}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Free Plan */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col">
                    <div className="mb-4">
                        <p className="text-sm font-medium text-muted-foreground mb-1">{t('currentPlan')}</p>
                        <h2 className="text-2xl font-bold text-foreground">{t('plans.free.name')}</h2>
                        <p className="text-sm text-muted-foreground mt-1">$0.00 {t('month')}</p>
                    </div>
                    <div className="flex-1 space-y-3 mb-6">
                        <div className="flex items-center text-sm text-muted-foreground">
                            <CheckCircle className="mr-2 h-4 w-4 text-primary" /> {t('plans.free.features.analyses')}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                            <CheckCircle className="mr-2 h-4 w-4 text-primary" /> {t('plans.free.features.cv')}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                            <CheckCircle className="mr-2 h-4 w-4 text-primary" /> {t('plans.free.features.support')}
                        </div>
                    </div>
                    <Button disabled variant="outline" className="w-full">
                        {t('currentPlan')}
                    </Button>
                </div>

                {/* Starter Plan */}
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 shadow-sm flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                        {t('popular')}
                    </div>
                    <div className="mb-4">
                        <p className="text-sm font-medium text-primary mb-1">{t('upgradeTo')}</p>
                        <h2 className="text-2xl font-bold text-foreground">{t('plans.starter.name')}</h2>
                        <p className="text-sm text-muted-foreground mt-1">$5.00 {t('month')}</p>
                    </div>
                    <div className="flex-1 space-y-3 mb-6">
                        <div className="flex items-center text-sm text-muted-foreground">
                            <CheckCircle className="mr-2 h-4 w-4 text-primary" /> {t('plans.starter.features.analyses')}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                            <CheckCircle className="mr-2 h-4 w-4 text-primary" /> {t('plans.starter.features.roadmap')}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                            <CheckCircle className="mr-2 h-4 w-4 text-primary" /> {t('plans.starter.features.pdf')}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                            <CheckCircle className="mr-2 h-4 w-4 text-primary" /> {t('plans.starter.features.support')}
                        </div>
                    </div>
                    <Button
                        onClick={() => handleUpgrade(process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_STARTER!, 'starter')}
                        disabled={isLoading !== null}
                        className="w-full bg-primary hover:bg-primary/90"
                    >
                        {isLoading === 'starter' ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t('processing')}
                            </>
                        ) : (
                            t('upgradeBtn', { plan: t('plans.starter.name') })
                        )}
                    </Button>
                </div>

                {/* Pro Plan */}
                <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-6 shadow-sm flex flex-col">
                    <div className="mb-4">
                        <p className="text-sm font-medium text-purple-600 mb-1">{t('upgradeTo')}</p>
                        <h2 className="text-2xl font-bold text-foreground">{t('plans.pro.name')}</h2>
                        <p className="text-sm text-muted-foreground mt-1">$10.00 {t('month')}</p>
                    </div>
                    <div className="flex-1 space-y-3 mb-6">
                        <div className="flex items-center text-sm text-muted-foreground">
                            <CheckCircle className="mr-2 h-4 w-4 text-purple-600" /> {t('plans.pro.features.analyses')}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                            <CheckCircle className="mr-2 h-4 w-4 text-purple-600" /> {t('plans.pro.features.bulk')}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                            <CheckCircle className="mr-2 h-4 w-4 text-purple-600" /> {t('plans.pro.features.csv')}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                            <CheckCircle className="mr-2 h-4 w-4 text-purple-600" /> {t('plans.pro.features.api')}
                        </div>
                    </div>
                    <Button
                        onClick={() => handleUpgrade(process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO!, 'pro')}
                        disabled={isLoading !== null}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    >
                        {isLoading === 'pro' ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t('processing')}
                            </>
                        ) : (
                            t('upgradeBtn', { plan: t('plans.pro.name') })
                        )}
                    </Button>
                </div>
            </div>

            {/* Payment Method */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-foreground">{t('paymentMethod')}</h3>
                <p className="text-sm text-muted-foreground">
                    {t('paymentDesc')}
                </p>
            </div>
        </div>
    );
}
