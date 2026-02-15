'use client';

import React from 'react';
import {
    Shield,
    Activity,
    Zap,
    Globe,
    CheckCircle2,
    Lock,
    Cpu,
    Fingerprint,
    Network
} from 'lucide-react';

const coreFeatures = [
    {
        title: 'Institutional Grade Security',
        desc: 'Every bond issuance is secured by asset-backed structures, providing a primary claim on the capital stack—legally superior to ordinary equity shareholders.',
        icon: Shield,
        tags: ['Asset Backed', 'Tier-1 Priority'],
        color: 'text-teal-600',
        bg: 'bg-teal-50'
    },
    {
        title: 'Sovereign Digital Custody',
        desc: 'Integration with CDSL ensures that all holdings are credited directly to your Demat account, providing a transparent, auditable, and immutable digital record.',
        icon: Fingerprint,
        tags: ['CDSL Verified', 'Zero Custody Risk'],
        color: 'text-blue-600',
        bg: 'bg-blue-50'
    },
    {
        title: 'Automated Wealth Transition',
        desc: 'Advanced nominee registration protocols ensure that your investment legacy is seamlessly transitioned across generations with zero legal friction.',
        icon: Network,
        tags: ['Smart Nomination', 'Legacy Secure'],
        color: 'text-purple-600',
        bg: 'bg-purple-50'
    }
];

export default function Features() {
    return (
        <section className="py-32 bg-white relative">
            <div className="max-w-7xl mx-auto px-6">

                {/* Section Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-24 gap-12">
                    <div className="max-w-2xl">
                        <div className="flex items-center space-x-3 mb-6">
                            <Lock className="w-4 h-4 text-[#1B8A9F]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1B8A9F]">Security Architecture</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter leading-[0.9] uppercase">
                            Institutional <br />
                            Integrity. <br />
                            <span className="text-gray-900">Retail Flow.</span>
                        </h2>
                    </div>
                    <p className="max-w-xs text-gray-500 font-medium text-lg leading-relaxed italic">
                        "We've engineered a framework where institutional safety meets the agility of digital age investing."
                    </p>
                </div>

                {/* Primary Visual Feature */}
                <div className="grid lg:grid-cols-12 gap-16 items-center mb-32 group">
                    <div className="lg:col-span-6 space-y-10">
                        <div className="inline-flex items-center space-x-3 bg-gray-50 px-5 py-2.5 rounded-full border border-gray-100">
                            <Cpu className="w-4 h-4 text-[#1B8A9F]" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Core Engine V.5.0</span>
                        </div>
                        <h3 className="text-4xl font-black text-gray-900 leading-[1.1] uppercase tracking-tighter">
                            Priority Capital <br />
                            <span className="text-[#1B8A9F]">Seniority Hierarchy</span>
                        </h3>
                        <p className="text-xl text-gray-500 leading-relaxed font-medium">
                            Unlike traditional equity which carries the highest risk, our **Preference Bonds** are structured at the top of the hierarchy. If a liquidity event occurs, you are prioritized for repayment alongside senior debt holders.
                        </p>
                        <div className="flex gap-12">
                            <div>
                                <p className="text-[10px] font-black text-[#1B8A9F] uppercase tracking-widest mb-1">Protection</p>
                                <p className="text-lg font-black text-gray-900">Principal Guard</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-[#1B8A9F] uppercase tracking-widest mb-1">Ranking</p>
                                <p className="text-lg font-black text-gray-900">Senior Preferred</p>
                            </div>
                        </div>
                        <button className="flex items-center space-x-3 text-[11px] font-black uppercase tracking-[0.3em] text-gray-900 group-hover:text-[#1B8A9F] transition-colors">
                            <span>View Legal Framework</span>
                            <CheckCircle2 className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="lg:col-span-6">
                        <div className="relative">
                            <div className="absolute -inset-10 bg-teal-500/10 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-all duration-1000"></div>
                            <div className="relative bg-gray-50 rounded-[60px] p-4 border border-gray-100 shadow-2xl overflow-hidden aspect-square flex items-center justify-center">
                                <div className="absolute inset-4 rounded-[48px] bg-white border border-gray-50 shadow-inner flex flex-col items-center justify-center p-12 text-center">
                                    <div className="w-24 h-24 bg-teal-50 rounded-[32px] flex items-center justify-center mb-8 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                                        <Shield className="w-12 h-12 text-[#1B8A9F]" />
                                    </div>
                                    <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-4">Secured Ledger</h4>
                                    <p className="text-sm font-medium text-gray-400 max-w-[240px]">Real-time audit trailing on all capital movement within the SHREEG ecosystem.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid Features */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {coreFeatures.map((f, i) => (
                        <div key={i} className="group h-full">
                            <div className="h-full bg-white rounded-[48px] p-10 border border-gray-50 shadow-xl shadow-gray-100/50 hover:shadow-2xl hover:shadow-teal-100/30 hover:-translate-y-4 transition-all duration-700 flex flex-col">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-10 transition-transform duration-500 group-hover:scale-110 ${f.bg} ${f.color}`}>
                                    <f.icon className="w-8 h-8" />
                                </div>
                                <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tighter leading-tight mb-6">{f.title}</h4>
                                <p className="text-gray-500 font-medium leading-relaxed mb-10 flex-grow">
                                    {f.desc}
                                </p>
                                <div className="pt-8 border-t border-gray-50 flex flex-wrap gap-2">
                                    {f.tags.map((tag, ti) => (
                                        <span key={ti} className="px-3 py-1 bg-gray-50 text-[9px] font-black uppercase tracking-widest text-gray-400 rounded-lg">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Trust Icons */}
                <div className="mt-40 pt-20 border-t border-gray-50 flex flex-wrap justify-center lg:justify-between items-center gap-12 opacity-30">
                    {['Fully Auditable', 'SEBI Participant', 'ISO 27001 Certified', 'T+2 Standard', 'NPS Registered'].map((text, i) => (
                        <span key={i} className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-900 whitespace-nowrap">{text}</span>
                    ))}
                </div>

            </div>
        </section>
    );
}

