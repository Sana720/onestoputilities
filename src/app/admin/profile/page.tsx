'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, ShieldCheck, Loader2, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { SignatureUpload } from '@/components/SignatureUpload';

export default function AdminProfile() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [admin, setAdmin] = useState<any>(null);
    const [signatureFile, setSignatureFile] = useState<File | null>(null);

    useEffect(() => {
        const fetchAdmin = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
                return;
            }

            const { data: user, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (error) {
                console.error('Error fetching admin:', error);
            } else {
                setAdmin(user);
            }
            setLoading(false);
        };

        fetchAdmin();
    }, [router]);

    const handleSave = async () => {
        if (!admin) return;
        setSaving(true);

        try {
            let signatureUrl = admin.signature_url;

            if (signatureFile) {
                const fileExt = signatureFile.name.split('.').pop();
                const fileName = `admin_sig_${admin.id}.${fileExt}`;
                const fullPath = `signatures/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('documents')
                    .upload(fullPath, signatureFile, { upsert: true });

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('documents')
                    .getPublicUrl(fullPath);

                signatureUrl = publicUrl;
            }

            const { error: updateError } = await supabase
                .from('users')
                .update({ signature_url: signatureUrl })
                .eq('id', admin.id);

            if (updateError) throw updateError;

            setAdmin({ ...admin, signature_url: signatureUrl });
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#1B8A9F]" />
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
                            <Link href="/admin/dashboard" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <ArrowLeft className="w-5 h-5 text-gray-500" />
                            </Link>
                            <Image
                                src="/logo.png"
                                alt="TraderG Wealth Logo"
                                width={120}
                                height={32}
                                className="h-8 w-auto"
                            />
                        </div>
                        <h1 className="text-lg font-bold text-gray-900">Admin Settings</h1>
                    </div>
                </div>
            </nav>

            <div className="max-w-3xl mx-auto px-4 py-12">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-teal-50/50 to-white">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-teal-100">
                                <User className="w-8 h-8 text-[#1B8A9F]" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-gray-900">{admin?.name}</h2>
                                <p className="text-sm text-gray-500 font-medium">Chief Administrator</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 space-y-8">
                        {admin?.role === 'admin' ? (
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-[#1B8A9F] mb-6 flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4" />
                                    Official Signature
                                </h3>
                                <p className="text-sm text-gray-500 mb-6">
                                    Upload your official signature here. This signature will be automatically attached to all agreements you approve.
                                </p>

                                <SignatureUpload
                                    onUpload={setSignatureFile}
                                    currentSignatureUrl={admin?.signature_url}
                                    label="Upload Official Signature"
                                />
                            </div>
                        ) : (
                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-teal-400">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900 uppercase tracking-tight">Official Signature Protected</p>
                                    <p className="text-xs text-gray-500 mt-0.5">Only Administrators can update the official digital signature used for agreements.</p>
                                </div>
                            </div>
                        )}

                        <div className="pt-6 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="inline-flex items-center justify-center bg-[#1B8A9F] text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-[#156d7d] transition-all disabled:opacity-50 shadow-lg shadow-teal-100"
                            >
                                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                Save Profile Settings
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
