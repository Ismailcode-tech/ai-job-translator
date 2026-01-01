'use client';

import { useState, useEffect } from 'react';
import { Bell, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function NotificationBell() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const supabase = createClient();

    const fetchNotifications = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(10);

        if (data) {
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.is_read).length);
        }
    };

    const markAsRead = async (id: string) => {
        await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', id);

        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    useEffect(() => {
        fetchNotifications();

        // Polling as a simple real-time fallback
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-10 w-10 bg-white/5 hover:bg-white/10 rounded-xl transition-all">
                    <Bell className="h-5 w-5 text-gray-400" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-indigo-500 rounded-full border-2 border-slate-950 animate-pulse" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-slate-900/95 backdrop-blur-xl border-white/10 p-2 shadow-2xl">
                <div className="flex items-center justify-between p-3 border-b border-white/10">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Notifications</h3>
                    {unreadCount > 0 && (
                        <span className="text-[10px] font-black bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/20">
                            {unreadCount} New
                        </span>
                    )}
                </div>
                <div className="max-h-[400px] overflow-y-auto py-2">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-xs text-gray-500 italic">No notifications yet.</p>
                        </div>
                    ) : (
                        notifications.map((n) => (
                            <DropdownMenuItem
                                key={n.id}
                                className={cn(
                                    "flex flex-col items-start p-4 hover:bg-white/5 rounded-xl transition-colors cursor-pointer mb-1 border border-transparent",
                                    !n.is_read && "bg-indigo-500/5 border-indigo-500/10"
                                )}
                                onSelect={(e) => {
                                    if (!n.is_read) markAsRead(n.id);
                                }}
                            >
                                <div className="flex justify-between w-full mb-1">
                                    <span className="font-bold text-sm text-white">{n.title}</span>
                                    <span className="text-[10px] text-gray-500 uppercase font-black">{new Date(n.created_at).toLocaleDateString()}</span>
                                </div>
                                <p className="text-xs text-gray-400 leading-relaxed mb-3">{n.message}</p>
                                {n.link && (
                                    <Link
                                        href={n.link}
                                        className="inline-flex items-center text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors"
                                    >
                                        View Details <ExternalLink className="w-3 h-3 ml-1.5" />
                                    </Link>
                                )}
                            </DropdownMenuItem>
                        ))
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
