'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
    CheckCircle2,
    Mail,
    Key,
    ArrowRight,
    ShieldCheck,
    Clock,
    LayoutDashboard,
    Loader2
} from 'lucide-react';
import { useState, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
function SuccessContent() {
    const searchParams = useSearchParams();
    const investmentId = searchParams.get('id');
    const [productName, setProductName] = useState<string | null>(null);
    const [fetching, setFetching] = useState(true);

    useState(() => {
        const fetchProduct = async () => {
            if (!investmentId) {
                setFetching(false);
                return;
            }
            try {
                const { data, error } = await supabase
                    .from('investments')
                    .select('product_name')
                    .eq('id', investmentId)
                    .single();

                if (data) setProductName(data.product_name);
            } catch (err) {
                console.error('Error fetching product:', err);
            } finally {
                setFetching(false);
            }
        };
        fetchProduct();
    });

    if (fetching) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-[#1B8A9F] animate-spin" />
            </div>
        );
    }

    const isUnlisted = productName === 'Unlisted Shares';

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-green-50 flex items-center justify-center p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-[#1B8A9F] rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#4ADE80] rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-2xl w-full relative">
                <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center border border-gray-100 animate-fade-in-up">
                    <div className="w-24 h-24 bg-[#1B8A9F] rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                        <CheckCircle2 className="w-14 h-14 text-white" />
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                        Application Submitted!
                    </h1>

                    <p className="text-lg text-gray-600 mb-8">
                        Thank you for choosing <span className="text-[#1B8A9F] font-bold">TraderG Wealth</span> Expert Wealth Advisory.
                        Your investment journey starts here.
                    </p>

                    {investmentId && (
                        <div className="bg-teal-50 border-2 border-teal-100 rounded-xl p-6 mb-8 text-center">
                            <p className="text-sm font-semibold text-[#1B8A9F] uppercase tracking-wider mb-2">Application Reference ID</p>
                            <p className="text-2xl font-mono font-bold text-gray-900">{investmentId}</p>
                        </div>
                    )}

                    <div className="bg-green-50 border border-green-100 rounded-2xl p-6 mb-8 flex items-center gap-4 text-left">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <ShieldCheck className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-green-900 leading-none">Application Secured</h3>
                            <p className="text-sm text-green-700 mt-2">
                                {isUnlisted
                                    ? 'Your digital signature has been securely attached to your application.'
                                    : 'Your acceptance of Terms & Conditions has been successfully recorded.'}
                            </p>
                        </div>
                    </div>

                    {/* Step Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 text-left">
                        <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex items-center space-x-3 mb-2">
                                <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                                    <Mail className="w-4 h-4 text-[#1B8A9F]" />
                                </div>
                                <h3 className="font-bold text-gray-900">Email Reference</h3>
                            </div>
                            <p className="text-sm text-gray-600">The email address you used in the application form.</p>
                        </div>
                        <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex items-center space-x-3 mb-2">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Key className="w-4 h-4 text-[#4ADE80]" />
                                </div>
                                <h3 className="font-bold text-gray-900">Temporary Access</h3>
                            </div>
                            <p className="text-sm text-gray-600">Password: Last 6 digits of your contact number.</p>
                        </div>
                    </div>

                    <div className="space-y-6 mb-12">
                        <div className="flex items-center justify-center space-x-2">
                            <Clock className="w-5 h-5 text-[#1B8A9F]" />
                            <h3 className="font-bold text-xl text-gray-900">What's Next?</h3>
                        </div>
                        <div className="space-y-4 max-w-md mx-auto">
                            <div className="flex items-start space-x-4">
                                <div className="w-8 h-8 rounded-full bg-[#1B8A9F] text-white flex items-center justify-center flex-shrink-0 text-sm font-bold shadow-md">1</div>
                                <p className="text-gray-600 text-left pt-1">Our team will verify your payment and details (24-48h).</p>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="w-8 h-8 rounded-full bg-[#4ADE80] text-white flex items-center justify-center flex-shrink-0 text-sm font-bold shadow-md">2</div>
                                <p className="text-gray-600 text-left pt-1">
                                    {isUnlisted
                                        ? "Once approved, you'll receive your investment agreement."
                                        : "Once approved, your investment portfolio will be activated."}
                                </p>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="w-8 h-8 rounded-full bg-[#1B8A9F] text-white flex items-center justify-center flex-shrink-0 text-sm font-bold shadow-md">3</div>
                                <p className="text-gray-600 text-left pt-1">
                                    {isUnlisted
                                        ? "Shares credited to your demat account within 30 days."
                                        : "Your portfolio will start generating returns as per selected strategy."}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/login"
                            className="inline-flex items-center justify-center bg-[#1B8A9F] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#156d7d] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <LayoutDashboard className="w-5 h-5 mr-2" />
                            Go to Dashboard
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center bg-white text-gray-700 border-2 border-gray-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all duration-300"
                        >
                            Return Home
                        </Link>
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col items-center">
                        <div className="flex items-center space-x-2 text-gray-400 mb-2">
                            <ShieldCheck className="w-4 h-4" />
                            <span className="text-xs font-semibold uppercase tracking-wider">Secure Investment Portal</span>
                        </div>
                        <p className="text-sm text-gray-500">
                            Questions? Email us at <a href="mailto:gauravd113@gmail.com" className="text-[#1B8A9F] font-bold hover:underline">gauravd113@gmail.com</a> or visit <a href="https://www.tradergwealth.com" target="_blank" rel="noopener noreferrer" className="text-[#1B8A9F] font-bold hover:underline">tradergwealth.com</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ApplicationSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-green-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#1B8A9F] border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}
