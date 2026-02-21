'use client';

import React, { useState, useRef } from 'react';
import { X, Upload, Download, Loader2, CheckCircle2, AlertCircle, Eye, FileSpreadsheet, UserPlus, Users, ArrowLeft, Save, ShieldCheck } from 'lucide-react';
import Baby from 'papaparse';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onComplete: () => void;
}

type OnboardingMode = 'selection' | 'single' | 'bulk' | 'success';

export default function OnboardingModal({ isOpen, onClose, onComplete }: Props) {
    const [mode, setMode] = useState<OnboardingMode>('selection');
    const [file, setFile] = useState<File | null>(null);
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // KYC Files state
    const [kycFiles, setKycFiles] = useState<{
        panFile: File | null;
        aadharFile: File | null;
        bankChequeFile: File | null;
        signatureFile: File | null;
    }>({
        panFile: null,
        aadharFile: null,
        bankChequeFile: null,
        signatureFile: null
    });

    // Form state for single onboarding
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        contactNumber: '',
        investmentAmount: '',
        paymentDate: new Date().toISOString().split('T')[0],
        productName: 'Unlisted Shares',
        status: 'active',
        fatherName: '',
        dob: '',
        gender: 'Male',
        occupation: '',
        permanentAddress: '',
        panNumber: '',
        aadharNumber: '',
        maritalStatus: 'Single',
        nomineeName: '',
        nomineeRelation: '',
        nomineeDob: '',
        nomineeAddress: '',
        accountNumber: '',
        bankName: '',
        branch: '',
        ifscCode: '',
        micrCode: '',
        accountType: 'Savings',
        numberOfShares: '',
        dematAccount: '',
        brokerId: '',
        brokerName: '',
        paymentMode: 'NEFT',
        paymentReference: '',
        age: '',
        referralCode: '',
        panUrl: '',
        aadharUrl: '',
        bankChequeUrl: '',
        clientSignatureUrl: ''
    });

    const [brokers, setBrokers] = useState<any[]>([]);

    React.useEffect(() => {
        if (isOpen) {
            const fetchBrokers = async () => {
                try {
                    const res = await fetch('/api/brokers');
                    const data = await res.json();
                    if (data.brokers) setBrokers(data.brokers);
                } catch (error) {
                    console.error('Error fetching brokers:', error);
                }
            };
            fetchBrokers();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const resetModal = () => {
        setMode('selection');
        setFile(null);
        setPreviewData([]);
        setResults(null);
        setError(null);
        setKycFiles({
            panFile: null,
            aadharFile: null,
            bankChequeFile: null,
            signatureFile: null
        });
        setFormData({
            fullName: '',
            email: '',
            contactNumber: '',
            investmentAmount: '',
            paymentDate: new Date().toISOString().split('T')[0],
            productName: 'Unlisted Shares',
            status: 'active',
            fatherName: '',
            dob: '',
            gender: 'Male',
            occupation: '',
            permanentAddress: '',
            panNumber: '',
            aadharNumber: '',
            maritalStatus: 'Single',
            nomineeName: '',
            nomineeRelation: '',
            nomineeDob: '',
            nomineeAddress: '',
            accountNumber: '',
            bankName: '',
            branch: '',
            ifscCode: '',
            micrCode: '',
            accountType: 'Savings',
            numberOfShares: '',
            dematAccount: '',
            brokerId: '',
            brokerName: '',
            paymentMode: 'NEFT',
            paymentReference: '',
            age: '',
            referralCode: '',
            panUrl: '',
            aadharUrl: '',
            bankChequeUrl: '',
            clientSignatureUrl: ''
        });
    };

    const uploadDocument = async (file: File, path: string): Promise<string | null> => {
        const { supabase } = await import('@/lib/supabase');
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const fullPath = `${path}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('documents')
            .upload(fullPath, file);

        if (uploadError) {
            console.error(`Upload error for ${path}:`, uploadError);
            return null;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('documents')
            .getPublicUrl(fullPath);

        return publicUrl;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
            Baby.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    setPreviewData(results.data.slice(0, 5));
                },
                error: (err) => {
                    setError('Error parsing CSV file');
                    console.error(err);
                }
            });
        }
    };

    const handleBulkImport = async () => {
        if (!file) return;
        setLoading(true);
        setError(null);

        Baby.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (csvResults) => {
                try {
                    const response = await fetch('/api/admin/bulk-onboard', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ data: csvResults.data }),
                    });

                    const data = await response.json();
                    if (response.ok) {
                        setResults(data);
                        setMode('success');
                    } else {
                        setError(data.error || 'Failed to import data');
                    }
                } catch (err) {
                    setError('An error occurred during import');
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    const handleSingleImport = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // 1. Upload KYC documents if any
            let panUrl = '';
            let aadharUrl = '';
            let bankChequeUrl = '';
            let clientSignatureUrl = '';

            if (kycFiles.panFile) {
                panUrl = await uploadDocument(kycFiles.panFile, 'pan-cards') || '';
            }
            if (kycFiles.aadharFile) {
                aadharUrl = await uploadDocument(kycFiles.aadharFile, 'aadhar-cards') || '';
            }
            if (kycFiles.bankChequeFile) {
                bankChequeUrl = await uploadDocument(kycFiles.bankChequeFile, 'bank-cheques') || '';
            }
            if (kycFiles.signatureFile) {
                clientSignatureUrl = await uploadDocument(kycFiles.signatureFile, 'client_signatures') || '';
            }

            // 2. Prepare payload
            const payload = {
                ...formData,
                panUrl,
                aadharUrl,
                bankChequeUrl,
                clientSignatureUrl
            };

            const response = await fetch('/api/admin/bulk-onboard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: [payload] }),
            });

            const data = await response.json();
            if (response.ok) {
                if (data.success > 0) {
                    setResults(data);
                    setMode('success');
                } else {
                    setError(data.errors[0]?.error || 'Failed to onboard client');
                }
            } else {
                setError(data.error || 'Failed to onboard client');
            }
        } catch (err) {
            console.error('Onboarding Error:', err);
            setError('An error occurred during onboarding');
        } finally {
            setLoading(false);
        }
    };

    const downloadTemplate = () => {
        const headers = [
            'fullName', 'email', 'contactNumber', 'investmentAmount', 'paymentDate',
            'productName', 'status', 'fatherName', 'dob', 'gender', 'occupation',
            'permanentAddress', 'nomineeName', 'nomineeRelation', 'nomineeDob',
            'nomineeAddress', 'accountNumber', 'bankName', 'branch', 'ifscCode',
            'micrCode', 'accountType', 'numberOfShares', 'dematAccount', 'paymentMode',
            'paymentReference', 'referralCode', 'brokerId', 'brokerName'
        ];
        const rows = [
            [
                'John Doe', 'john@example.com', '9876543210', '100000', '2023-01-10',
                'Unlisted Shares', 'active', 'Richard Doe', '1985-05-20', 'Male', 'Business',
                'Mumbai, India', 'Jane Doe', 'Spouse', '1990-10-15', 'Mumbai, India',
                '1234567890', 'HDFC Bank', 'Mumbai', 'HDFC0001234', '123456', 'Savings',
                '1000', '1201060012345678', 'NEFT', 'UTR123456', 'REF001', 'BROKER_ID_HERE', 'BROKER_NAME_HERE'
            ]
        ];

        const csvContent = Baby.unparse({
            fields: headers,
            data: rows
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', 'historical_clients_template.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handleClose = () => {
        resetModal();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[120] p-4">
            <div className={`bg-white rounded-3xl shadow-2xl p-0 transition-all duration-500 overflow-hidden max-h-[90vh] flex flex-col ${mode === 'single' ? 'max-w-5xl w-full' : 'max-w-4xl w-full'}`}>
                {/* Header */}
                <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                    <div className="flex items-center space-x-4">
                        {mode !== 'selection' && mode !== 'success' && (
                            <button onClick={() => setMode('selection')} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
                                <ArrowLeft className="w-5 h-5 text-gray-400" />
                            </button>
                        )}
                        <div>
                            <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase italic">
                                {mode === 'selection' ? 'Client Import Engine' :
                                    mode === 'single' ? 'Manual Historical Entry' :
                                        mode === 'bulk' ? 'Bulk Historical Import' : 'Onboarding Summary'}
                            </h3>
                            <p className="text-[10px] text-[#1B8A9F] font-bold uppercase tracking-[0.2em] mt-1">
                                Securely onboard historical client records
                            </p>
                        </div>
                    </div>
                    <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
                    {mode === 'selection' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
                            <button
                                onClick={() => setMode('single')}
                                className="group relative bg-white border-2 border-gray-100 hover:border-[#1B8A9F] p-10 rounded-[40px] text-center transition-all hover:shadow-2xl hover:shadow-teal-50 hover:-translate-y-1"
                            >
                                <div className="w-20 h-20 bg-teal-50 text-[#1B8A9F] rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                                    <UserPlus className="w-10 h-10" />
                                </div>
                                <h4 className="text-xl font-black text-gray-900 uppercase italic">Single Client</h4>
                                <p className="text-sm text-gray-500 mt-2 font-medium">Manually enter details for a single historical client entry.</p>
                            </button>

                            <button
                                onClick={() => setMode('bulk')}
                                className="group relative bg-white border-2 border-gray-100 hover:border-[#1B8A9F] p-10 rounded-[40px] text-center transition-all hover:shadow-2xl hover:shadow-teal-50 hover:-translate-y-1"
                            >
                                <div className="w-20 h-20 bg-gray-50 text-gray-400 group-hover:bg-[#1B8A9F]/10 group-hover:text-[#1B8A9F] rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                                    <Users className="w-10 h-10" />
                                </div>
                                <h4 className="text-xl font-black text-gray-900 uppercase italic">Bulk Import</h4>
                                <p className="text-sm text-gray-500 mt-2 font-medium">Upload a CSV file containing multiple historical records.</p>
                            </button>
                        </div>
                    )}

                    {mode === 'bulk' && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            {/* Upload Area */}
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={`
                                    relative border-3 border-dashed rounded-[32px] p-12 text-center transition-all cursor-pointer
                                    ${file ? 'border-teal-200 bg-teal-50/50' : 'border-gray-100 bg-gray-50/50 hover:bg-gray-50 hover:border-teal-100'}
                                `}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept=".csv"
                                    onChange={handleFileChange}
                                />
                                <div className="flex flex-col items-center">
                                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 transition-transform hover:scale-110 duration-500 shadow-lg ${file ? 'bg-teal-500 text-white shadow-teal-200' : 'bg-white text-gray-400'}`}>
                                        <FileSpreadsheet className="w-10 h-10" />
                                    </div>
                                    <h4 className="text-lg font-black text-gray-900 uppercase">
                                        {file ? file.name : 'Select Historical CSV'}
                                    </h4>
                                    <p className="text-sm text-gray-500 mt-2 font-medium italic">
                                        Drag and drop or click to browse. Ensure your CSV matches the template structure.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); downloadTemplate(); }}
                                        className="mt-6 flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-[#1B8A9F] hover:text-[#156d7d] transition-colors"
                                    >
                                        <Download className="w-4 h-4" />
                                        <span>Download CSV Template</span>
                                    </button>
                                </div>
                            </div>

                            {/* Preview */}
                            {previewData.length > 0 && (
                                <div className="animate-in fade-in duration-700">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                                        <div className="w-1.5 h-1.5 bg-[#1B8A9F] rounded-full mr-2"></div>
                                        Data Preview (First 5 Rows)
                                    </h4>
                                    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-gray-50/50">
                                                <tr>
                                                    <th className="px-4 py-3 text-[9px] font-black text-gray-400 uppercase tracking-widest">Client Name</th>
                                                    <th className="px-4 py-3 text-[9px] font-black text-gray-400 uppercase tracking-widest">Email</th>
                                                    <th className="px-4 py-3 text-[9px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                                                    <th className="px-4 py-3 text-[9px] font-black text-gray-400 uppercase tracking-widest">Join Date</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {previewData.map((row, idx) => (
                                                    <tr key={idx}>
                                                        <td className="px-4 py-3 text-sm font-bold text-gray-900">{row.fullName}</td>
                                                        <td className="px-4 py-3 text-sm text-gray-500 font-medium">{row.email}</td>
                                                        <td className="px-4 py-3 text-sm font-black text-teal-600">₹{parseFloat(row.investmentAmount).toLocaleString('en-IN')}</td>
                                                        <td className="px-4 py-3 text-sm text-gray-500 font-medium">{row.paymentDate}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {mode === 'single' && (
                        <form id="single-onboard-form" onSubmit={handleSingleImport} className="space-y-12 animate-in slide-in-from-right duration-500">
                            {/* Personal Details */}
                            <section>
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center">
                                    <div className="w-1.5 h-1.5 bg-[#1B8A9F] rounded-full mr-2"></div>
                                    Client & Personal Information
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
                                        <input required type="text" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-teal-100 transition-all" placeholder="e.g. John Doe" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Email Address</label>
                                        <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-teal-100 transition-all" placeholder="john@example.com" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Contact Number</label>
                                        <input required type="tel" value={formData.contactNumber} onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-teal-100 transition-all" placeholder="9876543210" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Father's Name</label>
                                        <input type="text" value={formData.fatherName} onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-teal-100 transition-all" placeholder="Father's Name" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Date of Birth</label>
                                        <input type="date" value={formData.dob} onChange={(e) => {
                                            const dob = e.target.value;
                                            let ageStr = '';
                                            if (dob) {
                                                const birthDate = new Date(dob);
                                                const today = new Date();
                                                let age = today.getFullYear() - birthDate.getFullYear();
                                                const m = today.getMonth() - birthDate.getMonth();
                                                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
                                                ageStr = age.toString();
                                            }
                                            setFormData({ ...formData, dob, age: ageStr });
                                        }} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-teal-100 transition-all" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Age</label>
                                        <input readOnly type="number" value={formData.age} className="w-full bg-gray-100 border-none rounded-2xl px-5 py-4 text-sm font-bold text-gray-500 transition-all" placeholder="Auto" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Gender</label>
                                        <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-teal-100 transition-all appearance-none">
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Marital Status</label>
                                        <select value={formData.maritalStatus} onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-teal-100 transition-all appearance-none">
                                            <option value="Single">Single</option>
                                            <option value="Married">Married</option>
                                            <option value="Divorced">Divorced</option>
                                            <option value="Widowed">Widowed</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Occupation</label>
                                        <input type="text" value={formData.occupation} onChange={(e) => setFormData({ ...formData, occupation: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-teal-100 transition-all" placeholder="Occupation" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-[#1B8A9F] uppercase tracking-wider ml-1">Referral Code</label>
                                        <input type="text" value={formData.referralCode} onChange={(e) => setFormData({ ...formData, referralCode: e.target.value.toUpperCase() })} className="w-full bg-teal-50/30 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-teal-100 transition-all" placeholder="Optional" />
                                    </div>
                                    <div className="md:col-span-3 space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Permanent Address</label>
                                        <textarea rows={2} value={formData.permanentAddress} onChange={(e) => setFormData({ ...formData, permanentAddress: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-teal-100 transition-all resize-none" placeholder="Enter Full Address..." />
                                    </div>
                                </div>
                            </section>

                            {/* Investment Details */}
                            <section>
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center">
                                    <div className="w-1.5 h-1.5 bg-[#1B8A9F] rounded-full mr-2"></div>
                                    Investment & Product Configuration
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Investment Amount (₹)</label>
                                        <input required type="number" value={formData.investmentAmount} onChange={(e) => setFormData({ ...formData, investmentAmount: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold text-[#1B8A9F] focus:ring-2 focus:ring-teal-100 transition-all" placeholder="100000" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Historical Join Date</label>
                                        <input required type="date" value={formData.paymentDate} onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-teal-100 transition-all" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Number of Shares</label>
                                        <input type="number" value={formData.numberOfShares} onChange={(e) => setFormData({ ...formData, numberOfShares: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-teal-100 transition-all" placeholder="1000" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Product Name</label>
                                        <input type="text" value={formData.productName} onChange={(e) => setFormData({ ...formData, productName: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-teal-100 transition-all" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Initial Status</label>
                                        <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-teal-100 transition-all appearance-none">
                                            <option value="active">Active/Bonded</option>
                                            <option value="approved">Approved</option>
                                            <option value="pending">Pending</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Demat A/C (16-digit)</label>
                                        <input type="text" maxLength={16} value={formData.dematAccount} onChange={(e) => setFormData({ ...formData, dematAccount: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-teal-100 transition-all" placeholder="CDSL/NSDL Account" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Payment Mode</label>
                                        <select value={formData.paymentMode} onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-teal-100 transition-all appearance-none">
                                            <option value="NEFT">NEFT</option>
                                            <option value="RTGS">RTGS</option>
                                            <option value="IMPS">IMPS</option>
                                            <option value="UPI">UPI</option>
                                            <option value="Cheque">Cheque</option>
                                            <option value="Cash">Cash</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Payment Ref / UTR</label>
                                        <input type="text" value={formData.paymentReference} onChange={(e) => setFormData({ ...formData, paymentReference: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-teal-100 transition-all" placeholder="Reference Number" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Assigned Broker</label>
                                        <select
                                            value={formData.brokerName}
                                            onChange={(e) => {
                                                setFormData({ ...formData, brokerName: e.target.value });
                                            }}
                                            className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-teal-100 transition-all appearance-none"
                                        >
                                            <option value="">Select Broker</option>
                                            {brokers.map(broker => (
                                                <option key={broker.id} value={broker.name}>{broker.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Broker ID / Code</label>
                                        <input
                                            type="text"
                                            value={formData.brokerId}
                                            onChange={(e) => setFormData({ ...formData, brokerId: e.target.value })}
                                            className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-teal-100 transition-all uppercase"
                                            placeholder="Enter Broker ID"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Bank Details */}
                            <section>
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center">
                                    <div className="w-1.5 h-1.5 bg-[#1B8A9F] rounded-full mr-2"></div>
                                    Banking & Payout Channels
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Bank Name</label>
                                        <input type="text" value={formData.bankName} onChange={(e) => setFormData({ ...formData, bankName: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-teal-100 transition-all" placeholder="HDFC Bank" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">A/C Number</label>
                                        <input type="text" value={formData.accountNumber} onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-teal-100 transition-all" placeholder="50100..." />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">IFSC Code</label>
                                        <input type="text" value={formData.ifscCode} onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-teal-100 transition-all" placeholder="HDFC000..." />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Branch</label>
                                        <input type="text" value={formData.branch} onChange={(e) => setFormData({ ...formData, branch: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-teal-100 transition-all" placeholder="Mumbai" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">MICR Code</label>
                                        <input type="text" value={formData.micrCode} onChange={(e) => setFormData({ ...formData, micrCode: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-teal-100 transition-all" placeholder="MICR Code" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">A/C Type</label>
                                        <select value={formData.accountType} onChange={(e) => setFormData({ ...formData, accountType: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-teal-100 transition-all appearance-none">
                                            <option value="Savings">Savings</option>
                                            <option value="Current">Current</option>
                                            <option value="NRE">NRE</option>
                                            <option value="NRO">NRO</option>
                                        </select>
                                    </div>
                                </div>
                            </section>

                            {/* Nominee Details */}
                            <section>
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center">
                                    <div className="w-1.5 h-1.5 bg-[#1B8A9F] rounded-full mr-2"></div>
                                    Nominee & Succession Details
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Nominee Name</label>
                                        <input type="text" value={formData.nomineeName} onChange={(e) => setFormData({ ...formData, nomineeName: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-teal-100 transition-all" placeholder="Nominee Name" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Relationship</label>
                                        <input type="text" value={formData.nomineeRelation} onChange={(e) => setFormData({ ...formData, nomineeRelation: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-teal-100 transition-all" placeholder="Spouse / Parent / etc." />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Nominee DOB</label>
                                        <input type="date" value={formData.nomineeDob} onChange={(e) => setFormData({ ...formData, nomineeDob: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-teal-100 transition-all" />
                                    </div>
                                    <div className="md:col-span-2 space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Nominee Address</label>
                                        <textarea rows={2} value={formData.nomineeAddress} onChange={(e) => setFormData({ ...formData, nomineeAddress: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-teal-100 transition-all resize-none" placeholder="Enter Nominee's Address..." />
                                    </div>
                                </div>
                            </section>

                            {/* Identity & KYC Documents */}
                            <section>
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center">
                                    <div className="w-1.5 h-1.5 bg-[#1B8A9F] rounded-full mr-2"></div>
                                    Identity & KYC Documents
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* PAN */}
                                    <div className="space-y-4 p-6 bg-gray-50/50 border border-gray-100 rounded-3xl">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <ShieldCheck className="w-4 h-4 text-[#1B8A9F]" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">PAN Verification</span>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">PAN Card Number</label>
                                            <input type="text" value={formData.panNumber} onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })} className="w-full bg-white border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-teal-100 transition-all" placeholder="ABCDE1234F" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">PAN Card Upload</label>
                                            <div className="relative group">
                                                <input
                                                    type="file"
                                                    accept="image/*,.pdf"
                                                    onChange={(e) => setKycFiles({ ...kycFiles, panFile: e.target.files?.[0] || null })}
                                                    className="w-full bg-white border-gray-100 rounded-xl px-4 py-3 text-xs font-medium focus:ring-2 focus:ring-teal-100 transition-all file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-teal-50 file:text-[#1B8A9F] hover:file:bg-teal-100"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Aadhaar */}
                                    <div className="space-y-4 p-6 bg-gray-50/50 border border-gray-100 rounded-3xl">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <ShieldCheck className="w-4 h-4 text-[#1B8A9F]" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">Aadhaar Verification</span>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Aadhaar Number</label>
                                            <input type="text" value={formData.aadharNumber} onChange={(e) => setFormData({ ...formData, aadharNumber: e.target.value })} className="w-full bg-white border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-teal-100 transition-all" placeholder="12-digit Aadhaar" maxLength={12} />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Aadhaar Card Upload</label>
                                            <div className="relative group">
                                                <input
                                                    type="file"
                                                    accept="image/*,.pdf"
                                                    onChange={(e) => setKycFiles({ ...kycFiles, aadharFile: e.target.files?.[0] || null })}
                                                    className="w-full bg-white border-gray-100 rounded-xl px-4 py-3 text-xs font-medium focus:ring-2 focus:ring-teal-100 transition-all file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-teal-50 file:text-[#1B8A9F] hover:file:bg-teal-100"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bank Cheque */}
                                    <div className="md:col-span-2 space-y-4 p-6 bg-gray-50/50 border border-gray-100 rounded-3xl">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <Upload className="w-4 h-4 text-[#1B8A9F]" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">Cancelled Cheque / Passbook</span>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Cheque Upload</label>
                                            <div className="relative group">
                                                <input
                                                    type="file"
                                                    accept="image/*,.pdf"
                                                    onChange={(e) => setKycFiles({ ...kycFiles, bankChequeFile: e.target.files?.[0] || null })}
                                                    className="w-full bg-white border-gray-100 rounded-xl px-4 py-3 text-xs font-medium focus:ring-2 focus:ring-teal-100 transition-all file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-teal-50 file:text-[#1B8A9F] hover:file:bg-teal-100"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Client Signature */}
                                    <div className="md:col-span-2 space-y-4 p-6 bg-gradient-to-br from-[#1B8A9F]/5 to-teal-50/30 border border-[#1B8A9F]/10 rounded-3xl">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <Save className="w-4 h-4 text-[#1B8A9F]" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">Digital Signature upload</span>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Signature Image (PNG/JPG)</label>
                                            <div className="relative group">
                                                <input
                                                    required
                                                    type="file"
                                                    accept="image/png,image/jpeg"
                                                    onChange={(e) => setKycFiles({ ...kycFiles, signatureFile: e.target.files?.[0] || null })}
                                                    className="w-full bg-white border-[#1B8A9F]/20 rounded-xl px-4 py-3 text-xs font-medium focus:ring-2 focus:ring-teal-100 transition-all file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-[#1B8A9F] file:text-white hover:file:bg-[#156d7d]"
                                                />
                                            </div>
                                            <p className="text-[9px] text-gray-400 mt-2 font-medium italic">Signature will be used for auto-generating future agreements.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </form>
                    )}

                    {mode === 'success' && results && (
                        <div className="text-center py-12 space-y-6 animate-in slide-in-from-bottom duration-700">
                            <div className="w-24 h-24 bg-teal-50 text-teal-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-teal-50">
                                <CheckCircle2 className="w-12 h-12" />
                            </div>
                            <div>
                                <h4 className="text-3xl font-black text-gray-900 uppercase">Onboarding Complete</h4>
                                <p className="text-gray-500 font-medium mt-2">The client records have been successfully integrated into the system.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                                <div className="bg-teal-50/50 p-6 rounded-[32px] border border-teal-100">
                                    <p className="text-3xl font-black text-teal-600">{results.success}</p>
                                    <p className="text-[10px] font-bold text-teal-500 uppercase tracking-widest mt-1">Success</p>
                                </div>
                                <div className={`p-6 rounded-[32px] border ${results.failed > 0 ? 'bg-red-50 border-red-100' : 'bg-gray-50/50 border-gray-100'}`}>
                                    <p className={`text-3xl font-black ${results.failed > 0 ? 'text-red-500' : 'text-gray-400'}`}>{results.failed}</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Failed</p>
                                </div>
                            </div>

                            {results.errors?.length > 0 && (
                                <div className="text-left bg-gray-50 rounded-2xl p-6 border border-gray-100 max-h-40 overflow-y-auto">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Error Log</p>
                                    <div className="space-y-2">
                                        {results.errors.map((err: any, idx: number) => (
                                            <div key={idx} className="flex items-center space-x-2 text-xs text-red-600 font-bold">
                                                <X className="w-3 h-3" />
                                                <span>{err.email}: {err.error}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {error && mode !== 'success' && (
                        <div className="mt-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start space-x-3 text-red-600 text-sm font-medium animate-in zoom-in duration-300">
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <p>{error}</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-8 bg-gray-50 border-t border-gray-100 flex items-center justify-between sticky bottom-0 z-10">
                    <button
                        onClick={mode === 'selection' || mode === 'success' ? handleClose : () => setMode('selection')}
                        className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors uppercase tracking-widest px-6 py-3"
                    >
                        {mode === 'selection' || mode === 'success' ? 'Close' : 'Cancel'}
                    </button>

                    {mode === 'bulk' && !results && (
                        <button
                            disabled={!file || loading}
                            onClick={handleBulkImport}
                            className="bg-gray-900 text-white px-10 py-4 rounded-2xl text-sm font-black uppercase tracking-[0.2em] shadow-xl hover:bg-[#1B8A9F] transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:grayscale flex items-center space-x-3"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
                            <span>{loading ? 'Processing...' : 'Verify & Import'}</span>
                        </button>
                    )}

                    {mode === 'single' && !results && (
                        <button
                            form="single-onboard-form"
                            type="submit"
                            disabled={loading}
                            className="bg-gray-900 text-white px-10 py-4 rounded-2xl text-sm font-black uppercase tracking-[0.2em] shadow-xl hover:bg-[#1B8A9F] transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:grayscale flex items-center space-x-3"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            <span>{loading ? 'Onboarding...' : 'Save & Onboard'}</span>
                        </button>
                    )}

                    {mode === 'success' && (
                        <button
                            onClick={onComplete}
                            className="bg-teal-600 text-white px-10 py-4 rounded-2xl text-sm font-black uppercase tracking-[0.2em] shadow-xl hover:bg-teal-700 transition-all transform hover:scale-105 active:scale-95 flex items-center space-x-3"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Done</span>
                        </button>
                    )}
                </div>
            </div>
        </div >
    );
}
