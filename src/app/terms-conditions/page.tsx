'use client';

import Navbar from '@/components/homepage/Navbar';
import Footer from '@/components/homepage/Footer';
import { Scale, AlertCircle, CheckCircle2, FileText, Ban, Trash2, Info } from 'lucide-react';

export default function TermsConditions() {
    return (
        <main className="min-h-screen bg-[#FDFDFF] selection:bg-[#1B8A9F] selection:text-white overflow-x-hidden">
            <Navbar />

            {/* --- HERO SECTION --- */}
            <section className="relative pt-48 pb-32 bg-[#020617] text-white overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/about/hero.png"
                        alt="Legal & Regulatory Framework"
                        className="w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/80 via-transparent to-[#020617]"></div>
                    <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#020617] to-transparent z-[1]"></div>
                    <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-teal-500/20 rounded-full blur-[120px] animate-pulse"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center space-x-3 px-6 py-2.5 bg-white/5 backdrop-blur-3xl border border-white/10 text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-8">
                        <Scale className="w-4 h-4 text-[#1B8A9F]" />
                        <span>Regulatory Framework</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
                        Terms & <span className="text-[#1B8A9F]">Conditions</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium">
                        Comprehensive overview of our operational processes, user agreements, and risk disclosures.
                    </p>
                </div>
            </section>

            {/* --- CONTENT SECTION --- */}
            <section className="py-24 relative">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="space-y-16">

                        {/* Process Overview */}
                        <div className="bg-white p-10 md:p-16 rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/50">
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-10 flex items-center gap-4">
                                <FileText className="w-8 h-8 text-[#1B8A9F]" />
                                Overview & Process
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {[
                                    'Exclusively offers an Algo platform for managing intraday/holding trades in individual accounts.',
                                    'Provides management strategies across platforms like Arihant, Zerodha, Upstox, etc.',
                                    'Primary collaboration with Arihant Capital Markets Limited (Exchange Licensed Broker).',
                                    'Users pay subscription charges (monthly/yearly) for trade management services.',
                                    'Demat accounts can be opened with Arihant or through associates; non-mandatory exclusive participation.',
                                    'TraderG Advisors facilitate registration and system provision via online terminals.'
                                ].map((step, i) => (
                                    <div key={i} className="flex gap-4 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                        <CheckCircle2 className="w-5 h-5 text-[#1B8A9F] shrink-0 mt-1" />
                                        <p className="text-sm font-bold text-gray-700 leading-relaxed">{step}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Risk & Disclosure */}
                        <div className="space-y-10">
                            <div className="flex items-center space-x-4">
                                <AlertCircle className="w-8 h-8 text-red-500" />
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Risk Disclosure</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-8 bg-white border border-red-100 rounded-[40px] border-l-8">
                                    <h4 className="font-black uppercase text-[10px] tracking-widest text-red-500 mb-4">Capital Risk</h4>
                                    <p className="text-gray-600 font-semibold text-sm leading-relaxed">
                                        Clients must understand the associated risks and rewards of stock market strategies. TraderG is not liable for market losses.
                                    </p>
                                </div>
                                <div className="p-8 bg-white border border-gray-100 rounded-[40px] border-l-8 border-l-[#1B8A9F]">
                                    <h4 className="font-black uppercase text-[10px] tracking-widest text-[#1B8A9F] mb-4">Non-Consultancy</h4>
                                    <p className="text-gray-600 font-semibold text-sm leading-relaxed">
                                        We do not provide trading tips or financial advice. Our role is strictly limited to providing a technical algo-platform.
                                    </p>
                                </div>
                                <div className="p-8 bg-white border border-gray-100 rounded-[40px] border-l-8 border-l-gray-900">
                                    <h4 className="font-black uppercase text-[10px] tracking-widest text-gray-900 mb-4">Withdrawal</h4>
                                    <p className="text-gray-600 font-semibold text-sm leading-relaxed">
                                        Capital withdrawals are subject to the specific terms and settlement guidelines provided by the broker (e.g., Arihant).
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Terms & Regulations */}
                        <div className="bg-[#020617] text-white p-12 md:p-20 rounded-[60px] relative overflow-hidden group">
                            <h2 className="text-4xl font-black tracking-tight text-white mb-12">Core Terms of Service</h2>
                            <div className="space-y-6">
                                {[
                                    { title: 'KYC Protocol', desc: 'Successful completion of KYC is mandatory for all users and advisors.' },
                                    { title: 'Account Conduct', desc: 'Disobedience of agreement conditions results in immediate permanent suspension.' },
                                    { title: 'Non-Refundable', desc: 'Service charges and registration fees are non-refundable under any circumstances.' },
                                    { title: 'IP Rights', desc: 'The TraderG name and logo cannot be used without prior written management approval.' },
                                    { title: 'Borrowing Ban', desc: 'Advisors/Users are strictly prohibited from borrowing funds from clients.' }
                                ].map((term, i) => (
                                    <div key={i} className="flex items-start gap-6 group/item hover:bg-white/5 p-6 rounded-3xl transition-colors border border-transparent hover:border-white/10">
                                        <div className="w-8 h-8 rounded-lg bg-[#1B8A9F] flex items-center justify-center font-black text-xs">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-white mb-2">{term.title}</h4>
                                            <p className="text-gray-400 font-medium text-sm leading-relaxed">{term.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Termination */}
                        <div className="bg-red-50 p-10 rounded-[40px] border border-red-100 flex flex-col md:flex-row items-center gap-10">
                            <div className="w-20 h-20 bg-red-100 rounded-[28px] flex items-center justify-center shrink-0">
                                <Ban className="w-10 h-10 text-red-500" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 mb-2">Service Suspension</h3>
                                <p className="text-gray-600 font-semibold leading-relaxed">
                                    Violation of property terms, unauthorized use of brand assets, or fraudulent behavior will trigger an immediate cessation of all services without refund. We maintain a zero-tolerance policy for account misconduct.
                                </p>
                            </div>
                        </div>

                        {/* Electronic Signature */}
                        <div className="text-center pt-8 border-t border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Acknowledgment</p>
                            <p className="text-sm font-bold text-gray-500 max-w-2xl mx-auto">
                                By using this platform, you electronically acknowledge that you have read, understood, and agreed to abide by the terms and conditions outlined above.
                            </p>
                            <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-black text-[#1B8A9F] uppercase tracking-widest">
                                <Info className="w-3 h-3" />
                                Updated: February 18, 2026
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
