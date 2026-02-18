'use client';

import Navbar from '@/components/homepage/Navbar';
import Footer from '@/components/homepage/Footer';
import { Shield, Eye, Lock, Database, Cookie, Info } from 'lucide-react';

export default function PrivacyPolicy() {
    return (
        <main className="min-h-screen bg-[#FDFDFF] selection:bg-[#1B8A9F] selection:text-white overflow-x-hidden">
            <Navbar />

            {/* --- HERO SECTION --- */}
            <section className="relative pt-48 pb-32 bg-[#020617] text-white overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/about/hero.png"
                        alt="Privacy & Data Security"
                        className="w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/80 via-transparent to-[#020617]"></div>
                    <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#020617] to-transparent z-[1]"></div>
                    <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-[#1B8A9F]/20 rounded-full blur-[120px] animate-pulse"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center space-x-3 px-6 py-2.5 bg-white/5 backdrop-blur-3xl border border-white/10 text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-8">
                        <Lock className="w-4 h-4 text-[#1B8A9F]" />
                        <span>Security Protocol</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
                        Privacy <span className="text-[#1B8A9F]">Policy</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium">
                        Our commitment to protecting your digital footprint and financial data integrity.
                    </p>
                </div>
            </section>

            {/* --- CONTENT SECTION --- */}
            <section className="py-24 relative">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="space-y-16">

                        {/* Overview */}
                        <div className="bg-white p-10 md:p-16 rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/50">
                            <div className="flex items-center space-x-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center">
                                    <Shield className="w-6 h-6 text-[#1B8A9F]" />
                                </div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Executive Summary</h2>
                            </div>
                            <div className="prose prose-lg text-gray-600 font-medium leading-relaxed">
                                <p>
                                    TraderG Wealth provides an algorithmic study platform and API interfaces for various broking platforms. We are not involved in live trading executions or direct stock market trades. Your privacy is paramount; we do not sell or rent personal data to third parties without explicit consent.
                                </p>
                                <p className="mt-4">
                                    By accessing this site, you agree to the terms outlined in this policy. If you do not agree, please discontinue use. This policy applies strictly to TraderG Wealth domains and not to third-party organizations we may link to.
                                </p>
                            </div>
                        </div>

                        {/* Privacy Guarantee */}
                        <div className="space-y-8">
                            <div className="flex items-center space-x-4">
                                <Eye className="w-8 h-8 text-[#1B8A9F]" />
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Privacy Guarantee</h2>
                            </div>
                            <div className="bg-gray-50/50 p-10 rounded-[40px] border border-gray-100 italic font-semibold text-gray-500 leading-relaxed text-lg">
                                "We guarantee that your personal information will never be sold or rented for marketing purposes. Only authorized personnel required for operational duties have access to your data, subject to strict disciplinary protocols."
                            </div>
                        </div>

                        {/* Information We Collect */}
                        <div className="space-y-10">
                            <div className="flex items-center space-x-4">
                                <Database className="w-8 h-8 text-[#1B8A9F]" />
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Information Acquisition</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="p-8 bg-white border border-gray-100 rounded-[32px] shadow-sm">
                                    <h4 className="text-xl font-bold text-gray-900 mb-4">Personal Data</h4>
                                    <p className="text-gray-500 text-sm leading-relaxed">
                                        Collected voluntarily to process orders and provide tailored services, including KYC documents such as PAN and Aadhaar.
                                    </p>
                                </div>
                                <div className="p-8 bg-white border border-gray-100 rounded-[32px] shadow-sm">
                                    <h4 className="text-xl font-bold text-gray-900 mb-4">Technical Logs</h4>
                                    <p className="text-gray-500 text-sm leading-relaxed">
                                        IP addresses are used for server diagnostics and demographic analysis to ensure platform stability and security.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Cookie Policy */}
                        <div className="bg-[#020617] text-white p-12 md:p-20 rounded-[60px] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#1B8A9F]/20 rounded-full blur-3xl group-hover:bg-[#1B8A9F]/40 transition-colors"></div>
                            <div className="relative z-10">
                                <div className="flex items-center space-x-4 mb-10">
                                    <Cookie className="w-10 h-10 text-[#1B8A9F]" />
                                    <h2 className="text-4xl font-black tracking-tight text-white">Cookie Policy</h2>
                                </div>
                                <div className="space-y-8 text-gray-400 font-medium">
                                    <p>
                                        We use "cookies" to analyze web flow and promote trust. Cookies are small files stored on your device that help us provide features like persistent login and interest-based information.
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                                            <span className="block text-white font-black uppercase text-xs tracking-widest mb-2">Session Cookies</span>
                                            <p className="text-sm">Temporary files deleted automatically when you close your browser.</p>
                                        </div>
                                        <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                                            <span className="block text-white font-black uppercase text-xs tracking-widest mb-2">Persistent Cookies</span>
                                            <p className="text-sm">Stored until they expire or are manually deleted to help us recognize you across visits.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Effective Date */}
                        <div className="text-center pt-8 border-t border-gray-100">
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
                                <Info className="w-3 h-3" />
                                Effective Date: February 18, 2026
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
