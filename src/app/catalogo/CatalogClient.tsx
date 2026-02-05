'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const COLUMN_OPTIONS = [3, 4, 5] as const;
type ColumnCount = (typeof COLUMN_OPTIONS)[number];

const gridColsClass: Record<ColumnCount, string> = {
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
};

type CategoryFilter = {
  name: string;
  slug: string;
  count: number;
  active?: boolean;
};

type CatalogProduct = {
  id: number;
  slug: string;
  sku: string;
  descripcion: string;
  referencia: string;
  imageUrl: string | null;
  categoryName?: string | null;
};

export default function CatalogClient({
  products,
  categories,
  activeCategory,
  currentPage,
  totalPages,
}: {
  products: CatalogProduct[];
  categories: CategoryFilter[];
  activeCategory?: string | null;
  currentPage: number;
  totalPages: number;
}) {
  const [columns, setColumns] = useState<ColumnCount>(3);

  return (
    <div className="flex-1 w-full max-w-[1440px] mx-auto px-6 lg:px-10 py-6">
      {/* Breadcrumb */}
      <div className="flex flex-wrap gap-2 pb-4">
        <Link href="/" className="text-slate-500 hover:text-[#D00000] transition-colors text-sm font-medium">
          Inicio
        </Link>
        <span className="text-slate-400 text-sm font-medium">/</span>
        <span className="text-slate-900 text-sm font-medium">Catálogo</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-slate-900 text-3xl font-bold tracking-tight mb-2">
            Catálogo de Productos
          </h1>
          <p className="text-slate-500">
            Explora nuestro inventario de refacciones originales y OEM.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto md:max-w-[700px] flex-1 justify-end">
          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input
              type="text"
              placeholder="Buscar por nombre, SKU o marca..."
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#D00000] focus:border-[#D00000] sm:text-sm text-slate-900"
            />
          </div>
          <div className="relative min-w-[180px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <span className="material-symbols-outlined">sort</span>
            </div>
            <select className="block w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-[#D00000] focus:border-[#D00000] sm:text-sm appearance-none cursor-pointer text-slate-900">
              <option>Relevancia</option>
              <option>Nombre (A-Z)</option>
              <option>Nombre (Z-A)</option>
              <option>Más recientes</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500">
              <span className="material-symbols-outlined text-sm">expand_more</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar filters */}
        <aside className="lg:col-span-3 space-y-8">
          <div className="border-t border-slate-200 pt-6">
            <h3 className="font-bold text-slate-900 mb-4 flex justify-between items-center">
              Categoría
              <span className="material-symbols-outlined text-slate-400">remove</span>
            </h3>
            <div className="space-y-3">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/catalogo?cat=${cat.slug}`}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <span
                    className={`text-sm group-hover:text-[#D00000] transition-colors ${cat.active ? 'text-slate-900 font-medium' : 'text-slate-600'
                      }`}
                  >
                    {cat.name}
                  </span>
                  <span className="ml-auto text-xs text-slate-400">({cat.count})</span>
                </Link>
              ))}
              {activeCategory && (
                <Link href="/catalogo" className="text-xs text-[#D00000] font-semibold">
                  Limpiar filtro
                </Link>
              )}
            </div>
          </div>
        </aside>

        {/* Product grid */}
        <section className="lg:col-span-9">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <span className="text-slate-500 text-sm">
              Mostrando <strong>{products.length}</strong> productos
            </span>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <span className="font-medium">Vista:</span>
                <div className="relative">
                  <select
                    value={columns}
                    onChange={(e) => setColumns(Number(e.target.value) as ColumnCount)}
                    className="rounded-lg border border-slate-300 bg-white py-2 pl-3 pr-9 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D00000]/20 focus:border-[#D00000] appearance-none cursor-pointer"
                    aria-label="Número de columnas en la cuadrícula"
                  >
                    {COLUMN_OPTIONS.map((n) => (
                      <option key={n} value={n}>
                        {n} columnas
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                    expand_more
                  </span>
                </div>
              </label>
            </div>
          </div>
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 ${gridColsClass[columns]}`}>
            {products.map((p) => (
              <article
                key={p.id}
                className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden"
              >
                <Link
                  href={`/producto/${p.slug}`}
                  className="relative w-full pt-[100%] bg-white p-6 border-b border-slate-100 block"
                >
                  <Image
                    src={p.imageUrl || '/logo.svg'}
                    alt={p.descripcion || p.referencia || p.sku}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    loading="lazy"
                  />
                </Link>
                <div className="p-5 flex flex-col flex-1">
                  {p.categoryName && (
                    <div className="mb-2">
                      <span className="text-[#D00000] text-xs font-bold uppercase tracking-wider">
                        {p.categoryName}
                      </span>
                    </div>
                  )}
                  <h3 className="text-slate-900 font-bold text-lg leading-tight mb-2 line-clamp-2">
                    {p.descripcion || p.referencia || p.sku}
                  </h3>
                  {p.referencia && (
                    <p className="text-xs text-slate-500 mb-3">Ref: {p.referencia}</p>
                  )}
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-400 font-mono">SKU</span>
                      <span className="text-sm font-mono text-slate-600">
                        {p.sku}
                      </span>
                    </div>
                    <Link
                      href={`/producto/${p.slug}`}
                      className="rounded-lg bg-white border border-slate-200 px-4 py-2 text-[#D00000] text-sm font-bold hover:bg-[#D00000] hover:text-white hover:border-[#D00000] transition-colors"
                    >
                      Ver producto
                    </Link>
                  </div>
                </div>
              </article>
            ))}
            {products.length === 0 && (
              <div className="col-span-full rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
                No hay productos para mostrar.
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              {currentPage > 1 ? (
                <Link
                  href={`/catalogo?${new URLSearchParams({ ...(activeCategory && { cat: activeCategory }), page: String(currentPage - 1) }).toString()}`}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                  Anterior
                </Link>
              ) : (
                <span className="flex items-center gap-1 px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-400 cursor-not-allowed">
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                  Anterior
                </span>
              )}

              <span className="px-4 py-2 text-sm text-slate-600">
                Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
              </span>

              {currentPage < totalPages ? (
                <Link
                  href={`/catalogo?${new URLSearchParams({ ...(activeCategory && { cat: activeCategory }), page: String(currentPage + 1) }).toString()}`}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Siguiente
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </Link>
              ) : (
                <span className="flex items-center gap-1 px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-400 cursor-not-allowed">
                  Siguiente
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </span>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
