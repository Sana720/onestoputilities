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
                            <div className="flex items-start space-x-4 group cursor-pointer">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-[#1B8A9F] group-hover:text-white transition-all">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div onClick={() => typeof window !== 'undefined' && (window.location.href = 'tel:+917596044046')}>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Direct Contact</p>
                                    <p className="text-sm font-black text-gray-900">+91 75960 44046</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4 group cursor-pointer">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-[#25D366] group-hover:text-white transition-all">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.884 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                    </svg>
                                </div>
                                <div onClick={() => typeof window !== 'undefined' && window.open('https://wa.me/917596044046', '_blank')}>
                                    <p className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-1">WhatsApp Chat</p>
                                    <p className="text-sm font-black text-gray-900">Reach out now</p>
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
                        {[
                            { Icon: Linkedin, href: "#" },
                            { Icon: Twitter, href: "#" },
                            { Icon: Instagram, href: "#" },
                            {
                                Icon: () => (
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.884 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                    </svg>
                                ),
                                href: "https://wa.me/917596044046",
                                isExternal: true
                            }
                        ].map((item, i) => (
                            <Link key={i} href={item.href} target={item.isExternal ? "_blank" : undefined} rel={item.isExternal ? "noopener noreferrer" : undefined} className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:bg-[#1B8A9F] hover:text-white transition-all transform hover:-translate-y-1">
                                <item.Icon />
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

