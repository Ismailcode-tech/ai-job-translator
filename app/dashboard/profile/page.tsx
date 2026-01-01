import { getProfile } from './actions';
import ProfileForm from './profile-form';
import { redirect } from 'next/navigation';
import { User, Shield } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default async function ProfilePage() {
    const t = await getTranslations('profile');
    const data = await getProfile();

    if (!data) {
        redirect('/login');
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-white mb-2">{t('headerTitle')}</h1>
                    <p className="text-gray-400 font-medium">
                        {t('headerDesc')}
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-slate-900/40 backdrop-blur-md border-white/5 shadow-xl">
                    <CardContent className="p-8 text-center flex flex-col items-center justify-center h-full min-h-[220px]">
                        <div className="w-20 h-20 mb-4 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/20">
                            <User className="w-10 h-10 text-white" />
                        </div>
                        <div className="text-xl font-bold text-white mb-2">Anonymous Profile</div>
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 py-1 font-semibold">Protected</Badge>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900/40 backdrop-blur-md border-white/5 shadow-xl">
                    <CardContent className="p-8 h-full min-h-[220px] flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-4">
                            <Shield className="w-5 h-5 text-cyan-400" />
                            <div className="text-sm font-medium text-gray-400">Privacy Status</div>
                        </div>
                        <div className="text-3xl font-black text-white mb-3">Fully Anonymous</div>
                        <p className="text-sm text-gray-400/80 font-medium leading-relaxed">
                            Your identity is hidden until you grant consent. Only your professional attributes are visible for matching.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <ProfileForm user={data.user} profile={data.profile} />
        </div>
    );
}
