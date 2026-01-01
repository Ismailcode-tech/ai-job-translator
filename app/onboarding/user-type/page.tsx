'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateUserType } from './actions';
import { User, Building2, ArrowRight, Sparkles, Shield, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

export default function UserTypePage() {
    const [loading, setLoading] = useState<string | null>(null);
    const router = useRouter();

    const handleSelect = async (type: 'individual' | 'company') => {
        setLoading(type);
        try {
            const result = await updateUserType(type);

            if (result.error) {
                toast.error(result.error);
                setLoading(null);
                return;
            }

            if (result.success && result.redirectPath) {
                toast.success(`Welcome to MEDYX, ${type === 'individual' ? 'Talent' : 'Broker'}!`);
                router.push(result.redirectPath);
            }
        } catch (error: any) {
            setLoading(null);
            toast.error(error.message || 'Something went wrong');
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white flex flex-col justify-center relative overflow-hidden font-sans">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full"></div>

            <div className="container mx-auto px-6 py-12 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-widest mb-8 animate-fade-in">
                        <Sparkles className="w-3.5 h-3.5" />
                        Onboarding Protocol
                    </div>
                    <h1 className="text-6xl font-black mb-6 tracking-tighter bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent italic">
                        SELECT YOUR MODE
                    </h1>
                    <p className="text-gray-400 text-lg font-medium leading-relaxed">
                        To initialize your MEDYX experience, we need to know your operational identity. Choose the path that matches your mission.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Individual / Talent Card */}
                    <button
                        onClick={() => handleSelect('individual')}
                        disabled={!!loading}
                        className="group relative text-left focus:outline-none disabled:opacity-50 transition-all duration-300"
                    >
                        <Card className={`h-full bg-slate-900/40 backdrop-blur-xl border-white/5 group-hover:border-indigo-500/50 transition-all duration-500 overflow-hidden ${loading === 'individual' ? 'ring-2 ring-indigo-500 border-indigo-500/50' : ''}`}>
                            <CardContent className="p-10 relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/20 mb-8 group-hover:scale-110 transition-transform duration-500">
                                    <User className="w-8 h-8 text-white" />
                                </div>

                                <h2 className="text-3xl font-black text-white mb-4 tracking-tight">INDIVIDUAL</h2>
                                <p className="text-gray-400 font-medium leading-relaxed mb-8">
                                    For professional talent looking to secure their identity while finding top-tier opportunities. Access AI mediation and career roadmaps.
                                </p>

                                <div className="flex items-center gap-2 text-indigo-400 font-black uppercase tracking-widest text-sm group-hover:gap-4 transition-all">
                                    <span>{loading === 'individual' ? 'Initializing...' : 'Talent Onboarding'}</span>
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </CardContent>
                        </Card>
                    </button>

                    {/* Organization / Broker Card */}
                    <button
                        onClick={() => handleSelect('company')}
                        disabled={!!loading}
                        className="group relative text-left focus:outline-none disabled:opacity-50 transition-all duration-300"
                    >
                        <Card className={`h-full bg-slate-900/40 backdrop-blur-xl border-white/5 group-hover:border-purple-500/50 transition-all duration-500 overflow-hidden ${loading === 'company' ? 'ring-2 ring-purple-500 border-purple-500/50' : ''}`}>
                            <CardContent className="p-10 relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                <div className="w-16 h-16 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/20 mb-8 group-hover:scale-110 transition-transform duration-500">
                                    <Building2 className="w-8 h-8 text-white" />
                                </div>

                                <h2 className="text-3xl font-black text-white mb-4 tracking-tight">COMPANY</h2>
                                <p className="text-gray-400 font-medium leading-relaxed mb-8">
                                    For organizations looking to find pre-verified talent through secure mediation. Manage pipelines and post AI-interpreted opportunities.
                                </p>

                                <div className="flex items-center gap-2 text-purple-400 font-black uppercase tracking-widest text-sm group-hover:gap-4 transition-all">
                                    <span>{loading === 'company' ? 'Initializing...' : 'Broker Onboarding'}</span>
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </CardContent>
                        </Card>
                    </button>
                </div>

                <div className="mt-20 text-center">
                    <div className="inline-flex items-center gap-6 px-8 py-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm grayscale opacity-50">
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            <span className="text-xs font-black uppercase tracking-widest">End-to-End Encryption</span>
                        </div>
                        <div className="hidden md:block w-px h-4 bg-white/10"></div>
                        <div className="flex items-center gap-2">
                            <Rocket className="w-4 h-4" />
                            <span className="text-xs font-black uppercase tracking-widest">Instant Matching</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
