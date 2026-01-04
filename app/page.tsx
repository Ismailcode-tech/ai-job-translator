'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { Footer } from '@/components/Footer';
import { Shield, Lock, Zap, Users, CheckCircle, ArrowRight, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 bg-gradient-to-br from-gray-50 via-indigo-50/20 to-gray-50 dark:from-gray-950 dark:via-indigo-950/20 dark:to-gray-950 text-gray-900 dark:text-white transition-colors duration-300">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 bg-gray-950/30 backdrop-blur-lg border-b border-gray-800/50 sticky top-0">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo />

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('how-it-works')} className="text-gray-300 hover:text-cyan-400 transition-colors">
                How It Works
              </button>
              <button onClick={() => scrollToSection('for-individuals')} className="text-gray-300 hover:text-cyan-400 transition-colors">
                For Individuals
              </button>
              <button onClick={() => scrollToSection('for-companies')} className="text-gray-300 hover:text-cyan-400 transition-colors">
                For Companies
              </button>
              <button onClick={() => scrollToSection('security')} className="text-gray-300 hover:text-cyan-400 transition-colors">
                Security
              </button>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <ModeToggle />
              <Link href="/login">
                <Button variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 rounded-xl px-6 transition-all">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold rounded-xl px-6 shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 py-4 border-t border-gray-800 animate-in fade-in slide-in-from-top-4 duration-200">
              <div className="flex flex-col gap-4">
                <button onClick={() => scrollToSection('how-it-works')} className="text-left text-gray-300 hover:text-cyan-400 transition-colors">
                  How It Works
                </button>
                <button onClick={() => scrollToSection('for-individuals')} className="text-left text-gray-300 hover:text-cyan-400 transition-colors">
                  For Individuals
                </button>
                <button onClick={() => scrollToSection('for-companies')} className="text-left text-gray-300 hover:text-cyan-400 transition-colors">
                  For Companies
                </button>
                <button onClick={() => scrollToSection('security')} className="text-left text-gray-300 hover:text-cyan-400 transition-colors">
                  Security
                </button>
                <Link href="/login">
                  <Button variant="outline" className="w-full border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 rounded-xl py-6 font-bold">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 font-bold rounded-xl py-6 shadow-lg shadow-indigo-500/20">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative container mx-auto px-6 py-24 md:py-32">
        <div className="text-center max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-indigo-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
            AI-Powered Professional Mediator
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Connecting individuals and companies through anonymized AI matching, consent-based contact, and credit-based access.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-white/20 transition-all flex items-center justify-center gap-2 font-bold group"
            >
              See How It Works
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <Link href="/signup?type=individual" className="w-full sm:w-auto">
              <Button className="px-8 py-7 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-black text-lg rounded-2xl shadow-xl shadow-cyan-600/20 w-full transition-all hover:scale-[1.02] active:scale-[0.98]">
                Join as Individual
              </Button>
            </Link>
            <Link href="/signup?type=company" className="w-full sm:w-auto">
              <Button className="px-8 py-7 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-lg rounded-2xl shadow-xl shadow-indigo-600/20 w-full transition-all hover:scale-[1.02] active:scale-[0.98]">
                Join as Company
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative container mx-auto px-6 py-24 scroll-mt-20">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-indigo-300 to-cyan-300 bg-clip-text text-transparent">
          How MEDYX Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { icon: Shield, title: '1. Anonymized Matching', desc: 'Our AI analyzes profiles while keeping identities completely anonymous until consent is granted.' },
            { icon: CheckCircle, title: '2. Consent-Based Contact', desc: 'Individuals control who can see their information. No contact without explicit consent.' },
            { icon: Zap, title: '3. Credit System', desc: 'Companies use credits to request connections, ensuring quality interactions and fair access.' }
          ].map((step, i) => (
            <div
              key={i}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 hover:border-cyan-500/50 transition-all"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                <step.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-gray-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* For Individuals Section */}
      <section id="for-individuals" className="relative bg-gradient-to-b from-transparent via-cyan-950/10 to-transparent py-24 scroll-mt-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                For Individuals
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Control your privacy. Get matched with opportunities that truly fit you.
              </p>
              <ul className="space-y-4">
                {[
                  'Complete privacy until you grant consent',
                  'AI-powered matching based on your skills and preferences',
                  'Transparent consent management',
                  'See who wants to connect before revealing your identity',
                  'No spam or unwanted contact'
                ].map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
                    <span className="text-gray-300">{benefit}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup?type=individual" className="inline-block mt-8">
                <Button className="bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold rounded-xl px-8 py-6 shadow-lg shadow-cyan-600/20 transition-all hover:scale-105">
                  Join as Individual
                </Button>
              </Link>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 hover:border-cyan-500/50 transition-all">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-500"></div>
                  <div>
                    <div className="h-3 w-32 bg-gray-700 rounded mb-2"></div>
                    <div className="h-2 w-24 bg-gray-800 rounded"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-full bg-gray-700 rounded"></div>
                  <div className="h-2 w-5/6 bg-gray-700 rounded"></div>
                  <div className="h-2 w-4/6 bg-gray-700 rounded"></div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 h-10 bg-cyan-500/20 border border-cyan-500/50 rounded-lg flex items-center justify-center text-cyan-400 text-sm">
                    Grant Consent
                  </div>
                  <div className="flex-1 h-10 bg-gray-700/20 border border-gray-700 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                    Reject
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Companies Section */}
      <section id="for-companies" className="relative container mx-auto px-6 py-24 scroll-mt-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 hover:border-indigo-500/50 transition-all order-2 md:order-1">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-400">AI Match Score</div>
                <div className="text-xl font-bold text-indigo-400">94%</div>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full w-[94%] bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
              </div>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex justify-between">
                  <span>Skills Match</span>
                  <span className="text-green-400">Excellent</span>
                </div>
                <div className="flex justify-between">
                  <span>Experience Level</span>
                  <span className="text-cyan-400">Perfect Fit</span>
                </div>
                <div className="flex justify-between">
                  <span>Location</span>
                  <span className="text-purple-400">Compatible</span>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Request Contact</span>
                  <span className="text-sm text-indigo-400">1 Credit</span>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
              For Companies
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Find the perfect candidates with AI-powered matching and transparent consent.
            </p>
            <ul className="space-y-4">
              {[
                'Access pre-qualified candidates matched to your needs',
                'Explainable AI shows why each match was suggested',
                'Credit-based system ensures quality over quantity',
                'Only pay for actual connections',
                'Complete transparency in the matching process'
              ].map((benefit, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-1" />
                  <span className="text-gray-300">{benefit}</span>
                </li>
              ))}
            </ul>
            <Link href="/signup?type=company" className="inline-block mt-8">
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl px-8 py-6 shadow-lg shadow-indigo-600/20 transition-all hover:scale-105">
                Join as Company
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="relative bg-gradient-to-b from-transparent via-indigo-950/10 to-transparent py-24 scroll-mt-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-300 to-cyan-300 bg-clip-text text-transparent">
            Trust & Security First
          </h2>
          <p className="text-xl text-gray-300 text-center mb-16 max-w-3xl mx-auto">
            Your privacy and security are our top priorities. MEDYX is built on enterprise-grade security and GDPR compliance.
          </p>
          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { icon: Shield, title: 'End-to-End Encryption', desc: 'All data is encrypted in transit and at rest' },
              { icon: Lock, title: 'GDPR Compliant', desc: 'Full compliance with EU data protection regulations' },
              { icon: Users, title: 'Consent-Based', desc: 'No data sharing without explicit user consent' },
              { icon: Zap, title: 'Audit Trail', desc: 'Complete transparency in all data access and usage' }
            ].map((item, i) => (
              <div
                key={i}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 text-center hover:border-indigo-500/50 transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/security">
              <Button variant="outline" className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-300 rounded-xl px-8 py-6 transition-all">
                Learn More About Security
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative container mx-auto px-6 py-24">
        <div className="bg-gradient-to-r from-indigo-900/50 via-purple-900/50 to-cyan-900/50 backdrop-blur-sm border border-indigo-500/50 rounded-2xl p-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals and companies using MEDYX to make better connections.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/signup?type=individual">
              <Button className="px-10 py-8 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-black text-xl rounded-2xl shadow-2xl shadow-cyan-600/30 w-full sm:w-auto transition-all hover:scale-105 active:scale-95">
                Join as Individual
              </Button>
            </Link>
            <Link href="/signup?type=company">
              <Button className="px-10 py-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xl rounded-2xl shadow-2xl shadow-indigo-600/30 w-full sm:w-auto transition-all hover:scale-105 active:scale-95">
                Join as Company
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
