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
    Network,
    PieChart,
    TrendingUp,
    Scale
} from 'lucide-react';

const coreFeatures = [
    {
        title: 'Sector Diversification',
        desc: 'Multi-sector allocation strategy designed to mitigate systemic risk and capture growth across resilient economic verticals.',
        icon: PieChart,
        tags: ['Risk Mitigation', 'Cross-Sector'],
        color: 'text-teal-600',
        bg: 'bg-teal-50'
    },
    {
        title: 'Research & Strategies based Investment',
        desc: 'Institutional-grade methodology combining quantitative data with qualitative insights to build alpha-generating portfolios.',
        icon: TrendingUp,
        tags: ['Algo-driven', 'Alpha Selection'],
        color: 'text-blue-600',
        bg: 'bg-blue-50'
    },
    {
        title: 'Entry & Exit powers',
        desc: 'Precision market participation with structural protocols for optimal capital deployment and liquidity management.',
        icon: Zap,
        tags: ['Timed Execution', 'Liquidity Focus'],
        color: 'text-orange-600',
        bg: 'bg-orange-50'
    },
    {
        title: 'Quantity & Capital balancing',
        desc: 'Advanced position sizing and dynamic capital allocation to ensure portfolio resilience and long-term sustainability.',
        icon: Scale,
        tags: ['Capital Preservation', 'Dynamic Sizing'],
        color: 'text-purple-600',
        bg: 'bg-purple-50'
    }
];

const hierarchyFeatures = [
    {
        title: 'Secured Ledger',
        desc: 'Real-time audit trailing on all capital movement within the SHREEG ecosystem.',
        icon: Shield
    },
    {
        title: 'Preference Priority',
        desc: 'Senior-most ranking in the capital stack, prioritized for repayment alongside debt.',
        icon: Network
    },
    {
        title: 'Escrow Protection',
        desc: 'Funds managed through regulated escrow accounts ensuring strict usage compliance.',
        icon: Lock
    },
    {
        title: 'Independent Custody',
        desc: 'Asset monitoring and custodianship provided by regulated third-party institutions.',
        icon: Fingerprint
    }
];

export default function Features() {
    const [activeSlide, setActiveSlide] = React.useState(0);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setActiveSlide((prev) => (prev + 1) % hierarchyFeatures.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="py-32 bg-white relative">
            <div className="max-w-7xl mx-auto px-6">

                {/* Section Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-24 gap-12">
                    <div className="max-w-2xl">
                        <div className="flex items-center space-x-3 mb-6">
                            <Cpu className="w-4 h-4 text-[#1B8A9F]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1B8A9F]">SHREEG FUND ARCHITECTURE</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter leading-[0.9] uppercase">
                            Four key points <br />
                            with <br />
                            <span className="text-[#1B8A9F]">SHREEG Fund</span>
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
                            Unlike traditional equity which carries the highest risk, our <span className="text-[#1B8A9F] font-black">Preference Bonds</span> are structured at the top of the hierarchy. If a liquidity event occurs, you are prioritized for repayment alongside senior debt holders.
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
                                <div className="absolute inset-4 rounded-[48px] bg-white border border-gray-50 shadow-inner flex flex-col items-center justify-center p-12 text-center transition-all duration-700">
                                    <div className="relative w-full h-full flex flex-col items-center justify-center">
                                        {hierarchyFeatures.map((feat, idx) => (
                                            <div
                                                key={idx}
                                                className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 transform ${idx === activeSlide
                                                    ? 'opacity-100 translate-y-0'
                                                    : 'opacity-0 translate-y-8 pointer-events-none'
                                                    }`}
                                            >
                                                <div className="w-24 h-24 bg-teal-50 rounded-[32px] flex items-center justify-center mb-8 shadow-sm">
                                                    <feat.icon className="w-12 h-12 text-[#1B8A9F]" />
                                                </div>
                                                <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-4">{feat.title}</h4>
                                                <p className="text-sm font-bold text-gray-400 max-w-[280px] leading-relaxed italic">{feat.desc}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Slide Indicators */}
                                    <div className="absolute bottom-12 flex gap-2">
                                        {hierarchyFeatures.map((_, idx) => (
                                            <div
                                                key={idx}
                                                className={`h-1.5 rounded-full transition-all duration-500 ${idx === activeSlide ? 'w-8 bg-[#1B8A9F]' : 'w-2 bg-gray-200'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid Features */}
                <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8">
                    {coreFeatures.map((f, i) => (
                        <div key={i} className="group h-full">
                            <div className="h-full bg-white rounded-[40px] p-8 border border-gray-50 shadow-xl shadow-gray-100/30 hover:shadow-2xl hover:shadow-teal-100/20 hover:-translate-y-2 transition-all duration-500 flex flex-col">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110 ${f.bg} ${f.color}`}>
                                    <f.icon className="w-7 h-7" />
                                </div>
                                <h4 className="text-xl font-black text-gray-900 uppercase tracking-tighter leading-tight mb-4">{f.title}</h4>
                                <p className="text-sm text-gray-400 font-medium leading-relaxed mb-8 flex-grow">
                                    {f.desc}
                                </p>
                                <div className="pt-6 border-t border-gray-50 flex flex-wrap gap-2">
                                    {f.tags.map((tag, ti) => (
                                        <span key={ti} className="px-2.5 py-1 bg-gray-50 text-[8px] font-black uppercase tracking-widest text-gray-400 rounded-lg">
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
                    {['Fully Auditable', 'SEBI Participant', '10 years + holding company', 'T+2 Standard', 'NPS Registered'].map((text, i) => (
                        <span key={i} className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-900 whitespace-nowrap">{text}</span>
                    ))}
                </div>

            </div>
        </section>
    );
}

