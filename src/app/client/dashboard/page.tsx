'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
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
    Mail,
    ChevronDown,
    ChevronUp,
    Edit2,
    KeyRound,
    Eye,
    Upload,
    Sparkles
} from 'lucide-react';

// import { InvestmentAgreement } from '@/components/InvestmentAgreement';
import { SignatureUpload } from '@/components/SignatureUpload';
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
        bank_name?: string;
        payment_mode?: string;
        reference_no?: string;
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
    pan_url?: string;
    aadhar_url?: string;
    bank_cheque_url?: string;
    client_signature_url?: string;
    admin_signed_at?: string;
    payment_verified?: boolean;
    fees?: Array<{
        amount: number;
        payment_reference: string;
        payment_date: string;
        status: string;
        created_at: string;
    }>;
    users?: {
        kyc_verified: boolean;
        signature_url?: string;
        referral_code?: string;
    };
}

export default function ClientDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFetchingInvestments, setIsFetchingInvestments] = useState(false);
    const [investmentPage, setInvestmentPage] = useState(1);
    const [hasMoreInvestments, setHasMoreInvestments] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [productFilter, setProductFilter] = useState('all');
    const [dashboardStats, setDashboardStats] = useState({
        totalInvested: 0,
        totalDividends: 0,
        pendingGains: 0,
        activeShares: 0
    });
    const [dividendLimit, setDividendLimit] = useState(10);
    const [expandedAgreements, setExpandedAgreements] = useState<Set<string>>(new Set());
    const [showResetModal, setShowResetModal] = useState(false);
    const [resetData, setResetData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [resetLoading, setResetLoading] = useState(false);
    const [resetError, setResetError] = useState('');
    const [resetSuccess, setResetSuccess] = useState(false);

    // Profile Edit State
    const [isEditing, setIsEditing] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [profileData, setProfileData] = useState<any>(null);
    const [signatureFile, setSignatureFile] = useState<File | null>(null);
    const [panFile, setPanFile] = useState<File | null>(null);
    const [aadharFile, setAadharFile] = useState<File | null>(null);
    const [chequeFile, setChequeFile] = useState<File | null>(null);

    const [kycLoading, setKycLoading] = useState(false);
    const [adminSignatureUrl, setAdminSignatureUrl] = useState<string | null>(null);

    // Fee State
    const [dueFees, setDueFees] = useState<any[]>([]);
    const [showFeeModal, setShowFeeModal] = useState(false);
    const [selectedFeeInvestment, setSelectedFeeInvestment] = useState<Investment | null>(null);
    const [feePaymentData, setFeePaymentData] = useState({
        reference: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [feeLoading, setFeeLoading] = useState(false);

    const [referrals, setReferrals] = useState<any[]>([]);
    const [referralsLoading, setReferralsLoading] = useState(false);
    const [referralsPage, setReferralsPage] = useState(1);
    const [hasMoreReferrals, setHasMoreReferrals] = useState(true);

    const fetchReferrals = async (referralCode: string, page = 1, reset = false) => {
        try {
            setReferralsLoading(true);
            const queryParams = new URLSearchParams({
                code: referralCode,
                page: page.toString(),
                limit: '20'
            });
            const response = await fetch(`/api/referrals/my-referrals?${queryParams}`);
            const data = await response.json();
            if (response.ok) {
                if (reset || page === 1) {
                    setReferrals(data.referrals || []);
                } else {
                    setReferrals(prev => {
                        const existingIds = new Set(prev.map(r => r.id));
                        const newItems = (data.referrals || []).filter((r: any) => !existingIds.has(r.id));
                        return [...prev, ...newItems];
                    });
                }
                setHasMoreReferrals((data.referrals || []).length === 20);
            }
        } catch (error) {
            console.error('Error fetching referrals:', error);
        } finally {
            setReferralsLoading(false);
        }
    };

    const checkFees = useCallback((currentInvestments: Investment[]) => {
        const feesToPay: any[] = [];
        const today = new Date();

        currentInvestments.forEach(inv => {
            // Only apply to non-unlisted products that are active
            if (inv.product_name !== 'Unlisted Shares' && (inv.status === 'active' || inv.status === 'approved')) {
                const startDate = new Date(inv.payment_date);
                const diffTime = Math.abs(today.getTime() - startDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays > 7) {
                    // Check if a fee has been paid/submitted in the last 30 days
                    const lastFee = [...(inv.fees || [])]
                        .filter(f => f.status === 'paid' || f.status === 'pending')
                        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

                    let isDue = false;
                    if (!lastFee) {
                        isDue = true;
                    } else {
                        const lastDate = new Date(lastFee.created_at);
                        const daysSinceLast = Math.ceil(Math.abs(today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
                        if (daysSinceLast >= 30) {
                            isDue = true;
                        }
                    }

                    if (isDue) {
                        feesToPay.push({
                            investment: inv,
                            amount: inv.investment_amount * 0.01,
                            reason: lastFee ? 'Monthly Management Fee' : 'Initial Management Fee (Post 7-day trial)'
                        });
                    }
                }
            }
        });

        setDueFees(feesToPay);
        if (feesToPay.length > 0) {
            setSelectedFeeInvestment(feesToPay[0].investment);
            setShowFeeModal(true);
        }
    }, []);

    const handlePayFee = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFeeInvestment) return;

        setFeeLoading(true);
        try {
            const response = await fetch('/api/investments/fees/pay', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    investmentId: selectedFeeInvestment.id,
                    amount: selectedFeeInvestment.investment_amount * 0.01,
                    payment_reference: feePaymentData.reference,
                    payment_date: feePaymentData.date
                }),
            });

            if (response.ok) {
                setShowFeeModal(false);
                setFeePaymentData({ reference: '', date: new Date().toISOString().split('T')[0] });
                await fetchInvestments();
                alert('Fee payment submitted successfully! It will be verified by our team.');
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to submit fee payment');
            }
        } catch (error) {
            console.error('Error paying fee:', error);
            alert('An error occurred while submitting fee payment');
        } finally {
            setFeeLoading(false);
        }
    };

    const toggleAgreement = (id: string) => {
        const newExpanded = new Set(expandedAgreements);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedAgreements(newExpanded);
    };

    // Infinite Scroll Observer
    const observer = useRef<IntersectionObserver | null>(null);
    const lastElementRef = useCallback((node: HTMLElement | null) => {
        if (loading || isFetchingInvestments || referralsLoading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                if (activeTab === 'overview' && hasMoreInvestments) {
                    setInvestmentPage(prev => prev + 1);
                } else if (activeTab === 'referrals' && hasMoreReferrals) {
                    setReferralsPage(prev => prev + 1);
                } else if (activeTab === 'dividends') {
                    setDividendLimit(prev => prev + 10);
                }
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, isFetchingInvestments, referralsLoading, activeTab, hasMoreInvestments, hasMoreReferrals]);

    useEffect(() => {
        if (activeTab === 'overview') {
            setInvestmentPage(1);
            setHasMoreInvestments(true);
            fetchInvestments(1, true);
        }
        if (activeTab === 'referrals') {
            setReferralsPage(1);
            setHasMoreReferrals(true);
            if (user?.referral_code) {
                fetchReferrals(user.referral_code, 1, true);
            }
        }
    }, [activeTab]);

    useEffect(() => {
        if (user?.email) {
            fetchDashboardStats();
        }
    }, [productFilter, user?.email]);

    useEffect(() => {
        if (activeTab === 'overview' && investmentPage > 1) {
            fetchInvestments(investmentPage);
        } else if (activeTab === 'referrals' && referralsPage > 1 && user?.referral_code) {
            fetchReferrals(user.referral_code, referralsPage);
        }
    }, [investmentPage, referralsPage]);

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
                if (parsedUser.passwordResetRequired) {
                    setShowResetModal(true);
                }
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

                // Check for password reset requirement
                const localUser = localStorage.getItem('user');
                if (localUser) {
                    const parsed = JSON.parse(localUser);
                    if (parsed.passwordResetRequired) {
                        setShowResetModal(true);
                    }
                }

                // admin signature is now fetched via the my-investments API to bypass RLS

                // Fetch referral code from users table
                const { data: referralData } = await supabase
                    .from('users')
                    .select('referral_code')
                    .eq('id', session.user.id)
                    .single();
                if (referralData?.referral_code) {
                    setUser((prev: any) => ({ ...prev, referral_code: referralData.referral_code }));
                    fetchReferrals(referralData.referral_code);
                }
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

    const fetchInvestments = async (page = 1, reset = false) => {
        try {
            setIsFetchingInvestments(true);
            const userData = localStorage.getItem('user');
            if (!userData) return;

            const parsedUser = JSON.parse(userData);
            const queryParams = new URLSearchParams({
                email: parsedUser.email,
                page: page.toString(),
                limit: '10'
            });
            const response = await fetch(`/api/investments/my-investments?${queryParams}`);
            const data = await response.json();

            if (response.ok) {
                if (reset || page === 1) {
                    setInvestments(data.investments || []);
                    // Initialize profile data from the most recent investment
                    if ((data.investments || []).length > 0 && !profileData) {
                        const inv = data.investments[0];
                        setProfileData({
                            full_name: inv.full_name || '',
                            father_name: inv.father_name || '',
                            dob: inv.dob || '',
                            gender: inv.gender || 'Male',
                            occupation: inv.occupation || '',
                            permanent_address: inv.permanent_address || '',
                            contact_number: inv.contact_number || '',
                            pan_number: inv.pan_number || '',
                            aadhar_number: inv.aadhar_number || '',
                            nominee: {
                                name: inv.nominee?.name || '',
                                relation: inv.nominee?.relation || inv.nominee?.relationship || '',
                                dob: inv.nominee?.dob || '',
                                address: inv.nominee?.address || ''
                            },
                            pan_url: inv.pan_url || '',
                            aadhar_url: inv.aadhar_url || '',
                            bank_cheque_url: inv.bank_cheque_url || '',
                            bank_details: {
                                accountHolderName: inv.bank_details?.accountHolderName || inv.full_name || '',
                                bankName: inv.bank_details?.bankName || '',
                                accountNumber: inv.bank_details?.accountNumber || '',
                                ifscCode: inv.bank_details?.ifscCode || '',
                                branch: inv.bank_details?.branch || ''
                            },
                            client_signature_url: inv.client_signature_url || '',
                            kyc_verified: inv.users?.kyc_verified || false
                        });
                    }
                } else {
                    setInvestments(prev => {
                        const existingIds = new Set(prev.map(inv => inv.id));
                        const newItems = (data.investments || []).filter((inv: any) => !existingIds.has(inv.id));
                        return [...prev, ...newItems];
                    });
                }
                setHasMoreInvestments((data.investments || []).length === 10);

                if (data.admin_signature_url) {
                    setAdminSignatureUrl(data.admin_signature_url);
                }

                // Check for due fees after setting investments
                // Doing this safely using functional update pattern if needed, but doing directly using fetched current page payload for now is OK as it targets active/approved latest investemnts.
                if (page === 1) {
                    checkFees(data.investments || []);
                }
            }
        } catch (error) {
            console.error('Error fetching investments:', error);
        } finally {
            setIsFetchingInvestments(false);
            setLoading(false);
        }
    };

    const fetchDashboardStats = async () => {
        try {
            const userData = localStorage.getItem('user');
            if (!userData) return;

            const parsedUser = JSON.parse(userData);
            const queryParams = new URLSearchParams({
                email: parsedUser.email,
                product: productFilter
            });
            const response = await fetch(`/api/investments/my-stats?${queryParams}`);
            const data = await response.json();

            if (response.ok) {
                setDashboardStats({
                    totalInvested: data.totalInvested || 0,
                    totalDividends: data.totalDividends || 0,
                    pendingGains: data.pendingGains || 0,
                    activeShares: data.activeShares || 0
                });
            }
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('user');
        localStorage.removeItem('session');
        router.push('/login');
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdateLoading(true);

        try {
            if (signatureFile) {
                const fileExt = signatureFile.name.split('.').pop();
                const fileName = `client_sig_${user.id}_${Date.now()}.${fileExt}`;
                const fullPath = `client_signatures/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('documents')
                    .upload(fullPath, signatureFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('documents')
                    .getPublicUrl(fullPath);

                profileData.client_signature_url = publicUrl;
            }

            if (panFile) {
                const fileExt = panFile.name.split('.').pop();
                const fileName = `pan_${user.id}_${Date.now()}.${fileExt}`;
                const fullPath = `kyc_docs/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('documents')
                    .upload(fullPath, panFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('documents')
                    .getPublicUrl(fullPath);

                profileData.pan_url = publicUrl;
            }

            if (aadharFile) {
                const fileExt = aadharFile.name.split('.').pop();
                const fileName = `aadhar_${user.id}_${Date.now()}.${fileExt}`;
                const fullPath = `kyc_docs/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('documents')
                    .upload(fullPath, aadharFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('documents')
                    .getPublicUrl(fullPath);

                profileData.aadhar_url = publicUrl;
            }

            if (chequeFile) {
                const fileExt = chequeFile.name.split('.').pop();
                const fileName = `cheque_${user.id}_${Date.now()}.${fileExt}`;
                const fullPath = `kyc_docs/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('documents')
                    .upload(fullPath, chequeFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('documents')
                    .getPublicUrl(fullPath);

                profileData.bank_cheque_url = publicUrl;
            }

            const response = await fetch('/api/client/profile/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: user.email,
                    ...profileData
                }),
            });

            if (response.ok) {
                setIsEditing(false);
                setSignatureFile(null);
                setPanFile(null);
                setAadharFile(null);
                setChequeFile(null);
                // Refresh investments to show updated info
                await fetchInvestments();
                alert('Profile updated successfully!');
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('An error occurred while updating profile');
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setResetError('');
        setResetLoading(true);

        if (resetData.newPassword !== resetData.confirmPassword) {
            setResetError('Passwords do not match');
            setResetLoading(false);
            return;
        }

        if (resetData.newPassword.length < 6) {
            setResetError('Password must be at least 6 characters');
            setResetLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/update-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    newPassword: resetData.newPassword
                }),
            });

            if (response.ok) {
                setResetSuccess(true);
                // Update local user data
                const userData = JSON.parse(localStorage.getItem('user') || '{}');
                userData.passwordResetRequired = false;
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);

                setTimeout(() => {
                    setShowResetModal(false);
                    setResetSuccess(false);
                    setResetData({ newPassword: '', confirmPassword: '' });
                }, 2000);
            } else {
                const data = await response.json();
                setResetError(data.error || 'Failed to update password');
            }
        } catch (error) {
            setResetError('An error occurred. Please try again.');
        } finally {
            setResetLoading(false);
        }
    };

    const filteredInvestments = investments.filter(inv =>
        productFilter === 'all' || inv.product_name === productFilter
    );

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
                                    alt="TraderG Wealth Logo"
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
                    <div className="flex flex-col md:flex-row md:items-end justify-between w-full gap-6">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Portfolio Overview</h2>
                            <p className="text-sm md:text-base text-gray-500 mt-1">Track your investments and dividend returns</p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-hover:text-[#1B8A9F] transition-colors">
                                    <TrendingUp className="w-4 h-4" />
                                </div>
                                <select
                                    value={productFilter}
                                    onChange={(e) => setProductFilter(e.target.value)}
                                    className="block w-full sm:w-64 pl-10 pr-10 py-3 bg-white border-2 border-gray-100 rounded-xl text-sm font-bold text-gray-700 outline-none focus:border-[#1B8A9F] focus:ring-4 focus:ring-teal-50 transition-all cursor-pointer appearance-none"
                                >
                                    <option value="all">All Growth Products</option>
                                    {Array.from(new Set(investments.map(inv => inv.product_name || 'TRADERG ASSET'))).map(prod => (
                                        <option key={prod} value={prod}>{prod}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-300">
                                    <ChevronDown className="w-4 h-4" />
                                </div>
                            </div>
                            <Link
                                href="/apply"
                                className="inline-flex items-center justify-center bg-[#1B8A9F] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#156d7d] hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                            >
                                New Investment
                                <ArrowUpRight className="w-4 h-4 ml-2" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
                    <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center mb-4 text-[#1B8A9F]">
                            <Briefcase className="w-5 h-5" />
                        </div>
                        <p className="text-gray-500 text-xs md:text-sm font-medium">Total Invested</p>
                        <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1">{formatCurrency(dashboardStats.totalInvested)}</p>
                    </div>

                    {['all', 'Unlisted Shares'].includes(productFilter) && (
                        <>
                            <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mb-4 text-[#4ADE80]">
                                    <ArrowUpRight className="w-5 h-5" />
                                </div>
                                <p className="text-gray-500 text-xs md:text-sm font-medium">Profit Earned</p>
                                <p className="text-xl md:text-2xl font-bold text-[#4ADE80] mt-1">{formatCurrency(dashboardStats.totalDividends)}</p>
                            </div>

                            <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center mb-4 text-orange-500">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <p className="text-gray-500 text-xs md:text-sm font-medium">Pending Gains</p>
                                <p className="text-xl md:text-2xl font-bold text-orange-500 mt-1">{formatCurrency(dashboardStats.pendingGains)}</p>
                            </div>
                        </>
                    )}

                    <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center mb-4 text-[#1B8A9F]">
                            <PieChart className="w-5 h-5" />
                        </div>
                        <p className="text-gray-500 text-xs md:text-sm font-medium">Active Shares</p>
                        <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1">{dashboardStats.activeShares}</p>
                    </div>
                </div>

                {user?.referral_code && (
                    <div className="bg-[#1B8A9F] p-5 md:p-6 rounded-2xl shadow-sm border border-[#1B8A9F]/20 hover:shadow-md transition-shadow group relative overflow-hidden mb-8 md:mb-12">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <Sparkles className="w-12 h-12 text-white" />
                        </div>
                        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                            <div>
                                <p className="text-teal-50 text-xs font-bold uppercase tracking-widest opacity-80">Referral Program</p>
                                <div className="flex items-center gap-4 mt-2">
                                    <p className="text-2xl md:text-3xl font-black text-white tracking-widest uppercase">{user?.referral_code}</p>
                                    <span className="px-2.5 py-1 bg-white/20 rounded-lg text-[10px] font-black text-white uppercase tracking-widest border border-white/10">Your Code</span>
                                </div>
                                <p className="text-teal-50/70 text-[10px] md:text-xs mt-2 font-medium">Share this code with friends and family to grow together.</p>
                            </div>
                            <button
                                onClick={() => {
                                    const url = `${window.location.origin}/apply?ref=${user.referral_code}`;
                                    navigator.clipboard.writeText(url);
                                    alert('Referral link copied to clipboard!');
                                }}
                                className="inline-flex items-center justify-center gap-2 bg-white text-[#1B8A9F] px-8 py-4 rounded-xl font-bold text-sm hover:bg-teal-50 transition-all shadow-xl shadow-black/5 active:scale-95 transform"
                            >
                                Copy Referral Link
                                <ArrowUpRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}


                {/* Tabs */}
                <div className="flex space-x-8 border-b border-gray-200 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
                    {['overview', 'referrals', 'dividends', 'details', 'profile']
                        .filter(tab => tab !== 'dividends' || filteredInvestments.some(inv => inv.product_name === 'Unlisted Shares'))
                        .map((tab) => (
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
                    {activeTab === 'referrals' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
                            <div className="p-6 md:p-8 border-b border-gray-50 bg-gray-50/30">
                                <h3 className="text-xl font-bold text-gray-900 uppercase tracking-tight flex items-center gap-3">
                                    <Users className="w-6 h-6 text-[#1B8A9F]" />
                                    Your Referrals
                                </h3>
                                <p className="text-gray-500 text-sm mt-1">People who joined using your referral code.</p>
                            </div>
                            <div className="p-6 md:p-8">
                                {referralsLoading ? (
                                    <div className="flex flex-col items-center justify-center py-20">
                                        <Loader2 className="w-12 h-12 text-[#1B8A9F] animate-spin" />
                                        <p className="text-gray-500 mt-4 font-medium italic">Fetching your referrals...</p>
                                    </div>
                                ) : referrals.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="text-left border-b border-gray-100">
                                                    <th className="pb-4 text-xs font-black text-gray-400 uppercase tracking-widest">Name</th>
                                                    <th className="pb-4 text-xs font-black text-gray-400 uppercase tracking-widest">Email</th>
                                                    <th className="pb-4 text-xs font-black text-gray-400 uppercase tracking-widest">Joined Date</th>
                                                    <th className="pb-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {referrals.map((referral) => (
                                                    <tr key={referral.id} className="group hover:bg-gray-50/50 transition-colors">
                                                        <td className="py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-full bg-[#1B8A9F]/10 flex items-center justify-center text-[#1B8A9F] font-bold">
                                                                    {referral.name?.charAt(0) || 'U'}
                                                                </div>
                                                                <span className="font-bold text-gray-900">{referral.name || 'Anonymous'}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 text-sm text-gray-600 font-medium">{referral.email}</td>
                                                        <td className="py-4 text-sm text-gray-500">{new Date(referral.created_at).toLocaleDateString('en-IN', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}</td>
                                                        <td className="py-4 text-right">
                                                            <span className="px-2.5 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-green-100">
                                                                Joined
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-20 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                                            <Users className="w-8 h-8 text-gray-300" />
                                        </div>
                                        <h4 className="text-gray-900 font-bold uppercase tracking-tight">No Referrals Yet</h4>
                                        <p className="text-gray-500 text-sm mt-1 max-w-xs mx-auto">Share your referral code with friends and family to see them listed here!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'overview' && (
                        <div className="grid gap-6">
                            {filteredInvestments.length > 0 ? (
                                filteredInvestments.map((investment, idx) => (
                                    <div
                                        key={investment.id}
                                        ref={idx === filteredInvestments.length - 1 ? lastElementRef : null}
                                        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                                    >
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
                                                        {investment.product_name === 'Unlisted Shares' ? '3-Year Lock-in' : 'No Lock-in'}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 flex-1 max-w-2xl px-0 lg:px-8">
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                                                        {investment.product_name === 'Unlisted Shares' ? 'Principal' : 'Trade Capital'}
                                                    </p>
                                                    <p className="text-lg font-bold text-gray-900">{formatCurrency(investment.investment_amount)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                                                        {investment.product_name === 'Unlisted Shares' ? 'Shares' : 'Monthly Fee (1%)'}
                                                    </p>
                                                    <p className="text-lg font-bold text-gray-900">
                                                        {investment.product_name === 'Unlisted Shares' ? investment.number_of_shares : formatCurrency(Number(investment.investment_amount) * 0.01)}
                                                    </p>
                                                </div>
                                                {investment.product_name === 'Unlisted Shares' && (
                                                    <div>
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Yield (%)</p>
                                                        <p className="text-lg font-bold text-[#1B8A9F]">{investment.dividend_rate > 0 ? `${investment.dividend_rate}%` : 'FIXED'}</p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
                                                {investment.product_name === 'Unlisted Shares' ? (
                                                    <div className="inline-flex items-center justify-center bg-gray-50 text-gray-400 px-5 py-2.5 rounded-lg border border-gray-200 text-sm font-bold opacity-75">
                                                        <Lock className="w-4 h-4 mr-2" />
                                                        Agreement NA
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col gap-2">
                                                        <div className="inline-flex items-center justify-center bg-teal-50 text-[#1B8A9F] px-5 py-2.5 rounded-lg border border-teal-100 text-sm font-bold">
                                                            <CheckCircle2 className="w-4 h-4 mr-2" />
                                                            T&C Agreed
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedFeeInvestment(investment);
                                                                setShowFeeModal(true);
                                                            }}
                                                            className="inline-flex items-center justify-center bg-orange-100 text-orange-600 px-5 py-2.5 rounded-lg border border-orange-200 text-sm font-bold hover:bg-orange-200 flex-1 transition-all"
                                                        >
                                                            <DollarSign className="w-4 h-4 mr-2" />
                                                            Pay Monthly Fee
                                                        </button>
                                                    </div>
                                                )}
                                                {investment.product_name === 'Unlisted Shares' && getDaysRemaining(investment.lock_in_end_date) > 0 && (
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
                                            {filteredInvestments
                                                .flatMap(inv => (inv.dividends || []).map(d => ({ ...d, invId: inv.id })))
                                                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                                .slice(0, dividendLimit)
                                                .map((dividend, idx, arr) => (
                                                    <tr
                                                        key={`${dividend.invId}-${idx}`}
                                                        ref={idx === arr.length - 1 ? lastElementRef : null}
                                                        className="hover:bg-gray-50/50 transition-colors"
                                                    >
                                                        <td className="px-8 py-5">
                                                            <p className="text-sm font-bold text-gray-900">Bond Application</p>
                                                            <p className="text-[10px] font-mono text-gray-400 mt-0.5">#{dividend.invId.slice(0, 8)}</p>
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
                                            }
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
                        <div className="space-y-6 animate-fade-in-up">
                            {filteredInvestments.length > 0 ? (
                                filteredInvestments.map((investment, idx, arr) => {
                                    const isExpanded = expandedAgreements.has(investment.id);
                                    return (
                                        <div
                                            key={investment.id}
                                            ref={idx === arr.length - 1 ? lastElementRef : null}
                                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300"
                                        >
                                            <button
                                                onClick={() => toggleAgreement(investment.id)}
                                                className="w-full px-8 py-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-[#1B8A9F]">
                                                        <ShieldCheck className="w-5 h-5" />
                                                    </div>
                                                    <div className="text-left">
                                                        <h3 className="text-lg font-bold text-gray-900 leading-none">
                                                            {investment.product_name === 'Unlisted Shares' ? 'Agreement' : 'Investment'} #{idx + 1}
                                                        </h3>
                                                        <p className="text-[10px] font-mono text-gray-400 mt-1.5 uppercase tracking-widest">{investment.id.slice(0, 16)}...</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-4">
                                                    <span className="hidden sm:inline-flex px-3 py-1 bg-gray-50 text-gray-400 text-[9px] font-black uppercase tracking-widest rounded-full border border-gray-100">
                                                        {investment.product_name || 'N/A'}
                                                    </span>
                                                    {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                                                </div>
                                            </button>

                                            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                                <div className="px-8 pb-8 pt-2 space-y-8">
                                                    <div className="grid lg:grid-cols-2 gap-8">
                                                        {/* Personal Information */}
                                                        <div className="space-y-6">
                                                            <h4 className="text-xs font-black text-[#1B8A9F] uppercase tracking-[0.2em] flex items-center">
                                                                <User className="w-4 h-4 mr-2" />
                                                                Personal Information
                                                            </h4>
                                                            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
                                                                {[
                                                                    { label: 'Full Name', value: investment.full_name },
                                                                    { label: 'Father\'s Name', value: investment.father_name },
                                                                    { label: 'Date of Birth', value: formatDate(investment.dob) },
                                                                    { label: 'Age', value: investment.age },
                                                                    { label: 'Gender', value: investment.gender },
                                                                    { label: 'Occupation', value: investment.occupation },
                                                                    { label: 'Contact', value: investment.contact_number },
                                                                    { label: 'Email', value: investment.email },
                                                                ].map((item) => (
                                                                    <div key={item.label} className="border-b border-gray-50 pb-2">
                                                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                                                                        <p className="text-xs font-bold text-gray-900">{item.value}</p>
                                                                    </div>
                                                                ))}
                                                                <div className="sm:col-span-2 border-b border-gray-50 pb-2">
                                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Permanent Address</p>
                                                                    <p className="text-xs font-bold text-gray-900">{investment.permanent_address}</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Nominee & Bank Information */}
                                                        <div className="space-y-8">
                                                            <div className="space-y-6">
                                                                <h4 className="text-xs font-black text-orange-500 uppercase tracking-[0.2em] flex items-center">
                                                                    <Users className="w-4 h-4 mr-2" />
                                                                    Nominee Details
                                                                </h4>
                                                                <div className="grid sm:grid-cols-2 gap-4">
                                                                    {[
                                                                        { label: 'Name', value: investment.nominee.name },
                                                                        { label: 'Relation', value: investment.nominee.relation },
                                                                        { label: 'DOB', value: formatDate(investment.nominee.dob) },
                                                                    ].map((item) => (
                                                                        <div key={item.label} className="border-b border-gray-50 pb-2">
                                                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                                                                            <p className="text-xs font-bold text-gray-900">{item.value}</p>
                                                                        </div>
                                                                    ))}
                                                                    <div className="sm:col-span-2 border-b border-gray-50 pb-2">
                                                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Nominee Address</p>
                                                                        <p className="text-xs font-bold text-gray-900">{investment.nominee.address}</p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="space-y-6">
                                                                <h4 className="text-xs font-black text-green-500 uppercase tracking-[0.2em] flex items-center">
                                                                    <Building2 className="w-4 h-4 mr-2" />
                                                                    Bank Information
                                                                </h4>
                                                                <div className="grid sm:grid-cols-2 gap-4">
                                                                    {[
                                                                        { label: 'Bank Name', value: investment.bank_details.bankName },
                                                                        { label: 'A/C Number', value: investment.bank_details.accountNumber },
                                                                        { label: 'Branch', value: investment.bank_details.branch },
                                                                        { label: 'IFSC Code', value: investment.bank_details.ifscCode },
                                                                    ].map((item) => (
                                                                        <div key={item.label} className="border-b border-gray-50 pb-2">
                                                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                                                                            <p className="text-xs font-bold text-gray-900">{item.value}</p>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Investment Specifics */}
                                                        <div className="lg:col-span-2 pt-6 border-t border-gray-100">
                                                            <h4 className="text-xs font-black text-teal-600 uppercase tracking-[0.2em] mb-6 flex items-center">
                                                                <PieChart className="w-4 h-4 mr-2" />
                                                                {investment.product_name === 'Unlisted Shares' ? 'Agreement Specifics' : 'Investment Specifics'}
                                                            </h4>
                                                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
                                                                {[
                                                                    { label: 'Principal', value: formatCurrency(investment.investment_amount) },
                                                                    { label: 'Shares', value: investment.number_of_shares },
                                                                    { label: 'Face Value', value: formatCurrency(investment.face_value_per_share || 100) },
                                                                    { label: 'Yield', value: investment.dividend_rate > 0 ? `${investment.dividend_rate}%` : 'FIXED' },
                                                                    { label: 'Lock-in', value: investment.product_name === 'Unlisted Shares' ? `${investment.lock_in_period} Years` : 'None' },
                                                                    { label: 'Demat Status', value: investment.demat_credited ? 'Credited' : 'Pending' },
                                                                ].map((item) => (
                                                                    <div key={item.label}>
                                                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tight mb-1">{item.label}</p>
                                                                        <p className="text-xs font-black text-gray-900">{item.value}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Physical Documents */}
                                                    <div className="lg:col-span-2 pt-6 border-t border-gray-100">
                                                        <h4 className="text-xs font-black text-red-500 uppercase tracking-[0.2em] mb-4 flex items-center">
                                                            <Building2 className="w-4 h-4 mr-2" />
                                                            Uploaded Documents
                                                        </h4>
                                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                            {investment.pan_url ? (
                                                                <a
                                                                    href={investment.pan_url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center p-3 bg-gray-50 border border-gray-100 rounded-xl hover:bg-teal-50 hover:border-teal-100 transition-all group"
                                                                >
                                                                    <div className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center mr-3 group-hover:text-[#1B8A9F]">
                                                                        <Download className="w-4 h-4" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">PAN Card</p>
                                                                        <p className="text-[10px] font-black text-gray-900 group-hover:text-[#1B8A9F]">View / Download</p>
                                                                    </div>
                                                                </a>
                                                            ) : (
                                                                <div className="flex items-center p-3 bg-gray-50/50 border border-gray-100 border-dashed rounded-xl opacity-60">
                                                                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                                                                        <Lock className="w-4 h-4 text-gray-300" />
                                                                    </div>
                                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">PAN Not Uploaded</p>
                                                                </div>
                                                            )}

                                                            {investment.aadhar_url ? (
                                                                <a
                                                                    href={investment.aadhar_url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center p-3 bg-gray-50 border border-gray-100 rounded-xl hover:bg-teal-50 hover:border-teal-100 transition-all group"
                                                                >
                                                                    <div className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center mr-3 group-hover:text-[#1B8A9F]">
                                                                        <Download className="w-4 h-4" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">Aadhaar Card</p>
                                                                        <p className="text-[10px] font-black text-gray-900 group-hover:text-[#1B8A9F]">View / Download</p>
                                                                    </div>
                                                                </a>
                                                            ) : (
                                                                <div className="flex items-center p-3 bg-gray-50/50 border border-gray-100 border-dashed rounded-xl opacity-60">
                                                                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                                                                        <Lock className="w-4 h-4 text-gray-300" />
                                                                    </div>
                                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Aadhaar Not Uploaded</p>
                                                                </div>
                                                            )}

                                                            {investment.bank_cheque_url ? (
                                                                <a
                                                                    href={investment.bank_cheque_url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center p-3 bg-gray-50 border border-gray-100 rounded-xl hover:bg-teal-50 hover:border-teal-100 transition-all group"
                                                                >
                                                                    <div className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center mr-3 group-hover:text-[#1B8A9F]">
                                                                        <Download className="w-4 h-4" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">Cancelled Cheque</p>
                                                                        <p className="text-[10px] font-black text-gray-900 group-hover:text-[#1B8A9F]">View / Download</p>
                                                                    </div>
                                                                </a>
                                                            ) : (
                                                                <div className="flex items-center p-3 bg-gray-50/50 border border-gray-100 border-dashed rounded-xl opacity-60">
                                                                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                                                                        <Lock className="w-4 h-4 text-gray-300" />
                                                                    </div>
                                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Cheque Not Uploaded</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-100">
                                    <p className="text-gray-400 font-medium">No application details found.</p>
                                </div>
                            )}
                        </div>
                    )}
                    {activeTab === 'profile' && (
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-teal-50 to-white flex justify-between items-center">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 bg-[#1B8A9F] rounded-2xl flex items-center justify-center text-white">
                                            <User className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900">{profileData?.full_name || user?.name}</h3>
                                            <p className="text-gray-500">{user?.email}</p>
                                        </div>
                                    </div>
                                    {!isEditing && (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center shadow-sm"
                                        >
                                            <Edit2 className="w-4 h-4 mr-2 text-[#1B8A9F]" />
                                            Edit Profile
                                        </button>
                                    )}
                                </div>

                                <div className="p-8">
                                    {isEditing ? (
                                        <form onSubmit={handleProfileUpdate} className="space-y-12">
                                            {/* Personal Information */}
                                            <div className="space-y-6">
                                                <h4 className="text-sm font-bold text-[#1B8A9F] uppercase tracking-wider flex items-center bg-teal-50/50 p-3 rounded-xl">
                                                    <User className="w-4 h-4 mr-2" />
                                                    Personal Information
                                                </h4>
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Full Name {profileData?.kyc_verified && '(Verified - Locked)'}</label>
                                                        {profileData?.kyc_verified ? (
                                                            <div className="w-full p-3.5 bg-gray-100/80 border border-gray-200 rounded-xl text-gray-500 font-bold flex items-center cursor-not-allowed">
                                                                <ShieldCheck className="w-4 h-4 mr-2 text-teal-600/50" />
                                                                {profileData?.full_name}
                                                            </div>
                                                        ) : (
                                                            <input
                                                                type="text"
                                                                value={profileData?.full_name ?? ''}
                                                                onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                                                                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1B8A9F] outline-none transition-all"
                                                                required
                                                            />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Father's Name</label>
                                                        <input
                                                            type="text"
                                                            value={profileData?.father_name ?? ''}
                                                            onChange={(e) => setProfileData({ ...profileData, father_name: e.target.value })}
                                                            className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1B8A9F] outline-none transition-all"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Date of Birth</label>
                                                        <input
                                                            type="date"
                                                            value={profileData?.dob ?? ''}
                                                            onChange={(e) => setProfileData({ ...profileData, dob: e.target.value })}
                                                            className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1B8A9F] outline-none transition-all"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Gender</label>
                                                        <select
                                                            value={profileData?.gender ?? 'Male'}
                                                            onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                                                            className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1B8A9F] outline-none transition-all"
                                                            required
                                                        >
                                                            <option value="Male">Male</option>
                                                            <option value="Female">Female</option>
                                                            <option value="Other">Other</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Occupation</label>
                                                        <input
                                                            type="text"
                                                            value={profileData?.occupation ?? ''}
                                                            onChange={(e) => setProfileData({ ...profileData, occupation: e.target.value })}
                                                            className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1B8A9F] outline-none transition-all"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Contact Number</label>
                                                        <input
                                                            type="tel"
                                                            value={profileData?.contact_number ?? ''}
                                                            onChange={(e) => setProfileData({ ...profileData, contact_number: e.target.value })}
                                                            className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1B8A9F] outline-none transition-all"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                                                            PAN Number {profileData?.pan_number && profileData.pan_number !== 'Not Provided' && profileData.pan_number !== '—' && '(Locked)'}
                                                        </label>
                                                        {profileData?.pan_number && profileData.pan_number !== 'Not Provided' && profileData.pan_number !== '—' ? (
                                                            <div className="p-3.5 bg-gray-100/80 border border-gray-200 rounded-xl text-gray-500 font-bold cursor-not-allowed flex items-center">
                                                                <ShieldCheck className={`w-4 h-4 mr-2 ${profileData?.kyc_verified ? 'text-teal-600' : 'text-teal-600/50'}`} />
                                                                {profileData?.pan_number}
                                                            </div>
                                                        ) : (
                                                            <input
                                                                type="text"
                                                                value={profileData?.pan_number ?? ''}
                                                                onChange={(e) => setProfileData({ ...profileData, pan_number: e.target.value.toUpperCase() })}
                                                                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1B8A9F] outline-none transition-all font-mono uppercase"
                                                                placeholder="Enter PAN Number"
                                                            />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                                                            Aadhaar Number {profileData?.aadhar_number && profileData.aadhar_number !== 'Not Provided' && profileData.aadhar_number !== '—' && '(Locked)'}
                                                        </label>
                                                        {profileData?.aadhar_number && profileData.aadhar_number !== 'Not Provided' && profileData.aadhar_number !== '—' ? (
                                                            <div className="p-3.5 bg-gray-100/80 border border-gray-200 rounded-xl text-gray-500 font-bold cursor-not-allowed flex items-center">
                                                                <ShieldCheck className={`w-4 h-4 mr-2 ${profileData?.kyc_verified ? 'text-teal-600' : 'text-teal-600/50'}`} />
                                                                {profileData?.aadhar_number}
                                                            </div>
                                                        ) : (
                                                            <input
                                                                type="text"
                                                                value={profileData?.aadhar_number ?? ''}
                                                                onChange={(e) => setProfileData({ ...profileData, aadhar_number: e.target.value })}
                                                                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1B8A9F] outline-none transition-all font-mono"
                                                                placeholder="Enter Aadhaar Number"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Permanent Address</label>
                                                    <textarea
                                                        value={profileData?.permanent_address ?? ''}
                                                        onChange={(e) => setProfileData({ ...profileData, permanent_address: e.target.value })}
                                                        className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1B8A9F] outline-none transition-all min-h-[100px]"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {/* Nominee Details */}
                                            <div className="space-y-6">
                                                <h4 className="text-sm font-bold text-purple-600 uppercase tracking-wider flex items-center bg-purple-50/50 p-3 rounded-xl">
                                                    <Users className="w-4 h-4 mr-2" />
                                                    Nominee Details
                                                </h4>
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Nominee Name</label>
                                                        <input
                                                            type="text"
                                                            value={profileData?.nominee?.name ?? ''}
                                                            onChange={(e) => setProfileData({
                                                                ...profileData,
                                                                nominee: { ...profileData.nominee, name: e.target.value }
                                                            })}
                                                            className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 outline-none transition-all"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Relationship</label>
                                                        <input
                                                            type="text"
                                                            value={profileData?.nominee?.relation ?? ''}
                                                            onChange={(e) => setProfileData({
                                                                ...profileData,
                                                                nominee: { ...profileData.nominee, relation: e.target.value }
                                                            })}
                                                            className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 outline-none transition-all"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Bank Details */}
                                            <div className="space-y-6">
                                                <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wider flex items-center bg-blue-50/50 p-3 rounded-xl">
                                                    <Building2 className="w-4 h-4 mr-2" />
                                                    Bank Information
                                                </h4>
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <div className="md:col-span-2">
                                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Account Holder Name</label>
                                                        <input
                                                            type="text"
                                                            value={profileData?.bank_details?.accountHolderName ?? ''}
                                                            onChange={(e) => setProfileData({
                                                                ...profileData,
                                                                bank_details: { ...profileData.bank_details, accountHolderName: e.target.value }
                                                            })}
                                                            className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Bank Name</label>
                                                        <input
                                                            type="text"
                                                            value={profileData?.bank_details?.bankName ?? ''}
                                                            onChange={(e) => setProfileData({
                                                                ...profileData,
                                                                bank_details: { ...profileData.bank_details, bankName: e.target.value }
                                                            })}
                                                            className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Account Number</label>
                                                        <input
                                                            type="text"
                                                            value={profileData?.bank_details?.accountNumber ?? ''}
                                                            onChange={(e) => setProfileData({
                                                                ...profileData,
                                                                bank_details: { ...profileData.bank_details, accountNumber: e.target.value }
                                                            })}
                                                            className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">IFSC Code</label>
                                                        <input
                                                            type="text"
                                                            value={profileData?.bank_details?.ifscCode ?? ''}
                                                            onChange={(e) => setProfileData({
                                                                ...profileData,
                                                                bank_details: { ...profileData.bank_details, ifscCode: e.target.value }
                                                            })}
                                                            className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Branch Name</label>
                                                        <input
                                                            type="text"
                                                            value={profileData?.bank_details?.branch ?? ''}
                                                            onChange={(e) => setProfileData({
                                                                ...profileData,
                                                                bank_details: { ...profileData.bank_details, branch: e.target.value }
                                                            })}
                                                            className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex space-x-4 pt-6 border-t border-gray-100">
                                                <button
                                                    type="submit"
                                                    disabled={updateLoading}
                                                    className="flex-1 bg-[#1B8A9F] text-white p-4 rounded-xl font-bold hover:bg-[#167182] transition-all disabled:opacity-50 shadow-md shadow-teal-100 flex items-center justify-center"
                                                >
                                                    {updateLoading ? (
                                                        <>
                                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                                            Saving Changes...
                                                        </>
                                                    ) : 'Save Profile Changes'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsEditing(false)}
                                                    className="px-8 py-4 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all"
                                                >
                                                    Cancel
                                                </button>
                                            </div>

                                            {/* Digital Signature */}
                                            <div className="space-y-6 pt-6 border-t border-gray-100">
                                                <h4 className="text-sm font-bold text-amber-600 uppercase tracking-wider flex items-center bg-amber-50/50 p-3 rounded-xl">
                                                    <Upload className="w-4 h-4 mr-2" />
                                                    Documents & Signature
                                                </h4>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <SignatureUpload
                                                        label="One-Time Signature Upload"
                                                        description="Upload your signature for agreements"
                                                        onUpload={(file) => setSignatureFile(file)}
                                                        onRemove={() => setSignatureFile(null)}
                                                        currentUrl={profileData?.client_signature_url}
                                                        disabled={!!profileData?.client_signature_url}
                                                    />

                                                    <SignatureUpload
                                                        label="PAN Card Image"
                                                        description="Upload a clear photo of your PAN Card"
                                                        onUpload={(file) => setPanFile(file)}
                                                        onRemove={() => setPanFile(null)}
                                                        currentUrl={profileData?.pan_url}
                                                        disabled={!!profileData?.pan_url}
                                                    />

                                                    <SignatureUpload
                                                        label="Aadhaar Card Image"
                                                        description="Upload a clear photo of your Aadhaar Card"
                                                        onUpload={(file) => setAadharFile(file)}
                                                        onRemove={() => setAadharFile(null)}
                                                        currentUrl={profileData?.aadhar_url}
                                                        disabled={!!profileData?.aadhar_url}
                                                    />

                                                    <SignatureUpload
                                                        label="Cancelled Cheque photo"
                                                        description="Upload a photo of your Cancelled Cheque"
                                                        onUpload={(file) => setChequeFile(file)}
                                                        onRemove={() => setChequeFile(null)}
                                                        currentUrl={profileData?.bank_cheque_url}
                                                        disabled={!!profileData?.bank_cheque_url}
                                                    />
                                                </div>

                                                <p className="text-xs font-medium text-amber-600 flex items-center bg-amber-50 p-3 rounded-lg border border-amber-100">
                                                    <ShieldCheck className="w-4 h-4 mr-2" />
                                                    One-time upload: Documents and signature cannot be changed once saved.
                                                </p>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="grid md:grid-cols-2 gap-12">
                                            {/* Profile Information */}
                                            <div className="space-y-8">
                                                <h4 className="text-sm font-bold text-[#1B8A9F] uppercase tracking-wider flex items-center">
                                                    <User className="w-4 h-4 mr-2" />
                                                    Account Details
                                                </h4>
                                                <div className="space-y-6">
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Full Name</label>
                                                        <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                            <User className="w-4 h-4 text-gray-400 mr-3" />
                                                            <span className="text-gray-900 font-medium">{profileData?.full_name || user?.name}</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Email Address</label>
                                                        <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                            <Mail className="w-4 h-4 text-gray-400 mr-3" />
                                                            <span className="text-gray-900 font-medium">{user?.email}</span>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Gender</label>
                                                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-gray-900 font-medium text-sm">
                                                                {profileData?.gender || '—'}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Occupation</label>
                                                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-gray-900 font-medium text-sm">
                                                                {profileData?.occupation || '—'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">PAN Card Number</label>
                                                            <div className="flex items-center space-x-2">
                                                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-gray-900 font-bold text-sm flex-1 font-mono uppercase">
                                                                    {profileData?.pan_number || '—'}
                                                                </div>
                                                                {profileData?.kyc_verified && (
                                                                    <div className="flex items-center px-2 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black uppercase tracking-wider border border-green-100">
                                                                        <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                                                                        Verified
                                                                    </div>
                                                                )}
                                                                {profileData?.pan_url && (
                                                                    <a
                                                                        href={profileData.pan_url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="p-3 bg-[#1B8A9F]/10 text-[#1B8A9F] rounded-lg border border-[#1B8A9F]/20 hover:bg-[#1B8A9F]/20 transition-all group"
                                                                        title="View Document"
                                                                    >
                                                                        <Eye className="w-4 h-4" />
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Aadhaar Number</label>
                                                            <div className="flex items-center space-x-2">
                                                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-gray-900 font-bold text-sm flex-1 font-mono">
                                                                    {profileData?.aadhar_number || '—'}
                                                                </div>
                                                                {profileData?.kyc_verified && (
                                                                    <div className="flex items-center px-2 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black uppercase tracking-wider border border-green-100">
                                                                        <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                                                                        Verified
                                                                    </div>
                                                                )}
                                                                {profileData?.aadhar_url && (
                                                                    <a
                                                                        href={profileData.aadhar_url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="p-3 bg-[#1B8A9F]/10 text-[#1B8A9F] rounded-lg border border-[#1B8A9F]/20 hover:bg-[#1B8A9F]/20 transition-all group"
                                                                        title="View Document"
                                                                    >
                                                                        <Eye className="w-4 h-4" />
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Account Role</label>
                                                        <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                            <ShieldCheck className="w-4 h-4 text-[#1B8A9F] mr-3" />
                                                            <span className="text-[#1B8A9F] font-bold uppercase tracking-wider text-xs">Verified Client</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Security Settings & Meta Info */}
                                            <div className="space-y-8">
                                                <h4 className="text-sm font-bold text-orange-500 uppercase tracking-wider flex items-center">
                                                    <Lock className="w-4 h-4 mr-2" />
                                                    Security Settings
                                                </h4>
                                                <div className="space-y-6">
                                                    <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100">
                                                        <p className="text-sm text-orange-800 font-medium mb-4">Want to secure your account better?</p>
                                                        <button
                                                            onClick={() => setShowResetModal(true)}
                                                            className="w-full bg-orange-500 text-white p-3 rounded-lg font-bold hover:bg-orange-600 transition-all flex items-center justify-center"
                                                        >
                                                            <KeyRound className="w-4 h-4 mr-2" />
                                                            Change Password
                                                        </button>
                                                    </div>

                                                    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Client Status</p>
                                                        <div className="flex items-center text-green-600 mb-2">
                                                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                                                            <span className="text-sm font-bold">Active Portfolio</span>
                                                        </div>
                                                        <p className="text-xs text-gray-500 leading-relaxed">
                                                            Your account is fully verified. You can update your profile details to keep your investment records accurate.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Fee Payment Modal */}
                {showFeeModal && selectedFeeInvestment && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setShowFeeModal(false)}></div>
                        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="p-8">
                                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mx-auto mb-6">
                                    <DollarSign className="w-8 h-8" />
                                </div>
                                <div className="text-center mb-8">
                                    <h3 className="text-2xl font-bold text-gray-900">Trade Management Fee</h3>
                                    <p className="text-gray-500 mt-2">Monthly maintenance fee (1%) for your investment in <strong>{selectedFeeInvestment.product_name || 'TRADERG ASSET'}</strong>.</p>
                                </div>

                                <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100 space-y-4">
                                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                                        <span className="text-sm text-gray-500 font-bold uppercase tracking-wider">Trading Capital</span>
                                        <span className="text-lg font-black text-gray-900">{formatCurrency(selectedFeeInvestment.investment_amount)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-orange-600 font-bold uppercase tracking-wider">Payable Fee (1%)</span>
                                        <span className="text-2xl font-black text-orange-600">{formatCurrency(selectedFeeInvestment.investment_amount * 0.01)}</span>
                                    </div>
                                </div>

                                <form onSubmit={handlePayFee} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Payment Reference (UTR/Ref No.)</label>
                                        <input
                                            type="text"
                                            required
                                            value={feePaymentData.reference}
                                            onChange={(e) => setFeePaymentData({ ...feePaymentData, reference: e.target.value })}
                                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none transition-all"
                                            placeholder="Enter transaction reference number"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Payment Date</label>
                                        <input
                                            type="date"
                                            required
                                            value={feePaymentData.date}
                                            onChange={(e) => setFeePaymentData({ ...feePaymentData, date: e.target.value })}
                                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none transition-all"
                                        />
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowFeeModal(false)}
                                            className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={feeLoading}
                                            className="flex-[2] bg-orange-500 text-white py-4 rounded-xl font-bold hover:bg-orange-600 shadow-lg shadow-orange-100 transition-all disabled:opacity-50 flex items-center justify-center"
                                        >
                                            {feeLoading ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : 'Submit Payment'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )
                }

                {/* Password Reset Modal */}
                {
                    showResetModal && (
                        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"></div>
                            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                                <div className="p-8">
                                    <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mx-auto mb-6">
                                        <Lock className="w-8 h-8" />
                                    </div>
                                    <div className="text-center mb-8">
                                        <h3 className="text-2xl font-bold text-gray-900">Reset Your Password</h3>
                                        <p className="text-gray-500 mt-2">For security reasons, you must change your temporary password before proceeding.</p>
                                    </div>

                                    <form onSubmit={handleResetPassword} className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                                            <input
                                                type="password"
                                                required
                                                value={resetData.newPassword}
                                                onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })}
                                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1B8A9F] outline-none transition-all"
                                                placeholder="Enter at least 6 characters"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Confirm New Password</label>
                                            <input
                                                type="password"
                                                required
                                                value={resetData.confirmPassword}
                                                onChange={(e) => setResetData({ ...resetData, confirmPassword: e.target.value })}
                                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1B8A9F] outline-none transition-all"
                                                placeholder="Repeat password"
                                            />
                                        </div>

                                        {resetError && (
                                            <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-lg border border-red-100">
                                                {resetError}
                                            </div>
                                        )}

                                        {resetSuccess ? (
                                            <div className="p-4 bg-green-50 text-green-600 text-sm font-bold rounded-xl border border-green-100 flex items-center justify-center">
                                                <CheckCircle2 className="w-5 h-5 mr-2" />
                                                Password Updated Successfully
                                            </div>
                                        ) : (
                                            <button
                                                type="submit"
                                                disabled={resetLoading}
                                                className="w-full bg-[#1B8A9F] text-white py-4 rounded-xl font-bold hover:bg-[#156d7d] shadow-lg shadow-teal-100 transition-all disabled:opacity-50 flex items-center justify-center"
                                            >
                                                {resetLoading ? (
                                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                                ) : 'Update & Continue'}
                                            </button>
                                        )}
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}

            </div>
            <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center border-t border-gray-200 mt-10">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                    © {new Date().getFullYear()} TRADERG WEALTH ADVISORY LIMITED • Secure Client Portal
                </p>
            </footer>
        </div >
    );
}
