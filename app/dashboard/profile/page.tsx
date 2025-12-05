import { getProfile } from './actions';
import ProfileForm from './profile-form';
import { redirect } from 'next/navigation';
import { UserCog } from 'lucide-react';

export default async function ProfilePage() {
    const data = await getProfile();

    if (!data) {
        redirect('/login');
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm border border-slate-200">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <UserCog className="h-48 w-48 text-teal-900" />
                </div>

                <div className="relative z-10">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Profile Settings</h1>
                    <p className="text-slate-500 max-w-2xl">
                        Manage your personal details, professional skills, and resume to get the most accurate AI job analysis.
                    </p>
                </div>
            </div>

            <ProfileForm user={data.user} profile={data.profile} />
        </div>
    );
}
