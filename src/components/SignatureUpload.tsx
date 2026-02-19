'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Check, Image as ImageIcon, Loader2 } from 'lucide-react';

interface Props {
    onUpload: (file: File) => void;
    onRemove?: () => void;
    currentSignatureUrl?: string;
    label?: string;
    disabled?: boolean;
}

export const SignatureUpload = ({ onUpload, onRemove, currentSignatureUrl, label = "Signature", disabled = false }: Props) => {
    const [preview, setPreview] = useState<string | null>(currentSignatureUrl || null);
    const [dragging, setDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = (file: File) => {
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
            alert('Please upload a PNG or JPG signature image.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
        onUpload(file);
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const clearSignature = () => {
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (onRemove) onRemove();
    };

    return (
        <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">{label}</label>

            {!preview ? (
                <div
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={onDrop}
                    onClick={() => !disabled && fileInputRef.current?.click()}
                    className={`
                        relative flex flex-col items-center justify-center w-full h-40 
                        border-2 border-dashed rounded-xl transition-all
                        ${disabled ? 'border-gray-200 bg-gray-50/50 cursor-not-allowed' :
                            dragging ? 'border-[#1B8A9F] bg-teal-50 cursor-pointer' :
                                'border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer'}
                    `}
                >
                    <Upload className={`w-8 h-8 mb-2 ${dragging ? 'text-[#1B8A9F]' : 'text-gray-400'}`} />
                    <p className="text-sm text-gray-600">Click or drag a photo of your signature</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 2MB</p>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={onFileChange}
                        accept=".png, .jpg, .jpeg"
                        className="hidden"
                    />
                </div>
            ) : (
                <div className="relative group rounded-xl border border-gray-200 bg-white overflow-hidden p-4 flex items-center justify-center h-40">
                    <img
                        src={preview}
                        alt="Signature Preview"
                        className="max-w-full max-h-full object-contain"
                    />
                    {!disabled && (
                        <div className="absolute top-2 right-2 flex gap-2">
                            <button
                                onClick={clearSignature}
                                className="p-1.5 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors shadow-sm"
                                title="Remove signature"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                    <div className="absolute bottom-2 right-2">
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 text-green-700 rounded-md text-[10px] font-bold border border-green-100 uppercase tracking-wider">
                            <Check className="w-3 h-3" /> Ready
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
