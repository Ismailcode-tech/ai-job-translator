'use client';

import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { deleteAccount } from './actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface DeleteAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function DeleteAccountModal({ isOpen, onClose }: DeleteAccountModalProps) {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const [understood, setUnderstood] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const isValid = password && confirmation === 'DELETE' && understood;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return;

        setIsLoading(true);
        const result = await deleteAccount(password, confirmation);
        setIsLoading(false);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success('Account deleted successfully');
            router.push('/');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-red-100 p-2">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">Delete Account</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1 hover:bg-slate-100 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="mb-6 space-y-3">
                    <p className="text-slate-700">
                        This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                    </p>
                    <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                        <p className="text-sm text-red-800 font-medium">The following data will be permanently deleted:</p>
                        <ul className="mt-2 space-y-1 text-sm text-red-700">
                            <li>• Your profile and settings</li>
                            <li>• All job analyses and history</li>
                            <li>• Your resume and uploaded files</li>
                            <li>• Subscription information</li>
                        </ul>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Confirmation Checkbox */}
                    <label className="flex items-start gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={understood}
                            onChange={(e) => setUnderstood(e.target.checked)}
                            className="mt-1 h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
                        />
                        <span className="text-sm text-slate-700">
                            I understand that this action cannot be undone and all my data will be permanently deleted.
                        </span>
                    </label>

                    {/* Type DELETE */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Type <span className="font-mono font-bold">DELETE</span> to confirm
                        </label>
                        <input
                            type="text"
                            value={confirmation}
                            onChange={(e) => setConfirmation(e.target.value)}
                            placeholder="DELETE"
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Enter your password to confirm
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none"
                            required
                        />
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
                            className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? 'Deleting...' : 'Delete Account'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
