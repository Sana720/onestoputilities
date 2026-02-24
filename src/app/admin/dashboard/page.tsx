'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
    TrendingUp, LogOut, Users, DollarSign, CheckCircle2,
    Clock, Lock, X, Search, Download, Filter, Briefcase,
    Loader2, Trash2, AlertCircle, ArrowRight, ShieldCheck,
    Sparkles, Upload, User, Mail, MessageCircle, AlertTriangle,
    ArrowUpRight, Edit, Eye, MoreHorizontal, FileText
} from 'lucide-react';

// import { InvestmentAgreement } from '@/components/InvestmentAgreement';
import { supabase } from '@/lib/supabase';
import OnboardingModal from '@/components/admin/OnboardingModal';

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
        accountType?: string;
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
    pan_verified?: boolean;
    aadhar_verified?: boolean;
    bank_cheque_verified?: boolean;
    users?: {
        kyc_verified: boolean;
        signature_url?: string;
    };
    fees?: Array<{
        amount: number;
        payment_reference: string;
        payment_date: string;
        status: string;
        created_at: string;
    }>;
    demat_account?: string;
    user_id: string;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [loading, setLoading] = useState(true);
    const [bulkProgress, setBulkProgress] = useState({ total: 0, current: 0, status: 'idle' as 'idle' | 'processing' | 'completed' | 'error' });
    const [isInvestmentTabReady, setIsInvestmentTabReady] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [productFilter, setProductFilter] = useState('all');

    // Server-Side Pagination States
    const [investmentPage, setInvestmentPage] = useState(1);
    const [hasMoreInvestments, setHasMoreInvestments] = useState(true);
    const [isFetchingInvestments, setIsFetchingInvestments] = useState(false);

    // Server-Side Dashboard Stats
    const [dashboardStats, setDashboardStats] = useState({
        totalInvestment: 0,
        totalClients: 0,
        activeInvestmentsCount: 0,
        totalDividendsPaid: 0
    });
    const [productsList, setProductsList] = useState<string[]>([]);

    const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
    const [showManagementModal, setShowManagementModal] = useState(false);
    const [showDividendModal, setShowDividendModal] = useState(false);
    const [dividendData, setDividendData] = useState({
        amount: '',
        bank_name: '',
        reference_no: '',
        payment_mode: 'NEFT',
        status: 'paid'
    });
    const [editData, setEditData] = useState<any>({});
    const [kycLoading, setKycLoading] = useState(false);
    const [adminSignatureUrl, setAdminSignatureUrl] = useState<string | null>(null);
    const [approving, setApproving] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [showPaymentVerifyModal, setShowPaymentVerifyModal] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [staff, setStaff] = useState<any[]>([]);
    const [staffLoading, setStaffLoading] = useState(false);
    const [staffPage, setStaffPage] = useState(1);
    const [hasMoreStaff, setHasMoreStaff] = useState(true);
    const [showStaffModal, setShowStaffModal] = useState(false);
    const [showBulkImportModal, setShowBulkImportModal] = useState(false);
    const [newStaff, setNewStaff] = useState({
        email: '',
        password: '',
        name: '',
        role: 'manager'
    });
    const [creatingStaff, setCreatingStaff] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [staffLogs, setStaffLogs] = useState<any[]>([]);
    const [staffLogsLoading, setStaffLogsLoading] = useState(false);
    const [logsPage, setLogsPage] = useState(1);
    const [hasMoreLogs, setHasMoreLogs] = useState(true);

    // Password Change State
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
    const [newPassword, setNewPassword] = useState('');
    const [changingPassword, setChangingPassword] = useState(false);

    const handleEditChange = (field: string, value: any) => {
        setEditData((prev: any) => {
            let updated = { ...prev };

            if (field.includes('.')) {
                const [parent, child] = field.split('.');
                updated = {
                    ...prev,
                    [parent]: {
                        ...(prev[parent] || {}),
                        [child]: value
                    }
                };
            } else {
                updated = { ...prev, [field]: value };
            }

            // Auto-calculate lock-in dates if payment_date changes for Unlisted Shares
            if (field === 'payment_date' && updated.product_name === 'Unlisted Shares') {
                const pDate = new Date(value);
                if (!isNaN(pDate.getTime())) {
                    updated.lock_in_start_date = value;
                    const endDate = new Date(pDate);
                    endDate.setFullYear(endDate.getFullYear() + (updated.lock_in_period || 3));
                    updated.lock_in_end_date = endDate.toISOString().split('T')[0];
                }
            }

            return updated;
        });
    };

    const handleVerifyKYC = async (userId: string, verified: boolean, silent: boolean = false) => {
        if (!silent && !confirm(`Are you sure you want to ${verified ? 'verify' : 'unverify'} this client's KYC?`)) return;

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
                    inv.user_id === userId ? {
                        ...inv,
                        users: inv.users ? { ...inv.users, kyc_verified: verified } : { kyc_verified: verified }
                    } : inv
                ));
                if (selectedInvestment && selectedInvestment.user_id === userId) {
                    setSelectedInvestment(prev => prev ? {
                        ...prev,
                        users: prev.users ? { ...prev.users, kyc_verified: verified } : { kyc_verified: verified }
                    } : null);
                }
                if (!silent) alert(`KYC ${verified ? 'verified' : 'unverified'} successfully!`);
            } else {
                const error = await response.json();
                if (!silent) alert(error.error || 'Failed to update KYC status');
            }
        } catch (error) {
            console.error('Error verifying KYC:', error);
            if (!silent) alert('An error occurred while verifying KYC');
        } finally {
            setKycLoading(false);
        }
    };

    const handleGranularVerify = async (investmentId: string, field: 'pan' | 'aadhar' | 'bank_cheque', verified: boolean) => {
        setKycLoading(true);
        try {
            const response = await fetch('/api/admin/kyc/granular', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ investmentId, field, verified }),
            });

            if (response.ok) {
                const column = `${field}_verified` as keyof Investment;
                setInvestments(prev => prev.map(inv =>
                    inv.id === investmentId ? { ...inv, [column]: verified } : inv
                ));

                if (selectedInvestment && selectedInvestment.id === investmentId) {
                    const updated = { ...selectedInvestment, [column]: verified };
                    setSelectedInvestment(updated);

                    // Auto-update global KYC status based on document checks
                    const allVerified = updated.pan_verified && updated.aadhar_verified && updated.bank_cheque_verified;

                    if (allVerified && !updated.users?.kyc_verified) {
                        handleVerifyKYC(updated.user_id, true, true);
                    } else if (!allVerified && updated.users?.kyc_verified) {
                        handleVerifyKYC(updated.user_id, false, true);
                    }
                }
            } else {
                const error = await response.json();
                alert(error.error || `Failed to update ${field} verification`);
            }
        } catch (error) {
            console.error(`Error verifying ${field}:`, error);
            alert(`An error occurred while verifying ${field}`);
        } finally {
            setKycLoading(false);
        }
    };

    const handleSendOTP = async () => {
        if (!selectedInvestment) return;
        setOtpLoading(true);
        try {
            const response = await fetch('/api/admin/otp/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    investmentId: selectedInvestment.id,
                    managerName: user?.name || 'Manager'
                }),
            });
            if (response.ok) {
                setOtpSent(true);
                alert('OTP has been sent to the Admin email.');
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to send OTP');
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            alert('An error occurred while sending OTP');
        } finally {
            setOtpLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (!selectedInvestment || !otp) return;
        setOtpLoading(true);
        try {
            const response = await fetch('/api/admin/otp/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    investmentId: selectedInvestment.id,
                    otp
                }),
            });
            if (response.ok) {
                // Update local state
                setSelectedInvestment(prev => prev ? { ...prev, payment_verified: true } : null);
                setInvestments(prev => prev.map(inv =>
                    inv.id === selectedInvestment.id ? { ...inv, payment_verified: true } : inv
                ));
                setShowPaymentVerifyModal(false);
                setOtp('');
                setOtpSent(false);
                alert('Payment verified successfully!');
            } else {
                const error = await response.json();
                alert(error.error || 'Invalid OTP');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            alert('An error occurred while verifying OTP');
        } finally {
            setOtpLoading(false);
        }
    };
    const [activeTab, setActiveTab] = useState<'investments' | 'ledger' | 'pending_dividends' | 'referrals' | 'staff' | 'logs'>('investments');
    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
    const [ledgerLimit, setLedgerLimit] = useState(20);
    const [isEditingDividend, setIsEditingDividend] = useState(false);
    const [editDividendData, setEditDividendData] = useState<any>(null);
    const [updatingDividend, setUpdatingDividend] = useState(false);
    const [syncing, setSyncing] = useState(false);

    const [referrals, setReferrals] = useState<any[]>([]);
    const [referralsLoading, setReferralsLoading] = useState(false);
    const [referralsPage, setReferralsPage] = useState(1);
    const [hasMoreReferrals, setHasMoreReferrals] = useState(true);

    const fetchAdminReferrals = async (page = 1, reset = false) => {
        try {
            setReferralsLoading(true);
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: '20',
                search: searchTerm
            });
            const response = await fetch(`/api/admin/referrals?${queryParams}`);
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
            console.error('Error fetching admin referrals:', error);
        } finally {
            setReferralsLoading(false);
        }
    };

    const fetchStaff = async (page = 1, reset = false) => {
        try {
            setStaffLoading(true);
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: '20',
                search: searchTerm
            });
            const response = await fetch(`/api/admin/staff?${queryParams}`);
            const data = await response.json();
            if (response.ok) {
                if (reset || page === 1) {
                    setStaff(data.staff || []);
                } else {
                    setStaff(prev => {
                        const existingIds = new Set(prev.map(s => s.id));
                        const newItems = (data.staff || []).filter((s: any) => !existingIds.has(s.id));
                        return [...prev, ...newItems];
                    });
                }
                setHasMoreStaff((data.staff || []).length === 20);
            }
        } catch (error) {
            console.error('Error fetching staff:', error);
        } finally {
            setStaffLoading(false);
        }
    };

    const fetchStaffLogs = async (page = 1, reset = false) => {
        setStaffLogsLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: '50',
                search: searchTerm
            });
            const response = await fetch(`/api/admin/logs?${queryParams}`);
            const data = await response.json();
            if (data.success) {
                if (reset || page === 1) {
                    setStaffLogs(data.logs || []);
                } else {
                    setStaffLogs(prev => {
                        const existingIds = new Set(prev.map(l => l.id));
                        const newItems = (data.logs || []).filter((l: any) => !existingIds.has(l.id));
                        return [...prev, ...newItems];
                    });
                }
                setHasMoreLogs((data.logs || []).length === 50);
            }
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setStaffLogsLoading(false);
        }
    };

    // Infinite Scroll Observer
    const observer = useRef<IntersectionObserver | null>(null);
    const lastElementRef = useCallback((node: HTMLDivElement | null) => {
        if (loading || isFetchingInvestments || referralsLoading || staffLoading || staffLogsLoading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                if (activeTab === 'investments' && hasMoreInvestments) {
                    setInvestmentPage(prev => prev + 1);
                } else if (activeTab === 'referrals' && hasMoreReferrals) {
                    setReferralsPage(prev => prev + 1);
                } else if (activeTab === 'staff' && hasMoreStaff) {
                    setStaffPage(prev => prev + 1);
                } else if (activeTab === 'logs' && hasMoreLogs) {
                    setLogsPage(prev => prev + 1);
                } else if (activeTab === 'ledger') {
                    setLedgerLimit(prev => prev + 20);
                }
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, isFetchingInvestments, referralsLoading, staffLoading, staffLogsLoading, activeTab, hasMoreInvestments, hasMoreReferrals, hasMoreStaff, hasMoreLogs]);

    useEffect(() => {
        if (activeTab === 'investments' && investmentPage > 1) {
            fetchAllInvestments(investmentPage);
        } else if (activeTab === 'referrals' && referralsPage > 1) {
            fetchAdminReferrals(referralsPage);
        } else if (activeTab === 'staff' && staffPage > 1) {
            fetchStaff(staffPage);
        } else if (activeTab === 'logs' && logsPage > 1) {
            fetchStaffLogs(logsPage);
        }
    }, [investmentPage, referralsPage, staffPage, logsPage]);

    useEffect(() => {
        if (activeTab === 'investments') {
            setInvestmentPage(1);
            setHasMoreInvestments(true);
            fetchAllInvestments(1, true);
            fetchDashboardStats();
        } else if (activeTab === 'referrals') {
            setReferralsPage(1);
            setHasMoreReferrals(true);
            fetchAdminReferrals(1, true);
        } else if (activeTab === 'staff') {
            setStaffPage(1);
            setHasMoreStaff(true);
            fetchStaff(1, true);
        } else if (activeTab === 'logs') {
            setLogsPage(1);
            setHasMoreLogs(true);
            fetchStaffLogs(1, true);
        }
    }, [activeTab, searchTerm, statusFilter, productFilter]);

    // Reset limits on tab switch or search
    useEffect(() => {
        setLedgerLimit(20);
    }, [activeTab]);

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
                if (parsedUser.role !== 'admin' && parsedUser.role !== 'manager') {
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

                if (role !== 'admin' && role !== 'manager') {
                    router.push('/login');
                    return;
                }

                const updatedUser = { ...session.user, ...userData, role };
                setUser(updatedUser);

                // Fetch admin signature with better error handling
                const { data: adminData, error: adminError } = await supabase
                    .from('users')
                    .select('signature_url')
                    .eq('role', 'admin')
                    .limit(1)
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
                if (userData.role === 'admin' || userData.role === 'manager') {
                    setUser({ ...session.user, ...userData });
                    localStorage.setItem('user', JSON.stringify({ ...session.user, ...userData }));
                }
            }
        });

        return () => subscription.unsubscribe();
    }, [router]);

    const fetchDashboardStats = async () => {
        try {
            const queryParams = new URLSearchParams({
                search: searchTerm,
                status: statusFilter,
                product: productFilter
            });
            const response = await fetch(`/api/admin/stats?${queryParams}`);
            const data = await response.json();
            if (data.success) {
                setDashboardStats(data.stats);
                setProductsList(data.products);
            }
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        }
    };

    const fetchAllInvestments = async (page = 1, reset = false) => {
        try {
            setIsFetchingInvestments(true);
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: '20',
                search: searchTerm,
                status: statusFilter,
                product: productFilter
            });
            const response = await fetch(`/api/admin/investments?${queryParams}`);
            const data = await response.json();

            if (response.ok) {
                if (reset || page === 1) {
                    setInvestments(data.investments || []);
                } else {
                    setInvestments(prev => {
                        const existingIds = new Set(prev.map(inv => inv.id));
                        const newItems = (data.investments || []).filter((inv: any) => !existingIds.has(inv.id));
                        return [...prev, ...newItems];
                    });
                }
                setHasMoreInvestments((data.investments || []).length === 20);
                setIsInvestmentTabReady(true);
            }
        } catch (error) {
            console.error('Error fetching investments:', error);
        } finally {
            setIsFetchingInvestments(false);
            setLoading(false);
            setIsInvestmentTabReady(true);
        }
    };

    const handleLogout = async () => {
        if (user) {
            try {
                // Try to record logout event before signing out
                await fetch('/api/auth/logout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: user.id,
                        email: user.email,
                        role: user.role
                    })
                });
            } catch (err) {
                console.error('Error logging logout:', err);
            }
        }
        await supabase.auth.signOut();
        localStorage.removeItem('user');
        localStorage.removeItem('session');
        router.push('/login');
    };

    const handleManageInvestment = async (investment: Investment) => {
        setIsEditMode(false);
        setSelectedInvestment(investment);
        setEditData({
            ...investment,
            dividend_rate: investment.product_name === 'Unlisted Shares' ? 18 : (Number(investment.dividend_rate) || 0),
        });
        setShowManagementModal(true);
        // Ensure admin signature is fresh
        if (!adminSignatureUrl) {
            const { data } = await supabase
                .from('users')
                .select('signature_url')
                .eq('role', 'admin')
                .limit(1)
                .maybeSingle();
            if (data?.signature_url) {
                setAdminSignatureUrl(data.signature_url);
            }
        }
    };

    const handleCreateStaff = async () => {
        if (!newStaff.email || !newStaff.password || !newStaff.name) {
            alert('Please fill all fields');
            return;
        }

        setCreatingStaff(true);
        try {
            const response = await fetch('/api/admin/staff', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newStaff)
            });

            if (response.ok) {
                setShowStaffModal(false);
                setNewStaff({ email: '', password: '', name: '', role: 'manager' });
                fetchStaff();
                alert('Staff added successfully');
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to add staff');
            }
        } catch (error) {
            console.error('Error creating staff:', error);
            alert('An error occurred');
        } finally {
            setCreatingStaff(false);
        }
    };

    const handleChangePassword = async () => {
        if (!selectedStaffId || !newPassword || newPassword.length < 6) {
            alert('Please enter a valid password (minimum 6 characters).');
            return;
        }

        setChangingPassword(true);
        try {
            const response = await fetch(`/api/admin/staff/${selectedStaffId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    password: newPassword,
                    adminId: user?.id
                })
            });

            if (response.ok) {
                setShowPasswordModal(false);
                setNewPassword('');
                setSelectedStaffId(null);
                alert('Password updated successfully');
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to update password');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            alert('An error occurred');
        } finally {
            setChangingPassword(false);
        }
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
                setShowManagementModal(false);
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





    const products = productsList.length > 0 ? productsList : ['TRADERG ASSET', 'Unlisted Shares'];

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
                description: `Investment: ${inv.product_name || 'TRADERG ASSET'}`,
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
                    description: `Dividend: ${inv.product_name || 'TRADERG ASSET'}`,
                    amount: div.amount,
                    bank: div.bank_name || 'N/A',
                    payment_mode: div.payment_mode || 'N/A',
                    reference: div.reference_no || 'N/A',
                    dividend_rate: inv.dividend_rate,
                    status: div.status
                });
            });

            // Add each PAID fee as inflow (credit)
            (inv.fees || []).forEach((fee, idx) => {
                if (fee.status === 'paid') {
                    ledger.push({
                        id: inv.id,
                        feeIndex: idx,
                        date: fee.payment_date,
                        client: inv.full_name,
                        email: inv.email,
                        type: 'CREDIT',
                        description: `Management Fee: ${inv.product_name || 'TRADERG ASSET'}`,
                        amount: fee.amount,
                        bank: inv.bank_details?.bankName || 'N/A',
                        payment_mode: 'UPI/NEFT',
                        reference: fee.payment_reference,
                        status: 'paid'
                    });
                }
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
        link.setAttribute('download', `TRADERG_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
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
        <>
            <div className="min-h-screen bg-gray-50/50">
                {/* Header */}
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
                            <p className="text-2xl md:text-3xl font-black text-gray-900">{formatCurrency(dashboardStats.totalInvestment)}</p>
                            <p className="text-xs text-gray-400 mt-1 font-medium italic">Total Assets Under Management</p>
                        </div>

                        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-[#4ADE80]">
                                    <Users className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Clients</span>
                            </div>
                            <p className="text-2xl md:text-3xl font-black text-gray-900">{dashboardStats.totalClients}</p>
                            <p className="text-xs text-gray-400 mt-1 font-medium italic">Verified Investors</p>
                        </div>

                        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-500">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active</span>
                            </div>
                            <p className="text-2xl md:text-3xl font-black text-gray-900">{dashboardStats.activeInvestmentsCount}</p>
                            <p className="text-xs text-gray-400 mt-1 font-medium italic">Active Portfolios</p>
                        </div>

                        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-500">
                                    <DollarSign className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Payouts</span>
                            </div>
                            <p className="text-2xl md:text-3xl font-black text-gray-900">{formatCurrency(dashboardStats.totalDividendsPaid)}</p>
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
                        <button
                            onClick={() => setActiveTab('referrals')}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'referrals'
                                ? 'bg-white text-[#1B8A9F] shadow-sm'
                                : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            Referrals
                        </button>
                        {(user?.role === 'admin' || user?.role === 'manager') && (
                            <button
                                onClick={() => setActiveTab('staff')}
                                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'staff'
                                    ? 'bg-white text-[#1B8A9F] shadow-sm'
                                    : 'text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                Staff
                            </button>
                        )}
                        {user?.role === 'admin' && (
                            <button
                                onClick={() => setActiveTab('logs')}
                                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'logs'
                                    ? 'bg-white text-[#1B8A9F] shadow-sm'
                                    : 'text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                Activity Logs
                            </button>
                        )}
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
                                                : activeTab === 'referrals'
                                                    ? 'Referral Network'
                                                    : activeTab === 'staff'
                                                        ? 'Staff Management'
                                                        : activeTab === 'logs'
                                                            ? 'Staff Activity Logs'
                                                            : 'Global Financial Ledger'}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1 font-medium">
                                        {activeTab === 'investments'
                                            ? 'Verify applications and manage dividend payouts'
                                            : activeTab === 'pending_dividends'
                                                ? 'Track and manage dividends awaiting payment'
                                                : activeTab === 'referrals'
                                                    ? 'Global view of all client referrals and relationships'
                                                    : activeTab === 'staff'
                                                        ? 'Manage administrators and managers'
                                                        : activeTab === 'logs'
                                                            ? 'System log of staff actions'
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
                                    {activeTab === 'staff' && user?.role === 'admin' && (
                                        <button
                                            onClick={() => setShowStaffModal(true)}
                                            className="inline-flex items-center justify-center bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-gray-800 transition-all"
                                        >
                                            <Users className="w-4 h-4 mr-2" />
                                            Add Staff
                                        </button>
                                    )}
                                    {activeTab === 'investments' && (
                                        <button
                                            onClick={() => setShowBulkImportModal(true)}
                                            className="inline-flex items-center justify-center bg-[#1B8A9F] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#156d7d] transition-all"
                                        >
                                            <Upload className="w-4 h-4 mr-2" />
                                            Import
                                        </button>
                                    )}
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder={activeTab === 'staff' ? "Search staff..." : activeTab === 'logs' ? "Search activities..." : "Search clients..."}
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
                            {activeTab === 'staff' ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gray-50/50">
                                                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Name</th>
                                                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</th>
                                                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Role</th>
                                                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Added On</th>
                                                <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {staff.map((member, idx) => (
                                                <tr key={member.id} className="hover:bg-gray-50/50 transition-colors group" ref={idx === staff.length - 1 ? (node => lastElementRef(node as any)) : null}>
                                                    <td className="px-8 py-5">
                                                        <span className="text-sm font-bold text-gray-900">{member.name}</span>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <span className="text-sm text-gray-500 font-medium">{member.email}</span>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${member.role === 'admin' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                                                            {member.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <span className="text-sm text-gray-500 font-medium">{formatDate(member.created_at)}</span>
                                                    </td>
                                                    <td className="px-8 py-5 text-right">
                                                        {user?.role === 'admin' && (
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedStaffId(member.id);
                                                                    setShowPasswordModal(true);
                                                                }}
                                                                className="p-2.5 bg-gray-50 text-gray-400 hover:text-[#1B8A9F] hover:bg-teal-50 rounded-xl transition-all"
                                                                title="Change Password"
                                                            >
                                                                <Lock className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {staffLoading && (
                                        <div className="p-8 text-center">
                                            <Loader2 className="w-6 h-6 animate-spin text-[#1B8A9F] mx-auto" />
                                        </div>
                                    )}
                                </div>
                            ) : activeTab === 'referrals' ? (
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50/50">
                                            <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Referred User</th>
                                            <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Referred By</th>
                                            <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Joined Date</th>
                                            <th className="px-8 py-5 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Verification</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {referralsLoading ? (
                                            <tr>
                                                <td colSpan={4} className="py-20 text-center">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <Loader2 className="w-12 h-12 text-[#1B8A9F] animate-spin" />
                                                        <p className="text-gray-500 mt-4 font-medium italic">Mapping referral network...</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : referrals.length > 0 ? (
                                            referrals.filter(r => {
                                                const matchesSearch = r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                    r.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                    r.referrer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                    r.referred_by_code?.toLowerCase().includes(searchTerm.toLowerCase());
                                                return matchesSearch;
                                            }).map((referral) => (
                                                <tr key={referral.id} className="hover:bg-gray-50/50 transition-colors group">
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-[#1B8A9F]/10 flex items-center justify-center text-[#1B8A9F] font-bold">
                                                                {referral.name?.charAt(0) || 'U'}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-gray-900">{referral.name || 'Anonymous'}</p>
                                                                <p className="text-xs text-gray-500">{referral.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold text-gray-700">{referral.referrer?.name || 'N/A'}</span>
                                                            <span className="text-[10px] font-black text-[#1B8A9F] uppercase tracking-widest">{referral.referred_by_code}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-sm text-gray-500 font-medium">
                                                        {new Date(referral.created_at).toLocaleDateString('en-IN', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <span className="px-2.5 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-green-100">
                                                            Verified User
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="py-20 text-center">
                                                    <div className="text-center py-20 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 mx-8">
                                                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                                                            <Sparkles className="w-8 h-8 text-gray-300" />
                                                        </div>
                                                        <h4 className="text-gray-900 font-bold uppercase tracking-tight">No Referrals Recorded</h4>
                                                        <p className="text-gray-500 text-sm mt-1 max-w-xs mx-auto">Referral relationships will appear here once new users join using referral codes.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            ) : activeTab === 'investments' ? (
                                !isInvestmentTabReady ? (
                                    <div className="flex flex-col items-center justify-center py-20">
                                        <Loader2 className="w-12 h-12 text-[#1B8A9F] animate-spin" />
                                        <p className="text-gray-500 mt-4 font-medium">Loading investments table...</p>
                                    </div>
                                ) : (
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
                                                {investments.map((investment, idx) => (
                                                    <tr
                                                        key={investment.id}
                                                        ref={idx === investments.length - 1 ? (node => lastElementRef(node as any)) : null}
                                                        className="hover:bg-gray-50/50 transition-colors group"
                                                    >
                                                        <td className="px-8 py-6">
                                                            <button
                                                                onClick={() => handleManageInvestment(investment)}
                                                                className="text-sm font-bold text-gray-900 leading-none hover:text-[#1B8A9F] transition-colors text-left"
                                                            >
                                                                {investment.full_name}
                                                            </button>
                                                            <p className="text-[10px] text-[#1B8A9F] font-black uppercase tracking-widest mt-1.5">{investment.product_name || 'TRADERG ASSET'}</p>
                                                            <p className="text-xs text-gray-400 mt-1 flex items-center">
                                                                <Mail className="w-3 h-3 mr-1" />
                                                                {investment.email}
                                                            </p>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <p className="text-sm font-bold text-gray-900 leading-none">{formatCurrency(investment.investment_amount)}</p>
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1.5">
                                                                {investment.number_of_shares || (investment.product_name === 'Unlisted Shares' ? Math.floor(investment.investment_amount / 100) : 0)} Units
                                                            </p>
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
                                                                    onClick={() => handleManageInvestment(investment)}
                                                                    className="p-2.5 bg-gray-50 text-gray-400 hover:text-[#1B8A9F] hover:bg-teal-50 rounded-xl transition-all"
                                                                >
                                                                    <Edit className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleAddDividend(investment)}
                                                                    disabled={false}
                                                                    className="p-2.5 bg-gray-50 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-xl transition-all disabled:opacity-50"
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
                                                                {investment.product_name === 'Unlisted Shares' ? (
                                                                    <div className="p-2.5 bg-gray-50 text-gray-400 rounded-xl opacity-50" title="Agreement NA">
                                                                        <Lock className="w-4 h-4" />
                                                                    </div>
                                                                ) : (
                                                                    <div className="p-2.5 bg-teal-50 text-teal-600 rounded-xl border border-teal-100" title="T&C Agreed">
                                                                        <CheckCircle2 className="w-4 h-4" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )
                            ) : activeTab === 'logs' ? (
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50/50">
                                            <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Staff Member</th>
                                            <th className="px-6 py-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Action</th>
                                            <th className="px-6 py-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Timestamp</th>
                                            <th className="px-6 py-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">IP Address</th>
                                            <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">System Info</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {staffLogsLoading ? (
                                            <tr>
                                                <td colSpan={5} className="py-20 text-center">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <Loader2 className="w-12 h-12 text-[#1B8A9F] animate-spin" />
                                                        <p className="text-gray-500 mt-4 font-medium italic">Fetching activity logs...</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : staffLogs.length > 0 ? (
                                            staffLogs.map((log, idx) => (
                                                <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group" ref={idx === staffLogs.length - 1 ? (node => lastElementRef(node as any)) : null}>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center">
                                                            <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 mr-3">
                                                                <User className="w-4 h-4" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-black text-gray-900">{log.users?.name || log.email}</p>
                                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{log.role} • {log.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${log.action === 'LOGIN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                            {log.action}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <p className="text-xs font-bold text-gray-700">{formatDate(log.created_at)}</p>
                                                        <p className="text-[10px] text-gray-400 mt-0.5">{new Date(log.created_at).toLocaleTimeString()}</p>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <p className="text-[10px] font-mono text-gray-500">{log.ip_address}</p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="text-[10px] text-gray-400 truncate max-w-xs" title={log.user_agent}>
                                                            {log.user_agent}
                                                        </p>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="py-20 text-center">
                                                    <div className="text-center py-20 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 mx-8">
                                                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                                                            <FileText className="w-8 h-8 text-gray-300" />
                                                        </div>
                                                        <h4 className="text-gray-900 font-bold uppercase tracking-tight">No Activity Logs Found</h4>
                                                        <p className="text-gray-500 text-sm mt-1 max-w-xs mx-auto">Staff activity and system events will be recorded here.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            ) : (
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50/50">
                                            <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                                            <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Client</th>
                                            <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Product/Purpose</th>
                                            <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type</th>
                                            <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Bank</th>
                                            <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                                            <th className="px-8 py-5 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Reference</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {getLedgerData().filter(item => {
                                            const matchesSearch = item.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                item.reference.toLowerCase().includes(searchTerm.toLowerCase());
                                            const matchesTab = (activeTab as string) === 'pending_dividends'
                                                ? (item.type === 'DEBIT' && item.status === 'pending')
                                                : (item.type === 'DEBIT' ? item.status === 'paid' : true);
                                            return matchesSearch && matchesTab;
                                        }).slice(0, ledgerLimit).map((item, idx, arr) => (
                                            <tr
                                                key={idx}
                                                ref={idx === arr.length - 1 ? (node => lastElementRef(node as any)) : null}
                                                className="hover:bg-gray-50/50 transition-colors"
                                            >
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
                                                    <p className="text-xs font-bold text-gray-900">{item.description}</p>
                                                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">{item.payment_mode}</p>
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

                        {(activeTab === 'investments' ? investments.length : activeTab === 'referrals' ? referrals.length : activeTab === 'staff' ? staff.length : activeTab === 'logs' ? staffLogs.length : getLedgerData().length) === 0 && (
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
                {/* Consolidated Management Modal */}
                {showManagementModal && selectedInvestment && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                        <div className="bg-white rounded-3xl shadow-2xl p-0 max-w-2xl w-full border border-gray-100 animate-fade-in-up overflow-hidden max-h-[90vh] flex flex-col">
                            {/* Header */}
                            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                                <div className="flex items-center space-x-4">
                                    <div>
                                        <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">Investment Management</h3>
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
                                <div className="flex items-center space-x-3">
                                    {user?.role === 'admin' && (
                                        <button
                                            onClick={() => {
                                                if (isEditMode) {
                                                    handleUpdateInvestment();
                                                } else {
                                                    setIsEditMode(true);
                                                }
                                            }}
                                            disabled={updateLoading}
                                            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isEditMode
                                                ? 'bg-green-500 text-white shadow-lg shadow-green-100 hover:bg-green-600'
                                                : 'bg-white text-[#1B8A9F] border-2 border-[#1B8A9F] hover:bg-[#1B8A9F] hover:text-white'
                                                }`}
                                        >
                                            {updateLoading ? (
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            ) : isEditMode ? (
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                            ) : (
                                                <Edit className="w-3.5 h-3.5" />
                                            )}
                                            <span>{isEditMode ? 'Guard Changes' : 'Edit Mode'}</span>
                                        </button>
                                    )}
                                    <button onClick={() => setShowManagementModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
                                        <X className="w-6 h-6 text-gray-400" />
                                    </button>
                                </div>
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
                                            {isEditMode ? (
                                                <input
                                                    type="text"
                                                    value={editData.full_name || ''}
                                                    onChange={(e) => handleEditChange('full_name', e.target.value)}
                                                    className="w-full text-sm font-black text-gray-900 bg-white border border-gray-200 rounded-lg px-3 py-2 focus:border-[#1B8A9F] focus:ring-1 focus:ring-[#1B8A9F] outline-none"
                                                />
                                            ) : (
                                                <p className="text-sm font-black text-gray-900">{selectedInvestment.full_name}</p>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Father's Name</p>
                                            {isEditMode ? (
                                                <input
                                                    type="text"
                                                    value={editData.father_name || ''}
                                                    onChange={(e) => handleEditChange('father_name', e.target.value)}
                                                    className="w-full text-sm font-bold text-gray-900 bg-white border border-gray-200 rounded-lg px-3 py-2"
                                                />
                                            ) : (
                                                <p className="text-sm font-bold text-gray-900">{selectedInvestment.father_name || 'N/A'}</p>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Date of Birth</p>
                                            {isEditMode ? (
                                                <input
                                                    type="date"
                                                    value={editData.dob || ''}
                                                    onChange={(e) => handleEditChange('dob', e.target.value)}
                                                    className="w-full text-sm font-bold text-gray-900 bg-white border border-gray-200 rounded-lg px-3 py-2"
                                                />
                                            ) : (
                                                <p className="text-sm font-bold text-gray-900">{formatDate(selectedInvestment.dob || '')}</p>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Gender</p>
                                            {isEditMode ? (
                                                <select
                                                    value={editData.gender || ''}
                                                    onChange={(e) => handleEditChange('gender', e.target.value)}
                                                    className="w-full text-sm font-bold text-gray-900 bg-white border border-gray-200 rounded-lg px-3 py-2"
                                                >
                                                    <option value="">Select Gender</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            ) : (
                                                <p className="text-sm font-bold text-gray-900">{selectedInvestment.gender || 'N/A'} {selectedInvestment.age ? `(${selectedInvestment.age} yrs)` : ''}</p>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Email Address</p>
                                            {isEditMode ? (
                                                <input
                                                    type="email"
                                                    value={editData.email || ''}
                                                    onChange={(e) => handleEditChange('email', e.target.value)}
                                                    className="w-full text-sm font-bold text-[#1B8A9F] bg-white border border-gray-200 rounded-lg px-3 py-2"
                                                />
                                            ) : (
                                                <p className="text-sm font-bold text-[#1B8A9F]">{selectedInvestment.email}</p>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Contact Number</p>
                                            {isEditMode ? (
                                                <input
                                                    type="text"
                                                    value={editData.contact_number || ''}
                                                    onChange={(e) => handleEditChange('contact_number', e.target.value)}
                                                    className="w-full text-sm font-bold text-gray-900 bg-white border border-gray-200 rounded-lg px-3 py-2"
                                                />
                                            ) : (
                                                <p className="text-sm font-bold text-gray-900">{selectedInvestment.contact_number || 'N/A'}</p>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">PAN Number</p>
                                            {isEditMode ? (
                                                <input
                                                    type="text"
                                                    value={editData.pan_number || ''}
                                                    onChange={(e) => handleEditChange('pan_number', e.target.value)}
                                                    className="w-full text-sm font-bold text-gray-900 uppercase bg-white border border-gray-200 rounded-lg px-3 py-2"
                                                />
                                            ) : (
                                                <p className="text-sm font-bold text-gray-900 uppercase font-mono">{selectedInvestment.pan_number || 'Not Provided'}</p>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Aadhaar Number</p>
                                            {isEditMode ? (
                                                <input
                                                    type="text"
                                                    value={editData.aadhar_number || ''}
                                                    onChange={(e) => handleEditChange('aadhar_number', e.target.value)}
                                                    className="w-full text-sm font-bold text-gray-900 bg-white border border-gray-200 rounded-lg px-3 py-2"
                                                />
                                            ) : (
                                                <p className="text-sm font-bold text-gray-900 font-mono">{selectedInvestment.aadhar_number || 'Not Provided'}</p>
                                            )}
                                        </div>
                                        <div className="md:col-span-2">
                                            <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Permanent Address</p>
                                            {isEditMode ? (
                                                <textarea
                                                    value={editData.permanent_address || ''}
                                                    onChange={(e) => handleEditChange('permanent_address', e.target.value)}
                                                    className="w-full text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg px-3 py-2 min-h-[80px]"
                                                />
                                            ) : (
                                                <p className="text-sm font-medium text-gray-700">{selectedInvestment.permanent_address || 'N/A'}</p>
                                            )}
                                        </div>
                                    </div>
                                </section>

                                {/* Investment Details */}
                                <section>
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                                        Investment Configuration
                                    </h4>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 bg-white border-2 border-green-50 rounded-2xl p-6">
                                        <div>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">
                                                {selectedInvestment.product_name === 'Unlisted Shares' ? 'Principal Amount' : 'Trade Capital'}
                                            </p>
                                            {isEditMode ? (
                                                <input
                                                    type="number"
                                                    value={editData.investment_amount || 0}
                                                    onChange={(e) => handleEditChange('investment_amount', Number(e.target.value))}
                                                    className="w-full text-sm font-black text-green-600 bg-white border border-gray-200 rounded-lg px-3 py-2"
                                                />
                                            ) : (
                                                <p className="text-sm font-black text-green-600">{formatCurrency(selectedInvestment.investment_amount)}</p>
                                            )}
                                        </div>
                                        {selectedInvestment.product_name === 'Unlisted Shares' && (
                                            <div>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Units (Shares)</p>
                                                {isEditMode ? (
                                                    <input
                                                        type="number"
                                                        value={editData.number_of_shares || 0}
                                                        onChange={(e) => handleEditChange('number_of_shares', Number(e.target.value))}
                                                        className="w-full text-sm font-bold text-gray-900 bg-white border border-gray-200 rounded-lg px-3 py-2"
                                                    />
                                                ) : (
                                                    <p className="text-sm font-bold text-gray-900">{selectedInvestment.number_of_shares || Math.floor(selectedInvestment.investment_amount / 100)}</p>
                                                )}
                                            </div>
                                        )}
                                        {selectedInvestment.product_name === 'Unlisted Shares' ? (
                                            <>
                                                <div>
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Face Value / Unit</p>
                                                    {isEditMode ? (
                                                        <input
                                                            type="number"
                                                            value={editData.face_value_per_share || 0}
                                                            onChange={(e) => handleEditChange('face_value_per_share', Number(e.target.value))}
                                                            className="w-full text-sm font-bold text-gray-900 bg-white border border-gray-200 rounded-lg px-3 py-2"
                                                        />
                                                    ) : (
                                                        <p className="text-sm font-bold text-gray-900">₹{selectedInvestment.face_value_per_share}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Yield Rate (%)</p>
                                                    <div className="w-full bg-teal-50 border border-teal-100 rounded-lg px-3 py-2 text-sm font-black text-[#1B8A9F]">
                                                        18% (Fixed)
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Trading Management Fees (1%)</p>
                                                <p className="text-sm font-bold text-gray-900">
                                                    {formatCurrency(selectedInvestment.investment_amount * 0.01)}
                                                </p>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Investment Status</p>
                                            <select
                                                value={editData.status}
                                                onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-teal-100 transition-all"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="approved">Approved</option>
                                                <option value="active">Active</option>
                                                <option value="matured">Matured</option>
                                                <option value="bought_back">Liquidated</option>
                                            </select>
                                        </div>
                                        {selectedInvestment.product_name === 'Unlisted Shares' && (
                                            <>
                                                <div>
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Lock-in Period (Years)</p>
                                                    {isEditMode ? (
                                                        <input
                                                            type="number"
                                                            value={editData.lock_in_period || 0}
                                                            onChange={(e) => handleEditChange('lock_in_period', Number(e.target.value))}
                                                            className="w-full text-sm font-bold text-gray-900 bg-white border border-gray-200 rounded-lg px-3 py-2"
                                                        />
                                                    ) : (
                                                        <p className="text-sm font-bold text-gray-900">
                                                            {`${selectedInvestment.lock_in_period} Years`}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="md:col-span-1">
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Maturity Date</p>
                                                    {isEditMode ? (
                                                        <input
                                                            type="date"
                                                            value={editData.lock_in_end_date || ''}
                                                            onChange={(e) => handleEditChange('lock_in_end_date', e.target.value)}
                                                            className="w-full text-sm font-bold text-orange-600 bg-white border border-gray-200 rounded-lg px-3 py-2"
                                                        />
                                                    ) : (
                                                        <p className="text-sm font-bold text-orange-600">
                                                            {formatDate(selectedInvestment.lock_in_end_date)}
                                                        </p>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Broker Name</p>
                                                    {isEditMode ? (
                                                        <input
                                                            type="text"
                                                            value={editData.broker_name || ''}
                                                            onChange={(e) => handleEditChange('broker_name', e.target.value)}
                                                            className="w-full text-sm font-bold text-gray-900 bg-white border border-gray-200 rounded-lg px-3 py-2"
                                                        />
                                                    ) : (
                                                        <p className="text-sm font-bold text-gray-900">{selectedInvestment.broker_name || 'Direct'}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Broker ID</p>
                                                    {isEditMode ? (
                                                        <input
                                                            type="text"
                                                            value={editData.broker_id || ''}
                                                            onChange={(e) => handleEditChange('broker_id', e.target.value)}
                                                            className="w-full text-sm font-bold text-gray-900 bg-white border border-gray-200 rounded-lg px-3 py-2"
                                                        />
                                                    ) : (
                                                        <p className="text-sm font-bold text-gray-900">{selectedInvestment.broker_id || 'N/A'}</p>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </section>

                                {/* settlement & bank section omitted for brevity in this step, but I'll include it to ensure completeness of the replacement */}
                                {/* Bank Details */}
                                <section>
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                                        Settlement Account details
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-blue-50/30 rounded-2xl p-6 border border-blue-50">
                                        <div>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Bank Name</p>
                                            {isEditMode ? (
                                                <input
                                                    type="text"
                                                    value={editData.bank_details?.bankName || ''}
                                                    onChange={(e) => handleEditChange('bank_details.bankName', e.target.value)}
                                                    className="w-full text-sm font-bold text-gray-900 bg-white border border-gray-200 rounded-lg px-3 py-2"
                                                />
                                            ) : (
                                                <p className="text-sm font-bold text-gray-900">{selectedInvestment.bank_details?.bankName || 'N/A'}</p>
                                            )}
                                        </div>
                                        <div className="md:col-span-1">
                                            <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Account Number</p>
                                            {isEditMode ? (
                                                <input
                                                    type="text"
                                                    value={editData.bank_details?.accountNumber || ''}
                                                    onChange={(e) => handleEditChange('bank_details.accountNumber', e.target.value)}
                                                    className="w-full text-sm font-mono font-bold text-gray-900 bg-white border border-gray-200 rounded-lg px-3 py-2"
                                                />
                                            ) : (
                                                <p className="text-sm font-mono font-bold text-gray-900">{selectedInvestment.bank_details?.accountNumber || 'N/A'}</p>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-[9px) font-bold text-gray-400 uppercase mb-1">IFSC Code</p>
                                            {isEditMode ? (
                                                <input
                                                    type="text"
                                                    value={editData.bank_details?.ifscCode || ''}
                                                    onChange={(e) => handleEditChange('bank_details.ifscCode', e.target.value)}
                                                    className="w-full text-sm font-bold text-gray-900 uppercase bg-white border border-gray-200 rounded-lg px-3 py-2"
                                                />
                                            ) : (
                                                <p className="text-sm font-bold text-gray-900 uppercase">{selectedInvestment.bank_details?.ifscCode || 'N/A'}</p>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Branch</p>
                                            {isEditMode ? (
                                                <input
                                                    type="text"
                                                    value={editData.bank_details?.branch || ''}
                                                    onChange={(e) => handleEditChange('bank_details.branch', e.target.value)}
                                                    className="w-full text-sm font-bold text-gray-900 bg-white border border-gray-200 rounded-lg px-3 py-2"
                                                />
                                            ) : (
                                                <p className="text-sm font-bold text-gray-900">{selectedInvestment.bank_details?.branch || 'N/A'}</p>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Account Type</p>
                                            {isEditMode ? (
                                                <select
                                                    value={editData.bank_details?.accountType || ''}
                                                    onChange={(e) => handleEditChange('bank_details.accountType', e.target.value)}
                                                    className="w-full text-sm font-bold text-gray-900 bg-white border border-gray-200 rounded-lg px-3 py-2"
                                                >
                                                    <option value="">Select Type</option>
                                                    <option value="Savings">Savings</option>
                                                    <option value="Current">Current</option>
                                                </select>
                                            ) : (
                                                <p className="text-sm font-bold text-gray-900">{selectedInvestment.bank_details?.accountType || 'N/A'}</p>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Demat Account No.</p>
                                            {isEditMode ? (
                                                <input
                                                    type="text"
                                                    value={editData.demat_account || ''}
                                                    onChange={(e) => handleEditChange('demat_account', e.target.value)}
                                                    className="w-full text-sm font-bold text-gray-900 bg-white border border-gray-200 rounded-lg px-3 py-2"
                                                    placeholder="Enter Demat ID"
                                                />
                                            ) : (
                                                <p className="text-sm font-bold text-gray-900">{selectedInvestment.demat_account || 'N/A'}</p>
                                            )}
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
                                                {isEditMode ? (
                                                    <input
                                                        type="text"
                                                        value={editData.nominee?.name || editData.nominee?.fullName || ''}
                                                        onChange={(e) => handleEditChange('nominee.name', e.target.value)}
                                                        className="w-full text-sm font-bold text-gray-900 bg-white border border-gray-200 rounded-lg px-3 py-2"
                                                    />
                                                ) : (
                                                    <p className="text-sm font-bold text-gray-900">{selectedInvestment.nominee.name || selectedInvestment.nominee.fullName || 'N/A'}</p>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Relationship</p>
                                                {isEditMode ? (
                                                    <input
                                                        type="text"
                                                        value={editData.nominee?.relation || editData.nominee?.relationship || ''}
                                                        onChange={(e) => handleEditChange('nominee.relation', e.target.value)}
                                                        className="w-full text-sm font-bold text-gray-900 bg-white border border-gray-200 rounded-lg px-3 py-2"
                                                    />
                                                ) : (
                                                    <p className="text-sm font-bold text-gray-900">{selectedInvestment.nominee.relation || selectedInvestment.nominee.relationship || 'N/A'}</p>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Nominee DOB</p>
                                                {isEditMode ? (
                                                    <input
                                                        type="date"
                                                        value={editData.nominee?.dob || ''}
                                                        onChange={(e) => handleEditChange('nominee.dob', e.target.value)}
                                                        className="w-full text-sm font-bold text-gray-900 bg-white border border-gray-200 rounded-lg px-3 py-2"
                                                    />
                                                ) : (
                                                    <p className="text-sm font-bold text-gray-900">{formatDate(selectedInvestment.nominee.dob || '')}</p>
                                                )}
                                            </div>
                                            <div className="md:col-span-3">
                                                <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Nominee Address</p>
                                                {isEditMode ? (
                                                    <textarea
                                                        value={editData.nominee?.address || ''}
                                                        onChange={(e) => handleEditChange('nominee.address', e.target.value)}
                                                        className="w-full text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg px-3 py-2"
                                                    />
                                                ) : (
                                                    <p className="text-sm font-medium text-gray-700">{selectedInvestment.nominee.address || 'N/A'}</p>
                                                )}
                                            </div>
                                        </div>
                                    </section>
                                )}

                                {/* Transaction Information */}
                                <section>
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></div>
                                        Transaction Information
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-green-50/20 rounded-2xl p-6 border border-green-100/30">
                                        <div>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Payment Mode</p>
                                            {isEditMode ? (
                                                <input
                                                    type="text"
                                                    value={editData.payment_mode || ''}
                                                    onChange={(e) => handleEditChange('payment_mode', e.target.value)}
                                                    className="w-full text-sm font-black text-gray-900 uppercase bg-white border border-gray-200 rounded-lg px-3 py-2"
                                                />
                                            ) : (
                                                <p className="text-sm font-black text-gray-900 uppercase">{selectedInvestment.payment_mode || 'N/A'}</p>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Reference Number / UTR</p>
                                            {isEditMode ? (
                                                <input
                                                    type="text"
                                                    value={editData.payment_reference || ''}
                                                    onChange={(e) => handleEditChange('payment_reference', e.target.value)}
                                                    className="w-full text-sm font-mono font-black text-[#1B8A9F] bg-white border border-gray-200 rounded-lg px-3 py-2"
                                                />
                                            ) : (
                                                <p className="text-sm font-mono font-black text-[#1B8A9F]">{selectedInvestment.payment_reference || 'N/A'}</p>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Payment Date</p>
                                            {isEditMode ? (
                                                <input
                                                    type="date"
                                                    value={editData.payment_date || ''}
                                                    onChange={(e) => handleEditChange('payment_date', e.target.value)}
                                                    className="w-full text-sm font-bold text-gray-900 bg-white border border-gray-200 rounded-lg px-3 py-2"
                                                />
                                            ) : (
                                                <p className="text-sm font-bold text-gray-900">{formatDate(selectedInvestment.payment_date || '')}</p>
                                            )}
                                        </div>
                                    </div>
                                </section>

                                {/* Fee Collection Tracking */}
                                {selectedInvestment.product_name !== 'Unlisted Shares' && (
                                    <section>
                                        <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-4 flex items-center">
                                            <AlertTriangle className="w-3.5 h-3.5 mr-2" />
                                            Fee Collection History & Verification
                                        </h4>
                                        <div className="bg-orange-50/30 rounded-2xl p-6 border border-orange-50">
                                            {selectedInvestment.fees && selectedInvestment.fees.length > 0 ? (
                                                <div className="space-y-4">
                                                    {selectedInvestment.fees.map((fee: any, idx: number) => (
                                                        <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white rounded-xl border border-orange-100 gap-4">
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                                                                <div>
                                                                    <p className="text-[8px] font-bold text-gray-400 uppercase mb-0.5">Fee Amount</p>
                                                                    <p className="text-sm font-black text-gray-900">{formatCurrency(fee.amount)}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-[8px] font-bold text-gray-400 uppercase mb-0.5">Reference No.</p>
                                                                    <p className="text-sm font-mono font-bold text-gray-600">{fee.payment_reference}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-[8px] font-bold text-gray-400 uppercase mb-0.5">Payment Date</p>
                                                                    <p className="text-sm font-bold text-gray-900">{formatDate(fee.payment_date)}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-[8px] font-bold text-gray-400 uppercase mb-0.5">Status</p>
                                                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${fee.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                                                        }`}>
                                                                        {fee.status}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            {fee.status === 'pending' && (
                                                                <button
                                                                    onClick={async () => {
                                                                        const updatedFees = [...(selectedInvestment.fees || [])];
                                                                        updatedFees[idx].status = 'paid';
                                                                        setUpdateLoading(true);
                                                                        try {
                                                                            const response = await fetch(`/api/admin/investments/${selectedInvestment.id}`, {
                                                                                method: 'PATCH',
                                                                                headers: { 'Content-Type': 'application/json' },
                                                                                body: JSON.stringify({ fees: updatedFees })
                                                                            });
                                                                            if (response.ok) {
                                                                                setSelectedInvestment({ ...selectedInvestment, fees: updatedFees });
                                                                                fetchAllInvestments();
                                                                                alert('Fee payment verified successfully!');
                                                                            }
                                                                        } catch (err) {
                                                                            console.error(err);
                                                                        } finally {
                                                                            setUpdateLoading(false);
                                                                        }
                                                                    }}
                                                                    className="px-4 py-2 bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-orange-600 transition-all shadow-md shadow-orange-100"
                                                                >
                                                                    Verify Payment
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-6">
                                                    <p className="text-sm text-gray-400 font-medium">No fee collection records found for this investment.</p>
                                                </div>
                                            )}
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
                                            <div className="flex flex-col gap-2">
                                                <a
                                                    href={selectedInvestment.pan_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`relative flex flex-col items-center justify-center p-4 border rounded-2xl transition-all group w-full ${selectedInvestment.pan_verified ? 'bg-teal-50 border-teal-100' : 'bg-gray-50 border-gray-100 hover:bg-teal-50 hover:border-teal-100'}`}
                                                >
                                                    {selectedInvestment.pan_verified && (
                                                        <div className="absolute top-2 right-2 flex items-center bg-green-500 text-white rounded-full px-2 py-0.5 shadow-sm">
                                                            <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
                                                            <span className="text-[7px] font-black uppercase tracking-tighter transition-all whitespace-nowrap">Verified</span>
                                                        </div>
                                                    )}
                                                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mb-2 group-hover:text-[#1B8A9F]">
                                                        <Eye className="w-5 h-5" />
                                                    </div>
                                                    <p className={`text-[10px] font-black uppercase ${selectedInvestment.pan_verified ? 'text-[#1B8A9F]' : 'text-gray-400 group-hover:text-[#1B8A9F]'}`}>View PAN Card</p>
                                                </a>
                                                <button
                                                    onClick={() => handleGranularVerify(selectedInvestment.id, 'pan', !selectedInvestment.pan_verified)}
                                                    disabled={kycLoading}
                                                    className={`py-2 px-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 ${selectedInvestment.pan_verified
                                                        ? 'bg-green-500 text-white shadow-md shadow-green-100'
                                                        : 'bg-white text-gray-400 border border-gray-100 hover:border-teal-200 hover:text-[#1B8A9F]'
                                                        }`}
                                                >
                                                    {selectedInvestment.pan_verified ? <ShieldCheck className="w-3 h-3" /> : <div className="w-1 h-1 bg-gray-300 rounded-full mr-1" />}
                                                    {selectedInvestment.pan_verified ? 'Verified' : 'Verify PAN'}
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center p-4 bg-gray-50 border border-gray-100 rounded-2xl opacity-50">
                                                <p className="text-[10px] font-black uppercase text-gray-400">PAN Not Uploaded</p>
                                            </div>
                                        )}

                                        {selectedInvestment.aadhar_url ? (
                                            <div className="flex flex-col gap-2">
                                                <a
                                                    href={selectedInvestment.aadhar_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`relative flex flex-col items-center justify-center p-4 border rounded-2xl transition-all group w-full ${selectedInvestment.aadhar_verified ? 'bg-teal-50 border-teal-100' : 'bg-gray-50 border-gray-100 hover:bg-teal-50 hover:border-teal-100'}`}
                                                >
                                                    {selectedInvestment.aadhar_verified && (
                                                        <div className="absolute top-2 right-2 flex items-center bg-green-500 text-white rounded-full px-2 py-0.5 shadow-sm">
                                                            <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
                                                            <span className="text-[7px] font-black uppercase tracking-tighter transition-all whitespace-nowrap">Verified</span>
                                                        </div>
                                                    )}
                                                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mb-2 group-hover:text-[#1B8A9F]">
                                                        <Eye className="w-5 h-5" />
                                                    </div>
                                                    <p className={`text-[10px] font-black uppercase ${selectedInvestment.aadhar_verified ? 'text-[#1B8A9F]' : 'text-gray-400 group-hover:text-[#1B8A9F]'}`}>View Aadhaar</p>
                                                </a>
                                                <button
                                                    onClick={() => handleGranularVerify(selectedInvestment.id, 'aadhar', !selectedInvestment.aadhar_verified)}
                                                    disabled={kycLoading}
                                                    className={`py-2 px-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 ${selectedInvestment.aadhar_verified
                                                        ? 'bg-green-500 text-white shadow-md shadow-green-100'
                                                        : 'bg-white text-gray-400 border border-gray-100 hover:border-teal-200 hover:text-[#1B8A9F]'
                                                        }`}
                                                >
                                                    {selectedInvestment.aadhar_verified ? <ShieldCheck className="w-3 h-3" /> : <div className="w-1 h-1 bg-gray-300 rounded-full mr-1" />}
                                                    {selectedInvestment.aadhar_verified ? 'Verified' : 'Verify Aadhaar'}
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center p-4 bg-gray-50 border border-gray-100 rounded-2xl opacity-50">
                                                <p className="text-[10px] font-black uppercase text-gray-400">Aadhaar Not Uploaded</p>
                                            </div>
                                        )}

                                        {selectedInvestment.bank_cheque_url ? (
                                            <div className="flex flex-col gap-2">
                                                <a
                                                    href={selectedInvestment.bank_cheque_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`relative flex flex-col items-center justify-center p-4 border rounded-2xl transition-all group w-full ${selectedInvestment.bank_cheque_verified ? 'bg-teal-50 border-teal-100' : 'bg-gray-50 border-gray-100 hover:bg-teal-50 hover:border-teal-100'}`}
                                                >
                                                    {selectedInvestment.bank_cheque_verified && (
                                                        <div className="absolute top-2 right-2 flex items-center bg-green-500 text-white rounded-full px-2 py-0.5 shadow-sm">
                                                            <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
                                                            <span className="text-[7px] font-black uppercase tracking-tighter transition-all whitespace-nowrap">Verified</span>
                                                        </div>
                                                    )}
                                                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mb-2 group-hover:text-[#1B8A9F]">
                                                        <Eye className="w-5 h-5" />
                                                    </div>
                                                    <p className={`text-[10px] font-black uppercase ${selectedInvestment.bank_cheque_verified ? 'text-[#1B8A9F]' : 'text-gray-400 group-hover:text-[#1B8A9F]'}`}>View Cheque</p>
                                                </a>
                                                <button
                                                    onClick={() => handleGranularVerify(selectedInvestment.id, 'bank_cheque', !selectedInvestment.bank_cheque_verified)}
                                                    disabled={kycLoading}
                                                    className={`py-2 px-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 ${selectedInvestment.bank_cheque_verified
                                                        ? 'bg-green-500 text-white shadow-md shadow-green-100'
                                                        : 'bg-white text-gray-400 border border-gray-100 hover:border-teal-200 hover:text-[#1B8A9F]'
                                                        }`}
                                                >
                                                    {selectedInvestment.bank_cheque_verified ? <ShieldCheck className="w-3 h-3" /> : <div className="w-1 h-1 bg-gray-300 rounded-full mr-1" />}
                                                    {selectedInvestment.bank_cheque_verified ? 'Verified' : 'Verify Cheque'}
                                                </button>
                                            </div>
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
                                            {selectedInvestment.product_name === 'Unlisted Shares' ? 'Client Signature' : 'Acceptance Status'}
                                        </h4>
                                        {selectedInvestment.product_name === 'Unlisted Shares' ? (
                                            selectedInvestment.client_signature_url ? (
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
                                            )
                                        ) : (
                                            <div className="p-6 bg-green-50/50 border-2 border-green-200 rounded-2xl flex items-center gap-4 text-green-700">
                                                <CheckCircle2 className="w-6 h-6" />
                                                <div>
                                                    <p className="text-sm font-bold">Terms & Conditions Accepted</p>
                                                    <p className="text-[10px] uppercase font-black tracking-widest opacity-60">Via Application Form</p>
                                                </div>
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
                                                onClick={() => setShowPaymentVerifyModal(true)}
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

                                            {selectedInvestment.product_name === 'Unlisted Shares' && (
                                                !selectedInvestment.admin_signed_at ? (
                                                    <button
                                                        disabled={!!selectedInvestment.admin_signed_at || !selectedInvestment.payment_verified || !adminSignatureUrl || approving}
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
                                                        {adminSignatureUrl && (
                                                            <img
                                                                src={adminSignatureUrl}
                                                                alt="Admin Signature"
                                                                className="h-10 w-auto opacity-80"
                                                            />
                                                        )}
                                                    </div>
                                                )
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
                                    {selectedInvestment.users?.kyc_verified && (
                                        <div className="flex items-center bg-green-50 px-4 py-2 rounded-xl border border-green-100 mr-2">
                                            <ShieldCheck className="w-3.5 h-3.5 text-green-600 mr-2" />
                                            <span className="text-[9px] font-black text-green-700 uppercase tracking-widest">KYC Verified</span>
                                        </div>
                                    )}
                                    <button
                                        onClick={handleUpdateInvestment}
                                        disabled={false}
                                        className="px-6 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-[10px] font-black text-gray-900 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all uppercase tracking-widest disabled:opacity-50"
                                    >
                                        Guard Changes
                                    </button>
                                    <button
                                        onClick={() => setShowManagementModal(false)}
                                        className="px-6 py-2.5 bg-[#1B8A9F] rounded-xl text-[10px] font-black text-white hover:bg-[#156d7d] transition-all uppercase tracking-widest shadow-lg shadow-teal-100"
                                    >
                                        Dismiss
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}


                {/* Payment Breakdown Modal */}
                {showPaymentVerifyModal && selectedInvestment && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
                        <div className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 border border-teal-100/30">
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h3 className="text-xl font-black text-gray-900 tracking-tight">Verify Payment</h3>
                                        <p className="text-[10px] font-black text-[#1B8A9F] uppercase tracking-widest mt-1">Security Checkpoint</p>
                                    </div>
                                    <button
                                        onClick={() => setShowPaymentVerifyModal(false)}
                                        className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full text-gray-400 hover:bg-gray-100 transition-all"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="bg-gray-50 rounded-3xl p-6 mb-8 border border-gray-100">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                                            <span className="text-[10px] font-black uppercase text-gray-400">Total Amount</span>
                                            <span className="text-sm font-black text-gray-900">₹{selectedInvestment.investment_amount?.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                                            <span className="text-[10px] font-black uppercase text-gray-400">Payment Mode</span>
                                            <div className="flex items-center">
                                                <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2"></div>
                                                <span className="text-[10px] font-bold text-gray-700">{selectedInvestment.payment_mode}</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                                            <span className="text-[10px] font-black uppercase text-gray-400">Reference No</span>
                                            <span className="text-[10px] font-mono font-bold text-gray-900 bg-white px-2 py-1 rounded-md border border-gray-200">
                                                {selectedInvestment.payment_reference}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black uppercase text-gray-400">Payment Date</span>
                                            <span className="text-[10px] font-bold text-gray-700">{selectedInvestment.payment_date}</span>
                                        </div>
                                    </div>
                                </div>

                                {user?.role === 'manager' ? (
                                    <div className="space-y-6">
                                        {!otpSent ? (
                                            <div className="text-center">
                                                <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                                                    As a manager, you need an OTP from the Admin to verify this payment.
                                                </p>
                                                <button
                                                    onClick={handleSendOTP}
                                                    disabled={otpLoading}
                                                    className="w-full bg-[#1B8A9F] text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-[#156d7d] transition-all shadow-xl shadow-teal-100 flex items-center justify-center gap-3 disabled:opacity-50"
                                                >
                                                    {otpLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                                                    Send OTP to Admin
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                                                <div>
                                                    <label className="text-[10px] font-black uppercase text-[#1B8A9F] tracking-[0.2em] mb-4 block text-center">Enter 6-Digit OTP</label>
                                                    <input
                                                        type="text"
                                                        maxLength={6}
                                                        value={otp}
                                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                                        placeholder="000000"
                                                        className="w-full text-center text-3xl font-black tracking-[0.5em] py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[#1B8A9F] focus:ring-0 transition-all placeholder:text-gray-200"
                                                    />
                                                </div>
                                                <button
                                                    onClick={handleVerifyOTP}
                                                    disabled={otpLoading || otp.length !== 6}
                                                    className="w-full bg-green-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-green-600 transition-all shadow-xl shadow-green-100 flex items-center justify-center gap-3 disabled:opacity-50"
                                                >
                                                    {otpLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                                    Verify & Confirm
                                                </button>
                                                <button
                                                    onClick={() => setOtpSent(false)}
                                                    className="w-full text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-all"
                                                >
                                                    Resend Code
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <button
                                        onClick={async () => {
                                            setUpdateLoading(true);
                                            try {
                                                const { error } = await supabase
                                                    .from('investments')
                                                    .update({ payment_verified: !selectedInvestment.payment_verified })
                                                    .eq('id', selectedInvestment.id);

                                                if (!error) {
                                                    const newStatus = !selectedInvestment.payment_verified;
                                                    setSelectedInvestment({ ...selectedInvestment, payment_verified: newStatus });
                                                    setInvestments(prev => prev.map(inv =>
                                                        inv.id === selectedInvestment.id ? { ...inv, payment_verified: newStatus } : inv
                                                    ));
                                                    setShowPaymentVerifyModal(false);
                                                    alert(`Payment ${newStatus ? 'verified' : 'unverified'} successfully!`);
                                                }
                                            } catch (err) {
                                                console.error(err);
                                            } finally {
                                                setUpdateLoading(false);
                                            }
                                        }}
                                        disabled={updateLoading}
                                        className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 ${selectedInvestment.payment_verified
                                            ? 'bg-red-50 text-red-600 shadow-red-50 hover:bg-red-100'
                                            : 'bg-green-500 text-white shadow-green-100 hover:bg-green-600'
                                            }`}
                                    >
                                        {updateLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                                        {selectedInvestment.payment_verified ? 'Unverify Payment' : 'Confirm Verification'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}


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
                                        disabled={false}
                                        className="w-full bg-[#1B8A9F] text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-teal-100 hover:bg-[#156d7d] transition-all disabled:opacity-50"
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

                {/* Staff Management Modal */}
                {showStaffModal && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
                        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border border-gray-100 animate-fade-in-up">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">Add Staff Member</h3>
                                    <p className="text-xs text-gray-500 mt-1">Create an admin or manager account</p>
                                </div>
                                <button onClick={() => setShowStaffModal(false)} className="text-gray-400 hover:text-gray-900">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. John Doe"
                                        value={newStaff.name}
                                        onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                                        className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#1B8A9F] outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="email@example.com"
                                        value={newStaff.email}
                                        onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                                        className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#1B8A9F] outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Password</label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={newStaff.password}
                                        onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                                        className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#1B8A9F] outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">System Role</label>
                                    <select
                                        value={newStaff.role}
                                        onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                                        className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#1B8A9F] outline-none transition-all appearance-none"
                                    >
                                        <option value="manager">Manager (Read-only)</option>
                                        <option value="admin">Administrator (Full Access)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleCreateStaff}
                                    disabled={creatingStaff}
                                    className="w-full bg-gray-900 text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-gray-200 hover:bg-black transition-all disabled:opacity-50"
                                >
                                    {creatingStaff ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Create Staff Account'}
                                </button>
                                <button
                                    onClick={() => setShowStaffModal(false)}
                                    className="w-full bg-gray-50 text-gray-500 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center border-t border-gray-200 mt-10">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
                        TraderG Admin Engine v4.0 • Enterprise Wealth Management Systems
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
                                            {selectedTransaction.description.includes('Management Fee') ? 'Management Fee' :
                                                selectedTransaction.type === 'CREDIT' ? 'Investment Entry' : 'Dividend Payout'}
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
                                                    {selectedTransaction.description.includes('Management Fee') ? (
                                                        <>
                                                            <div className="col-span-2">
                                                                <p className="text-[9px] text-gray-400 uppercase font-bold">Invoiced Product</p>
                                                                <p className="text-xs font-bold text-white uppercase">{selectedTransaction.description.split(': ')[1]}</p>
                                                            </div>
                                                            <div className="col-span-2">
                                                                <p className="text-[9px] text-gray-400 uppercase font-bold">Transaction Category</p>
                                                                <p className="text-xs font-bold text-white uppercase">Monthly Trade Management Fee (1%)</p>
                                                            </div>
                                                        </>
                                                    ) : selectedTransaction.type === 'CREDIT' ? (
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
                                                                <p className="text-[9px] text-gray-400 uppercase font-bold">Assigned Broker</p>
                                                                <p className="text-xs font-bold text-teal-400 uppercase">
                                                                    {selectedTransaction.broker_name || 'Direct / None'}
                                                                    <span className="text-gray-500 font-mono ml-2 text-[10px]">({selectedTransaction.broker_id || 'N/A'})</span>
                                                                </p>
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

            <OnboardingModal
                isOpen={showBulkImportModal}
                onClose={() => setShowBulkImportModal(false)}
                onComplete={() => {
                    setShowBulkImportModal(false);
                    fetchAllInvestments();
                }}
            />

            {/* Change Password Modal */}
            {
                showPasswordModal && (
                    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
                            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Change Password</h3>
                                    <p className="text-sm text-gray-500 mt-1 font-medium">Enter a new password for the selected staff member.</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowPasswordModal(false);
                                        setNewPassword('');
                                        setSelectedStaffId(null);
                                    }}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-8 space-y-6">
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">New Password</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-teal-100 transition-all font-medium"
                                        placeholder="Enter new password"
                                    />
                                </div>
                                <button
                                    onClick={handleChangePassword}
                                    disabled={changingPassword || !newPassword || newPassword.length < 6}
                                    className="w-full bg-[#1B8A9F] text-white py-4 rounded-2xl font-bold hover:bg-[#156d7d] transition-all disabled:opacity-50 flex justify-center items-center"
                                >
                                    {changingPassword && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                                    Update Password
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
}

