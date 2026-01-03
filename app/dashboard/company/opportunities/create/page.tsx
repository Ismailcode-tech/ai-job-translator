'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { createOpportunity } from '../actions';
import { Loader2, ArrowLeft, Rocket, Sparkles, Target, Briefcase, MapPin, DollarSign, Zap } from 'lucide-react';
import Link from 'next/link';
export default function CreateOpportunityPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        try {
            const result = await createOpportunity(formData);
            if (result && result.error) {
                console.error(result.error);
                alert(`Failed to create opportunity: ${result.error}`);
            }
            // If no error, the action redirects, so we don't need to do anything here.
        } catch (error: any) {
            console.error(error);
            alert(`Failed to create opportunity: ${error.message}`);
            setIsLoading(false);
        }
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/company/opportunities">
                        <Button variant="ghost" size="icon" className="h-10 w-10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition-all">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-black text-white tracking-tight">Post Placement</h1>
                            <div className="bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-lg">
                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Step 01</span>
                            </div>
                        </div>
                        <p className="text-gray-400 mt-1">AI-powered candidate synchronization starts here.</p>
                    </div>
                </div>
            </div>

            <form action={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form Area */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="bg-slate-900/40 backdrop-blur-md border-white/5 overflow-hidden shadow-2xl">
                            <CardHeader className="p-8 border-b border-white/5 bg-white/5">
                                <CardTitle className="text-xl font-black text-white flex items-center gap-3">
                                    <Rocket className="w-6 h-6 text-indigo-400" />
                                    Job Configuration
                                </CardTitle>
                                <CardDescription className="text-gray-400 font-medium">
                                    Detailed descriptions yield higher quality AI matches.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <div className="space-y-3">
                                    <Label htmlFor="title" className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Professional Job Title</Label>
                                    <div className="relative">
                                        <Target className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-400" />
                                        <Input
                                            id="title"
                                            name="title"
                                            placeholder="e.g. Senior Frontend Engineer"
                                            required
                                            className="bg-white/5 border-white/10 text-white h-12 pl-12 rounded-xl focus:ring-indigo-500/50"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <Label htmlFor="location" className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Target Location</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-400" />
                                            <Input
                                                id="location"
                                                name="location"
                                                placeholder="e.g. Remote / London"
                                                className="bg-white/5 border-white/10 text-white h-12 pl-12 rounded-xl focus:ring-indigo-500/50"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="type" className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Employment Structure</Label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-400 pointer-events-none" />
                                            <select
                                                id="type"
                                                name="type"
                                                className="flex h-12 w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white ring-offset-background placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 pl-12 appearance-none cursor-pointer"
                                            >
                                                <option value="full-time" className="bg-slate-900 text-white">Full-time</option>
                                                <option value="contract" className="bg-slate-900 text-white">Contract</option>
                                                <option value="part-time" className="bg-slate-900 text-white">Part-time</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center px-1">
                                        <Label htmlFor="description" className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Full Job Description</Label>
                                        <span className="text-[10px] font-bold text-indigo-400/60 uppercase">Rich Context</span>
                                    </div>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        placeholder="Paste your full job description here. Include key requirements, tech stack, and benefits for optimal AI processing."
                                        className="min-h-[250px] bg-white/5 border-white/10 text-white rounded-2xl focus:ring-indigo-500/50 p-4 leading-relaxed"
                                        required
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="salary_range" className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Annual Compensation Range</Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-400" />
                                        <Input
                                            id="salary_range"
                                            name="salary_range"
                                            placeholder="e.g. $120k - $150k"
                                            className="bg-white/5 border-white/10 text-white h-12 pl-12 rounded-xl focus:ring-indigo-500/50"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar Area */}
                    <div className="space-y-8">
                        {/* Process Card */}
                        <Card className="bg-slate-900/40 backdrop-blur-md border border-indigo-500/20 overflow-hidden">
                            <div className="bg-indigo-600/10 p-6 border-b border-indigo-500/10">
                                <h3 className="text-lg font-black text-white flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-indigo-400" />
                                    AI Strategy
                                </h3>
                            </div>
                            <CardContent className="p-6 space-y-6">
                                <p className="text-xs text-gray-400 leading-relaxed font-medium">
                                    Once created, our Mediator AI will analyze your requirements against our private talent pool.
                                </p>
                                <div className="space-y-4">
                                    {[
                                        { icon: Sparkles, text: 'Instant match synthesis' },
                                        { icon: Target, text: 'Anonymity-preserved filtering' },
                                        { icon: Rocket, text: 'High-velocity recruitment' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                                <item.icon className="w-4 h-4 text-indigo-400" />
                                            </div>
                                            <span className="text-xs font-bold text-gray-300">{item.text}</span>
                                        </div>
                                    ))}
                                </div>
                                <Button
                                    className="w-full h-14 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 border-0 text-white font-black text-lg shadow-xl shadow-indigo-600/20 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                                    disabled={isLoading}
                                    type="submit"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                                            Synthesizing...
                                        </>
                                    ) : (
                                        'Launch Opportunity'
                                    )}
                                </Button>
                                <Link href="/dashboard/company/opportunities" className="block text-center">
                                    <span className="text-xs font-bold text-gray-500 hover:text-white transition-colors cursor-pointer">Discard Draft</span>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Credit Info */}
                        <Card className="bg-gradient-to-br from-indigo-900/30 to-slate-900/40 border-white/5 p-6">
                            <h4 className="text-sm font-black text-white mb-2 uppercase tracking-widest">Credit System</h4>
                            <p className="text-xs text-gray-400 font-medium leading-relaxed">
                                Creating a job post is free. Credits are only deducted when you request contact from matched candidates.
                            </p>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    );
}
