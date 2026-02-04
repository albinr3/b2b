import CatalogClient from './CatalogClient';
import { prisma } from '@/lib/prisma';

export default async function CatalogoPage(props: {
  searchParams?: Promise<{ cat?: string }>;
}) {
  const searchParams = await props.searchParams;
  const activeCategory = searchParams?.cat?.trim() || null;

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: activeCategory
        ? {
          category: {
            slug: activeCategory,
          },
        }
        : undefined,
      include: {
        category: true,
      },
      orderBy: { id: 'desc' },
    }),
    prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    }),
  ]);

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
    />
  );
}
