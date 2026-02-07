import Link from 'next/link';

export default function PrivacidadPage() {
  return (
    <div className="w-full bg-white">
      <div className="max-w-[960px] mx-auto px-6 py-12">
        <div className="mb-8">
          <span className="text-[#D00000] font-bold text-sm tracking-widest uppercase">
            Legal
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0d151c] mt-2">
            Política de Privacidad
          </h1>
          <p className="text-sm text-[#4b779b] mt-3">
            Última actualización: Febrero 2026.
          </p>
        </div>
        <div className="space-y-6 text-[#4b779b] text-sm leading-relaxed">
          <p>
            Recopilamos datos de contacto y empresa para gestionar cotizaciones, pedidos y soporte
            a clientes B2B. Usamos esta información únicamente para fines comerciales y de
            atención.
          </p>
          <p>
            No vendemos ni compartimos tus datos personales con terceros fuera de proveedores
            necesarios para la operación logística o tecnológica.
          </p>
          <p>
            Puedes solicitar actualización o eliminación de tus datos escribiéndonos por la página
            de contacto.
          </p>
        </div>
        <div className="mt-10">
          <Link
            href="/contacto"
            className="inline-flex items-center justify-center rounded-lg px-6 py-3 bg-[#D00000] text-white font-semibold hover:bg-[#b00000] transition-colors"
          >
            Solicitar cambios de datos
          </Link>
        </div>
      </div>
    </div>
  );
}
