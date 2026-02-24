'use client';

import Navbar from '@/components/homepage/Navbar';
import Hero from '@/components/homepage/Hero';
import Features from '@/components/homepage/Features';
import ComparisonMatrix from '@/components/homepage/ComparisonMatrix';
import Footer from '@/components/homepage/Footer';

import ResearchPortfolio from '@/components/homepage/ResearchPortfolio';
import BrokerSection from '@/components/homepage/BrokerSection';
import Testimonials from '@/components/homepage/Testimonials';
import QuoteModal from '@/components/homepage/QuoteModal';

import { useState } from 'react';

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen bg-white selection:bg-[#1B8A9F] selection:text-white overflow-x-hidden">

      {/* BACKGROUND OVERLAYS - Utility Texture */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]">
        <div className="absolute inset-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')] opacity-50"></div>
      </div>

      <Navbar onGetStarted={handleOpenModal} />

      <main className="relative z-10">
        <Hero onGetStarted={handleOpenModal} />
        <Features />
        <ComparisonMatrix onOpenModal={handleOpenModal} />
        <ResearchPortfolio onOpenModal={handleOpenModal} />
        <BrokerSection onGetStarted={handleOpenModal} />
        <Testimonials />

      </main>

      <Footer />

      <QuoteModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}