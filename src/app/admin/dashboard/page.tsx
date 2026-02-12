'use client';

import { useEffect, useState } from 'react';
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
    Mail
} from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { InvestmentAgreement } from '@/components/InvestmentAgreement';

interface Investment {
    id: string;
    full_name: string;
    email: string;
    investment_amount: number;
    number_of_shares: number;
    payment_date: string;
    lock_in_end_date: string;
    dividend_rate: number;
    status: string;
    demat_credited: boolean;
    dividends: Array<{
        amount: number;
        date: string;
        status: string;
    }>;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState({ dividend_rate: 0, status: '' });

    useEffect(() => {
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
        fetchAllInvestments();
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

    const handleLogout = () => {
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

    const handleAddDividend = async (investmentId: string) => {
        const amount = prompt('Enter dividend amount:');
        if (!amount) return;

        try {
            const response = await fetch(`/api/admin/investments/${investmentId}/dividend`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: parseFloat(amount) }),
            });

            if (response.ok) {
                fetchAllInvestments();
                alert('Dividend added successfully');
            }
        } catch (error) {
            console.error('Error adding dividend:', error);
            alert('Failed to add dividend');
        }
    };

    const filteredInvestments = investments.filter(inv => {
        const matchesSearch = (inv.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (inv.email || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
        return matchesSearch && matchesStatus;
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
                            <div className="flex flex-col items-end">
                                <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-tighter">Chief Administrator</p>
                            </div>
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Stats Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center text-[#1B8A9F]">
                                <Briefcase className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">AUM</span>
                        </div>
                        <p className="text-3xl font-black text-gray-900">{formatCurrency(stats.totalInvestment)}</p>
                        <p className="text-xs text-gray-400 mt-1 font-medium italic">Total Assets Under Management</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-[#4ADE80]">
                                <Users className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Clients</span>
                        </div>
                        <p className="text-3xl font-black text-gray-900">{stats.totalClients}</p>
                        <p className="text-xs text-gray-400 mt-1 font-medium italic">Verified Investors</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-500">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active</span>
                        </div>
                        <p className="text-3xl font-black text-gray-900">{stats.activeInvestmentsCount}</p>
                        <p className="text-xs text-gray-400 mt-1 font-medium italic">Running Agreements</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-500">
                                <DollarSign className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Payouts</span>
                        </div>
                        <p className="text-3xl font-black text-gray-900">{formatCurrency(stats.totalDividendsPaid)}</p>
                        <p className="text-xs text-gray-400 mt-1 font-medium italic">Total Dividends Credited</p>
                    </div>
                </div>

                {/* Management Section */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 border-b border-gray-100">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Investment Management</h3>
                                <p className="text-sm text-gray-500 mt-1 font-medium">Verify applications and manage dividend payouts</p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
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
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
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
                                {filteredInvestments.map((investment) => (
                                    <tr key={investment.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-bold text-gray-900 leading-none">{investment.full_name}</p>
                                            <p className="text-xs text-gray-400 mt-1.5 flex items-center">
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
                                                    onClick={() => handleAddDividend(investment.id)}
                                                    className="p-2.5 bg-gray-50 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-xl transition-all"
                                                >
                                                    <DollarSign className="w-4 h-4" />
                                                </button>
                                                <PDFDownloadLink
                                                    document={<InvestmentAgreement data={investment} />}
                                                    fileName={`Agreement_${investment.id.slice(0, 8)}.pdf`}
                                                    className="p-2.5 bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                                                >
                                                    {({ loading }) => (
                                                        loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />
                                                    )}
                                                </PDFDownloadLink>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredInvestments.length === 0 && (
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
            {showEditModal && selectedInvestment && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border border-gray-100 animate-fade-in-up">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-gray-900 tracking-tight">Modify Application</h3>
                            <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-900">
                                <Clock className="w-5 h-5 rotate-45" />
                            </button>
                        </div>

                        <div className="space-y-6 mb-8">
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Investor Name</label>
                                <div className="p-4 bg-gray-50 rounded-xl text-sm font-bold text-gray-900 border border-gray-100">
                                    {selectedInvestment.full_name}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Dividend Yield (%)</label>
                                    <input
                                        type="number"
                                        value={editData.dividend_rate}
                                        onChange={(e) => setEditData(prev => ({ ...prev, dividend_rate: parseFloat(e.target.value) }))}
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
            )}

            <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center border-t border-gray-200 mt-10">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
                    SHREEG Admin Engine v4.0 • Enterprise Wealth Management Systems
                </p>
            </footer>
        </div>
    );
}
