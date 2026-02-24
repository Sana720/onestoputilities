'use client';

import React from 'react';
import { Star, CheckCircle2, Quote } from 'lucide-react';

const testimonials = [
    {
        name: "Sarah Jenkins",
        location: "Melbourne, VIC",
        date: "2 days ago",
        content: "The transition was seamless. Having one point of contact for my solar, internet, and electricity saved me hours of administrative work. The concierge team is exceptional.",
        rating: 5,
        initials: "SJ",
        color: "bg-amber-100 text-amber-700"
    },
    {
        name: "Mark Thompson",
        location: "Sydney, NSW",
        date: "1 week ago",
        content: "Verified Google Review. The concierge service is genuinely helpful, not just a chatbot. Highest recommendation for business owners looking to consolidate utilities.",
        rating: 5,
        initials: "MT",
        color: "bg-blue-100 text-blue-700"
    },
    {
        name: "David Ross",
        location: "Brisbane, QLD",
        date: "3 days ago",
        content: "Professional, fast, and transparent. The IT solutions for our office were integrated perfectly with our solar and energy setup. Truly a one-stop shop.",
        rating: 5,
        initials: "DR",
        color: "bg-emerald-100 text-emerald-700"
    }
];

export default function Testimonials() {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Subtle verification watermark */}
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                <CheckCircle2 className="w-64 h-64 text-gray-900" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Header Section */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <div className="flex -space-x-1">
                            {[1, 2, 3, 4, 5].map((_, i) => (
                                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                            ))}
                        </div>
                        <span className="text-sm font-black text-gray-900 uppercase tracking-widest">4.9/5 Rating</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6 uppercase tracking-tight">
                        The Voice of <span className="text-[#1D6FB5]">Trust</span>
                    </h2>

                    <div className="inline-flex items-center space-x-3 px-6 py-3 bg-gray-50 rounded-full border border-gray-100">
                        {/* Custom Google G Style Icon */}
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Google Verified Reviews</span>
                        </div>
                        <div className="w-px h-4 bg-gray-300"></div>
                        <div className="flex items-center space-x-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Authenticated</span>
                        </div>
                    </div>
                </div>

                {/* Testimonial Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <div key={i} className="group bg-white p-10 rounded-[40px] border border-gray-100 shadow-xl shadow-gray-100/20 hover:shadow-2xl hover:shadow-blue-100/30 transition-all duration-500 flex flex-col relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity">
                                <Quote className="w-12 h-12 text-[#1D6FB5]" />
                            </div>

                            <div className="flex items-center space-x-4 mb-8">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg ${t.color}`}>
                                    {t.initials}
                                </div>
                                <div className="flex flex-col">
                                    <h4 className="font-black text-gray-900 uppercase tracking-tight leading-none">{t.name}</h4>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">{t.location}</span>
                                </div>
                            </div>

                            <div className="flex mb-4">
                                {[...Array(t.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                ))}
                            </div>

                            <p className="text-gray-500 font-medium italic leading-relaxed mb-8 flex-grow">
                                "{t.content}"
                            </p>

                            <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{t.date}</span>
                                <div className="flex items-center space-x-1">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                    <span className="text-[8px] font-black text-emerald-600 uppercase tracking-tighter">Verified Client</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Trust bar */}
                <div className="mt-20 flex flex-wrap justify-center gap-12 items-center opacity-40 grayscale filter grayscale-hover transition-all">
                    <div className="flex items-center space-x-2">
                        <span className="text-xl font-black italic tracking-tighter">Trustpilot</span>
                        <div className="flex space-x-0.5">
                            {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-4 h-4 bg-emerald-500 rounded-sm"></div>)}
                        </div>
                    </div>
                    <div className="w-px h-8 bg-gray-200 hidden md:block"></div>
                    <div className="text-xl font-black tracking-tighter uppercase">5,000+ Unified Clients</div>
                    <div className="w-px h-8 bg-gray-200 hidden md:block"></div>
                    <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        <span className="text-xl font-black tracking-tighter uppercase">ASIC Compliant</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
