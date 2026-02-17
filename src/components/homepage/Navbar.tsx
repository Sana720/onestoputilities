'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { isMarketOpen } from '@/lib/market';
import { Menu, X, LayoutDashboard, Globe, Lock, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isMarket, setIsMarket] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [scrolled, setScrolled] = useState(false);

    const isAboutPage = pathname === '/about';

    useEffect(() => {
        setIsMarket(isMarketOpen());
        const interval = setInterval(() => {
            setIsMarket(isMarketOpen());
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
                : isAboutPage
                    ? 'py-6 bg-white/5 backdrop-blur-2xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]'
                    : 'py-6 bg-transparent'
                }`}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between">
                        {/* Logo & Status Group */}
                        <div className="flex items-center space-x-6">
                            <Link href="/" className="relative group transition-transform active:scale-95 shrink-0">
                                <Image src="/logo.png" alt="SHREEG Logo" width={140} height={40} className="h-9 md:h-10 w-auto" />
                            </Link>

                            <div className="hidden lg:flex items-center space-x-4 border-l border-gray-100 pl-4 h-8">
                                <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${isMarket ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
                                    }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${isMarket ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                                    <span>Market {isMarket ? 'Live' : 'Closed'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Navigation - Institutional Group */}
                        <div className={`hidden md:flex items-center space-x-1 rounded-2xl p-1 border transition-colors ${scrolled || !isAboutPage ? 'bg-gray-50/50 border-gray-100' : 'bg-white/5 border-white/10'}`}>
                            <Link href="/" className={`group relative px-5 py-2 text-sm font-bold transition-all ${scrolled || !isAboutPage ? 'text-gray-600' : 'text-gray-300'} hover:text-[#1B8A9F]`}>
                                <span>Home</span>
                                <span className="absolute bottom-1 left-5 right-5 h-0.5 bg-[#1B8A9F] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                            </Link>
                            <Link href="/about" className={`group relative px-5 py-2 text-sm font-bold transition-all ${scrolled || !isAboutPage ? 'text-gray-600' : 'text-gray-300'} hover:text-[#1B8A9F]`}>
                                <span>About</span>
                                <span className="absolute bottom-1 left-5 right-5 h-0.5 bg-[#1B8A9F] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                            </Link>
                            <button onClick={() => handleNavClick('research')} className={`group relative px-5 py-2 text-sm font-bold transition-all ${scrolled || !isAboutPage ? 'text-gray-600' : 'text-gray-300'} hover:text-[#1B8A9F] cursor-pointer`}>
                                <span>Research</span>
                                <span className="absolute bottom-1 left-5 right-5 h-0.5 bg-[#1B8A9F] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                            </button>
                            <button onClick={() => handleNavClick('portfolio')} className={`group relative px-5 py-2 text-sm font-bold transition-all ${scrolled || !isAboutPage ? 'text-gray-600' : 'text-gray-300'} hover:text-[#1B8A9F] cursor-pointer`}>
                                <span>Yield</span>
                                <span className="absolute bottom-1 left-5 right-5 h-0.5 bg-[#1B8A9F] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                            </button>
                        </div>

                        {/* Desktop Actions - Institutional Group */}
                        <div className="hidden md:flex items-center space-x-3 border-l border-gray-100 pl-4">
                            <Link
                                href="https://ekyc.arihantcapital.com/?rmcode=9191"
                                target="_blank"
                                className="hidden lg:flex items-center px-5 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-[#1B8A9F] hover:text-[#1B8A9F] transition-all active:scale-95 hover:shadow-sm"
                            >
                                Open Demat
                            </Link>

                            {userRole ? (
                                <Link
                                    href={userRole === 'admin' ? '/admin/dashboard' : '/client/dashboard'}
                                    className="group relative px-6 py-3 bg-[#1B8A9F] text-white rounded-xl flex items-center space-x-3 overflow-hidden transition-all hover:bg-[#156d7d] hover:shadow-xl shadow-teal-100"
                                >
                                    <LayoutDashboard className="w-4 h-4 relative z-10" />
                                    <span className="text-sm font-black relative z-10">Dashboard</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <Link
                                        href="/login"
                                        className={`px-6 py-3 text-sm font-black uppercase tracking-widest transition-all ${scrolled || !isAboutPage ? 'text-gray-600' : 'text-white'} hover:text-[#1B8A9F]`}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/apply"
                                        className="px-7 py-3 bg-gray-900 text-white text-sm font-black uppercase tracking-widest rounded-xl hover:bg-[#1B8A9F] hover:shadow-2xl shadow-gray-200 transition-all active:scale-95"
                                    >
                                        Join Network
                                    </Link>
                                </div>
                            )}
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

            {/* Mobile Menu - Moved outside nav to avoid parent layout interference */}
            <div className={`md:hidden fixed inset-0 z-[110] bg-white transition-all duration-700 ease-in-out ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}>
                <div className="p-6 h-full flex flex-col overflow-y-auto">
                    <div className="flex items-center justify-between mb-4 shrink-0">
                        <Image src="/logo.png" alt="SHREEG Logo" width={84} height={24} className="h-6 w-auto" />
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="p-3 bg-gray-50 rounded-2xl"
                        >
                            <X className="w-6 h-6 text-gray-600" />
                        </button>
                    </div>

                    <div className="flex flex-col space-y-2">
                        {[
                            { name: 'Home', href: '/', type: 'link' },
                            { name: 'About Us', href: '/about', type: 'link' },
                            { name: 'Research Analysis', id: 'research', type: 'scroll' },
                            { name: 'Yield Comparison', id: 'portfolio', type: 'scroll' },
                            { name: 'Open Demat Account', href: 'https://ekyc.arihantcapital.com/?rmcode=9191', special: true, highlight: true, type: 'link' }
                        ].map((item, i) => (
                            item.type === 'scroll' ? (
                                <button
                                    key={i}
                                    onClick={() => handleNavClick(item.id!, true)}
                                    className="text-sm font-bold uppercase tracking-widest text-gray-900 text-left transition-all active:scale-95"
                                >
                                    {item.name}
                                </button>
                            ) : (
                                <Link
                                    key={i}
                                    href={item.href!}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`text-sm font-bold uppercase tracking-widest transition-all active:scale-95 ${item.highlight
                                        ? 'text-white bg-[#1B8A9F] px-4 py-2.5 rounded-lg shadow-lg shadow-[#1B8A9F]/20 text-xs text-center inline-block w-fit'
                                        : item.special ? 'text-[#1B8A9F]' : 'text-gray-900'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            )
                        ))}
                    </div>

                    <div className="mt-auto space-y-2 pt-6">
                        {userRole ? (
                            <Link
                                href={userRole === 'admin' ? '/admin/dashboard' : '/client/dashboard'}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="w-full flex items-center justify-center space-x-3 py-3 bg-[#1B8A9F] text-white rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-teal-100/20"
                            >
                                <LayoutDashboard className="w-5 h-5" />
                                <span>Go to Dashboard</span>
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/apply"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-full flex items-center justify-center py-2.5 bg-[#1B8A9F] text-white rounded-lg font-bold uppercase tracking-widest text-xs shadow-lg shadow-[#1B8A9F]/20"
                                >
                                    Join Network
                                </Link>
                                <Link
                                    href="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-full flex items-center justify-center py-2 bg-gray-50 text-gray-900 rounded-lg font-bold uppercase tracking-widest text-[10px]"
                                >
                                    Client Login
                                </Link>
                            </>
                        )}
                        <div className="flex items-center justify-between px-4 pt-6">
                            <div className="flex items-center space-x-2">
                                <Lock className="w-4 h-4 text-gray-400" />
                                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">10 years + holding company</span>
                            </div>
                            <div className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${isMarket ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                }`}>
                                Market {isMarket ? 'Live' : 'Closed'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
