'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Lock, AlertCircle, CheckCircle2, Loader2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ResetPasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [verifying, setVerifying] = useState(true);

    useEffect(() => {
        // Check if we have a session (Supabase handles the recovery link automatically)
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                // If no session, they might have reached here manually
                setError('Invalid or expired reset link. Please request a new one.');
            }
            setVerifying(false);
        };
        checkSession();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            // Update password in Supabase Auth
            const { data, error: authError } = await supabase.auth.updateUser({
                password: password
            });

            if (authError) {
                setError(authError.message);
                setLoading(false);
                return;
            }

            // Also clear the password_reset_required flag in our users table
            const userId = data.user?.id;
            if (userId) {
                // We use a fetch to our own API to update the flag since clients can't normally update their own users record depending on RLS
                // Actually, I already have an update-password API, but that was for the dashboard.
                // Let's just use the same logic here or call a specialized API if needed.
                // For now, let's try to update the flag via the update-password route I created earlier.

                await fetch('/api/auth/update-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: userId,
                        newPassword: password // The API also updates the flag
                    }),
                });
            }

            setSuccess(true);
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (verifying) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-[#1B8A9F] animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-green-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-[#1B8A9F] rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#4ADE80] rounded-full blur-3xl"></div>
            </div>

            <div className="w-full max-w-md relative">
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                    <div className="text-center mb-8">
                        <Image
                            src="/logo.png"
                            alt="SHREEG Logo"
                            width={200}
                            height={60}
                            className="h-14 w-auto mx-auto mb-4"
                        />
                        <h1 className="text-3xl font-bold text-gray-900">New Password</h1>
                        <p className="text-gray-600 mt-2">Set your new account password</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    {success ? (
                        <div className="text-center py-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Password Updated</h2>
                            <p className="text-gray-600">
                                Your password has been successfully reset. Redirecting to login...
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1B8A9F] focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                                        placeholder="Min. 6 characters"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#1B8A9F]"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1B8A9F] focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                                        placeholder="Repeat password"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !!error}
                                className="w-full bg-[#1B8A9F] text-white py-3 rounded-lg font-semibold text-lg hover:bg-[#156d7d] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {loading ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    'Reset Password'
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
