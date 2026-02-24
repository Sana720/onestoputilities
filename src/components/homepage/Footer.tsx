'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
    Mail,
    Phone,
    MapPin,
    MessageCircle,
    Linkedin,
    Twitter,
    Instagram,
    Facebook,
    ArrowRight,
    Lock,
    Globe,
    Shield
} from 'lucide-react';

export default function Footer() {
    return (
        <footer id="footer" className="bg-white border-t border-gray-100 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 py-24 relative z-10">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-24">

                    {/* Brand Column */}
                    <div className="lg:col-span-4 space-y-10">
                        <div className="space-y-6">
                            <Image src="/onestop-logo.png" alt="One Stop Utilities" width={220} height={60} className="h-12 w-auto" />
                            <p className="text-gray-400 text-sm font-medium leading-relaxed italic max-w-xs">
                                "The definitive Australian partnership for premium utility infrastructure and managed technology solutions."
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-3 px-5 py-2.5 bg-blue-50/50 rounded-2xl border border-blue-100/30 w-fit">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#1D6FB5] animate-pulse"></div>
                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#1D6FB5]">CEC Approved</span>
                            </div>
                            <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-blue-50 rounded-full border border-blue-100/50 w-fit">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#1D6FB5] animate-pulse"></span>
                                <span className="text-[8px] font-black text-[#1D6FB5] uppercase tracking-widest">System Active</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="lg:col-span-2 space-y-8">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-900 border-b border-gray-50 pb-4">Principal</h4>
                        <ul className="space-y-4">
                            {['About Us', 'Utility Strategy', 'Case Portfolio', 'Broker Network', 'Support Hub'].map((item) => (
                                <li key={item}>
                                    <span className="text-sm font-bold text-gray-400 uppercase tracking-tight">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Reach Us */}
                    <div className="lg:col-span-2 space-y-8">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-900 border-b border-gray-50 pb-4">Connectivity</h4>
                        <div className="flex flex-col space-y-6">
                            {[
                                { Icon: MapPin, text: 'Melbourne, VIC', color: 'text-amber-500' },
                                { Icon: Phone, text: '1300 178 678', color: 'text-[#1D6FB5]' },
                                { Icon: Globe, text: 'Australia Wide', color: 'text-emerald-500' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center space-x-3 group cursor-default">
                                    <item.Icon className={`w-4 h-4 ${item.color} group-hover:scale-110 transition-transform`} />
                                    <span className="text-xs font-black text-gray-900 uppercase tracking-tight">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Interaction */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-gray-50 rounded-[40px] p-8 border border-gray-100 relative group overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#1D6FB5]/5 rounded-full blur-2xl transition-all group-hover:scale-150"></div>

                            <h4 className="text-xl font-black text-gray-900 uppercase tracking-tighter mb-4 relative z-10">Utility Advisory</h4>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 relative z-10">Direct Engineering Support</p>

                            <div className="space-y-3 relative z-10">
                                <button className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-200 hover:border-[#1D6FB5] group/btn transition-all">
                                    <div className="flex items-center space-x-3">
                                        <Mail className="w-5 h-5 text-cyan-500 group-hover/btn:text-[#1D6FB5]" />
                                        <span className="text-[11px] font-black uppercase tracking-widest text-gray-900">Email Analysis</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover/btn:translate-x-1 group-hover/btn:text-[#1D6FB5] transition-all" />
                                </button>
                                <button className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-200 hover:border-emerald-500 group/btn transition-all">
                                    <div className="flex items-center space-x-3">
                                        <MessageCircle className="w-5 h-5 text-emerald-500 group-hover/btn:text-emerald-500" />
                                        <span className="text-[11px] font-black uppercase tracking-widest text-gray-900">Direct Message</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover/btn:translate-x-1 group-hover/btn:text-emerald-500 transition-all" />
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-gray-50 flex flex-col lg:flex-row justify-between items-center gap-12">
                    <div className="flex items-center space-x-4">
                        {[
                            { Icon: Linkedin },
                            { Icon: Twitter },
                            { Icon: Instagram },
                            { Icon: Facebook }
                        ].map((item, i) => (
                            <div key={i} className={`p-3 bg-gray-50 rounded-xl text-gray-400`}>
                                <item.Icon className="w-4 h-4" />
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">
                        <span className="cursor-default">Privacy Policy</span>
                        <span className="cursor-default">Terms of Service</span>
                        <span className="cursor-default">ASIC/CEC Compliance</span>
                        <span>© 2024 One Stop Utilities</span>
                    </div>

                    <div className="flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
                        <Lock className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">End-to-End Encryption</span>
                    </div>
                </div>

            </div>
        </footer>
    );
}
