import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { resolveProductImageUrl } from '@/lib/sku-image-map';

const showSpecs = false;
const shouldLogPerf =
  process.env.LOG_PERF === 'true' || process.env.NODE_ENV !== 'production';

export default async function ProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const t0 = Date.now();
  const { id } = await params;
  const numericId = Number(id);

  const product = await prisma.product.findFirst({
    where: Number.isFinite(numericId)
      ? {
          OR: [{ id: numericId }, { slug: id }],
        }
      : { slug: id },
    include: { category: true },
  });
  const t1 = Date.now();

  if (!product) {
    notFound();
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      id: { not: product.id },
      categoryId: product.categoryId ?? undefined,
    },
    include: { category: true },
    take: 4,
    orderBy: { id: 'desc' },
  });
  const t2 = Date.now();

  const productImageUrl = await resolveProductImageUrl({
    sku: product.sku,
    imageUrl: product.imageUrl,
  });
  const t3 = Date.now();
  const relatedProductsWithImage = await Promise.all(
    relatedProducts.map(async (p) => ({
      ...p,
      resolvedImageUrl: await resolveProductImageUrl({
        sku: p.sku,
        imageUrl: p.imageUrl,
      }),
    })),
  );
  const t4 = Date.now();

  if (shouldLogPerf) {
    console.log(
      `[perf] producto query=${t1 - t0}ms related=${t2 - t1}ms image=${t3 - t2}ms relatedImages=${t4 - t3}ms total=${t4 - t0}ms`,
      {
        id,
        resolvedId: product.id,
        related: relatedProducts.length,
      },
    );
  }

  return (
    <div className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <nav aria-label="Breadcrumb" className="flex mb-8">
        <ol className="flex items-center space-x-2 flex-wrap gap-y-1">
          <li>
            <Link href="/" className="text-slate-500 hover:text-[#D00000] transition-colors text-sm font-medium">
              Inicio
            </Link>
          </li>
          <li>
            <span className="text-slate-400 text-sm">/</span>
          </li>
          <li>
            <Link
              href="/catalogo"
              className="text-slate-500 hover:text-[#D00000] transition-colors text-sm font-medium"
            >
              Productos
            </Link>
          </li>
          <li>
            <span className="text-slate-400 text-sm">/</span>
          </li>
          <li>
            <Link
              href={product.category?.slug ? `/catalogo?cat=${product.category.slug}` : '/catalogo'}
              className="text-slate-500 hover:text-[#D00000] transition-colors text-sm font-medium"
            >
              {product.category?.name ?? 'Categoría'}
            </Link>
          </li>
          <li>
            <span className="text-slate-400 text-sm">/</span>
          </li>
          <li>
            <span aria-current="page" className="text-slate-900 text-sm font-medium">
              {product.descripcion || product.referencia || product.sku}
            </span>
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Gallery */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="w-full aspect-[4/3] bg-white rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center p-8 group relative">
            <Image
              src={productImageUrl || '/logo.svg'}
              alt={product.descripcion || product.referencia || product.sku}
              fill
              className="object-contain p-6"
              sizes="(max-width: 1024px) 100vw, 60vw"
              unoptimized
            />
          </div>
        </div>

        {/* Info */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="text-xs font-semibold text-[#D00000] bg-[#D00000]/10 px-2 py-0.5 rounded">
                {product.category?.name?.toUpperCase() ?? 'PRODUCTO'}
              </span>
              <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-0.5 rounded text-xs">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="font-semibold text-slate-500">STOCK DISPONIBLE</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-medium text-[#FFBA08] px-2 py-0.5 rounded border border-[#FFBA08]/30 bg-[#FFBA08]/5">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                <span>Alta Rotación</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-3 leading-tight">
              {product.descripcion || product.referencia || product.sku}
            </h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[18px]">barcode</span>
                SKU: <span className="font-mono text-slate-700 font-medium">{product.sku}</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                Referencia: <span className="font-medium text-slate-700">{product.referencia}</span>
              </span>
            </div>
          </div>
          <div className="prose prose-sm text-slate-600 mb-8 max-w-none">
            <p>{product.textoDescripcion || product.descripcion}</p>
          </div>
          {showSpecs && (
            <div className="bg-white rounded-lg border border-slate-200 border-t-4 border-t-[#FFBA08] overflow-hidden mb-8 shadow-sm">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                Especificaciones Técnicas
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFBA08]/60" />
              </h3>
              <span className="material-symbols-outlined text-slate-400 text-[20px]">tune</span>
            </div>
            <table className="w-full text-sm text-left">
              <tbody>
                {specs.map((row, i) => (
                  <tr
                    key={row.label}
                    className={`border-b border-slate-100 ${i === specs.length - 1 ? '' : ''} last:border-0`}
                  >
                    <td className="px-4 py-3 text-slate-500 font-medium w-1/3">
                      {row.label}
                    </td>
                    <td className="px-4 py-3 text-slate-900">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-4 py-2 bg-[#FFBA08]/5 border-t border-slate-200 flex items-center gap-2 text-xs text-slate-600">
              <span className="material-symbols-outlined text-[#FFBA08] text-[16px]">lightbulb</span>
              <span>Sugerencia de stock: Mantener mín. 5 unidades para cobertura de flota.</span>
            </div>
          </div>
          )}
          <div className={`flex flex-col gap-3 ${showSpecs ? 'mt-auto' : ''}`}>
            <Link
              href="/contacto"
              className="w-full bg-[#D00000] hover:bg-[#063a66] text-white font-semibold py-3.5 px-6 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 group"
            >
              <span className="material-symbols-outlined group-hover:animate-pulse">mail</span>
              Solicitar información y cotización
            </Link>
            <button
              type="button"
              className="w-full bg-white border border-slate-300 text-slate-700 font-medium py-3 px-6 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">download</span>
              Descargar ficha técnica (PDF)
            </button>
          </div>
        </div>
      </div>

      {/* Related */}
      <section className="mt-20 mb-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900">Productos Relacionados</h3>
          <div className="flex gap-2">
            <button
              type="button"
              className="p-2 rounded-full border border-slate-200 hover:bg-white text-slate-500 disabled:opacity-50 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <button
              type="button"
              className="p-2 rounded-full border border-slate-200 hover:bg-white text-slate-500 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProductsWithImage.map((p) => (
            <Link
              key={p.id}
              href={`/producto/${p.slug}`}
              className="group bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow cursor-pointer flex flex-col"
            >
              <div className="aspect-[4/3] bg-slate-50 rounded-md mb-4 overflow-hidden">
                <Image
                  src={p.resolvedImageUrl || '/logo.svg'}
                  alt={p.descripcion || p.referencia || p.sku}
                  width={300}
                  height={225}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
              </div>
              <span className="text-xs font-semibold text-[#D00000] mb-1">
                {p.category?.name ?? 'Producto'}
              </span>
              <h4 className="text-sm font-bold text-slate-900 leading-tight mb-2 group-hover:text-[#D00000] transition-colors">
                {p.descripcion || p.referencia || p.sku}
              </h4>
              <p className="text-xs text-slate-500 mb-4">SKU: {p.sku}</p>
              <div className="mt-auto pt-3 border-t border-slate-100">
                <span className="text-sm font-medium text-[#D00000] flex items-center gap-1">
                  Ver detalle <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
