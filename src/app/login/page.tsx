'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { LogIn, Mail, Lock, ArrowLeft, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                console.log('Login success, reset required:', data.user.passwordResetRequired);
                // Store user data
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('session', JSON.stringify(data.session));

                // Synchronize Supabase client session
                await supabase.auth.setSession(data.session);

                // Redirect based on role
                if (data.user.role === 'admin') {
                    router.push('/admin/dashboard');
                } else {
                    router.push('/client/dashboard');
                }
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-green-50 flex items-center justify-center p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-96 h-96 bg-[#1B8A9F] rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#4ADE80] rounded-full blur-3xl"></div>
            </div>

            <div className="w-full max-w-md relative">
                {/* Back to Home */}
                <Link
                    href="/"
                    className="inline-flex items-center text-gray-600 hover:text-[#1B8A9F] mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Link>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <Image
                            src="/logo.png"
                            alt="SHREEG Logo"
                            width={200}
                            height={60}
                            className="h-14 w-auto mx-auto mb-4"
                        />
                        <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
                        <p className="text-gray-600 mt-2">Sign in to access your investment portfolio</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1B8A9F] focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                                    placeholder="your.email@example.com"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1B8A9F] focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#1B8A9F] transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            <div className="flex justify-end mt-2">
                                <Link
                                    href="/forgot-password"
                                    className="text-sm font-semibold text-[#1B8A9F] hover:text-[#4ADE80] transition-colors"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#1B8A9F] text-white py-3 rounded-lg font-semibold text-lg hover:bg-[#156d7d] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5 mr-2" />
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <p className="text-center text-gray-600">
                            Don't have an account?{' '}
                            <Link href="/apply" className="text-[#1B8A9F] font-semibold hover:text-[#4ADE80] transition-colors">
                                Apply for Investment
                            </Link>
                        </p>
                    </div>

                    {/* Demo Credentials */}
                    <div className="mt-6 p-4 bg-teal-50 rounded-lg border border-teal-200">
                        <p className="text-sm font-semibold text-[#1B8A9F] mb-2">Demo Credentials:</p>
                        <p className="text-xs text-gray-600">Admin: admin@shreeg.com / admin123</p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-gray-500 mt-6">
                    © {new Date().getFullYear()} SHREEG Expert Wealth Advisory Limited
                </p>
            </div>
        </div>
    );
}
