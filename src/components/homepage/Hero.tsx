import { useState } from 'react';
import Link from 'next/link';
import { Award, ArrowRight, TrendingUp, Zap, Shield, BarChart3, Clock } from 'lucide-react';

const SOLUTIONS = {
    'Intraday': {
        series: 'Intraday Trading',
        horizon: '1 month',
        risk: 'High',
        returns: 'Weekly up to 1%',
        guaranteed: 'No',
        capital: '₹5,00,000',
        suitableFor: 'Active traders',
        basis: 'Technical & Momentum',
        fees: '₹5,000 or 20% profit',
        icon: <Zap className="w-6 h-6" />,
        color: 'from-orange-500 to-red-500'
    },
    'SIP': {
        series: 'Short-Term SIP',
        horizon: '3 months',
        risk: 'Moderate',
        returns: 'Quarterly up to 6%',
        guaranteed: 'No',
        capital: '₹25,00,000',
        suitableFor: 'Short-term planners',
        basis: 'Systematic diversification',
        fees: '1% or 20% profit',
        icon: <BarChart3 className="w-6 h-6" />,
        color: 'from-blue-500 to-indigo-500'
    },
    'Long-Term': {
        series: 'Long-Term Holding',
        horizon: '1 year',
        risk: 'Low',
        returns: 'Yearly up to 20%',
        guaranteed: 'No',
        capital: '₹1,00,00,000',
        suitableFor: 'Long term investors',
        basis: 'Fundamental + Rebalancing',
        fees: '2% or 20% profit',
        icon: <Clock className="w-6 h-6" />,
        color: 'from-purple-500 to-pink-500'
    },
    'Shreeg': {
        series: 'Unlisted Shares',
        horizon: '3 year',
        risk: 'Very Low (secured structure)',
        returns: 'Yearly up to 18%',
        guaranteed: 'Fixed Dividend',
        capital: '₹25,00,000',
        suitableFor: 'HNI / NRI investors',
        basis: 'Equity-style fixed growth',
        fees: '₹25,000',
        icon: <Shield className="w-6 h-6" />,
        color: 'from-[#1B8A9F] to-[#4ADE80]'
    }
};

export default function Hero() {
    const [activeTab, setActiveTab] = useState<keyof typeof SOLUTIONS>('Shreeg');
    const data = SOLUTIONS[activeTab];

    return (
        <section className="relative pt-6 pb-24 lg:pt-8 lg:pb-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-8 items-center">
                <div className="lg:col-span-7 space-y-8">
                    <div className="inline-flex items-center gap-2 bg-white border border-slate-200 px-4 py-1.5 rounded-full">
                        <Award className="w-4 h-4 text-[#1B8A9F]" />
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Trusted by 2,400+ Active Stakeholders</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.05] lg:leading-[0.95]">
                        Smart Capital.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1B8A9F] via-[#2D9FB4] to-[#4ADE80]">
                            Predictable Yield.
                        </span>
                    </h1>

                    <p className="text-lg text-slate-500 max-w-xl leading-relaxed font-medium">
                        SHREEG Preference Bond Equity offers the rare combination of <span className="text-slate-900 font-bold underline decoration-[#4ADE80]">Fixed Yearly Dividends</span> and long-term capital appreciation.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <Link href="/apply" className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#1B8A9F] text-white px-8 py-4 rounded-2xl font-bold hover:shadow-2xl hover:shadow-[#1B8A9F]/30 transition-all">
                            Apply for Allocation <ArrowRight className="w-5 h-5" />
                        </Link>

                        {/* INVESTOR AVATARS WITH LIVE FEED */}
                        <div className="flex items-center gap-3 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-100">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <img
                                        key={i}
                                        src={`https://i.pravatar.cc/100?img=${i + 10}`}
                                        className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm"
                                        alt="Investor"
                                    />
                                ))}
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-900 flex items-center justify-center text-[10px] text-white font-bold">
                                    +2k
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-black text-slate-900">Live Joinings</span>
                                <span className="text-[10px] font-bold text-green-600 uppercase">Verified Profiles</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FLOATING DATA CARD */}
                <div className="lg:col-span-5 relative group mt-16 lg:mt-12">
                    <div className="absolute -inset-4 bg-gradient-to-tr from-[#1B8A9F]/20 to-[#4ADE80]/20 blur-3xl rounded-[40px] opacity-50 group-hover:opacity-100 transition-opacity"></div>

                    <div className="relative bg-white border border-slate-100 p-6 rounded-[35px] shadow-2xl overflow-hidden transition-all duration-500">
                        {/* Tab Selector */}
                        <div className="flex justify-center p-1 bg-slate-50 rounded-2xl mb-6 gap-1 overflow-x-auto no-scrollbar">
                            {Object.keys(SOLUTIONS).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab as any)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab
                                        ? 'bg-white text-[#1B8A9F] shadow-sm'
                                        : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="flex justify-between items-center mb-6">
                            <div className="animate-in fade-in slide-in-from-left duration-500">
                                <h3 className="text-xs font-black text-[#1B8A9F] uppercase tracking-widest">Investment Solution</h3>
                                <p className="text-2xl font-black text-slate-900">{data.series}</p>
                            </div>
                            <div className={`p-3 rounded-2xl bg-teal-50 text-[#1B8A9F] transition-colors duration-500`}>
                                {data.icon}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-bottom duration-700">
                            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Horizon</p>
                                <p className="text-sm font-black text-slate-900">{data.horizon}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Guaranteed</p>
                                <p className={`text-sm font-black ${data.guaranteed === 'No' ? 'text-slate-400' : 'text-[#1B8A9F]'}`}>{data.guaranteed}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Risk Level</p>
                                <p className={`text-sm font-black ${data.risk.startsWith('High') ? 'text-red-500' : data.risk.startsWith('Moderate') ? 'text-orange-500' : 'text-green-500'}`}>{data.risk}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Suitable For</p>
                                <p className="text-sm font-black text-slate-900 leading-tight">{data.suitableFor}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Return Nature</p>
                                <p className="text-sm font-black text-slate-900">{data.returns}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Capital Req.</p>
                                <p className="text-sm font-black text-slate-900">{data.capital}</p>
                            </div>
                        </div>

                        <div className={`mt-4 p-4 bg-gradient-to-r ${data.color} rounded-2xl text-white transition-all duration-500`}>
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-xs font-bold opacity-60">Management Fees</span>
                                <span className="text-xs font-bold bg-white/20 backdrop-blur-md px-2 py-0.5 rounded">
                                    {activeTab === 'Shreeg' ? 'Tier-1' : 'Professional'}
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
