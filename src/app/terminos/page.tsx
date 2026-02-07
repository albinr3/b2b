import Link from 'next/link';

export default function TerminosPage() {
  return (
    <div className="w-full bg-white">
      <div className="max-w-[960px] mx-auto px-6 py-12">
        <div className="mb-8">
          <span className="text-[#D00000] font-bold text-sm tracking-widest uppercase">
            Legal
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0d151c] mt-2">
            Términos y Condiciones
          </h1>
          <p className="text-sm text-[#4b779b] mt-3">
            Última actualización: Febrero 2026.
          </p>
        </div>
        <div className="space-y-6 text-[#4b779b] text-sm leading-relaxed">
          <p>
            Estos términos regulan el uso del sitio y la relación comercial con clientes
            mayoristas. El uso del sitio implica la aceptación de estos términos.
          </p>
          <p>
            Los precios, disponibilidad y tiempos de entrega pueden variar según inventario,
            ubicación y condiciones logísticas. Confirmamos pedidos por canales oficiales antes de
            su despacho.
          </p>
          <p>
            El contenido del catálogo es referencial y puede cambiar sin previo aviso. Para
            información específica o cotizaciones, contáctanos directamente.
          </p>
          <p>
            Si tienes dudas, escribe a nuestro equipo desde la página de contacto.
          </p>
        </div>
        <div className="mt-10">
          <Link
            href="/contacto"
            className="inline-flex items-center justify-center rounded-lg px-6 py-3 bg-[#D00000] text-white font-semibold hover:bg-[#b00000] transition-colors"
          >
            Contactar
          </Link>
        </div>
      </div>
    </div>
  );
}
