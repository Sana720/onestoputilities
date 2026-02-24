'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Award, ArrowRight, Zap, Battery, Wind, Cpu, Shield, Settings, Home } from 'lucide-react';

const SOLUTIONS = {
    'Solar': {
        series: 'Solar Installation',
        horizon: '25+ Years',
        risk: 'Tier-1 Quality',
        returns: 'Up to 70% Savings',
        guaranteed: 'Performance Warranty',
        capital: '$0 Down Options',
        suitableFor: 'Homeowners',
        basis: 'Tier-1 PV Panels',
        fees: 'Custom Quotation',
        icon: <Zap className="w-6 h-6 text-amber-500" />,
        color: 'from-[#1D6FB5] to-sky-400'
    },
    'Battery': {
        series: 'Lithium Storage',
        horizon: '10+ Years',
        risk: 'Advanced Safety',
        returns: 'Energy Independence',
        guaranteed: 'Cycle Warranty',
        capital: 'Solar Integrated',
        suitableFor: 'Solar Owners',
        basis: 'Smart Storage',
        fees: 'Custom Quotation',
        icon: <Battery className="w-6 h-6 text-emerald-500" />,
        color: 'from-[#1D6FB5] to-indigo-500'
    },
    'Air Con': {
        series: 'Climate Control',
        horizon: '15+ Years',
        risk: 'High Efficiency',
        returns: 'Instant Comfort',
        guaranteed: 'Service Warranty',
        capital: 'Interest Free',
        suitableFor: 'Family Homes',
        basis: 'Inverter Tech',
        fees: 'Custom Quotation',
        icon: <Wind className="w-6 h-6 text-cyan-500" />,
        color: 'from-cyan-500 to-[#1D6FB5]'
    },
    'IT Solutions': {
        series: 'Managed IT',
        horizon: 'Ongoing Support',
        risk: 'Enterprise Grade',
        returns: 'Business Efficiency',
        guaranteed: 'SLA Backed',
        capital: 'Flexible Plans',
        suitableFor: 'Small/Medium Biz',
        basis: 'Cloud & Hardware',
        fees: 'Monthly / Project',
        icon: <Cpu className="w-6 h-6 text-indigo-500" />,
        color: 'from-indigo-600 to-[#1D6FB5]'
    }
};

interface HeroProps {
    onGetStarted?: () => void;
}

export default function Hero({ onGetStarted }: HeroProps) {
    const [activeTab, setActiveTab] = useState<keyof typeof SOLUTIONS>('Solar');
    const data = SOLUTIONS[activeTab];

    return (
        <section className="relative pt-24 pb-24 lg:pt-32 lg:pb-32 overflow-hidden">
            {/* Solar Background Overlay - Colorful Field Image (Subtle Wash) */}
            <div className="absolute inset-0 z-0 opacity-[0.35] pointer-events-none">
                <img src="/homepage/solar-power-field.jpg" alt="Solar Power Field" className="w-full h-full object-cover" />
                {/* Overlay Sheet to subdue image */}
                <div className="absolute inset-0 bg-white/40"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-white"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 lg:grid lg:grid-cols-12 lg:gap-8 items-center">
                <div className="lg:col-span-7 space-y-8">
                    <div className="inline-flex items-center gap-2 bg-white border border-slate-200 px-4 py-1.5 rounded-full">
                        <Award className="w-4 h-4 text-[#1D6FB5]" />
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Trusted by 5,000+ Australian Households</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.05] lg:leading-[0.95]">
                        Total Utilities.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1D6FB5] via-[#1F6BC0] to-sky-400">
                            Covered Safely.
                        </span>
                    </h1>

                    <p className="text-lg text-slate-500 max-w-xl leading-relaxed font-medium">
                        One Stop Utilities provides the rare combination of <span className="text-slate-900 font-bold underline decoration-[#1D6FB5]">Premium Service Quality</span> and long-term utility savings.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <button
                            onClick={onGetStarted}
                            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#1D6FB5] text-white px-8 py-4 rounded-2xl font-bold hover:shadow-2xl hover:shadow-[#1D6FB5]/30 transition-all"
                        >
                            Get a Quote <ArrowRight className="w-5 h-5" />
                        </button>

                        {/* LIVE FEED */}
                        <div className="flex items-center gap-3 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-100">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <img
                                        key={i}
                                        src={`https://i.pravatar.cc/100?img=${i + 10}`}
                                        className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm"
                                        alt="Recent Client"
                                    />
                                ))}
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-900 flex items-center justify-center text-[10px] text-white font-bold">
                                    +2k
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-black text-slate-900">Recent Installs</span>
                                <span className="text-[10px] font-bold text-[#1D6FB5] uppercase tracking-tight">Verified Projects</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FLOATING DATA CARD */}
                <div className="lg:col-span-5 relative group mt-16 lg:mt-12">
                    <div className="absolute -inset-4 bg-gradient-to-tr from-[#1D6FB5]/20 to-sky-400/20 blur-3xl rounded-[40px] opacity-50 group-hover:opacity-100 transition-opacity"></div>

                    <div className="relative bg-white border border-slate-100 p-6 rounded-[35px] shadow-2xl overflow-hidden transition-all duration-500">
                        {/* Tab Selector */}
                        <div className="flex justify-center p-1 bg-slate-50 rounded-2xl mb-6 gap-1 overflow-x-auto no-scrollbar">
                            {Object.keys(SOLUTIONS).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab as any)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab
                                        ? 'bg-white text-[#1D6FB5] shadow-sm'
                                        : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="flex justify-between items-center mb-6">
                            <div className="animate-in fade-in slide-in-from-left duration-500">
                                <h3 className="text-xs font-black text-[#1D6FB5] uppercase tracking-widest">Utility Package</h3>
                                <p className="text-2xl font-black text-slate-900">{data.series}</p>
                            </div>
                            <div className={`p-3 rounded-2xl bg-blue-50 transition-colors duration-500`}>
                                {data.icon}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-bottom duration-700">
                            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">
                                    Expected Lifespan
                                </p>
                                <p className="text-sm font-black text-slate-900">{data.horizon}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">
                                    Warranty Type
                                </p>
                                <p className={`text-sm font-black text-[#1D6FB5]`}>{data.guaranteed}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Performance</p>
                                <p className="text-sm font-black text-[#1D6FB5] uppercase tracking-tight">Tier-1 Standard</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Suitable For</p>
                                <p className="text-sm font-black text-slate-900 leading-tight">{data.suitableFor}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Primary Benefit</p>
                                <p className="text-sm font-black text-slate-900">{data.returns}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Payment Options</p>
                                <p className="text-sm font-black text-slate-900">{data.capital}</p>
                            </div>
                        </div>

                        <div className={`mt-4 p-4 bg-gradient-to-r ${data.color} rounded-2xl text-white transition-all duration-500`}>
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-xs font-bold opacity-60">Service Level</span>
                                <span className="text-xs font-bold bg-white/20 backdrop-blur-md px-2 py-0.5 rounded">
                                    Premium Care
                                </span>
                            </div>
                            <div className="flex items-end gap-2">
                                <span className="text-2xl font-black tracking-tight">{data.fees}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
