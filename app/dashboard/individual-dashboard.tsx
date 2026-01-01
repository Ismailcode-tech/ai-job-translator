'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
    CheckCircle,
    Users,
    TrendingUp,
    Bell,
    Shield,
    Sparkles,
    ArrowRight
} from 'lucide-react';

interface Props {
    stats: any[];
    recentRequests: any[];
    profileData: any;
}

const ICON_MAP = {
    'trending-up': TrendingUp,
    'users': Users,
    'bell': Bell,
    'sparkles': Sparkles,
};

export function IndividualDashboard({ stats, recentRequests, profileData }: Props) {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                        Control Room
                        <Badge variant="outline" className="text-xs border-indigo-500/50 text-indigo-400 bg-indigo-500/5 font-normal">
                            Individual
                        </Badge>
                    </h1>
                    <p className="text-gray-400 mt-1">Your privacy-first profile and agent activity overview.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => {
                    const Icon = ICON_MAP[stat.icon as keyof typeof ICON_MAP] || TrendingUp;
                    return (
                        <Card key={i} className="bg-slate-900/40 backdrop-blur-md border-white/5 hover:border-white/10 transition-all duration-300 group">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-white mb-1">
                                    {stat.value}{i === 0 ? '%' : ''}
                                </div>
                                <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
                                {i === 0 && (
                                    <div className="mt-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-1000"
                                            style={{ width: `${stat.value}%` }}
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Profile Status Card */}
                <Card className="bg-slate-900/40 backdrop-blur-md border-white/5 overflow-hidden">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-white text-xl">Profile Status</CardTitle>
                        <CardDescription className="text-gray-400">Maximize your matching potential by completing your profile.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="flex items-center gap-4 text-sm">
                            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${profileData?.name ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-gray-500'}`}>
                                <CheckCircle className="w-4 h-4" />
                            </div>
                            <span className={profileData?.name ? 'text-gray-200 font-medium' : 'text-gray-500'}>Basic Identity</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${profileData?.skills?.length > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-gray-500'}`}>
                                <CheckCircle className="w-4 h-4" />
                            </div>
                            <span className={profileData?.skills?.length > 0 ? 'text-gray-200 font-medium' : 'text-gray-500'}>Technical Skills</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${profileData?.bio ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-gray-500'}`}>
                                <CheckCircle className="w-4 h-4" />
                            </div>
                            <span className={profileData?.bio ? 'text-gray-200 font-medium' : 'text-gray-500'}>Personal Bio</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${profileData?.resume_url ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-gray-500'}`}>
                                <CheckCircle className="w-4 h-4" />
                            </div>
                            <span className={profileData?.resume_url ? 'text-gray-200 font-medium' : 'text-gray-500'}>Professional Resume</span>
                        </div>

                        <Link href="/dashboard/profile" className="block mt-6">
                            <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 text-gray-200 font-medium py-6 rounded-xl">
                                Complete Profile
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Consent Requests Preview */}
                <Card className="bg-slate-900/40 backdrop-blur-md border-white/5 overflow-hidden">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-white text-xl">Privacy Inbox</CardTitle>
                            {stats[2].value > 0 && (
                                <Badge className="bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 border-orange-500/30 font-medium">
                                    {stats[2].value} New
                                </Badge>
                            )}
                        </div>
                        <CardDescription className="text-gray-400">Companies requesting to unlock your identity.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {recentRequests.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <Shield className="w-12 h-12 text-white/10 mb-3" />
                                <p className="text-gray-500 text-sm max-w-[200px]">No active requests at the moment.</p>
                            </div>
                        ) : (
                            recentRequests.map((req) => (
                                <div key={req.id} className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all group">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="font-semibold text-white group-hover:text-indigo-400 transition-colors">
                                                {req.job_posts?.profiles?.company_name || 'Anonymous Partner'}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1">{req.job_posts?.title}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-indigo-400">{req.ai_score}%</div>
                                            <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Match</div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                        <Link href="/dashboard/requests" className="block mt-4">
                            <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-6 rounded-xl shadow-lg shadow-indigo-600/20 border-0">
                                Review Requests
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            {/* Privacy Feature Card */}
            <Card className="bg-gradient-to-br from-indigo-950/40 to-slate-900/40 border-indigo-500/20 overflow-hidden relative group">
                <div className="absolute -right-12 -top-12 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl group-hover:bg-indigo-600/20 transition-colors duration-500" />
                <CardContent className="p-8 relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/20">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-2 underline decoration-indigo-500/50 underline-offset-4">Privacy-First Matching</h3>
                            <p className="text-gray-300 leading-relaxed max-w-2xl">
                                Your identity remains protected by default. We only reveal your contact information to companies when <span className="text-indigo-400 font-semibold">you grant explicit consent</span>. The MEDYX agent works in the shadows to find your next career step while keeping you invisible until you're ready.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
