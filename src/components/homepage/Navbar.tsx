'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { isMarketOpen } from '@/lib/market';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
    const [isMarket, setIsMarket] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        setIsMarket(isMarketOpen());
        const interval = setInterval(() => {
            setIsMarket(isMarketOpen());
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center space-x-6">
                        <Link href="/">
                            <Image src="/logo.png" alt="SHREEG Logo" width={140} height={40} className="h-8 md:h-9 w-auto" />
                        </Link>
                        <div className="hidden lg:flex items-center gap-4 border-l border-gray-200 pl-6">
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-tighter font-black text-[#1B8A9F]">Live Portfolio</span>
                                <span className={`text-xs font-bold flex items-center gap-1 ${isMarket ? 'text-green-500' : 'text-red-500'}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isMarket ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    Market {isMarket ? 'Open' : 'Closed'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link href="/login" className="px-5 py-2.5 text-sm font-bold text-gray-500 hover:text-slate-900 transition-all">
                            Login
                        </Link>
                        <Link href="/apply" className="bg-slate-900 text-white px-7 py-2.5 rounded-full text-sm font-bold hover:bg-[#1B8A9F] transition-all shadow-xl shadow-slate-200">
                            Join Network
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden flex items-center gap-4">
                        <div className="flex flex-col items-end lg:hidden">
                            <span className={`text-[10px] font-bold flex items-center gap-1 ${isMarket ? 'text-green-500' : 'text-red-500'}`}>
                                <span className={`w-1 h-1 rounded-full ${isMarket ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                {isMarket ? 'Live' : 'Closed'}
                            </span>
                        </div>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-slate-600 hover:text-[#1B8A9F] transition-colors"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-b border-gray-100 absolute w-full left-0 top-20 shadow-2xl animate-in slide-in-from-top duration-300">
                    <div className="px-4 py-8 space-y-6">
                        <div className="flex flex-col gap-4">
                            <Link
                                href="/login"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-lg font-bold text-slate-900 px-4 py-2 hover:bg-slate-50 rounded-xl transition-all"
                            >
                                Login to Portal
                            </Link>
                            <Link
                                href="/apply"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="bg-[#1B8A9F] text-white text-center px-6 py-4 rounded-2xl font-bold shadow-lg shadow-[#1B8A9F]/20 active:scale-95 transition-all"
                            >
                                Join Network
                            </Link>
                        </div>
                        <div className="pt-6 border-t border-slate-100 flex justify-between items-center px-4">
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Market Status</span>
                            <span className={`text-xs font-bold flex items-center gap-2 ${isMarket ? 'text-green-500' : 'text-red-500'}`}>
                                <span className={`w-2 h-2 rounded-full ${isMarket ? 'bg-green-500' : 'bg-red-500'} ${isMarket ? 'animate-pulse' : ''}`}></span>
                                Market is {isMarket ? 'OPEN' : 'CLOSED'}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
