import Link from 'next/link';
import { ArrowLeft, Mail, MapPin, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-background font-sans text-foreground py-20">
            <div className="container mx-auto px-6 max-w-5xl">
                <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Link>

                <div className="grid md:grid-cols-2 gap-12">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight mb-6">Get in touch</h1>
                        <p className="text-lg text-muted-foreground mb-8">
                            Have questions about Talio? We're here to help. Fill out the form or reach out to us directly.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                                    <Mail className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">Email</h3>
                                    <p className="text-muted-foreground">support@talio.ai</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-lg bg-purple-500/10 text-purple-500">
                                    <MessageSquare className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">Live Chat</h3>
                                    <p className="text-muted-foreground">Available Mon-Fri, 9am-5pm EST</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-lg bg-pink-500/10 text-pink-500">
                                    <MapPin className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">Office</h3>
                                    <p className="text-muted-foreground">123 AI Boulevard<br />San Francisco, CA 94105</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                        <form className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="first-name" className="text-sm font-medium">First name</label>
                                    <Input id="first-name" placeholder="John" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="last-name" className="text-sm font-medium">Last name</label>
                                    <Input id="last-name" placeholder="Doe" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium">Email</label>
                                <Input id="email" type="email" placeholder="john@example.com" />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium">Message</label>
                                <Textarea id="message" placeholder="How can we help you?" className="min-h-[150px]" />
                            </div>

                            <Button className="w-full bg-primary hover:bg-primary/90">
                                Send Message
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
