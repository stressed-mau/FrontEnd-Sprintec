import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { allCountries } from 'country-telephone-data'
import { useState } from 'react';

const UserPersonalData = () => {
  const [countryCode, setCountryCode] = useState("591");
  const [phoneNumber, setPhoneNumber] = useState("");

  return (
    <div id="personaldata-page" className="min-h-screen bg-[#F7F0E1]">
      <Header />

      <div className="flex flex-col lg:flex-row">

          <Sidebar />

        <main id="personaldata-main" className="flex-1 p-4 sm:p-6 md:p-10">
          <div className="max-w-5xl mx-auto">
            
            {/* Título y Subtítulo: Alineación central en móviles para coincidir con la UI de las fotos */}
            <div id="personaldata-header" className="text-center md:text-left mb-6 md:mb-8">
              <h1 id="personaldata-title" className="text-[#003A6C] text-3xl md:text-4xl font-bold mb-2">
                Datos Personales
              </h1>
              <p id="personaldata-description" className="text-gray-600 text-sm md:text-base px-4 md:px-0">
                Esta información se mostrará en tu portafolio público
              </p>
            </div>

            {/* Contenedor del Formulario */}
            <div id="personaldata-card" className="bg-white border border-[#0E7D96] rounded-2xl p-5 sm:p-8 shadow-sm">
              <h2 className="text-[#003A6C] text-lg font-medium mb-1 text-center md:text-left">Información del usuario</h2>
              <p className="text-[#6dacbf] text-sm md:text-base mb-8 text-center md:text-left">
                Actualiza los datos que verán los visitantes de tu portafolio
              </p>

              <form id="form-personaldata" className="space-y-6">
                
                {/* Sección de Foto de Perfil */}
                <div id="profile-photo-section" className="flex flex-col items-center mb-8">
                  <div className="w-28 h-28 md:w-32 md:h-32 bg-[#E2E8F0] rounded-full flex items-center justify-center mb-4">
                    <svg className="w-14 h-14 md:w-16 md:h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-[#003A6C] font-normal text-sm mb-2">Foto de perfil</p>
                  <button
                    id="btn-upload-photo"
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 border border-[#6dacbf] rounded-lg text-[#003A6C] text-sm bg-[#c2dbed] hover:bg-[#C4A57C] transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Subir foto
                  </button>
                  <p className="text-gray-400 text-xs mt-2 text-center">Formatos: JPG, PNG (máx. 2MB)</p>
                </div>

                {/* Campos de texto */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-[#003A6C] font-normal text-sm mb-2">Nombre completo *</label>
                    <input 
                      id="input-fullname"
                      type="text" 
                      placeholder="Ej: Google User"
                      className="w-full py-2.5 px-3 border border-[#0E7D96] rounded-xl bg-white text-[#003A6C] text-sm focus:outline-none focus:ring-2 focus:ring-[#0E7D96] placeholder:text-[#0E7D96]/60"
                    />
                  </div>

                  <div>
                    <label className="block text-[#003A6C] font-normal text-sm mb-2">Ocupación</label>
                    <input 
                      id="input-occupation"
                      type="text" 
                      placeholder="Ej: Desarrollador Full Stack"
                      className="w-full py-2.5 px-3 border border-[#0E7D96] rounded-xl bg-white text-[#003A6C] text-sm focus:outline-none focus:ring-2 focus:ring-[#0E7D96] placeholder:text-[#0E7D96]/60"
                    />
                  </div>

                  <div>
                    <label className="block text-[#003A6C] font-normal text-sm mb-2">Biografía</label>
                    <textarea 
                      id="input-bio"
                      rows={4}
                      placeholder="Cuéntanos sobre ti y tu experiencia..."
                      className="w-full py-2.5 px-3 border border-[#0E7D96] rounded-xl bg-white text-[#003A6C] text-sm focus:outline-none focus:ring-2 focus:ring-[#0E7D96] resize-none placeholder:text-[#0E7D96]/60"
                    />
                  </div>

                  <div>
                    <label className="block text-[#003A6C] font-normal text-sm mb-2">Residencia actual</label>
                    <input 
                      id="input-location"
                      type="text" 
                      placeholder="Ej: La Paz, Bolivia"
                      className="w-full py-2.5 px-3 border border-[#0E7D96] rounded-xl bg-white text-[#003A6C] text-sm focus:outline-none focus:ring-2 focus:ring-[#0E7D96] placeholder:text-[#0E7D96]/60"
                    />
                  </div>

                  <div>
                    <label className="block text-[#003A6C] font-normal text-sm mb-2">Correo electrónico público</label>
                    <input 
                      id="input-public-email"
                      type="email" 
                      placeholder="Ej: juan.perez@example.com"
                      className="w-full py-2.5 px-3 border border-[#0E7D96] rounded-xl bg-white text-[#003A6C] text-sm focus:outline-none focus:ring-2 focus:ring-[#0E7D96] placeholder:text-[#0E7D96]/60"
                    />
                  </div>

                  <div>
                    <label className="block text-[#003A6C] font-normal text-sm mb-2">Teléfono de contacto</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      {/* Código país: Ajuste de ancho en móvil */}
                      <select
                        id="select-country-code"
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="w-full sm:w-40 py-2.5 px-2 border border-[#0E7D96] rounded-xl bg-white text-[#003A6C] focus:outline-none focus:ring-2 focus:ring-[#0E7D96] text-sm"
                      >
                        {allCountries.map((country) => (
                          <option key={country.iso2} value={country.dialCode}>
                            +{country.dialCode} ({country.name})
                          </option>
                        ))}
                      </select>

                      {/* Número */}
                      <input
                        id="input-phone-number"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Ej: 74267890"
                        className="flex-1 py-2.5 px-3 border border-[#0E7D96] rounded-xl bg-white text-[#003A6C] text-sm focus:outline-none focus:ring-2 focus:ring-[#0E7D96] placeholder:text-[#0E7D96]/60"
                      />
                    </div>
                  </div>
                </div>

                {/* Botones de acción: Se apilan en móviles muy pequeños o se mantienen en línea */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                  <button
                    id="btn-save"
                    type="submit"
                    className="w-full sm:w-auto bg-[#003A6C] text-white px-8 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#1a4f7a] transition-colors order-1 sm:order-none"
                  >
                    Guardar cambios
                  </button>

                  <button
                    id="btn-cancel"
                    type="button"
                    className="w-full sm:w-auto bg-[#c2dbed] text-[#003A6C] px-8 py-2.5 rounded-lg font-semibold text-sm border border-[#6dacbf] hover:bg-[#C4A57C]/20 transition-colors order-2 sm:order-none"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default UserPersonalData;