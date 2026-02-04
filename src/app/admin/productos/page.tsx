import {
  createProduct,
  deleteProduct,
  updateProduct,
} from '@/lib/admin-actions';
import { prisma } from '@/lib/prisma';
import NewProductForm from './NewProductForm';
import ProductRow from './ProductRow';

export default async function AdminProductosPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      orderBy: { id: 'desc' },
    }),
    prisma.category.findMany({
      orderBy: { name: 'asc' },
    }),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <NewProductForm categories={categories.map((category) => ({ id: category.id, name: category.name }))} />

      <section className="rounded-2xl border border-[#e7eef3] bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#0d151c] mb-4">Productos existentes</h2>
        <div className="flex flex-col gap-4">
          {products.length === 0 && (
            <p className="text-sm text-[#4b779b]">Aún no hay productos registrados.</p>
          )}
          {products.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              categories={categories.map((category) => ({ id: category.id, name: category.name }))}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
