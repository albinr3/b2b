'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/catalogo', label: 'Productos' },
  { href: '/distribuidores', label: 'Distribuidores' },
  { href: '/#nosotros', label: 'Nosotros' },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="border-b border-solid border-[#e7eef3] px-6 py-3">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between whitespace-nowrap">
          <Link href="/" className="flex items-center gap-4 text-[#0d151c]">
            <div className="size-8 flex items-center justify-center text-[#D00000]">
              <span className="material-symbols-outlined text-[32px]">settings_suggest</span>
            </div>
            <h2 className="text-[#0d151c] text-xl font-bold leading-tight tracking-[-0.015em]">
              B2B Auto Parts
            </h2>
          </Link>
          <div className="hidden lg:flex flex-1 justify-end gap-8">
            <nav className="flex items-center gap-9">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`text-sm font-medium leading-normal transition-colors hover:text-[#D00000] ${
                    pathname === href
                      ? 'text-[#D00000] font-semibold'
                      : 'text-[#0d151c]'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <Link
              href="/contacto"
              className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#D00000] hover:bg-[#b00000] text-white text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span className="truncate">Contáctanos</span>
            </Link>
          </div>
          <div className="lg:hidden">
            <button type="button" className="text-[#0d151c] p-2" aria-label="Menú">
              <span className="material-symbols-outlined text-[28px]">menu</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
