'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, Zap, Flame, Sun, Code2, Smartphone, Phone, Truck, Package, ArrowRight } from 'lucide-react';

interface QuoteModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const services = [
    { name: 'Electricity', icon: Zap, color: 'text-blue-500', bg: 'bg-blue-50' },
    { name: 'Gas', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50' },
    { name: 'Solar', icon: Sun, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { name: 'IT Solutions', icon: Code2, color: 'text-cyan-500', bg: 'bg-cyan-50' },
    { name: 'Mobile', icon: Smartphone, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { name: 'Fixed Phone', icon: Phone, color: 'text-pink-500', bg: 'bg-pink-50' },
    { name: 'Moving', icon: Truck, color: 'text-purple-500', bg: 'bg-purple-50' },
    { name: 'Distribution', icon: Package, color: 'text-red-500', bg: 'bg-red-50' },
];

export default function QuoteModal({ isOpen, onClose }: QuoteModalProps) {
    const [step, setStep] = useState(1);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        postcode: ''
    });

    const toggleService = (name: string) => {
        setSelectedServices(prev =>
            prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
        );
    };

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    services: selectedServices
                }),
            });
            if (response.ok) {
                setStep(3); // Success step
            } else {
                alert('Failed to submit. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting lead:', error);
            alert('An error occurred. Please try again.');
        }
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
                        onClick={onClose}
                        className="absolute inset-0 bg-gray-900/60 backdrop-blur-xl"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-2xl bg-white/80 backdrop-blur-3xl rounded-[48px] border border-white/20 shadow-2xl overflow-hidden shadow-blue-500/10"
                    >
                        {/* Header Decoration */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#1D6FB5] to-sky-400"></div>

                        <button
                            onClick={onClose}
                            className="absolute top-8 right-8 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-20"
                        >
                            <X className="w-5 h-5 text-gray-900" />
                        </button>

                        <div className="p-8 md:p-12">
                            {step === 1 && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                    <div className="mb-10">
                                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tighter mb-4">
                                            Select Your <span className="text-[#1D6FB5]">Utilities</span>
                                        </h2>
                                        <p className="text-gray-500 font-medium">Choose any services you would like to consolidate or upgrade.</p>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
                                        {services.map((s) => (
                                            <button
                                                key={s.name}
                                                onClick={() => toggleService(s.name)}
                                                className={`p-4 rounded-3xl border transition-all flex flex-col items-center justify-center gap-3 text-center
                                                    ${selectedServices.includes(s.name)
                                                        ? 'bg-[#1D6FB5] border-[#1D6FB5] shadow-lg shadow-blue-500/20'
                                                        : 'bg-white/50 border-gray-100 hover:border-[#1D6FB5]/30'}`}
                                            >
                                                <s.icon className={`w-6 h-6 ${selectedServices.includes(s.name) ? 'text-white' : s.color}`} />
                                                <span className={`text-[10px] font-black uppercase tracking-tight ${selectedServices.includes(s.name) ? 'text-white' : 'text-gray-900'}`}>
                                                    {s.name}
                                                </span>
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        disabled={selectedServices.length === 0}
                                        onClick={handleNext}
                                        className="w-full py-6 rounded-[24px] bg-[#1D6FB5] text-white font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
                                    >
                                        Next Step
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                    <div className="mb-10">
                                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tighter mb-4">
                                            Concierge <span className="text-[#1D6FB5]">Details</span>
                                        </h2>
                                        <p className="text-gray-500 font-medium">Where should we send your custom operational analysis?</p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-[#1D6FB5] ml-4">Full Name</label>
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="John Doe"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full px-6 py-4 rounded-2xl bg-white border border-gray-100 focus:outline-none focus:border-[#1D6FB5] font-bold text-gray-900 placeholder:text-gray-300"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-[#1D6FB5] ml-4">Phone Number</label>
                                                <input
                                                    required
                                                    type="tel"
                                                    placeholder="0400 000 000"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    className="w-full px-6 py-4 rounded-2xl bg-white border border-gray-100 focus:outline-none focus:border-[#1D6FB5] font-bold text-gray-900 placeholder:text-gray-300"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#1D6FB5] ml-4">Email Address</label>
                                            <input
                                                required
                                                type="email"
                                                placeholder="john@example.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full px-6 py-4 rounded-2xl bg-white border border-gray-100 focus:outline-none focus:border-[#1D6FB5] font-bold text-gray-900 placeholder:text-gray-300"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#1D6FB5] ml-4">Postcode / Location</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="2000"
                                                value={formData.postcode}
                                                onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                                                className="w-full px-6 py-4 rounded-2xl bg-white border border-gray-100 focus:outline-none focus:border-[#1D6FB5] font-bold text-gray-900 placeholder:text-gray-300"
                                            />
                                        </div>

                                        <div className="flex gap-4 pt-4">
                                            <button
                                                type="button"
                                                onClick={handleBack}
                                                className="flex-1 py-6 rounded-[24px] bg-gray-100 text-gray-900 font-black uppercase tracking-[0.2em] text-sm transition-all active:scale-[0.98]"
                                            >
                                                Back
                                            </button>
                                            <button
                                                type="submit"
                                                className="flex-[2] py-6 rounded-[24px] bg-[#1D6FB5] text-white font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-blue-500/20"
                                            >
                                                Get My Quote
                                                <Send className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="py-12 text-center"
                                >
                                    <div className="w-24 h-24 bg-emerald-50 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-sm">
                                        <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tighter mb-4">
                                        Inquiry <span className="text-[#1D6FB5]">Received</span>
                                    </h2>
                                    <p className="text-gray-500 font-medium max-w-sm mx-auto mb-10">
                                        Your concierge representative will contact you within 2 hours for a personal consultation.
                                    </p>
                                    <button
                                        onClick={onClose}
                                        className="px-12 py-5 rounded-[24px] bg-gray-900 text-white font-black uppercase tracking-[0.2em] text-xs transition-all active:scale-[0.98]"
                                    >
                                        Close Portal
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
