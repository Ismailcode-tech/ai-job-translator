import Link from 'next/link';
import { ArrowLeft, Mail, MapPin, MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-[#020617] font-sans text-white py-20 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full"></div>
            </div>

            <div className="container mx-auto px-6 max-w-5xl relative z-10">
                <Link href="/" className="inline-flex items-center text-sm text-gray-400 hover:text-indigo-400 mb-12 transition-all font-black uppercase tracking-widest group">
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                <div className="grid md:grid-cols-2 gap-16 items-start">
                    <div className="space-y-10">
                        <div>
                            <h1 className="text-5xl font-black tracking-tight mb-6 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">Get in touch</h1>
                            <p className="text-xl text-gray-400 leading-relaxed font-medium">
                                Have questions about <span className="text-white font-bold">MEDYX</span>? We're here to help you navigate the future of talent brokerage. Reach out to our team of experts.
                            </p>
                        </div>

                        <div className="grid gap-6">
                            <Card className="bg-white/5 border-white/5 hover:border-indigo-500/20 transition-all group">
                                <CardContent className="p-6 flex items-center gap-6">
                                    <div className="p-4 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                        <Mail className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-white uppercase tracking-tight text-sm">Email</h3>
                                        <p className="text-gray-400 font-medium">support@medyx.ai</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white/5 border-white/5 hover:border-purple-500/20 transition-all group">
                                <CardContent className="p-6 flex items-center gap-6">
                                    <div className="p-4 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/10 group-hover:bg-purple-500 group-hover:text-white transition-all">
                                        <MessageSquare className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-white uppercase tracking-tight text-sm">Live Chat</h3>
                                        <p className="text-gray-400 font-medium">Mon-Fri, 9am-5pm EST</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white/5 border-white/5 hover:border-pink-500/20 transition-all group">
                                <CardContent className="p-6 flex items-center gap-6">
                                    <div className="p-4 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/10 group-hover:bg-pink-500 group-hover:text-white transition-all">
                                        <MapPin className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-white uppercase tracking-tight text-sm">Office</h3>
                                        <p className="text-gray-400 font-medium">123 AI Boulevard, San Francisco</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <Card className="bg-white/5 border-white/10 backdrop-blur-xl rounded-3xl p-10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                            <Send className="h-64 w-64 text-indigo-400" />
                        </div>
                        <form className="space-y-8 relative z-10">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label htmlFor="first-name" className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">First name</label>
                                    <Input
                                        id="first-name"
                                        placeholder="John"
                                        className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:ring-indigo-500/50"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label htmlFor="last-name" className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Last name</label>
                                    <Input
                                        id="last-name"
                                        placeholder="Doe"
                                        className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:ring-indigo-500/50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Corporate Email</label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@company.com"
                                    className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:ring-indigo-500/50"
                                />
                            </div>

                            <div className="space-y-3">
                                <label htmlFor="message" className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Inquiry</label>
                                <Textarea
                                    id="message"
                                    placeholder="Briefly describe how we can assist..."
                                    className="min-h-[160px] bg-white/5 border-white/10 text-white rounded-xl focus:ring-indigo-500/50 resize-none p-4"
                                />
                            </div>

                            <Button className="w-full h-14 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black uppercase tracking-widest rounded-xl shadow-xl shadow-indigo-600/20 border-0 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                Send Message
                            </Button>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
}
