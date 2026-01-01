import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { IndividualDashboard } from './individual-dashboard';
import { TrendingUp, Users, Bell, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch Profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    console.log('--- DASHBOARD DEBUG ---');
    console.log('User ID:', user.id);
    console.log('Profile Type:', profile?.user_type);
    console.log('Profile Activated:', profile?.is_activated);

    // Redirect company users to their dedicated dashboard
    if (profile?.user_type === 'company') {
        console.log('Redirecting to /dashboard/company');
        redirect('/dashboard/company');
    }

    // Fetch Stats (Server-side)
    const [
        { count: pendingCount },
        { count: activeCount },
        { count: totalCount },
        { data: requests }
    ] = await Promise.all([
        supabase.from('mediator_matches').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'consented'),
        supabase.from('mediator_matches').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'active'),
        supabase.from('mediator_matches').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('mediator_matches')
            .select(`
                id,
                ai_score,
                match_reason,
                job_posts (
                    title,
                    profiles (company_name)
                )
            `)
            .eq('user_id', user.id)
            .eq('status', 'consented')
            .limit(2)
    ]);

    // Calculate Profile Strength
    let strength = 20;
    if (profile?.name) strength += 20;
    if (profile?.skills && profile.skills.length > 0) strength += 20;
    if (profile?.bio) strength += 20;
    if (profile?.resume_url) strength += 20;

    const stats = [
        { label: 'Profile Strength', value: strength, icon: 'trending-up', color: 'from-emerald-500 to-green-500' },
        { label: 'Active Matches', value: activeCount || 0, icon: 'users', color: 'from-blue-500 to-indigo-500' },
        { label: 'Pending Requests', value: pendingCount || 0, icon: 'bell', color: 'from-orange-500 to-rose-500' },
        { label: 'Total Suggestions', value: totalCount || 0, icon: 'sparkles', color: 'from-purple-500 to-pink-500' },
    ];

    return (
        <IndividualDashboard
            stats={stats}
            recentRequests={requests || []}
            profileData={profile}
        />
    );
}
