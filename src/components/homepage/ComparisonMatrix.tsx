'use client';

import { useState } from 'react';
import { Target, TrendingUp, ShieldCheck, ArrowRight, Info } from 'lucide-react';

export default function ComparisonMatrix() {
    const [investmentAmount, setInvestmentAmount] = useState(500000);

    // Chart Calculations
    const maxAmount = 10000000;
    const chartScale = investmentAmount / maxAmount;
    const tradergY = 180 - (chartScale * 150);
    const fdY = 180 - (chartScale * 45);
    const cpY = 180 - (chartScale * 100);

    const comparisonData = [
        {
            criteria: 'Monthly Returns',
            fd: `₹${((investmentAmount * 0.071) / 12 / 1000).toFixed(1)}K`,
            traderg: `₹${((investmentAmount * 0.18) / 12 / 1000).toFixed(1)}K`,
            summary: 'Average monthly yield',
            highlight: true
        },
        {
            criteria: 'Annual Returns',
            fd: `₹${((investmentAmount * 0.071) / 100000).toFixed(2)}L`,
            traderg: `₹${((investmentAmount * 0.18) / 100000).toFixed(2)}L`,
            summary: 'Net Annualized returns',
            highlight: false
        },
        {
            criteria: 'Minimum Investment',
            fd: '₹1,000/-',
            traderg: '₹5,00,000/-',
            summary: 'Entry barrier for investors',
            highlight: false
        },
        {
            criteria: 'Capital Security',
            fd: 'Very High',
            traderg: 'High',
            summary: 'Risk assessment profile',
            highlight: false
        },
        {
            criteria: 'Taxation (TDS)',
            fd: '10%',
            traderg: '10%',
            summary: 'Applicable tax on gains',
            highlight: false
        },
    ];

    return (
        <section id="portfolio" className="py-24 bg-gray-50/50 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-white opacity-40 skew-x-[15deg] translate-x-1/2"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-12">
                    <div className="max-w-2xl">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="h-px w-12 bg-[#1B8A9F]"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1B8A9F]">Arbitrage Advantage</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-gray-900 leading-[0.95] tracking-tighter uppercase">
                            Structural <br />
                            Inefficiency <br />
                            <span className="text-[#1B8A9F]">Corrected.</span>
                        </h2>
                    </div>
                    <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl max-w-sm">
                        <p className="text-gray-500 font-medium leading-relaxed italic">
                            "Tradition often masks underperformance. We provide the structural bridge to institutional yields that were previously inaccessible."
                        </p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-16 items-stretch">

                    {/* Comparison Tiles */}
                    <div className="lg:col-span-12 xl:col-span-7 space-y-4">
                        {/* Table Header */}
                        <div className="hidden md:grid grid-cols-12 gap-6 px-12 mb-2">
                            <div className="md:col-span-6">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Comparison Factor</span>
                            </div>
                            <div className="md:col-span-3">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Standard FD</span>
                            </div>
                            <div className="md:col-span-3 text-center">
                                <span className="text-[10px] font-black text-[#1B8A9F] uppercase tracking-[0.3em]">SHREE G WEALTH</span>
                            </div>
                        </div>

                        {comparisonData.map((row, i) => (
                            <div key={i} className={`group relative bg-white rounded-[32px] p-6 border transition-all duration-500 hover:shadow-2xl hover:shadow-gray-200/50 overflow-hidden ${row.highlight ? 'border-[#1B8A9F]/30 ring-1 ring-[#1B8A9F]/10' : 'border-gray-100'}`}>
                                <div className={`absolute inset-y-0 left-0 w-1 bg-[#1B8A9F] transition-opacity ${row.highlight ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></div>
                                <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                                    <div className="md:col-span-6">
                                        <p className="text-lg font-black text-gray-900 uppercase tracking-tight leading-none mb-1">{row.criteria}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{row.summary}</p>
                                    </div>
                                    <div className="md:col-span-3 flex md:flex-col justify-between items-center md:items-start border-t md:border-t-0 border-gray-50 pt-4 md:pt-0">
                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest md:hidden">Standard FD</span>
                                        <span className="text-lg font-black text-gray-400">{row.fd}</span>
                                    </div>
                                    <div className="md:col-span-3 flex md:flex-col justify-between items-center md:items-start border-t md:border-t-0 border-gray-50 pt-4 md:pt-0">
                                        <span className="text-[10px] font-black text-[#1B8A9F]/40 uppercase tracking-widest md:hidden">SHREE G WEALTH</span>
                                        <span className="text-lg font-black text-gray-900 group-hover:text-[#1B8A9F] transition-colors">{row.traderg}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Interactive Projections */}
                    <div className="lg:col-span-12 xl:col-span-5 h-full">
                        <div className="bg-gray-900 rounded-[48px] p-8 h-full relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#1B8A9F]/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Yield Compass</h3>
                                        <p className="text-[10px] font-black text-[#1B8A9F] uppercase tracking-widest mt-1">Institutional Forecast</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Active Capital</p>
                                        <p className="text-3xl font-black text-white">₹{(investmentAmount / 100000).toFixed(0)}<span className="text-[#1B8A9F]">L</span></p>
                                    </div>
                                </div>

                                {/* Slider Component */}
                                <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/5 mb-8 group/slider transition-all hover:bg-white/10">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Adjust Allocation</span>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                                            <span className="text-[9px] font-black text-blue-400 uppercase">Live Engine</span>
                                        </div>
                                    </div>
                                    <input
                                        type="range"
                                        min="500000"
                                        max="10000000"
                                        step="500000"
                                        value={investmentAmount}
                                        onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                                        className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#1B8A9F]"
                                    />
                                    <div className="flex justify-between mt-3">
                                        <span className="text-[9px] font-bold text-white/20">MIN 5L</span>
                                        <span className="text-[9px] font-bold text-white/20">MAX 1CR</span>
                                    </div>
                                </div>

                                {/* Visualization */}
                                <div className="h-40 relative mb-8">
                                    <svg className="w-full h-full overflow-visible" viewBox="0 0 400 200">
                                        {/* Value Labels */}
                                        <g className="transition-all duration-700">
                                            {/* Bank FD Label */}
                                            <text
                                                x="395"
                                                y={fdY - 12}
                                                textAnchor="end"
                                                className="text-[10px] font-black fill-white/40 uppercase tracking-tighter"
                                            >
                                                FD ~₹{(investmentAmount * 1.7 / 10000000).toFixed(2)}Cr
                                            </text>

                                            {/* TraderG Label */}
                                            <text
                                                x="395"
                                                y={tradergY - 25}
                                                textAnchor="end"
                                                className="text-[14px] font-black fill-[#3DD2E5] tracking-tight uppercase"
                                            >
                                                SHREE G WEALTH ₹{(investmentAmount * 2.8 / 10000000).toFixed(2)}Cr
                                            </text>
                                        </g>
                                        <path
                                            d={`M 0 180 L 400 ${fdY}`}
                                            fill="none"
                                            stroke="white"
                                            strokeWidth="2"
                                            strokeDasharray="10 6"
                                            className="opacity-20 transition-all duration-700"
                                        />
                                        <path
                                            d={`M 0 180 Q 200 ${cpY} 400 ${tradergY}`}
                                            fill="none"
                                            stroke="#1B8A9F"
                                            strokeWidth="5"
                                            className="transition-all duration-700"
                                        />
                                        <g transform={`translate(400, ${tradergY})`}>
                                            <circle r="8" fill="#1B8A9F" className="animate-pulse" />
                                            <circle r="16" fill="#1B8A9F" className="animate-ping opacity-20" />
                                        </g>
                                    </svg>
                                </div>

                                <div className="mt-auto grid grid-cols-2 gap-8 border-t border-white/5 pt-8">
                                    <div>
                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Growth Index</p>
                                        <p className="text-3xl font-black text-white">₹{(investmentAmount * 2.8 / 10000000).toFixed(1)}Cr</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-[#1B8A9F] uppercase tracking-widest mb-1">Yield Delta</p>
                                        <p className="text-3xl font-black text-[#1B8A9F]">2.8<span className="text-white/40">X</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="mt-24 pt-12 border-t border-gray-100 flex flex-wrap justify-center gap-16 opacity-30 grayscale filter">
                    {/* Simplified placeholder for institutional icons */}
                    <div className="flex items-center space-x-3">
                        <Target className="w-8 h-8" />
                        <span className="text-xl font-black tracking-tighter uppercase">FII Linked</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <ShieldCheck className="w-8 h-8" />
                        <span className="text-xl font-black tracking-tighter uppercase">Audit Clear</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <TrendingUp className="w-8 h-8" />
                        <span className="text-xl font-black tracking-tighter uppercase">Alpha Model</span>
                    </div>
                </div>
            </div>
        </section>
    );
}

