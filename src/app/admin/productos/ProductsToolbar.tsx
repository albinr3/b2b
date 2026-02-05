'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition, useState, useEffect, useRef } from 'react';
import { deleteAllProductsAction } from '@/lib/admin-actions';
import { useToast } from '@/components/ToastProvider';
import * as xlsx from 'xlsx';

export default function ProductsToolbar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [search, setSearch] = useState(searchParams.get('q') || '');
    const [isPending, startTransition] = useTransition();
    const [showConfirm, setShowConfirm] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { push } = useToast();

    useEffect(() => {
        setSearch(searchParams.get('q') || '');
    }, [searchParams]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(() => {
            const params = new URLSearchParams();
            if (search.trim()) {
                params.set('q', search.trim());
            }
            router.push(`/admin/productos?${params.toString()}`);
        });
    };

    const handleDeleteAll = async () => {
        setShowConfirm(false);
        const result = await deleteAllProductsAction();
        push(result.message, result.ok ? 'success' : 'error');
        if (result.ok) {
            router.refresh();
        }
    };

    const handleDownloadTemplate = () => {
        const headers = ['sku', 'descripcion corta', 'referencia', 'categoria', 'descripcion completa', 'url de imagen'];
        const ws = xlsx.utils.aoa_to_sheet([headers]);
        const wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, 'Productos');
        xlsx.writeFile(wb, 'template-productos.xlsx');
        push('Template descargado exitosamente', 'success');
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/admin/import-products', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            push(result.message, result.ok ? 'success' : 'error');

            if (result.ok) {
                router.refresh();
            }
        } catch (error) {
            push('Error al cargar el archivo', 'error');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-md">
                    <div className="relative flex-1">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-[#4b779b]">
                            search
                        </span>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar por SKU o descripción..."
                            className="w-full h-11 pl-10 pr-4 rounded-lg border border-[#cfdde8] text-sm focus:ring-2 focus:ring-[#D00000]/20 focus:border-[#D00000]"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="h-11 px-4 rounded-lg bg-[#0d151c] text-white text-sm font-semibold hover:bg-[#1a2530] disabled:opacity-50"
                    >
                        {isPending ? 'Buscando...' : 'Buscar'}
                    </button>
                </form>

                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setShowConfirm(true)}
                        className="h-11 px-4 rounded-lg border border-[#D00000] text-[#D00000] text-sm font-semibold hover:bg-[#D00000] hover:text-white transition-colors flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[18px]">delete_forever</span>
                        Eliminar todos
                    </button>

                    {showConfirm && (
                        <div className="absolute right-0 top-full mt-2 p-4 bg-white rounded-xl border border-[#e7eef3] shadow-lg z-10 min-w-[280px]">
                            <p className="text-sm text-[#0d151c] font-medium mb-3">
                                ¿Estás seguro de eliminar TODOS los productos?
                            </p>
                            <p className="text-xs text-[#4b779b] mb-4">
                                Esta acción no se puede deshacer.
                            </p>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(false)}
                                    className="flex-1 h-9 rounded-lg border border-[#cfdde8] text-sm font-medium text-[#0d151c] hover:bg-[#f5f8fa]"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDeleteAll}
                                    className="flex-1 h-9 rounded-lg bg-[#D00000] text-white text-sm font-medium hover:bg-[#b00000]"
                                >
                                    Sí, eliminar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Excel Import/Export */}
            <div className="flex flex-wrap gap-2 items-center">
                <button
                    type="button"
                    onClick={handleDownloadTemplate}
                    className="h-10 px-4 rounded-lg border border-[#0d151c] text-[#0d151c] text-sm font-medium hover:bg-[#0d151c] hover:text-white transition-colors flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-[18px]">download</span>
                    Descargar template Excel
                </button>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="excel-upload"
                />
                <label
                    htmlFor="excel-upload"
                    className={`h-10 px-4 rounded-lg border border-[#0d151c] text-[#0d151c] text-sm font-medium hover:bg-[#0d151c] hover:text-white transition-colors flex items-center gap-2 cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                >
                    <span className="material-symbols-outlined text-[18px]">upload_file</span>
                    {isUploading ? 'Importando...' : 'Importar Excel'}
                </label>
            </div>
        </div>
    );
}
