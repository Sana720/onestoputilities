'use client';

import React from 'react';
import {
    Link2,
    ShieldCheck,
    ChevronRight,
    ArrowRight,
    MonitorSmartphone,
    Database,
    FileText,
    CheckCircle2,
    Lock
} from 'lucide-react';
import Image from 'next/image';

const brokers = [
    { name: 'Groww', logo: '/brokers/groww.png' },
    { name: 'Zerodha', logo: '/brokers/zerodha.svg' },
    { name: 'Upstox', logo: '/brokers/upstox.svg' },
    { name: 'Angel One', logo: '/brokers/angelone.png' },
    { name: 'HDFC Securities', logo: '/brokers/hdfc.png' },
    { name: 'ICICI Direct', logo: '/brokers/icici.png' },
    { name: 'Kotak Securities', logo: '/brokers/kotak.svg' },
    { name: 'Motilal Oswal', logo: '/brokers/motilal.svg' },
    { name: 'Sharekhan', logo: '/brokers/sharekhan.svg' },
    { name: 'Shoonya', logo: '/brokers/shoonya.svg' },
];

const steps = [
    {
        number: '01',
        title: 'Demat-Linked Integration',
        subtitle: 'Secure Bond Issuance',
        icon: Database,
        desc: 'Shree G Wealth Preference Bonds are issued and held directly in your Demat account through authorized depository mechanisms. No third-party holding, no pooled accounts—your investment remains fully mapped to your Demat.',
        color: 'teal'
    },
    {
        number: '02',
        title: 'Structured Monitoring',
        subtitle: 'Capital Deployment',
        icon: MonitorSmartphone,
        desc: 'Once the bonds are credited, Shree G Wealth manages capital deployment through a research-driven and risk-controlled framework. Your holdings remain visible at all times and can be monitored just like any listed security.',
        color: 'blue'
    },
    {
        number: '03',
        title: 'Transparent Reporting',
        subtitle: 'Systematic Crediting',
        icon: FileText,
        desc: 'Monthly dividends are systematically credited as per the declared structure. All transactions, holding values, and payouts remain auditable, traceable, and transparent, ensuring complete investor confidence.',
        color: 'purple'
    }
];

export default function BrokerSection() {
    return (
        <section id="brokers" className="py-32 relative bg-white overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-50/30 rounded-full blur-[120px] -mr-64 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-50/30 rounded-full blur-[120px] -ml-64 -mb-32"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Header Section */}
                <div className="text-center mb-24">
                    <div className="inline-flex items-center space-x-2 bg-[#1B8A9F]/5 px-4 py-2 rounded-full border border-[#1B8A9F]/10 mb-6">
                        <Lock className="w-3.5 h-3.5 text-[#1B8A9F]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1B8A9F]">Regulatory Compliance</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight uppercase">
                        Universal Demat Connectivity
                    </h2>
                    <p className="text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed italic">
                        No new account required. Shree G Wealth integrates seamlessly with India's most trusted brokerage platforms via your existing Demat infrastructure.
                    </p>
                </div>

                {/* BROKER LOGO GRID - HIGH END UI */}
                <div className="mb-40">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {brokers.map((broker, idx) => (
                            <div key={idx} className="group relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#1B8A9F] to-[#4ADE80] rounded-[32px] opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                                <div className="h-32 bg-gray-50/50 backdrop-blur-sm border border-gray-100 rounded-[32px] p-8 flex items-center justify-center transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:bg-white group-hover:border-[#1B8A9F]/20 overflow-hidden">
                                    {/* Logo Placeholder / Image */}
                                    <div className="relative w-full h-full flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-700">
                                        <Image
                                            src={broker.logo}
                                            alt={broker.name}
                                            width={120}
                                            height={40}
                                            className="object-contain max-h-12 scale-90 group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>

                                    {/* Corner Badge */}
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 transition-all">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-12 text-center">
                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.5em]">Authorized CDSL & NSDL Participant Network</p>
                    </div>
                </div>

                {/* INTEGRATION JOURNEY - VERTICAL S-CURVE ON MOBILE, STACKED ON DESKTOP */}
                <div className="space-y-12">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {steps.map((step, idx) => (
                            <div key={idx} className="flex-1 group">
                                <div className="h-full bg-white rounded-[48px] p-12 border border-gray-100 shadow-xl shadow-gray-200/20 transition-all duration-700 hover:shadow-[0_40px_80px_rgba(27,138,159,0.12)] hover:-translate-y-4 hover:border-[#1B8A9F]/30 relative overflow-hidden flex flex-col">
                                    {/* Step Number Background */}
                                    <div className="absolute -top-10 -right-10 text-[180px] font-black text-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10 select-none">
                                        {step.number}
                                    </div>

                                    <div className={`w-20 h-20 rounded-3xl mb-10 flex items-center justify-center shadow-lg transform transition-transform group-hover:rotate-12 duration-500 ${step.color === 'teal' ? 'bg-teal-50 text-teal-600 shadow-teal-100' :
                                        step.color === 'blue' ? 'bg-blue-50 text-blue-600 shadow-blue-100' :
                                            'bg-purple-50 text-purple-600 shadow-purple-100'
                                        }`}>
                                        <step.icon className="w-10 h-10" />
                                    </div>

                                    <div className="flex items-center space-x-3 mb-4">
                                        <span className={`h-1.5 w-6 rounded-full ${step.color === 'teal' ? 'bg-teal-400' :
                                            step.color === 'blue' ? 'bg-blue-400' :
                                                'bg-purple-400'
                                            }`}></span>
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Step {step.number}</span>
                                    </div>

                                    <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-6 leading-tight group-hover:text-[#1B8A9F] transition-colors">{step.title}</h3>

                                    <p className="text-gray-500 font-medium leading-relaxed mb-10">
                                        {step.desc}
                                    </p>

                                    <div className="mt-auto pt-8 border-t border-gray-50 flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-[#1B8A9F]">Ready to Link</span>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#1B8A9F] group-hover:text-white transition-all duration-500">
                                            <ArrowRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* TRUST FOOTER CARD */}
                <div className="mt-32 relative overflow-hidden rounded-[60px] bg-gray-900 p-12 md:p-20 group">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1B8A9F]/10 rounded-full blur-[120px] -mr-64 -mt-32"></div>
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-6 leading-tight">
                                Direct-to-Demat <br />
                                <span className="text-[#3DD2E5]">Ownership Model</span>
                            </h3>
                            <p className="text-gray-400 text-lg leading-relaxed mb-8">
                                We've eliminated the middleman. Your investment is held by you, in your name, within the same institutional framework that holds your stocks and mutual funds.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <div className="px-6 py-3 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center space-x-3">
                                    <ShieldCheck className="w-5 h-5 text-[#4ADE80]" />
                                    <span className="text-xs font-bold text-white uppercase tracking-widest">10 years + holding company</span>
                                </div>
                                <div className="px-6 py-3 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center space-x-3">
                                    <CheckCircle2 className="w-5 h-5 text-[#4ADE80]" />
                                    <span className="text-xs font-bold text-white uppercase tracking-widest">SEBI Regulated Participant</span>
                                </div>
                            </div>
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-0 bg-teal-500/20 rounded-full blur-[60px] group-hover:blur-[80px] transition-all"></div>
                            <div className="bg-white/5 backdrop-blur-md rounded-[40px] p-10 border border-white/10 relative z-10 flex flex-col items-center text-center">
                                <div className="w-20 h-20 bg-teal-500/20 rounded-full flex items-center justify-center mb-6">
                                    <MonitorSmartphone className="w-10 h-10 text-[#3DD2E5]" />
                                </div>
                                <h4 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Real-time Visibility</h4>
                                <p className="text-gray-400 text-sm font-medium">Monitor your Shree G Wealth portfolio alongside your equity holdings in any trading app.</p>
                                <div className="mt-8 flex items-center space-x-4">
                                    <div className="h-0.5 w-12 bg-teal-500/30"></div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-teal-400">Total Transparency</span>
                                    <div className="h-0.5 w-12 bg-teal-500/30"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

