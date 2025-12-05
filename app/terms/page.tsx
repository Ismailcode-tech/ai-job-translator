import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background font-sans text-foreground py-20">
            <div className="container mx-auto px-6 max-w-3xl">
                <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Link>

                <h1 className="text-4xl font-bold tracking-tight mb-8">Terms of Service</h1>

                <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-lg text-muted-foreground mb-6">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                        <p className="text-muted-foreground">
                            By accessing and using Talio, you accept and agree to be bound by the terms and provision of this agreement.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
                        <p className="text-muted-foreground">
                            Talio provides AI-powered job description analysis and CV optimization tools. We reserve the right to modify, suspend or discontinue the service at any time.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">3. User Account</h2>
                        <p className="text-muted-foreground">
                            You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">4. Subscription and Payments</h2>
                        <p className="text-muted-foreground">
                            Some parts of the Service are billed on a subscription basis. You will be billed in advance on a recurring and periodic basis (such as monthly).
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">5. Limitation of Liability</h2>
                        <p className="text-muted-foreground">
                            In no event shall Talio, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
