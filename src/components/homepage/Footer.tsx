'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Shield, Globe, Lock, Mail, Phone, MapPin, Instagram, Facebook, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[#FDFDFF] border-t border-gray-100 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-teal-50/30 rounded-full blur-[100px] -mr-32 -mb-32"></div>

            <div className="max-w-7xl mx-auto px-6 pt-32 pb-16 relative z-10">

                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">

                    {/* Brand Meta */}
                    <div className="md:col-span-12 lg:col-span-5">
                        <Link href="/" className="inline-block mb-10 transition-opacity hover:opacity-80">
                            <Image src="/logo.png" alt="SHREEG Logo" width={160} height={45} className="h-10 w-auto" />
                        </Link>
                        <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-sm mb-12">
                            Structural institutional-grade wealth management engineered for the global Indian investor.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center space-x-2 px-4 py-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                <Shield className="w-4 h-4 text-[#1B8A9F]" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">10 years + holding company</span>
                            </div>
                            <div className="flex items-center space-x-2 px-4 py-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                <Lock className="w-4 h-4 text-[#1B8A9F]" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">SEBI Compliant</span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div className="md:col-span-4 lg:col-span-2">
                        <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.3em] mb-10">Intelligence</h4>
                        <ul className="space-y-6">
                            {['Analysis Pillars', 'Yield Compass', 'Broker Network', 'Security Protocol'].map((item, i) => (
                                <li key={i}>
                                    <Link href="#" className="text-sm font-bold text-gray-400 hover:text-[#1B8A9F] transition-colors">{item}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="md:col-span-4 lg:col-span-2">
                        <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.3em] mb-10">Integration</h4>
                        <ul className="space-y-6">
                            {['Client Portal', 'Admin Console', 'Demat Linkage', 'Application Flow'].map((item, i) => (
                                <li key={i}>
                                    <Link href="#" className="text-sm font-bold text-gray-400 hover:text-[#1B8A9F] transition-colors">{item}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="md:col-span-4 lg:col-span-3">
                        <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.3em] mb-10">Contact HQ</h4>
                        <div className="space-y-8">
                            <div className="flex items-start space-x-4 group cursor-pointer">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-[#1B8A9F] group-hover:text-white transition-all">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Electronic Mail</p>
                                    <p className="text-sm font-black text-gray-900">info@shreeg.group</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4 group cursor-pointer">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-[#1B8A9F] group-hover:text-white transition-all">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Corporate Office</p>
                                    <p className="text-sm font-black text-gray-900 leading-tight">Mani Casadona, Block 2E, <br />Area IIF, Kolkata 700156</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-16 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center space-x-2">
                        <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.5em]">System Version 5.0.21</span>
                        <span className="h-1 w-1 rounded-full bg-green-500 animate-pulse"></span>
                    </div>

                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                        © {new Date().getFullYear()} SHREEG Wealth Advisory • CIN: U74140CT2016PLC002054
                    </p>

                    <div className="flex items-center space-x-6">
                        {[Linkedin, Twitter, Instagram].map((Icon, i) => (
                            <Link key={i} href="#" className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:bg-[#1B8A9F] hover:text-white transition-all transform hover:-translate-y-1">
                                <Icon className="w-4 h-4" />
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="mt-16 text-center">
                    <p className="text-[8px] font-bold text-gray-300 uppercase leading-relaxed max-w-4xl mx-auto tracking-widest">
                        SHREEG Wealth Advisory is a structural capital provider. CIN: U74140CT2016PLC002054 • NSE: AP0881009893 • BSE: AP0103130179283 • CDSL-ISIN: INE07AG01011. Investment in unlisted equity and corporate bonds involves risk. Past performance is not indicative of future results. All capital deployment is subject to market and duration sensitivity. Please consult your financial advisor before allocation.
                    </p>
                </div>
            </div>
        </footer>
    );
}

