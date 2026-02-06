import CatalogClient from './CatalogClient';
import { prisma } from '@/lib/prisma';
import { resolveProductImageUrl } from '@/lib/sku-image-map';

const PRODUCTS_PER_PAGE = 24;
const shouldLogPerf =
  process.env.LOG_PERF === 'true' || process.env.NODE_ENV !== 'production';

export default async function CatalogoPage(props: {
  searchParams?: Promise<{ cat?: string; page?: string }>;
}) {
  const t0 = Date.now();
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
  const t1 = Date.now();

  const totalPages = Math.ceil(totalCount / PRODUCTS_PER_PAGE);

  const categoriesFilter = categories.map((category) => ({
    name: category.name,
    slug: category.slug ?? '',
    count: category._count.products,
    active: activeCategory === category.slug,
  }));

  const productsWithImages = await Promise.all(
    products.map(async (product) => ({
      id: product.id,
      slug: product.slug,
      sku: product.sku,
      descripcion: product.descripcion,
      referencia: product.referencia,
      imageUrl: await resolveProductImageUrl({
        sku: product.sku,
        imageUrl: product.imageUrl,
      }),
      categoryName: product.category?.name ?? null,
    })),
  );
  const t2 = Date.now();

  if (shouldLogPerf) {
    console.log(
      `[perf] catalogo query=${t1 - t0}ms images=${t2 - t1}ms total=${t2 - t0}ms`,
      {
        page: currentPage,
        category: activeCategory,
        products: products.length,
        totalCount,
      },
    );
  }

  return (
    <CatalogClient
      products={productsWithImages}
      categories={categoriesFilter}
      activeCategory={activeCategory}
      currentPage={currentPage}
      totalPages={totalPages}
    />
  );
}
