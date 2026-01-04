'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { MessageSquare, Send } from 'lucide-react';
import { sendMessage } from '../actions'; // We will add this export

interface MessageDialogProps {
    candidateEmail: string;
    candidateName: string;
}

export function MessageDialog({ candidateEmail, candidateName }: MessageDialogProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    async function handleSend() {
        if (!subject || !message) {
            alert('Please fill in both subject and message.');
            return;
        }

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('email', candidateEmail);
            formData.append('subject', subject);
            formData.append('message', message);

            const result = await sendMessage(formData);

            if (result?.error) {
                alert(`Error: ${result.error}`);
            } else {
                alert('Message sent successfully!');
                setOpen(false);
                setSubject('');
                setMessage('');
            }
        } catch (error: any) {
            alert('Failed to send message: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white h-12 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-slate-900 border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black tracking-tight">Contact {candidateName}</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Send a direct message to starting this conversation.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-500">Subject</label>
                        <Input
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Regarding: Senior Frontend Role..."
                            className="bg-white/5 border-white/10 focus:ring-indigo-500/50 text-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-500">Message</label>
                        <Textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Hi! We loved your profile and would like to schedule a chat..."
                            className="min-h-[150px] bg-white/5 border-white/10 focus:ring-indigo-500/50 text-white"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setOpen(false)} className="text-gray-400 hover:text-white hover:bg-white/10">
                        Cancel
                    </Button>
                    <Button onClick={handleSend} disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold">
                        {isLoading ? (
                            'Sending...'
                        ) : (
                            <>
                                <Send className="w-4 h-4 mr-2" />
                                Send Message
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
