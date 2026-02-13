'use client';

import Navbar from '@/components/homepage/Navbar';
import Hero from '@/components/homepage/Hero';
import Features from '@/components/homepage/Features';
import ComparisonMatrix from '@/components/homepage/ComparisonMatrix';
import Footer from '@/components/homepage/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white selection:bg-[#1B8A9F] selection:text-white overflow-x-hidden">

      {/* BACKGROUND OVERLAYS - Data & Texture */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.12]">
        <div className="absolute inset-0 w-full h-full -top-40 scale-110">
          <img src="/images/graphs/candlestick_hero.png" alt="Market Overlay" className="w-full h-full object-contain opacity-50" />
        </div>
      </div>

      <Navbar />

      <main className="relative z-10">
        <Hero />
        <ComparisonMatrix />
        <Features />

      </main>

      <Footer />
    </div>
  );
}