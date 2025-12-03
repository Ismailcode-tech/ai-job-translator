import { getProfile } from './actions';
import ProfileForm from './profile-form';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
    const data = await getProfile();

    if (!data) {
        redirect('/login');
    }

    return (
        <div className="max-w-4xl space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Profile Settings</h1>
                <p className="text-slate-600">Manage your personal information and skills</p>
            </div>

            <ProfileForm user={data.user} profile={data.profile} />
        </div>
    );
}
