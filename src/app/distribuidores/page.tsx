'use client';

const distributors = [
  {
    id: '1',
    name: 'AutoPartes del Norte',
    address: 'Av. Principal 123, Monterrey, NL',
    status: 'ABIERTO',
    statusStyle: 'bg-green-100 text-green-700',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgsjqI_BQRHNwuRbL2G2SMrzDGDIzkkVxKF6scFHDUH10vIHvpIktjMxVnSYEn4MbOxC61CqeVR4lQY19rKRoiZZ0jNgO3Jwa5kOj0Onayb8sknMCCwJ5D0Tvpv2Onz0GbyyDY4L5RKTZkt_ZZWABHuWAmjDjYgusg4AU29g4BoRInCGyxTiL49jRsIlxwv7kYi-06JzfHu4sbve8MK2AK_HZWDndwBnrcshei-YHGprEcKU0-0Nmkff5D9fpO0Ue9v5eQNraU-s4',
    primary: true,
  },
  {
    id: '2',
    name: 'Refaccionaria Los Alpes',
    address: 'Blvd. Las Torres 450, San Pedro, NL',
    status: 'CERRADO',
    statusStyle: 'bg-slate-100 text-slate-500',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5YnRDE8GldtVNDJqJJRUlTV7-E_hv2Tt8t3B4udtUjysLpXwDzKjC4cX-i8oKog2SRKHDGFCX6fWiElYvnfLuJVhmM7lYntabiDeVXtcmL4mE7VLv0BBXBlJSumc5q8LFlIu-DdavbG46Pxtxwuz-MeA6baEaNxrEH-mvowvxONww3tKaRL6w8NmD9AXeGdJyMINHY1fSRb5nOQolQC5NTxXzQhL3gQz6GmAk2YS1hp6_lc7F74qYx32xoekbO1CcZp782393Tkk',
    primary: false,
  },
  {
    id: '3',
    name: 'Motores y Más',
    address: 'Calle Reforma 88, Centro, Monterrey',
    status: 'PREMIUM',
    statusStyle: 'bg-blue-100 text-blue-700',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_aHxTGUAaRwIMmh0gHDmy4EtedggRNd_FnhbW8L1fLNnFNq4DLT7SQNKHzuHNUa5kdRnJEqf7SoNrBypC6oW7QxoO1Bo-T26AtPGKDCDlOg4tgkcIqvQzU75geJQv772H7SvHT4yTcUcZDb9BVRr15PlamiimdPAMEnCcV_H8G9E0ZloE5Opw7kNZeixwbIDzwEshcSDQFa3d677ohqlzRhzB0suxaRNyuL8ydoMLxyPT0YTVt5DnmBST1DsIDJ6JsZgFlgEnpCQ',
    primary: true,
  },
  {
    id: '4',
    name: 'Distribuidora Central',
    address: 'Carr. Nacional Km 25, Santiago, NL',
    status: 'ABIERTO',
    statusStyle: 'bg-green-100 text-green-700',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-RsELAqFwfjVux3FNBIbGSdQiGEPS-uiFa1sNrhMJALUGLKfz8jCvzbM34KkvQWM6bOiWa355nbXzqITrma4WpwV24UFlsssobfOU1jEGTg9SvHGBnbNL2CpZgujmJ9_ex6Sge87-uXQCUk8SF-rCiSSXmY8Y9ViXUgtKB-vBJsARLvZUXDqlaV1i8y48xIE2cPS3hyIY6zU9j45A5ngwrLkhlhb9UZfODd3O5S_FA4iEf1Y1m0TVeTLoeR-gffEC2jV7TT3gY8s',
    primary: false,
  },
];

const MAP_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBXcEZQzBynRBj6DfAndHhnI7TFJZusunFa1Pgrd5qhQ6QYFWwZCj4aLtIaPgcE_9gpPtDm3ZgTklhqWhSa5IKKBWle8NoXCCcxigXn733grqfg-Sk11TGap5QigLPV68Xls1mGyEaKGidSdf-1fZUO-oqUfHKdMkkPHPekP0ZcQpEffsJbm_UzBN0xTHqD6L9PpwjUQOMZz_YKQboNVImquA64VrjlTc3ZiJHUGDxwv-pRERXKCctq9nScCVi9ezkfFdVb_zroJSA';

export default function DistribuidoresPage() {
  return (
    <main className="flex flex-1 overflow-hidden relative w-full h-full min-h-[calc(100vh-200px)]">
      {/* Left Sidebar: Filters & List */}
      <aside className="flex flex-col w-full md:w-[480px] lg:w-[520px] h-full min-h-[600px] bg-white border-r border-[#e7eef3] shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
        <div className="p-6 border-b border-[#e7eef3] flex flex-col gap-4 bg-white z-10">
          <div>
            <h1 className="text-[#0d151c] text-2xl font-bold leading-tight">
              Encuentra un distribuidor
            </h1>
            <p className="text-[#4b779b] text-sm font-normal leading-normal pt-1">
              Busca por nombre, ubicación o filtra por provincia.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <label className="flex flex-col w-full">
              <div className="flex w-full items-stretch rounded-lg shadow-sm">
                <input
                  type="text"
                  placeholder="Buscar por ciudad, tienda o nombre"
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-l-lg text-[#0d151c] focus:outline-0 focus:ring-2 focus:ring-[#D00000]/20 border border-[#cfdde8] bg-slate-50 h-12 placeholder:text-[#4b779b] p-3 text-sm font-normal leading-normal transition-all"
                />
                <div className="text-[#4b779b] flex border border-[#cfdde8] border-l-0 bg-slate-50 items-center justify-center px-3 rounded-r-lg">
                  <span className="material-symbols-outlined">search</span>
                </div>
              </div>
            </label>
            <label className="flex flex-col w-full">
              <div className="relative">
                <select className="appearance-none flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0d151c] focus:outline-0 focus:ring-2 focus:ring-[#D00000]/20 border border-[#cfdde8] bg-slate-50 h-12 p-3 pr-10 text-sm font-normal leading-normal cursor-pointer transition-all">
                  <option value="" disabled>
                    Filtrar por Provincia
                  </option>
                  <option value="NL">Nuevo León</option>
                  <option value="CDMX">Ciudad de México</option>
                  <option value="JAL">Jalisco</option>
                  <option value="PUE">Puebla</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#4b779b]">
                  <span className="material-symbols-outlined text-xl">expand_more</span>
                </div>
              </div>
            </label>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-semibold text-[#4b779b] uppercase tracking-wider">
              45 Resultados
            </span>
            <button
              type="button"
              className="text-[#D00000] text-sm font-medium hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-lg">filter_list</span>
              Más filtros
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 bg-[#f8fafc] flex flex-col gap-4 min-h-0">
          {distributors.map((d) => (
            <div
              key={d.id}
              className={`flex flex-col sm:flex-row items-stretch gap-4 rounded-xl bg-white p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group cursor-pointer ${
                d.primary ? 'ring-2 ring-[#D00000]/10' : ''
              }`}
            >
              <div
                className="w-full sm:w-24 h-32 sm:h-auto min-h-[80px] bg-center bg-no-repeat bg-cover rounded-lg shrink-0 border border-slate-100"
                style={{ backgroundImage: `url("${d.image}")` }}
              />
              <div className="flex flex-col justify-between flex-1 gap-2">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-[#0d151c] text-base font-bold leading-tight group-hover:text-[#D00000] transition-colors">
                      {d.name}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${d.statusStyle}`}
                    >
                      {d.status}
                    </span>
                  </div>
                  <p className="text-[#4b779b] text-sm font-normal leading-normal mt-1 flex items-start gap-1">
                    <span className="material-symbols-outlined text-base mt-0.5 shrink-0">location_on</span>
                    {d.address}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-100">
                  <div className="flex gap-3 text-[#4b779b]">
                    <button
                      type="button"
                      className="hover:text-[#D00000] transition-colors"
                      title="Llamar"
                    >
                      <span className="material-symbols-outlined text-[20px]">call</span>
                    </button>
                    <button
                      type="button"
                      className="hover:text-green-600 transition-colors"
                      title="WhatsApp"
                    >
                      <span className="material-symbols-outlined text-[20px]">chat</span>
                    </button>
                  </div>
                  <button
                    type="button"
                    className={`flex items-center justify-center rounded-lg h-8 px-4 text-xs font-bold shadow-sm transition-colors ${
                      d.primary
                        ? 'bg-[#D00000] text-white hover:bg-[#063a66]'
                        : 'bg-[#e7eef3] text-[#D00000] hover:bg-slate-200'
                    }`}
                  >
                    Contactar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>
      {/* Right: Map */}
      <div className="hidden md:block flex-1 h-full min-h-[600px] bg-slate-200 relative">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center opacity-80 grayscale"
          style={{ backgroundImage: `url("${MAP_IMAGE}")` }}
        />
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button
            type="button"
            className="size-10 bg-white rounded-lg shadow-md flex items-center justify-center text-slate-700 hover:text-[#D00000] transition-colors"
          >
            <span className="material-symbols-outlined">my_location</span>
          </button>
          <button
            type="button"
            className="size-10 bg-white rounded-lg shadow-md flex items-center justify-center text-slate-700 hover:text-[#D00000] transition-colors"
          >
            <span className="material-symbols-outlined">add</span>
          </button>
          <button
            type="button"
            className="size-10 bg-white rounded-lg shadow-md flex items-center justify-center text-slate-700 hover:text-[#D00000] transition-colors"
          >
            <span className="material-symbols-outlined">remove</span>
          </button>
        </div>
        <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative group cursor-pointer">
            <span className="material-symbols-outlined text-[#D00000] drop-shadow-lg text-5xl [font-variation-settings:'FILL'_1]">
              location_on
            </span>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-white rounded-lg shadow-xl p-2 opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-opacity">
              <p className="text-xs font-bold text-center text-[#0d151c]">
                Motores y Más
              </p>
              <p className="text-[10px] text-center text-[#4b779b]">
                Calle Reforma 88
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
