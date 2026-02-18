'use client';

import React from 'react';
import {
    Search,
    TrendingUp,
    ShieldCheck,
    Activity,
    Layers,
    BarChart3,
    Target,
    PieChart,
    ChevronRight,
    ArrowUpRight,
    Globe,
    Zap,
    Briefcase,
    Gem,
    PieChart as PieChartIcon
} from 'lucide-react';
import {
    PieChart as RePieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip
} from 'recharts';

const sectorData = [
    { name: 'Large Cap Stocks', value: 49.5, color: '#0ea5e9' },
    { name: 'Bluechip Dividend', value: 19.8, color: '#2dd4bf' },
    { name: 'Index ETF', value: 14.9, color: '#6366f1' },
    { name: 'Gold ETF', value: 9.9, color: '#f59e0b' },
    { name: 'Liquid Fund', value: 5.0, color: '#94a3b8' },
];

const fundData = [
    { name: 'Banking & Financials', value: 22.2, color: '#3b82f6' },
    { name: 'IT & Technology', value: 16.7, color: '#06b6d4' },
    { name: 'Auto', value: 16.7, color: '#ec4899' },
    { name: 'Energy', value: 11.1, color: '#8b5cf6' },
    { name: 'Infra/Capital', value: 11.1, color: '#6366f1' },
    { name: 'Pharma', value: 11.1, color: '#10b981' },
    { name: 'FMCG', value: 11.1, color: '#f43f5e' },
];

const analysisPillars = [
    { title: 'Trend Analysis', icon: TrendingUp, color: '#8b5cf6', desc: 'Predicting momentum' },
    { title: 'Support & Resistance', icon: Activity, color: '#3b82f6', desc: 'Price action zones' },
    { title: 'Risk Control', icon: ShieldCheck, color: '#ef4444', desc: 'Capital preservation' },
    { title: 'Portfolio Construction', icon: Layers, color: '#f59e0b', desc: 'Balanced allocation' },
    { title: 'Valuation Check', icon: BarChart3, color: '#10b981', desc: 'Intrinsic value' },
    { title: 'Stock Picking', icon: Target, color: '#ec4899', desc: 'Alpha selection' },
    { title: 'Sector Selection', icon: PieChart, color: '#06b6d4', desc: 'Weightage optimization' },
];

export default function ResearchPortfolio() {
    return (
        <section id="research" className="py-32 relative bg-[#FDFDFF] overflow-hidden">
            {/* Elegant Grain Texture & Gradients */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-[120px] -mr-64 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-100/30 rounded-full blur-[120px] -ml-64 -mb-32"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
                    <div className="max-w-xl">
                        <div className="flex items-center space-x-2 mb-4">
                            <span className="h-px w-8 bg-[#1B8A9F]"></span>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1B8A9F]">Institutional Research</span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-black text-gray-900 leading-[1.1] mb-6 tracking-tight">
                            The Science of <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1B8A9F] to-[#4ADE80]">Wealth Strategy</span>
                        </h2>
                    </div>
                    <div className="bg-white/50 backdrop-blur-md p-6 rounded-3xl border border-gray-100 shadow-sm max-w-sm">
                        <p className="text-gray-500 text-sm leading-relaxed font-medium italic">
                            "Precision is not an option; it is our foundation. We combine quantitative data with qualitative insights to build resilient portfolios."
                        </p>
                    </div>
                </div>

                {/* VISUAL 1: THE RADIAL JOURNEY */}
                <div className="relative mb-40">
                    <div className="text-center mb-16 lg:hidden">
                        <h3 className="text-2xl font-black text-gray-900 uppercase">Analysis Pillars</h3>
                    </div>

                    <div className="relative flex items-center justify-center min-h-[600px]">
                        {/* The "Semi-Circle" Path Illustration */}
                        <svg className="absolute hidden lg:block w-[900px] h-[450px] -top-10 opacity-20 pointer-events-none" viewBox="0 0 1000 500">
                            <path
                                d="M 100 450 A 400 400 0 0 1 900 450"
                                fill="none"
                                stroke="url(#lineGradient)"
                                strokeWidth="2"
                                strokeDasharray="10 10"
                            />
                            <defs>
                                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#8b5cf6" />
                                    <stop offset="50%" stopColor="#1B8A9F" />
                                    <stop offset="100%" stopColor="#06b6d4" />
                                </linearGradient>
                            </defs>
                        </svg>

                        {/* Central Intelligence Hub */}
                        <div className="relative z-20 group">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#1B8A9F]/20 to-[#4ADE80]/20 rounded-full blur-[40px] group-hover:blur-[60px] transition-all"></div>
                            <div className="w-64 h-64 md:w-80 md:h-80 bg-white rounded-full shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-gray-50 flex flex-col items-center justify-center p-10 text-center relative overflow-hidden transition-transform duration-700 hover:scale-105">
                                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#1B8A9F] to-[#4ADE80]"></div>
                                <div className="p-4 bg-teal-50 rounded-2xl mb-4 group-hover:rotate-[360deg] transition-transform duration-1000">
                                    <Globe className="w-8 h-8 text-[#1B8A9F]" />
                                </div>
                                <h4 className="text-2xl font-black text-gray-900 leading-tight mb-2 uppercase tracking-tighter">Market Research Analysis</h4>
                                <div className="w-12 h-1 bg-gray-100 rounded-full mb-4"></div>
                                <p className="text-[10px] font-black text-[#1B8A9F] uppercase tracking-[0.2em] animate-pulse">Core Intelligence Unit</p>
                            </div>
                        </div>

                        {/* Analysis Pillars - Floating around */}
                        {analysisPillars.map((pillar, idx) => {
                            const total = analysisPillars.length;
                            const angle = -180 + (idx * (180 / (total - 1)));
                            const radius = 430;
                            const x = Math.cos(angle * (Math.PI / 180)) * radius;
                            const y = Math.sin(angle * (Math.PI / 180)) * radius + 50;

                            return (
                                <div
                                    key={idx}
                                    className="absolute hidden lg:flex flex-col items-center transition-all duration-700"
                                    style={{
                                        transform: `translate(${x}px, ${y}px)`,
                                    }}
                                >
                                    <div className="group relative flex flex-col items-center">
                                        <div className="w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-gray-50 transition-all duration-500 group-hover:-translate-y-4 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] group-hover:border-[#1B8A9F]/30 relative z-10 overflow-hidden">
                                            <div className="absolute inset-0 bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <pillar.icon className="w-8 h-8 relative z-20" style={{ color: pillar.color }} />
                                            <div className="absolute bottom-0 left-0 w-full h-1 transition-all duration-500" style={{ backgroundColor: pillar.color }}></div>
                                        </div>

                                        <div className="mt-4 text-center opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 max-w-[120px]">
                                            <h5 className="text-[11px] font-black text-gray-900 uppercase leading-none mb-1">{pillar.title}</h5>
                                            <p className="text-[9px] font-bold text-gray-400">{pillar.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                    </div>

                    {/* Mobile View for Pillars */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4">
                        {analysisPillars.map((pillar, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                                    <pillar.icon className="w-6 h-6" style={{ color: pillar.color }} />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-gray-900 uppercase tracking-widest">{pillar.title}</p>
                                    <p className="text-[10px] text-gray-400 font-bold">{pillar.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* REDESIGNED PORTFOLIO DIVERSIFICATION */}
                <div className="space-y-16">
                    <div className="text-center max-w-2xl mx-auto">
                        <h3 className="text-4xl font-black text-gray-900 uppercase tracking-tight mb-4">Portfolio Diversification</h3>
                        <p className="text-gray-500 font-medium italic">Strategic allocation across multiple asset classes and economic sectors to ensure maximum capital protection and growth.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

                        {/* LEFT: Sector Card - Large & Modern */}
                        <div className="lg:col-span-12 xl:col-span-7 group">
                            <div className="bg-white rounded-[48px] p-8 md:p-12 border border-gray-100 shadow-2xl shadow-gray-200/50 h-full relative overflow-hidden transition-all duration-500 hover:shadow-teal-100/30">
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/30 rounded-full blur-3xl -mr-32 -mt-32"></div>

                                <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center h-full">
                                    <div className="w-full md:w-1/2 flex flex-col justify-center">
                                        <div className="flex items-center space-x-3 mb-6">
                                            <div className="p-3 bg-blue-50 rounded-2xl">
                                                <PieChartIcon className="w-6 h-6 text-blue-500" />
                                            </div>
                                            <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">TraderG Wealth fund - Sectors Diversification</h4>
                                        </div>
                                        <p className="text-gray-400 text-sm font-medium mb-8 leading-relaxed">
                                            Our sector allocation is data-driven, prioritizing high-liquidity large-cap stocks while maintaining exposure to blue-chip dividends and defensive ETFs.
                                        </p>
                                        <div className="space-y-3">
                                            {sectorData.map((item, idx) => (
                                                <div key={idx} className="flex flex-col">
                                                    <div className="flex justify-between items-center mb-1.5 flex-wrap gap-2">
                                                        <span className="text-[11px] font-black text-gray-700 uppercase tracking-wide">{item.name}</span>
                                                        <span className="text-xs font-black text-gray-900">{item.value}%</span>
                                                    </div>
                                                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full transition-all duration-1000"
                                                            style={{ width: `${item.value}%`, backgroundColor: item.color }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="w-full md:w-1/2 flex items-center justify-center relative">
                                        <div className="w-[300px] h-[300px] lg:w-[350px] lg:h-[350px]">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <RePieChart>
                                                    <Pie
                                                        data={sectorData}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={90}
                                                        outerRadius={140}
                                                        paddingAngle={10}
                                                        dataKey="value"
                                                        stroke="none"
                                                    >
                                                        {sectorData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip
                                                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontWeight: '900' }}
                                                    />
                                                </RePieChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <div className="text-center">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Target</p>
                                                <p className="text-4xl font-black text-gray-900">100<span className="text-blue-500">%</span></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Fund Card - Elegant & Stacked */}
                        <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-8">

                            <div className="bg-gradient-to-br from-gray-900 to-[#1B2A2E] rounded-[48px] p-10 text-white relative overflow-hidden flex-1 shadow-2xl">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl -mr-24 -mt-24"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center space-x-3 mb-8">
                                        <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                                            <Briefcase className="w-6 h-6 text-[#4ADE80]" />
                                        </div>
                                        <h4 className="text-2xl font-black uppercase tracking-tighter">TRADERG WEALTH FUND</h4>
                                    </div>

                                    <div className="space-y-4">
                                        {fundData.slice(0, 4).map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 transition-all hover:bg-white/10">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                                                    <span className="text-[11px] font-bold uppercase tracking-wide opacity-80">{item.name}</span>
                                                </div>
                                                <span className="text-sm font-black text-[#4ADE80]">{item.value}%</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Total Active Funds</p>
                                            <p className="text-xl font-black">7 Distinct Pillars</p>
                                        </div>
                                        <div className="p-4 bg-[#4ADE80] rounded-2xl text-black">
                                            <ArrowUpRight className="w-6 h-6" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Small Highlight Card */}
                            <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-xl flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center">
                                        <Gem className="w-7 h-7 text-[#1B8A9F]" />
                                    </div>
                                    <div>
                                        <h5 className="text-lg font-black text-gray-900 leading-tight uppercase tracking-tight">Alpha Strategy</h5>
                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">Multi-cycle Resilient</p>
                                    </div>
                                </div>
                                <div className="px-4 py-2 bg-teal-50 rounded-full text-[10px] font-black text-[#1B8A9F] uppercase tracking-widest border border-teal-100">
                                    Live Data
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Bottom CTA Overlay */}
                <div className="mt-40 text-center relative">
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-100 -z-10"></div>
                    <a href="/apply" className="inline-flex items-center bg-gray-900 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest hover:bg-[#1B8A9F] hover:scale-105 transition-all shadow-2cl">
                        Optimize Your Portfolio Now
                        <ChevronRight className="ml-3 w-5 h-5" />
                    </a>
                </div>
            </div>
        </section>
    );
}

