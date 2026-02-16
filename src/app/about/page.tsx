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
    Globe
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[#FDFDFF] selection:bg-[#1B8A9F] selection:text-white overflow-x-hidden">
            <Navbar />

            {/* --- HERO SECTION: REFINED & VISUAL --- */}
            <section className="relative pt-40 pb-20 md:pt-48 md:pb-28 overflow-hidden bg-white">
                <div className="absolute inset-0 z-0 opacity-10">
                    <Image
                        src="/Users/ahmadsana/.gemini/antigravity/brain/2a3620e3-f618-4d9a-8a58-83a5116a4264/shreeg_institutional_office_1771186087490.png"
                        alt="Institutional Background"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-white via-white/95 to-white z-[1]"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="max-w-4xl mx-auto">
                        <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-gray-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-xl shadow-gray-200">
                            <span className="w-2 h-2 rounded-full bg-[#1B8A9F] animate-ping"></span>
                            <span>The SHREEG Legacy</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tighter leading-[1.1] mb-8">
                            Empowering <span className="text-[#1B8A9F]">Disciplined</span> <br className="hidden md:block" />
                            Trading for <span className="italic font-serif font-light">Sustainable Growth.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-500 font-semibold leading-relaxed max-w-2xl mx-auto mb-12">
                            TRADERG is the fusion of elite market intelligence and systematic growth. A decade of battle-tested strategies redefined for the modern investor.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-6">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center overflow-hidden">
                                        <div className="w-full h-full bg-gradient-to-tr from-[#1B8A9F] to-teal-400 opacity-60"></div>
                                    </div>
                                ))}
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-900 flex items-center justify-center text-[8px] font-black text-white">
                                    +2K
                                </div>
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 text-left">
                                Trusted by <br />Stakeholders
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- STORY SECTION: PREMIUM & IMAGE-RICH --- */}
            <section className="py-24 relative bg-gray-50/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="relative bg-white rounded-[40px] md:rounded-[50px] overflow-hidden shadow-2xl border border-gray-100 grid grid-cols-1 lg:grid-cols-2">
                        {/* Left Side: Image Content */}
                        <div className="relative min-h-[350px] lg:min-h-full bg-gray-900 group">
                            <Image
                                src="/Users/ahmadsana/.gemini/antigravity/brain/2a3620e3-f618-4d9a-8a58-83a5116a4264/shreeg_trading_desk_1771186104354.png"
                                alt="Trading Desktop"
                                fill
                                className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-8 md:p-12">
                                <div className="space-y-4">
                                    <div className="w-12 h-1 bg-[#1B8A9F]"></div>
                                    <h4 className="text-2xl font-black text-white leading-tight">Institutional Research. <br />Professional Execution.</h4>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Narrative */}
                        <div className="p-10 md:p-14 lg:p-20 space-y-10">
                            <div className="space-y-4">
                                <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-none">
                                    A Legacy of <br />Market Dominance.
                                </h2>
                                <div className="flex items-center space-x-3 text-[#1B8A9F]">
                                    <History className="w-5 h-5" />
                                    <span className="text-sm font-black uppercase tracking-widest">Est. 2011 • CIN: U74140CT2016PLC002054</span>
                                </div>
                            </div>
                            <p className="text-lg text-gray-500 leading-relaxed font-medium">
                                ShreeG Expert Wealth Advisory Limited was incorporated in 2016, but our roots trace back to 2011. What started as a dedicated sub-broking firm has evolved into a powerhouse of institutional research and fintech-driven growth.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                                <div className="p-6 bg-gray-50 rounded-[32px] border border-gray-100 group hover:bg-white hover:shadow-xl transition-all">
                                    <Gem className="w-8 h-8 text-[#1B8A9F] mb-4 group-hover:scale-110 transition-transform" />
                                    <h5 className="text-md font-black text-gray-900 mb-1">Elite Standard</h5>
                                    <p className="text-xs text-gray-400 font-semibold leading-relaxed">10 years + holding company vaulting for every single digital asset.</p>
                                </div>
                                <div className="p-6 bg-gray-50 rounded-[32px] border border-gray-100 group hover:bg-white hover:shadow-xl transition-all">
                                    <Target className="w-8 h-8 text-[#1B8A9F] mb-4 group-hover:scale-110 transition-transform" />
                                    <h5 className="text-md font-black text-gray-900 mb-1">Precision</h5>
                                    <p className="text-xs text-gray-400 font-semibold leading-relaxed">Systematic, data-driven approaches for consistent wealth.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- STATS SECTION: COMPACT & BALANCED --- */}
            <section className="py-20 md:py-28">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: 'Market Cap Managed', value: '₹500Cr+', sub: 'Institutional Grade' },
                            { label: 'Dedicated Clients', value: '1000+', sub: 'High Net Worth' },
                            { label: 'Regulatory Bodies', value: '3 Major', sub: 'NSE / BSE / CDSL' },
                            { label: 'States of Presence', value: '4 Key', sub: 'Central & West India' }
                        ].map((stat, i) => (
                            <div key={i} className="group p-8 bg-white rounded-[32px] border border-gray-100 transition-all hover:bg-gray-50">
                                <div className="text-[10px] font-black text-[#1B8A9F] uppercase tracking-widest mb-3 opacity-60">
                                    {stat.sub}
                                </div>
                                <div className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter mb-1">
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
            <section className="py-24 bg-gray-900 text-white overflow-hidden relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                        <div className="max-w-xl space-y-4">
                            <div className="inline-block px-4 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-[#1B8A9F]">
                                Fully Regulated
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">
                                Regulated Transparency. <br />Institutional Trust.
                            </h2>
                        </div>
                        <p className="text-gray-400 text-sm font-medium max-w-sm mb-2">Registered with India's leading financial institutions for professional trading and custodianship.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                        {[
                            { name: 'NSE', full: 'National Stock Exchange', id: 'AP0881009893', desc: 'Membership for professional Equities and Derivatives trading.' },
                            { name: 'BSE', full: 'Bombay Stock Exchange', id: 'AP0103130179283', desc: 'Direct corporate memberships for seamless market access.' },
                            { name: 'CDSL', full: 'Central Depository', id: 'ISIN: INE07AG01011', desc: 'Secure asset vaulting with registered ISIN certifications.' }
                        ].map((org, i) => (
                            <div key={i} className="p-10 bg-white/5 border border-white/10 rounded-[32px] group hover:bg-white/10 transition-all">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="text-4xl font-black text-white/10 group-hover:text-[#1B8A9F] transition-colors">{org.name}</div>
                                    <ShieldCheck className="w-8 h-8 text-[#1B8A9F]" />
                                </div>
                                <div className="mb-2">
                                    <h4 className="text-xl font-black">{org.full}</h4>
                                    <div className="text-[10px] font-black text-[#1B8A9F] uppercase tracking-widest mt-1 opacity-60">{org.id}</div>
                                </div>
                                <p className="text-gray-400 text-sm leading-relaxed">{org.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-10 bg-white/10 p-10 rounded-[32px] border border-white/10">
                        <div className="flex items-center space-x-3 text-[#1B8A9F]">
                            <Globe className="w-10 h-10" />
                            <span className="text-sm font-black uppercase tracking-[0.2em]">Regional Powerhouse</span>
                        </div>
                        <div className="flex flex-wrap justify-center gap-3">
                            {['Chhattisgarh', 'Madhya Pradesh', 'Gujarat', 'Maharashtra'].map((state, i) => (
                                <div key={i} className="px-5 py-2.5 bg-white text-gray-900 rounded-xl text-[9px] font-black uppercase tracking-wider">
                                    {state}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- TIMELINE: DYNAMIC GRID --- */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter">
                            Our <span className="text-[#1B8A9F]">Historical</span> Progress.
                        </h2>
                        <p className="text-gray-400 text-sm font-semibold">15 years of delivering systematic value.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                            <div key={i} className="p-8 bg-gray-50 border border-gray-100 rounded-[32px] hover:bg-white hover:shadow-2xl transition-all group">
                                <div className="inline-block px-3 py-1 bg-teal-50 text-[#1B8A9F] rounded-full text-[10px] font-black mb-4">
                                    {m.year}
                                </div>
                                <h4 className="text-lg font-black text-gray-900 mb-2 leading-tight">{m.event}</h4>
                                <p className="text-xs text-gray-500 font-medium leading-relaxed">{m.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- FINAL CTA: REFINED LUXURY --- */}
            <section className="py-24 pb-48">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="relative bg-gray-900 rounded-[50px] overflow-hidden p-12 md:p-24 text-center">
                        <Image
                            src="/Users/ahmadsana/.gemini/antigravity/brain/2a3620e3-f618-4d9a-8a58-83a5116a4264/shreeg_growth_concept_1771186122085.png"
                            alt="Growth Concept"
                            fill
                            className="object-cover opacity-20"
                        />
                        <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-[2px]"></div>

                        <div className="relative z-10 max-w-3xl mx-auto space-y-10">
                            <Zap className="w-12 h-12 text-[#1B8A9F] mx-auto animate-pulse" />
                            <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none">
                                Join the Future of <br className="hidden md:block" />
                                <span className="text-[#1B8A9F]">Institutional</span> Wealth.
                            </h2>
                            <p className="text-lg md:text-xl text-gray-400 font-semibold">
                                10+ Years of battle-tested market experience. <br className="hidden md:block" />Your institutional future starts here.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
                                <Link href="/apply" className="w-full sm:w-auto px-10 py-5 bg-[#1B8A9F] text-white rounded-[20px] font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-2xl shadow-[#1B8A9F]/20">
                                    Partner with Us
                                </Link>
                                <Link href="/login" className="w-full sm:w-auto px-10 py-5 bg-white/10 backdrop-blur-xl text-white border border-white/20 rounded-[20px] font-black uppercase tracking-widest text-xs hover:bg-white/20 transition-all">
                                    Member Login
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
