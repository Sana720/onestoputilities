'use client';

import { Shield, Activity, Zap, Globe, CheckCircle2 } from 'lucide-react';

export default function Features() {
    return (
        <section className="py-16 md:py-32 bg-white">
            <div className="max-w-7xl mx-auto px-6">

                {/* Section Header: Focused & Clean */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24 gap-8">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="h-[1px] w-10 bg-[#1B8A9F]"></span>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1B8A9F]">Security Framework</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.95]">
                            Institutional protocols. <br />
                            <span className="text-slate-300">Absolute transparency.</span>
                        </h2>
                    </div>
                    <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-sm pb-2">
                        We bridge the gap between complex capital structures and effortless investor experience.
                    </p>
                </div>

                {/* Primary Feature: The Capital Stack */}
                <div className="grid lg:grid-cols-12 border-t border-slate-100 group">
                    <div className="lg:col-span-6 py-12 md:py-16 lg:pr-12 lg:border-r border-slate-100">
                        <div className="space-y-8 animate-fade-in-up">
                            <div className="inline-flex p-3 bg-white border border-slate-100 rounded-xl text-[#1B8A9F] group-hover:bg-[#1B8A9F] group-hover:text-white transition-all duration-500">
                                <Shield className="w-6 h-6" />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-tight group-hover:translate-x-1 transition-transform">Priority Capital Seniority</h3>
                            <p className="text-lg text-slate-500 font-medium leading-relaxed">
                                ShreeG Preference Bonds are structured for **principal preservation**. Legally positioned above ordinary equity, your capital holds a superior claim on assets, ensuring you are first in the hierarchy of recovery.
                            </p>
                            <div className="flex gap-10 pt-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-[#1B8A9F] uppercase tracking-widest">Hierarchy</p>
                                    <p className="text-sm font-bold text-slate-900">Tier-1 Seniority</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-[#1B8A9F] uppercase tracking-widest">Structure</p>
                                    <p className="text-sm font-bold text-slate-900">Asset-Backed</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-6 py-12 md:py-16 lg:pl-20 flex items-center justify-center">
                        <div className="w-full relative group/visual">
                            <div className="absolute -inset-10 bg-[#1B8A9F]/10 blur-[100px] rounded-full group-hover/visual:bg-[#1B8A9F]/20 transition-all duration-1000"></div>
                            <div className="relative rounded-[30px] md:rounded-[40px] overflow-hidden shadow-2xl border border-slate-100">
                                <img
                                    src="/images/fintech_visual.png"
                                    alt="Fintech Institutional Data Visualization"
                                    className="w-full scale-105 group-hover/visual:scale-100 transition-transform duration-1000 ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                                <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 right-8 flex justify-between items-end">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Protocol V.5.0</p>
                                        <p className="text-base md:text-lg font-bold text-white tracking-tight">Encrypted Ledger Integrity</p>
                                    </div>
                                    <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                                        <Activity className="w-5 h-5 text-[#4ADE80]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Secondary Features: Grid Layout */}
                <div className="grid lg:grid-cols-2 border-t border-slate-100">

                    {/* CDSL Item */}
                    <div className="py-12 md:py-16 lg:pr-12 border-b lg:border-r border-slate-100 group transition-colors">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <Zap className="w-8 h-8 text-[#1B8A9F]" />
                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> CDSL Authenticated
                                </span>
                            </div>
                            <h4 className="text-2xl font-black text-slate-900 tracking-tight">Sovereign Digital Custody</h4>
                            <p className="text-slate-500 font-medium leading-relaxed">
                                Eliminate administrative friction. Shares are credited directly to your **Demat account**, providing an immutable digital record visible in any Tier-1 brokerage interface.
                            </p>
                        </div>
                    </div>

                    {/* Legacy Item */}
                    <div className="py-12 md:py-16 lg:pl-12 border-b border-slate-100 group transition-colors">
                        <div className="space-y-6">
                            <Globe className="w-8 h-8 text-[#1B8A9F]" />
                            <h4 className="text-2xl font-black text-slate-900 tracking-tight">Succession & Legacy</h4>
                            <p className="text-slate-500 font-medium leading-relaxed">
                                Integrated professional nominee registration ensures your wealth transition is seamless. We protect your legacy for the next generation through automated legal compliance.
                            </p>
                            <div className="pt-4 flex items-center gap-4">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Protocol Compliant</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Trust Bar */}
                <div className="mt-16 flex flex-wrap justify-center lg:justify-between gap-6 md:gap-8 opacity-40">
                    {['SEBI Compliant', 'Quarterly Audits', 'T+2 Settlement', 'Zero Administrative Fees'].map((text, i) => (
                        <span key={i} className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">{text}</span>
                    ))}
                </div>

            </div>
        </section>
    );
}
