'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Shield, Mail, ChevronRight, Linkedin, Twitter, Instagram, Facebook, ArrowUpRight, Fingerprint, MapPin, MessageCircle } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="relative bg-[#F8FBFC] pt-32 pb-16 overflow-hidden">
            {/* Silky Atmosphere Mesh */}
            <div className="absolute inset-0 z-0 opacity-30">
                <Image
                    src="/footer_mesh.png"
                    alt="Mesh Background"
                    fill
                    className="object-cover pointer-events-none"
                    priority
                />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* The Sovereign Floating Card */}
                <div className="bg-white/70 backdrop-blur-[50px] rounded-[64px] border border-white shadow-[0_48px_100px_-24px_rgba(0,0,0,0.04)] p-12 lg:p-24 mb-16 relative overflow-hidden group/sovereign">
                    {/* Inner Radiance Edge (Top) */}
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-8 items-start">

                        {/* Domain 1: Brand Essence */}
                        <div className="lg:pr-12">
                            <Link href="/" className="inline-block mb-10 transition-transform hover:scale-[1.02]">
                                <Image src="/logo.png" alt="TraderG Wealth Logo" width={170} height={48} className="h-10 w-auto" />
                            </Link>
                            <p className="text-gray-600 font-medium text-lg leading-relaxed mb-10">
                                Institutional intelligence forged with <br className="hidden xl:block" /> systematic precision.
                            </p>
                            <div className="flex items-center space-x-3 px-5 py-2.5 bg-teal-50/50 rounded-2xl border border-teal-100/30 w-fit">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#1B8A9F] animate-pulse"></div>
                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#1B8A9F]">Vault Secured</span>
                            </div>
                        </div>

                        {/* Domain 2: Navigational Matrix */}
                        <div className="lg:px-4">
                            <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.4em] mb-10 opacity-30">Intelligence</h4>
                            <ul className="space-y-6">
                                {['Analysis Pillars', 'Yield Compass', 'Broker Network', 'Security Protocol'].map((item) => (
                                    <li key={item}>
                                        <Link href="#" className="flex items-center text-sm font-bold text-gray-400 hover:text-gray-900 transition-all group">
                                            {item}
                                            <ArrowUpRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-[#1B8A9F]" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Domain 3: Ecosystem Nodes */}
                        <div className="lg:px-4">
                            <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.4em] mb-10 opacity-30">Ecosystem</h4>
                            <ul className="space-y-6">
                                {['Client Portal', 'Admin Console', 'Demat Linkage', 'API Interface'].map((item) => (
                                    <li key={item}>
                                        <Link href="#" className="flex items-center text-sm font-bold text-gray-400 hover:text-gray-900 transition-all group">
                                            {item}
                                            <ArrowUpRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-[#1B8A9F]" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Domain 4: Partner Infrastructure (Contact) */}
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.4em] mb-10 opacity-30">Infrastructure</h4>

                            <div className="p-6 bg-white rounded-3xl border border-gray-100/50 shadow-sm transition-all hover:shadow-xl hover:shadow-gray-200/20 group">
                                <div className="flex items-start space-x-4">
                                    <MapPin className="w-5 h-5 text-[#1B8A9F] mt-1 shrink-0 group-hover:scale-110 transition-transform" />
                                    <div>
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Corporate HQ</p>
                                        <p className="text-[13px] font-bold text-gray-900 leading-snug">
                                            11WS2 Mani Casadona, <br />
                                            Action Area 2, Rajarhat Newtown, <br />
                                            Kolkata, WB 700156
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Link href="mailto:info@tradergwealth.com" className="p-5 bg-white rounded-2xl border border-gray-100/50 shadow-sm transition-all hover:bg-[#1B8A9F] hover:text-white flex flex-col items-center justify-center space-y-2 group/btn text-center">
                                    <Mail className="w-5 h-5 text-[#1B8A9F] group-hover/btn:text-white" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Mail</span>
                                </Link>
                                <div
                                    onClick={() => typeof window !== 'undefined' && window.open('https://wa.me/917596044046', '_blank')}
                                    className="p-5 bg-white rounded-2xl border border-gray-100/50 shadow-sm transition-all hover:bg-[#25D366] hover:text-white flex flex-col items-center justify-center space-y-2 group/btn cursor-pointer text-center"
                                >
                                    <MessageCircle className="w-5 h-5 text-[#25D366] group-hover/btn:text-white" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">WhatsApp</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Meta Tier */}
                    <div className="mt-24 pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-10">
                        <div className="flex items-center space-x-4">
                            <Fingerprint className="w-4 h-4 text-gray-300" />
                            <span className="text-[9px] font-mono font-bold tracking-widest text-gray-400">CORP_V5.0.21_HYDRA</span>
                            <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-green-50 rounded-full border border-green-100/50">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="text-[8px] font-black text-green-700 uppercase tracking-widest">Live System</span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-8">
                            {[Linkedin, Twitter, Instagram, Facebook].map((Icon, i) => (
                                <Link key={i} href="#" className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-white hover:bg-[#1B8A9F] hover:shadow-md transition-all">
                                    <Icon className="w-4 h-4" />
                                </Link>
                            ))}
                        </div>

                        <div className="flex flex-wrap justify-center gap-x-6 sm:gap-x-10 gap-y-4">
                            <Link href="/privacy-policy" className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] sm:tracking-[0.4em] hover:text-[#1B8A9F] transition-colors">Privacy</Link>
                            <Link href="/terms-conditions" className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] sm:tracking-[0.4em] hover:text-[#1B8A9F] transition-colors">Legal</Link>
                            <Link href="/terms-conditions#risk" className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] sm:tracking-[0.4em] hover:text-[#1B8A9F] transition-colors">Risk</Link>
                            <Link href="/privacy-policy#cookies" className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] sm:tracking-[0.4em] hover:text-[#1B8A9F] transition-colors">Cookies</Link>
                        </div>
                    </div>
                </div>

                {/* Statutory Matrix Section */}
                <div className="px-10 space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 text-center md:text-left border-b border-gray-200 pb-12">
                        <div className="space-y-3">
                            <p className="text-[10px] font-black text-gray-900 uppercase tracking-[0.3em]">Corporate Headquarters</p>
                            <p className="text-[11px] font-bold text-gray-500 leading-relaxed uppercase">
                                11WS2 Mani Casadona, Action Area 2, <br />
                                Rajarhat Newtown, Kolkata - 700156 WB
                            </p>
                        </div>
                        {/* <div className="space-y-3">
                            <p className="text-[10px] font-black text-gray-900 uppercase tracking-[0.3em]">Registered Office</p>
                            <p className="text-[11px] font-bold text-gray-500 leading-relaxed uppercase">
                                Shop No. 353, 3rd Floor, Progressive Point, <br />
                                Lalpur Dhamtari Road, Raipur - 492001 CT
                            </p>
                        </div> */}
                        <div className="flex flex-wrap items-center justify-center md:justify-end gap-6 h-fit pt-2">
                            {[
                                { label: 'CIN', val: 'U74140CT2016PLC002054' },
                                { label: 'NSE AP', val: 'AP0881009893' },
                                { label: 'BSE AP', val: 'AP0103130179283' }
                            ].map(id => (
                                <div key={id.label} className="text-right">
                                    <span className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">{id.label}</span>
                                    <span className="block text-[10px] font-mono font-bold text-gray-900 border-b-2 border-[#1B8A9F]/20 pb-0.5">{id.val}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="text-[10px] font-black text-gray-400 uppercase leading-relaxed max-w-6xl mx-auto tracking-[0.2em] text-center opacity-60">
                        Disclaimer - Trading & Investing in stock market are subjected to market risks, read all scheme related documents carefully. It involves high substantial risk & might not be suitable for everyone. The content provided in this website is solely for educational purposes. The owner has no responsibility of any decision taken in trading by the viewer.
                    </p>
                </div>
            </div>
        </footer>
    );
}
