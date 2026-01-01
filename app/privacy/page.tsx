import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Eye, Lock, Database, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function PrivacyPage() {
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
                            <Eye className="h-6 w-6 text-white" />
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
                    <span className="text-indigo-400 font-black uppercase tracking-[0.2em] text-xs">Data Governance</span>
                </div>
                <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent tracking-tighter">Privacy Protocol</h1>
                <p className="text-gray-500 mb-16 font-medium">Last revision: December 25, 2025</p>

                <div className="space-y-12">
                    <Card className="bg-white/5 border-white/5 hover:border-indigo-500/20 transition-all group overflow-hidden">
                        <CardContent className="p-8 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-black text-white tracking-tight">1. Privacy by Architecture</h2>
                            </div>
                            <p className="text-gray-400 leading-relaxed font-medium">
                                At <span className="text-white">MEDYX</span>, privacy is not a feature—it is our core architecture. We employ synthetic identity mapping to ensure Talent profiles remain completely anonymous within our network until explicit, granular consent is granted by the data sovereign.
                            </p>
                        </CardContent>
                    </Card>

                    <div className="grid md:grid-cols-2 gap-8">
                        <Card className="bg-white/5 border-white/5 hover:border-purple-500/20 transition-all group p-8 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/10 group-hover:bg-purple-500 group-hover:text-white transition-all">
                                    <Database className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-black text-white tracking-tight">Data Collection</h3>
                            </div>
                            <ul className="space-y-3 text-sm text-gray-400 font-medium">
                                <li className="flex items-center gap-2"><div className="w-1 h-1 bg-indigo-500 rounded-full"></div> Hashed Identity Metrics</li>
                                <li className="flex items-center gap-2"><div className="w-1 h-1 bg-indigo-500 rounded-full"></div> Encrypted Corporate Email</li>
                                <li className="flex items-center gap-2"><div className="w-1 h-1 bg-indigo-500 rounded-full"></div> Technical Telemetry</li>
                                <li className="flex items-center gap-2"><div className="w-1 h-1 bg-indigo-500 rounded-full"></div> Professional DNA (Skills)</li>
                            </ul>
                        </Card>

                        <Card className="bg-white/5 border-white/5 hover:border-emerald-500/20 transition-all group p-8 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-black text-white tracking-tight">Security Standards</h3>
                            </div>
                            <p className="text-sm text-gray-400 leading-relaxed font-medium">
                                All data transitions occur through zero-trust tunnels. We utilize multi-layer encryption for both data-at-rest and data-in-transit, ensuring your professional profile is a fortress.
                            </p>
                        </Card>
                    </div>

                    <Card className="bg-white/5 border-white/5 hover:border-pink-500/20 transition-all group overflow-hidden">
                        <CardContent className="p-8 space-y-4">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/10 group-hover:bg-pink-500 group-hover:text-white transition-all">
                                    <Eye className="w-5 h-5" />
                                </div>
                                <h2 className="text-2xl font-black text-white tracking-tight">4. Ownership & Control</h2>
                            </div>
                            <p className="text-gray-400 leading-relaxed font-medium">
                                You own your data. You can export, modify, or permanently purge your mediation footprint at any time. Our 'Right to be Forgotten' protocol is hardcoded into our core logic, ensuring that 'Delete' truly means <span className="text-white">permanent destruction</span> across all nodes.
                            </p>
                        </CardContent>
                    </Card>

                    <div className="pt-16 border-t border-white/5 text-center">
                        <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 inline-flex items-center gap-4 mb-8">
                            <Mail className="w-5 h-5 text-indigo-400" />
                            <p className="text-gray-400 text-sm font-medium">
                                Privacy Oversight: <a href="mailto:privacy@medyx.ai" className="text-white font-bold hover:text-indigo-400 transition-colors">privacy@medyx.ai</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
