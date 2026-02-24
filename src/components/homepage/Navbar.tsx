'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, LayoutDashboard, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface NavbarProps {
    onGetStarted?: () => void;
}

export default function Navbar({ onGetStarted }: NavbarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [isServiceActive, setIsServiceActive] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [scrolled, setScrolled] = useState(false);

    const isTransparentPage = ['/about', '/privacy-policy', '/terms-conditions'].includes(pathname);

    useEffect(() => {
        setIsServiceActive(true);
        const interval = setInterval(() => {
            setIsServiceActive(true);
        }, 60000);

        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);

        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setUserRole(session.user.user_metadata.role || 'client');
            } else {
                const userData = localStorage.getItem('user');
                if (userData) {
                    try {
                        setUserRole(JSON.parse(userData).role);
                    } catch (e) {
                        setUserRole(null);
                    }
                }
            }
        };

        checkAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                setUserRole(session.user.user_metadata.role || 'client');
            } else {
                setUserRole(null);
            }
        });

        return () => {
            clearInterval(interval);
            window.removeEventListener('scroll', handleScroll);
            subscription.unsubscribe();
        };
    }, []);

    // Body scroll lock
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    const handleNavClick = (id: string, isMobile = false) => {
        if (isMobile) setIsMobileMenuOpen(false);
        if (pathname === '/') {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            router.push(`/#${id}`);
        }
    };

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled
                ? 'py-4 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm'
                : isTransparentPage
                    ? 'py-6 bg-white/5 backdrop-blur-2xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]'
                    : 'py-6 bg-transparent'
                }`}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between">
                        {/* Logo & Status Group */}
                        <div className="flex items-center space-x-6">
                            <div className="relative group transition-transform shrink-0">
                                <Image src="/onestop-logo.png" alt="One Stop Utilities Logo" width={180} height={50} className="h-10 md:h-12 w-auto" />
                            </div>

                            <div className="hidden lg:flex items-center space-x-4 border-l border-gray-100 pl-4 h-8">
                                <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${isServiceActive ? 'bg-blue-50 text-[#1D6FB5] border border-blue-100' : 'bg-red-50 text-red-600 border border-red-100'
                                    }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${isServiceActive ? 'bg-[#1D6FB5] animate-pulse' : 'bg-red-500'}`}></span>
                                    <span>Support {isServiceActive ? 'Available 24/7' : 'Offline'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Navigation - Institutional Group */}
                        <div className={`hidden md:flex items-center space-x-1 rounded-2xl p-1 border transition-colors ${scrolled || !isTransparentPage ? 'bg-gray-50/50 border-gray-100' : 'bg-white/5 border-white/10'}`}>
                            <div className={`group relative px-5 py-2 text-sm font-bold transition-all ${scrolled || !isTransparentPage ? 'text-gray-600' : 'text-gray-300'}`}>
                                <span>Home</span>
                            </div>
                            <div className={`group relative px-5 py-2 text-sm font-bold transition-all ${scrolled || !isTransparentPage ? 'text-gray-600' : 'text-gray-300'}`}>
                                <span>About Us</span>
                            </div>
                            <button onClick={() => handleNavClick('services')} className={`group relative px-5 py-2 text-sm font-bold transition-all ${scrolled || !isTransparentPage ? 'text-gray-600' : 'text-gray-300'} hover:text-[#1D6FB5] cursor-pointer`}>
                                <span>Services</span>
                                <span className="absolute bottom-1 left-5 right-5 h-0.5 bg-[#1D6FB5] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                            </button>
                            <button onClick={() => handleNavClick('footer')} className={`group relative px-5 py-2 text-sm font-bold transition-all ${scrolled || !isTransparentPage ? 'text-gray-600' : 'text-gray-300'} hover:text-[#1D6FB5] cursor-pointer`}>
                                <span>Support</span>
                                <span className="absolute bottom-1 left-5 right-5 h-0.5 bg-[#1D6FB5] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                            </button>
                        </div>

                        {/* Desktop Actions - Contact Focus */}
                        <div className="hidden md:flex items-center space-x-3 border-l border-gray-100 pl-4">
                            <div
                                className="hidden lg:flex items-center px-5 py-2.5 bg-[#1D6FB5] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20"
                            >
                                <span className="mr-2">1300 1STOP U</span> (1300 178 678)
                            </div>
                        </div>

                        {/* Mobile Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-3 bg-gray-50 border border-gray-100 rounded-2xl text-gray-600 active:scale-90 transition-all"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div className={`md:hidden fixed inset-0 z-[110] bg-white transition-all duration-700 ease-in-out ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}>
                <div className="p-6 h-full flex flex-col overflow-y-auto">
                    <div className="flex items-center justify-between mb-4 shrink-0">
                        <Image src="/onestop-logo.png" alt="One Stop Utilities Logo" width={84} height={24} className="h-6 w-auto" />
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="p-3 bg-gray-50 rounded-2xl"
                        >
                            <X className="w-6 h-6 text-gray-600" />
                        </button>
                    </div>

                    <div className="flex flex-col space-y-2">
                        {[
                            { name: 'Home', type: 'static' },
                            { name: 'About Us', type: 'static' },
                            { name: 'Services', id: 'services', type: 'scroll' },
                            { name: 'Contact Us', id: 'footer', type: 'scroll' },
                            { name: '1300 1STOP U', special: true, highlight: true, type: 'static' }
                        ].map((item, i) => (
                            item.type === 'scroll' ? (
                                <button
                                    key={i}
                                    onClick={() => handleNavClick(item.id!, true)}
                                    className="text-sm font-bold uppercase tracking-widest text-gray-900 text-left transition-all active:scale-95 px-4 py-2"
                                >
                                    {item.name}
                                </button>
                            ) : item.type === 'static' ? (
                                <div
                                    key={i}
                                    className={`text-sm font-bold uppercase tracking-widest px-4 py-2.5 rounded-lg ${item.highlight
                                        ? 'text-white bg-[#1D6FB5] shadow-lg shadow-blue-500/20 text-xs text-center inline-block w-fit'
                                        : item.special ? 'text-[#1D6FB5]' : 'text-gray-900'
                                        }`}
                                >
                                    {item.name}
                                </div>
                            ) : null
                        ))}
                    </div>

                    <div className="mt-auto pt-6">
                        <div className="flex items-center justify-between px-4 pt-6">
                            <div className="flex items-center space-x-2">
                                <Lock className="w-4 h-4 text-amber-500" />
                                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">End-to-End Utility Partner</span>
                            </div>
                            <div className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${isServiceActive ? 'bg-blue-50 text-[#1D6FB5]' : 'bg-red-50 text-red-600'
                                }`}>
                                Support {isServiceActive ? 'Available' : 'Offline'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
