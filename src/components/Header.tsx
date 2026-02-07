'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/marcas', label: 'Marcas' },
  { href: '/catalogo', label: 'Productos' },
  // { href: '/distribuidores', label: 'Distribuidores' },
  { href: '/sobre-nosotros', label: 'Nosotros' },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="border-b border-solid border-[#e7eef3] px-6 py-3">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between whitespace-nowrap">
          <Link href="/" className="flex items-center gap-3 text-[#0d151c] overflow-visible">
            <Image
              src="/logo.svg"
              alt="Importadora Fidodido logo"
              width={160}
              height={64}
              className="h-12 sm:h-16 w-auto object-contain"
              priority
            />
            <span className="sr-only">Importadora Fidodido</span>
          </Link>
          <div className="hidden lg:flex flex-1 justify-end gap-8">
            <nav className="flex items-center gap-9">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`text-base font-medium leading-normal transition-colors hover:text-[#D00000] ${pathname === href
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
            <button
              type="button"
              className="text-[#0d151c] p-2"
              aria-label="Menú"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              <span className="material-symbols-outlined text-[28px]">menu</span>
            </button>
          </div>
        </div>
      </div>
      <div
        className={`fixed inset-0 bg-black/40 transition-opacity duration-200 lg:hidden z-[60] ${
          mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!mobileOpen}
        onClick={() => setMobileOpen(false)}
      />
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        className={`fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-300 lg:hidden z-[70] ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <span className="text-sm font-semibold text-slate-900">Menú</span>
          <button
            type="button"
            className="p-2 text-slate-500 hover:text-slate-900"
            aria-label="Cerrar menú"
            onClick={() => setMobileOpen(false)}
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>
        <nav className="flex flex-col gap-4 px-6 py-6">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`text-base font-semibold transition-colors ${
                pathname === href ? 'text-[#D00000]' : 'text-[#0d151c]'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="px-6 pb-8">
          <Link
            href="/contacto"
            onClick={() => setMobileOpen(false)}
            className="flex w-full cursor-pointer items-center justify-center rounded-lg h-11 px-4 bg-[#D00000] hover:bg-[#b00000] text-white text-sm font-bold leading-normal tracking-[0.015em]"
          >
            Contáctanos
          </Link>
        </div>
      </div>
    </header>
  );
}
