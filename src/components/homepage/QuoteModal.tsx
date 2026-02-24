'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, Zap, Flame, Sun, Code2, Smartphone, Phone, Truck, Package, ArrowRight, Sparkles } from 'lucide-react';

interface QuoteModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const services = [
    { name: 'Electricity', icon: Zap, gradient: 'from-blue-500 to-sky-400', glow: 'shadow-blue-500/30' },
    { name: 'Gas', icon: Flame, gradient: 'from-orange-500 to-amber-400', glow: 'shadow-orange-500/30' },
    { name: 'Solar', icon: Sun, gradient: 'from-yellow-400 to-amber-300', glow: 'shadow-yellow-400/30' },
    { name: 'IT Solutions', icon: Code2, gradient: 'from-cyan-500 to-teal-400', glow: 'shadow-cyan-500/30' },
    { name: 'Mobile', icon: Smartphone, gradient: 'from-indigo-500 to-purple-400', glow: 'shadow-indigo-500/30' },
    { name: 'Fixed Phone', icon: Phone, gradient: 'from-pink-500 to-rose-400', glow: 'shadow-pink-500/30' },
    { name: 'Moving', icon: Truck, gradient: 'from-purple-500 to-violet-400', glow: 'shadow-purple-500/30' },
    { name: 'Distribution', icon: Package, gradient: 'from-red-500 to-orange-400', glow: 'shadow-red-500/30' },
];

export default function QuoteModal({ isOpen, onClose }: QuoteModalProps) {
    const [step, setStep] = useState(1);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', postcode: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const toggleService = (name: string) => {
        setSelectedServices(prev =>
            prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
        );
    };

    const handleNext = () => setStep(2);
    const handleBack = () => setStep(1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, services: selectedServices }),
            });
            if (response.ok) {
                setStep(3);
            } else {
                alert('Failed to submit. Please try again.');
            }
        } catch {
            alert('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        onClose();
        setTimeout(() => { setStep(1); setSelectedServices([]); setFormData({ name: '', email: '', phone: '', postcode: '' }); }, 400);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 30 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                        className="relative w-full max-w-xl overflow-hidden rounded-3xl shadow-2xl shadow-blue-900/30"
                    >
                        {/* Premium dark header */}
                        <div className="relative bg-gradient-to-br from-[#0a1628] via-[#0f2044] to-[#1a2e55] px-8 pt-8 pb-7">
                            {/* ambient glow dots */}
                            <div className="pointer-events-none absolute -top-12 -right-12 h-48 w-48 rounded-full bg-[#1D6FB5]/20 blur-3xl" />
                            <div className="pointer-events-none absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-sky-400/10 blur-3xl" />

                            {/* Close */}
                            <button
                                onClick={handleClose}
                                className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white"
                            >
                                <X className="h-4 w-4" />
                            </button>

                            {/* Brand row */}
                            <div className="mb-5 flex items-center gap-2">
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1D6FB5]">
                                    <Sparkles className="h-4 w-4 text-white" />
                                </div>
                                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#1D6FB5]">One Stop Utilities</span>
                            </div>

                            {step === 1 && (
                                <div>
                                    <h2 className="text-2xl font-black text-white leading-tight">
                                        Select Your <span className="text-sky-400">Services</span>
                                    </h2>
                                    <p className="mt-1.5 text-sm text-slate-400">Choose the utilities you'd like to optimise or connect.</p>
                                </div>
                            )}
                            {step === 2 && (
                                <div>
                                    <h2 className="text-2xl font-black text-white leading-tight">
                                        Your <span className="text-sky-400">Details</span>
                                    </h2>
                                    <p className="mt-1.5 text-sm text-slate-400">We'll have a specialist call you within 2 hours.</p>
                                </div>
                            )}
                            {step === 3 && (
                                <div>
                                    <h2 className="text-2xl font-black text-white leading-tight">
                                        Inquiry <span className="text-emerald-400">Received!</span>
                                    </h2>
                                    <p className="mt-1.5 text-sm text-slate-400">Your concierge will be in touch very soon.</p>
                                </div>
                            )}

                            {/* Step progress pills */}
                            {step < 3 && (
                                <div className="mt-5 flex gap-2">
                                    {[1, 2].map(s => (
                                        <div
                                            key={s}
                                            className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= s ? 'bg-[#1D6FB5]' : 'bg-white/10'}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Body */}
                        <div className="bg-[#f8fafd] px-8 py-7">
                            {/* Step 1 — Service Selection */}
                            {step === 1 && (
                                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                    <div className="grid grid-cols-4 gap-3 mb-7">
                                        {services.map((s) => {
                                            const selected = selectedServices.includes(s.name);
                                            return (
                                                <button
                                                    key={s.name}
                                                    onClick={() => toggleService(s.name)}
                                                    className={`group relative flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 text-center transition-all duration-200
                                                        ${selected
                                                            ? `bg-gradient-to-br ${s.gradient} border-transparent shadow-lg ${s.glow}`
                                                            : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                                                        }`}
                                                >
                                                    <s.icon className={`h-5 w-5 transition-colors ${selected ? 'text-white' : 'text-slate-500 group-hover:text-slate-800'}`} />
                                                    <span className={`text-[9px] font-black uppercase leading-tight tracking-tight ${selected ? 'text-white' : 'text-slate-600'}`}>
                                                        {s.name}
                                                    </span>
                                                    {selected && (
                                                        <div className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-white flex items-center justify-center shadow">
                                                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                                        </div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {selectedServices.length > 0 && (
                                        <motion.p
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                            className="mb-4 text-center text-xs font-semibold text-slate-400"
                                        >
                                            <span className="text-[#1D6FB5] font-black">{selectedServices.length}</span> service{selectedServices.length > 1 ? 's' : ''} selected
                                        </motion.p>
                                    )}

                                    <button
                                        disabled={selectedServices.length === 0}
                                        onClick={handleNext}
                                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#1D6FB5] to-sky-500 py-4 text-sm font-black uppercase tracking-[0.15em] text-white shadow-lg shadow-blue-500/25 transition active:scale-[0.98] disabled:opacity-40 disabled:shadow-none hover:shadow-blue-500/40"
                                    >
                                        Continue <ArrowRight className="h-4 w-4" />
                                    </button>
                                </motion.div>
                            )}

                            {/* Step 2 — Contact Form */}
                            {step === 2 && (
                                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-[#1D6FB5]">Full Name</label>
                                                <input
                                                    required type="text" placeholder="John Smith"
                                                    value={formData.name}
                                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-900 placeholder:text-slate-300 focus:border-[#1D6FB5] focus:outline-none focus:ring-2 focus:ring-[#1D6FB5]/10 transition"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-[#1D6FB5]">Phone</label>
                                                <input
                                                    required type="tel" placeholder="0400 000 000"
                                                    value={formData.phone}
                                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-900 placeholder:text-slate-300 focus:border-[#1D6FB5] focus:outline-none focus:ring-2 focus:ring-[#1D6FB5]/10 transition"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-[#1D6FB5]">Email Address</label>
                                            <input
                                                required type="email" placeholder="john@example.com"
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-900 placeholder:text-slate-300 focus:border-[#1D6FB5] focus:outline-none focus:ring-2 focus:ring-[#1D6FB5]/10 transition"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-[#1D6FB5]">Postcode</label>
                                            <input
                                                required type="text" placeholder="2000"
                                                value={formData.postcode}
                                                onChange={e => setFormData({ ...formData, postcode: e.target.value })}
                                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-900 placeholder:text-slate-300 focus:border-[#1D6FB5] focus:outline-none focus:ring-2 focus:ring-[#1D6FB5]/10 transition"
                                            />
                                        </div>

                                        <div className="flex gap-3 pt-2">
                                            <button
                                                type="button" onClick={handleBack}
                                                className="flex-1 rounded-2xl border border-slate-200 bg-white py-4 text-sm font-black uppercase tracking-[0.15em] text-slate-600 transition hover:bg-slate-50 active:scale-[0.98]"
                                            >
                                                Back
                                            </button>
                                            <button
                                                type="submit" disabled={isSubmitting}
                                                className="flex-[2] flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#1D6FB5] to-sky-500 py-4 text-sm font-black uppercase tracking-[0.15em] text-white shadow-lg shadow-blue-500/25 transition active:scale-[0.98] disabled:opacity-60"
                                            >
                                                {isSubmitting ? 'Sending…' : 'Get My Quote'}
                                                {!isSubmitting && <Send className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}

                            {/* Step 3 — Success */}
                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="py-8 text-center"
                                >
                                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-400/30">
                                        <CheckCircle2 className="h-10 w-10 text-white" />
                                    </div>
                                    <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-500">Confirmed</p>
                                    <p className="mb-1 text-slate-600 font-medium text-sm max-w-xs mx-auto">
                                        Your concierge will reach you within <span className="font-black text-slate-900">2 hours</span>.
                                    </p>
                                    <div className="my-6 mx-auto max-w-xs rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-sm">
                                        <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Services Requested</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {selectedServices.map(s => (
                                                <span key={s} className="rounded-full bg-[#1D6FB5]/10 px-2.5 py-1 text-[10px] font-black text-[#1D6FB5] uppercase">
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleClose}
                                        className="rounded-2xl bg-slate-900 px-10 py-4 text-xs font-black uppercase tracking-[0.2em] text-white transition hover:bg-slate-800 active:scale-[0.98]"
                                    >
                                        Done
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
