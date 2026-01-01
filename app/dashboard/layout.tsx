import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { LayoutDashboard, FileText, User, CreditCard, Settings, LogOut, Shield, Sparkles, Building2, Users, Layers, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/server';
import { MobileNav } from '@/components/mobile-nav';
import { signOut } from '@/app/login/actions';
import { ActivationOverlay } from '@/components/dashboard/activation-overlay';
import { NotificationBell } from '@/components/dashboard/notification-bell';
import { redirect } from 'next/navigation';

// Force dynamic rendering to prevent caching issues with profile data
export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const t = await getTranslations('nav');
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch profile for sidebar (fresh data, no cache)
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('name, user_type, is_activated')
        .eq('id', user.id)
        .maybeSingle();

    console.log('Dashboard layout - Profile data:', { user_type: profile?.user_type, error: profileError });

    // Redirect to onboarding if user type is not set
    console.log('--- LAYOUT DEBUG ---');
    console.log('User:', user.email);
    console.log('Profile Type:', profile?.user_type);

    if (!profile?.user_type) {
        console.log('Redirecting to onboarding - user_type not set');
        redirect('/onboarding/user-type');
    }



    const fullName = profile?.name || user.user_metadata?.full_name || 'User';

    const showActivationOverlay = profile?.user_type === 'company' && !profile?.is_activated;

    return (
        <div className="flex min-h-screen bg-background font-sans">
            {showActivationOverlay && <ActivationOverlay />}

            {/* Sidebar (Desktop) */}
            <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border fixed h-full z-30">
                <div className="p-6 border-b border-border">
                    <div className="flex items-center justify-between">
                        <Link href="/dashboard" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                                <Sparkles className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-foreground tracking-tight">MEDYX</span>
                        </Link>
                        <NotificationBell />
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {/* INDIVIDUAL NAVIGATION */}
                    {profile?.user_type === 'individual' && (
                        <>
                            <Link href="/dashboard" className="flex items-center px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-all duration-200 group">
                                <LayoutDashboard className="w-5 h-5 mr-3 group-hover:text-primary transition-colors" />
                                Control Room
                            </Link>
                            <Link href="/dashboard/matches" className="flex items-center px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-all duration-200 group">
                                <Layers className="w-5 h-5 mr-3 group-hover:text-primary transition-colors" />
                                Matches
                            </Link>
                            <Link href="/dashboard/connections" className="flex items-center px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-all duration-200 group">
                                <Users className="w-5 h-5 mr-3 group-hover:text-primary transition-colors" />
                                Connections
                            </Link>
                            <Link href="/dashboard/requests" className="flex items-center px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-all duration-200 group">
                                <Shield className="w-5 h-5 mr-3 group-hover:text-primary transition-colors" />
                                Consent Requests
                            </Link>
                            <Link href="/dashboard/profile" className="flex items-center px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-all duration-200 group">
                                <User className="w-5 h-5 mr-3 group-hover:text-primary transition-colors" />
                                Profile
                            </Link>
                        </>
                    )}

                    {/* COMPANY NAVIGATION */}
                    {profile?.user_type === 'company' && (
                        <>
                            <Link href="/dashboard/company" className="flex items-center px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-all duration-200 group">
                                <LayoutDashboard className="w-5 h-5 mr-3 group-hover:text-primary transition-colors" />
                                Control Room
                            </Link>
                            <Link href="/dashboard/company/pipeline" className="flex items-center px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-all duration-200 group">
                                <Layers className="w-5 h-5 mr-3 group-hover:text-primary transition-colors" />
                                Match Pipeline
                            </Link>
                            <Link href="/dashboard/company/opportunities" className="flex items-center px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-all duration-200 group">
                                <Briefcase className="w-5 h-5 mr-3 group-hover:text-primary transition-colors" />
                                Opportunities
                            </Link>
                            <Link href="/dashboard/company/connections" className="flex items-center px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-all duration-200 group">
                                <Users className="w-5 h-5 mr-3 group-hover:text-primary transition-colors" />
                                Connections
                            </Link>
                            <Link href="/dashboard/company/profile" className="flex items-center px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-all duration-200 group">
                                <Building2 className="w-5 h-5 mr-3 group-hover:text-primary transition-colors" />
                                Company Profile
                            </Link>
                            <Link href="/dashboard/billing" className="flex items-center px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-all duration-200 group">
                                <CreditCard className="w-5 h-5 mr-3 group-hover:text-primary transition-colors" />
                                {t('billing')}
                            </Link>
                        </>
                    )}

                    {/* SHARED / COMMON */}
                    <div className="pt-4 mt-4 border-t border-border">
                        <Link href="/dashboard/settings" className="flex items-center px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-all duration-200 group">
                            <Settings className="w-5 h-5 mr-3 group-hover:text-primary transition-colors" />
                            {t('settings')}
                        </Link>

                        {/* Admin Link - Only visible to specific emails */}

                        {/* Admin Link - Only visible to specific emails */}
                        {['ismailhadjlarbi71@gmail.com', 'ismailhadjlarbi2007@gmail.com'].includes(user.email || '') && (
                            <Link href="/admin" className="flex items-center px-4 py-3 text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors font-medium mt-4">
                                <Shield className="w-5 h-5 mr-3" />
                                {t('admin')}
                            </Link>
                        )}
                    </div>
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
                            {t('signOut')}
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
                        <span className="text-lg font-bold text-foreground tracking-tight">MEDYX</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <NotificationBell />
                        <MobileNav userEmail={user.email || ''} userType={profile?.user_type || ''} />
                    </div>
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
