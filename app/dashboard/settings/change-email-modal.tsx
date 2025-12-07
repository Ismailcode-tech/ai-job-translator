'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { updateEmail } from './actions';
import { toast } from 'sonner';

interface ChangeEmailModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentEmail: string;
}

export default function ChangeEmailModal({ isOpen, onClose, currentEmail }: ChangeEmailModalProps) {
    const [newEmail, setNewEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const isValid = newEmail && password && newEmail !== currentEmail;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return;

        setIsLoading(true);
        const result = await updateEmail(newEmail, password);
        setIsLoading(false);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success(result.message || 'Verification email sent!');
            setNewEmail('');
            setPassword('');
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-900">Change Email</h2>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1 hover:bg-slate-100 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="mb-4">
                    <p className="text-sm text-slate-600">
                        Current email: <span className="font-medium text-slate-900">{currentEmail}</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* New Email */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            New Email Address
                        </label>
                        <input
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            placeholder="your.new.email@example.com"
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                            required
                        />
                    </div>

                    {/* Password Confirmation */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                            required
                        />
                    </div>

                    <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
                        <p className="text-sm text-blue-800">
                            A verification email will be sent to your new email address. You'll need to click the link to confirm the change.
                        </p>
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
                            {isLoading ? 'Sending...' : 'Change Email'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
