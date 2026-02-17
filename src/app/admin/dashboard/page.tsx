'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
    TrendingUp,
    LogOut,
    Users,
    DollarSign,
    CheckCircle2,
    Clock,
    Lock,
    Search,
    Filter,
    Edit,
    Eye,
    Loader2,
    Briefcase,
    ArrowUpRight,
    ShieldCheck,
    ChevronRight,
    MoreHorizontal,
    Download,
    User,
    Mail,
    MessageCircle,
    X,
    Sparkles
} from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { InvestmentAgreement } from '@/components/InvestmentAgreement';
import { supabase } from '@/lib/supabase';

interface Investment {
    id: string;
    full_name: string;
    father_name?: string;
    dob?: string;
    gender?: string;
    occupation?: string;
    permanent_address?: string;
    email: string;
    contact_number?: string;
    pan_number?: string;
    aadhar_number?: string;
    marital_status?: string;
    age?: number;
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
    nominee?: any;
    bank_details?: {
        bankName: string;
        accountNumber: string;
        ifscCode: string;
        accountHolderName?: string;
        branch?: string;
    };
    dividends: Array<{
        amount: number;
        date: string;
        status: string;
        reference_no?: string;
        payment_mode?: string;
        bank_name?: string;
    }>;
    pan_url?: string;
    aadhar_url?: string;
    bank_cheque_url?: string;
    client_signature_url?: string;
    client_signed_at?: string;
    admin_signed_at?: string;
    payment_verified?: boolean;
    users?: {
        kyc_verified: boolean;
        signature_url?: string;
    };
    user_id: string;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [productFilter, setProductFilter] = useState('all');
    const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [editData, setEditData] = useState({ dividend_rate: 0, status: '' });
    const [showDividendModal, setShowDividendModal] = useState(false);
    const [dividendData, setDividendData] = useState({
        amount: '',
        bank_name: '',
        reference_no: '',
        payment_mode: 'NEFT',
        status: 'paid'
    });
    const [kycLoading, setKycLoading] = useState(false);
    const [adminSignatureUrl, setAdminSignatureUrl] = useState<string | null>(null);
    const [approving, setApproving] = useState(false);

    const handleVerifyKYC = async (userId: string, verified: boolean) => {
        if (!confirm(`Are you sure you want to ${verified ? 'verify' : 'unverify'} this client's KYC?`)) return;

        setKycLoading(true);
        try {
            const response = await fetch('/api/admin/kyc/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, verified }),
            });

            if (response.ok) {
                // Update local state
                setInvestments(prev => prev.map(inv =>
                    inv.user_id === userId ? { ...inv, users: { kyc_verified: verified } } : inv
                ));
                if (selectedInvestment && selectedInvestment.user_id === userId) {
                    setSelectedInvestment({ ...selectedInvestment, users: { kyc_verified: verified } });
                }
                alert(`KYC ${verified ? 'verified' : 'unverified'} successfully!`);
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to update KYC status');
            }
        } catch (error) {
            console.error('Error verifying KYC:', error);
            alert('An error occurred while verifying KYC');
        } finally {
            setKycLoading(false);
        }
    };
    const [activeTab, setActiveTab] = useState<'investments' | 'ledger' | 'pending_dividends'>('investments');
    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
    const [investmentLimit, setInvestmentLimit] = useState(20);
    const [ledgerLimit, setLedgerLimit] = useState(20);
    const [isEditingDividend, setIsEditingDividend] = useState(false);
    const [editDividendData, setEditDividendData] = useState<any>(null);
    const [updatingDividend, setUpdatingDividend] = useState(false);
    const [syncing, setSyncing] = useState(false);

    // Infinite Scroll Observer
    const observer = useRef<IntersectionObserver | null>(null);
    const lastElementRef = useCallback((node: HTMLDivElement | null) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                if (activeTab === 'investments') {
                    setInvestmentLimit(prev => prev + 20);
                } else {
                    setLedgerLimit(prev => prev + 20);
                }
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, activeTab]);

    // Reset limits on tab switch or search
    useEffect(() => {
        setInvestmentLimit(20);
        setLedgerLimit(20);
    }, [activeTab, searchTerm, statusFilter, productFilter]);

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                // Fallback to localStorage for metadata but redirect if no session
                const userData = localStorage.getItem('user');
                if (!userData) {
                    router.push('/login');
                    return;
                }
                const parsedUser = JSON.parse(userData);
                if (parsedUser.role !== 'admin') {
                    router.push('/login');
                    return;
                }
                setUser(parsedUser);
            } else {
                // Use session user data
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

                if (role !== 'admin') {
                    router.push('/login');
                    return;
                }

                const updatedUser = { ...session.user, ...userData, role };
                setUser(updatedUser);

                // Fetch admin signature with better error handling
                const { data: adminData, error: adminError } = await supabase
                    .from('users')
                    .select('signature_url')
                    .eq('id', session.user.id)
                    .maybeSingle();

                if (adminError) {
                    console.error('Error fetching admin signature:', adminError);
                } else if (adminData?.signature_url) {
                    setAdminSignatureUrl(adminData.signature_url);
                } else if (!adminData) {
                    // If no user record exists, create one
                    await supabase.from('users').upsert({
                        id: session.user.id,
                        email: session.user.email || '',
                        role: role,
                        name: userData.name || 'Admin',
                    });
                }

                // Update localStorage to keep it in sync
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }

            fetchAllInvestments();
        };

        checkSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                localStorage.removeItem('user');
                localStorage.removeItem('session');
                router.push('/login');
            } else {
                const userData = session.user.user_metadata;
                if (userData.role === 'admin') {
                    setUser({ ...session.user, ...userData });
                    localStorage.setItem('user', JSON.stringify({ ...session.user, ...userData }));
                }
            }
        });

        return () => subscription.unsubscribe();
    }, [router]);

    const fetchAllInvestments = async () => {
        try {
            const response = await fetch('/api/admin/investments');
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

    const handleEditInvestment = (investment: Investment) => {
        setSelectedInvestment(investment);
        setEditData({
            dividend_rate: Number(investment.dividend_rate) || 0,
            status: investment.status,
        });
        setShowEditModal(true);
    };

    const handleUpdateInvestment = async () => {
        if (!selectedInvestment) return;

        try {
            const response = await fetch(`/api/admin/investments/${selectedInvestment.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editData),
            });

            if (response.ok) {
                setShowEditModal(false);
                fetchAllInvestments();
                alert('Investment updated successfully');
            }
        } catch (error) {
            console.error('Error updating investment:', error);
            alert('Failed to update investment');
        }
    };

    const handleAddDividend = (investment: Investment) => {
        setSelectedInvestment(investment);
        setDividendData({
            amount: '',
            bank_name: '',
            reference_no: '',
            payment_mode: 'NEFT',
            status: 'paid'
        });
        setShowDividendModal(true);
    };

    const submitDividend = async () => {
        if (!selectedInvestment || !dividendData.amount) return;

        try {
            const response = await fetch(`/api/admin/investments/${selectedInvestment.id}/dividend`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...dividendData,
                    amount: parseFloat(dividendData.amount)
                }),
            });

            if (response.ok) {
                setShowDividendModal(false);
                fetchAllInvestments();
                alert('Dividend added successfully');
            }
        } catch (error) {
            console.error('Error adding dividend:', error);
            alert('Failed to add dividend');
        }
    };


    const handleUpdateDividend = async () => {
        if (!selectedTransaction || !editDividendData) return;

        setUpdatingDividend(true);
        try {
            const response = await fetch(`/api/admin/investments/${selectedTransaction.id}/dividend`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    dividendIndex: selectedTransaction.dividendIndex,
                    dividend: editDividendData
                }),
            });

            if (response.ok) {
                setIsEditingDividend(false);
                fetchAllInvestments();
                setShowTransactionModal(false);
                alert('Dividend updated successfully');
            }
        } catch (error) {
            console.error('Error updating dividend:', error);
            alert('Failed to update dividend');
        } finally {
            setUpdatingDividend(false);
        }
    };


    const handleSyncDividends = async () => {
        setSyncing(true);
        try {
            const response = await fetch('/api/admin/investments/generate-dividends', {
                method: 'POST',
            });
            const data = await response.json();
            if (response.ok) {
                alert(`Sync complete! Generated dividends for ${data.updatedCount} investments.`);
                fetchAllInvestments();
            } else {
                alert(data.error || 'Failed to sync dividends');
            }
        } catch (error) {
            console.error('Sync Error:', error);
            alert('An error occurred during sync');
        } finally {
            setSyncing(false);
        }
    };



    const products = Array.from(new Set(investments.map(inv => inv.product_name || 'SHREEG ASSET')));

    const filteredInvestments = investments.filter(inv => {
        const matchesSearch = (inv.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (inv.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (inv.product_name || 'SHREEG ASSET').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
        const matchesProduct = productFilter === 'all' || (inv.product_name || 'SHREEG ASSET') === productFilter;
        return matchesSearch && matchesStatus && matchesProduct;
    });

    const calculateStats = () => {
        const totalInvestment = investments.reduce((sum, inv) => sum + Number(inv.investment_amount), 0);
        const totalClients = new Set(investments.map(inv => inv.email)).size;
        const activeInvestmentsCount = investments.filter(inv => inv.status === 'active').length;
        const totalDividendsPaid = investments.reduce((sum, inv) => {
            return sum + (inv.dividends || [])
                .filter(d => d.status === 'paid')
                .reduce((dSum, d) => dSum + d.amount, 0);
        }, 0);

        return { totalInvestment, totalClients, activeInvestmentsCount, totalDividendsPaid };
    };

    const stats = calculateStats();

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

    const getLedgerData = () => {
        const ledger: any[] = [];

        investments.forEach(inv => {
            ledger.push({
                id: inv.id,
                date: inv.payment_date,
                client: inv.full_name,
                email: inv.email,
                type: 'CREDIT',
                description: `Investment: ${inv.product_name || 'SHREEG ASSET'}`,
                amount: inv.investment_amount,
                bank: inv.bank_details?.bankName || 'N/A',
                account_number: inv.bank_details?.accountNumber || 'N/A',
                ifsc: inv.bank_details?.ifscCode || 'N/A',
                payment_mode: inv.payment_mode,
                reference: inv.payment_reference,
                lock_in_period: inv.lock_in_period,
                lock_in_start_date: inv.lock_in_start_date,
                lock_in_end_date: inv.lock_in_end_date,
                shares: inv.number_of_shares,
                face_value: inv.face_value_per_share,
                status: inv.status
            });

            // Add each dividend as outflow (debit)
            (inv.dividends || []).forEach((div, idx) => {
                ledger.push({
                    id: inv.id,
                    dividendIndex: idx,
                    date: div.date,
                    client: inv.full_name,
                    email: inv.email,
                    type: 'DEBIT',
                    description: `Dividend Payout`,
                    amount: div.amount,
                    bank: div.bank_name || 'N/A',
                    payment_mode: div.payment_mode || 'N/A',
                    reference: div.reference_no || 'N/A',
                    dividend_rate: inv.dividend_rate,
                    status: div.status
                });
            });
        });

        // Filter based on active tab
        const filteredLedger = ledger.filter(item => {
            if (activeTab === 'pending_dividends') {
                return (item.type === 'DEBIT' && item.status === 'pending');
            } else if (activeTab === 'ledger') {
                return (item.type === 'DEBIT' ? item.status === 'paid' : true);
            }
            return true;
        });

        // Sort by date descending
        return filteredLedger.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    };

    const downloadLedgerCSV = () => {
        const data = getLedgerData();
        const headers = ['Date', 'Client', 'Type', 'Description', 'Amount', 'Bank', 'Mode', 'Reference', 'Status'];
        const csvContent = [
            headers.join(','),
            ...data.map(item => [
                item.date,
                `"${item.client}"`,
                item.type,
                `"${item.description}"`,
                item.amount,
                `"${item.bank}"`,
                item.payment_mode,
                `"${item.reference}"`,
                item.status
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `SHREEG_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#1B8A9F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500 font-medium">Loading admin panel...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Header */}
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
                                <span className="text-[10px] font-black text-[#1B8A9F] uppercase tracking-widest bg-teal-50 px-2 py-1 rounded">Admin Engine</span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-6">
                            <Link
                                href="/admin/profile"
                                className="flex flex-col items-end group"
                            >
                                <p className="text-sm font-bold text-gray-900 group-hover:text-[#1B8A9F] transition-colors">{user?.name}</p>
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-tighter flex items-center group-hover:text-[#1B8A9F] transition-colors">
                                    <User className="w-3 h-3 mr-1" />
                                    Account Settings
                                </p>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
                    <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center text-[#1B8A9F]">
                                <Briefcase className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">AUM</span>
                        </div>
                        <p className="text-2xl md:text-3xl font-black text-gray-900">{formatCurrency(stats.totalInvestment)}</p>
                        <p className="text-xs text-gray-400 mt-1 font-medium italic">Total Assets Under Management</p>
                    </div>

                    <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-[#4ADE80]">
                                <Users className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Clients</span>
                        </div>
                        <p className="text-2xl md:text-3xl font-black text-gray-900">{stats.totalClients}</p>
                        <p className="text-xs text-gray-400 mt-1 font-medium italic">Verified Investors</p>
                    </div>

                    <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-500">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active</span>
                        </div>
                        <p className="text-2xl md:text-3xl font-black text-gray-900">{stats.activeInvestmentsCount}</p>
                        <p className="text-xs text-gray-400 mt-1 font-medium italic">Running Agreements</p>
                    </div>

                    <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-500">
                                <DollarSign className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Payouts</span>
                        </div>
                        <p className="text-2xl md:text-3xl font-black text-gray-900">{formatCurrency(stats.totalDividendsPaid)}</p>
                        <p className="text-xs text-gray-400 mt-1 font-medium italic">Total Dividends Credited</p>
                    </div>
                </div>

                {/* Tab Switcher */}
                <div className="flex items-center space-x-2 mb-6 bg-gray-100 p-1.5 rounded-2xl w-fit">
                    <button
                        onClick={() => setActiveTab('investments')}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'investments'
                            ? 'bg-white text-[#1B8A9F] shadow-sm'
                            : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        Investments
                    </button>
                    <button
                        onClick={() => setActiveTab('ledger')}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'ledger'
                            ? 'bg-white text-[#1B8A9F] shadow-sm'
                            : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        Financial Ledger
                    </button>
                    <button
                        onClick={() => setActiveTab('pending_dividends')}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'pending_dividends'
                            ? 'bg-white text-[#1B8A9F] shadow-sm'
                            : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        Pending Payouts
                    </button>
                </div>

                {/* Management Section */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 border-b border-gray-100">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                                    {activeTab === 'investments'
                                        ? 'Investment Management'
                                        : activeTab === 'pending_dividends'
                                            ? 'Pending Dividend Payouts'
                                            : 'Global Financial Ledger'}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1 font-medium">
                                    {activeTab === 'investments'
                                        ? 'Verify applications and manage dividend payouts'
                                        : activeTab === 'pending_dividends'
                                            ? 'Track and manage dividends awaiting payment'
                                            : 'Chronological log of all debits and credits'}
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                {(activeTab === 'ledger' || activeTab === 'pending_dividends') && (
                                    <>
                                        <button
                                            onClick={handleSyncDividends}
                                            disabled={syncing}
                                            className="inline-flex items-center justify-center bg-[#1B8A9F] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#156d7d] transition-all disabled:opacity-50"
                                        >
                                            {syncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                                            Sync Dividends
                                        </button>
                                        <button
                                            onClick={downloadLedgerCSV}
                                            className="inline-flex items-center justify-center bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-gray-800 transition-all"
                                        >
                                            <Download className="w-4 h-4 mr-2" />
                                            Export CSV
                                        </button>
                                    </>
                                )}
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search clients..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="bg-gray-50 border-none rounded-xl pl-12 pr-6 py-3 text-sm focus:ring-2 focus:ring-teal-100 transition-all w-full sm:w-64"
                                    />
                                </div>
                                {activeTab === 'investments' && (
                                    <>
                                        <div className="relative">
                                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <select
                                                value={productFilter}
                                                onChange={(e) => setProductFilter(e.target.value)}
                                                className="bg-gray-50 border-none rounded-xl pl-12 pr-10 py-3 text-sm focus:ring-2 focus:ring-teal-100 transition-all appearance-none w-full"
                                            >
                                                <option value="all">All Products</option>
                                                {products.map(p => (
                                                    <option key={p} value={p}>{p}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="relative">
                                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <select
                                                value={statusFilter}
                                                onChange={(e) => setStatusFilter(e.target.value)}
                                                className="bg-gray-50 border-none rounded-xl pl-12 pr-10 py-3 text-sm focus:ring-2 focus:ring-teal-100 transition-all appearance-none w-full"
                                            >
                                                <option value="all">All States</option>
                                                <option value="pending">Pending Review</option>
                                                <option value="approved">Approved</option>
                                                <option value="active">Active/Bonded</option>
                                                <option value="matured">Matured</option>
                                            </select>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        {activeTab === 'investments' ? (
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Client / Contact</th>
                                        <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Position</th>
                                        <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Yield %</th>
                                        <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                        <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Maturity</th>
                                        <th className="px-8 py-5 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredInvestments.slice(0, investmentLimit).map((investment) => (
                                        <tr key={investment.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <button
                                                    onClick={async () => {
                                                        setSelectedInvestment(investment);
                                                        setShowViewModal(true);
                                                        // Ensure admin signature is fresh
                                                        if (!adminSignatureUrl) {
                                                            const { data } = await supabase
                                                                .from('users')
                                                                .select('signature_url')
                                                                .eq('id', user?.id)
                                                                .maybeSingle();
                                                            if (data?.signature_url) {
                                                                setAdminSignatureUrl(data.signature_url);
                                                            }
                                                        }
                                                    }}
                                                    className="text-sm font-bold text-gray-900 leading-none hover:text-[#1B8A9F] transition-colors text-left"
                                                >
                                                    {investment.full_name}
                                                </button>
                                                <p className="text-[10px] text-[#1B8A9F] font-black uppercase tracking-widest mt-1.5">{investment.product_name || 'SHREEG ASSET'}</p>
                                                <p className="text-xs text-gray-400 mt-1 flex items-center">
                                                    <Mail className="w-3 h-3 mr-1" />
                                                    {investment.email}
                                                </p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-bold text-gray-900 leading-none">{formatCurrency(investment.investment_amount)}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1.5">{investment.number_of_shares} Units</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center">
                                                    <span className="text-sm font-bold text-teal-600">{investment.dividend_rate}%</span>
                                                    <ArrowUpRight className="w-3 h-3 ml-1 text-teal-300" />
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${investment.status === 'active' ? 'bg-green-100 text-green-700' :
                                                    investment.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                                                        'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {investment.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-medium text-gray-900">{formatDate(investment.lock_in_end_date)}</p>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button
                                                        onClick={() => handleEditInvestment(investment)}
                                                        className="p-2.5 bg-gray-50 text-gray-400 hover:text-[#1B8A9F] hover:bg-teal-50 rounded-xl transition-all"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleAddDividend(investment)}
                                                        className="p-2.5 bg-gray-50 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-xl transition-all"
                                                        title="Add Dividend"
                                                    >
                                                        <DollarSign className="w-4 h-4" />
                                                    </button>
                                                    {investment.contact_number && (
                                                        <a
                                                            href={`https://wa.me/${investment.contact_number.replace(/\D/g, '')}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2.5 bg-gray-50 text-gray-400 hover:text-[#25D366] hover:bg-green-50 rounded-xl transition-all"
                                                            title="WhatsApp Connection"
                                                        >
                                                            <MessageCircle className="w-4 h-4" />
                                                        </a>
                                                    )}
                                                    {((investment.status === 'approved' || investment.status === 'active') &&
                                                        investment.payment_verified &&
                                                        investment.client_signature_url &&
                                                        investment.admin_signed_at &&
                                                        adminSignatureUrl) ? (
                                                        <PDFDownloadLink
                                                            document={<InvestmentAgreement data={{ ...investment, admin_signature_url: adminSignatureUrl }} />}
                                                            fileName={`Agreement_${investment.id.slice(0, 8)}.pdf`}
                                                            className="p-2.5 bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                                                        >
                                                            {({ loading }) => (
                                                                loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />
                                                            )}
                                                        </PDFDownloadLink>
                                                    ) : (
                                                        <button
                                                            disabled
                                                            className="p-2.5 bg-gray-50 text-gray-200 rounded-xl cursor-not-allowed"
                                                            title={!(investment.status === 'approved' || investment.status === 'active') ? "Agreement pending approval" :
                                                                !investment.payment_verified ? "Pending payment verification" :
                                                                    !investment.client_signature_url ? "Client signature pending" :
                                                                        "Admin signature pending"}
                                                        >
                                                            <Lock className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                                        <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Client</th>
                                        <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type</th>
                                        <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Bank</th>
                                        <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mode</th>
                                        <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                                        <th className="px-8 py-5 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Reference</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {getLedgerData().filter(item => {
                                        const matchesSearch = item.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                            item.reference.toLowerCase().includes(searchTerm.toLowerCase());
                                        const matchesTab = activeTab === 'pending_dividends'
                                            ? (item.type === 'DEBIT' && item.status === 'pending')
                                            : (item.type === 'DEBIT' ? item.status === 'paid' : true);
                                        return matchesSearch && matchesTab;
                                    }).slice(0, ledgerLimit).map((item, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-8 py-6 text-sm font-medium text-gray-600">
                                                {formatDate(item.date)}
                                            </td>
                                            <td className="px-8 py-6">
                                                <button
                                                    onClick={() => {
                                                        setSelectedTransaction(item);
                                                        setShowTransactionModal(true);
                                                    }}
                                                    className="text-sm font-black text-gray-900 hover:text-[#1B8A9F] transition-colors text-left"
                                                >
                                                    {item.client}
                                                </button>
                                                <p className="text-[10px] text-gray-400 font-medium">{item.email}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${item.type === 'CREDIT'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {item.type}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-[10px] text-gray-500 font-bold uppercase">
                                                {item.bank}
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[9px] font-black uppercase">
                                                    {item.payment_mode}
                                                </span>
                                            </td>
                                            <td className={`px-8 py-6 text-sm font-black ${item.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                {item.type === 'CREDIT' ? '+' : '-'}{formatCurrency(item.amount)}
                                            </td>
                                            <td className="px-8 py-6 text-right font-mono text-[10px] text-gray-400 font-bold uppercase">
                                                {item.reference}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        <div ref={lastElementRef} className="h-4 w-full" />
                    </div>

                    {(activeTab === 'investments' ? filteredInvestments.length : getLedgerData().length) === 0 && (
                        <div className="p-20 text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-gray-200" />
                            </div>
                            <p className="text-gray-400 font-medium">No results found for your search/filter</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            {/* Investor Details Modal */}
            {showViewModal && selectedInvestment && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-3xl shadow-2xl p-0 max-w-2xl w-full border border-gray-100 animate-fade-in-up overflow-hidden max-h-[90vh] flex flex-col">
                        {/* Header */}
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                            <div className="flex items-center space-x-4">
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">Investor Profile</h3>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <p className="text-[10px] text-[#1B8A9F] font-bold uppercase tracking-[0.2em]">Comprehensive Portfolio View</p>
                                        {selectedInvestment.users?.kyc_verified && (
                                            <span className="flex items-center px-2 py-0.5 bg-green-50 text-green-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-green-100">
                                                <ShieldCheck className="w-3 h-3 mr-1" />
                                                KYC Verified
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setShowViewModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
                                <X className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
                            {/* Personal Info */}
                            <section>
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                                    <div className="w-1.5 h-1.5 bg-[#1B8A9F] rounded-full mr-2"></div>
                                    Personal & Contact Information
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                    <div>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Full Legal Name</p>
                                        <p className="text-sm font-black text-gray-900">{selectedInvestment.full_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Father's Name</p>
                                        <p className="text-sm font-bold text-gray-900">{selectedInvestment.father_name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Date of Birth</p>
                                        <p className="text-sm font-bold text-gray-900">{formatDate(selectedInvestment.dob || '')}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Gender / Age</p>
                                        <p className="text-sm font-bold text-gray-900">{selectedInvestment.gender || 'N/A'} {selectedInvestment.age ? `(${selectedInvestment.age} yrs)` : ''}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Email Address</p>
                                        <p className="text-sm font-bold text-[#1B8A9F]">{selectedInvestment.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Contact Number</p>
                                        <p className="text-sm font-bold text-gray-900">{selectedInvestment.contact_number || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">PAN Number</p>
                                        <p className="text-sm font-bold text-gray-900 uppercase font-mono">{selectedInvestment.pan_number || 'Not Provided'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Aadhaar Number</p>
                                        <p className="text-sm font-bold text-gray-900 font-mono">{selectedInvestment.aadhar_number || 'Not Provided'}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Permanent Address</p>
                                        <p className="text-sm font-medium text-gray-700">{selectedInvestment.permanent_address || 'N/A'}</p>
                                    </div>
                                </div>
                            </section>

                            {/* Investment Details */}
                            <section>
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                                    Investment & Position
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 bg-white border-2 border-green-50 rounded-2xl p-6">
                                    <div>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Principal Amount</p>
                                        <p className="text-sm font-black text-green-600">{formatCurrency(selectedInvestment.investment_amount)}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Units (Shares)</p>
                                        <p className="text-sm font-bold text-gray-900">{selectedInvestment.number_of_shares}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Face Value / Unit</p>
                                        <p className="text-sm font-bold text-gray-900">₹{selectedInvestment.face_value_per_share}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Yield Rate</p>
                                        <p className="text-sm font-black text-teal-600">{selectedInvestment.dividend_rate}% <span className="text-[9px] font-medium text-gray-400 ml-1">PA</span></p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Lock-in Period</p>
                                        <p className="text-sm font-bold text-gray-900">{selectedInvestment.lock_in_period} Months</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Maturity Date</p>
                                        <p className="text-sm font-bold text-orange-600">{formatDate(selectedInvestment.lock_in_end_date)}</p>
                                    </div>
                                </div>
                            </section>

                            {/* Bank Details */}
                            <section>
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                                    Settlement Account details
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-blue-50/30 rounded-2xl p-6 border border-blue-50">
                                    <div>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Bank Name</p>
                                        <p className="text-sm font-bold text-gray-900">{selectedInvestment.bank_details?.bankName || 'N/A'}</p>
                                    </div>
                                    <div className="md:col-span-1">
                                        <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Account Number</p>
                                        <p className="text-sm font-mono font-bold text-gray-900">{selectedInvestment.bank_details?.accountNumber || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">IFSC Code</p>
                                        <p className="text-sm font-bold text-gray-900 uppercase">{selectedInvestment.bank_details?.ifscCode || 'N/A'}</p>
                                    </div>
                                </div>
                            </section>

                            {/* Nominee Details */}
                            {selectedInvestment.nominee && (
                                <section>
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></div>
                                        Nominee / Beneficiary Details
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-purple-50/30 rounded-2xl p-6 border border-purple-50">
                                        <div>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Nominee Name</p>
                                            <p className="text-sm font-bold text-gray-900">{selectedInvestment.nominee.name || selectedInvestment.nominee.fullName || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Relationship</p>
                                            <p className="text-sm font-bold text-gray-900">{selectedInvestment.nominee.relation || selectedInvestment.nominee.relationship || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Nominee DOB</p>
                                            <p className="text-sm font-bold text-gray-900">{formatDate(selectedInvestment.nominee.dob || '')}</p>
                                        </div>
                                        <div className="md:col-span-3">
                                            <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Nominee Address</p>
                                            <p className="text-sm font-medium text-gray-700">{selectedInvestment.nominee.address || 'N/A'}</p>
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* Documents */}
                            <section>
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></div>
                                    Physical Document Verifications
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {selectedInvestment.pan_url ? (
                                        <a
                                            href={selectedInvestment.pan_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex flex-col items-center justify-center p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-teal-50 hover:border-teal-100 transition-all group"
                                        >
                                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mb-2 group-hover:text-[#1B8A9F]">
                                                <Eye className="w-5 h-5" />
                                            </div>
                                            <p className="text-[10px] font-black uppercase text-gray-400 group-hover:text-[#1B8A9F]">View PAN Card</p>
                                        </a>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center p-4 bg-gray-50 border border-gray-100 rounded-2xl opacity-50">
                                            <p className="text-[10px] font-black uppercase text-gray-400">PAN Not Uploaded</p>
                                        </div>
                                    )}

                                    {selectedInvestment.aadhar_url ? (
                                        <a
                                            href={selectedInvestment.aadhar_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex flex-col items-center justify-center p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-teal-50 hover:border-teal-100 transition-all group"
                                        >
                                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mb-2 group-hover:text-[#1B8A9F]">
                                                <Eye className="w-5 h-5" />
                                            </div>
                                            <p className="text-[10px] font-black uppercase text-gray-400 group-hover:text-[#1B8A9F]">View Aadhaar</p>
                                        </a>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center p-4 bg-gray-50 border border-gray-100 rounded-2xl opacity-50">
                                            <p className="text-[10px] font-black uppercase text-gray-400">Aadhaar Not Uploaded</p>
                                        </div>
                                    )}

                                    {selectedInvestment.bank_cheque_url ? (
                                        <a
                                            href={selectedInvestment.bank_cheque_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex flex-col items-center justify-center p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-teal-50 hover:border-teal-100 transition-all group"
                                        >
                                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mb-2 group-hover:text-[#1B8A9F]">
                                                <Eye className="w-5 h-5" />
                                            </div>
                                            <p className="text-[10px] font-black uppercase text-gray-400 group-hover:text-[#1B8A9F]">View Cheque</p>
                                        </a>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center p-4 bg-gray-50 border border-gray-100 rounded-2xl opacity-50">
                                            <p className="text-[10px] font-black uppercase text-gray-400">Cheque Not Uploaded</p>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Signatures & Approval */}
                            <section className="bg-teal-50/50 rounded-3xl p-8 border border-teal-100 flex flex-col md:flex-row gap-8">
                                <div className="flex-1">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center">
                                        <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2"></div>
                                        Client Signature
                                    </h4>
                                    {selectedInvestment.client_signature_url ? (
                                        <div className="bg-white rounded-2xl p-4 border border-teal-100/50 shadow-sm inline-block">
                                            <img
                                                src={selectedInvestment.client_signature_url}
                                                alt="Client Signature"
                                                className="h-20 w-auto object-contain"
                                            />
                                            <p className="text-[9px] font-bold text-gray-400 mt-2 text-center uppercase tracking-wider">
                                                Signed on {formatDate(selectedInvestment.client_signed_at || '')}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="p-6 bg-white/50 border-2 border-dashed border-teal-200 rounded-2xl flex items-center justify-center">
                                            <p className="text-xs font-bold text-teal-600/50 italic">Signature Pending</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center">
                                        <div className="w-1.5 h-1.5 bg-[#1B8A9F] rounded-full mr-2"></div>
                                        Admin Approval Status
                                    </h4>
                                    <div className="space-y-4">
                                        <button
                                            onClick={async () => {
                                                const newStatus = !selectedInvestment.payment_verified;
                                                const { error } = await supabase
                                                    .from('investments')
                                                    .update({ payment_verified: newStatus })
                                                    .eq('id', selectedInvestment.id);

                                                if (!error) {
                                                    setSelectedInvestment({ ...selectedInvestment, payment_verified: newStatus });
                                                    setInvestments(prev => prev.map(inv =>
                                                        inv.id === selectedInvestment.id ? { ...inv, payment_verified: newStatus } : inv
                                                    ));
                                                }
                                            }}
                                            className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between group ${selectedInvestment.payment_verified
                                                ? 'bg-green-50 border-green-200 text-green-700'
                                                : 'bg-white border-gray-100 text-gray-400 hover:border-teal-200'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${selectedInvestment.payment_verified ? 'bg-green-200 text-green-700' : 'bg-gray-100 text-gray-400 group-hover:bg-teal-50 group-hover:text-teal-600'
                                                    }`}>
                                                    <DollarSign className="w-4 h-4" />
                                                </div>
                                                <span className="text-xs font-bold uppercase tracking-wider">Payment Verified</span>
                                            </div>
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedInvestment.payment_verified ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-200'
                                                }`}>
                                                {selectedInvestment.payment_verified && <CheckCircle2 className="w-3.5 h-3.5" />}
                                            </div>
                                        </button>

                                        {!selectedInvestment.admin_signed_at ? (
                                            <button
                                                disabled={!selectedInvestment.payment_verified || !adminSignatureUrl || approving}
                                                onClick={async () => {
                                                    setApproving(true);
                                                    try {
                                                        const { error } = await supabase
                                                            .from('investments')
                                                            .update({
                                                                admin_signed_at: new Date().toISOString(),
                                                                status: 'approved'
                                                            })
                                                            .eq('id', selectedInvestment.id);

                                                        if (error) throw error;

                                                        const updated = {
                                                            ...selectedInvestment,
                                                            admin_signed_at: new Date().toISOString(),
                                                            status: 'approved'
                                                        };
                                                        setSelectedInvestment(updated);
                                                        setInvestments(prev => prev.map(inv =>
                                                            inv.id === selectedInvestment.id ? updated : inv
                                                        ));
                                                    } catch (err) {
                                                        console.error(err);
                                                        alert('Approval failed');
                                                    } finally {
                                                        setApproving(false);
                                                    }
                                                }}
                                                className="w-full bg-[#1B8A9F] text-white p-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-teal-100 hover:bg-[#156d7d] transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3"
                                            >
                                                {approving ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                                                Confirm & Digitally Sign
                                            </button>
                                        ) : (
                                            <div className="bg-white rounded-2xl p-4 border border-teal-200 shadow-sm flex items-center justify-between">
                                                <div className="flex flex-col">
                                                    <span className="text-[8px] font-black text-[#1B8A9F] uppercase tracking-[0.2em] mb-1">Approved & Signed</span>
                                                    <p className="text-[10px] font-bold text-gray-500">{formatDate(selectedInvestment.admin_signed_at)}</p>
                                                </div>
                                                <img
                                                    src={adminSignatureUrl || ''}
                                                    alt="Admin Signature"
                                                    className="h-10 w-auto opacity-80"
                                                />
                                            </div>
                                        )}

                                        {!adminSignatureUrl && !selectedInvestment.admin_signed_at && (
                                            <p className="text-[10px] text-red-500 font-bold text-center animate-pulse">
                                                Please set your signature in Profile Settings first.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Footer */}
                        <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between sticky bottom-0 z-10">
                            <div className="flex items-center space-x-2">
                                <span className={`w-2 h-2 rounded-full ${selectedInvestment.status === 'active' ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                                <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">{selectedInvestment.status}</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                {selectedInvestment.users?.kyc_verified ? (
                                    <button
                                        onClick={() => handleVerifyKYC(selectedInvestment.user_id, false)}
                                        disabled={kycLoading}
                                        className="px-6 py-2.5 bg-red-50 border-2 border-red-100 rounded-xl text-[10px] font-black text-red-600 hover:bg-red-100 transition-all uppercase tracking-widest flex items-center"
                                    >
                                        {kycLoading ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <X className="w-3 h-3 mr-2" />}
                                        Unverify KYC
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleVerifyKYC(selectedInvestment.user_id, true)}
                                        disabled={kycLoading}
                                        className="px-6 py-2.5 bg-green-50 border-2 border-green-100 rounded-xl text-[10px] font-black text-green-600 hover:bg-green-100 transition-all uppercase tracking-widest flex items-center"
                                    >
                                        {kycLoading ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <ShieldCheck className="w-3 h-3 mr-2" />}
                                        Verify KYC
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        setShowViewModal(false);
                                        handleEditInvestment(selectedInvestment);
                                    }}
                                    className="px-6 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-[10px] font-black text-gray-900 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all uppercase tracking-widest"
                                >
                                    Quick Edit
                                </button>
                                <button
                                    onClick={() => setShowViewModal(false)}
                                    className="px-6 py-2.5 bg-[#1B8A9F] rounded-xl text-[10px] font-black text-white hover:bg-[#156d7d] transition-all uppercase tracking-widest shadow-lg shadow-teal-100"
                                >
                                    Dismiss Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {
                showEditModal && selectedInvestment && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border border-gray-100 animate-fade-in-up">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Modify Application</h3>
                                <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-900">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-6 mb-8">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Investor Name</label>
                                        <div className="p-4 bg-gray-50 rounded-xl text-sm font-bold text-gray-900 border border-gray-100">
                                            {selectedInvestment!.full_name}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Product</label>
                                        <div className="p-4 bg-teal-50 rounded-xl text-[10px] font-black text-[#1B8A9F] border border-teal-100 uppercase tracking-widest">
                                            {selectedInvestment!.product_name || 'N/A'}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Broker Attribution</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase">Broker ID</p>
                                            <p className="text-xs font-bold text-gray-900">{selectedInvestment!.broker_id || 'Direct'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase">Broker Name</p>
                                            <p className="text-xs font-bold text-gray-900">{selectedInvestment!.broker_name || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                                    <p className="text-[10px] font-black text-red-400 uppercase tracking-[0.2em] mb-3 flex items-center">
                                        <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                                        Verification Documents
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedInvestment.pan_url && (
                                            <a href={selectedInvestment.pan_url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-white border border-red-200 rounded-lg text-[10px] font-bold text-red-600 hover:bg-red-50 transition-all flex items-center">
                                                <Eye className="w-3 h-3 mr-1" /> PAN
                                            </a>
                                        )}
                                        {selectedInvestment.aadhar_url && (
                                            <a href={selectedInvestment.aadhar_url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-white border border-red-200 rounded-lg text-[10px] font-bold text-red-600 hover:bg-red-50 transition-all flex items-center">
                                                <Eye className="w-3 h-3 mr-1" /> Aadhaar
                                            </a>
                                        )}
                                        {selectedInvestment.bank_cheque_url && (
                                            <a href={selectedInvestment.bank_cheque_url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-white border border-red-200 rounded-lg text-[10px] font-bold text-red-600 hover:bg-red-50 transition-all flex items-center">
                                                <Eye className="w-3 h-3 mr-1" /> Cheque
                                            </a>
                                        )}
                                        {!selectedInvestment.pan_url && !selectedInvestment.aadhar_url && !selectedInvestment.bank_cheque_url && (
                                            <p className="text-[10px] text-red-400 font-bold italic">No documents uploaded for verification</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Dividend Yield (%)</label>
                                        <input
                                            type="number"
                                            value={isNaN(editData.dividend_rate) ? '' : editData.dividend_rate}
                                            onChange={(e) => {
                                                const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                                                setEditData(prev => ({ ...prev, dividend_rate: val }));
                                            }}
                                            className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#1B8A9F] outline-none transition-all"
                                            step="0.1"
                                            min="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Agreement Status</label>
                                        <select
                                            value={editData.status}
                                            onChange={(e) => setEditData(prev => ({ ...prev, status: e.target.value }))}
                                            className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#1B8A9F] outline-none transition-all appearance-none"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="approved">Approved</option>
                                            <option value="active">Active</option>
                                            <option value="matured">Matured</option>
                                            <option value="bought_back">Liquidated</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleUpdateInvestment}
                                    className="w-full bg-[#1B8A9F] text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-teal-100 hover:bg-[#156d7d] transition-all"
                                >
                                    Guard Changes
                                </button>
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="w-full bg-gray-50 text-gray-500 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all"
                                >
                                    Discard
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Add Dividend Modal */}
            {
                showDividendModal && selectedInvestment && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border border-gray-100 animate-fade-in-up">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">Post Dividend</h3>
                                    <p className="text-xs text-gray-500 mt-1">Crediting returns for {selectedInvestment!.full_name}</p>
                                </div>
                                <button onClick={() => setShowDividendModal(false)} className="text-gray-400 hover:text-gray-900">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Amount (₹)</label>
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            value={dividendData.amount}
                                            onChange={(e) => setDividendData({ ...dividendData, amount: e.target.value })}
                                            className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#1B8A9F] outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Payment Mode</label>
                                        <select
                                            value={dividendData.payment_mode}
                                            onChange={(e) => setDividendData({ ...dividendData, payment_mode: e.target.value })}
                                            className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#1B8A9F] outline-none transition-all appearance-none"
                                        >
                                            <option value="NEFT">NEFT</option>
                                            <option value="IMPS">IMPS</option>
                                            <option value="RTGS">RTGS</option>
                                            <option value="UPI">UPI</option>
                                            <option value="CHECK">CHECK</option>
                                            <option value="CASH">CASH</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Reference Number / UTR</label>
                                    <input
                                        type="text"
                                        placeholder="Enter transaction ref..."
                                        value={dividendData.reference_no}
                                        onChange={(e) => setDividendData({ ...dividendData, reference_no: e.target.value })}
                                        className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#1B8A9F] outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Payout Bank Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. HDFC Bank"
                                        value={dividendData.bank_name}
                                        onChange={(e) => setDividendData({ ...dividendData, bank_name: e.target.value })}
                                        className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#1B8A9F] outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Payout Status</label>
                                    <select
                                        value={dividendData.status}
                                        onChange={(e) => setDividendData({ ...dividendData, status: e.target.value })}
                                        className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#4ADE80] outline-none transition-all appearance-none"
                                    >
                                        <option value="paid">Mark as Paid</option>
                                        <option value="pending">Mark as Pending</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={submitDividend}
                                    className="w-full bg-[#1B8A9F] text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-teal-100 hover:bg-[#156d7d] transition-all"
                                >
                                    Confirm Credit
                                </button>
                                <button
                                    onClick={() => setShowDividendModal(false)}
                                    className="w-full bg-gray-50 text-gray-500 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center border-t border-gray-200 mt-10">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
                    SHREEG Admin Engine v4.0 • Enterprise Wealth Management Systems
                </p>
            </footer>
            {/* Transaction Detail Modal */}
            {
                showTransactionModal && selectedTransaction && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
                        <div className="bg-white rounded-3xl shadow-2xl p-0 max-w-2xl w-full border border-gray-100 animate-fade-in-up overflow-hidden">
                            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                <div>
                                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest mb-2 inline-block ${selectedTransaction.type === 'CREDIT' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {selectedTransaction.type === 'CREDIT' ? 'Investment Entry' : 'Dividend Payout'}
                                    </span>
                                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">{selectedTransaction.client}</h3>
                                    <p className="text-sm text-gray-500 font-medium">{selectedTransaction.email}</p>
                                </div>
                                <button onClick={() => { setShowTransactionModal(false); setIsEditingDividend(false); }} className="w-10 h-10 bg-white shadow-sm border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-8 max-h-[70vh] overflow-y-auto">
                                {isEditingDividend ? (
                                    <div className="space-y-6 animate-fade-in-up">
                                        <h4 className="text-sm font-black uppercase tracking-widest text-[#1B8A9F]">Edit Dividend Details</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Amount (₹)</label>
                                                <input
                                                    type="number"
                                                    value={editDividendData.amount}
                                                    onChange={(e) => setEditDividendData({ ...editDividendData, amount: parseFloat(e.target.value) })}
                                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#1B8A9F] outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Status</label>
                                                <select
                                                    value={editDividendData.status}
                                                    onChange={(e) => setEditDividendData({ ...editDividendData, status: e.target.value })}
                                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#1B8A9F] outline-none"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="paid">Paid</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Bank Name</label>
                                                <input
                                                    type="text"
                                                    value={editDividendData.bank_name}
                                                    onChange={(e) => setEditDividendData({ ...editDividendData, bank_name: e.target.value })}
                                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#1B8A9F] outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Payment Mode</label>
                                                <select
                                                    value={editDividendData.payment_mode}
                                                    onChange={(e) => setEditDividendData({ ...editDividendData, payment_mode: e.target.value })}
                                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#1B8A9F] outline-none"
                                                >
                                                    <option value="NEFT">NEFT</option>
                                                    <option value="IMPS">IMPS</option>
                                                    <option value="RTGS">RTGS</option>
                                                    <option value="UPI">UPI</option>
                                                    <option value="CHEQUE">CHEQUE</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Reference / UTR No.</label>
                                            <input
                                                type="text"
                                                value={editDividendData.reference_no}
                                                onChange={(e) => setEditDividendData({ ...editDividendData, reference_no: e.target.value })}
                                                className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#1B8A9F] outline-none"
                                                placeholder="Enter UTR or Reference number"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-2 gap-8 mb-8">
                                            <div className="space-y-6">
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Transaction Date</p>
                                                    <div className="flex items-center space-x-2">
                                                        <Clock className="w-4 h-4 text-[#1B8A9F]" />
                                                        <p className="text-sm font-black text-gray-900">{formatDate(selectedTransaction.date)}</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Amount</p>
                                                    <p className={`text-2xl font-black ${selectedTransaction.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                                                        {selectedTransaction.type === 'CREDIT' ? '+' : '-'}{formatCurrency(selectedTransaction.amount)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Payment Mode</p>
                                                    <span className="px-3 py-1 bg-gray-100 text-gray-900 rounded-lg text-xs font-black uppercase tracking-wider border border-gray-200">
                                                        {selectedTransaction.payment_mode}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Banking Information</p>
                                                    <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-100">
                                                        <p className="text-xs font-black text-[#1B8A9F] uppercase mb-1">{selectedTransaction.bank}</p>
                                                        {selectedTransaction.type === 'CREDIT' && (
                                                            <>
                                                                <p className="text-[10px] text-gray-600 font-mono">A/C: {selectedTransaction.account_number}</p>
                                                                <p className="text-[10px] text-gray-600 font-mono">IFSC: {selectedTransaction.ifsc}</p>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Reference / UTR</p>
                                                    <p className="text-xs font-mono text-gray-900 font-bold bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 break-all">
                                                        {selectedTransaction.reference}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-6 bg-gray-900 rounded-3xl text-white">
                                            <div className="flex items-center justify-between mb-4">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Structure Metadata</p>
                                                <ShieldCheck className="w-4 h-4 text-teal-400" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                                {selectedTransaction.type === 'CREDIT' ? (
                                                    <>
                                                        <div>
                                                            <p className="text-[9px] text-gray-400 uppercase font-bold">Investment Product</p>
                                                            <p className="text-xs font-bold text-white">{selectedTransaction.description.split(': ')[1]}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[9px] text-gray-400 uppercase font-bold">Equity Division</p>
                                                            <p className="text-xs font-bold text-white uppercase">{selectedTransaction.shares} Shares @ ₹{selectedTransaction.face_value}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[9px] text-gray-400 uppercase font-bold">Lock-in Start</p>
                                                            <p className="text-xs font-bold text-white">{formatDate(selectedTransaction.lock_in_start_date)}</p>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <div>
                                                                <p className="text-[9px] text-gray-400 uppercase font-bold">Lock-in Period</p>
                                                                <p className="text-xs font-bold text-white">{selectedTransaction.lock_in_period} Years</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-[9px] text-gray-400 uppercase font-bold">Maturity Date</p>
                                                                <p className="text-xs font-bold text-orange-400">{formatDate(selectedTransaction.lock_in_end_date)}</p>
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div>
                                                            <p className="text-[9px] text-gray-400 uppercase font-bold">Asset Performance</p>
                                                            <p className="text-xs font-bold text-white">Consolidated Payout</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[9px] text-gray-400 uppercase font-bold">Yield Rate</p>
                                                            <p className="text-xs font-bold text-white">{selectedTransaction.dividend_rate}% Per Annum</p>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="p-8 bg-gray-50 flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <span className={`w-2 h-2 rounded-full ${selectedTransaction.status === 'active' || selectedTransaction.status === 'paid' ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{selectedTransaction.status} Transaction</p>
                                </div>
                                <div className="flex space-x-3">
                                    {selectedTransaction.type === 'DEBIT' && !isEditingDividend && (
                                        <button
                                            onClick={() => {
                                                setIsEditingDividend(true);
                                                setEditDividendData({
                                                    amount: selectedTransaction.amount,
                                                    bank_name: selectedTransaction.bank,
                                                    reference_no: selectedTransaction.reference,
                                                    payment_mode: selectedTransaction.payment_mode,
                                                    status: selectedTransaction.status
                                                });
                                            }}
                                            className="px-6 py-2.5 bg-[#1B8A9F] text-white rounded-xl text-xs font-black hover:bg-[#156d7d] transition-all uppercase tracking-widest"
                                        >
                                            Edit Payout
                                        </button>
                                    )}
                                    {isEditingDividend ? (
                                        <>
                                            <button
                                                onClick={handleUpdateDividend}
                                                disabled={updatingDividend}
                                                className="px-6 py-2.5 bg-green-600 text-white rounded-xl text-xs font-black hover:bg-green-700 transition-all uppercase tracking-widest flex items-center"
                                            >
                                                {updatingDividend ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : 'Save Changes'}
                                            </button>
                                            <button
                                                onClick={() => setIsEditingDividend(false)}
                                                className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-xl text-xs font-black hover:bg-gray-300 transition-all uppercase tracking-widest"
                                            >
                                                Back
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => setShowTransactionModal(false)}
                                            className="px-6 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-xs font-black text-gray-900 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all uppercase tracking-widest"
                                        >
                                            Dismiss
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

        </div >
    );
}

