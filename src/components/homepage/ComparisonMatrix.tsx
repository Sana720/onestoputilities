'use client';

import { useState } from 'react';
import { Target, TrendingUp, ShieldCheck, ArrowRight, Info, Headset, Zap, Flame, Sun, Code2, Smartphone, Phone, Truck, Package, Activity, CheckCircle2 } from 'lucide-react';

interface ComparisonMatrixProps {
    onOpenModal?: () => void;
}

export default function ComparisonMatrix({ onOpenModal }: ComparisonMatrixProps) {
    const comparisonData = [
        {
            criteria: 'Utility Management',
            standard: 'Multiple Vendors',
            onestop: 'Unified Concierge',
            summary: 'Number of relationships to maintain',
            highlight: true
        },
        {
            criteria: 'Support Protocol',
            standard: 'Automated Queues',
            onestop: 'Private Client Hub',
            summary: 'Communication and resolution path',
            highlight: false
        },
        {
            criteria: 'Live Monitoring',
            standard: 'None (Reactive)',
            onestop: 'AI-Led (Proactive)',
            summary: 'System health and performance tracking',
            highlight: false
        },
        {
            criteria: 'Billing Structure',
            standard: 'Fragmented Streams',
            onestop: 'Single Consolidated',
            summary: 'Payment and administrative overhead',
            highlight: false
        },
        {
            criteria: 'Optimization',
            standard: 'Manual Audits',
            onestop: 'Proactive Tuning',
            summary: 'Efficiency and cost reduction updates',
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
                            <div className="h-px w-12 bg-[#1D6FB5]"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1D6FB5]">The Management Metric</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-gray-900 leading-[0.95] tracking-tighter uppercase">
                            Utility <br />
                            Operations <br />
                            <span className="text-[#1D6FB5]">Redefined.</span>
                        </h2>
                    </div>
                    <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl max-w-sm">
                        <p className="text-gray-500 font-medium leading-relaxed italic">
                            "Modern utilities require more than just a connection. We provide the operational intelligence and human-led concierge that previously didn't exist."
                        </p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-16 items-stretch">

                    {/* Comparison Tiles */}
                    <div className="lg:col-span-12 xl:col-span-7 space-y-4">
                        {/* Table Header */}
                        <div className="hidden md:grid grid-cols-12 gap-6 px-12 mb-2">
                            <div className="md:col-span-6">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Operational Factor</span>
                            </div>
                            <div className="md:col-span-3">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Traditional Model</span>
                            </div>
                            <div className="md:col-span-3 text-center">
                                <span className="text-[10px] font-black text-[#1D6FB5] uppercase tracking-[0.3em]">ONE STOP EXCELLENCE</span>
                            </div>
                        </div>

                        {comparisonData.map((row, i) => (
                            <div key={i} className={`group relative bg-white rounded-[32px] p-6 border transition-all duration-500 hover:shadow-2xl hover:shadow-gray-200/50 overflow-hidden ${row.highlight ? 'border-[#1D6FB5]/30 ring-1 ring-[#1D6FB5]/10' : 'border-gray-100'}`}>
                                <div className={`absolute inset-y-0 left-0 w-1 bg-[#1D6FB5] transition-opacity ${row.highlight ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></div>
                                <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                                    <div className="md:col-span-6">
                                        <p className="text-lg font-black text-gray-900 uppercase tracking-tight leading-none mb-1">{row.criteria}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{row.summary}</p>
                                    </div>
                                    <div className="md:col-span-3 flex md:flex-col justify-between items-center md:items-start border-t md:border-t-0 border-gray-50 pt-4 md:pt-0">
                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest md:hidden">Traditional Model</span>
                                        <span className="text-lg font-black text-gray-400">{row.standard}</span>
                                    </div>
                                    <div className="md:col-span-3 flex md:flex-col justify-between items-center md:items-start border-t md:border-t-0 border-gray-50 pt-4 md:pt-0">
                                        <span className="text-[10px] font-black text-[#1D6FB5]/40 uppercase tracking-widest md:hidden">ONE STOP EXCELLENCE</span>
                                        <span className="text-lg font-black text-gray-900 group-hover:text-[#1D6FB5] transition-colors">{row.onestop}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Concierge Support Hub - NEW SECTION */}
                    <div className="lg:col-span-12 xl:col-span-5 h-full">
                        <div className="bg-gray-900 rounded-[48px] p-8 h-full relative overflow-hidden group shadow-2xl">
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#1D6FB5]/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-10">
                                    <div>
                                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Concierge Hub</h3>
                                        <p className="text-[10px] font-black text-[#1D6FB5] uppercase tracking-widest mt-1">24/7 Managed Excellence</p>
                                    </div>
                                    <div className="bg-[#1D6FB5] p-4 rounded-2xl shadow-lg shadow-[#1D6FB5]/20">
                                        <Headset className="w-6 h-6 text-white" />
                                    </div>
                                </div>

                                {/* Active Service Grid */}
                                <div className="grid grid-cols-2 gap-3 mb-10">
                                    {[
                                        { icon: Zap, label: 'Electricity' },
                                        { icon: Flame, label: 'Gas' },
                                        { icon: Sun, label: 'Solar' },
                                        { icon: Code2, label: 'IT Solutions' },
                                        { icon: Smartphone, label: 'Mobile' },
                                        { icon: Phone, label: 'Fixed Phone' },
                                        { icon: Truck, label: 'Moving' },
                                        { icon: Package, label: 'Distribution' }
                                    ].map((service, idx) => (
                                        <div key={idx} className="bg-white/5 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex items-center space-x-3 transition-all hover:bg-white/10">
                                            <service.icon className="w-4 h-4 text-[#1D6FB5]" />
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black text-white/90 uppercase tracking-tight">{service.label}</span>
                                                <div className="flex items-center space-x-1">
                                                    <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
                                                    <span className="text-[8px] font-bold text-emerald-500 uppercase">Active</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Network Status */}
                                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-10">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center space-x-2">
                                            <Activity className="w-4 h-4 text-[#1D6FB5]" />
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Network Operations</span>
                                        </div>
                                        <div className="px-2 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                                            <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest leading-none">Healthy</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[20px] font-black text-white tracking-tighter">Live Support</span>
                                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Awaiting Your Call</span>
                                        </div>
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="w-8 h-8 rounded-full border-2 border-gray-900 bg-gray-800 flex items-center justify-center">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto">
                                    <button
                                        onClick={onOpenModal}
                                        className="w-full bg-[#1D6FB5] hover:bg-[#1F6BC0] text-white py-5 rounded-[24px] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center transition-all active:scale-95 shadow-xl shadow-blue-500/20 group"
                                    >
                                        Initiate Your Transition
                                        <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="mt-24 pt-12 border-t border-gray-100 flex flex-wrap justify-center gap-16 opacity-30 grayscale filter">
                    <div className="flex items-center space-x-3 group">
                        <Target className="w-8 h-8 text-amber-500 transition-colors group-hover:grayscale-0" />
                        <span className="text-xl font-black tracking-tighter uppercase">Clean Energy</span>
                    </div>
                    <div className="flex items-center space-x-3 group">
                        <ShieldCheck className="w-8 h-8 text-emerald-500 transition-colors group-hover:grayscale-0" />
                        <span className="text-xl font-black tracking-tighter uppercase">CEC Approved</span>
                    </div>
                    <div className="flex items-center space-x-3 group">
                        <TrendingUp className="w-8 h-8 text-indigo-500 transition-colors group-hover:grayscale-0" />
                        <span className="text-xl font-black tracking-tighter uppercase">Grid Modern</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
