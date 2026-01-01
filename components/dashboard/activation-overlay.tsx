'use client';

import { useState } from 'react';
import { Shield, CheckCircle2, Lock, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { activateAccount } from '@/app/dashboard/company/actions';
import { toast } from 'sonner';

export function ActivationOverlay() {
    const [loading, setLoading] = useState(false);

    const handleActivate = async () => {
        setLoading(true);
        try {
            const result = await activateAccount();
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success('Account Protocol Initialized. System Unlocked.');
            }
        } catch (error: any) {
            toast.error(error.message || 'Activation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with blur - intense for focus */}
            <div className="absolute inset-0 bg-[#020617]/80 backdrop-blur-2xl" />

            <Card className="relative w-full max-w-lg bg-[#0f172a] border-indigo-500/30 shadow-[0_0_50px_-12px_rgba(79,70,229,0.3)] animate-in zoom-in duration-300">
                <CardContent className="p-10 text-center">
                    {/* Icon Header */}
                    <div className="mx-auto w-20 h-20 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/20 mb-8 transform -rotate-6">
                        <Lock className="w-10 h-10 text-white" />
                    </div>

                    <h2 className="text-4xl font-black text-white mb-4 tracking-tighter">
                        Activate Your Account
                    </h2>

                    <p className="text-gray-400 text-lg mb-8 font-medium">
                        Complete your protocol to unlock the premium mediation architecture and start finding verified talent.
                    </p>

                    {/* Features List */}
                    <div className="space-y-4 mb-10 text-left bg-white/5 p-6 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-3 text-emerald-400">
                            <CheckCircle2 className="w-5 h-5 shrink-0" />
                            <span className="text-sm font-bold uppercase tracking-wider">AI-powered candidate matching</span>
                        </div>
                        <div className="flex items-center gap-3 text-emerald-400">
                            <CheckCircle2 className="w-5 h-5 shrink-0" />
                            <span className="text-sm font-bold uppercase tracking-wider">Unlimited opportunity postings</span>
                        </div>
                        <div className="flex items-center gap-3 text-emerald-400">
                            <CheckCircle2 className="w-5 h-5 shrink-0" />
                            <span className="text-sm font-bold uppercase tracking-wider">75 connection credits per month</span>
                        </div>
                        <div className="flex items-center gap-3 text-emerald-400">
                            <CheckCircle2 className="w-5 h-5 shrink-0" />
                            <span className="text-sm font-bold uppercase tracking-wider">Explainable AI insights</span>
                        </div>
                    </div>

                    {/* Call to Action */}
                    <Button
                        onClick={handleActivate}
                        disabled={loading}
                        className="w-full h-14 text-lg font-black bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl shadow-xl shadow-indigo-600/20 border-0 group mb-6"
                    >
                        {loading ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <>
                                ACTIVATE NOW
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </Button>

                    <div className="flex items-center justify-center gap-2 text-gray-500">
                        <Shield className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">No contract required • Cancel anytime</span>
                    </div>
                </CardContent>

                {/* Decorative Sparkles */}
                <div className="absolute -top-4 -right-4 p-2 bg-indigo-500/10 rounded-full blur-xl animate-pulse">
                    <Sparkles className="w-12 h-12 text-indigo-500" />
                </div>
            </Card>
        </div>
    );
}
