import Link from 'next/link';
import { ArrowRight, CheckCircle, FileText, Zap, BarChart } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2 font-bold text-xl text-teal-600">
            <Zap className="h-6 w-6" />
            <span>JobTranslator.ai</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="#features" className="hover:text-teal-600">Features</Link>
            <Link href="#pricing" className="hover:text-teal-600">Pricing</Link>
            <Link href="/dashboard" className="hover:text-teal-600">Dashboard</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-teal-600">
              Log in
            </Link>
            <Link href="/signup" className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-32">
        <div className="container mx-auto px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl mb-6">
                Understand any Job Ad in <span className="text-teal-600">60 seconds</span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Paste a job description and get a clear roadmap to apply and win the interview.
                We extract skills, identify gaps, and tailor your CV automatically.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard" className="inline-flex items-center justify-center rounded-lg bg-teal-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:bg-teal-700 transition-all">
                  Analyze a Job — Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link href="#demo" className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-900 hover:bg-slate-50 transition-all">
                  See how it works
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-4 text-sm text-slate-500">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-8 w-8 rounded-full bg-slate-200 border-2 border-white" />
                  ))}
                </div>
                <p>Trusted by 1,000+ job seekers</p>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <div className="relative rounded-2xl bg-white shadow-2xl border border-slate-100 p-2">
                <div className="rounded-xl bg-slate-50 p-6">
                  {/* Mock UI */}
                  <div className="space-y-4">
                    <div className="h-4 w-2/3 rounded bg-slate-200" />
                    <div className="h-4 w-full rounded bg-slate-200" />
                    <div className="h-4 w-5/6 rounded bg-slate-200" />
                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div className="rounded-lg bg-white p-4 shadow-sm">
                        <div className="h-8 w-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mb-2">
                          <CheckCircle className="h-5 w-5" />
                        </div>
                        <div className="h-3 w-16 rounded bg-slate-200 mb-1" />
                        <div className="h-2 w-24 rounded bg-slate-100" />
                      </div>
                      <div className="rounded-lg bg-white p-4 shadow-sm">
                        <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
                          <BarChart className="h-5 w-5" />
                        </div>
                        <div className="h-3 w-16 rounded bg-slate-200 mb-1" />
                        <div className="h-2 w-24 rounded bg-slate-100" />
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
      <section id="features" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-4">
              Everything you need to land the job
            </h2>
            <p className="text-lg text-slate-600">
              Stop guessing what the hiring manager wants. Our AI decodes the requirements and gives you a step-by-step plan.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <FileText className="h-6 w-6 text-teal-600" />,
                title: "Skill Extraction",
                desc: "Instantly see the 'must-have' vs 'nice-to-have' skills, with simple explanations for each."
              },
              {
                icon: <BarChart className="h-6 w-6 text-blue-600" />,
                title: "Gap Analysis",
                desc: "Compare your profile against the job. We highlight exactly what you're missing and how to learn it."
              },
              {
                icon: <Zap className="h-6 w-6 text-amber-600" />,
                title: "Tailored CVs",
                desc: "Get bullet points rewritten to match the job description's keywords and tone."
              }
            ].map((feature, i) => (
              <div key={i} className="rounded-2xl border border-slate-100 bg-slate-50 p-8 hover:shadow-md transition-shadow">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-slate-600">
              Start for free, upgrade when you're ready to apply at scale.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: "Free", price: "$0", features: ["3 Analyses / month", "Basic CV suggestions", "Standard support"] },
              { name: "Pro", price: "$9", features: ["30 Analyses / month", "Full Learning Roadmap", "PDF Downloads", "Priority support"], popular: true },
              { name: "Teams", price: "$49", features: ["Shared workspace", "Bulk uploads", "CSV Export", "API Access"] }
            ].map((plan, i) => (
              <div key={i} className={`relative rounded-2xl bg-white p-8 shadow-sm border ${plan.popular ? 'border-teal-600 ring-1 ring-teal-600' : 'border-slate-200'}`}>
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-teal-600 px-3 py-1 text-xs font-medium text-white">
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
                <div className="mt-4 flex items-baseline text-slate-900">
                  <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                  <span className="ml-1 text-sm font-semibold text-slate-500">/month</span>
                </div>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center text-sm text-slate-600">
                      <CheckCircle className="mr-3 h-5 w-5 text-teal-600 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={`mt-8 w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${plan.popular ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}>
                  {plan.name === 'Free' ? 'Get Started' : 'Subscribe'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-xl text-slate-900">
            <Zap className="h-6 w-6 text-teal-600" />
            <span>JobTranslator.ai</span>
          </div>
          <div className="text-sm text-slate-500">
            © 2024 JobTranslator.ai. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-slate-600">
            <Link href="#" className="hover:text-teal-600">Privacy</Link>
            <Link href="#" className="hover:text-teal-600">Terms</Link>
            <Link href="#" className="hover:text-teal-600">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
