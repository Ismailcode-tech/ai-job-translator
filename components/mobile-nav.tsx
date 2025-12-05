'use client';

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import Link from "next/link";
import { LayoutDashboard, FileText, User, CreditCard, Settings, LogOut, Shield } from 'lucide-react';

export function MobileNav({ userEmail }: { userEmail: string }) {
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
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">S</span>
                        </div>
                        <span className="text-xl font-bold text-foreground">SilentShepard</span>
                    </Link>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    <Link href="/dashboard" onClick={() => setOpen(false)} className="flex items-center px-4 py-3 text-muted-foreground hover:bg-muted rounded-lg transition-colors">
                        <LayoutDashboard className="w-5 h-5 mr-3" />
                        Dashboard
                    </Link>
                    <Link href="/dashboard/analyses" onClick={() => setOpen(false)} className="flex items-center px-4 py-3 text-muted-foreground hover:bg-muted rounded-lg transition-colors">
                        <FileText className="w-5 h-5 mr-3" />
                        My Analyses
                    </Link>
                    <Link href="/dashboard/profile" onClick={() => setOpen(false)} className="flex items-center px-4 py-3 text-muted-foreground hover:bg-muted rounded-lg transition-colors">
                        <User className="w-5 h-5 mr-3" />
                        Profile
                    </Link>
                    <Link href="/dashboard/billing" onClick={() => setOpen(false)} className="flex items-center px-4 py-3 text-muted-foreground hover:bg-muted rounded-lg transition-colors">
                        <CreditCard className="w-5 h-5 mr-3" />
                        Billing
                    </Link>
                    <Link href="/dashboard/settings" onClick={() => setOpen(false)} className="flex items-center px-4 py-3 text-muted-foreground hover:bg-muted rounded-lg transition-colors">
                        <Settings className="w-5 h-5 mr-3" />
                        Settings
                    </Link>

                    {['ismailhadjlarbi71@gmail.com', 'ismailhadjlarbi2007@gmail.com'].includes(userEmail) && (
                        <Link href="/admin" onClick={() => setOpen(false)} className="flex items-center px-4 py-3 text-primary hover:bg-primary/10 rounded-lg transition-colors font-medium">
                            <Shield className="w-5 h-5 mr-3" />
                            Admin
                        </Link>
                    )}
                </nav>
            </SheetContent>
        </Sheet>
    );
}
