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
      <section className="relative pt-20 pb-24 lg:pt-32 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">

            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center gap-2 bg-white border border-slate-200 px-4 py-1.5 rounded-full">
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
                  <div className="p-4 bg-white rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Minimum</p>
                    <p className="text-xl font-black text-slate-900">₹1,00,000</p>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-slate-100">
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


      {/* Institutional Infrastructure - Minimalist Professional Design */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">

          {/* Section Header: Focused & Clean */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="h-[1px] w-10 bg-[#1B8A9F]"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1B8A9F]">Security Framework</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.95]">
                Institutional protocols. <br />
                <span className="text-slate-300">Absolute transparency.</span>
              </h2>
            </div>
            <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-sm pb-2">
              We bridge the gap between complex capital structures and effortless investor experience.
            </p>
          </div>

          {/* Primary Feature: The Capital Stack */}
          <div className="grid lg:grid-cols-12 border-t border-slate-100 group">
            <div className="lg:col-span-6 py-16 pr-12 lg:border-r border-slate-100">
              <div className="space-y-8 animate-fade-in-up">
                <div className="inline-flex p-3 bg-white border border-slate-100 rounded-xl text-[#1B8A9F] group-hover:bg-[#1B8A9F] group-hover:text-white transition-all duration-500">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-tight group-hover:translate-x-1 transition-transform">Priority Capital Seniority</h3>
                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                  ShreeG Preference Bonds are structured for **principal preservation**. Legally positioned above ordinary equity, your capital holds a superior claim on assets, ensuring you are first in the hierarchy of recovery.
                </p>
                <div className="flex gap-10 pt-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-[#1B8A9F] uppercase tracking-widest">Hierarchy</p>
                    <p className="text-sm font-bold text-slate-900">Tier-1 Seniority</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-[#1B8A9F] uppercase tracking-widest">Structure</p>
                    <p className="text-sm font-bold text-slate-900">Asset-Backed</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-6 py-16 lg:pl-20 flex items-center justify-center">
              <div className="w-full relative group/visual">
                <div className="absolute -inset-10 bg-[#1B8A9F]/10 blur-[100px] rounded-full group-hover/visual:bg-[#1B8A9F]/20 transition-all duration-1000"></div>
                <div className="relative rounded-[40px] overflow-hidden shadow-2xl border border-slate-100">
                  <img
                    src="/images/fintech_visual.png"
                    alt="Fintech Institutional Data Visualization"
                    className="w-full scale-105 group-hover/visual:scale-100 transition-transform duration-1000 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Protocol V.5.0</p>
                      <p className="text-lg font-bold text-white tracking-tight">Encrypted Ledger Integrity</p>
                    </div>
                    <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                      <Activity className="w-5 h-5 text-[#4ADE80]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Features: Grid Layout */}
          <div className="grid lg:grid-cols-2 border-t border-slate-100">

            {/* CDSL Item */}
            <div className="py-16 pr-12 border-b lg:border-r border-slate-100 group transition-colors">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Zap className="w-8 h-8 text-[#1B8A9F]" />
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> CDSL Authenticated
                  </span>
                </div>
                <h4 className="text-2xl font-black text-slate-900 tracking-tight">Sovereign Digital Custody</h4>
                <p className="text-slate-500 font-medium leading-relaxed">
                  Eliminate administrative friction. Shares are credited directly to your **Demat account**, providing an immutable digital record visible in any Tier-1 brokerage interface.
                </p>
              </div>
            </div>

            {/* Legacy Item */}
            <div className="py-16 lg:pl-12 border-b border-slate-100 group transition-colors">
              <div className="space-y-6">
                <Globe className="w-8 h-8 text-[#1B8A9F]" />
                <h4 className="text-2xl font-black text-slate-900 tracking-tight">Succession & Legacy</h4>
                <p className="text-slate-500 font-medium leading-relaxed">
                  Integrated professional nominee registration ensures your wealth transition is seamless. We protect your legacy for the next generation through automated legal compliance.
                </p>
                <div className="pt-4 flex items-center gap-4">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Protocol Compliant</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Trust Bar */}
          <div className="mt-16 flex flex-wrap justify-center md:justify-between gap-8 opacity-40">
            {['SEBI Compliant', 'Quarterly Audits', 'T+2 Settlement', 'Zero Administrative Fees'].map((text, i) => (
              <span key={i} className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">{text}</span>
            ))}
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