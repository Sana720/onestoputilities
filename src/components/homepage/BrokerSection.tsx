import { useState } from 'react';
import {
    MapPin,
    Settings,
    Zap,
    ShieldCheck,
    ArrowRight,
    Search,
    PenTool,
    CheckCircle2,
    Users,
    Building2,
    Cpu,
    Target
} from 'lucide-react';

const installationSteps = [
    {
        number: '01',
        title: 'Engineered Site Visit',
        subtitle: 'Custom Assessment',
        icon: MapPin,
        desc: 'Our senior engineers conduct a comprehensive site survey, auditing your current infrastructure and energy profiling to design the optimal utility configuration.',
        color: 'text-amber-600',
        bg: 'bg-amber-50',
        lightColor: 'bg-amber-400'
    },
    {
        number: '02',
        title: 'Custom Engineering',
        subtitle: 'Structural Design',
        icon: Settings,
        desc: 'Every system is custom-engineered using tier-1 hardware. We handle all structural certifications and engineering approvals, ensuring your system meets the highest safety standards.',
        color: 'text-[#1D6FB5]',
        bg: 'bg-blue-50',
        lightColor: 'bg-blue-400'
    },
    {
        number: '03',
        title: 'Precision Activation',
        subtitle: 'CEC Accreditation',
        icon: Zap,
        desc: 'Our accredited installation teams deploy your utility infrastructure with surgical precision, maintain strict quality control and real-time monitoring integration.',
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
        lightColor: 'bg-emerald-400'
    }
];

interface BrokerSectionProps {
    onGetStarted?: () => void;
}

export default function BrokerSection({ onGetStarted }: BrokerSectionProps) {
    const [stats, setStats] = useState({
        brokers: 120,
        clients: 5400,
        retention: 98
    });
    return (
        <section id="onboarding" className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">

                {/* Section Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-24 gap-12">
                    <div className="max-w-2xl">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="h-px w-12 bg-[#1D6FB5]"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1D6FB5]">Deployment Logic</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-gray-900 leading-[0.95] tracking-tighter uppercase">
                            Your <br />
                            Installation <br />
                            <span className="text-[#1D6FB5]">Journey.</span>
                        </h2>
                    </div>
                    <div className="max-w-md">
                        <p className="text-gray-500 font-medium leading-relaxed italic border-l-4 border-blue-50 pl-6 py-2">
                            "A streamlined, zero-friction transition to sustainable utility infrastructure, managed entirely by our senior engineering division."
                        </p>
                    </div>
                </div>

                {/* Steps Grid */}
                <div className="grid lg:grid-cols-3 gap-8 relative mb-32">
                    {/* Connection lines (Desktop) */}
                    <div className="hidden lg:block absolute top-[20%] left-[20%] right-[20%] h-px bg-gray-100 -z-10"></div>

                    {installationSteps.map((step, i) => (
                        <div key={i} className="group relative">
                            <div className="bg-white rounded-[48px] p-10 border border-gray-100 shadow-xl shadow-gray-100/30 hover:shadow-2xl hover:shadow-blue-100/20 transition-all duration-700 h-full flex flex-col items-center text-center">
                                {/* Step Number Badge */}
                                <div className="absolute top-8 left-8">
                                    <span className="text-[40px] font-black text-gray-50 opacity-[0.05] leading-none group-hover:opacity-[0.1] transition-opacity">{step.number}</span>
                                </div>

                                <div className={`w-24 h-24 rounded-[32px] ${step.bg} flex items-center justify-center mb-8 relative group-hover:scale-110 transition-transform duration-700`}>
                                    <div className={`absolute inset-0 ${step.bg} rounded-[32px] animate-ping opacity-20 group-hover:opacity-40`}></div>
                                    <step.icon className={`w-10 h-10 ${step.color} relative z-10`} />
                                </div>

                                <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-2 group-hover:text-[#1D6FB5] transition-colors">{step.title}</h4>
                                <p className={`text-[11px] font-black ${step.color} uppercase tracking-[0.2em] mb-6`}>{step.subtitle}</p>
                                <p className="text-sm text-gray-400 font-medium leading-relaxed italic">
                                    "{step.desc}"
                                </p>

                                <div className="mt-8 pt-8 border-t border-gray-50 w-full flex items-center justify-center space-x-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Step</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Partner Integration Horizontal Grid */}
                <div className="relative bg-gray-50 rounded-[60px] p-12 border border-gray-100 overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#1D6FB5]/5 rounded-full blur-3xl -mr-48 -mt-48"></div>

                    <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="flex items-center space-x-3 mb-6">
                                <Cpu className="w-5 h-5 text-[#1D6FB5]" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1D6FB5]">Supply Chain Matrix</span>
                            </div>
                            <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-6 leading-none">
                                Tier-1 High Yield <br />
                                <span className="text-[#1D6FB5]">Technology Partners</span>
                            </h3>
                            <p className="text-gray-500 font-medium leading-relaxed mb-8">
                                One Stop Utilities only deploys hardware from the world's most stable and recognized energy manufacturers. No generic components. Ever.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                {['Jinko Solar', 'LG Energy', 'Daikin', 'Cisco', 'Sungrow', 'Enphase'].map((partner, i) => (
                                    <span key={i} className="px-5 py-2.5 bg-white rounded-2xl text-[10px] font-black text-gray-400 uppercase tracking-widest border border-gray-100 hover:border-[#1D6FB5]/30 hover:text-gray-900 transition-all cursor-default">
                                        {partner}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="relative grid grid-cols-2 gap-4">
                            <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl space-y-4 hover:-translate-y-2 transition-transform shadow-blue-500/5">
                                <Users className="w-10 h-10 text-amber-500" />
                                <h4 className="text-2xl font-black text-gray-900 uppercase leading-none">{stats.clients}+</h4>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Clients</p>
                            </div>
                            <div className="bg-[#1D6FB5] p-8 rounded-[40px] text-white space-y-4 hover:-translate-y-2 transition-transform shadow-2xl shadow-blue-500/30">
                                <Target className="w-10 h-10 text-blue-200" />
                                <h4 className="text-2xl font-black uppercase leading-none">A+ Class</h4>
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">System Rating</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Trust Row */}
                <div className="mt-24 flex flex-col md:flex-row items-center justify-between gap-12 border-t border-gray-50 pt-16">
                    <div className="flex items-center space-x-8 opacity-40 grayscale hover:grayscale-0 transition-all">
                        <span className="text-sm font-black uppercase tracking-[0.5em] text-gray-900">ASIC Registered</span>
                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                        <span className="text-sm font-black uppercase tracking-[0.5em] text-gray-900">CEC Retailer</span>
                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                        <span className="text-sm font-black uppercase tracking-[0.5em] text-gray-900">ISO Certified</span>
                    </div>

                    <div className="flex flex-col items-center">
                        <button
                            onClick={onGetStarted}
                            className="bg-white text-[#1D6FB5] px-12 py-6 rounded-[32px] font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center transition-all hover:bg-gray-50 active:scale-[0.98] shadow-2xl shadow-blue-900/5 group"
                        >
                            Integrate Utilities Now
                            <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>
                </div>

            </div>
        </section>
    );
}
