'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { isMarketOpen } from '@/lib/market';
import {
  TrendingUp, Shield, Users, BarChart3, ArrowRight,
  CheckCircle2, Award, LineChart, PieChart, Activity, Lock, Globe, Zap,
  Smartphone, Landmark
} from 'lucide-react';

export default function HomePage() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Initial check
    setIsOpen(isMarketOpen());

    // Update every minute
    const interval = setInterval(() => {
      setIsOpen(isMarketOpen());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white selection:bg-[#1B8A9F] selection:text-white overflow-x-hidden">

      {/* BACKGROUND OVERLAYS - Data & Texture */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.12]">
        <div className="absolute -top-32 right-0 w-full h-full">
          <img src="/images/graphs/hero_growth.png" alt="Hero Graph" className="w-full h-full object-cover opacity-30" />
        </div>
        <div className="absolute inset-0 w-full h-full -top-40 scale-110">
          <img src="/images/graphs/candlestick_hero.png" alt="Market Overlay" className="w-full h-full object-contain opacity-50" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-6">
              <Image src="/logo.png" alt="SHREEG Logo" width={140} height={40} className="h-9 w-auto" />
              <div className="hidden lg:flex items-center gap-4 border-l border-gray-200 pl-6">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-tighter font-black text-[#1B8A9F]">Live Portfolio</span>
                  <span className={`text-xs font-bold flex items-center gap-1 ${isOpen ? 'text-green-500' : 'text-red-500'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isOpen ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    Market {isOpen ? 'Open' : 'Closed'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/login" className="px-5 py-2.5 text-sm font-bold text-gray-500 hover:text-slate-900 transition-all">
                Login
              </Link>
              <Link href="/apply" className="bg-slate-900 text-white px-7 py-2.5 rounded-full text-sm font-bold hover:bg-[#1B8A9F] transition-all shadow-xl shadow-slate-200">
                Join Network
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">

            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-1.5 rounded-full">
                <Award className="w-4 h-4 text-[#1B8A9F]" />
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Trusted by 2,400+ Active Stakeholders</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[0.95]">
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
            <div className="lg:col-span-5 relative group">
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#1B8A9F]/20 to-[#4ADE80]/20 blur-3xl rounded-[40px] opacity-50 group-hover:opacity-100 transition-opacity"></div>

              <div className="relative bg-white border border-slate-100 p-8 rounded-[35px] shadow-2xl overflow-hidden">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-xs font-black text-[#1B8A9F] uppercase tracking-widest">Growth Forecast</h3>
                    <p className="text-3xl font-black text-slate-900">Equity Series V</p>
                  </div>
                  <div className="p-3 bg-teal-50 text-[#1B8A9F] rounded-2xl">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Minimum</p>
                    <p className="text-xl font-black text-slate-900">₹1,00,000</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Face Value</p>
                    <p className="text-xl font-black text-slate-900">₹100</p>
                  </div>
                </div>

                <div className="mt-6 p-5 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl text-white">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold opacity-60">Payout Frequency</span>
                    <span className="text-xs font-bold bg-green-500 px-2 py-0.5 rounded text-slate-900">Fixed</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-black">Annual Dividends</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid - Fintech Terminal Style */}
      {/* Customer-Centric Feature Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-sm font-black text-[#1B8A9F] uppercase tracking-[0.3em] mb-4">Why SHREEG?</h2>
            <p className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Designed for those who value <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1B8A9F] to-emerald-500">time as much as money.</span>
            </p>
          </div>

          <div className="space-y-32">

            {/* Feature 1: The "Peace of Mind" Block */}
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
              <div className="flex-1 relative">
                <div className="absolute -inset-4 bg-teal-100/50 rounded-[40px] -rotate-2"></div>
                <img
                  src="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?auto=format&fit=crop&q=80&w=1000"
                  alt="Secure Investment"
                  className="relative rounded-[32px] shadow-2xl z-10 grayscale hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl z-20 border border-slate-100 hidden md:block">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-400 uppercase">Status</p>
                      <p className="text-lg font-bold text-slate-900">Principal Secured</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 space-y-6">
                <h3 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">Your capital stays <br />right where it belongs.</h3>
                <p className="text-lg text-slate-500 leading-relaxed font-medium">
                  We prioritize the safety of your principal. By using **Preference Bond Equity**, your investment is legally structured to be repaid before ordinary shares, giving you a safety net that traditional stocks don't offer.
                </p>
                <ul className="space-y-4 pt-4">
                  {['Priority payout rights', 'Asset-backed security', 'Fixed dividend schedule'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-slate-900 font-bold">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Feature 2: The "Digital Simplicity" Block (Reversed) */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-24">
              <div className="flex-1 relative">
                <div className="absolute -inset-4 bg-blue-100/50 rounded-[40px] rotate-2"></div>
                <img
                  src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1000"
                  alt="Digital Portfolio"
                  className="relative rounded-[32px] shadow-2xl z-10"
                />
                <div className="absolute -top-6 -left-6 bg-slate-900 p-6 rounded-2xl shadow-xl z-20 hidden md:block">
                  <p className="text-[#1B8A9F] font-black text-2xl">100%</p>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Digital Transfer</p>
                </div>
              </div>
              <div className="flex-1 space-y-6">
                <h3 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">Visible in your <br />favorite trading apps.</h3>
                <p className="text-lg text-slate-500 leading-relaxed font-medium">
                  No hidden registers or shady paperwork. Your SHREEG holdings are credited directly to your **CDSL Demat Account**. Track your wealth alongside your other stocks in Zerodha, Groww, or Upstox.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg shadow-sm border border-slate-100 flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-[#1B8A9F]" />
                    </div>
                    <p className="text-sm font-bold text-slate-900">Real-time Tracking</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg shadow-sm border border-slate-100 flex items-center justify-center">
                      <Landmark className="w-5 h-5 text-[#1B8A9F]" />
                    </div>
                    <p className="text-sm font-bold text-slate-900">Bank-Grade Trust</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-100 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <Image src="/logo.png" alt="Logo" width={140} height={40} className="mb-6 opacity-80" />
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
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
              © {new Date().getFullYear()} SHREEG Wealth Advisory • CIN: U67190WB2020PLC237611
            </p>
          </div>
        </div>
      </footer>
    </div >
  );
}