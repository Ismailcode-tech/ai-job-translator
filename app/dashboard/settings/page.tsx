'use client';

import { Bell, Lock, Globe, Moon } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="max-w-3xl space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-600">Manage your preferences</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white shadow-sm divide-y divide-slate-100">
                {/* Notifications */}
                <div className="p-6 flex items-start justify-between">
                    <div className="flex gap-4">
                        <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                            <Bell className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-medium text-slate-900">Email Notifications</h3>
                            <p className="text-sm text-slate-500">Receive emails about your analysis results.</p>
                        </div>
                    </div>
                    <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-teal-600">
                        <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                    </div>
                </div>

                {/* Password */}
                <div className="p-6 flex items-start justify-between">
                    <div className="flex gap-4">
                        <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
                            <Lock className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-medium text-slate-900">Password</h3>
                            <p className="text-sm text-slate-500">Last changed 3 months ago.</p>
                        </div>
                    </div>
                    <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                        Change
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
                            <p className="text-sm text-slate-500">Select your preferred language.</p>
                        </div>
                    </div>
                    <select className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 focus:outline-none">
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                    </select>
                </div>

                {/* Theme */}
                <div className="p-6 flex items-start justify-between">
                    <div className="flex gap-4">
                        <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                            <Moon className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-medium text-slate-900">Dark Mode</h3>
                            <p className="text-sm text-slate-500">Switch between light and dark themes.</p>
                        </div>
                    </div>
                    <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200">
                        <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                    </div>
                </div>
            </div>
        </div>
    );
}
