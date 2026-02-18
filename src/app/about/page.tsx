'use client';

import Navbar from '@/components/homepage/Navbar';
import Footer from '@/components/homepage/Footer';
import {
    ShieldCheck,
    TrendingUp,
    Users,
    Target,
    Zap,
    ChevronRight,
    ArrowUpRight,
    Lock,
    Scale,
    Gem,
    History,
    Globe,
    Sparkles,
    BarChart3
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[#FDFDFF] selection:bg-[#1B8A9F] selection:text-white overflow-x-hidden">
            <Navbar />

            {/* --- HERO SECTION: THE "AWESOME" PHASE --- */}
            <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[#020617] text-white">
                {/* Background Base */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <Image
                        src="/images/about/hero.png"
                        alt="TraderG Wealth Institutional Vision"
                        fill
                        className="object-cover opacity-70 animate-pulse-slow backdrop-brightness-50"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/40 to-transparent z-[1]"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent z-[1]"></div>

                    {/* Animated Glow Orbs */}
                    <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-[#1B8A9F]/20 rounded-full blur-[120px] animate-blob"></div>
                    <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                    <div className="lg:col-span-7 space-y-10">
                        <div className="inline-flex items-center space-x-3 px-6 py-2.5 bg-white/5 backdrop-blur-3xl border border-white/10 text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4 shadow-[0_0_50px_rgba(27,138,159,0.3)] border-t-white/20">
                            <Sparkles className="w-4 h-4 text-[#1B8A9F] animate-spin-slow" />
                            <span>The TraderG Wealth</span>
                        </div>

                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.8] mb-10">
                            Legacy <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1B8A9F] via-teal-300 to-white">Redefined.</span>
                        </h1>

                        <p className="text-2xl md:text-3xl text-gray-300 font-medium leading-tight max-w-xl">
                            <span className="text-[#1B8A9F] font-black italic">Trader</span> for Trading, <span className="text-white font-black italic">G</span> for Growth. <br className="hidden md:block" />
                            Precision engineering for your <span className="text-white italic font-serif">financial evolution</span>.
                        </p>

                        <div className="flex flex-wrap items-center gap-10 pt-4">
                            <Link href="/apply" className="relative px-12 py-6 bg-white text-[#020617] rounded-[24px] font-black uppercase tracking-[0.2em] text-[10px] hover:scale-105 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] group overflow-hidden">
                                <span className="relative z-10 flex items-center gap-3">
                                    Initiate Partnership
                                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-teal-50 to-white -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                            </Link>

                            <div className="h-16 w-px bg-white/10 hidden md:block"></div>

                            <div className="flex items-center gap-6">
                                <div className="space-y-1">
                                    <div className="text-3xl font-black text-white">15Y+</div>
                                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Market Dominance</div>
                                </div>
                                <div className="space-y-1 border-l border-white/10 pl-6">
                                    <div className="text-3xl font-black text-[#1B8A9F]">₹500Cr</div>
                                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Assets Under Trust</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5 relative hidden lg:block">
                        {/* Floating Interaction Cards */}
                        <div className="space-y-6">
                            <div className="p-8 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] shadow-2xl hover:bg-white/10 transition-all group translate-x-12 translate-y-6">
                                <div className="flex items-center justify-between mb-6">
                                    <ShieldCheck className="w-8 h-8 text-[#1B8A9F]" />
                                    <div className="text-[10px] font-black text-teal-400 bg-teal-400/10 px-3 py-1 rounded-full uppercase tracking-widest">Vault Secured</div>
                                </div>
                                <h4 className="text-xl font-black text-white mb-2">Institutional Grade</h4>
                                <p className="text-sm text-white font-medium">Multi-tenant digital asset vaulting with periodic third-party audits.</p>
                            </div>

                            <div className="p-8 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] shadow-2xl hover:bg-white/10 transition-all group -translate-x-8">
                                <div className="flex items-center justify-between mb-6">
                                    <TrendingUp className="w-8 h-8 text-[#1B8A9F]" />
                                    <div className="text-[10px] font-black text-teal-400 bg-teal-400/10 px-3 py-1 rounded-full uppercase tracking-widest">Live Alpha</div>
                                </div>
                                <h4 className="text-xl font-black text-white mb-2">Precision Yield</h4>
                                <p className="text-sm text-white font-medium">Systematic arbitrage and bond-equity fusion strategies.</p>
                            </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute top-1/2 -right-12 w-24 h-24 bg-[#1B8A9F] rounded-full blur-3xl opacity-30 animate-pulse"></div>
                    </div>
                </div>
            </section>

            {/* --- CORE PILLARS: GLASS CARDS --- */}
            <section className="py-24 -mt-24 relative z-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { icon: ShieldCheck, title: 'Absolute Security', desc: 'SEBI compliant framework with Multi-layer asset encryption and deep custodianship.' },
                            { icon: Target, title: 'Precision Alpha', desc: 'Proprietary institutional algorithms designed for consistent yield in volatile markets.' },
                            { icon: Globe, title: 'Global Standards', desc: 'Regulatory compliance across NSE, BSE, and CDSL with international best practices.' }
                        ].map((pillar, i) => (
                            <div key={i} className="group p-10 bg-white/80 backdrop-blur-3xl border border-white rounded-[40px] shadow-2xl shadow-gray-200/50 hover:-translate-y-2 transition-all duration-500">
                                <div className="w-16 h-16 rounded-[22px] bg-gray-50 flex items-center justify-center mb-8 group-hover:bg-[#1B8A9F] group-hover:text-white transition-all shadow-inner">
                                    <pillar.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">{pillar.title}</h3>
                                <p className="text-gray-500 font-semibold leading-relaxed text-sm">
                                    {pillar.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- STORY SECTION: PREMIUM & IMAGE-RICH --- */}
            <section className="py-32 relative bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-teal-50 rounded-[60px] blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative rounded-[50px] overflow-hidden shadow-2xl border-8 border-white aspect-[4/3]">
                                <Image
                                    src="/images/about/trading.png"
                                    alt="Institutional Trading Desk"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                                <div className="absolute bottom-10 left-10 right-10 flex items-center justify-between">
                                    <div className="px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl">
                                        <p className="text-[10px] font-black text-white uppercase tracking-widest">Research Precision</p>
                                    </div>
                                    <BarChart3 className="w-10 h-10 text-white opacity-40" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-10">
                            <div className="space-y-6">
                                <div className="inline-block px-4 py-1.5 bg-[#1B8A9F]/10 text-[#1B8A9F] rounded-full text-[10px] font-black uppercase tracking-widest">
                                    Our Foundations
                                </div>
                                <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter leading-none">
                                    A Legacy of <br />Market Dominance.
                                </h2>
                                <p className="text-xl text-gray-500 leading-relaxed font-semibold italic">
                                    "Fintech-driven growth with 15 years of battle-tested market delivery."
                                </p>
                            </div>

                            <p className="text-lg text-gray-500 leading-relaxed font-medium">
                                TraderG (ShreeG Expert Wealth Advisory Limited) was incorporated in 2016 as a public limited company. Our mission is to bridge the gap between complex market dynamics and sustainable wealth creation through accessible algo-trading.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
                                <div className="space-y-3">
                                    <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <History className="w-3 h-3 text-[#1B8A9F]" />
                                        Established 2011
                                    </h5>
                                    <p className="text-sm font-black text-gray-900">Over a decade of profitable institutional research.</p>
                                </div>
                                <div className="space-y-3">
                                    <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <HandshakeIcon className="w-3 h-3 text-[#1B8A9F]" />
                                        Public Limited
                                    </h5>
                                    <p className="text-sm font-black text-gray-900">Highly transparent, audit-ready corporate structure.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- STATS SECTION: COMPACT & BALANCED --- */}
            <section className="py-24 bg-gray-50/50">
                <div className="max-w-7xl mx-auto px-6 text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter mb-4">The TRADERG WEALTH <span className="text-[#1B8A9F]">Magnitude</span></h2>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Quantifiable Trust indicators</p>
                </div>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: 'Market Cap Managed', value: '₹500Cr+', sub: 'Institutional Grade' },
                            { label: 'Dedicated Clients', value: '1000+', sub: 'High Net Worth' },
                            { label: 'Regulatory Bodies', value: '3 Major', sub: 'NSE / BSE / CDSL' },
                            { label: 'States of Presence', value: '4 Key', sub: 'Central & West India' }
                        ].map((stat, i) => (
                            <div key={i} className="group p-10 bg-white rounded-[40px] border border-gray-100 transition-all hover:bg-white hover:shadow-2xl hover:shadow-gray-200/50">
                                <div className="text-[10px] font-black text-[#1B8A9F] uppercase tracking-widest mb-4 opacity-60">
                                    {stat.sub}
                                </div>
                                <div className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-2 group-hover:scale-110 transition-transform">
                                    {stat.value}
                                </div>
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- REGULATORY TRUST WALL --- */}
            <section className="py-32 bg-gray-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#1B8A9F]/20 rounded-full blur-[120px] -mr-64 -mt-64"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                        <div className="max-w-xl space-y-6">
                            <div className="inline-block px-5 py-2 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-[#1B8A9F]">
                                Fully Regulated Compliance
                            </div>
                            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]">
                                Transparency <br />Validated.
                            </h2>
                        </div>
                        <p className="text-gray-400 text-lg font-medium max-w-sm">Registered with India's highest financial authorities for absolute asset custodianship.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                        {[
                            { name: 'NSE', full: 'National Stock Exchange', id: 'AP0881009893', desc: 'Membership for equities and high-frequency derivative trading.' },
                            { name: 'BSE', full: 'Bombay Stock Exchange', id: 'AP0103130179283', desc: 'Global market access with direct corporate membership.' },
                            { name: 'CDSL', full: 'Central Depository', id: 'INE07AG01011', desc: 'Secure settlement with unique ISIN asset certifications.' }
                        ].map((org, i) => (
                            <div key={i} className="p-12 bg-white/5 border border-white/10 rounded-[50px] group hover:bg-white/10 transition-all shadow-2xl overflow-hidden relative">
                                <div className="absolute -right-4 -top-4 text-8xl font-black text-white/5 group-hover:text-[#1B8A9F]/10 transition-colors">{org.name}</div>
                                <div className="flex items-center justify-between mb-10">
                                    <div className="text-3xl font-black text-[#1B8A9F]">{org.name}</div>
                                    <ShieldCheck className="w-10 h-10 text-white/40 group-hover:text-white transition-colors" />
                                </div>
                                <div className="mb-6">
                                    <h4 className="text-2xl font-black tracking-tight">{org.full}</h4>
                                    <div className="text-[10px] font-black text-[#1B8A9F] uppercase tracking-widest mt-2">{org.id}</div>
                                </div>
                                <p className="text-gray-400 text-sm font-medium leading-relaxed">{org.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col lg:flex-row items-center justify-between gap-10 bg-white/5 p-12 rounded-[50px] border border-white/10 backdrop-blur-3xl">
                        <div className="flex items-center space-x-6">
                            <div className="w-16 h-16 rounded-2xl bg-[#1B8A9F] flex items-center justify-center">
                                <Globe className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h4 className="text-2xl font-black">Regional Powerhouse</h4>
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Active Central & Western Markets</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap justify-center gap-4">
                            {['Chhattisgarh', 'Madhya Pradesh', 'Gujarat', 'Maharashtra'].map((state, i) => (
                                <div key={i} className="px-8 py-3 bg-white text-gray-900 rounded-[18px] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#1B8A9F] hover:text-white transition-colors cursor-default">
                                    {state}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- ONBOARDING ROADMAP: THE 6 STEPS --- */}
            <section className="py-32 bg-[#F8FBFC] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-teal-500/5 rounded-full blur-[120px] -mr-96 -mt-96"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-24">
                        <div className="inline-block px-4 py-1.5 bg-[#1B8A9F]/10 text-[#1B8A9F] rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                            Onboarding Protocol
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter leading-tight">
                            Six Simple Steps to <br />
                            <span className="text-[#1B8A9F]">Start Growth.</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { step: '01', title: 'Registration', desc: 'Secure your access using your mobile number, email, or direct Google Auth.' },
                            { step: '02', title: 'Secure Login', desc: 'Access your dedicated dashboard with your encrypted credentials.' },
                            { step: '03', title: 'Select Tenor', desc: 'Choose your investment horizon to align with specific yield targets.' },
                            { step: '04', title: 'Complete KYC', desc: 'Frictionless verification using PAN, Aadhaar, and digital profile.' },
                            { step: '05', title: 'Demat Linkage', desc: 'Integrate with Arihant Capital for direct market execution.' },
                            { step: '06', title: 'Add Capital', desc: 'Inject funds into your demat account and trigger the algo-engine.' }
                        ].map((s, i) => (
                            <div key={i} className="group p-10 bg-white border border-gray-100 rounded-[48px] hover:shadow-2xl hover:shadow-[#1B8A9F]/10 transition-all duration-500">
                                <div className="text-5xl font-black text-gray-50 group-hover:text-[#1B8A9F]/10 transition-colors mb-6">
                                    {s.step}
                                </div>
                                <h4 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">{s.title}</h4>
                                <p className="text-gray-500 font-semibold text-sm leading-relaxed">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- TIMELINE: DYNAMIC GRID --- */}
            <section className="py-32 bg-white relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-24">
                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter">
                                Historical <span className="text-[#1B8A9F]">Eminence</span>.
                            </h2>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">A journey of systematic value creation</p>
                        </div>
                        <Link href="/apply" className="flex items-center gap-2 text-xs font-black text-[#1B8A9F] uppercase tracking-widest hover:gap-4 transition-all pb-2 border-b-2 border-teal-50">
                            View All Milestones <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { year: '2011', event: 'Sub-Broking Origins', desc: 'Laying the foundation of market intelligence.' },
                            { year: '2016', event: 'Public Limited Inc.', desc: 'Incorporated as a Public Limited entity.' },
                            { year: '2018', event: 'NSE/BSE Membership', desc: 'Acquired direct national exchange licenses.' },
                            { year: '2019', event: 'ISIN Integration', desc: 'Secure settlement with CDSL registration.' },
                            { year: '2022', event: '100 CR+ AUM', desc: 'Surpassed significant portfolio milestones.' },
                            { year: '2023', event: 'Fintech Scale', desc: 'SreenErg Technologies launched for scale.' },
                            { year: '2026', event: '500 CR Milestone', desc: 'Reached 1000+ active stakeholders.' },
                            { year: '2026', event: 'Preference Bonds', desc: 'Launched flagship bond equity products.' }
                        ].map((m, i) => (
                            <div key={i} className="p-10 bg-gray-50/50 border border-gray-100 rounded-[40px] hover:bg-white hover:shadow-2xl transition-all group relative overflow-hidden">
                                <div className="text-6xl font-black text-gray-100 absolute -right-4 -top-4 group-hover:text-teal-50 transition-colors">{m.year}</div>
                                <div className="relative z-10">
                                    <div className="inline-block px-4 py-1.5 bg-white shadow-sm text-[#1B8A9F] rounded-full text-[10px] font-black mb-6">
                                        {m.year}
                                    </div>
                                    <h4 className="text-xl font-black text-gray-900 mb-4 leading-tight">{m.event}</h4>
                                    <p className="text-sm text-gray-500 font-semibold leading-relaxed">{m.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- FINAL CTA: REFINED LUXURY --- */}
            <section className="py-24 pb-48">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="relative bg-[#0F172A] rounded-[60px] overflow-hidden p-16 md:p-32 text-center group">
                        <Image
                            src="/images/about/wealth.png"
                            alt="Institutional Growth"
                            fill
                            className="object-cover opacity-30 group-hover:scale-105 transition-transform duration-[3s]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-gray-900 via-gray-900/40 to-transparent"></div>
                        <div className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-[2px]"></div>

                        <div className="relative z-10 max-w-4xl mx-auto">
                            <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-[10px] font-black uppercase tracking-widest text-white mb-12 shadow-2xl">
                                <Sparkles className="w-4 h-4 text-[#1B8A9F]" />
                                New Era of Wealth
                            </div>
                            <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.85] mb-12">
                                Join the Future of <br />
                                <span className="text-[#1B8A9F]">Institutional</span> Wealth.
                            </h2>
                            <p className="text-xl md:text-2xl text-gray-300 font-medium mb-16 max-w-2xl mx-auto">
                                10+ Years of battle-tested market experience. <br className="hidden md:block" />Your institutional future starts with one conversation.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                                <Link href="/apply" className="w-full sm:w-auto px-12 py-6 bg-[#1B8A9F] text-white rounded-[24px] font-black uppercase tracking-[0.2em] text-[10px] hover:scale-105 transition-all shadow-2xl shadow-[#1B8A9F]/40">
                                    Partner with Us
                                </Link>
                                <Link href="/login" className="w-full sm:w-auto px-12 py-6 bg-white/10 backdrop-blur-2xl text-white border border-white/20 rounded-[24px] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white/20 transition-all">
                                    Intelligence Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

function HandshakeIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m11 17 2 2 4-4" />
            <path d="m5.88 15.5 1.42 1.42a2 2 0 0 0 2.82 0l7.42-7.42" />
            <path d="M11 5a3 3 0 1 0-6 0v5.82a2 2 0 0 0 .58 1.42l3.18 3.18" />
            <path d="M12 21h6.12a2 2 0 0 0 1.42-.58L21 18.24a2 2 0 0 0 0-2.82L17.82 12.24a2 2 0 0 0-1.42-.58H12" />
        </svg>
    )
}
