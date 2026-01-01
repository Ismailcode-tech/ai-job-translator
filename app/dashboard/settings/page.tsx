'use client';

import { useState, useEffect } from 'react';
import { Bell, Lock, Globe, Moon, Mail, Download, Trash2, Sun, Shield, Eye, Settings as SettingsIcon, CreditCard, UserCircle2, Loader2 } from 'lucide-react';
import { updateEmailNotifications, updateLanguage, exportUserData } from './actions';
import { toast, Toaster } from 'sonner';
import ChangePasswordModal from './change-password-modal';
import ChangeEmailModal from './change-email-modal';
import DeleteAccountModal from './delete-account-modal';
import { createClient } from '@/utils/supabase/client';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';

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

    const handleEmailNotificationsToggle = async (checked: boolean) => {
        setEmailNotifications(checked);

        const result = await updateEmailNotifications(checked);
        if (result.error) {
            toast.error(result.error);
            setEmailNotifications(!checked); // Revert on error
        } else {
            toast.success(`Email notifications ${checked ? 'enabled' : 'disabled'}`);
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

    const handleDarkModeToggle = (checked: boolean) => {
        setDarkMode(checked);
        localStorage.setItem('darkMode', String(checked));

        if (checked) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        toast.success(`${checked ? 'Dark' : 'Light'} mode enabled`);
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
            a.download = `medyx-data-export-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toast.success('Data exported successfully');
        }
    };

    if (!user) {
        return (
            <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
                <div className="h-10 bg-white/5 rounded-xl w-48"></div>
                <div className="h-64 bg-white/5 rounded-3xl"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
            <Toaster position="top-right" richColors />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <SettingsIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">{t('title')}</h1>
                        <p className="text-gray-400 mt-1">{t('subtitle')}</p>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="account" className="space-y-6">
                <TabsList className="bg-slate-900/40 border border-white/5 p-1 h-14 rounded-2xl">
                    <TabsTrigger value="account" className="px-8 rounded-xl data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all font-bold">
                        {t('account')}
                    </TabsTrigger>
                    <TabsTrigger value="preferences" className="px-8 rounded-xl data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all font-bold">
                        {t('preferences')}
                    </TabsTrigger>
                    <TabsTrigger value="privacy" className="px-8 rounded-xl data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all font-bold">
                        {t('dataPrivacy')}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="account" className="space-y-6 outline-none">
                    <Card className="bg-slate-900/40 backdrop-blur-md border-white/5 overflow-hidden">
                        <CardHeader className="border-b border-white/5 bg-white/5 px-8 py-6">
                            <CardTitle className="text-white text-xl flex items-center gap-3">
                                <UserCircle2 className="w-5 h-5 text-indigo-400" />
                                Account Security
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 divide-y divide-white/5">
                            {/* Email */}
                            <div className="p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group transition-colors hover:bg-white/[0.02]">
                                <div className="flex gap-5">
                                    <div className="rounded-2xl bg-indigo-500/10 p-3 text-indigo-400 border border-indigo-500/10">
                                        <Mail className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-lg">{t('email.title')}</h3>
                                        <p className="text-gray-400">{user.email}</p>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => setIsEmailModalOpen(true)}
                                    variant="outline"
                                    className="bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-xl px-6 h-11"
                                >
                                    {t('email.change')}
                                </Button>
                            </div>

                            {/* Password */}
                            <div className="p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group transition-colors hover:bg-white/[0.02]">
                                <div className="flex gap-5">
                                    <div className="rounded-2xl bg-purple-500/10 p-3 text-purple-400 border border-purple-500/10">
                                        <Lock className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-lg">{t('password.title')}</h3>
                                        <p className="text-gray-400">{t('password.lastChanged')}</p>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => setIsPasswordModalOpen(true)}
                                    variant="outline"
                                    className="bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-xl px-6 h-11"
                                >
                                    {t('password.change')}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="preferences" className="space-y-6 outline-none">
                    <Card className="bg-slate-900/40 backdrop-blur-md border-white/5 overflow-hidden">
                        <CardHeader className="border-b border-white/5 bg-white/5 px-8 py-6">
                            <CardTitle className="text-white text-xl flex items-center gap-3">
                                <Eye className="w-5 h-5 text-indigo-400" />
                                User Preferences
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 divide-y divide-white/5">
                            {/* Email Notifications */}
                            <div className="p-8 flex items-center justify-between group transition-colors hover:bg-white/[0.02]">
                                <div className="flex gap-5">
                                    <div className="rounded-2xl bg-teal-500/10 p-3 text-teal-400 border border-teal-500/10">
                                        <Bell className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-lg">{t('notifications.title')}</h3>
                                        <p className="text-gray-400 text-sm hidden sm:block">{t('notifications.description')}</p>
                                    </div>
                                </div>
                                <Switch
                                    checked={emailNotifications}
                                    onCheckedChange={handleEmailNotificationsToggle}
                                    className="data-[state=checked]:bg-indigo-600"
                                />
                            </div>

                            {/* Language */}
                            <div className="p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group transition-colors hover:bg-white/[0.02]">
                                <div className="flex gap-5">
                                    <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-400 border border-cyan-500/10">
                                        <Globe className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-lg">{t('language.title')}</h3>
                                        <p className="text-gray-400 text-sm hidden sm:block">{t('language.description')}</p>
                                    </div>
                                </div>
                                <select
                                    value={language}
                                    onChange={(e) => handleLanguageChange(e.target.value)}
                                    className="bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium cursor-pointer"
                                >
                                    <option value="en" className="bg-slate-900">English</option>
                                    <option value="es" className="bg-slate-900">Spanish</option>
                                    <option value="fr" className="bg-slate-900">French</option>
                                    <option value="de" className="bg-slate-900">German</option>
                                </select>
                            </div>

                            {/* Dark Mode */}
                            <div className="p-8 flex items-center justify-between group transition-colors hover:bg-white/[0.02]">
                                <div className="flex gap-5">
                                    <div className="rounded-2xl bg-amber-500/10 p-3 text-amber-400 border border-amber-500/10">
                                        {darkMode ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-lg">{t('darkMode.title')}</h3>
                                        <p className="text-gray-400 text-sm hidden sm:block">{t('darkMode.description')}</p>
                                    </div>
                                </div>
                                <Switch
                                    checked={darkMode}
                                    onCheckedChange={handleDarkModeToggle}
                                    className="data-[state=checked]:bg-indigo-600"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="privacy" className="space-y-6 outline-none">
                    <Card className="bg-slate-900/40 backdrop-blur-md border-white/5 overflow-hidden">
                        <CardHeader className="border-b border-white/5 bg-white/5 px-8 py-6">
                            <CardTitle className="text-white text-xl flex items-center gap-3">
                                <Shield className="w-5 h-5 text-indigo-400" />
                                {t('dataPrivacy')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 divide-y divide-white/5">
                            {/* Export Data */}
                            <div className="p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group transition-colors hover:bg-white/[0.02]">
                                <div className="flex gap-5">
                                    <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-400 border border-emerald-500/10">
                                        <Download className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-lg">{t('exportData.title')}</h3>
                                        <p className="text-gray-400 text-sm">{t('exportData.description')}</p>
                                    </div>
                                </div>
                                <Button
                                    onClick={handleExportData}
                                    disabled={isExporting}
                                    variant="outline"
                                    className="bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-xl px-6 h-11 disabled:opacity-50"
                                >
                                    {isExporting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {t('exportData.exporting')}
                                        </>
                                    ) : (
                                        <>
                                            <Download className="mr-2 h-4 w-4" />
                                            {t('exportData.button')}
                                        </>
                                    )}
                                </Button>
                            </div>

                            {/* Delete Account */}
                            <div className="p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group transition-colors hover:bg-white/[0.02]">
                                <div className="flex gap-5">
                                    <div className="rounded-2xl bg-rose-500/10 p-3 text-rose-400 border border-rose-500/10">
                                        <Trash2 className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-lg">{t('deleteAccount.title')}</h3>
                                        <p className="text-gray-400 text-sm">{t('deleteAccount.description')}</p>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => setIsDeleteModalOpen(true)}
                                    className="bg-rose-600/10 hover:bg-rose-600 hover:text-white text-rose-500 border border-rose-500/20 rounded-xl px-6 h-11"
                                >
                                    {t('deleteAccount.button')}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

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
        </div>
    );
}
