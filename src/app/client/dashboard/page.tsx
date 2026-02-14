'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    TrendingUp,
    LogOut,
    DollarSign,
    Calendar,
    Lock,
    CheckCircle2,
    Clock,
    Download,
    User,
    Building2,
    Users,
    Loader2,
    PieChart,
    ArrowUpRight,
    Briefcase,
    ShieldCheck,
    Mail
} from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { InvestmentAgreement } from '@/components/InvestmentAgreement';
import { supabase } from '@/lib/supabase';

interface Investment {
    id: string;
    full_name: string;
    father_name: string;
    dob: string;
    age: number;
    gender: string;
    occupation: string;
    permanent_address: string;
    contact_number: string;
    email: string;
    investment_amount: number;
    number_of_shares: number;
    face_value_per_share: number;
    payment_mode: string;
    payment_reference: string;
    payment_date: string;
    lock_in_period: number;
    lock_in_start_date: string;
    lock_in_end_date: string;
    dividend_rate: number;
    status: string;
    product_name?: string;
    broker_id?: string;
    broker_name?: string;
    demat_account: string;
    demat_credited: boolean;
    demat_credit_date: string;
    dividends: Array<{
        amount: number;
        date: string;
        status: string;
    }>;
    nominee: {
        name: string;
        relation: string;
        dob: string;
        address: string;
    };
    bank_details: {
        bankName: string;
        accountNumber: string;
        branch: string;
        ifscCode: string;
        micrCode: string;
    };
}

export default function ClientDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                const userData = localStorage.getItem('user');
                if (!userData) {
                    router.push('/login');
                    return;
                }
                const parsedUser = JSON.parse(userData);
                if (parsedUser.role !== 'client') {
                    router.push('/login');
                    return;
                }
                setUser(parsedUser);
            } else {
                const userData = session.user.user_metadata;
                let role = userData.role;

                // Fallback to localStorage if role is missing in metadata
                if (!role) {
                    const localData = localStorage.getItem('user');
                    if (localData) {
                        const parsedLocal = JSON.parse(localData);
                        if (parsedLocal.id === session.user.id || parsedLocal.email === session.user.email) {
                            role = parsedLocal.role;
                        }
                    }
                }

                if (role !== 'client') {
                    router.push('/login');
                    return;
                }

                const updatedUser = { ...session.user, ...userData, role };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }

            fetchInvestments();
        };

        checkSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                localStorage.removeItem('user');
                localStorage.removeItem('session');
                router.push('/login');
            } else {
                const userData = session.user.user_metadata;
                if (userData.role === 'client') {
                    setUser({ ...session.user, ...userData });
                    localStorage.setItem('user', JSON.stringify({ ...session.user, ...userData }));
                }
            }
        });

        return () => subscription.unsubscribe();
    }, [router]);

    const fetchInvestments = async () => {
        try {
            const userData = localStorage.getItem('user');
            if (!userData) return;

            const parsedUser = JSON.parse(userData);
            const response = await fetch(`/api/investments/my-investments?email=${encodeURIComponent(parsedUser.email)}`);
            const data = await response.json();

            if (response.ok) {
                setInvestments(data.investments);
            }
        } catch (error) {
            console.error('Error fetching investments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('user');
        localStorage.removeItem('session');
        router.push('/login');
    };

    const calculateTotalDividends = () => {
        return investments.reduce((total, inv) => {
            const paidDividends = (inv.dividends || [])
                .filter(d => d.status === 'paid')
                .reduce((sum, d) => sum + d.amount, 0);
            return total + paidDividends;
        }, 0);
    };

    const calculateTotalInvestment = () => {
        return investments.reduce((total, inv) => total + Number(inv.investment_amount), 0);
    };

    const calculatePendingDividends = () => {
        return investments.reduce((total, inv) => {
            const pendingDividends = (inv.dividends || [])
                .filter(d => d.status === 'pending')
                .reduce((sum, d) => sum + d.amount, 0);
            return total + pendingDividends;
        }, 0);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    const getDaysRemaining = (endDate: string) => {
        if (!endDate) return 0;
        const end = new Date(endDate);
        const today = new Date();
        const diffTime = end.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#1B8A9F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500 font-medium">Loading your portfolio...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Navigation */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center space-x-4">
                            <Link href="/">
                                <Image
                                    src="/logo.png"
                                    alt="SHREEG Logo"
                                    width={150}
                                    height={40}
                                    className="h-10 w-auto"
                                />
                            </Link>
                            <div className="hidden md:block border-l border-gray-200 pl-4">
                                <span className="text-xs font-bold text-[#1B8A9F] uppercase tracking-wider">Client Portal</span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-6">
                            <div className="hidden sm:flex flex-col items-end">
                                <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                                <p className="text-xs text-gray-500">{user?.email}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center text-gray-600 hover:text-red-500 transition-colors py-2"
                            >
                                <LogOut className="w-5 h-5 mr-1" />
                                <span className="text-sm font-semibold">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
                {/* Dashboard Header */}
                <div className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Portfolio Overview</h2>
                        <p className="text-sm md:text-base text-gray-500 mt-1">Track your investments and dividend returns</p>
                    </div>
                    <Link
                        href="/apply"
                        className="inline-flex items-center justify-center bg-[#1B8A9F] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#156d7d] hover:shadow-lg transition-all transform hover:-translate-y-0.5 w-full md:w-auto"
                    >
                        New Investment
                        <ArrowUpRight className="w-4 h-4 ml-2" />
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
                    <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center mb-4 text-[#1B8A9F]">
                            <Briefcase className="w-5 h-5" />
                        </div>
                        <p className="text-gray-500 text-xs md:text-sm font-medium">Total Invested</p>
                        <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1">{formatCurrency(calculateTotalInvestment())}</p>
                    </div>

                    <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mb-4 text-[#4ADE80]">
                            <ArrowUpRight className="w-5 h-5" />
                        </div>
                        <p className="text-gray-500 text-xs md:text-sm font-medium">Profit Earned</p>
                        <p className="text-xl md:text-2xl font-bold text-[#4ADE80] mt-1">{formatCurrency(calculateTotalDividends())}</p>
                    </div>

                    <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center mb-4 text-orange-500">
                            <Clock className="w-5 h-5" />
                        </div>
                        <p className="text-gray-500 text-xs md:text-sm font-medium">Pending Gains</p>
                        <p className="text-xl md:text-2xl font-bold text-orange-500 mt-1">{formatCurrency(calculatePendingDividends())}</p>
                    </div>

                    <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center mb-4 text-[#1B8A9F]">
                            <PieChart className="w-5 h-5" />
                        </div>
                        <p className="text-gray-500 text-xs md:text-sm font-medium">Active Shares</p>
                        <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1">{investments.reduce((sum, inv) => sum + Number(inv.number_of_shares), 0)}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex space-x-8 border-b border-gray-200 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
                    {['overview', 'dividends', 'details'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all relative ${activeTab === tab
                                ? 'text-[#1B8A9F]'
                                : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1B8A9F] rounded-t-full"></div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Content Tabs */}
                <div className="animate-fade-in-up">
                    {activeTab === 'overview' && (
                        <div className="grid gap-6">
                            {investments.length > 0 ? (
                                investments.map((investment) => (
                                    <div key={investment.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                        <div className="p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                            <div className="space-y-4">
                                                <div className="flex items-center space-x-3">
                                                    <h3 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Investment Agreement</h3>
                                                    {investment.product_name && (
                                                        <span className="px-3 py-1 bg-teal-50 text-[#1B8A9F] text-[10px] font-black uppercase tracking-widest rounded-full border border-teal-100">
                                                            {investment.product_name}
                                                        </span>
                                                    )}
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${investment.status === 'active' ? 'bg-green-100 text-green-700' :
                                                        investment.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                                                            'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {investment.status}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                                    <div className="flex items-center">
                                                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                                                        {formatDate(investment.payment_date)}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <ShieldCheck className="w-4 h-4 mr-1 text-[#1B8A9F]" />
                                                        3-Year Lock-in
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 flex-1 max-w-2xl px-0 lg:px-8">
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Principal</p>
                                                    <p className="text-lg font-bold text-gray-900">{formatCurrency(investment.investment_amount)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Shares</p>
                                                    <p className="text-lg font-bold text-gray-900">{investment.number_of_shares}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Yield (%)</p>
                                                    <p className="text-lg font-bold text-[#1B8A9F]">{investment.dividend_rate > 0 ? `${investment.dividend_rate}%` : 'FIXED'}</p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
                                                {['approved', 'active', 'matured', 'bought_back'].includes(investment.status) ? (
                                                    <PDFDownloadLink
                                                        document={<InvestmentAgreement data={investment} />}
                                                        fileName={`Agreement_${investment.id.slice(0, 8)}.pdf`}
                                                        className="inline-flex items-center justify-center bg-gray-50 text-gray-700 px-5 py-2.5 rounded-lg border border-gray-200 text-sm font-bold hover:bg-gray-100 transition-colors"
                                                    >
                                                        {({ loading }) => (
                                                            <>
                                                                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                                                                Manifest
                                                            </>
                                                        )}
                                                    </PDFDownloadLink>
                                                ) : (
                                                    <button
                                                        disabled
                                                        className="inline-flex items-center justify-center bg-gray-50 text-gray-400 px-5 py-2.5 rounded-lg border border-gray-200 text-sm font-bold cursor-not-allowed opacity-75"
                                                        title="Agreement will be available after admin approval"
                                                    >
                                                        <Lock className="w-4 h-4 mr-2" />
                                                        Processing
                                                    </button>
                                                )}
                                                {getDaysRemaining(investment.lock_in_end_date) > 0 && (
                                                    <div className="text-center px-4 py-1 bg-teal-50 rounded-lg">
                                                        <p className="text-[10px] font-bold text-[#1B8A9F] uppercase tracking-tighter">Maturity In</p>
                                                        <p className="text-xs font-bold text-teal-800">{getDaysRemaining(investment.lock_in_end_date)} Days</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                                            <p className="text-xs text-gray-500 font-medium">Reference ID: <span className="font-mono text-gray-400">{investment.id}</span></p>
                                            <div className="flex items-center text-xs font-bold text-[#1B8A9F]">
                                                {investment.demat_credited ? 'Credited to CDSL' : 'CDSL Processing'}
                                                <CheckCircle2 className={`w-3.5 h-3.5 ml-1.5 ${investment.demat_credited ? 'text-[#4ADE80]' : 'text-gray-300'}`} />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-100">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Briefcase className="w-10 h-10 text-gray-300" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">No active investments</h3>
                                    <p className="text-gray-500 mt-2 max-w-xs mx-auto text-sm">You haven't made any investments yet. Start growing your wealth today!</p>
                                    <Link
                                        href="/apply"
                                        className="mt-8 inline-flex items-center justify-center bg-[#1B8A9F] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#156d7d] transition-all"
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'dividends' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-8 border-b border-gray-100">
                                <h3 className="text-xl font-bold text-gray-900">Dividend Returns</h3>
                                <p className="text-sm text-gray-500 mt-1">History of all payouts credited to your bank account</p>
                            </div>

                            {investments.some(inv => inv.dividends && inv.dividends.length > 0) ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th className="px-8 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Investment</th>
                                                <th className="px-8 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                                                <th className="px-8 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Bank / Mode</th>
                                                <th className="px-8 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Transaction Ref</th>
                                                <th className="px-8 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Payout Date</th>
                                                <th className="px-8 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {investments.flatMap(inv =>
                                                (inv.dividends || []).map((dividend: any, idx) => (
                                                    <tr key={`${inv.id}-${idx}`} className="hover:bg-gray-50/50 transition-colors">
                                                        <td className="px-8 py-5">
                                                            <p className="text-sm font-bold text-gray-900">Bond Application</p>
                                                            <p className="text-[10px] font-mono text-gray-400 mt-0.5">#{inv.id.slice(0, 8)}</p>
                                                        </td>
                                                        <td className="px-8 py-5">
                                                            <p className="text-sm font-bold text-green-600">+{formatCurrency(dividend.amount)}</p>
                                                        </td>
                                                        <td className="px-8 py-5">
                                                            <p className="text-sm font-bold text-gray-900">{dividend.bank_name || 'N/A'}</p>
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{dividend.payment_mode || 'NEFT'}</p>
                                                        </td>
                                                        <td className="px-8 py-5">
                                                            <p className="text-xs font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded inline-block">
                                                                {dividend.reference_no || 'Pending'}
                                                            </p>
                                                        </td>
                                                        <td className="px-8 py-5 text-sm text-gray-600">
                                                            {formatDate(dividend.date)}
                                                        </td>
                                                        <td className="px-8 py-5 text-right">
                                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${dividend.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                                                }`}>
                                                                {dividend.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="p-20 text-center">
                                    <Clock className="w-16 h-16 text-gray-100 mx-auto mb-4" />
                                    <p className="text-gray-400 font-medium">No dividends processed yet</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'details' && (
                        <div className="space-y-8 animate-fade-in-up">
                            {investments.length > 0 ? (
                                investments.map((investment, idx) => (
                                    <div key={investment.id} className="space-y-8">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xl font-bold text-gray-900">Agreement #{idx + 1} - <span className="text-[#1B8A9F] font-mono">{investment.id.slice(0, 8)}</span></h3>
                                        </div>
                                        <div className="grid lg:grid-cols-2 gap-8">
                                            {/* Personal Information */}
                                            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                                                <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                                                    <User className="w-5 h-5 mr-3 text-[#1B8A9F]" />
                                                    Personal Information
                                                </h4>
                                                <div className="space-y-4">
                                                    {[
                                                        { label: 'Full Name', value: investment.full_name },
                                                        { label: 'Father\'s Name', value: investment.father_name },
                                                        { label: 'Date of Birth', value: formatDate(investment.dob) },
                                                        { label: 'Age', value: investment.age },
                                                        { label: 'Gender', value: investment.gender },
                                                        { label: 'Occupation', value: investment.occupation },
                                                        { label: 'Contact', value: investment.contact_number },
                                                        { label: 'Email', value: investment.email },
                                                        { label: 'Address', value: investment.permanent_address, full: true },
                                                    ].map((item) => (
                                                        <div key={item.label} className={`flex flex-col sm:flex-row justify-between border-b border-gray-50 pb-4 ${item.full ? 'flex-col sm:items-start' : 'items-center'}`}>
                                                            <span className="text-sm text-gray-500">{item.label}</span>
                                                            <span className={`text-sm font-bold text-gray-900 ${item.full ? 'mt-2' : ''}`}>{item.value}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Nominee & Bank Information */}
                                            <div className="space-y-8">
                                                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                                                    <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                                                        <Users className="w-5 h-5 mr-3 text-orange-500" />
                                                        Nominee Details
                                                    </h4>
                                                    <div className="space-y-4">
                                                        {[
                                                            { label: 'Nominee Name', value: investment.nominee.name },
                                                            { label: 'Relation', value: investment.nominee.relation },
                                                            { label: 'Nominee DOB', value: formatDate(investment.nominee.dob) },
                                                            { label: 'Nominee Address', value: investment.nominee.address, full: true },
                                                        ].map((item) => (
                                                            <div key={item.label} className={`flex flex-col sm:flex-row justify-between border-b border-gray-50 pb-4 ${item.full ? 'flex-col sm:items-start' : 'items-center'}`}>
                                                                <span className="text-sm text-gray-500">{item.label}</span>
                                                                <span className={`text-sm font-bold text-gray-900 ${item.full ? 'mt-2' : ''}`}>{item.value}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                                                    <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                                                        <Building2 className="w-5 h-5 mr-3 text-[#4ADE80]" />
                                                        Bank Information
                                                    </h4>
                                                    <div className="space-y-4">
                                                        {[
                                                            { label: 'Bank Name', value: investment.bank_details.bankName },
                                                            { label: 'Account Number', value: investment.bank_details.accountNumber },
                                                            { label: 'Branch', value: investment.bank_details.branch },
                                                            { label: 'IFSC Code', value: investment.bank_details.ifscCode },
                                                            { label: 'MICR Code', value: investment.bank_details.micrCode },
                                                        ].map((item) => (
                                                            <div key={item.label} className="flex justify-between border-b border-gray-50 pb-4 items-center">
                                                                <span className="text-sm text-gray-500">{item.label}</span>
                                                                <span className="text-sm font-bold text-gray-900">{item.value}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Investment Specifics */}
                                            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 lg:col-span-2">
                                                <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                                                    <ShieldCheck className="w-5 h-5 mr-3 text-[#1B8A9F]" />
                                                    Investment Specifics
                                                </h4>
                                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                                    {[
                                                        { label: 'Total Investment', value: formatCurrency(investment.investment_amount) },
                                                        { label: 'Number of Shares', value: investment.number_of_shares },
                                                        { label: 'Face Value (Per Share)', value: formatCurrency(investment.face_value_per_share || 100) },
                                                        { label: 'Payment Mode', value: investment.payment_mode },
                                                        { label: 'Payment Reference', value: investment.payment_reference },
                                                        { label: 'Payment Date', value: formatDate(investment.payment_date) },
                                                        { label: 'Lock-in Period', value: `${investment.lock_in_period} Years` },
                                                        { label: 'Lock-in Start Date', value: formatDate(investment.lock_in_start_date) },
                                                        { label: 'Lock-in End Date', value: formatDate(investment.lock_in_end_date) },
                                                        { label: 'Demat Account', value: investment.demat_account || 'N/A' },
                                                        { label: 'Demat Status', value: investment.demat_credited ? 'Credited' : 'Pending' },
                                                    ].map((item) => (
                                                        <div key={item.label} className="border-b border-gray-50 pb-4">
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                                                            <p className="text-sm font-bold text-gray-900">{item.value}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        {idx < investments.length - 1 && <hr className="border-gray-100 border-2" />}
                                    </div>
                                ))
                            ) : (
                                <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-100">
                                    <p className="text-gray-400 font-medium">No application details found.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center border-t border-gray-200 mt-10">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                    © {new Date().getFullYear()} SHREEG Expert Wealth Advisory Limited • Secure Client Portal
                </p>
            </footer>
        </div>
    );
}
