'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Users as UsersIcon, Building2, DollarSign, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ApplyPage() {
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
        paymentDate: '',
        dematAccount: '',

        // Product & Broker
        productName: '',
        brokerId: '',
        brokerName: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isPreFilled, setIsPreFilled] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                // Fetch the latest investment for this user to pre-fill details
                const { data: investments, error } = await supabase
                    .from('investments')
                    .select('*')
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
                    }));
                    setIsPreFilled(true);
                } else {
                    // If no investment found, just fill the email from auth
                    setFormData(prev => ({ ...prev, email: session.user.email || '' }));
                }
            }
        };

        checkSession();
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

    const validateStep = (step: number): boolean => {
        const newErrors: Record<string, string> = {};

        if (step === 1) {
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
            if (!formData.panNumber) newErrors.panNumber = 'PAN number is required';
            else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber.toUpperCase())) newErrors.panNumber = 'Invalid PAN format';
            if (!formData.aadharNumber) newErrors.aadharNumber = 'Aadhar number is required';
            else if (!/^[0-9]{12}$/.test(formData.aadharNumber)) newErrors.aadharNumber = 'Invalid Aadhar (enter 12 digits)';
            if (!formData.maritalStatus) newErrors.maritalStatus = 'Marital status is required';
        }

        if (step === 2) {
            if (!formData.nomineeName) newErrors.nomineeName = 'Nominee name is required';
            if (!formData.nomineeRelation) newErrors.nomineeRelation = 'Relation is required';
            if (!formData.nomineeDob) newErrors.nomineeDob = 'Nominee DOB is required';
            if (!formData.nomineeAddress) newErrors.nomineeAddress = 'Nominee address is required';
        }

        if (step === 3) {
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

        if (step === 4) {
            if (!formData.investmentAmount) newErrors.investmentAmount = 'Investment amount is required';
            else if (parseFloat(formData.investmentAmount) < 500000) newErrors.investmentAmount = 'Minimum investment is ₹5,00,000';
            if (!formData.productName) newErrors.productName = 'Product selection is required';
            if (!formData.paymentMode) newErrors.paymentMode = 'Payment mode is required';
            if (!formData.paymentReference) newErrors.paymentReference = 'Payment reference is required';
            if (!formData.paymentDate) newErrors.paymentDate = 'Payment date is required';
            if (formData.dematAccount && formData.dematAccount.length !== 16) newErrors.dematAccount = 'Demat account must be 16 digits';
            if (!formData.brokerId) newErrors.brokerId = 'Broker ID is required';
            if (!formData.brokerName) newErrors.brokerName = 'Broker Name is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrevious = () => {
        setCurrentStep(prev => prev - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateStep(4)) return;

        setLoading(true);

        try {
            const response = await fetch('/api/investments/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
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
        { number: 1, title: 'Personal Details', icon: User },
        { number: 2, title: 'Nominee Details', icon: UsersIcon },
        { number: 3, title: 'Bank Details', icon: Building2 },
        { number: 4, title: 'Investment Details', icon: DollarSign },
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
                            alt="SHREEG Logo"
                            width={150}
                            height={40}
                            className="h-10 w-auto"
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
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
                            {/* Step 1: Personal Details */}
                            {currentStep === 1 && (
                                <div className="space-y-6 animate-fade-in-up">
                                    <div>
                                        <h2 className="text-2xl font-bold mb-2">Personal Details</h2>
                                        {isPreFilled ? (
                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-teal-50 text-teal-700 rounded-lg text-sm font-medium inline-flex">
                                                <Sparkles className="w-4 h-4" />
                                                Welcome back! Details pre-filled from your profile.
                                            </div>
                                        ) : (
                                            <p className="text-text-secondary">Please provide your personal information</p>
                                        )}
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="label">Full Name *</label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                className={`input ${errors.fullName ? 'input-error' : ''}`}
                                                placeholder="Enter your full name"
                                            />
                                            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                                        </div>

                                        <div>
                                            <label className="label">Father's Name *</label>
                                            <input
                                                type="text"
                                                name="fatherName"
                                                value={formData.fatherName}
                                                onChange={handleChange}
                                                className={`input ${errors.fatherName ? 'input-error' : ''}`}
                                                placeholder="Enter father's name"
                                            />
                                            {errors.fatherName && <p className="text-red-500 text-sm mt-1">{errors.fatherName}</p>}
                                        </div>

                                        <div>
                                            <label className="label">Date of Birth *</label>
                                            <input
                                                type="date"
                                                name="dob"
                                                value={formData.dob}
                                                onChange={handleChange}
                                                className={`input ${errors.dob ? 'input-error' : ''}`}
                                            />
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
                                            <select
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleChange}
                                                className={`input ${errors.gender ? 'input-error' : ''}`}
                                            >
                                                <option value="">Select gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
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

                                        <div>
                                            <label className="label">PAN Number *</label>
                                            <input
                                                type="text"
                                                name="panNumber"
                                                value={formData.panNumber}
                                                onChange={(e) => {
                                                    const val = e.target.value.toUpperCase();
                                                    setFormData(prev => ({ ...prev, panNumber: val }));
                                                }}
                                                className={`input ${errors.panNumber ? 'input-error' : ''}`}
                                                placeholder="ABCDE1234F"
                                                maxLength={10}
                                            />
                                            {errors.panNumber && <p className="text-red-500 text-sm mt-1">{errors.panNumber}</p>}
                                        </div>

                                        <div>
                                            <label className="label">Aadhar Number *</label>
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
                                                className={`input ${errors.aadharNumber ? 'input-error' : ''}`}
                                                placeholder="12-digit Aadhar number"
                                                maxLength={12}
                                            />
                                            {errors.aadharNumber && <p className="text-red-500 text-sm mt-1">{errors.aadharNumber}</p>}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="label">Permanent Address *</label>
                                            <textarea
                                                name="permanentAddress"
                                                value={formData.permanentAddress}
                                                onChange={handleChange}
                                                rows={3}
                                                className={`input ${errors.permanentAddress ? 'input-error' : ''}`}
                                                placeholder="Enter your complete address"
                                            />
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
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Nominee Details */}
                            {currentStep === 2 && (
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
                                            />
                                            {errors.nomineeAddress && <p className="text-red-500 text-sm mt-1">{errors.nomineeAddress}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Bank Details */}
                            {currentStep === 3 && (
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

                            {/* Step 4: Investment Details */}
                            {currentStep === 4 && (
                                <div className="space-y-6 animate-fade-in-up">
                                    <div>
                                        <h2 className="text-2xl font-bold mb-2">Investment Details</h2>
                                        <p className="text-text-secondary">Provide your investment and payment information</p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="label">Select Investment Product *</label>
                                            <select
                                                name="productName"
                                                value={formData.productName}
                                                onChange={handleChange}
                                                className={`input ${errors.productName ? 'input-error' : ''}`}
                                            >
                                                <option value="">Select a product</option>
                                                <option value="Intraday Trading">Intraday Trading (Monthly)</option>
                                                <option value="Short-Term SIP">Short-Term SIP (Quarterly)</option>
                                                <option value="Long-Term Holding">Long-Term Holding (Yearly)</option>
                                                <option value="Unlisted Shares">Unlisted Shares (3-Year Lock-in)</option>
                                            </select>
                                            {errors.productName && <p className="text-red-500 text-sm mt-1">{errors.productName}</p>}
                                        </div>

                                        <div>
                                            <label className="label">Investment Amount (₹) *</label>
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
                                            <p className="text-[10px] text-teal-600 font-bold mt-1 uppercase tracking-wider">Minimum investment: ₹5.00 Lakhs</p>
                                            {errors.investmentAmount && <p className="text-red-500 text-sm mt-1">{errors.investmentAmount}</p>}
                                        </div>

                                        <div>
                                            <label className="label">Number of Shares</label>
                                            <input
                                                type="number"
                                                name="numberOfShares"
                                                value={formData.numberOfShares}
                                                readOnly
                                                className="input bg-gray-50"
                                                placeholder="Auto-calculated"
                                            />
                                            <p className="text-xs text-text-tertiary mt-1">@ ₹100 per share</p>
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
                                                <label className="label">Broker ID *</label>
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
                                                <label className="label">Broker Name *</label>
                                                <select
                                                    name="brokerName"
                                                    value={formData.brokerName}
                                                    onChange={handleChange}
                                                    className={`input ${errors.brokerName ? 'input-error' : ''}`}
                                                >
                                                    <option value="">Select broker</option>
                                                    <option value="Direct">Direct (No Broker)</option>
                                                    <option value="Broker A">Shreeg Authorized Broker A</option>
                                                    <option value="Broker B">Shreeg Authorized Broker B</option>
                                                    <option value="Broker C">Shreeg Authorized Broker C</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                                {errors.brokerName && <p className="text-red-500 text-sm mt-1">{errors.brokerName}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                                        <h3 className="font-bold text-lg mb-3">Investment Summary</h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-text-secondary">Investment Amount:</span>
                                                <span className="font-semibold">₹{formData.investmentAmount || '0'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-text-secondary">Number of Shares:</span>
                                                <span className="font-semibold">{formData.numberOfShares || '0'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-text-secondary">Face Value per Share:</span>
                                                <span className="font-semibold">₹100</span>
                                            </div>
                                            <div className="flex justify-between border-t border-blue-200 pt-2 mt-2">
                                                <span className="text-text-secondary font-bold text-blue-800">Maturity Date:</span>
                                                <span className="font-bold text-blue-800">
                                                    {formData.paymentDate ? (() => {
                                                        const d = new Date(formData.paymentDate);
                                                        d.setFullYear(d.getFullYear() + 3);
                                                        return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
                                                    })() : 'Select payment date'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-text-secondary">Lock-in Period:</span>
                                                <span className="font-semibold">3 Years</span>
                                            </div>
                                        </div>
                                    </div>
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
                                    {currentStep < 4 ? (
                                        <button
                                            type="button"
                                            onClick={handleNext}
                                            className="w-full sm:w-auto px-6 py-3 bg-[#1B8A9F] text-white rounded-lg font-semibold hover:bg-[#156d7d] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                                        >
                                            Next Step
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full sm:w-auto px-6 py-3 bg-[#1B8A9F] text-white rounded-lg font-semibold hover:bg-[#156d7d] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 mr-2 inline animate-spin" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                'Submit Application'
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
