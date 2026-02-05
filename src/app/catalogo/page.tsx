import CatalogClient from './CatalogClient';
import { prisma } from '@/lib/prisma';

const PRODUCTS_PER_PAGE = 24;

export default async function CatalogoPage(props: {
  searchParams?: Promise<{ cat?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const activeCategory = searchParams?.cat?.trim() || null;
  const currentPage = Math.max(1, parseInt(searchParams?.page || '1', 10));
  const skip = (currentPage - 1) * PRODUCTS_PER_PAGE;

  const whereClause = activeCategory
    ? {
      category: {
        slug: activeCategory,
      },
    }
    : undefined;

  const [products, totalCount, categories] = await Promise.all([
    prisma.product.findMany({
      where: whereClause,
      include: {
        category: true,
      },
      orderBy: { descripcion: 'asc' },
      skip,
      take: PRODUCTS_PER_PAGE,
    }),
    prisma.product.count({ where: whereClause }),
    prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / PRODUCTS_PER_PAGE);

  const categoriesFilter = categories.map((category) => ({
    name: category.name,
    slug: category.slug ?? '',
    count: category._count.products,
    active: activeCategory === category.slug,
  }));

  return (
    <CatalogClient
      products={products.map((product) => ({
        id: product.id,
        slug: product.slug,
        sku: product.sku,
        descripcion: product.descripcion,
        referencia: product.referencia,
        imageUrl: product.imageUrl,
        categoryName: product.category?.name ?? null,
      }))}
      categories={categoriesFilter}
      activeCategory={activeCategory}
      currentPage={currentPage}
      totalPages={totalPages}
    />
  );
}
