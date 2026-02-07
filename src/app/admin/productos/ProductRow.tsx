'use client';

import { useActionState, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { deleteProductAction, updateProductAction } from '@/lib/admin-actions';
import { useToast } from '@/components/ToastProvider';

type CategoryOption = {
  id: number;
  name: string;
};

type ProductItem = {
  id: number;
  slug?: string | null;
  sku: string;
  descripcion: string;
  referencia: string;
  imageUrl: string | null;
  textoDescripcion: string;
  categoryId: number | null;
};

export default function ProductRow({
  product,
  categories,
}: {
  product: ProductItem;
  categories: CategoryOption[];
}) {
  const [imageUrl, setImageUrl] = useState(product.imageUrl ?? '');
  const [previewUrl, setPreviewUrl] = useState(product.imageUrl ?? '');
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputId = `product-image-${product.id}`;
  const { push } = useToast();
  const [updateState, updateAction] = useActionState(updateProductAction, {
    ok: false,
    message: '',
  });
  const [deleteState, deleteAction] = useActionState(deleteProductAction, {
    ok: false,
    message: '',
  });
  const handleDeleteSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const confirmed = window.confirm('¿Seguro que deseas eliminar este producto? Esta acción no se puede deshacer.');
    if (!confirmed) {
      event.preventDefault();
    }
  };

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

  const preview = useMemo(() => previewUrl || '', [previewUrl]);

  useEffect(() => {
    if (!updateState?.message) return;
    push(updateState.message, updateState.ok ? 'success' : 'error');
    if (updateState.ok) {
      setIsOpen(false);
    }
  }, [updateState, push]);

  useEffect(() => {
    if (!deleteState?.message) return;
    push(deleteState.message, deleteState.ok ? 'success' : 'error');
  }, [deleteState, push]);

  return (
    <div className="rounded-xl border border-[#e7eef3] p-4 flex flex-col gap-4">
      <details
        className="group"
        open={isOpen}
        onToggle={(event) => setIsOpen((event.target as HTMLDetailsElement).open)}
      >
        <summary className="list-none cursor-pointer">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative h-16 w-16 shrink-0 rounded-lg border border-[#e7eef3] bg-white overflow-hidden">
              <Image
                src={
                  product.imageUrl &&
                  !['/sin-imagen.webp', '/logo.svg', '/no-photo.avif'].includes(product.imageUrl)
                    ? product.imageUrl
                    : '/no-photo.avif'
                }
                alt={product.descripcion || product.sku}
                fill
                className="object-contain p-2"
                sizes="64px"
                loading="lazy"
              />
            </div>
            <div className="flex-1">
              <p className="text-xs text-[#4b779b] font-mono">SKU: {product.sku}</p>
              <p className="text-sm font-semibold text-[#0d151c]">{product.descripcion}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#4b779b] group-open:hidden">Editar</span>
              <span className="text-xs text-[#4b779b] hidden group-open:inline">Cerrar</span>
            </div>
            <div
              className="flex items-center gap-2"
              onClick={(event) => event.stopPropagation()}
              onKeyDown={(event) => event.stopPropagation()}
              role="group"
            >
              <button
                type="button"
                aria-label="Editar producto"
                className="rounded-lg border border-[#e7eef3] p-2 text-[#0d151c] hover:border-[#D00000] hover:text-[#D00000] transition-colors"
                onClick={(event) => {
                  event.preventDefault();
                  const summary = event.currentTarget
                    .closest('summary')
                    ?.parentElement as HTMLDetailsElement | null;
                  if (summary) {
                    summary.open = !summary.open;
                  }
                }}
              >
                <span className="material-symbols-outlined text-[20px]">edit</span>
              </button>
              <form action={deleteAction} onSubmit={handleDeleteSubmit}>
                <input type="hidden" name="id" value={product.id} />
                <button
                  type="submit"
                  aria-label="Eliminar producto"
                  className="rounded-lg border border-[#e7eef3] p-2 text-[#0d151c] hover:border-[#D00000] hover:text-[#D00000] transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
              </form>
            </div>
          </div>
        </summary>
        {isOpen && (
          <div className="pt-4">
            <form action={updateAction} className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input type="hidden" name="id" value={product.id} />
              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-[#4b779b]">SKU</span>
                <input
                  name="sku"
                  defaultValue={product.sku}
                  className="h-10 rounded-lg border border-[#cfdde8] px-3 text-sm focus:ring-2 focus:ring-[#D00000]/20 focus:border-[#D00000]"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-[#4b779b]">Referencia</span>
                <input
                  name="referencia"
                  defaultValue={product.referencia}
                  className="h-10 rounded-lg border border-[#cfdde8] px-3 text-sm focus:ring-2 focus:ring-[#D00000]/20 focus:border-[#D00000]"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-[#4b779b]">Descripción corta</span>
                <input
                  name="descripcion"
                  defaultValue={product.descripcion}
                  className="h-10 rounded-lg border border-[#cfdde8] px-3 text-sm focus:ring-2 focus:ring-[#D00000]/20 focus:border-[#D00000]"
                  required
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-[#4b779b]">Slug (opcional)</span>
                <input
                  name="slug"
                  defaultValue={product.slug ?? ''}
                  placeholder="Slug (opcional)"
                  className="h-10 rounded-lg border border-[#cfdde8] px-3 text-sm focus:ring-2 focus:ring-[#D00000]/20 focus:border-[#D00000]"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-[#4b779b]">Categoría</span>
                <select
                  name="categoryId"
                  defaultValue={product.categoryId ?? ''}
                  className="h-10 rounded-lg border border-[#cfdde8] px-3 text-sm focus:ring-2 focus:ring-[#D00000]/20 focus:border-[#D00000]"
                >
                  <option value="">Sin categoría</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-[#4b779b]">URL de imagen</span>
                <input
                  name="imageUrl"
                  placeholder="URL de imagen"
                  value={imageUrl}
                  onChange={handleUrlChange}
                  className="h-10 rounded-lg border border-[#cfdde8] px-3 text-sm focus:ring-2 focus:ring-[#D00000]/20 focus:border-[#D00000]"
                />
              </label>
              <input
                ref={fileInputRef}
                id={fileInputId}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="md:col-span-3 flex items-center gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-[#4b779b]">Imagen</span>
                  <label
                    htmlFor={fileInputId}
                    className="relative h-20 w-20 rounded-lg border border-[#e7eef3] bg-white overflow-hidden flex items-center justify-center cursor-pointer hover:border-[#D00000] transition-colors"
                  >
                    {preview ? (
                      <Image
                        src={preview}
                        alt="Vista previa"
                        fill
                        className="object-contain p-2"
                        sizes="80px"
                        unoptimized
                      />
                    ) : (
                      <span className="material-symbols-outlined text-[32px] text-slate-300">
                        upload
                      </span>
                    )}
                  </label>
                </div>
                <p className="text-xs text-[#4b779b]">
                  Puedes subir una imagen o pegar una URL.
                </p>
              </div>
              <label className="md:col-span-3 flex flex-col gap-1">
                <span className="text-xs font-semibold text-[#4b779b]">Descripción completa</span>
                <textarea
                  name="textoDescripcion"
                  defaultValue={product.textoDescripcion}
                  className="min-h-[90px] rounded-lg border border-[#cfdde8] p-3 text-sm focus:ring-2 focus:ring-[#D00000]/20 focus:border-[#D00000]"
                />
              </label>
              <button
                type="submit"
                className="h-10 rounded-lg border border-[#D00000] text-[#D00000] font-semibold hover:bg-[#D00000] hover:text-white transition-colors md:col-span-3"
              >
                Guardar cambios
              </button>
            </form>
          </div>
        )}
      </details>
    </div>
  );
}
