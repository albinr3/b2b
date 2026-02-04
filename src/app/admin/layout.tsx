import Link from 'next/link';
import { ToastProvider } from '@/components/ToastProvider';

const navItems = [
  { href: '/admin', label: 'Panel' },
  { href: '/admin/productos', label: 'Productos' },
  { href: '/admin/categorias', label: 'Categorías' },
  // { href: '/admin/distribuidores', label: 'Distribuidores' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className="min-h-screen w-full bg-[#0b0f14]">
        <div className="flex min-h-screen">
          <aside className="w-64 border-r border-[#1e2a36] bg-[#0f141b] text-white flex flex-col">
            <div className="px-6 py-6 border-b border-[#1e2a36]">
              <p className="text-xs uppercase tracking-[0.3em] text-[#8aa4b8]">Admin</p>
              <h1 className="text-xl font-black mt-2">Importadora Fidodido</h1>
              <p className="text-xs text-[#8aa4b8] mt-1">Gestión interna</p>
            </div>
            <nav className="flex flex-col gap-2 px-4 py-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-4 py-3 text-sm font-semibold text-white/80 hover:bg-[#18212b] hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto px-6 py-6 text-xs text-[#8aa4b8]">
              Panel administrativo
            </div>
          </aside>
          <main className="flex-1 bg-[#f8f5f5]">
            <div className="px-8 py-10">{children}</div>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
