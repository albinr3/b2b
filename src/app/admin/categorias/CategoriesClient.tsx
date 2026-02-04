'use client';

import { useActionState, useEffect } from 'react';
import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
} from '@/lib/admin-actions';
import { useToast } from '@/components/ToastProvider';

type CategoryItem = {
  id: number;
  name: string;
  slug: string | null;
};

export default function CategoriesClient({ categories }: { categories: CategoryItem[] }) {
  const { push } = useToast();
  const [createState, createAction] = useActionState(createCategoryAction, {
    ok: false,
    message: '',
  });

  useEffect(() => {
    if (!createState?.message) return;
    push(createState.message, createState.ok ? 'success' : 'error');
  }, [createState, push]);

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-2xl border border-[#e7eef3] bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#0d151c] mb-4">Nueva categoría</h2>
        <form action={createAction} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            name="name"
            placeholder="Nombre"
            className="h-11 rounded-lg border border-[#cfdde8] px-3 text-sm focus:ring-2 focus:ring-[#D00000]/20 focus:border-[#D00000]"
          />
          <input
            name="slug"
            placeholder="Slug (opcional)"
            className="h-11 rounded-lg border border-[#cfdde8] px-3 text-sm focus:ring-2 focus:ring-[#D00000]/20 focus:border-[#D00000]"
          />
          <button
            type="submit"
            className="h-11 rounded-lg bg-[#D00000] text-white font-semibold hover:bg-[#b00000]"
          >
            Guardar categoría
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-[#e7eef3] bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#0d151c] mb-4">Categorías existentes</h2>
        <div className="flex flex-col gap-4">
          {categories.length === 0 && (
            <p className="text-sm text-[#4b779b]">Aún no hay categorías registradas.</p>
          )}
          {categories.map((category) => (
            <CategoryRow key={category.id} category={category} onToast={push} />
          ))}
        </div>
      </section>
    </div>
  );
}

function CategoryRow({
  category,
  onToast,
}: {
  category: CategoryItem;
  onToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}) {
  const [updateState, updateAction] = useActionState(updateCategoryAction, {
    ok: false,
    message: '',
  });
  const [deleteState, deleteAction] = useActionState(deleteCategoryAction, {
    ok: false,
    message: '',
  });

  useEffect(() => {
    if (!updateState?.message) return;
    onToast(updateState.message, updateState.ok ? 'success' : 'error');
  }, [updateState, onToast]);

  useEffect(() => {
    if (!deleteState?.message) return;
    onToast(deleteState.message, deleteState.ok ? 'success' : 'error');
  }, [deleteState, onToast]);

  return (
    <div className="rounded-xl border border-[#e7eef3] p-4 flex flex-col lg:flex-row gap-4 lg:items-center">
      <form action={updateAction} className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
        <input type="hidden" name="id" value={category.id} />
        <input
          name="name"
          defaultValue={category.name}
          className="h-10 rounded-lg border border-[#cfdde8] px-3 text-sm focus:ring-2 focus:ring-[#D00000]/20 focus:border-[#D00000]"
        />
        <input
          name="slug"
          defaultValue={category.slug ?? ''}
          className="h-10 rounded-lg border border-[#cfdde8] px-3 text-sm focus:ring-2 focus:ring-[#D00000]/20 focus:border-[#D00000]"
        />
        <button
          type="submit"
          className="h-10 rounded-lg border border-[#D00000] text-[#D00000] font-semibold hover:bg-[#D00000] hover:text-white transition-colors"
        >
          Actualizar
        </button>
      </form>
      <form action={deleteAction}>
        <input type="hidden" name="id" value={category.id} />
        <button
          type="submit"
          className="h-10 rounded-lg border border-[#e7eef3] px-4 text-sm font-semibold text-[#0d151c] hover:border-[#D00000] hover:text-[#D00000] transition-colors"
        >
          Eliminar
        </button>
      </form>
    </div>
  );
}
