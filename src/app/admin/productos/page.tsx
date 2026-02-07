import { prisma } from '@/lib/prisma';
import AdminProductsClient from './AdminProductsClient';

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
  const categoryOptions = categories.map((category) => ({
    id: category.id,
    name: category.name,
  }));

  return (
    <AdminProductsClient
      products={products}
      categories={categoryOptions}
      totalCount={totalCount}
      searchQuery={searchQuery}
      currentPage={currentPage}
      totalPages={totalPages}
    />
  );
}
