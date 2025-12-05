import Link from 'next/link';
import { LayoutDashboard, FileText, User, CreditCard, Settings, LogOut, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/server';
import { signOut } from '@/app/login/actions';
import { redirect } from 'next/navigation';
import { MobileNav } from '@/components/mobile-nav';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch profile for sidebar
    const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name, name')
        .eq('id', user.id)
        .single();

    const fullName = profile?.name ||
        (profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}` : '') ||
        user.user_metadata?.full_name ||
        'User';

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar (Desktop) */}
            <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border fixed h-full z-30">
                <div className="p-6 border-b border-border">
                    <Link href="/dashboard" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                            <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-foreground tracking-tight">Talio</span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <Link href="/dashboard" className="flex items-center px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-all duration-200 group">
                        <LayoutDashboard className="w-5 h-5 mr-3 group-hover:text-primary transition-colors" />
                        Dashboard
                    </Link>
                    <Link href="/dashboard/analyses" className="flex items-center px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-all duration-200 group">
                        <FileText className="w-5 h-5 mr-3 group-hover:text-primary transition-colors" />
                        My Analyses
                    </Link>
                    <Link href="/dashboard/profile" className="flex items-center px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-all duration-200 group">
                        <User className="w-5 h-5 mr-3 group-hover:text-primary transition-colors" />
                        Profile
                    </Link>
                    <Link href="/dashboard/billing" className="flex items-center px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-all duration-200 group">
                        <CreditCard className="w-5 h-5 mr-3 group-hover:text-primary transition-colors" />
                        Billing
                    </Link>
                    <Link href="/dashboard/settings" className="flex items-center px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-all duration-200 group">
                        <Settings className="w-5 h-5 mr-3 group-hover:text-primary transition-colors" />
                        Settings
                    </Link>

                    {/* Admin Link - Only visible to specific emails */}
                    {['ismailhadjlarbi71@gmail.com', 'ismailhadjlarbi2007@gmail.com'].includes(user.email || '') && (
                        <Link href="/admin" className="flex items-center px-4 py-3 text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors font-medium mt-4">
                            <Shield className="w-5 h-5 mr-3" />
                            Admin
                        </Link>
                    )}
                </nav>

                <div className="p-4 border-t border-border bg-muted/20">
                    <div className="flex items-center mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold mr-3 shadow-md">
                            {fullName[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                                {fullName}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                                {user.email}
                            </p>
                        </div>
                    </div>
                    <form action={signOut}>
                        <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
                            <LogOut className="w-5 h-5 mr-3" />
                            Sign Out
                        </Button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col md:pl-64 min-h-screen transition-all duration-300">
                {/* Mobile Header */}
                <header className="md:hidden sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                            <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-lg font-bold text-foreground tracking-tight">Talio</span>
                    </div>
                    <MobileNav userEmail={user.email || ''} />
                </header>

                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
