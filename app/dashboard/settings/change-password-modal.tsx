'use client';

import { useState } from 'react';
import { X, Eye, EyeOff, Check } from 'lucide-react';
import { updatePassword } from './actions';
import { toast } from 'sonner';

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const passwordRequirements = [
        { label: 'At least 8 characters', met: newPassword.length >= 8 },
        { label: 'Contains uppercase letter', met: /[A-Z]/.test(newPassword) },
        { label: 'Contains lowercase letter', met: /[a-z]/.test(newPassword) },
        { label: 'Contains number', met: /[0-9]/.test(newPassword) },
    ];

    const isValid = passwordRequirements.every(req => req.met) && newPassword === confirmPassword;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return;

        setIsLoading(true);
        const result = await updatePassword(currentPassword, newPassword);
        setIsLoading(false);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success('Password updated successfully! A confirmation email has been sent.');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-900">Change Password</h2>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1 hover:bg-slate-100 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Current Password */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Current Password
                        </label>
                        <div className="relative">
                            <input
                                type={showCurrent ? 'text' : 'password'}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full rounded-lg border border-slate-200 px-3 py-2 pr-10 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrent(!showCurrent)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showCurrent ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showNew ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full rounded-lg border border-slate-200 px-3 py-2 pr-10 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowNew(!showNew)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showNew ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Password Requirements */}
                    {newPassword && (
                        <div className="space-y-1">
                            {passwordRequirements.map((req, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm">
                                    <div className={`rounded-full p-0.5 ${req.met ? 'bg-green-500' : 'bg-slate-200'}`}>
                                        <Check className={`h-3 w-3 ${req.met ? 'text-white' : 'text-transparent'}`} />
                                    </div>
                                    <span className={req.met ? 'text-green-600' : 'text-slate-500'}>
                                        {req.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                            required
                        />
                        {confirmPassword && newPassword !== confirmPassword && (
                            <p className="text-sm text-red-600 mt-1">Passwords do not match</p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!isValid || isLoading}
                            className="flex-1 rounded-lg bg-teal-600 px-4 py-2 font-medium text-white hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? 'Updating...' : 'Update Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
