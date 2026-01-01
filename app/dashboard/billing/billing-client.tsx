'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, CreditCard, Loader2, Zap, ShieldCheck, Download, Sparkles } from 'lucide-react';
import { upgradeSubscription } from './actions';
import { Badge } from '@/components/ui/badge';

export default function BillingPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [plan, setPlan] = useState<'free' | 'pro'>('free'); // In real app, fetch this

    const handleUpgrade = async () => {
        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            await upgradeSubscription();
            setPlan('pro');
        } catch (error) {
            console.error('Payment failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">Billing & Plans</h1>
                        <p className="text-gray-400 mt-1">Manage recursive fees and premium brokerage features.</p>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Pay Per Match / Free Plan */}
                <Card className={`bg-slate-900/40 backdrop-blur-md border-white/5 overflow-hidden flex flex-col transition-all duration-300 ${plan === 'free' ? 'ring-2 ring-indigo-500/50 scale-[1.02] shadow-2xl shadow-indigo-500/10' : 'opacity-60 scale-95'}`}>
                    <CardHeader className="p-8">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <CardTitle className="text-2xl text-white">Pay Per Match</CardTitle>
                                <CardDescription className="text-gray-400">Perfect for selective, high-value hires.</CardDescription>
                            </div>
                            {plan === 'free' && (
                                <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 font-bold px-3 py-1">Current Plan</Badge>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="px-8 pb-8 flex-1">
                        <div className="flex items-baseline gap-1 mb-8">
                            <span className="text-5xl font-black text-white">$49</span>
                            <span className="text-gray-500 font-medium">/revealed match</span>
                        </div>
                        <div className="space-y-4">
                            {[
                                'Pay only when you reveal contact info',
                                'Unlimited anonymous AI suggestions',
                                'Basic talent matching ranking',
                                'Standard email support'
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 text-gray-300">
                                    <div className="h-5 w-5 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                                        <Check className="h-3 w-3 text-indigo-400" />
                                    </div>
                                    <span className="text-sm font-medium">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter className="p-8 pt-0 mt-auto">
                        <Button variant="ghost" className="w-full h-14 rounded-2xl border border-white/10 text-gray-400 font-bold" disabled>
                            {plan === 'free' ? 'Currently Active' : 'Downgrade'}
                        </Button>
                    </CardFooter>
                </Card>

                {/* Enterprise Brokerage / Pro Plan */}
                <Card className={`relative bg-gradient-to-b from-indigo-900/10 to-slate-900/40 backdrop-blur-md border-indigo-500/20 overflow-hidden flex flex-col transition-all duration-300 ${plan === 'pro' ? 'ring-2 ring-indigo-500 scale-[1.02] shadow-2xl shadow-indigo-500/20' : 'hover:border-indigo-500/40'}`}>
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Sparkles className="h-32 w-32 text-indigo-400" />
                    </div>

                    <CardHeader className="p-8 relative z-10">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge className="bg-indigo-500 text-white border-0 font-black px-2 py-0.5 text-[10px] tracking-widest uppercase">Elite</Badge>
                                </div>
                                <CardTitle className="text-2xl text-white">Enterprise Brokerage</CardTitle>
                                <CardDescription className="text-gray-400">For high-velocity talent acquisition.</CardDescription>
                            </div>
                            {plan === 'pro' && (
                                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-bold px-3 py-1">Active</Badge>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="px-8 pb-8 relative z-10 flex-1">
                        <div className="flex items-baseline gap-1 mb-8">
                            <span className="text-5xl font-black text-white">$999</span>
                            <span className="text-gray-500 font-medium">/month</span>
                        </div>
                        <div className="space-y-4">
                            {[
                                'Unlimited reveal of match contact info',
                                'Priority AI processing queue',
                                'Dedicated Account Concierge',
                                'Custom API & ATS Integrations',
                                'Advanced matching analytics'
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 text-gray-200">
                                    <div className="h-5 w-5 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0">
                                        <Check className="h-3 w-3 text-white" />
                                    </div>
                                    <span className="text-sm font-semibold">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter className="p-8 pt-0 mt-auto relative z-10">
                        {plan === 'pro' ? (
                            <Button className="w-full h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold" disabled>
                                Subscription Active
                            </Button>
                        ) : (
                            <Button
                                className="w-full h-14 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold shadow-xl shadow-indigo-600/20 border-0 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                onClick={handleUpgrade}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                                        Processsing...
                                    </>
                                ) : (
                                    <>
                                        <Zap className="mr-3 h-5 w-5 fill-current" />
                                        Upgrade to Enterprise
                                    </>
                                )}
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </div>

            {/* Transaction History - Optional but looks good */}
            <Card className="bg-slate-900/40 backdrop-blur-md border-white/5 overflow-hidden">
                <CardHeader className="border-b border-white/5 bg-white/5 px-8 py-6">
                    <CardTitle className="text-white text-xl flex items-center gap-3">
                        <ShieldCheck className="w-5 h-5 text-indigo-400" />
                        Brokerage Security
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-5">
                            <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/10">
                                <Download className="h-6 w-6 text-indigo-400" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white">Export Billing History</h4>
                                <p className="text-sm text-gray-400">Download all your brokerage invoices for tax purposes.</p>
                            </div>
                        </div>
                        <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-xl px-6 h-11">
                            Export PDF
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
