import Link from 'next/link';
import Image from 'next/image';

const specs = [
  { label: 'Aplicación', value: 'Toyota Hilux / Fortuner (2016-2023)' },
  { label: 'Material', value: 'Cerámica de Alta Fricción' },
  { label: 'Posición', value: 'Eje Delantero' },
  { label: 'Garantía', value: '12 Meses / 20,000 km' },
  { label: 'Empaque', value: 'Caja Master (10 sets)' },
];

const relatedProducts = [
  {
    id: '42',
    category: 'DISCOS',
    name: 'Disco de Freno Ventilado Trasero',
    sku: 'B2B-DSK-042',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDx3yAOCV2OhnBNXNcLb4OvrIKNA6Z-fl8qCFmvJqfRvIWWvbwaL80fupX7YqkA_Tmy_pZDeCQ6yXr1uIJ7a7dzeG-0cvyVj1yeBfrYRyu-uIbV0ASAqCLfP7wG_fCoHCBfSrFVJyDX8mnCgr5Va-W4F8_gLyNJNBdZsI-TtYWcdskzkwuGoMLGDSy5J9tm-P2pZNBNe9gq0oDVklgOuiBFinSgbdZi2iZUl_TeSTdhTQ5188qvYQ5h9lI3RLBA169mU04u1jpqt_k',
  },
  {
    id: '9',
    category: 'FLUIDOS',
    name: 'Líquido de Frenos DOT 4 (500ml)',
    sku: 'B2B-FLD-009',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0_jfQbhOewiWrpvotYHcRSznQHKv5_vQ4Ei3zZPdJw8W3X8MVYO-_AxFLhiTJh1WYcWIzxwJD69h6I9RDByPevBeGywL8e1aCXQ9v5JfD4KhjlFRyeQnFTSq3VYPlPO52YD8IfepbmOlXuosYMCSN_7Nqq3jDWA-w3bMZBnC7pcmj04gzE1LJZQQ3VLKOEvOkJ4pmIsYNwilEFqfU1YOKzyV4-N8sKlQhhpie8exdhEf8fAOAjo1xM4X328WUxBr-_8rbGdrofuQ',
  },
  {
    id: '112',
    category: 'CALIPERS',
    name: 'Kit de Reparación de Caliper',
    sku: 'B2B-CAL-112',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQrHQ5FIUi8ipEAI1GcIVvDmwgUY1PIpNi3NVLrDrPzvZmOOS3P8QvJLbwixba6dD3u2ox82Xzh1qF0k_zcuLzYi8U7ZSM7ieXedhpbfHChTC9rZyfyYYpvs8OnfLnD46EynlcCOHb8i2zzsrPfPYw-_ZHSd3EGerBBunNmqWgLrKFGTaCIJ6ngYcGb93BRsehugc1NMAXCs56Azbm_ydz51i8OlMajzYwXYQ6n2Qy2qB3upaKIyTcoyew-Fxnq46NT6ZtAUiMX04',
  },
  {
    id: '88',
    category: 'SENSORES',
    name: 'Sensor ABS Delantero Izquierdo',
    sku: 'B2B-SEN-088',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-jZuiCFpsTjd5Of9aPznzDxuS2O1O5gejFX708hgSl99BTFNBb43QNxFZaL8N4Yb9KKWs-AHz8urzqXfD8yluWZknDCC2DeMSYK-0Xc9VwzS4K5ZsUz5LDqjW1ZthLIk__9ed-fJ2fPL7rwFMkJd8HPaUwjum4jrDSRj0QN5ziI5mxwNfkQxwHGlm7VDVi8x3MW4SfbGUNcDL59xjlhZp7svmkOMU3jTicTfLGAKohZxUnKXRvDOSnRCintF6eZmMJE3wmezMLZo',
  },
];

const showSpecs = false;

export default async function ProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <nav aria-label="Breadcrumb" className="flex mb-8">
        <ol className="flex items-center space-x-2 flex-wrap gap-y-1">
          <li>
            <Link href="/" className="text-slate-500 hover:text-[#D00000] transition-colors text-sm font-medium">
              Inicio
            </Link>
          </li>
          <li>
            <span className="text-slate-400 text-sm">/</span>
          </li>
          <li>
            <Link
              href="/catalogo"
              className="text-slate-500 hover:text-[#D00000] transition-colors text-sm font-medium"
            >
              Productos
            </Link>
          </li>
          <li>
            <span className="text-slate-400 text-sm">/</span>
          </li>
          <li>
            <Link
              href="/catalogo?cat=frenos"
              className="text-slate-500 hover:text-[#D00000] transition-colors text-sm font-medium"
            >
              Frenos
            </Link>
          </li>
          <li>
            <span className="text-slate-400 text-sm">/</span>
          </li>
          <li>
            <span aria-current="page" className="text-slate-900 text-sm font-medium">
              Pastilla de Freno
            </span>
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Gallery */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div
            className="w-full aspect-[4/3] bg-white rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center p-8 group relative"
            style={{
              backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAYw2H95qhQ47bFDtWMpXkR_WU11C92lmSQH7aXDHXc9ekrkRp387Nf9FfVLcnQnnUc_VE_kEj9O7OGH7mMUYxOtFer05Id2XO9cYuUoRXpQ9GMyqPMDywqK19pdwhmutI0pcTGO6X-DH3R7_Grk74u6COyWpNQ_GCKPIGaZYXa_axgRZCmOHX-6tdvkwk_WKIu3xdl1W5vIY0ixP4QKeyLAsG4szBGMd_S9TEPWhOhwEV6vQ7iqEaAAotzuvDHYE76aOJ6XE8MEFg")`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
              <span className="bg-[#D00000] text-white text-xs font-bold px-2.5 py-1 rounded w-fit">
                NUEVO
              </span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <button
              type="button"
              className="aspect-square rounded-lg border-2 border-[#D00000] bg-white overflow-hidden p-2 hover:opacity-100 transition-opacity"
            >
              <div
                className="w-full h-full bg-contain bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDv7e909uJLJQwrgKUyOJusTM7FBWWKPXLvCUXT6wEf_GRDEesZrPj-aIKRvBGmclXfEn8c7ctSsFsUezEneh4tDo6LHgJ7DZMc1e9NDeMRAom4_It9bzKNjbvVHXyrdcFdofpyUQSu_kFMPtgqFc8d7X2AqgJSesH0vAWvBMRwX79KOx4OrTj4o33pjmzXLZ7EHEt-iOyMXTHOBt8TfltBYroReUngFomN0z6bfMyEMtimu1wh-mXSAu0QcQWYnExN-nNpr8TaoTc")`,
                }}
              />
            </button>
            <button
              type="button"
              className="aspect-square rounded-lg border border-slate-200 bg-white overflow-hidden p-2 hover:border-[#D00000] transition-colors opacity-70 hover:opacity-100"
            >
              <div
                className="w-full h-full bg-contain bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBGOUtpMxvBbMlrhMnsOsRwjwKIbur5F_edEhszw-vtrvcjtG22XZSUqFcXP6IcamliOCaWj7uF9T4UWkO5KfxKCahld70If7LJFA5nqZIjCVyiRfr5lWk-mNtP1E1gEmMMednpkyOaHiCNL98YwgxE6U31S5eAWBM96aWCb3nBv2Tzx8U-fE15HAov-y7BQeupgrURgDEpJ2IzvzgqEDwqN2R-mFFjBws4HXk2PgjsAiU3-mlDwOHMumeT5AxV-dTnvs3YkdItGr4")`,
                }}
              />
            </button>
            <button
              type="button"
              className="aspect-square rounded-lg border border-slate-200 bg-white overflow-hidden p-2 hover:border-[#D00000] transition-colors opacity-70 hover:opacity-100"
            >
              <div
                className="w-full h-full bg-contain bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuB8EB63sNXPBxKQ5-317UUuw8_TTyCfY-sSe7evilSlOEn_oSRwwHwoy7FiK_wOd4P8dQBjxrujDQjZTaIIPcyOaMHKbp-e_u8DSzENCaOBl2ZWCWe7rR4eWlkJBHKJK8E5IV4YxfuNFwcTl_Rnj7V-rC6eJTOtTmZQhD3FAl5BZ6krzsUizmwzcwBWQtSJSgVuy468QtSpdKnTKpkNIUCmG9T4yS0ikbwGxvJ6h4wDvG0TTl-_kMkyX6VVj0Hyvz2Xg5xoW5uoxwU")`,
                }}
              />
            </button>
            <button
              type="button"
              className="aspect-square rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400 cursor-pointer hover:text-[#D00000] transition-colors"
            >
              <span className="material-symbols-outlined text-3xl">play_circle</span>
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="text-xs font-semibold text-[#D00000] bg-[#D00000]/10 px-2 py-0.5 rounded">
                FRENOS
              </span>
              <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-0.5 rounded text-xs">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="font-semibold text-slate-500">STOCK DISPONIBLE</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-medium text-[#FFBA08] px-2 py-0.5 rounded border border-[#FFBA08]/30 bg-[#FFBA08]/5">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                <span>Alta Rotación</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-3 leading-tight">
              Pastilla de Freno Delantera Cerámica Pro-X
            </h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[18px]">barcode</span>
                SKU: <span className="font-mono text-slate-700 font-medium">B2B-BRK-001</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                Marca: <span className="font-medium text-slate-700">AutoParts Pro</span>
              </span>
            </div>
          </div>
          <div className="prose prose-sm text-slate-600 mb-8 max-w-none">
            <p>
              Diseñadas para un rendimiento superior y un frenado silencioso. Nuestra fórmula cerámica avanzada reduce
              el polvo y extiende la vida útil del rotor. Ideal para flotas comerciales y uso intensivo.
            </p>
          </div>
          {showSpecs && (
            <div className="bg-white rounded-lg border border-slate-200 border-t-4 border-t-[#FFBA08] overflow-hidden mb-8 shadow-sm">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                Especificaciones Técnicas
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFBA08]/60" />
              </h3>
              <span className="material-symbols-outlined text-slate-400 text-[20px]">tune</span>
            </div>
            <table className="w-full text-sm text-left">
              <tbody>
                {specs.map((row, i) => (
                  <tr
                    key={row.label}
                    className={`border-b border-slate-100 ${i === specs.length - 1 ? '' : ''} last:border-0`}
                  >
                    <td className="px-4 py-3 text-slate-500 font-medium w-1/3">
                      {row.label}
                    </td>
                    <td className="px-4 py-3 text-slate-900">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-4 py-2 bg-[#FFBA08]/5 border-t border-slate-200 flex items-center gap-2 text-xs text-slate-600">
              <span className="material-symbols-outlined text-[#FFBA08] text-[16px]">lightbulb</span>
              <span>Sugerencia de stock: Mantener mín. 5 unidades para cobertura de flota.</span>
            </div>
          </div>
          )}
          <div className={`flex flex-col gap-3 ${showSpecs ? 'mt-auto' : ''}`}>
            <Link
              href="/contacto"
              className="w-full bg-[#D00000] hover:bg-[#063a66] text-white font-semibold py-3.5 px-6 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 group"
            >
              <span className="material-symbols-outlined group-hover:animate-pulse">mail</span>
              Solicitar información y cotización
            </Link>
            <button
              type="button"
              className="w-full bg-white border border-slate-300 text-slate-700 font-medium py-3 px-6 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">download</span>
              Descargar ficha técnica (PDF)
            </button>
          </div>
        </div>
      </div>

      {/* Related */}
      <section className="mt-20 mb-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900">Productos Relacionados</h3>
          <div className="flex gap-2">
            <button
              type="button"
              className="p-2 rounded-full border border-slate-200 hover:bg-white text-slate-500 disabled:opacity-50 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <button
              type="button"
              className="p-2 rounded-full border border-slate-200 hover:bg-white text-slate-500 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((p) => (
            <Link
              key={p.id}
              href={`/producto/${p.id}`}
              className="group bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow cursor-pointer flex flex-col"
            >
              <div className="aspect-[4/3] bg-slate-50 rounded-md mb-4 overflow-hidden">
                <Image
                  src={p.image}
                  alt={p.name}
                  width={300}
                  height={225}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
              </div>
              <span className="text-xs font-semibold text-[#D00000] mb-1">{p.category}</span>
              <h4 className="text-sm font-bold text-slate-900 leading-tight mb-2 group-hover:text-[#D00000] transition-colors">
                {p.name}
              </h4>
              <p className="text-xs text-slate-500 mb-4">SKU: {p.sku}</p>
              <div className="mt-auto pt-3 border-t border-slate-100">
                <span className="text-sm font-medium text-[#D00000] flex items-center gap-1">
                  Ver detalle <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
