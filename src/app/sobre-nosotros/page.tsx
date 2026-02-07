import Image from 'next/image';
import Link from 'next/link';

const stats = [
  { label: 'Años abasteciendo talleres', value: '18+', icon: 'history' },
  { label: 'SKUs activos en inventario', value: '10,000+', icon: 'inventory_2' },
  { label: 'Entregas mensuales', value: '1,200+', icon: 'local_shipping' },
  { label: 'Marcas aliadas', value: '12', icon: 'handshake' },
];

const values = [
  {
    title: 'Inventario confiable',
    description:
      'Trabajamos con fabricantes certificados y controles de calidad internos para asegurar piezas consistentes.',
    icon: 'verified',
  },
  {
    title: 'Respuesta rápida',
    description:
      'Procesamos pedidos el mismo día y coordinamos rutas para entregas 24/48h.',
    icon: 'bolt',
  },
  {
    title: 'Acompañamiento B2B',
    description:
      'Asesoramos mezcla de producto, rotación y reposición para que tu mostrador no se quede vacío.',
    icon: 'support_agent',
  },
];

const milestones = [
  {
    year: '2007',
    title: 'Inicio del almacén central',
    description:
      'Comenzamos como una operación familiar atendiendo a talleres locales con repuestos esenciales.',
    icon: 'warehouse',
  },
  {
    year: '2013',
    title: 'Expansión nacional',
    description:
      'Ampliamos cobertura con rutas propias para servir la mayoría de provincias en 24/48h.',
    icon: 'route',
  },
  {
    year: '2019',
    title: 'Portafolio OEM y premium',
    description:
      'Incorporamos líneas OEM y marcas premium para elevar la oferta de nuestros clientes.',
    icon: 'workspace_premium',
  },
  {
    year: '2024',
    title: 'Operación B2B optimizada',
    description:
      'Implementamos un catálogo digital y procesos de preparación para pedidos de alto volumen.',
    icon: 'memory',
  },
];

export default function SobreNosotrosPage() {
  return (
    <div className="w-full">
      <section className="w-full bg-white border-b border-[#e7eef3]">
        <div className="max-w-[1280px] mx-auto px-6 py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            <div className="flex-1">
              <span className="text-[#D00000] font-bold text-sm tracking-widest uppercase mb-3 block">
                Sobre Nosotros
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0d151c] leading-tight mb-4">
                Importadora Fidodido: aliados de tu inventario
              </h1>
              <p className="text-[#4b779b] text-base sm:text-lg leading-relaxed max-w-2xl">
                Somos una importadora especializada en repuestos automotrices para tiendas y
                distribuidores. Nuestro foco es que tengas stock confiable, precios competitivos y
                un despacho rápido para que tu negocio nunca se detenga.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/catalogo"
                  className="inline-flex items-center justify-center rounded-lg px-6 py-3 bg-[#D00000] text-white font-semibold hover:bg-[#b00000] transition-colors"
                >
                  Ver catálogo
                </Link>
                <Link
                  href="/contacto"
                  className="inline-flex items-center justify-center rounded-lg px-6 py-3 border border-[#e7eef3] text-[#0d151c] font-semibold hover:border-[#D00000] hover:text-[#D00000] transition-colors"
                >
                  Quiero ser cliente
                </Link>
              </div>
            </div>
            <div className="flex-1 w-full space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-[#e7eef3] shadow-sm">
                <Image
                  src="/pztn5zi5.lg-transformed-scaled.webp"
                  alt="Centro de distribución de repuestos"
                  width={720}
                  height={480}
                  className="w-full h-64 sm:h-72 object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#0d151c]">
                    <span className="material-symbols-outlined text-[16px] text-[#D00000]">local_shipping</span>
                    Logística nacional 24/48h
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-[#e7eef3] bg-gradient-to-br from-white via-white to-[#f8f5f5] p-6 sm:p-8 shadow-sm">
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl border border-[#e7eef3] bg-white p-4"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-2xl font-black text-[#0d151c]">{stat.value}</p>
                        <span className="material-symbols-outlined text-[#D00000] text-[20px]">
                          {stat.icon}
                        </span>
                      </div>
                      <p className="text-xs text-[#4b779b] mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[#4b779b] mt-6">
                  Cifras referenciales basadas en nuestra operación B2B.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-[#f8f5f5]">
        <div className="max-w-[1280px] mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-white rounded-2xl border border-[#e7eef3] p-6 shadow-sm"
              >
                <div className="w-11 h-11 rounded-xl bg-[#D00000]/10 text-[#D00000] flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-[22px]">{value.icon}</span>
                </div>
                <h3 className="text-lg font-bold text-[#0d151c] mb-2">{value.title}</h3>
                <p className="text-sm text-[#4b779b] leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-white border-t border-[#e7eef3]">
        <div className="max-w-[1280px] mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <span className="text-[#D00000] font-bold text-sm tracking-widest uppercase mb-2 block">
                Nuestra historia
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0d151c]">
                Crecimos junto a los talleres que confían en nosotros
              </h2>
            </div>
            <p className="text-sm text-[#4b779b] max-w-xl">
              Evolucionamos para atender pedidos más grandes sin perder el trato cercano y la
              rapidez de respuesta.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {milestones.map((milestone) => (
              <div
                key={milestone.year}
                className="border border-[#e7eef3] rounded-2xl p-6 bg-[#f8f5f5]"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[#D00000] text-sm font-bold">{milestone.year}</div>
                  <span className="material-symbols-outlined text-[#0d151c] text-[20px]">
                    {milestone.icon}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#0d151c] mb-2">{milestone.title}</h3>
                <p className="text-sm text-[#4b779b] leading-relaxed">{milestone.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
