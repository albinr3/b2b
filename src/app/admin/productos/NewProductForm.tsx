'use client';

import { useActionState, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { createProductAction } from '@/lib/admin-actions';
import { useToast } from '@/components/ToastProvider';

type CategoryOption = {
  id: number;
  name: string;
};

export default function NewProductForm({ categories }: { categories: CategoryOption[] }) {
  const [imageUrl, setImageUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const { push } = useToast();
  const [state, formAction] = useActionState(createProductAction, {
    ok: false,
    message: '',
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      setImageUrl(result);
      setPreviewUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim();
    setImageUrl(value);
    setPreviewUrl(value);
  };

  const preview = useMemo(() => {
    if (!previewUrl) return '';
    return previewUrl;
  }, [previewUrl]);

  useEffect(() => {
    if (!state?.message) return;
    push(state.message, state.ok ? 'success' : 'error');
    if (state.ok) {
      formRef.current?.reset();
      setImageUrl('');
      setPreviewUrl('');
    }
  }, [state, push]);

  return (
    <section className="rounded-2xl border border-[#e7eef3] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-[#0d151c]">Nuevo producto</h2>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="h-10 rounded-lg bg-[#D00000] text-white px-4 text-sm font-semibold hover:bg-[#b00000]"
        >
          {open ? 'Cerrar' : 'Nuevo producto'}
        </button>
      </div>

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
          <input
            name="imageUrl"
            placeholder="URL de imagen"
            value={imageUrl}
            onChange={handleUrlChange}
            className="h-11 rounded-lg border border-[#cfdde8] px-3 text-sm focus:ring-2 focus:ring-[#D00000]/20 focus:border-[#D00000]"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="md:col-span-3 flex flex-col md:flex-row gap-4 items-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative h-24 w-24 rounded-lg border border-[#e7eef3] bg-white overflow-hidden flex items-center justify-center hover:border-[#D00000] transition-colors"
              aria-label="Subir imagen"
            >
              {preview ? (
                <Image
                  src={preview}
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
            <p className="text-xs text-[#4b779b]">
              Puedes subir una imagen desde tu PC o pegar una URL. La última opción
              que uses será la guardada.
            </p>
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
