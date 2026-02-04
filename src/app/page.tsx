import Link from 'next/link';
import Image from 'next/image';

const HERO_IMAGE = '/pztn5zi5.lg-transformed-scaled.webp';

const categories = [
  { name: 'Frenos', icon: 'disc_full', href: '/catalogo?cat=frenos' },
  { name: 'Suspensión y dirección', icon: 'swap_vert', href: '/catalogo?cat=suspension-direccion' },
  { name: 'Motor', icon: 'settings_motion_mode', href: '/catalogo?cat=motor' },
  { name: 'Transmisión', icon: 'settings_input_component', href: '/catalogo?cat=transmision' },
  { name: 'Sistema eléctrico', icon: 'battery_charging_full', href: '/catalogo?cat=sistema-electrico' },
  { name: 'Filtros', icon: 'filter_alt', href: '/catalogo?cat=filtros' },
  { name: 'Rodamientos', icon: 'settings', href: '/catalogo?cat=rodamientos' },
  { name: 'Refrigeración', icon: 'ac_unit', href: '/catalogo?cat=refrigeracion' },
  { name: 'Luces', icon: 'light', href: '/catalogo?cat=luces' },
  { name: 'Accesorios', icon: 'construction', href: '/catalogo?cat=accesorios' },
];

const features = [
  {
    icon: 'inventory_2',
    title: 'Stock en tiempo real',
    description: 'Consulta la disponibilidad exacta de más de 10,000 SKUs al instante.',
  },
  {
    icon: 'local_shipping',
    title: 'Logística veloz',
    description: 'Despachos el mismo día para pedidos realizados antes de las 5:00pm.',
  },
  {
    icon: 'price_check',
    title: 'Descuentos por volumen',
    description: 'Aplica descuentos exclusivos a medida que crece tu pedido mensual.',
  },
  {
    icon: 'engineering',
    title: 'Asistencia especializada',
    description: 'Orientamos la selección de piezas y programas de mantenimiento con base en tus necesidades.',
  },
];

const featuredProducts = [
  {
    id: '1',
    category: 'Motor',
    name: 'Kit de Distribución Premium V6',
    sku: 'KD-8842-X',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuRzvcEeFl4Ug9EA7HwAhyXC9K1mUe66NfhSdVU4Kx-wJocN2PJIMLp0NDq12mWJikSKtpNCRx6SKY0qnumfHueyAqKM7tCeAVlqdB0sV8taVT0Z1H0vO7PbOtrphLUQM3MY6RvRZRtKlmXymzXHHgdSAfMt_j8iWa8aX-Nc-qb2GnAydMH2vb6NENjYXppWq6RHeXUmaI-tbEc4SXUlyMHf4x0bCJeTuH-nA7D_tUhExGpj5vwjXuGvp1wv45U8hlVfGVTuRA8AY',
    badge: 'NUEVO',
    badgeStyle: 'bg-[#D00000]',
  },
  {
    id: '2',
    category: 'Frenos',
    name: 'Disco de Freno Ventilado Cerámico',
    sku: 'DF-2021-C',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhcIdLz1sQ6ggXlB4ZGSjX0uyWRsiMZ0VQr8lyqN0glBfGg4mYAPLvUAswfDIFNN4VhxBWQpa7JlraGsAnr58BANMhjMTTb35gtKjyYkXuMo_8Xm6z5DUZQKk80-L5RWXZmN9gLpxc54-Zsg6Whdse7G9v5UlEr4OEi-tRExB3u0YjkXkdHOOL-3fvBAYj68WTNS4lJHSnzYS1mMDFM-2AQUXUATDNNRqpnaWN_ElCf2p066a7Tl4sr5dHiglFnpp8zz20zfQSmys',
    badge: null,
    badgeStyle: '',
  },
  {
    id: '3',
    category: 'Suspensión',
    name: 'Amortiguador de Gas Trasero',
    sku: 'AG-5590-R',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBs9HOFBm7t1qDW5htrNU9mRkqy99j81n42XcGh2-yfH36P_Kktd39M7KIx5VS4nGai8az5_RgL2Qi1D3RMOKs4susW5ch1-UHz1eoiBA6z7oh7nsl0hn6HE02fcS9j172G9Z8nX-zkow2qsFvEc4FFgnr13QXyN5_VBoWgrxF9nsNbVdzvAmWsBiOuHs1FfhOFshvqPoIqfsb4irxqTQhumsvfnK0WNIN2OVi2Ve45aLtzzZhPUCC4S9YQa3oaivB0_iAhLudtlVo',
    badge: null,
    badgeStyle: '',
  },
  {
    id: '4',
    category: 'Eléctrico',
    name: 'Alternador 12V 150A Alto Rendimiento',
    sku: 'AL-1215-H',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-LWwVLzdj42xWdg0c8eUBWlI6xPtmPmHpl6CIIc26yQd0-8fMcPIBS0u3MVKC-fWTRr4i5f-JvwJNytxyh4y5uBxBsIfvfJFK1Kj05BIfSAPGSDeQzZuImlUrcQ7E_3OQESS836Tg_Av_0cl0AIE3VvcxwdFc0WLzSAEsWf7hbuoKHNZzbTpH6aPNX3e-lZtcwLBj4GUuF19idazgTZ5YYKkyHxt4PLxrMlx2-t-kZoowNP4mY4vyY8gXtMy6vbzSZbiE_TDpdq0',
    badge: 'DESTACADO',
    badgeStyle: 'bg-[#FFBA08] text-[#0d151c]',
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="w-full max-w-[1280px] px-4 md:px-6 py-8">
        <div
          className="flex min-h-[400px] md:min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat rounded-xl items-start justify-center px-6 pb-10 md:px-12 md:items-start"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 60%, rgba(0, 0, 0, 0.1) 100%), url("${HERO_IMAGE}")`,
          }}
        >
          <div className="flex flex-col gap-4 text-left max-w-2xl">
            <h1 className="text-white text-4xl font-black leading-tight tracking-tight md:text-5xl lg:text-6xl flex items-center flex-wrap gap-2">
              Repuestos confiables
              <span className="material-symbols-outlined text-[#FFBA08]" style={{ fontSize: '0.8em', lineHeight: 1 }}>
                workspace_premium
              </span>
              para tu inventario
            </h1>
            <h2 className="text-gray-200 text-base font-normal leading-relaxed md:text-lg">
              Marca especializada en abastecimiento para tiendas de repuestos y distribuidores.
              Garantía de calidad y logística eficiente.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            <Link
              href="/catalogo"
              className="flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-[#D00000] hover:bg-[#b00000] text-white text-base font-bold leading-normal tracking-[0.015em] transition-colors shadow-lg"
            >
              Ver catálogo
            </Link>
            <Link
              href="/distribuidores"
              className="flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-white hover:bg-gray-100 text-[#0d151c] text-base font-bold leading-normal tracking-[0.015em] transition-colors shadow-lg"
            >
              Encontrar distribuidor
            </Link>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="w-full bg-white border-y border-[#e7eef3]">
        <div className="max-w-[1280px] mx-auto px-6 py-6">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-6 md:gap-12 text-[#4b779b] font-medium">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#FFBA08]">verified</span>
              <span>Garantía total en cada pedido</span>
            </div>
            <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-gray-300" />
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#FFBA08]">local_shipping</span>
              <span>Cobertura nacional 24/48h</span>
            </div>
            <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-gray-300" />
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#FFBA08]">support_agent</span>
              <span>Soporte técnico a tiendas</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categorias" className="w-full max-w-[1280px] px-6 py-12">
        <div className="flex items-center justify-between pb-6">
          <h2 className="text-[#0d151c] text-[28px] font-bold leading-tight tracking-[-0.015em]">
            Categorías de Repuestos
          </h2>
          <Link href="/catalogo" className="text-[#D00000] font-bold hover:underline">
            Ver todas
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group flex flex-col gap-4 rounded-xl border border-[#e7eef3] border-t-2 border-t-[#FFBA08] bg-white p-6 items-center justify-center hover:shadow-md hover:border-[#D00000] transition-all duration-300"
            >
              <div className="text-[#D00000] group-hover:scale-105 transition-transform duration-300">
                <span className="material-symbols-outlined text-[64px] leading-none">{cat.icon}</span>
              </div>
              <h2 className="text-[#0d151c] text-base font-bold leading-tight text-center">
                {cat.name}
              </h2>
            </Link>
          ))}
        </div>
      </section>

      {/* Why choose us */}
      <section id="nosotros" className="w-full bg-white py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-[#0d151c] text-[28px] font-bold leading-tight mb-4">
              Por qué elegir Importadora Fidodido
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Contamos con una amplia variedad de productos para las marcas más usadas en la República Dominicana.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f) => (
              <div key={f.title} className="flex flex-col items-start gap-3 p-4">
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-[#D00000] mb-2">
                  <span className="material-symbols-outlined text-[28px]">{f.icon}</span>
                </div>
                <h3 className="text-lg font-bold text-[#0d151c]">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="w-full max-w-[1280px] px-6 py-16">
        <h2 className="text-[#0d151c] text-[28px] font-bold leading-tight tracking-[-0.015em] mb-8">
          Novedades y Destacados
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((p) => (
            <article
              key={p.id}
              className="bg-white rounded-xl overflow-hidden border border-[#e7eef3] shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col"
            >
              <div className="h-48 overflow-hidden bg-gray-100 relative group">
                {p.badge && (
                  <div className={`absolute top-3 left-3 ${p.badgeStyle} text-white text-xs font-bold px-2 py-1 rounded`}>
                    {p.badge}
                  </div>
                )}
                <Image
                  src={p.image}
                  alt={p.name}
                  width={400}
                  height={192}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <span className="text-xs text-gray-500 mb-1">{p.category}</span>
                <h3 className="text-[#0d151c] font-bold text-lg mb-1 line-clamp-2">{p.name}</h3>
                <p className="text-xs text-gray-400 mb-4">SKU: {p.sku}</p>
                <div className="mt-auto">
                  <Link
                    href={`/producto/${p.id}`}
                    className="w-full block py-2.5 rounded-lg border border-[#e7eef3] hover:border-[#D00000] hover:text-[#D00000] text-[#0d151c] font-semibold text-sm transition-colors text-center"
                  >
                    Ver detalle
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA Distributors */}
      <section className="w-full py-20 px-4 bg-[#f8f5f5]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row rounded-3xl overflow-hidden bg-white shadow-2xl shadow-gray-200/50 border border-[#e7eef3]">
            <div className="lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center">
              <div className="mb-6">
                <span className="text-[#D00000] font-bold tracking-wider text-sm uppercase mb-2 block">
                  Negocios B2B
                </span>
                <h2 className="text-4xl font-black text-[#0d151c] mb-4 leading-tight">
                  Únete a nuestra Red de Distribuidores
                </h2>
                <p className="text-gray-600 text-lg mb-8">
              Ofrecemos condiciones pensadas para tiendas de repuestos: entregas confirmadas, stock exclusivo de las marcas
              más demandadas y acompañamiento para elevar tu mix de producto sin quedarte sin piezas clave.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {[
                  'Stock exclusivo de marcas líderes',
                  'Inventario listo para despacho inmediato',
                  'Soporte para promociones y lanzamientos',
                  'Condiciones comerciales claras y estables',
                ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#FFBA08]">check_circle</span>
                    <span className="text-sm font-medium text-[#0d151c]">{item}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/distribuidores"
                className="bg-[#D00000] hover:bg-[#b00000] text-white font-bold py-4 px-8 rounded-lg w-fit transition-colors flex items-center gap-2 inline-flex"
              >
                Solicitar ser Distribuidor
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
            <div
              className="lg:w-1/2 relative bg-gray-900 min-h-[400px] bg-cover bg-center opacity-80"
              style={{
                backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuD0rlTebBcK5cib7l__AEFK3L5gNh-ZRLDkXefmSBHtz32D0AlzZ2aenHq2ccHRc26-K7mfUA5FxUGLVoN8vaJ-T8FO9ekE9UvXu1JIPUwgrHmnI_QE51lAmRsI98eVIWjVoFfTrCUrkhdvoWgFZ8zrgcjA3K2LmHYMXNdM4qSAR4DUUvgqykMujR2JB651ou52k6NIZJFN6E3j5DZ9uVZcdOCFDsBjHCL-2Gnzgl5H8A_ebHPkjrmgnOcjznpzWynDWRN2heSlYA")`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white" />
              <div className="absolute bottom-8 right-8 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 max-w-xs text-right">
                <p className="text-white text-sm italic">
                  &quot;Ahora puedo conseguir las piezas que necesito a un precio justo con un sólo contacto.&quot;
                </p>
                <p className="text-gray-300 text-xs mt-2 font-bold">- Roberto M., Distribuidor Oficial</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
