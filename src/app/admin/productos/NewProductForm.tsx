'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createProductAction } from '@/lib/admin-actions';
import { useToast } from '@/components/ToastProvider';
import ImageUpload from '@/components/ImageUpload';
import * as xlsx from 'xlsx';

type CategoryOption = {
  id: number;
  name: string;
};

export default function NewProductForm({ categories }: { categories: CategoryOption[] }) {
  const [imageUrl, setImageUrl] = useState('');
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { push } = useToast();
  const [state, formAction] = useActionState(createProductAction, {
    ok: false,
    message: '',
  });



  useEffect(() => {
    if (!state?.message) return;
    push(state.message, state.ok ? 'success' : 'error');
    if (state.ok) {
      formRef.current?.reset();
      setImageUrl('');
      setImageUrl('');
    }
  }, [state, push]);

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
    <section className="rounded-2xl border border-[#e7eef3] bg-white p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <h2 className="text-xl font-bold text-[#0d151c]">Nuevo producto</h2>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="h-10 px-3 rounded-lg border border-[#0d151c] text-[#0d151c] text-sm font-medium hover:bg-[#0d151c] hover:text-white transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Template Excel
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileSelect}
            className="hidden"
            id="excel-upload-form"
          />
          <label
            htmlFor="excel-upload-form"
            className={`h-10 px-3 rounded-lg border border-[#0d151c] text-[#0d151c] text-sm font-medium hover:bg-[#0d151c] hover:text-white transition-colors flex items-center gap-1 cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            <span className="material-symbols-outlined text-[18px]">upload_file</span>
            {isUploading ? 'Importando...' : 'Importar Excel'}
          </label>

          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="h-10 rounded-lg bg-[#D00000] text-white px-4 text-sm font-semibold hover:bg-[#b00000]"
          >
            {open ? 'Cerrar' : 'Nuevo producto'}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      {isUploading && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-3 bg-blue-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#D00000] animate-pulse rounded-full" style={{ width: '100%' }} />
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-[#0d151c] mb-1">Procesando archivo Excel...</p>
            <p className="text-xs text-[#4b779b]">
              El servidor está importando los productos. Esto puede tomar varios minutos dependiendo del tamaño del archivo.
            </p>
          </div>
        </div>
      )}

      {open && (
        <form ref={formRef} action={formAction} className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <input
            name="sku"
            placeholder="SKU"
            className="h-11 rounded-lg border border-[#cfdde8] px-3 text-sm focus:ring-2 focus:ring-[#D00000]/20 focus:border-[#D00000]"
            required
          />
          <input
            name="referencia"
            placeholder="Referencia"
            className="h-11 rounded-lg border border-[#cfdde8] px-3 text-sm focus:ring-2 focus:ring-[#D00000]/20 focus:border-[#D00000]"
          />
          <input
            name="descripcion"
            placeholder="Descripción corta"
            className="h-11 rounded-lg border border-[#cfdde8] px-3 text-sm focus:ring-2 focus:ring-[#D00000]/20 focus:border-[#D00000]"
            required
          />
          <input
            name="slug"
            placeholder="Slug (opcional)"
            className="h-11 rounded-lg border border-[#cfdde8] px-3 text-sm focus:ring-2 focus:ring-[#D00000]/20 focus:border-[#D00000]"
          />
          <select
            name="categoryId"
            className="h-11 rounded-lg border border-[#cfdde8] px-3 text-sm focus:ring-2 focus:ring-[#D00000]/20 focus:border-[#D00000]"
            defaultValue=""
          >
            <option value="">Selecciona categoría</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <input type="hidden" name="imageUrl" value={imageUrl} />

          <div className="md:col-span-3">
            <ImageUpload value={imageUrl} onChange={(url) => setImageUrl(url)} />
          </div>
          <textarea
            name="textoDescripcion"
            placeholder="Texto / descripción completa"
            className="md:col-span-3 min-h-[110px] rounded-lg border border-[#cfdde8] p-3 text-sm focus:ring-2 focus:ring-[#D00000]/20 focus:border-[#D00000]"
          />
          <button
            type="submit"
            className="h-11 rounded-lg bg-[#D00000] text-white font-semibold hover:bg-[#b00000] md:col-span-3"
          >
            Guardar producto
          </button>
        </form>
      )}
    </section>
  );
}
