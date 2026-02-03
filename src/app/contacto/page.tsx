'use client';

export default function ContactoPage() {
  return (
    <div className="layout-container flex h-full grow flex-col w-full">
      <div className="px-5 md:px-20 lg:px-40 flex flex-1 justify-center py-10">
        <div className="layout-content-container flex flex-col max-w-[1200px] flex-1 w-full">
          {/* Page Heading */}
          <div className="flex flex-wrap justify-between gap-3 p-4 mb-8">
            <div className="flex flex-col gap-3">
              <h1 className="text-[#0d151c] text-4xl font-black leading-tight tracking-[-0.033em]">
                Contáctanos
              </h1>
              <p className="text-[#4b779b] text-base font-normal leading-normal">
                Estamos aquí para ayudar a potenciar tu negocio de autopartes. Resuelve tus dudas o solicita una cuenta
                mayorista.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 px-4">
            {/* Left: Contact Form */}
            <div className="lg:col-span-7 flex flex-col">
              <h2 className="text-[#0d151c] tracking-tight text-[28px] font-bold leading-tight pb-6">
                Envíanos un mensaje
              </h2>
              <form className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <label className="flex flex-col flex-1">
                    <span className="text-[#0d151c] text-sm font-medium leading-normal pb-2">
                      Nombre Completo
                    </span>
                    <input
                      type="text"
                      placeholder="Ej. Juan Pérez"
                      className="w-full rounded-lg text-[#0d151c] border border-[#cfdde8] bg-white h-12 px-4 placeholder:text-[#4b779b] focus:ring-2 focus:ring-[#D00000]/20 focus:border-[#D00000] transition-all text-base"
                    />
                  </label>
                  <label className="flex flex-col flex-1">
                    <span className="text-[#0d151c] text-sm font-medium leading-normal pb-2">
                      Empresa / Tienda
                    </span>
                    <input
                      type="text"
                      placeholder="Ej. Repuestos El Rápido"
                      className="w-full rounded-lg text-[#0d151c] border border-[#cfdde8] bg-white h-12 px-4 placeholder:text-[#4b779b] focus:ring-2 focus:ring-[#D00000]/20 focus:border-[#D00000] transition-all text-base"
                    />
                  </label>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  <label className="flex flex-col flex-1">
                    <span className="text-[#0d151c] text-sm font-medium leading-normal pb-2">
                      NIT / RUC
                    </span>
                    <input
                      type="text"
                      placeholder="ID Tributaria"
                      className="w-full rounded-lg text-[#0d151c] border border-[#cfdde8] bg-white h-12 px-4 placeholder:text-[#4b779b] focus:ring-2 focus:ring-[#D00000]/20 focus:border-[#D00000] transition-all text-base"
                    />
                  </label>
                  <label className="flex flex-col flex-1">
                    <span className="text-[#0d151c] text-sm font-medium leading-normal pb-2">
                      Correo Electrónico
                    </span>
                    <input
                      type="email"
                      placeholder="nombre@empresa.com"
                      className="w-full rounded-lg text-[#0d151c] border border-[#cfdde8] bg-white h-12 px-4 placeholder:text-[#4b779b] focus:ring-2 focus:ring-[#D00000]/20 focus:border-[#D00000] transition-all text-base"
                    />
                  </label>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  <label className="flex flex-col flex-1">
                    <span className="text-[#0d151c] text-sm font-medium leading-normal pb-2">
                      Teléfono
                    </span>
                    <input
                      type="tel"
                      placeholder="+54 11 1234 5678"
                      className="w-full rounded-lg text-[#0d151c] border border-[#cfdde8] bg-white h-12 px-4 placeholder:text-[#4b779b] focus:ring-2 focus:ring-[#D00000]/20 focus:border-[#D00000] transition-all text-base"
                    />
                  </label>
                  <label className="flex flex-col flex-1">
                    <span className="text-[#0d151c] text-sm font-medium leading-normal pb-2">
                      Provincia
                    </span>
                    <div className="relative">
                      <select className="w-full rounded-lg text-[#0d151c] border border-[#cfdde8] bg-white h-12 px-4 focus:ring-2 focus:ring-[#D00000]/20 focus:border-[#D00000] transition-all text-base appearance-none">
                        <option value="" disabled>
                          Seleccione una opción
                        </option>
                        <option value="BA">Buenos Aires</option>
                        <option value="CD">Córdoba</option>
                        <option value="SF">Santa Fe</option>
                        <option value="MZ">Mendoza</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-4 top-3 text-[#4b779b] pointer-events-none">
                        expand_more
                      </span>
                    </div>
                  </label>
                </div>
                <label className="flex flex-col w-full">
                  <span className="text-[#0d151c] text-sm font-medium leading-normal pb-2">
                    Mensaje
                  </span>
                  <textarea
                    placeholder="Escribe tu consulta aquí..."
                    rows={5}
                    className="w-full rounded-lg text-[#0d151c] border border-[#cfdde8] bg-white min-h-[140px] p-4 placeholder:text-[#4b779b] focus:ring-2 focus:ring-[#D00000]/20 focus:border-[#D00000] transition-all text-base resize-y"
                  />
                </label>
                <div className="flex items-center gap-3 py-2">
                  <input
                    type="checkbox"
                    id="isDistributor"
                    className="h-5 w-5 rounded border-gray-300 text-[#D00000] focus:ring-[#D00000] cursor-pointer"
                  />
                  <label
                    htmlFor="isDistributor"
                    className="text-[#0d151c] text-sm font-medium cursor-pointer select-none"
                  >
                    Soy tienda de repuestos o distribuidor autorizado
                  </label>
                </div>
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full md:w-auto min-w-[200px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-8 bg-[#D00000] hover:bg-[#b00000] transition-colors text-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-[#D00000]/30"
                  >
                    Enviar Mensaje
                  </button>
                </div>
              </form>
            </div>

            {/* Right: Info Card */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="bg-white rounded-xl p-8 border border-slate-100 shadow-sm flex flex-col gap-8 h-fit sticky top-28">
                <div>
                  <h3 className="text-xl font-bold text-[#0d151c] mb-6">
                    Información de Contacto
                  </h3>
                  <div className="flex flex-col gap-6">
                    <div className="flex gap-4 items-start">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#e7eef3] text-[#D00000] shrink-0">
                        <span className="material-symbols-outlined">location_on</span>
                      </div>
                      <div>
                        <p className="font-bold text-[#0d151c]">Oficina Central</p>
                        <p className="text-[#4b779b] text-sm leading-relaxed mt-1">
                          Av. del Libertador 1234, Piso 5
                          <br />
                          Buenos Aires, Argentina
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#e7eef3] text-[#D00000] shrink-0">
                        <span className="material-symbols-outlined">call</span>
                      </div>
                      <div>
                        <p className="font-bold text-[#0d151c]">Teléfonos</p>
                        <p className="text-[#4b779b] text-sm leading-relaxed mt-1">
                          +54 11 4444-5555
                          <br />
                          0800-123-AUTO (2886)
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#e7eef3] text-[#D00000] shrink-0">
                        <span className="material-symbols-outlined">mail</span>
                      </div>
                      <div>
                        <p className="font-bold text-[#0d151c]">Email</p>
                        <p className="text-[#4b779b] text-sm leading-relaxed mt-1">
                          ventas@autopartesb2b.com
                          <br />
                          soporte@autopartesb2b.com
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#e7eef3] text-[#D00000] shrink-0">
                        <span className="material-symbols-outlined">schedule</span>
                      </div>
                      <div>
                        <p className="font-bold text-[#0d151c]">Horario de Atención</p>
                        <p className="text-[#4b779b] text-sm leading-relaxed mt-1">
                          Lunes a Viernes: 08:00 - 18:00
                          <br />
                          Sábados: 09:00 - 13:00
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full h-px bg-slate-100" />
                <div className="bg-[#D00000]/5 rounded-lg p-5 border border-[#D00000]/10">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#D00000] mt-1">verified_user</span>
                    <div>
                      <h4 className="font-bold text-[#D00000] text-base">
                        Solicitar cuenta mayorista
                      </h4>
                      <p className="text-[#4b779b] text-sm mt-2 mb-4">
                        Accede a precios especiales por volumen y gestión de pedidos exclusivos para distribuidores.
                      </p>
                      <a
                        href="/distribuidores"
                        className="inline-flex items-center text-sm font-bold text-[#D00000] hover:underline group"
                      >
                        Ver requisitos
                        <span className="material-symbols-outlined text-[16px] ml-1 transition-transform group-hover:translate-x-1">
                          arrow_forward
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg overflow-hidden h-40 w-full mt-2 relative bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center group cursor-pointer">
                  <span className="material-symbols-outlined text-4xl text-slate-400 group-hover:text-[#D00000] transition-colors">
                    map
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
