'use client';

import NewProductForm from './NewProductForm';
import ProductRow from './ProductRow';
import Pagination from './Pagination';
import ProductsToolbar from './ProductsToolbar';

type CategoryOption = {
  id: number;
  name: string;
};

type ProductItem = {
  id: number;
  slug?: string | null;
  sku: string;
  descripcion: string;
  referencia: string;
  imageUrl: string | null;
  resolvedImageUrl: string;
  textoDescripcion: string;
  categoryId: number | null;
};

export default function AdminProductsClient({
  products,
  categories,
  totalCount,
  searchQuery,
  currentPage,
  totalPages,
}: {
  products: ProductItem[];
  categories: CategoryOption[];
  totalCount: number;
  searchQuery: string;
  currentPage: number;
  totalPages: number;
}) {
  return (
    <div className="flex flex-col gap-8">
      <NewProductForm categories={categories} />

      <section className="rounded-2xl border border-[#e7eef3] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#0d151c]">Productos existentes</h2>
          <span className="text-sm text-[#4b779b]">
            {totalCount} productos {searchQuery ? 'encontrados' : 'en total'}
          </span>
        </div>

        <ProductsToolbar />

        <div className="flex flex-col gap-4 mt-6">
          {products.length === 0 && (
            <p className="text-sm text-[#4b779b]">
              {searchQuery
                ? 'No se encontraron productos con ese criterio.'
                : 'Aún no hay productos registrados.'}
            </p>
          )}
          {products.map((product) => (
            <ProductRow key={product.id} product={product} categories={categories} />
          ))}
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/admin/productos" />
      </section>
    </div>
  );
}
