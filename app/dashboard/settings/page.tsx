'use client';

import { useState, useEffect } from 'react';
import { Bell, Lock, Globe, Moon, Mail, Download, Trash2, Sun } from 'lucide-react';
import { updateEmailNotifications, updateLanguage, exportUserData } from './actions';
import { toast, Toaster } from 'sonner';
import ChangePasswordModal from './change-password-modal';
import ChangeEmailModal from './change-email-modal';
import DeleteAccountModal from './delete-account-modal';
import { createClient } from '@/utils/supabase/client';
import { useTranslations } from '@/lib/i18n-client';

export default function SettingsPage() {
    const t = useTranslations('settings');
    const tCommon = useTranslations('common');
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [language, setLanguage] = useState('en');
    const [darkMode, setDarkMode] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    useEffect(() => {
        loadUserData();

        // Load dark mode preference from localStorage
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        setDarkMode(savedDarkMode);
        if (savedDarkMode) {
            document.documentElement.classList.add('dark');
        }
    }, []);

    const loadUserData = async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            setUser(user);

            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profile) {
                setProfile(profile);
                setEmailNotifications(profile.email_notifications ?? true);
                setLanguage(profile.language || 'en');
            }
        }
    };

    const handleEmailNotificationsToggle = async () => {
        const newValue = !emailNotifications;
        setEmailNotifications(newValue);

        const result = await updateEmailNotifications(newValue);
        if (result.error) {
            toast.error(result.error);
            setEmailNotifications(!newValue); // Revert on error
        } else {
            toast.success(`Email notifications ${newValue ? 'enabled' : 'disabled'}`);
        }
    };

    const handleLanguageChange = async (newLanguage: string) => {
        setLanguage(newLanguage);
        const result = await updateLanguage(newLanguage);
        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success('Language updated');
        }
    };

    const handleDarkModeToggle = () => {
        const newValue = !darkMode;
        setDarkMode(newValue);
        localStorage.setItem('darkMode', String(newValue));

        if (newValue) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        toast.success(`${newValue ? 'Dark' : 'Light'} mode enabled`);
    };

    const handleExportData = async () => {
        setIsExporting(true);
        const result = await exportUserData();
        setIsExporting(false);

        if (result.error) {
            toast.error(result.error);
        } else if (result.data) {
            // Create and download JSON file
            const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `talio-data-export-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toast.success('Data exported successfully');
        }
    };

    if (!user) {
        return (
            <div className="max-w-3xl">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-slate-200 rounded w-1/4"></div>
                    <div className="h-64 bg-slate-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <>
            <Toaster position="top-right" richColors />

            <div className="max-w-3xl space-y-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
                    <p className="text-slate-600">Manage your account preferences and settings</p>
                </div>

                {/* Account Section */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-slate-900">Account</h2>
                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm divide-y divide-slate-100">
                        {/* Email */}
                        <div className="p-6 flex items-start justify-between">
                            <div className="flex gap-4">
                                <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-slate-900">Email Address</h3>
                                    <p className="text-sm text-slate-500">{user.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsEmailModalOpen(true)}
                                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                                Change
                            </button>
                        </div>

                        {/* Password */}
                        <div className="p-6 flex items-start justify-between">
                            <div className="flex gap-4">
                                <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
                                    <Lock className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-slate-900">Password</h3>
                                    <p className="text-sm text-slate-500">Last changed recently</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsPasswordModalOpen(true)}
                                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                                Change
                            </button>
                        </div>
                    </div>
                </div>

                {/* Preferences Section */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-slate-900">Preferences</h2>
                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm divide-y divide-slate-100">
                        {/* Email Notifications */}
                        <div className="p-6 flex items-start justify-between">
                            <div className="flex gap-4">
                                <div className="rounded-lg bg-teal-50 p-2 text-teal-600">
                                    <Bell className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-slate-900">Email Notifications</h3>
                                    <p className="text-sm text-slate-500">Receive emails about your analysis results</p>
                                </div>
                            </div>
                            <button
                                onClick={handleEmailNotificationsToggle}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${emailNotifications ? 'bg-teal-600' : 'bg-slate-200'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${emailNotifications ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>

                        {/* Language */}
                        <div className="p-6 flex items-start justify-between">
                            <div className="flex gap-4">
                                <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
                                    <Globe className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-slate-900">Language</h3>
                                    <p className="text-sm text-slate-500">Select your preferred language</p>
                                </div>
                            </div>
                            <select
                                value={language}
                                onChange={(e) => handleLanguageChange(e.target.value)}
                                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                            >
                                <option value="en">English</option>
                                <option value="es">Spanish</option>
                                <option value="fr">French</option>
                                <option value="de">German</option>
                            </select>
                        </div>

                        {/* Dark Mode */}
                        <div className="p-6 flex items-start justify-between">
                            <div className="flex gap-4">
                                <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                                    {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                                </div>
                                <div>
                                    <h3 className="font-medium text-slate-900">Dark Mode</h3>
                                    <p className="text-sm text-slate-500">Switch between light and dark themes</p>
                                </div>
                            </div>
                            <button
                                onClick={handleDarkModeToggle}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${darkMode ? 'bg-slate-700' : 'bg-slate-200'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Data & Privacy Section */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-slate-900">Data & Privacy</h2>
                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm divide-y divide-slate-100">
                        {/* Export Data */}
                        <div className="p-6 flex items-start justify-between">
                            <div className="flex gap-4">
                                <div className="rounded-lg bg-green-50 p-2 text-green-600">
                                    <Download className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-slate-900">Export Your Data</h3>
                                    <p className="text-sm text-slate-500">Download all your data as JSON</p>
                                </div>
                            </div>
                            <button
                                onClick={handleExportData}
                                disabled={isExporting}
                                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isExporting ? 'Exporting...' : 'Export'}
                            </button>
                        </div>

                        {/* Delete Account */}
                        <div className="p-6 flex items-start justify-between">
                            <div className="flex gap-4">
                                <div className="rounded-lg bg-red-50 p-2 text-red-600">
                                    <Trash2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-slate-900">Delete Account</h3>
                                    <p className="text-sm text-slate-500">Permanently delete your account and all data</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsDeleteModalOpen(true)}
                                className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <ChangePasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
            />
            <ChangeEmailModal
                isOpen={isEmailModalOpen}
                onClose={() => setIsEmailModalOpen(false)}
                currentEmail={user.email || ''}
            />
            <DeleteAccountModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
            />
        </>
    );
}
