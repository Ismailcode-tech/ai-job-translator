import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Lock, FileText, Scale } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function Terms() {
    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-indigo-500/30">
            {/* Background Decorative Gradients */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full"></div>
            </div>

            <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Scale className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-black text-white tracking-tight">MEDYX</span>
                    </Link>
                    <Link href="/">
                        <Button variant="ghost" className="text-gray-400 hover:text-white font-black uppercase tracking-widest text-xs">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </nav>

            <div className="container mx-auto px-6 py-20 max-w-4xl relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-px w-8 bg-indigo-500"></div>
                    <span className="text-indigo-400 font-black uppercase tracking-[0.2em] text-xs">Legal Framework</span>
                </div>
                <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent tracking-tighter">Terms of Service</h1>
                <p className="text-gray-500 mb-16 font-medium">Last revision: December 25, 2025</p>

                <div className="space-y-12">
                    <Card className="bg-white/5 border-white/5 hover:border-indigo-500/20 transition-all overflow-hidden group">
                        <CardContent className="p-8 space-y-4">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <h2 className="text-2xl font-black text-white tracking-tight">1. Protocol Acceptance</h2>
                            </div>
                            <p className="text-gray-400 leading-relaxed font-medium">
                                By accessing the <span className="text-white">MEDYX</span> infrastructure, you acknowledge and agree to the protocols established in this agreement. Our platform operates on strict consensus-based data exchange. If you disagree with these standards, access must be terminated immediately.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/5 border-white/5 hover:border-purple-500/20 transition-all overflow-hidden group">
                        <CardContent className="p-8 space-y-4">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/10 group-hover:bg-purple-500 group-hover:text-white transition-all">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <h2 className="text-2xl font-black text-white tracking-tight">2. Mediation Architecture</h2>
                            </div>
                            <p className="text-gray-400 leading-relaxed font-medium">
                                <span className="text-white">MEDYX</span> acts as an AI-powered synthetic layer between professional talent and corporate entities. We facilitate asymmetric matching where identity remains obfuscated until mutual consent is validated through our secure handshake protocol.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/5 border-white/5 hover:border-emerald-500/20 transition-all overflow-hidden group">
                        <CardContent className="p-8 space-y-4">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <h2 className="text-2xl font-black text-white tracking-tight">3. Privacy Sovereignty</h2>
                            </div>
                            <div className="space-y-4">
                                <p className="text-gray-400 leading-relaxed font-medium">
                                    <strong className="text-white">For Talent:</strong> Your professional footprint is hashed and secured. Companies cannot de-anonymize your profile without your active cryptographic consent.
                                </p>
                                <p className="text-gray-400 leading-relaxed font-medium">
                                    <strong className="text-white">For Companies:</strong> Direct contact is a privilege earned through matching and candidate approval. Any attempt to bypass these guardrails results in immediate network exclusion.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid md:grid-cols-2 gap-8">
                        <section className="space-y-4 pl-8 border-l-2 border-indigo-500/20">
                            <h3 className="text-lg font-black text-white uppercase tracking-widest">4. User Responsibility</h3>
                            <p className="text-sm text-gray-500 leading-relaxed font-medium">
                                Users are responsible for the integrity of data uploaded to the network. Misrepresentation of skills or corporate identity undermines the mediation logic and is prohibited.
                            </p>
                        </section>
                        <section className="space-y-4 pl-8 border-l-2 border-purple-500/20">
                            <h3 className="text-lg font-black text-white uppercase tracking-widest">5. Termination</h3>
                            <p className="text-sm text-gray-500 leading-relaxed font-medium">
                                We reserve the rights to revoke access tokens at any time for protocol violations. Network safety and data integrity are non-negotiable.
                            </p>
                        </section>
                    </div>

                    <div className="pt-16 border-t border-white/5 text-center">
                        <p className="text-gray-500 text-sm font-medium mb-4">
                            Questions regarding the legal framework?
                        </p>
                        <a href="mailto:legal@medyx.ai" className="inline-flex items-center text-indigo-400 hover:text-indigo-300 font-black uppercase tracking-[0.25em] text-xs transition-colors">
                            legal@medyx.ai
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
