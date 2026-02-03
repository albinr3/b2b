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

const catalogProducts = [
  {
    id: '1',
    category: 'Frenos',
    name: 'Disco de Freno Ventilado Delantero',
    sku: 'BD-4421-X',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApeh7a5pY1qsGFCsL7j0dI6RUupriAyeW0bEY4im4tz7twBsY5c3tuxl9fJAcVJhaI3yp88iKFyTgLksjGk0yMSAygjL8xYAcgfcVkQJaXmRIcDD78JJPbCY6qfto0NlN6ZFJMmVtrffErROZaLx9SVR2CpgYvZAXqnENJNRS0nnSkOpYR1O1xntXJng5JgzxG1NNtBhfEvnNGxcovNw_d3ORVLD65kgZBorEyAQvwN52OgMCDu8rgSp036BsCyA9AFuSnh75g078',
    badge: 'OEM',
    badgeStyle: 'bg-slate-100 text-slate-600',
  },
  {
    id: '2',
    category: 'Suspensión',
    name: 'Amortiguador Hidráulico Trasero',
    sku: 'SH-9902-A',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-FmzqzwJPbta5Hfk-EL-tRxYi0xYo1XfV0-n60WmLfV9FonUKmQX-Tin1Y1DxIwjWO19MAZ5t6KSJ8ue-RbKRdTz3kkLenuBTGjvZ-D1JWsZe7Y9doJdPOblsvUTnqmn64u0q0br7fZtyWuXd5WrJz4FwYPa1hTArPBUbExFGQ0Uf--GQ4rT64xb6LxStmq7h0glsdkkqaaEUHfUaDa1L14gqNK_t-R63Ztn8NBWy0zB1cPPpwcm4KS_3Vj6yy7MjzdCUiRB5904',
    badge: 'Alta Rotación',
    badgeStyle: 'bg-[#FFBA08] text-slate-900',
  },
  {
    id: '3',
    category: 'Eléctrico',
    name: 'Alternador 12V 90A',
    sku: 'EL-1290-B',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJdNLw2rvU-Hlwn2NUm9kHzS4zfWDDctGlfjZV2uRHrIBx3h-qK_E8JEm1i9QTouTTqtGhGU2XYGQq2e15IwGW6_lg_L_O_OTme2dbhqi3YheanhTq-CJj6zshp2z3f_2-y-oni_OPJ9GOehqpZdpsXS2T8DuTzRfLAVn7g93clb0_3jLKJIP1tat5S75kH4-JjZr_pDxbMByAjnbNo2rUUsVOsatlrYvRz9Qm-lGmoE0mlYp9kJnvvfRqol1Kd1ncwd3Eom8E4Js',
    badge: 'Alta Rotación',
    badgeStyle: 'bg-[#FFBA08] text-slate-900',
  },
  {
    id: '4',
    category: 'Frenos',
    name: 'Juego de Pastillas Cerámicas',
    sku: 'BP-Cer-01',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALH1Xgd4oP93FMHjBtdXjl8r_zOAHpMlkpEniqTkNQXlVAaMtDOImYoayzzbCWHdmLHx1RjEgd5Xy2XkQKmZFL3sVDp74tSgCBEySec22o27h6-FCKho4figuDHNlt0uve6QNWJ7_ORkK5d-fTqBwwbIqcQxQPqnrPoydO0sWrqBJPcg3PlX6cbvO2g4DxWX1I9QZPewvtvGDEqoNG9qqR5eQMWq9h9MMRwmwmwvW1jCnFJeL0RH2T3a_8fmvnD_AmAV7eRX3t2so',
    badge: null,
    badgeStyle: '',
  },
  {
    id: '5',
    category: 'Mantenimiento',
    name: 'Filtro de Aceite Sintético',
    sku: 'OF-Syn-X5',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIs2U_bCt0uvGed3mZk5dy1DGV7ty8iDJU35w-suGyB-o7v-o3bqEpf3biBZ25PT2lpepC2mMvB7xiWMFW5PWJQ6AbzgFHnN_h25eOdA5fgVI5slLhB1PMD7DKtZz0pvZ4yMkTsbnFQvK5aVyWTgMHTHf_we3sZ6CFN-OR210atJ7KP8nTJT0ZHWRAP8yAIERkxew6r0ub6dq8NFF11hrfaHW2gOomB7AjlrdKNFldVD4b9PlV8aKiJvILWTPPxi9sTC5Xz2dns5w',
    badge: null,
    badgeStyle: '',
  },
  {
    id: '6',
    category: 'Encendido',
    name: 'Bujía de Iridio Laser',
    sku: 'SP-Ird-99',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtzROBRUvMayihZKYokHbXAtGpKLOS4qlPXzFmK7OqTxyFl50F5tBmecSSVAcXxG_fIXCoN-myKXWevwU8ZTBUsI6wxfXa4-HBhdy923toEPv3-IjAWu7a2odg96c89F0ruQ6vFhiFAH7oERQitnqizMGNikv8Gv-fuZo_GIOWc-yLMjJVVuw2agOCQdYV5ZcKb7vwsmtkyEWtkvLtS185Jz1IKrruGfNqJlvHMLpkSa2M7z89VxCj_iYXe3HMC-TskjqhwWsGnAM',
    badge: 'Pack x4',
    badgeStyle: 'bg-slate-100 text-slate-600',
  },
];

const categoriesFilter = [
  { name: 'Motor y Piezas', count: 120 },
  { name: 'Frenos', count: 45, active: true },
  { name: 'Suspensión', count: 32 },
  { name: 'Eléctrico', count: 88 },
  { name: 'Carrocería', count: 15 },
];

export default function CatalogoPage() {
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
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hidden">
            <div className="flex items-center gap-2 mb-4 text-[#D00000]">
              <span className="material-symbols-outlined">directions_car</span>
              <h3 className="font-bold text-base">Compatibilidad</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Año
                </label>
                <select className="block w-full py-2 px-3 border border-slate-300 rounded-lg bg-slate-50 focus:ring-[#D00000] focus:border-[#D00000] text-sm text-slate-900">
                  <option>Seleccionar Año</option>
                  <option>2024</option>
                  <option>2023</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Marca
                </label>
                <select className="block w-full py-2 px-3 border border-slate-300 rounded-lg bg-slate-50 focus:ring-[#D00000] focus:border-[#D00000] text-sm text-slate-900">
                  <option>Seleccionar Marca</option>
                  <option>Toyota</option>
                  <option>Nissan</option>
                  <option>Ford</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Modelo
                </label>
                <select
                  disabled
                  className="block w-full py-2 px-3 border border-slate-300 rounded-lg bg-slate-50 text-sm text-slate-500"
                >
                  <option>Seleccionar Modelo</option>
                </select>
              </div>
              <button
                type="button"
                className="w-full mt-2 bg-[#D00000] hover:bg-[#b00000] text-white font-medium py-2 rounded-lg text-sm transition-colors"
              >
                Filtrar Vehículo
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-[#FFBA08] p-5 hidden">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-tight">
                Oferta para Distribuidores
              </h3>
              <span className="flex size-2 rounded-full bg-[#FFBA08] animate-pulse" />
            </div>
            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              Descuentos especiales por volumen en sistemas de frenos y suspensión.
            </p>
            <Link
              href="/distribuidores"
              className="inline-flex items-center text-xs font-bold text-slate-900 hover:text-[#D00000] transition-colors"
            >
              Ver condiciones
              <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
            </Link>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h3 className="font-bold text-slate-900 mb-4 flex justify-between items-center">
              Categoría
              <span className="material-symbols-outlined text-slate-400">remove</span>
            </h3>
            <div className="space-y-3">
              {categoriesFilter.map((cat) => (
                <label key={cat.name} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    defaultChecked={cat.active}
                    className="size-4 rounded border-slate-300 text-[#D00000] focus:ring-[#D00000]"
                  />
                  <span
                    className={`text-sm group-hover:text-[#D00000] transition-colors ${
                      cat.active ? 'text-slate-900 font-medium' : 'text-slate-600'
                    }`}
                  >
                    {cat.name}
                  </span>
                  <span className="ml-auto text-xs text-slate-400">({cat.count})</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Product grid */}
        <section className="lg:col-span-9">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <span className="text-slate-500 text-sm">
              Mostrando <strong>9</strong> de <strong>45</strong> resultados en{' '}
              <span className="text-[#D00000] font-medium">Frenos</span>
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
              <button type="button" className="text-[#D00000] text-sm font-medium hover:underline">
                Limpiar filtros
              </button>
            </div>
          </div>
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 ${gridColsClass[columns]}`}>
            {catalogProducts.map((p) => (
              <article
                key={p.id}
                className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden"
              >
                <div className="relative w-full pt-[100%] bg-white p-6 border-b border-slate-100">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    unoptimized
                  />
                  {p.badge && (
                    <div className="absolute top-3 left-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold uppercase tracking-wide ${p.badgeStyle}`}
                      >
                        {p.badge}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="mb-2">
                    <span className="text-[#D00000] text-xs font-bold uppercase tracking-wider">
                      {p.category}
                    </span>
                  </div>
                  <h3 className="text-slate-900 font-bold text-lg leading-tight mb-2 line-clamp-2">
                    {p.name}
                  </h3>
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-400 font-mono">SKU</span>
                      <span className="text-sm font-mono text-slate-600">
                        {p.sku}
                      </span>
                    </div>
                    <Link
                      href={`/producto/${p.id}`}
                      className="rounded-lg bg-white border border-slate-200 px-4 py-2 text-[#D00000] text-sm font-bold hover:bg-[#D00000] hover:text-white hover:border-[#D00000] transition-colors"
                    >
                      Ver producto
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="flex justify-center mt-12">
            <nav aria-label="Pagination" className="flex items-center gap-1">
              <button
                type="button"
                className="p-2 rounded-lg border border-transparent hover:bg-slate-100 text-slate-500"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <span className="px-4 py-2 rounded-lg bg-[#D00000] text-white font-bold text-sm">1</span>
              <Link
                href="/catalogo?page=2"
                className="px-4 py-2 rounded-lg border border-transparent hover:bg-slate-100 text-slate-600 font-medium text-sm"
              >
                2
              </Link>
              <Link
                href="/catalogo?page=3"
                className="px-4 py-2 rounded-lg border border-transparent hover:bg-slate-100 text-slate-600 font-medium text-sm"
              >
                3
              </Link>
              <span className="px-2 text-slate-400">...</span>
              <Link
                href="/catalogo?page=8"
                className="px-4 py-2 rounded-lg border border-transparent hover:bg-slate-100 text-slate-600 font-medium text-sm"
              >
                8
              </Link>
              <Link
                href="/catalogo?page=2"
                className="p-2 rounded-lg border border-transparent hover:bg-slate-100 text-slate-500"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </Link>
            </nav>
          </div>
        </section>
      </div>
    </div>
  );
}
