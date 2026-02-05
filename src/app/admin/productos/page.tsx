import {
  createProduct,
  deleteProduct,
  updateProduct,
} from '@/lib/admin-actions';
import { prisma } from '@/lib/prisma';
import NewProductForm from './NewProductForm';
import ProductRow from './ProductRow';
import Pagination from './Pagination';
import ProductsToolbar from './ProductsToolbar';

const PRODUCTS_PER_PAGE = 50;

export default async function AdminProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || '1', 10));
  const searchQuery = params.q?.trim() || '';
  const skip = (currentPage - 1) * PRODUCTS_PER_PAGE;

  // Build where clause for search
  const whereClause = searchQuery
    ? {
      OR: [
        { sku: { contains: searchQuery, mode: 'insensitive' as const } },
        { descripcion: { contains: searchQuery, mode: 'insensitive' as const } },
      ],
    }
    : {};

  const [products, totalCount, categories] = await Promise.all([
    prisma.product.findMany({
      where: whereClause,
      orderBy: { id: 'desc' },
      skip,
      take: PRODUCTS_PER_PAGE,
    }),
    prisma.product.count({ where: whereClause }),
    prisma.category.findMany({
      orderBy: { name: 'asc' },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / PRODUCTS_PER_PAGE);

  return (
    <div className="flex flex-col gap-8">
      <NewProductForm categories={categories.map((category) => ({ id: category.id, name: category.name }))} />

      <section className="rounded-2xl border border-[#e7eef3] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#0d151c]">Productos existentes</h2>
          <span className="text-sm text-[#4b779b]">{totalCount} productos {searchQuery ? 'encontrados' : 'en total'}</span>
        </div>

        <ProductsToolbar />

        <div className="flex flex-col gap-4 mt-6">
          {products.length === 0 && (
            <p className="text-sm text-[#4b779b]">
              {searchQuery ? 'No se encontraron productos con ese criterio.' : 'Aún no hay productos registrados.'}
            </p>
          )}
          {products.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              categories={categories.map((category) => ({ id: category.id, name: category.name }))}
            />
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/admin/productos"
        />
      </section>
    </div>
  );
}
