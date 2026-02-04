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
                </div>
                <div className="flex flex-col md:flex-row gap-4">
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
                      placeholder="+1 809 123 4567"
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
                        <option value="AZ">Azua</option>
                        <option value="BAH">Bahoruco</option>
                        <option value="BA">Barahona</option>
                        <option value="DAJ">Dajabón</option>
                        <option value="DN">Distrito Nacional</option>
                        <option value="DUR">Duarte</option>
                        <option value="ELP">Elías Piña</option>
                        <option value="ESB">El Seibo</option>
                        <option value="ESP">Espaillat</option>
                        <option value="HM">Hato Mayor</option>
                        <option value="HER">Hermanas Mirabal</option>
                        <option value="IND">Independencia</option>
                        <option value="LAG">La Altagracia</option>
                        <option value="LR">La Romana</option>
                        <option value="LVE">La Vega</option>
                        <option value="MTS">María Trinidad Sánchez</option>
                        <option value="MON">Monseñor Nouel</option>
                        <option value="MCR">Monte Cristi</option>
                        <option value="MPL">Monte Plata</option>
                        <option value="PED">Pedernales</option>
                        <option value="PER">Peravia</option>
                        <option value="PL">Puerto Plata</option>
                        <option value="SAM">Samaná</option>
                        <option value="SAR">Sánchez Ramírez</option>
                        <option value="SC">San Cristóbal</option>
                        <option value="SJO">San José de Ocoa</option>
                        <option value="SJU">San Juan</option>
                        <option value="SPM">San Pedro de Macorís</option>
                        <option value="ST">Santiago</option>
                        <option value="STR">Santiago Rodríguez</option>
                        <option value="SD">Santo Domingo</option>
                        <option value="VAL">Valverde</option>
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
                  <h3 className="text-xl font-bold text-[#0d151c] mb-1">
                    Importadora Fidodidob(YR)
                  </h3>
                  <p className="text-[#4b779b] text-sm leading-relaxed mb-6">
                    Tienda de repuestos para automóviles en la República Dominicana
                  </p>
                  <div className="flex flex-col gap-6">
                    <div className="flex gap-4 items-start">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#e7eef3] text-[#D00000] shrink-0">
                        <span className="material-symbols-outlined">location_on</span>
                      </div>
                      <div>
                        <p className="font-bold text-[#0d151c]">Dirección</p>
                        <p className="text-[#4b779b] text-sm leading-relaxed mt-1">
                          Carretera La Rosa, Moca 56000
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#e7eef3] text-[#D00000] shrink-0">
                        <span className="material-symbols-outlined">call</span>
                      </div>
                      <div>
                        <p className="font-bold text-[#0d151c]">Teléfono</p>
                        <p className="text-[#4b779b] text-sm leading-relaxed mt-1">(809) 578-1310</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#e7eef3] text-[#D00000] shrink-0">
                        <span className="material-symbols-outlined">schedule</span>
                      </div>
                      <div>
                        <p className="font-bold text-[#0d151c]">Horario de Atención</p>
                        <div className="text-[#4b779b] text-sm leading-relaxed mt-1 space-y-1">
                          <p>Lunes a viernes: 8 a.m. – 6 p.m.</p>
                          <p>Sábado: Cerrado</p>
                          <p>Domingo: Cerrado</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full h-px bg-slate-100" />
                <div className="rounded-lg overflow-hidden h-44 w-full mt-2">
                  <iframe
                    title="Mapa Importadora Fidodido"
                    src="https://www.google.com/maps?q=Importadora+Fidodido+(YR+AUDIO)&output=embed"
                    className="w-full h-full border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
