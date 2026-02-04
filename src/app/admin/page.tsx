import Link from 'next/link';

const cards = [
  {
    title: 'Productos',
    description: 'Crea, edita y elimina los productos visibles en el catálogo.',
    href: '/admin/productos',
  },
  {
    title: 'Categorías',
    description: 'Gestiona las categorías para organizar el catálogo.',
    href: '/admin/categorias',
  },
  {
    title: 'Distribuidores',
    description: 'Administra los distribuidores autorizados.',
    href: '/admin/distribuidores',
  },
];

export default function AdminHomePage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card) => (
        <Link
          key={card.title}
          href={card.href}
          className="rounded-2xl border border-[#e7eef3] bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-bold text-[#0d151c] mb-2">{card.title}</h2>
          <p className="text-sm text-[#4b779b]">{card.description}</p>
        </Link>
      ))}
    </div>
  );
}
