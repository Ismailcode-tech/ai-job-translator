import Link from 'next/link';
import { ArrowRight, CheckCircle, FileText, Sparkles, BarChart, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/30">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter text-primary">
            <div className="bg-gradient-to-tr from-indigo-500 to-purple-600 p-2 rounded-lg shadow-lg shadow-primary/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">Talio</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
            <Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link>
            <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden md:block text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Log in
            </Link>
            <Link href="/signup">
              <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 rounded-full px-6">
                Get Started
              </Button>
            </Link>
            {/* Mobile Menu Trigger (Placeholder for now) */}
            <button className="md:hidden p-2 text-muted-foreground">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 lg:pt-40">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10 opacity-50 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] -z-10" />

        <div className="container mx-auto px-6">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="max-w-2xl animate-fade-in-up">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-6 backdrop-blur-sm">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                Now using Gemini 1.5 Pro
              </div>
              <h1 className="text-5xl font-extrabold tracking-tight text-foreground sm:text-7xl mb-8 leading-[1.1]">
                Understand any <br />
                <span className="text-gradient">Job Ad in 60s</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-lg">
                Paste a job description and get a clear roadmap to apply and win the interview.
                We extract skills, identify gaps, and tailor your CV automatically.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard" className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-base font-semibold text-white shadow-xl shadow-primary/20 hover:bg-primary/90 hover:scale-105 transition-all duration-300">
                  Analyze a Job — Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link href="#demo" className="inline-flex items-center justify-center rounded-full border border-border bg-background/50 backdrop-blur-sm px-8 py-4 text-base font-semibold text-foreground hover:bg-muted transition-all">
                  See how it works
                </Link>
              </div>

            </div>

            {/* Glassmorphism Card Preview */}
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none perspective-1000">
              <div className="relative rounded-2xl bg-white/5 border border-white/10 p-2 shadow-2xl backdrop-blur-xl transform rotate-y-12 hover:rotate-y-0 transition-transform duration-700 ease-out">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-2xl pointer-events-none" />
                <div className="rounded-xl bg-background/80 p-6 h-[400px] flex flex-col">
                  {/* Mock UI Header */}
                  <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500/80" />
                      <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                      <div className="h-3 w-3 rounded-full bg-green-500/80" />
                    </div>
                    <div className="h-2 w-20 rounded-full bg-muted" />
                  </div>

                  {/* Mock UI Content */}
                  <div className="space-y-6 flex-1">
                    <div className="space-y-3">
                      <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
                      <div className="h-4 w-full rounded bg-muted/60 animate-pulse delay-75" />
                      <div className="h-4 w-5/6 rounded bg-muted/40 animate-pulse delay-150" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-8">
                      <div className="rounded-xl bg-primary/5 p-4 border border-primary/10">
                        <div className="h-10 w-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center mb-3">
                          <CheckCircle className="h-6 w-6" />
                        </div>
                        <div className="h-3 w-20 rounded bg-primary/20 mb-2" />
                        <div className="h-2 w-full rounded bg-primary/10" />
                      </div>
                      <div className="rounded-xl bg-purple-500/5 p-4 border border-purple-500/10">
                        <div className="h-10 w-10 rounded-lg bg-purple-500/20 text-purple-500 flex items-center justify-center mb-3">
                          <BarChart className="h-6 w-6" />
                        </div>
                        <div className="h-3 w-20 rounded bg-purple-500/20 mb-2" />
                        <div className="h-2 w-full rounded bg-purple-500/10" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-muted/30 relative">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-6">
              Everything you need to <span className="text-gradient">land the job</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Stop guessing what the hiring manager wants. Our AI decodes the requirements and gives you a step-by-step plan.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <FileText className="h-8 w-8 text-indigo-500" />,
                title: "Skill Extraction",
                desc: "Instantly see the 'must-have' vs 'nice-to-have' skills, with simple explanations for each.",
                color: "indigo"
              },
              {
                icon: <BarChart className="h-8 w-8 text-purple-500" />,
                title: "Gap Analysis",
                desc: "Compare your profile against the job. We highlight exactly what you're missing and how to learn it.",
                color: "purple"
              },
              {
                icon: <Sparkles className="h-8 w-8 text-pink-500" />,
                title: "Tailored CVs",
                desc: "Get bullet points rewritten to match the job description's keywords and tone.",
                color: "pink"
              }
            ].map((feature, i) => (
              <div key={i} className="group relative rounded-3xl border border-border bg-background p-10 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1">
                <div className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-${feature.color}-500/10 text-${feature.color}-500 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-6">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-muted-foreground">
              Start for free, upgrade when you're ready to apply at scale.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { name: "Free", price: "$0", features: ["3 Analyses / month", "Basic CV suggestions", "Standard support"] },
              { name: "Starter", price: "$5", features: ["15 Analyses / month", "Full Learning Roadmap", "PDF Downloads", "Priority support"], popular: true },
              { name: "Pro", price: "$10", features: ["Unlimited Analyses", "Bulk uploads", "CSV Export", "API Access"] }
            ].map((plan, i) => (
              <div key={i} className={`relative rounded-3xl p-10 transition-all duration-300 ${plan.popular ? 'bg-background border-2 border-primary shadow-2xl shadow-primary/10 scale-105 z-10' : 'bg-muted/30 border border-border hover:bg-muted/50'}`}>
                {plan.popular && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1.5 text-sm font-bold text-white shadow-lg">
                    Most Popular
                  </span>
                )}
                <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                <div className="mt-6 flex items-baseline text-foreground">
                  <span className="text-5xl font-extrabold tracking-tight">{plan.price}</span>
                  <span className="ml-2 text-lg font-medium text-muted-foreground">/month</span>
                </div>
                <ul className="mt-8 space-y-5">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center text-base text-muted-foreground">
                      <div className="mr-3 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={`mt-10 w-full rounded-xl px-4 py-4 text-base font-bold transition-all duration-300 ${plan.popular ? 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/25' : 'bg-white dark:bg-white/10 text-foreground border border-border hover:bg-muted'}`}>
                  {plan.name === 'Free' ? 'Get Started' : 'Subscribe'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-16">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 font-bold text-xl text-foreground">
            <div className="bg-gradient-to-tr from-indigo-500 to-purple-600 p-2 rounded-lg shadow-lg shadow-primary/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">Talio</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2024 Talio. All rights reserved.
          </div>
          <div className="flex gap-8 text-sm font-medium text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="#" className="hover:text-primary transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
