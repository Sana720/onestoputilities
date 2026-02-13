'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-slate-100 pt-12 md:pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="md:col-span-2">
                        <Link href="/">
                            <Image src="/logo.png" alt="Logo" width={140} height={40} className="mb-6 opacity-80" />
                        </Link>
                        <p className="text-slate-500 max-w-sm text-sm font-medium leading-relaxed">
                            SHREEG Expert Wealth Advisory Limited. Registered HQ: Mani Casadona, Block 2E, Action Area IIF, Kolkata 700156.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest mb-6">Connect</h4>
                        <ul className="space-y-4 text-sm font-bold text-slate-400">
                            <li className="hover:text-[#1B8A9F] cursor-pointer">info@shreeg.com</li>
                            <li className="hover:text-[#1B8A9F] cursor-pointer">+91 (Advisory Desk)</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest mb-6">Portal</h4>
                        <Link href="/apply" className="text-sm font-black text-[#1B8A9F] flex items-center gap-2">
                            Open Portfolio <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
                <div className="pt-8 border-t border-slate-100 text-center">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] md:tracking-[0.3em]">
                        © {new Date().getFullYear()} SHREEG Wealth Advisory • CIN: U67190WB2020PLC237611
                    </p>
                </div>
            </div>
        </footer>
    );
}
