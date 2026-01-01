'use client';

import { Menu, Sparkles, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import Link from "next/link";
import { LayoutDashboard, FileText, User, CreditCard, Settings, LogOut, Shield, Users, Layers, Briefcase } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function MobileNav({ userEmail, userType }: { userEmail: string, userType?: string }) {
    const t = useTranslations('nav');
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
                <div className="p-6 border-b border-border">
                    <Link href="/dashboard" className="flex items-center space-x-2" onClick={() => setOpen(false)}>
                        <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                            <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-black text-white tracking-tight">MEDYX</span>
                    </Link>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {/* Individual Navigation */}
                    {userType === 'individual' && (
                        <>
                            <Link href="/dashboard" onClick={() => setOpen(false)} className="flex items-center px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition-all duration-200">
                                <LayoutDashboard className="w-5 h-5 mr-3" />
                                Control Room
                            </Link>
                            <Link href="/dashboard/matches" onClick={() => setOpen(false)} className="flex items-center px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition-all duration-200">
                                <Layers className="w-5 h-5 mr-3" />
                                Matches
                            </Link>
                            <Link href="/dashboard/connections" onClick={() => setOpen(false)} className="flex items-center px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition-all duration-200">
                                <Users className="w-5 h-5 mr-3" />
                                Connections
                            </Link>
                            <Link href="/dashboard/requests" onClick={() => setOpen(false)} className="flex items-center px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition-all duration-200">
                                <Shield className="w-5 h-5 mr-3" />
                                Consent Requests
                            </Link>
                            <Link href="/dashboard/profile" onClick={() => setOpen(false)} className="flex items-center px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition-all duration-200">
                                <User className="w-5 h-5 mr-3" />
                                Profile
                            </Link>
                        </>
                    )}

                    {/* Company Navigation */}
                    {userType === 'company' && (
                        <>
                            <Link href="/dashboard/company" onClick={() => setOpen(false)} className="flex items-center px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition-all duration-200">
                                <LayoutDashboard className="w-5 h-5 mr-3" />
                                Control Room
                            </Link>
                            <Link href="/dashboard/company/pipeline" onClick={() => setOpen(false)} className="flex items-center px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition-all duration-200">
                                <Layers className="w-5 h-5 mr-3" />
                                Match Pipeline
                            </Link>
                            <Link href="/dashboard/company/opportunities" onClick={() => setOpen(false)} className="flex items-center px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition-all duration-200">
                                <Briefcase className="w-5 h-5 mr-3" />
                                Opportunities
                            </Link>
                            <Link href="/dashboard/company/connections" onClick={() => setOpen(false)} className="flex items-center px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition-all duration-200">
                                <Users className="w-5 h-5 mr-3" />
                                Connections
                            </Link>
                            <Link href="/dashboard/company/profile" onClick={() => setOpen(false)} className="flex items-center px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition-all duration-200">
                                <Building2 className="w-5 h-5 mr-3" />
                                Company Profile
                            </Link>
                            <Link href="/dashboard/billing" onClick={() => setOpen(false)} className="flex items-center px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition-all duration-200">
                                <CreditCard className="w-5 h-5 mr-3" />
                                {t('billing')}
                            </Link>
                        </>
                    )}

                    <div className="pt-4 mt-4 border-t border-white/5">
                        <Link href="/dashboard/settings" onClick={() => setOpen(false)} className="flex items-center px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition-all duration-200">
                            <Settings className="w-5 h-5 mr-3" />
                            {t('settings')}
                        </Link>

                        {['ismailhadjlarbi71@gmail.com', 'ismailhadjlarbi2007@gmail.com'].includes(userEmail) && (
                            <Link href="/admin" onClick={() => setOpen(false)} className="flex items-center px-4 py-3 text-primary hover:bg-primary/10 rounded-lg transition-colors font-medium">
                                <Shield className="w-5 h-5 mr-3" />
                                {t('admin')}
                            </Link>
                        )}
                    </div>
                </nav>
            </SheetContent>
        </Sheet>
    );
}
