'use client';

import { useState } from 'react';
import { Zap } from 'lucide-react';

export default function ComparisonMatrix() {
    const [investmentAmount, setInvestmentAmount] = useState(500000);

    // SVG Chart Calculations
    const maxAmount = 10000000;
    const chartScale = investmentAmount / maxAmount;
    const shreegY = 180 - (chartScale * 150);
    const fdY = 180 - (chartScale * 55);
    const cpY = 180 - (chartScale * 100);

    const comparisonData = [
        {
            criteria: 'Annual Yield Potential',
            fd: '7%',
            shreeg: '18%',
            summary: '3x higher payout architecture',
            highlight: true
        },
        {
            criteria: 'Monthly Cashflow',
            fd: `₹${Math.round((investmentAmount * 0.07) / 12).toLocaleString('en-IN')}`,
            shreeg: `₹${Math.round((investmentAmount * 0.18) / 12).toLocaleString('en-IN')}`,
            summary: 'Fixed payout on 1st of every month',
            highlight: true
        },
        {
            criteria: 'Risk Architecture',
            fd: 'Bank Secured',
            shreeg: 'Asset Seniority',
            summary: 'Priority claim over ordinary equity',
            highlight: false
        },
        {
            criteria: 'Capital Seniority',
            fd: 'Retail Tier',
            shreeg: 'Priority Tier-1',
            summary: 'Legal priority in capital stack',
            highlight: false
        },
        {
            criteria: 'Growth Vector',
            fd: 'Inflation Limited',
            shreeg: 'Compounding+',
            summary: 'Asset appreciation + fixed yield',
            highlight: true
        },
    ];

    return (
        <section className="py-16 md:py-32 bg-slate-50 selection:bg-[#1B8A9F] selection:text-white overflow-hidden relative">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-white skew-x-12 translate-x-1/2 pointer-events-none opacity-50"></div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">

                {/* Section Header: Focused & Clean */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24 gap-8">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="h-[1px] w-10 bg-[#1B8A9F]"></span>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1B8A9F]">The Yield Arbitrage</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.95]">
                            Structural shift in <br />
                            <span className="text-slate-300">capital efficiency.</span>
                        </h2>
                    </div>
                    <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-sm pb-2">
                        Comparing traditional security with institutional-grade yield multipliers.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
                    {/* Interactive Blades */}
                    <div className="lg:col-span-7 space-y-4">
                        {comparisonData.map((row, i) => (
                            <div
                                key={i}
                                className="group bg-white border border-slate-100 rounded-[24px] md:rounded-3xl p-5 md:p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-100 hover:border-[#1B8A9F]/20 relative overflow-hidden"
                            >
                                <div className="flex flex-col md:grid md:grid-cols-12 items-start md:items-center relative z-10 gap-6 md:gap-0">
                                    <div className="md:col-span-6 space-y-1">
                                        <p className="text-sm md:text-base font-black text-slate-900">{row.criteria}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{row.summary}</p>
                                    </div>
                                    <div className="w-full md:col-span-3 flex md:block items-center justify-between border-t md:border-t-0 pt-4 md:pt-0 border-slate-50">
                                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest md:mb-1">Bank FD</p>
                                        <p className="text-base font-bold text-slate-500 italic">{row.fd}</p>
                                    </div>
                                    <div className="w-full md:col-span-3 flex md:block items-center justify-between">
                                        <p className="md:hidden text-[11px] font-black text-[#1B8A9F] uppercase tracking-widest">Shreeg Yield</p>
                                        <div className={`inline-block px-5 py-2.5 rounded-xl transition-all duration-500 ${row.highlight
                                            ? 'bg-[#1B8A9F] text-white font-black shadow-xl shadow-[#1B8A9F]/40 scale-100 md:scale-110'
                                            : 'bg-slate-100 text-slate-900 font-black'
                                            }`}>
                                            {row.shreeg}
                                        </div>
                                    </div>
                                </div>
                                {/* Subtle hover background accent */}
                                <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-[#1B8A9F]/0 to-[#1B8A9F]/5 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                            </div>
                        ))}
                    </div>

                    {/* Live Chart Visualization & Integrated Calculator */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-slate-900 rounded-[30px] md:rounded-[40px] p-6 md:p-8 overflow-hidden relative group">
                            <div className="relative z-10 space-y-8">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-black text-white">Yield Optimizer.</h3>
                                        <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">
                                            Interactive Wealth Forecast
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Capital</p>
                                        <p className="text-xl font-black text-[#1B8A9F]">₹{(investmentAmount / 100000).toFixed(1)}L</p>
                                    </div>
                                </div>

                                {/* Integrated Slider */}
                                <div className="space-y-4 pt-4 border-t border-white/5 bg-white/[0.03] p-5 rounded-[24px] border border-white/5 shadow-2xl relative">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Adjust Capital</span>
                                        <span className="text-[10px] font-black text-[#1B8A9F] bg-[#1B8A9F]/10 px-2.5 py-0.5 rounded-full border border-[#1B8A9F]/20">Live Sync</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="500000"
                                        max="10000000"
                                        step="100000"
                                        value={investmentAmount}
                                        onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                                        className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#1B8A9F] hover:bg-white/15 transition-all"
                                    />
                                    <div className="flex justify-between text-[8px] font-black text-white/20 uppercase tracking-widest px-1">
                                        <span>Min 5L</span>
                                        <span>Max 1Cr</span>
                                    </div>
                                </div>

                                {/* Dynamic SVG Chart */}
                                <div className="h-44 relative scale-90 sm:scale-100 origin-center">
                                    <svg className="w-full h-full overflow-visible" viewBox="0 0 400 200">
                                        {/* Grid Lines */}
                                        <line x1="0" y1="200" x2="400" y2="200" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                                        <line x1="0" y1="150" x2="400" y2="150" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                                        <line x1="0" y1="100" x2="400" y2="100" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                                        <line x1="0" y1="50" x2="400" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

                                        {/* FD Path (Linear Growth) */}
                                        <path
                                            d={`M 0 180 L 400 ${fdY}`}
                                            fill="none"
                                            stroke="rgba(255,255,255,0.6)"
                                            strokeWidth="2.5"
                                            strokeDasharray="6 4"
                                            className="transition-all duration-500"
                                        />
                                        <circle cx="400" cy={fdY} r="4" fill="rgba(255,255,255,0.8)" className="transition-all duration-500" />
                                        <text x="390" y={fdY - 28} textAnchor="end" className="text-[10px] font-black fill-white/40 uppercase tracking-tighter transition-all duration-500">Bank FD Projection</text>
                                        <text x="390" y={fdY - 12} textAnchor="end" className="text-[12px] font-black fill-white/60 transition-all duration-500">
                                            ₹{(investmentAmount * 1.7 / 10000000).toFixed(2)}Cr
                                        </text>

                                        {/* SHREEG Path (Accelerated Growth) */}
                                        <path
                                            d={`M 0 180 Q 200 ${cpY} 400 ${shreegY}`}
                                            fill="none"
                                            stroke="#1B8A9F"
                                            strokeWidth="5"
                                            className="transition-all duration-500"
                                        />

                                        {/* Value Bubbles */}
                                        <g className="transition-all duration-500" style={{ transform: `translate(400px, ${shreegY}px)` }}>
                                            <rect x="-70" y="-35" width="85" height="28" rx="14" fill="#1B8A9F" className="shadow-2xl" />
                                            <text x="-27.5" y="-17" textAnchor="middle" className="text-[12px] font-black fill-white tracking-tight">
                                                ₹{(investmentAmount * 2.8 / 10000000).toFixed(1)}Cr
                                            </text>
                                            <text x="-27.5" y="-42" textAnchor="middle" className="text-[10px] font-black fill-[#1B8A9F] uppercase tracking-widest">SHREEG YIELD</text>
                                        </g>
                                    </svg>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 pt-8 border-t border-white/10">
                                    <div>
                                        <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Total Yield (10Y)</p>
                                        <p className="text-2xl md:text-3xl font-black text-white">~₹{(investmentAmount * 2.8 / 10000000).toFixed(1)}Cr</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-[#1B8A9F] uppercase tracking-widest mb-1">Multiplier Effect</p>
                                        <p className="text-2xl md:text-3xl font-black text-[#1B8A9F]">2.8x</p>
                                    </div>
                                </div>
                            </div>

                            {/* Background Glow */}
                            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#1B8A9F]/20 blur-[100px] rounded-full group-hover:bg-[#1B8A9F]/30 transition-all duration-1000"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
