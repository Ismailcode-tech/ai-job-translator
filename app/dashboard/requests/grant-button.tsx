'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { grantConsent } from './actions';

export function GrantAccessButton({ matchId }: { matchId: string }) {
    const [loading, setLoading] = useState(false);

    const handleGrant = async () => {
        setLoading(true);
        try {
            await grantConsent(matchId);
            toast.success("Access Granted", {
                description: "You have successfully connected with this company.",
            });
        } catch (error) {
            console.error(error);
            toast.error("Error", {
                description: "Failed to grant access. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={handleGrant}
            disabled={loading}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white h-14 px-10 rounded-xl shadow-xl shadow-indigo-600/20 border-0 font-black text-sm uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
            {loading ? <Loader2 className="w-5 h-5 mr-3 animate-spin" /> : <CheckCircle className="w-5 h-5 mr-3" />}
            Grant Full Access
        </Button>
    );
}
