'use client';

import React, { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, User, Users as UsersIcon, Building2, DollarSign, CheckCircle2, Loader2, Sparkles, ShieldCheck, Eye, PenTool, X, Lock, LayoutGrid } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { SignatureUpload } from '@/components/SignatureUpload';

function ApplyForm() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        // Personal Details
        fullName: '',
        fatherName: '',
        dob: '',
        age: '',
        gender: '',
        occupation: '',
        permanentAddress: '',
        contactNumber: '',
        email: '',
        panNumber: '',
        maritalStatus: '',
        aadharNumber: '',

        // Nominee Details
        nomineeName: '',
        nomineeRelation: '',
        nomineeDob: '',
        nomineeAddress: '',

        // Bank Details
        accountNumber: '',
        bankName: '',
        branch: '',
        ifscCode: '',
        micrCode: '',
        accountType: '',

        // Investment Details
        investmentAmount: '',
        numberOfShares: '',
        paymentMode: '',
        paymentReference: '',
        paymentDate: new Date().toISOString().split('T')[0],
        dematAccount: '',

        // Product & Broker
        productName: '',
        brokerId: '',
        brokerName: '',
        panUrl: '',
        aadharUrl: '',
        bankChequeUrl: '',
        kycVerified: false,
        referralCode: '',
    });

    const [files, setFiles] = useState<{
        panFile: File | null;
        aadharFile: File | null;
        bankChequeFile: File | null;
        signatureFile: File | null;
    }>({
        panFile: null,
        aadharFile: null,
        bankChequeFile: null,
        signatureFile: null,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isPreFilled, setIsPreFilled] = useState(false);
    const [brokers, setBrokers] = useState<any[]>([]);
    const [showTCModal, setShowTCModal] = useState(false);
    const [agreedToTC, setAgreedToTC] = useState(false);
    const [existingSignatureUrl, setExistingSignatureUrl] = useState<string | null>(null);
    const [isReferralLocked, setIsReferralLocked] = useState(false);
    const [isValidating, setIsValidating] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    const productOptions = [
        {
            id: 'Intraday Trading',
            title: 'Intraday Trading',
            horizon: '1 Month',
            returns: 'Weekly up to 1%',
            risk: 'High',
            suitableFor: 'Active Traders',
            icon: LayoutGrid,
            color: 'teal'
        },
        {
            id: 'Short-Term SIP',
            title: 'Short-Term SIP',
            horizon: '3 Months',
            returns: 'Quarterly up to 6%',
            risk: 'Moderate',
            suitableFor: 'Short-term Planners',
            icon: Sparkles,
            color: 'blue'
        },
        {
            id: 'Long-Term Holding',
            title: 'Long-Term Holding',
            horizon: '1 Year',
            returns: 'Yearly up to 20%',
            risk: 'Low',
            suitableFor: 'Long Term Investors',
            icon: ShieldCheck,
            color: 'green'
        },
        {
            id: 'Unlisted Shares',
            title: 'Unlisted Shares',
            horizon: '3 Years',
            returns: 'Yearly up to 18%',
            risk: 'Very Low',
            suitableFor: 'HNI / NRI Investors',
            icon: Lock,
            color: 'teal'
        }
    ];

    const searchParams = useSearchParams();

    useEffect(() => {
        const ref = searchParams.get('ref');
        if (ref) {
            setFormData(prev => ({ ...prev, referralCode: ref }));
            setIsReferralLocked(true);
        }

        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setUserId(session.user.id);
                // Fetch the latest investment for this user to pre-fill details
                const { data: investments, error } = await supabase
                    .from('investments')
                    .select('*, users(kyc_verified)')
                    .eq('user_id', session.user.id)
                    .order('created_at', { ascending: false })
                    .limit(1);

                if (error) {
                    console.error('Error fetching latest investment:', error);
                }

                if (investments && investments.length > 0) {
                    const latest = investments[0];
                    setFormData(prev => ({
                        ...prev,
                        fullName: latest.full_name || prev.fullName,
                        fatherName: latest.father_name || prev.fatherName,
                        dob: latest.dob || prev.dob,
                        age: latest.age?.toString() || prev.age,
                        gender: latest.gender || prev.gender,
                        occupation: latest.occupation || prev.occupation,
                        permanentAddress: latest.permanent_address || prev.permanentAddress,
                        contactNumber: latest.contact_number || prev.contactNumber,
                        email: latest.email || prev.email,
                        panNumber: latest.pan_number || prev.panNumber,
                        maritalStatus: latest.marital_status || prev.maritalStatus,
                        aadharNumber: latest.aadhar_number || prev.aadharNumber,

                        // Nominee
                        nomineeName: latest.nominee?.name || prev.nomineeName,
                        nomineeRelation: latest.nominee?.relation || prev.nomineeRelation,
                        nomineeDob: latest.nominee?.dob || prev.nomineeDob,
                        nomineeAddress: latest.nominee?.address || prev.nomineeAddress,

                        // Bank
                        bankName: latest.bank_details?.bankName || prev.bankName,
                        branch: latest.bank_details?.branch || prev.branch,
                        ifscCode: latest.bank_details?.ifscCode || prev.ifscCode,
                        micrCode: latest.bank_details?.micrCode || prev.micrCode,
                        accountType: latest.bank_details?.accountType || prev.accountType,
                        accountNumber: latest.bank_details?.accountNumber || prev.accountNumber,

                        // CDSL
                        dematAccount: latest.demat_account || prev.dematAccount,

                        // KYC Persistence
                        panUrl: latest.pan_url || '',
                        aadharUrl: latest.aadhar_url || '',
                        bankChequeUrl: latest.bank_cheque_url || '',
                        kycVerified: latest.users?.kyc_verified || false
                    }));
                    if (latest.client_signature_url) {
                        setExistingSignatureUrl(latest.client_signature_url);
                    }
                    setIsPreFilled(true);
                } else {
                    // If no investment found, just fill the email from auth
                    setFormData(prev => ({ ...prev, email: session.user.email || '' }));
                }
            }
        };

        checkSession();

        const fetchBrokers = async () => {
            try {
                const res = await fetch('/api/brokers');
                const data = await res.json();
                if (data.brokers) {
                    setBrokers(data.brokers);
                }
            } catch (error) {
                console.error('Error fetching brokers:', error);
            }
        };

        fetchBrokers();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Auto-calculate age from DOB
        if (name === 'dob' && value) {
            const birthDate = new Date(value);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            setFormData(prev => ({ ...prev, age: age.toString() }));
        }

        // Auto-calculate number of shares from investment amount
        if (name === 'investmentAmount') {
            const amount = parseFloat(value);
            if (!isNaN(amount)) {
                const shares = Math.floor(amount / 100);
                setFormData(prev => ({ ...prev, numberOfShares: shares.toString() }));

                // Real-time validation for minimum amount
                if (amount < 500000) {
                    setErrors(prev => ({ ...prev, investmentAmount: 'Minimum investment is ₹5,00,000' }));
                } else {
                    setErrors(prev => ({ ...prev, [name]: '' }));
                }
            } else {
                setErrors(prev => ({ ...prev, [name]: '' }));
            }
        }

        // Clear error for this field (if not handled above)
        if (name !== 'investmentAmount' && errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'panFile' | 'aadharFile' | 'bankChequeFile') => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, [field]: 'File size must be less than 5MB' }));
                return;
            }
            setFiles(prev => ({ ...prev, [field]: file }));
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const uploadFile = async (file: File, path: string): Promise<string | null> => {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
            const fullPath = `${path}/${fileName}`;

            const { data, error } = await supabase.storage
                .from('documents')
                .upload(fullPath, file);

            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage
                .from('documents')
                .getPublicUrl(fullPath);

            return publicUrl;
        } catch (error) {
            console.error(`Error uploading ${path}:`, error);
            return null;
        }
    };

    const formatIndianNumber = (num: string | number) => {
        const x = num.toString();
        const lastThree = x.substring(x.length - 3);
        const otherNumbers = x.substring(0, x.length - 3);
        if (otherNumbers !== '') {
            return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree;
        }
        return lastThree;
    };

    const validateStep = (step: number): boolean => {
        const newErrors: Record<string, string> = {};

        if (step === 1) {
            if (!formData.productName) newErrors.productName = 'Product selection is required';
        }

        if (step === 2) {
            if (!formData.fullName) newErrors.fullName = 'Full name is required';
            if (!formData.fatherName) newErrors.fatherName = 'Father\'s name is required';
            if (!formData.dob) newErrors.dob = 'Date of birth is required';
            else {
                const birthDate = new Date(formData.dob);
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
                if (age < 18) newErrors.dob = 'Applicant must be at least 18 years old';
            }
            if (!formData.gender) newErrors.gender = 'Gender is required';
            if (!formData.occupation) newErrors.occupation = 'Occupation is required';
            if (!formData.permanentAddress) newErrors.permanentAddress = 'Address is required';
            if (!formData.contactNumber) newErrors.contactNumber = 'Contact number is required';
            else if (!/^[0-9]{10}$/.test(formData.contactNumber)) newErrors.contactNumber = 'Invalid contact (enter 10 digits)';
            if (!formData.email) newErrors.email = 'Email is required';
            else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';

            if (formData.productName === 'Unlisted Shares') {
                if (!formData.panNumber) newErrors.panNumber = 'PAN number is required';
                else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber.toUpperCase())) newErrors.panNumber = 'Invalid PAN format';
                if (!formData.aadharNumber) newErrors.aadharNumber = 'Aadhar number is required';
                else if (!/^[0-9]{12}$/.test(formData.aadharNumber)) newErrors.aadharNumber = 'Invalid Aadhar (enter 12 digits)';
                if (!formData.maritalStatus) newErrors.maritalStatus = 'Marital status is required';
            }
        }

        if (step === 3) {
            if (!formData.nomineeName) newErrors.nomineeName = 'Nominee name is required';
            if (!formData.nomineeRelation) newErrors.nomineeRelation = 'Relation is required';
            if (!formData.nomineeDob) newErrors.nomineeDob = 'Nominee DOB is required';
            if (!formData.nomineeAddress) newErrors.nomineeAddress = 'Nominee address is required';
        }

        if (step === 4) {
            if (!formData.accountNumber) newErrors.accountNumber = 'Account number is required';
            else if (formData.accountNumber.length < 9 || formData.accountNumber.length > 18) newErrors.accountNumber = 'Invalid account number length';
            if (!formData.bankName) newErrors.bankName = 'Bank name is required';
            if (!formData.branch) newErrors.branch = 'Branch is required';
            if (!formData.ifscCode) newErrors.ifscCode = 'IFSC code is required';
            else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode.toUpperCase())) newErrors.ifscCode = 'Invalid IFSC format';
            if (!formData.micrCode) newErrors.micrCode = 'MICR code is required';
            else if (!/^[0-9]{9}$/.test(formData.micrCode)) newErrors.micrCode = 'MICR must be 9 digits';
            if (!formData.accountType) newErrors.accountType = 'Account type is required';
        }

        if (step === 5) {
            if (!formData.investmentAmount) newErrors.investmentAmount = 'Investment amount is required';
            else if (parseFloat(formData.investmentAmount) < 500000) newErrors.investmentAmount = 'Minimum investment is ₹5,00,000';
            if (!formData.paymentMode) newErrors.paymentMode = 'Payment mode is required';
            if (!formData.paymentReference) newErrors.paymentReference = 'Payment reference is required';
            if (!formData.paymentDate) newErrors.paymentDate = 'Payment date is required';
            if (formData.dematAccount && formData.dematAccount.length !== 16) newErrors.dematAccount = 'Demat account must be 16 digits';
        }

        if (step === 6) {
            if (formData.productName === 'Unlisted Shares') {
                if (!files.signatureFile) newErrors.signatureFile = 'Digital signature is required';
            } else {
                if (!agreedToTC) newErrors.agreedToTC = 'You must agree to the Terms & Conditions';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = async () => {
        if (!validateStep(currentStep)) return;

        if (currentStep === 2) {
            setIsValidating(true);
            setErrors({}); // Clear any previous dynamic errors
            try {
                const response = await fetch('/api/validate-registration', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: formData.email,
                        contactNumber: formData.contactNumber,
                        aadharNumber: formData.aadharNumber,
                        panNumber: formData.panNumber,
                        userId: userId,
                    }),
                });

                if (!response.ok) {
                    const data = await response.json();
                    if (data.errors) {
                        setErrors(prev => ({ ...prev, ...data.errors }));
                        return;
                    }
                }
            } catch (error) {
                console.error('Validation error:', error);
            } finally {
                setIsValidating(false);
            }
        }

        setCurrentStep(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePrevious = () => {
        setCurrentStep(prev => prev - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateStep(6)) return;

        setLoading(true);

        try {
            // Upload documents first
            let panUrl = '';
            let aadharUrl = '';
            let bankChequeUrl = '';
            let clientSignatureUrl = '';

            if (files.panFile) {
                const url = await uploadFile(files.panFile, 'pan-cards');
                if (url) panUrl = url;
            }
            if (files.aadharFile) {
                const url = await uploadFile(files.aadharFile, 'aadhar-cards');
                if (url) aadharUrl = url;
            }
            if (files.bankChequeFile) {
                const url = await uploadFile(files.bankChequeFile, 'bank-cheques');
                if (url) bankChequeUrl = url;
            }
            if (files.signatureFile) {
                const url = await uploadFile(files.signatureFile, 'client_signatures');
                if (url) clientSignatureUrl = url;
            }

            const response = await fetch('/api/investments/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    panUrl: panUrl || formData.panUrl,
                    aadharUrl: aadharUrl || formData.aadharUrl,
                    bankChequeUrl: bankChequeUrl || formData.bankChequeUrl,
                    clientSignatureUrl: clientSignatureUrl
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Redirect to success page or login
                router.push(`/application-success?id=${data.applicationId}`);
            } else {
                alert(data.error || 'Failed to submit application');
            }
        } catch (error) {
            console.error('Error submitting application:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { number: 1, title: 'Product', icon: LayoutGrid },
        { number: 2, title: 'Personal', icon: User },
        { number: 3, title: 'Nominee', icon: UsersIcon },
        { number: 4, title: 'Bank', icon: Building2 },
        { number: 5, title: 'Investment', icon: DollarSign },
        { number: 6, title: 'Signature', icon: PenTool },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-green-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-[#1B8A9F] transition-colors">
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Back to Home
                        </Link>
                        <Image
                            src="/logo.png"
                            alt="TraderG Wealth Logo"
                            width={150}
                            height={40}
                            className="h-10 w-auto"
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <h1 className="sr-only">Apply for Investment Allocation - TraderG Wealth</h1>
                <div className="max-w-4xl mx-auto">
                    {/* Progress Steps */}
                    <div className="mb-8 md:mb-12">
                        <div className="flex items-center justify-between">
                            {steps.map((step, index) => (
                                <div key={step.number} className="flex-1">
                                    <div className="flex items-center">
                                        <div className="flex flex-col items-center flex-1">
                                            <div
                                                className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${currentStep >= step.number
                                                    ? 'bg-[#1B8A9F] text-white shadow-lg'
                                                    : 'bg-gray-200 text-gray-500'
                                                    }`}
                                            >
                                                {currentStep > step.number ? (
                                                    <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" />
                                                ) : (
                                                    <step.icon className="w-5 h-5 md:w-6 md:h-6" />
                                                )}
                                            </div>
                                            <p className={`mt-2 text-[10px] md:text-sm font-semibold text-center hidden sm:block ${currentStep >= step.number ? 'text-text-primary' : 'text-text-tertiary'
                                                }`}>
                                                {step.title}
                                            </p>
                                        </div>
                                        {index < steps.length - 1 && (
                                            <div className={`h-0.5 md:h-1 flex-1 mx-2 md:mx-4 rounded transition-all duration-300 ${currentStep > step.number ? 'bg-[#1B8A9F]' : 'bg-gray-200'
                                                }`} />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form */}
                    <div className="card p-8">
                        <form onSubmit={handleSubmit}>
                            {/* Step 1: Product Selection */}
                            {currentStep === 1 && (
                                <div className="space-y-8 animate-fade-in-up">
                                    <div className="text-center">
                                        <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Select Your Product</h2>
                                        <p className="text-gray-500 max-w-lg mx-auto">Choose an investment strategy that aligns with your financial goals and risk appetite.</p>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {productOptions.map((product) => (
                                            <button
                                                key={product.id}
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, productName: product.id }))}
                                                className={`relative p-6 rounded-[28px] border transition-all duration-300 text-left overflow-hidden group ${formData.productName === product.id
                                                    ? 'border-[#1B8A9F] bg-white shadow-xl shadow-[#1B8A9F]/5 ring-1 ring-[#1B8A9F]/10'
                                                    : 'border-slate-100 bg-white hover:border-teal-100 hover:shadow-lg'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className={`p-2.5 rounded-xl transition-colors ${formData.productName === product.id ? 'bg-[#1B8A9F] text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-teal-50 group-hover:text-[#1B8A9F]'
                                                        }`}>
                                                        <product.icon className="w-5 h-5" />
                                                    </div>
                                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${formData.productName === product.id ? 'bg-[#1B8A9F]/10 text-[#1B8A9F]' : 'bg-slate-50 text-slate-400'
                                                        }`}>
                                                        {product.horizon}
                                                    </span>
                                                </div>

                                                <h3 className={`font-bold text-lg mb-1 tracking-tight ${formData.productName === product.id ? 'text-[#1B8A9F]' : 'text-slate-900'
                                                    }`}>
                                                    {product.title}
                                                </h3>

                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3">
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="w-1 h-1 rounded-full bg-[#1B8A9F]" />
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Returns:</span>
                                                        <span className="text-[10px] font-black text-slate-600 tracking-tight">{product.returns}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <div className={`w-1 h-1 rounded-full ${product.risk.startsWith('High') ? 'bg-red-400' : 'bg-green-400'}`} />
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Risk:</span>
                                                        <span className="text-[10px] font-black text-slate-600 tracking-tight">{product.risk}</span>
                                                    </div>
                                                </div>

                                                <p className="text-[10px] font-medium text-slate-400 mt-2.5 line-clamp-1 italic">
                                                    Suitable for {product.suitableFor.toLowerCase()}
                                                </p>

                                                {formData.productName === product.id && (
                                                    <div className="absolute top-6 right-6 pointer-events-none">
                                                        <div className="w-4 h-4 bg-[#1B8A9F] rounded-full flex items-center justify-center opacity-20">
                                                            <CheckCircle2 className="w-2 h-2 text-white" />
                                                        </div>
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                    {errors.productName && <p className="text-red-500 text-sm text-center font-bold">{errors.productName}</p>}
                                </div>
                            )}

                            {/* Step 2: Personal Details */}
                            {currentStep === 2 && (
                                <div className="space-y-6 animate-fade-in-up">
                                    <div>
                                        <h2 className="text-2xl font-bold mb-2">Personal Information</h2>
                                        {formData.kycVerified ? (
                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium inline-flex border border-green-100">
                                                <ShieldCheck className="w-4 h-4" />
                                                KYC Verified. Your personal details are secured.
                                            </div>
                                        ) : isPreFilled ? (
                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-teal-50 text-teal-700 rounded-lg text-sm font-medium inline-flex">
                                                <Sparkles className="w-4 h-4" />
                                                Welcome back! Details pre-filled from your profile.
                                            </div>
                                        ) : (
                                            <p className="text-text-secondary">Please provide your personal information for registration</p>
                                        )}
                                    </div>

                                    {/* Selected Product Banner */}
                                    <div className="bg-teal-50/50 p-4 rounded-xl border border-teal-100 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-[#1B8A9F] text-white flex items-center justify-center">
                                                {productOptions.find(p => p.id === formData.productName)?.icon && React.createElement(productOptions.find(p => p.id === formData.productName)!.icon, { className: "w-4 h-4" })}
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-teal-600 font-bold uppercase tracking-wider">Selected Strategy</p>
                                                <p className="text-sm font-black text-gray-900">{formData.productName}</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setCurrentStep(1)}
                                            className="text-[10px] font-black underline uppercase text-[#1B8A9F] hover:text-[#156d7e]"
                                        >
                                            Change
                                        </button>
                                    </div>

                                    {/* Personal Information Section */}
                                    <div className="pt-4">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="label">Full Name *</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        name="fullName"
                                                        value={formData.fullName}
                                                        onChange={handleChange}
                                                        readOnly={formData.kycVerified}
                                                        className={`input ${errors.fullName ? 'input-error' : ''} ${formData.kycVerified ? 'bg-gray-50 cursor-not-allowed pr-24' : ''}`}
                                                        placeholder="Enter your full name"
                                                    />
                                                    {formData.kycVerified && (
                                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center px-2 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black uppercase tracking-wider border border-green-100">
                                                            <ShieldCheck className="w-3 h-3 mr-1" />
                                                            Verified
                                                        </div>
                                                    )}
                                                </div>
                                                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                                            </div>

                                            <div>
                                                <label className="label">Father's Name *</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        name="fatherName"
                                                        value={formData.fatherName}
                                                        onChange={handleChange}
                                                        readOnly={formData.kycVerified}
                                                        className={`input ${errors.fatherName ? 'input-error' : ''} ${formData.kycVerified ? 'bg-gray-50 cursor-not-allowed pr-24' : ''}`}
                                                        placeholder="Enter father's name"
                                                    />
                                                    {formData.kycVerified && (
                                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center px-2 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black uppercase tracking-wider border border-green-100">
                                                            <ShieldCheck className="w-3 h-3 mr-1" />
                                                            Verified
                                                        </div>
                                                    )}
                                                </div>
                                                {errors.fatherName && <p className="text-red-500 text-sm mt-1">{errors.fatherName}</p>}
                                            </div>

                                            <div>
                                                <label className="label">Date of Birth *</label>
                                                <div className="relative">
                                                    <input
                                                        type="date"
                                                        name="dob"
                                                        value={formData.dob}
                                                        onChange={handleChange}
                                                        readOnly={formData.kycVerified}
                                                        className={`input ${errors.dob ? 'input-error' : ''} ${formData.kycVerified ? 'bg-gray-50 cursor-not-allowed pr-24' : ''}`}
                                                    />
                                                    {formData.kycVerified && (
                                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center px-2 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black uppercase tracking-wider border border-green-100">
                                                            <ShieldCheck className="w-3 h-3 mr-1" />
                                                            Verified
                                                        </div>
                                                    )}
                                                </div>
                                                {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob}</p>}
                                            </div>

                                            <div>
                                                <label className="label">Age</label>
                                                <input
                                                    type="number"
                                                    name="age"
                                                    value={formData.age}
                                                    readOnly
                                                    className="input bg-gray-50"
                                                    placeholder="Auto-calculated"
                                                />
                                            </div>

                                            <div>
                                                <label className="label">Gender *</label>
                                                <div className="relative">
                                                    <select
                                                        name="gender"
                                                        value={formData.gender}
                                                        onChange={handleChange}
                                                        disabled={formData.kycVerified}
                                                        className={`input ${errors.gender ? 'input-error' : ''} ${formData.kycVerified ? 'bg-gray-50 cursor-not-allowed pr-24 appearance-none' : ''}`}
                                                    >
                                                        <option value="">Select gender</option>
                                                        <option value="Male">Male</option>
                                                        <option value="Female">Female</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                    {formData.kycVerified && (
                                                        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center px-2 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black uppercase tracking-wider border border-green-100">
                                                            <ShieldCheck className="w-3 h-3 mr-1" />
                                                            Verified
                                                        </div>
                                                    )}
                                                </div>
                                                {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                                            </div>

                                            <div>
                                                <label className="label">Occupation *</label>
                                                <input
                                                    type="text"
                                                    name="occupation"
                                                    value={formData.occupation}
                                                    onChange={handleChange}
                                                    className={`input ${errors.occupation ? 'input-error' : ''}`}
                                                    placeholder="Enter your occupation"
                                                />
                                                {errors.occupation && <p className="text-red-500 text-sm mt-1">{errors.occupation}</p>}
                                            </div>

                                            {formData.productName === 'Unlisted Shares' && (
                                                <div>
                                                    <label className="label">Marital Status *</label>
                                                    <select
                                                        name="maritalStatus"
                                                        value={formData.maritalStatus}
                                                        onChange={handleChange}
                                                        className={`input ${errors.maritalStatus ? 'input-error' : ''}`}
                                                    >
                                                        <option value="">Select status</option>
                                                        <option value="Single">Single</option>
                                                        <option value="Married">Married</option>
                                                        <option value="Divorced">Divorced</option>
                                                        <option value="Widowed">Widowed</option>
                                                    </select>
                                                    {errors.maritalStatus && <p className="text-red-500 text-sm mt-1">{errors.maritalStatus}</p>}
                                                </div>
                                            )}

                                            <div className="md:col-span-2">
                                                <label className="label">Permanent Address *</label>
                                                <textarea
                                                    name="permanentAddress"
                                                    value={formData.permanentAddress}
                                                    onChange={handleChange}
                                                    rows={3}
                                                    className={`input ${errors.permanentAddress ? 'input-error' : ''}`}
                                                    placeholder="Enter your complete address"
                                                ></textarea>
                                                {errors.permanentAddress && <p className="text-red-500 text-sm mt-1">{errors.permanentAddress}</p>}
                                            </div>

                                            <div>
                                                <label className="label">Contact Number *</label>
                                                <input
                                                    type="tel"
                                                    name="contactNumber"
                                                    value={formData.contactNumber}
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(/\D/g, '');
                                                        if (val.length <= 10) {
                                                            setFormData(prev => ({ ...prev, contactNumber: val }));
                                                        }
                                                    }}
                                                    className={`input ${errors.contactNumber ? 'input-error' : ''}`}
                                                    placeholder="10-digit mobile number"
                                                    maxLength={10}
                                                />
                                                {errors.contactNumber && <p className="text-red-500 text-sm mt-1">{errors.contactNumber}</p>}
                                            </div>

                                            <div>
                                                <label className="label">Email Address *</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className={`input ${errors.email ? 'input-error' : ''}`}
                                                    placeholder="your.email@example.com"
                                                />
                                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                            </div>

                                            <div>
                                                <label className="label text-[#1B8A9F] font-bold">Referral Code (Optional)</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        name="referralCode"
                                                        value={formData.referralCode}
                                                        onChange={(e) => {
                                                            if (isReferralLocked) return;
                                                            const val = e.target.value.toUpperCase();
                                                            setFormData(prev => ({ ...prev, referralCode: val }));
                                                        }}
                                                        readOnly={isReferralLocked}
                                                        className={`input border-[#1B8A9F]/30 font-bold tracking-widest ${isReferralLocked ? 'bg-gray-100 cursor-not-allowed opacity-75' : 'bg-teal-50/10'}`}
                                                        placeholder="ENTER CODE"
                                                    />
                                                    {isReferralLocked ? (
                                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 group">
                                                            <Lock className="w-4 h-4 text-gray-400" />
                                                            <div className="absolute bottom-full right-0 mb-2 invisible group-hover:visible bg-gray-900 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap">
                                                                Referral code locked from link
                                                            </div>
                                                        </div>
                                                    ) : formData.referralCode && (
                                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                            <Sparkles className="w-4 h-4 text-[#1B8A9F] animate-pulse" />
                                                        </div>
                                                    )}
                                                </div>
                                                {isReferralLocked ? (
                                                    <p className="text-[10px] text-[#1B8A9F] mt-1 italic font-bold flex items-center gap-1">
                                                        <CheckCircle2 className="w-3 h-3" /> Referral link applied and secured.
                                                    </p>
                                                ) : (
                                                    <p className="text-[10px] text-gray-400 mt-1 italic">If you were referred by someone, enter their code here.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Identity Verification (KYC) Section - Only for Unlisted Shares */}
                                    {formData.productName === 'Unlisted Shares' && (
                                        <div className="pt-8 animate-fade-in">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="h-px flex-1 bg-gray-100"></div>
                                                <h3 className="text-sm font-black uppercase tracking-widest text-[#1B8A9F] flex items-center gap-2">
                                                    <ShieldCheck className="w-4 h-4" />
                                                    Identity Verification (KYC)
                                                </h3>
                                                <div className="h-px flex-1 bg-gray-100"></div>
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-6 pb-4">
                                                <div>
                                                    <label className="label">PAN Number *</label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            name="panNumber"
                                                            value={formData.panNumber}
                                                            onChange={(e) => {
                                                                const val = e.target.value.toUpperCase();
                                                                setFormData(prev => ({ ...prev, panNumber: val }));
                                                            }}
                                                            readOnly={formData.kycVerified}
                                                            className={`input ${errors.panNumber ? 'input-error' : ''} ${formData.kycVerified ? 'bg-gray-50 cursor-not-allowed pr-24 font-mono' : 'font-mono'}`}
                                                            placeholder="ABCDE1234F"
                                                            maxLength={10}
                                                        />
                                                        {formData.kycVerified && (
                                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center px-2 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black uppercase tracking-wider border border-green-100">
                                                                <ShieldCheck className="w-3 h-3 mr-1" />
                                                                Verified
                                                            </div>
                                                        )}
                                                    </div>
                                                    {errors.panNumber && <p className="text-red-500 text-sm mt-1">{errors.panNumber}</p>}
                                                </div>

                                                <div>
                                                    <label className="label">PAN Card (Photo/PDF) {formData.panUrl && <span className="text-green-600 font-bold text-[10px] ml-1 uppercase">(Verified)</span>}</label>
                                                    {formData.kycVerified && formData.panUrl ? (
                                                        <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                                                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                                                <ShieldCheck className="w-5 h-5 text-green-600" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-sm font-semibold text-gray-900">Previously Verified PAN</p>
                                                                <p className="text-[10px] text-text-secondary uppercase">Securely stored and locked</p>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => window.open(formData.panUrl, '_blank')}
                                                                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-[#1B8A9F] font-bold text-xs rounded-lg transition-all shadow-sm"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                                View
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <input
                                                                type="file"
                                                                accept=".jpg,.jpeg,.png,.pdf"
                                                                onChange={(e) => handleFileChange(e, 'panFile')}
                                                                className={`input py-1.5 ${errors.panFile ? 'input-error' : ''} ${formData.panUrl && !files.panFile ? 'border-[#1B8A9F]/30 bg-teal-50/20' : ''}`}
                                                            />
                                                            {formData.panUrl && !files.panFile && (
                                                                <p className="text-[#1B8A9F] text-[10px] mt-1 font-bold italic flex items-center">
                                                                    <Eye className="w-3 h-3 mr-1" /> Previously uploaded document will be used
                                                                </p>
                                                            )}
                                                            {files.panFile && <p className="text-teal-600 text-[10px] mt-1 font-bold italic">✓ New file selected: {files.panFile.name}</p>}
                                                            {errors.panFile && <p className="text-red-500 text-sm mt-1">{errors.panFile}</p>}
                                                        </>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="label">Aadhar Number *</label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            name="aadharNumber"
                                                            value={formData.aadharNumber}
                                                            onChange={(e) => {
                                                                const val = e.target.value.replace(/\D/g, '');
                                                                if (val.length <= 12) {
                                                                    setFormData(prev => ({ ...prev, aadharNumber: val }));
                                                                }
                                                            }}
                                                            readOnly={formData.kycVerified}
                                                            className={`input ${errors.aadharNumber ? 'input-error' : ''} ${formData.kycVerified ? 'bg-gray-50 cursor-not-allowed pr-24 font-mono' : 'font-mono'}`}
                                                            placeholder="12-digit Aadhar number"
                                                            maxLength={12}
                                                        />
                                                        {formData.kycVerified && (
                                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center px-2 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black uppercase tracking-wider border border-green-100">
                                                                <ShieldCheck className="w-3 h-3 mr-1" />
                                                                Verified
                                                            </div>
                                                        )}
                                                    </div>
                                                    {errors.aadharNumber && <p className="text-red-500 text-sm mt-1">{errors.aadharNumber}</p>}
                                                </div>

                                                <div>
                                                    <label className="label">Aadhaar Card (Photo/PDF) {formData.aadharUrl && <span className="text-green-600 font-bold text-[10px] ml-1 uppercase">(Verified)</span>}</label>
                                                    {formData.kycVerified && formData.aadharUrl ? (
                                                        <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                                                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                                                <ShieldCheck className="w-5 h-5 text-green-600" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-sm font-semibold text-gray-900">Previously Verified Aadhaar</p>
                                                                <p className="text-[10px] text-text-secondary uppercase">Securely stored and locked</p>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => window.open(formData.aadharUrl, '_blank')}
                                                                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-[#1B8A9F] font-bold text-xs rounded-lg transition-all shadow-sm"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                                View
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <input
                                                                type="file"
                                                                accept=".jpg,.jpeg,.png,.pdf"
                                                                onChange={(e) => handleFileChange(e, 'aadharFile')}
                                                                className={`input py-1.5 ${errors.aadharFile ? 'input-error' : ''} ${formData.aadharUrl && !files.aadharFile ? 'border-[#1B8A9F]/30 bg-teal-50/20' : ''}`}
                                                            />
                                                            {formData.aadharUrl && !files.aadharFile && (
                                                                <p className="text-[#1B8A9F] text-[10px] mt-1 font-bold italic flex items-center">
                                                                    <Eye className="w-3 h-3 mr-1" /> Previously uploaded document will be used
                                                                </p>
                                                            )}
                                                            {files.aadharFile && <p className="text-teal-600 text-[10px] mt-1 font-bold italic">✓ New file selected: {files.aadharFile.name}</p>}
                                                            {errors.aadharFile && <p className="text-red-500 text-sm mt-1">{errors.aadharFile}</p>}
                                                        </>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="label">Cancelled Cheque (Photo/PDF) {formData.bankChequeUrl && <span className="text-green-600 font-bold text-[10px] ml-1 uppercase">(Verified)</span>}</label>
                                                    {formData.kycVerified && formData.bankChequeUrl ? (
                                                        <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                                                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                                                <ShieldCheck className="w-5 h-5 text-green-600" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-sm font-semibold text-gray-900">Previously Verified Cheque</p>
                                                                <p className="text-[10px] text-text-secondary uppercase">Securely stored and locked</p>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => window.open(formData.bankChequeUrl, '_blank')}
                                                                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-[#1B8A9F] font-bold text-xs rounded-lg transition-all shadow-sm"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                                View
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <input
                                                                type="file"
                                                                accept=".jpg,.jpeg,.png,.pdf"
                                                                onChange={(e) => handleFileChange(e, 'bankChequeFile')}
                                                                className={`input py-1.5 ${errors.bankChequeFile ? 'input-error' : ''} ${formData.bankChequeUrl && !files.bankChequeFile ? 'border-[#1B8A9F]/30 bg-teal-50/20' : ''}`}
                                                            />
                                                            {formData.bankChequeUrl && !files.bankChequeFile && (
                                                                <p className="text-[#1B8A9F] text-[10px] mt-1 font-bold italic flex items-center">
                                                                    <Eye className="w-3 h-3 mr-1" /> Previously uploaded document will be used
                                                                </p>
                                                            )}
                                                            {files.bankChequeFile && <p className="text-teal-600 text-[10px] mt-1 font-bold italic">✓ New file selected: {files.bankChequeFile.name}</p>}
                                                            {errors.bankChequeFile && <p className="text-red-500 text-sm mt-1">{errors.bankChequeFile}</p>}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Step 3: Nominee Details */}
                            {currentStep === 3 && (
                                <div className="space-y-6 animate-fade-in-up">
                                    <div>
                                        <h2 className="text-2xl font-bold mb-2">Nominee Details</h2>
                                        <p className="text-text-secondary">Provide nominee information for your investment</p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="label">Nominee Name *</label>
                                            <input
                                                type="text"
                                                name="nomineeName"
                                                value={formData.nomineeName}
                                                onChange={handleChange}
                                                className={`input ${errors.nomineeName ? 'input-error' : ''}`}
                                                placeholder="Enter nominee's full name"
                                            />
                                            {errors.nomineeName && <p className="text-red-500 text-sm mt-1">{errors.nomineeName}</p>}
                                        </div>

                                        <div>
                                            <label className="label">Relation with Nominee *</label>
                                            <input
                                                type="text"
                                                name="nomineeRelation"
                                                value={formData.nomineeRelation}
                                                onChange={handleChange}
                                                className={`input ${errors.nomineeRelation ? 'input-error' : ''}`}
                                                placeholder="e.g., Spouse, Son, Daughter"
                                            />
                                            {errors.nomineeRelation && <p className="text-red-500 text-sm mt-1">{errors.nomineeRelation}</p>}
                                        </div>

                                        <div>
                                            <label className="label">Nominee Date of Birth *</label>
                                            <input
                                                type="date"
                                                name="nomineeDob"
                                                value={formData.nomineeDob}
                                                onChange={handleChange}
                                                className={`input ${errors.nomineeDob ? 'input-error' : ''}`}
                                            />
                                            {errors.nomineeDob && <p className="text-red-500 text-sm mt-1">{errors.nomineeDob}</p>}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="label">Nominee Address *</label>
                                            <textarea
                                                name="nomineeAddress"
                                                value={formData.nomineeAddress}
                                                onChange={handleChange}
                                                rows={3}
                                                className={`input ${errors.nomineeAddress ? 'input-error' : ''}`}
                                                placeholder="Enter nominee's complete address"
                                            ></textarea>
                                            {errors.nomineeAddress && <p className="text-red-500 text-sm mt-1">{errors.nomineeAddress}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Bank Details */}
                            {currentStep === 4 && (
                                <div className="space-y-6 animate-fade-in-up">
                                    <div>
                                        <h2 className="text-2xl font-bold mb-2">Bank Details</h2>
                                        <p className="text-text-secondary">Provide your bank account information for dividend payments</p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="label">Bank Account Number *</label>
                                            <input
                                                type="text"
                                                name="accountNumber"
                                                value={formData.accountNumber}
                                                onChange={handleChange}
                                                className={`input ${errors.accountNumber ? 'input-error' : ''}`}
                                                placeholder="Enter your account number"
                                            />
                                            {errors.accountNumber && <p className="text-red-500 text-sm mt-1">{errors.accountNumber}</p>}
                                        </div>

                                        <div>
                                            <label className="label">Bank Name *</label>
                                            <input
                                                type="text"
                                                name="bankName"
                                                value={formData.bankName}
                                                onChange={handleChange}
                                                className={`input ${errors.bankName ? 'input-error' : ''}`}
                                                placeholder="Enter bank name"
                                            />
                                            {errors.bankName && <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>}
                                        </div>

                                        <div>
                                            <label className="label">Branch *</label>
                                            <input
                                                type="text"
                                                name="branch"
                                                value={formData.branch}
                                                onChange={handleChange}
                                                className={`input ${errors.branch ? 'input-error' : ''}`}
                                                placeholder="Enter branch name"
                                            />
                                            {errors.branch && <p className="text-red-500 text-sm mt-1">{errors.branch}</p>}
                                        </div>

                                        <div>
                                            <label className="label">IFSC Code *</label>
                                            <input
                                                type="text"
                                                name="ifscCode"
                                                value={formData.ifscCode}
                                                onChange={handleChange}
                                                className={`input ${errors.ifscCode ? 'input-error' : ''}`}
                                                placeholder="e.g., SBIN0001234"
                                            />
                                            {errors.ifscCode && <p className="text-red-500 text-sm mt-1">{errors.ifscCode}</p>}
                                        </div>

                                        <div>
                                            <label className="label">MICR Code *</label>
                                            <input
                                                type="text"
                                                name="micrCode"
                                                value={formData.micrCode}
                                                onChange={handleChange}
                                                className={`input ${errors.micrCode ? 'input-error' : ''}`}
                                                placeholder="Enter 9-digit MICR code"
                                            />
                                            {errors.micrCode && <p className="text-red-500 text-sm mt-1">{errors.micrCode}</p>}
                                        </div>

                                        <div>
                                            <label className="label">Account Type *</label>
                                            <select
                                                name="accountType"
                                                value={formData.accountType}
                                                onChange={handleChange}
                                                className={`input ${errors.accountType ? 'input-error' : ''}`}
                                            >
                                                <option value="">Select type</option>
                                                <option value="Savings">Savings</option>
                                                <option value="Current">Current</option>
                                            </select>
                                            {errors.accountType && <p className="text-red-500 text-sm mt-1">{errors.accountType}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 5: Investment Details */}
                            {currentStep === 5 && (
                                <div className="space-y-6 animate-fade-in-up">
                                    <div>
                                        <h2 className="text-2xl font-bold mb-2">Investment Details</h2>
                                        <p className="text-text-secondary">Provide your investment and payment information</p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="label">
                                                {['Intraday Trading', 'Short-Term SIP', 'Long-Term Holding'].includes(formData.productName)
                                                    ? 'Trade Capital (₹) *'
                                                    : 'Investment Amount (₹) *'}
                                            </label>
                                            <input
                                                type="number"
                                                name="investmentAmount"
                                                value={formData.investmentAmount}
                                                onChange={handleChange}
                                                className={`input ${errors.investmentAmount ? 'input-error' : ''}`}
                                                placeholder="Min ₹5,00,000"
                                                min="500000"
                                                step="1000"
                                            />
                                            {formData.investmentAmount && (
                                                <p className="text-sm font-bold text-[#1B8A9F] mt-1">
                                                    ₹{formatIndianNumber(formData.investmentAmount)}
                                                </p>
                                            )}
                                            <p className="text-[10px] text-teal-600 font-bold mt-1 uppercase tracking-wider">
                                                {['Intraday Trading', 'Short-Term SIP', 'Long-Term Holding'].includes(formData.productName)
                                                    ? 'Minimum Capital: ₹5.00 Lakhs'
                                                    : 'Minimum investment: ₹5.00 Lakhs'}
                                            </p>
                                            {errors.investmentAmount && <p className="text-red-500 text-sm mt-1">{errors.investmentAmount}</p>}
                                        </div>

                                        <div>
                                            <label className="label">
                                                {formData.productName === 'Intraday Trading' ? 'Trade Management fees @1% Monthly' :
                                                    formData.productName === 'Short-Term SIP' ? 'Trade Management fees @1% Quarterly' :
                                                        formData.productName === 'Long-Term Holding' ? 'Trade Management fees @1% Yearly' :
                                                            'Number of Shares'}
                                            </label>
                                            <input
                                                type="number"
                                                name="numberOfShares"
                                                value={formData.numberOfShares}
                                                readOnly
                                                className="input bg-gray-50"
                                                placeholder="Auto-calculated"
                                            />
                                            <p className="text-xs text-text-tertiary mt-1">
                                                {['Intraday Trading', 'Short-Term SIP', 'Long-Term Holding'].includes(formData.productName)
                                                    ? 'Calculated based on capital'
                                                    : '@ ₹100 per share'}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="label">Payment Mode *</label>
                                            <select
                                                name="paymentMode"
                                                value={formData.paymentMode}
                                                onChange={handleChange}
                                                className={`input ${errors.paymentMode ? 'input-error' : ''}`}
                                            >
                                                <option value="">Select payment mode</option>
                                                <option value="Cheque">Cheque</option>
                                                <option value="NEFT">NEFT</option>
                                                <option value="RTGS">RTGS</option>
                                                <option value="UPI">UPI</option>
                                                <option value="IMPS">IMPS</option>
                                            </select>
                                            {errors.paymentMode && <p className="text-red-500 text-sm mt-1">{errors.paymentMode}</p>}
                                        </div>

                                        <div>
                                            <label className="label">Payment Reference/UTR *</label>
                                            <input
                                                type="text"
                                                name="paymentReference"
                                                value={formData.paymentReference}
                                                onChange={handleChange}
                                                className={`input ${errors.paymentReference ? 'input-error' : ''}`}
                                                placeholder="Cheque No./UTR/Ref No."
                                            />
                                            {errors.paymentReference && <p className="text-red-500 text-sm mt-1">{errors.paymentReference}</p>}
                                        </div>

                                        <div>
                                            <label className="label">Payment Date *</label>
                                            <input
                                                type="date"
                                                name="paymentDate"
                                                value={formData.paymentDate}
                                                onChange={handleChange}
                                                min={new Date().toISOString().split('T')[0]}
                                                className={`input ${errors.paymentDate ? 'input-error' : ''}`}
                                            />
                                            {errors.paymentDate && <p className="text-red-500 text-sm mt-1">{errors.paymentDate}</p>}
                                        </div>

                                        <div>
                                            <label className="label">CDSL Demat Account (Optional)</label>
                                            <input
                                                type="text"
                                                name="dematAccount"
                                                value={formData.dematAccount}
                                                onChange={handleChange}
                                                className="input"
                                                placeholder="Enter demat account number"
                                            />
                                        </div>

                                        <div className="md:col-span-2 grid md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
                                            <div className="md:col-span-2">
                                                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                                                    <Sparkles className="w-4 h-4 text-[#1B8A9F]" />
                                                    Broker Information
                                                </h4>
                                            </div>
                                            <div>
                                                <label className="label">Broker ID (Optional)</label>
                                                <input
                                                    type="text"
                                                    name="brokerId"
                                                    value={formData.brokerId}
                                                    onChange={handleChange}
                                                    className={`input ${errors.brokerId ? 'input-error' : ''}`}
                                                    placeholder="Enter your Broker ID"
                                                />
                                                {errors.brokerId && <p className="text-red-500 text-sm mt-1">{errors.brokerId}</p>}
                                            </div>
                                            <div>
                                                <label className="label">Broker Name (Optional)</label>
                                                <select
                                                    name="brokerName"
                                                    value={formData.brokerName}
                                                    onChange={handleChange}
                                                    className={`input ${errors.brokerName ? 'input-error' : ''}`}
                                                >
                                                    <option value="">Select broker</option>
                                                    {brokers.map((broker) => (
                                                        <option key={broker.id} value={broker.name}>
                                                            {broker.name === 'Direct' ? 'Direct (No Broker)' : broker.name}
                                                        </option>
                                                    ))}
                                                    {brokers.length === 0 && (
                                                        <>
                                                            <option value="Direct">Direct (No Broker)</option>
                                                            <option value="Zerodha">Zerodha</option>
                                                            <option value="Groww">Groww</option>
                                                            <option value="Angel One">Angel One</option>
                                                            <option value="Other">Other</option>
                                                        </>
                                                    )}
                                                </select>
                                                {errors.brokerName && <p className="text-red-500 text-sm mt-1">{errors.brokerName}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                                        <h3 className="font-bold text-lg mb-3">
                                            {formData.productName === 'Unlisted Shares' ? 'Investment Summary' : 'Trade Summary'}
                                        </h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-text-secondary">
                                                    {['Intraday Trading', 'Short-Term SIP', 'Long-Term Holding'].includes(formData.productName)
                                                        ? 'Trade Capital:'
                                                        : 'Investment Amount:'}
                                                </span>
                                                <span className="font-semibold">₹{formData.investmentAmount ? formatIndianNumber(formData.investmentAmount) : '0'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-text-secondary">
                                                    {formData.productName === 'Intraday Trading' ? 'Management Fee (Monthly):' :
                                                        formData.productName === 'Short-Term SIP' ? 'Management Fee (Quarterly):' :
                                                            formData.productName === 'Long-Term Holding' ? 'Management Fee (Yearly):' :
                                                                'Number of Shares:'}
                                                </span>
                                                <span className="font-semibold">{formData.numberOfShares || '0'}</span>
                                            </div>
                                            {!['Intraday Trading', 'Short-Term SIP', 'Long-Term Holding'].includes(formData.productName) && (
                                                <div className="flex justify-between">
                                                    <span className="text-text-secondary">Face Value per Share:</span>
                                                    <span className="font-semibold">₹100</span>
                                                </div>
                                            )}

                                            {formData.productName && (
                                                <>
                                                    <div className="flex justify-between border-t border-blue-100 pt-2 mt-2">
                                                        <span className="text-text-secondary">Risk Level:</span>
                                                        <span className={`font-black uppercase tracking-wider text-[10px] px-2 py-0.5 rounded-md ${formData.productName === 'Intraday Trading' ? 'bg-red-100 text-red-700' :
                                                            formData.productName === 'Short-Term SIP' ? 'bg-orange-100 text-orange-700' :
                                                                'bg-green-100 text-green-700'
                                                            }`}>
                                                            {formData.productName === 'Intraday Trading' ? 'High' :
                                                                formData.productName === 'Short-Term SIP' ? 'Moderate' :
                                                                    formData.productName === 'Long-Term Holding' ? 'Low' :
                                                                        'Very Low (secured structure)'}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-text-secondary">
                                                            {formData.productName === 'Unlisted Shares' ? 'Dividend:' : 'Guarantee:'}
                                                        </span>
                                                        <span className={`font-semibold ${formData.productName === 'Unlisted Shares' ? 'text-[#1B8A9F]' : 'text-gray-400'}`}>
                                                            {formData.productName === 'Unlisted Shares' ? 'Fixed Dividend' : 'No'}
                                                        </span>
                                                    </div>
                                                </>
                                            )}

                                            <div className="flex justify-between border-t border-blue-200 pt-2 mt-2">
                                                <span className="text-text-secondary font-bold text-blue-800">Maturity Date:</span>
                                                <span className="font-bold text-blue-800">
                                                    {formData.productName === 'Unlisted Shares' ? (
                                                        formData.paymentDate ? (() => {
                                                            const d = new Date(formData.paymentDate);
                                                            d.setFullYear(d.getFullYear() + 3);
                                                            return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
                                                        })() : 'Select payment date'
                                                    ) : 'Immediate (No Lock-in)'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-text-secondary">Lock-in Period:</span>
                                                <span className="font-semibold">{formData.productName === 'Unlisted Shares' ? '3 Years' : 'No Lock-in'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 6: Signature */}
                            {currentStep === 6 && (
                                <div className="space-y-8 animate-fade-in-up">
                                    {formData.productName === 'Unlisted Shares' ? (
                                        <>
                                            <div className="text-center space-y-4">
                                                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto">
                                                    <PenTool className="w-8 h-8 text-[#1B8A9F]" />
                                                </div>
                                                <div>
                                                    <h2 className="text-3xl font-bold text-gray-900">Final Step: Digital Signature</h2>
                                                    <p className="text-gray-500 max-w-md mx-auto">
                                                        Please provide your digital signature to authorize the investment agreement.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="max-w-xl mx-auto p-8 bg-white rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#1B8A9F] transition-all">
                                                <div className="space-y-6">
                                                    <SignatureUpload
                                                        onUpload={(file) => setFiles(prev => ({ ...prev, signatureFile: file }))}
                                                        onRemove={() => {
                                                            setFiles(prev => ({ ...prev, signatureFile: null }));
                                                            setExistingSignatureUrl(null);
                                                        }}
                                                        currentUrl={existingSignatureUrl || undefined}
                                                        label="Digital Signature *"
                                                    />
                                                    {errors.signatureFile && (
                                                        <p className="text-red-500 text-sm font-medium flex items-center gap-1">
                                                            <CheckCircle2 className="w-4 h-4 text-red-500 rotate-45" />
                                                            {errors.signatureFile}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="max-w-4xl mx-auto">
                                            {/* SEO Title - Hidden but present for crawlers */}
                                            <h1 className="sr-only">Apply for Investment Allocation - TraderG Wealth</h1>

                                            <div className="text-center mb-12 space-y-4">
                                                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto">
                                                    <ShieldCheck className="w-8 h-8 text-[#1B8A9F]" />
                                                </div>
                                                <div>
                                                    <h2 className="text-3xl font-bold text-gray-900">Final Step: Agreement</h2>
                                                    <p className="text-gray-500 max-w-md mx-auto">
                                                        Please review and accept our Terms & Conditions to complete your application.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="max-w-xl mx-auto p-8 bg-white rounded-2xl border-2 border-gray-100 shadow-sm transition-all text-center">
                                                <div className="space-y-6">
                                                    <div className="flex items-center justify-center gap-3">
                                                        <input
                                                            type="checkbox"
                                                            id="agreedToTC"
                                                            checked={agreedToTC}
                                                            onChange={(e) => setAgreedToTC(e.target.checked)}
                                                            className="w-5 h-5 rounded border-gray-300 text-[#1B8A9F] focus:ring-[#1B8A9F]"
                                                        />
                                                        <label htmlFor="agreedToTC" className="text-sm text-gray-700">
                                                            I have read and agree to the{' '}
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowTCModal(true)}
                                                                className="text-[#1B8A9F] font-bold underline hover:text-[#156d7d]"
                                                            >
                                                                Terms & Conditions
                                                            </button>
                                                        </label>
                                                    </div>
                                                    {errors.agreedToTC && (
                                                        <p className="text-red-500 text-sm font-medium">{errors.agreedToTC}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}


                            {/* Navigation Buttons */}
                            <div className="flex flex-col-reverse sm:flex-row justify-between mt-8 pt-6 border-t border-gray-200 gap-4">
                                {currentStep > 1 && (
                                    <button
                                        type="button"
                                        onClick={handlePrevious}
                                        className="w-full sm:w-auto px-6 py-3 bg-gray-100 text-gray-900 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-200 hover:border-gray-400 transition-all"
                                    >
                                        Previous
                                    </button>
                                )}

                                <div className="sm:ml-auto w-full sm:w-auto">
                                    {currentStep < 6 ? (
                                        <button
                                            type="button"
                                            onClick={handleNext}
                                            disabled={isValidating}
                                            className="w-full sm:w-auto px-6 py-3 bg-[#1B8A9F] text-white rounded-lg font-semibold hover:bg-[#156d7d] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {isValidating ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Validating...
                                                </>
                                            ) : (
                                                'Next Step'
                                            )}
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={loading || (formData.productName === 'Unlisted Shares' ? (!files.signatureFile && !existingSignatureUrl) : !agreedToTC)}
                                            className="w-full sm:w-auto px-8 py-3 bg-[#1B8A9F] text-white rounded-lg font-bold hover:bg-[#156d7d] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Finalizing Application...
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle2 className="w-5 h-5" />
                                                    Submit Application
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div >

            {showTCModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
                    <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col shadow-2xl animate-fade-in-up">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-teal-50/30">
                            <h3 className="text-xl font-bold text-gray-900">Terms & Conditions</h3>
                            <button
                                onClick={() => setShowTCModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>
                        <div className="p-8 overflow-y-auto prose prose-sm max-w-none">
                            <h2 className="text-2xl font-black mb-6 uppercase tracking-tight text-[#1B8A9F]">TRADERG DISCLOSURE & ACCEPTANCE AGREEMENT</h2>

                            <p className="mb-4">This Disclosure & Acceptance Agreement (&quot;Agreement&quot;) is executed electronically by the User (&quot;I / Client / Account Holder&quot;) in favour of <strong>TRADERG</strong> (&quot;TRADERG&quot; / &quot;Company&quot; / &quot;Platform&quot;).</p>

                            <p className="mb-6">By registering, subscribing, or using any service, product, strategy, or software provided through the TRADERG mobile application or website (<a href="http://www.tradergwealth.com/" className="text-[#1B8A9F]">www.tradergwealth.com</a>), I hereby acknowledge, understand, and agree to the following terms:</p>

                            <div className="space-y-8">
                                <section>
                                    <h4 className="font-black text-xs uppercase tracking-widest text-[#1B8A9F] mb-3">1. Risk Disclosure & Understanding</h4>
                                    <p className="text-gray-700 leading-relaxed">I confirm that I have carefully read and understood all relevant documents, disclosures, and service conditions before subscribing to any TRADERG service, including but not limited to algorithmic strategies, trade management tools, or platform features.</p>
                                    <p className="text-gray-700 leading-relaxed mt-2">I fully understand that <strong>trading and investing in stock markets, derivatives, and other financial instruments involve significant risk</strong>, including the risk of partial or total loss of capital. I acknowledge that returns are not guaranteed.</p>
                                </section>

                                <section>
                                    <h4 className="font-black text-xs uppercase tracking-widest text-[#1B8A9F] mb-3">2. Voluntary Subscription & Decision-Making</h4>
                                    <p className="text-gray-700 leading-relaxed">I declare that my decision to subscribe to and use TRADERG services is made <strong>voluntarily and at my own discretion</strong>. All investment, trading, and withdrawal decisions executed in my trading or demat accounts are solely my responsibility.</p>
                                </section>

                                <section>
                                    <h4 className="font-black text-xs uppercase tracking-widest text-[#1B8A9F] mb-3">3. Acceptance of Terms & Electronic Consent</h4>
                                    <p className="text-gray-700 leading-relaxed">I confirm that I have reviewed and accepted all applicable <strong>Terms & Conditions</strong>, as displayed under each plan or service on the TRADERG mobile application and/or website. By providing electronic consent, I agree to be legally bound by this Agreement.</p>
                                </section>

                                <section>
                                    <h4 className="font-black text-xs uppercase tracking-widest text-[#1B8A9F] mb-3">4. Nature of Services – No Advisory or Guarantee</h4>
                                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                        <li>TRADERG <strong>does not provide investment advisory services, portfolio management services, or trading tips</strong>.</li>
                                        <li>TRADERG operates solely as a <strong>technology platform</strong> that facilitates interaction between users and independent experts offering algorithmic strategies.</li>
                                        <li>TRADERG <strong>does not guarantee performance, profits, accuracy, or suitability</strong> of any strategy, expert, or trading outcome.</li>
                                    </ul>
                                </section>

                                <section className="border-t border-gray-100 pt-8 mt-8">
                                    <h4 className="font-black text-xs uppercase tracking-widest text-[#1B8A9F] mb-3">5. No Liability for Losses</h4>
                                    <p className="text-gray-700 leading-relaxed">I agree and confirm that TRADERG, its associate companies, directors, officers, employees, or partners <strong>shall not be held liable for any losses</strong>, damages, or adverse outcomes arising from:</p>
                                    <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                                        <li>Trades executed using algorithms or strategies</li>
                                        <li>Market volatility or unforeseen events</li>
                                        <li>Broker systems, execution delays, or third-party failures</li>
                                    </ul>
                                    <p className="font-bold text-gray-900 mt-3">All profits and losses accrue solely to my trading account.</p>
                                </section>

                                <section>
                                    <h4 className="font-black text-xs uppercase tracking-widest text-[#1B8A9F] mb-3">6. KYC & Regulatory Compliance</h4>
                                    <p className="text-gray-700 leading-relaxed">I confirm that I have completed my <strong>Know Your Customer (KYC)</strong> process with my respective broker and comply with all applicable regulatory requirements.</p>
                                </section>

                                <section>
                                    <h4 className="font-black text-xs uppercase tracking-widest text-[#1B8A9F] mb-3">9. Fees, Taxes & Non-Refund Policy</h4>
                                    <p className="text-gray-700 leading-relaxed">All subscription fees, service charges, brokerage, transaction fees, and government taxes are <strong>non-refundable</strong> once paid. No adjustment or refund shall be made under any circumstances.</p>
                                </section>

                                <section>
                                    <h4 className="font-black text-xs uppercase tracking-widest text-[#1B8A9F] mb-3">11. Prohibition on Borrowing / Deposit Misuse</h4>
                                    <p className="text-gray-700 leading-relaxed">I acknowledge that borrowing funds from clients or third parties for trading or account growth is strictly prohibited. Any complaint or violation may result in immediate termination and legal consequences.</p>
                                </section>
                            </div>

                            <div className="mt-12 p-6 bg-teal-50 rounded-xl border border-teal-100">
                                <p className="text-sm font-bold text-teal-900 uppercase tracking-widest mb-2">Final Confirmation</p>
                                <p className="text-sm text-teal-800 leading-relaxed">By clicking &quot;I Agree&quot; on the previous screen, you legally bind yourself to these terms and the Disclosure &amp; Acceptance Agreement.</p>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-100 flex justify-end bg-gray-50">
                            <button
                                onClick={() => {
                                    setAgreedToTC(true);
                                    setShowTCModal(false);
                                }}
                                className="px-8 py-3 bg-[#1B8A9F] text-white rounded-lg font-bold hover:bg-[#156d7d] transition-all shadow-lg"
                            >
                                I Agree & Close
                            </button>
                        </div>
                    </div>
                </div>
            )
            }
        </div >
    );
}
export default function ApplyPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#1B8A9F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500 font-medium">Loading investment form...</p>
                </div>
            </div>
        }>
            <ApplyForm />
        </Suspense>
    );
}
