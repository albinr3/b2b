'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { getPresignedUrl } from '@/actions/upload-actions';
import { useToast } from '@/components/ToastProvider';

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    disabled?: boolean;
}

export default function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { push } = useToast();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            push('Por favor, selecciona un archivo de imagen válido', 'error');
            return;
        }

        setLoading(true);

        try {
            // 1. Get pre-signed URL
            const { success, url, publicUrl, error } = await getPresignedUrl(file.name, file.type);

            if (!success || !url) {
                throw new Error(error || 'Error al obtener URL de carga');
            }

            // 2. Upload to R2
            const uploadResponse = await fetch(url, {
                method: 'PUT',
                body: file,
                headers: {
                    'Content-Type': file.type,
                },
            });

            if (!uploadResponse.ok) {
                throw new Error('Error al subir la imagen');
            }

            // 3. Update parent with the public URL
            if (publicUrl) {
                onChange(publicUrl);
                push('Imagen subida correctamente', 'success');
            }

        } catch (err) {
            console.error(err);
            push('No se pudo subir la imagen', 'error');
        } finally {
            setLoading(false);
            // Reset input so validation triggers if same file selected again
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className="md:col-span-3 flex flex-col md:flex-row gap-4 items-center">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                disabled={disabled || loading}
            />

            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || loading}
                className={`relative h-24 w-24 rounded-lg border border-[#e7eef3] bg-white overflow-hidden flex items-center justify-center transition-colors ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'hover:border-[#D00000] cursor-pointer'
                    }`}
                aria-label="Subir imagen"
            >
                {loading ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D00000]"></div>
                ) : value ? (
                    <Image
                        src={value}
                        alt="Vista previa"
                        fill
                        className="object-contain p-2"
                        sizes="96px"
                        unoptimized
                    />
                ) : (
                    <span className="material-symbols-outlined text-[36px] text-slate-300">
                        upload
                    </span>
                )}
            </button>

            <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-[#0d151c]">
                    Imagen del producto
                </p>
                <p className="text-xs text-[#4b779b]">
                    Haz clic para subir una imagen. Se guardará autómaticamente en la nube.
                </p>
            </div>
        </div>
    );
}
