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
    Battery,
    Wind,
    Droplets,
    PieChart,
    TrendingUp,
    Scale,
    Settings,
    MonitorSmartphone,
    Check
} from 'lucide-react';

const serviceFeatures = [
    {
        title: 'Tier-1 Solar PV',
        desc: 'Industrial-grade solar photovoltaic systems with 25-year performance warranties and peak efficiency output.',
        icon: Zap,
        tags: ['Efficiency', 'Sustainability'],
        color: 'text-amber-600',
        bg: 'bg-amber-50'
    },
    {
        title: 'Smart Storage',
        desc: 'Advanced lithium storage solutions for seamless power backup and maximum solar energy self-consumption.',
        icon: Battery,
        tags: ['Backup', 'Independence'],
        color: 'text-emerald-600',
        bg: 'bg-emerald-50'
    },
    {
        title: 'Climate Control',
        desc: 'Next-generation HVAC and Air Conditioning systems designed for the Australian climate with smart-zone optimization.',
        icon: Wind,
        tags: ['Comfort', 'Optimization'],
        color: 'text-cyan-600',
        bg: 'bg-cyan-50'
    },
    {
        title: 'Managed IT Infra',
        desc: 'Enterprise-grade networking and IT infrastructure services for businesses and high-end residential estates.',
        icon: Cpu,
        tags: ['Connectivity', 'Security'],
        color: 'text-indigo-600',
        bg: 'bg-indigo-50'
    }
];

const assuranceFeatures = [
    {
        title: 'CEC Approved',
        desc: 'Fully certified Clean Energy Council Retailer ensuring all installations meet national standards.',
        icon: Shield,
        iconColor: 'text-[#1D6FB5]'
    },
    {
        title: 'Custom Engineering',
        desc: 'Structural calculations and engineering designs tailored for individual property requirements.',
        icon: Settings,
        iconColor: 'text-amber-500'
    },
    {
        title: 'Rapid Deployment',
        desc: 'Streamlined supply chain and installation logistics ensuring minimal disruption to your daily operations.',
        icon: Zap,
        iconColor: 'text-orange-500'
    },
    {
        title: 'Smart Monitoring',
        desc: 'Real-time performance tracking and preventative maintenance on all installed utility systems.',
        icon: MonitorSmartphone,
        iconColor: 'text-indigo-500'
    }
];

export default function Features() {
    const [activeSlide, setActiveSlide] = React.useState(0);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setActiveSlide((prev) => (prev + 1) % assuranceFeatures.length);
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
                            <Cpu className="w-4 h-4 text-[#1D6FB5]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1D6FB5]">ONE STOP UTILITIES INFRASTRUCTURE</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter leading-[0.9] uppercase">
                            Premium Service <br />
                            with <br />
                            <span className="text-[#1D6FB5]">One Stop Utilities</span>
                        </h2>
                    </div>
                    <p className="max-w-xs text-gray-500 font-medium text-lg leading-relaxed italic">
                        "We've engineered a framework where utility efficiency meets the reliability of enterprise technology."
                    </p>
                </div>

                {/* Primary Visual Feature */}
                <div className="grid lg:grid-cols-12 gap-16 items-center mb-32 group">
                    <div className="lg:col-span-6 space-y-10">
                        <div className="inline-flex items-center space-x-3 bg-gray-50 px-5 py-2.5 rounded-full border border-gray-100">
                            <Cpu className="w-4 h-4 text-[#1D6FB5]" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Core Engine V.5.0</span>
                        </div>
                        <h3 className="text-4xl font-black text-gray-900 leading-[1.1] uppercase tracking-tighter">
                            Tier-1 Quality <br />
                            <span className="text-[#1D6FB5]">Hardware Standards</span>
                        </h3>
                        <p className="text-xl text-gray-500 leading-relaxed font-medium">
                            Unlike budget competitors, One Stop Utilities uses <span className="text-[#1D6FB5] font-black">Industrial Grade Hardware</span>. Every solar panel, inverter, and IT node is selected for maximum performance in the Australian climate.
                        </p>
                        <div className="flex gap-12">
                            <div>
                                <p className="text-[10px] font-black text-[#1D6FB5] uppercase tracking-widest mb-1">Protection</p>
                                <p className="text-lg font-black text-gray-900">Principal Guard</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-[#1D6FB5] uppercase tracking-widest mb-1">Ranking</p>
                                <p className="text-lg font-black text-gray-900">Senior Preferred</p>
                            </div>
                        </div>
                        <button className="flex items-center space-x-3 text-[11px] font-black uppercase tracking-[0.3em] text-gray-900 group-hover:text-[#1D6FB5] transition-colors">
                            <span>View Tech Specifications</span>
                            <CheckCircle2 className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="lg:col-span-6">
                        <div className="relative">
                            <div className="absolute -inset-10 bg-[#1D6FB5]/5 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-all duration-1000"></div>
                            <div className="relative bg-gray-50 rounded-[60px] p-4 border border-gray-100 shadow-2xl overflow-hidden aspect-square flex items-center justify-center">
                                <div className="absolute inset-4 rounded-[48px] bg-white border border-gray-50 shadow-inner flex flex-col items-center justify-center p-12 text-center transition-all duration-700">
                                    <div className="relative w-full h-full flex flex-col items-center justify-center">
                                        {assuranceFeatures.map((feat, idx) => (
                                            <div
                                                key={idx}
                                                className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 transform ${idx === activeSlide
                                                    ? 'opacity-100 translate-y-0'
                                                    : 'opacity-0 translate-y-8 pointer-events-none'
                                                    }`}
                                            >
                                                <div className="w-24 h-24 bg-blue-50 rounded-[32px] flex items-center justify-center mb-8 shadow-sm transition-all group-hover:bg-white group-hover:shadow-lg">
                                                    <feat.icon className={`w-12 h-12 ${feat.iconColor || 'text-[#1D6FB5]'}`} />
                                                </div>
                                                <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-4">{feat.title}</h4>
                                                <p className="text-sm font-bold text-gray-400 max-w-[280px] leading-relaxed italic">{feat.desc}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Slide Indicators */}
                                    <div className="absolute bottom-12 flex gap-2">
                                        {assuranceFeatures.map((_, idx) => (
                                            <div
                                                key={idx}
                                                className={`h-1.5 rounded-full transition-all duration-500 ${idx === activeSlide ? 'w-8 bg-[#1D6FB5]' : 'w-2 bg-gray-200'
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
                    {serviceFeatures.map((f, i) => (
                        <div key={i} className="group h-full">
                            <div className="h-full bg-white rounded-[40px] p-8 border border-gray-50 shadow-xl shadow-gray-100/30 hover:shadow-2xl hover:shadow-blue-100/20 hover:-translate-y-2 transition-all duration-500 flex flex-col">
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

                {/* Bottom Trust Icons - Forced Single Line without scrollbar */}
                <div className="mt-40 pt-20 border-t border-gray-50">
                    <style dangerouslySetInnerHTML={{
                        __html: `
                        .hide-scrollbar::-webkit-scrollbar { display: none; }
                        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                    `}} />
                    <div className="overflow-x-auto hide-scrollbar pb-4">
                        <div className="flex flex-nowrap justify-between items-center gap-12 min-w-max opacity-30">
                            {['CEC Approved Retailer', 'ASIC Registered', 'Industrial Tier-1 Hardware', 'Clean Energy Council', 'T-Standard Logistics'].map((text, i) => (
                                <span key={i} className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-900 whitespace-nowrap">{text}</span>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
