import Link from 'next/link';

export default function CookiesPage() {
  return (
    <div className="w-full bg-white">
      <div className="max-w-[960px] mx-auto px-6 py-12">
        <div className="mb-8">
          <span className="text-[#D00000] font-bold text-sm tracking-widest uppercase">
            Legal
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0d151c] mt-2">
            Política de Cookies
          </h1>
          <p className="text-sm text-[#4b779b] mt-3">
            Última actualización: Febrero 2026.
          </p>
        </div>
        <div className="space-y-6 text-[#4b779b] text-sm leading-relaxed">
          <p>
            Usamos cookies para recordar preferencias, medir uso del sitio y mejorar la experiencia
            de nuestros clientes. Algunas cookies son esenciales para el funcionamiento del sitio.
          </p>
          <p>
            Puedes configurar tu navegador para bloquear cookies, aunque algunas funciones pueden
            no funcionar correctamente.
          </p>
          <p>
            Si deseas más información sobre el uso de cookies, contáctanos.
          </p>
        </div>
        <div className="mt-10">
          <Link
            href="/contacto"
            className="inline-flex items-center justify-center rounded-lg px-6 py-3 bg-[#D00000] text-white font-semibold hover:bg-[#b00000] transition-colors"
          >
            Consultar
          </Link>
        </div>
      </div>
    </div>
  );
}
