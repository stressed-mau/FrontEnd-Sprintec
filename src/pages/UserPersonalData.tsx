import { useState } from 'react';
import Header from '../components/HeaderUser';
import Sidebar from '../components/Sidebar';
import { allCountries } from 'country-telephone-data';
import { useUserPersonalData } from '../hooks/useUserPersonalData';
// Importamos Plus y X para el modal y los botones
import { Edit3, Mail, Phone, MapPin, Briefcase, User, X, Upload } from 'lucide-react';

const UserPersonalData = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const {
    form,
    errors,
    success,
    setSuccess,
    preview,
    countryCode,
    phoneNumber,
    fileInputRef,
    setCountryCode,
    handlePhoneChange,
    handleChange,
    handleSubmit,
    handleCancel,
    handleClick,
    handleFileChange,
    removeImage,
    loading,
    charLimitWarning,
    setCharLimitWarning
  } = useUserPersonalData();

  // Función para cerrar y limpiar cambios no guardados
  const closeAndCancel = () => {
    handleCancel();
    setIsModalOpen(false);
  };

  return (
    
    <div id="personaldata-page" className="min-h-screen bg-[#F7F0E1]">
      <Header />

      <div className="flex flex-col lg:flex-row">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 md:p-10">
          <div className="max-w-5xl mx-auto">
            {loading ? (
              <div className="flex justify-center items-center h-64 text-[#003A6C]">
                <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                Cargando...
              </div>
            ) : (
              <>
              <div className="text-center md:text-left mb-6">
                <h1 className="text-[#003A6C] text-3xl md:text-4xl font-bold mb-2">Datos Personales</h1>
                <p className="text-gray-600 text-sm md:text-base">Esta información se mostrará en tu portafolio público</p>
              </div>
                {/* --- VISTA DE LECTURA (Imagen 1) --- */}
                <div className="bg-white border border-[#0E7D96] rounded-2xl p-6 md:p-10 shadow-sm relative">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h2 className="text-[#003A6C] text-lg font-medium">Información del usuario</h2>
                      <p className="text-[#4982AD] text-lg">Vista previa de tu información pública</p>
                    </div>
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 border border-[#6dacbf] rounded-lg text-[#003A6C] text-sm bg-[#c2dbed] hover:bg-[#C4A57C] transition-colors"
                    >
                      <Edit3 size={16} /> Editar
                    </button>
                  </div>
                  <div className="flex flex-col gap-6">
                    <div className="flex justify-center">
                      <div className="w-32 h-32 bg-[#E2E8F0] rounded-full flex items-center justify-center overflow-hidden border border-gray-400">
                        {form.image || preview ? (
                          <img src={preview || form.image} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <User size={60} className="text-gray-400" />
                        )}
                      </div>
                    </div>

                    <div className="md:col-span-2 space-y-6 md:order-1 text-[#003A6C]">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <p className="text-gray-400 text-sm font-medium mb-1">Nombre completo</p>
                          <span>{form.fullName || "No especificado"}</span>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm font-medium  font-bold mb-1">Ocupación</p>
                          <div className="flex items-center gap-2">
                            <Briefcase size={16} className="text-gray-400" />
                            <span>{form.occupation || "No especificado"}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm font-medium font-bold mb-1">Residencia actual</p>
                          <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-gray-400" />
                            <span>{form.location || "No especificado"}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm font-medium font-bold mb-1">Correo electrónico</p>
                          <div className="flex items-center gap-2">
                            <Mail size={16} className="text-gray-400" />
                            <span>{form.email || "No especificado"}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm font-medium font-bold mb-1">Número de contacto</p>
                          <div className="flex items-center gap-2">
                            <Phone size={16} className="text-gray-400" />
                            <span>{phoneNumber ? `+${countryCode} ${phoneNumber}` : "No especificado"}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm font-medium mb-1">Biografía</p>
                        <p className="text-sm leading-relaxed">{form.bio || "No especificado"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- MODAL DE EDICIÓN (Imagen 2 y 3) --- */}
                {isModalOpen && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-[#C2DBED] rounded-xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                      <div className="flex justify-between items-center p-6 pb-2">
                        <div>
                          <h2 className="text-[#003A6C] text-lg font-semibold">Editar Datos Personales</h2>
                          <p className="text-[#4982AD] text-sm">Actualiza los datos que verán los visitantes</p>
                        </div>
                        <button onClick={closeAndCancel} className="text-[#003A6C] hover:text-red-500 transition-colors">
                          <X size={24} />
                        </button>
                      </div>

                      <form onSubmit={async (e) => { await handleSubmit(e); setIsModalOpen(false); }} className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
                        
                        
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-32 h-32 bg-[#E2E8F0] rounded-full flex items-center justify-center overflow-hidden border border-gray-400">
                            {preview || form.image ? (
                              <img src={preview || form.image} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                              <User size={40} className="text-gray-400" />
                            )}
                          </div>
                          
                          <p className="text-[#003A6C] text-sm font-medium">Foto de perfil</p>
                          
                          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                          
                          <button 
                            type="button" 
                            onClick={handleClick}
                            className="bg-[#c2dbed] border border-[#4982AD] text-[#003A6C] px-6 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-white transition-all shadow-sm"
                          >
                            <Upload size={16} /> Subir foto
                          </button>

                          
                          {(preview || form.image) && (
                            <button 
                              type="button"
                              onClick={removeImage}
                              className="text-red-500 text-sm hover:underline mt-1"
                            >
                              Eliminar foto
                            </button>
                          )}
                          
                          <p className="text-gray-500 text-[11px]">Formatos: JPG, PNG (máx. 2MB)</p>
                          {errors.image && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.image}
                            </p>
                          )}
                        </div>

                        {/* Campos de Texto */}
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-[#003A6C] mb-1">Nombre completo *</label>
                            <input id="fullName" value={form.fullName} onChange={handleChange} type="text" maxLength={100} placeholder="Ej: Juan Pérez" className="w-full px-3 py-2 rounded-lg border border-[#4982AD] bg-white text-sm outline-none focus:ring-2 focus:ring-blue-400 text-[#003A6C] placeholder:text-[#4982AD]" />
                            {errors.fullName ? (
                              <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                            ) : (
                              charLimitWarning.fullName && (
                                <p className="text-red-500 text-xs mt-1">
                                  {charLimitWarning.fullName}
                                </p>
                              )
                            )}
                          </div>
                            
                          <div>
                            <label className="block text-sm font-medium text-[#003A6C] mb-1">Ocupación</label>
                            <input id="occupation" value={form.occupation} onChange={handleChange} type="text" maxLength={80} placeholder="Ej: Desarrollador Full Stack" className="w-full px-3 py-2 rounded-lg border border-[#4982AD] bg-white text-sm outline-none text-[#003A6C] placeholder:text-[#4982AD]" />
                            
                            {errors.occupation ? (
                              <p className="text-red-500 text-xs mt-1">{errors.occupation}</p>
                            ) : (
                              charLimitWarning.occupation && (
                                <p className="text-red-500 text-xs mt-1">
                                  {charLimitWarning.occupation}
                                </p>
                              )
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[#003A6C] mb-1">Biografía</label>
                            <textarea id="bio" value={form.bio} onChange={handleChange} rows={3} maxLength={300} placeholder="Cuéntanos sobre ti y tu experiencia..." className="w-full px-3 py-2 rounded-lg border border-[#4982AD] bg-white text-sm outline-none resize-none text-[#003A6C] placeholder:text-[#4982AD]" />
                            {errors.bio ? (
                              <p className="text-red-500 text-xs mt-1">{errors.bio}</p>
                            ) : (
                              charLimitWarning.bio && (
                                <p className="text-red-500 text-xs mt-1">
                                  {charLimitWarning.bio}
                                </p>
                              )
                            )}
                          </div>

                          <div className="grid grid-cols-1 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-[#003A6C] mb-1">Residencia actual</label>
                              <input id="location" value={form.location} onChange={handleChange} type="text" maxLength={100} placeholder="Ej: La Paz, Bolivia" className="w-full px-3 py-2 rounded-lg border border-[#4982AD] bg-white text-sm outline-none text-[#003A6C] placeholder:text-[#4982AD]" />
                              {errors.location ? (
                                <p className="text-red-500 text-xs mt-1">{errors.location}</p>
                              ) : (
                                charLimitWarning.location && (
                                  <p className="text-red-500 text-xs mt-1">
                                    {charLimitWarning.location}
                                  </p>
                                  )
                                )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-[#003A6C] mb-1">Correo público</label>
                              <input id="email" value={form.email} onChange={handleChange} type="email" maxLength={60} placeholder="Ej: juan.perez@example.com" className="w-full px-3 py-2 rounded-lg border border-[#4982AD] bg-white text-sm outline-none text-[#003A6C] placeholder:text-[#4982AD]" />
                              {errors.email ? (
                                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                              ) : (
                                charLimitWarning.email && (
                                  <p className="text-red-500 text-xs mt-1">
                                    {charLimitWarning.email}
                                  </p>
                                )
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[#003A6C] mb-1">Número de contacto</label>
                            <div className="flex gap-2">
                              <select 
                                value={countryCode} 
                                onChange={(e) => setCountryCode(e.target.value)}
                                className="w-24 px-2 py-2 rounded-lg border border-[#4982AD] bg-white text-sm outline-none text-[#003A6C]"
                              >
                                {allCountries.map((c) => (
                                  <option key={c.iso2} value={c.dialCode}>+{c.dialCode}</option>
                                ))}
                              </select>
                              <input 
                                value={phoneNumber} 
                                onChange={(e) => handlePhoneChange(e.target.value)}
                                type="tel" 
                                placeholder="Ej: 77777777"
                                maxLength={8}
                                inputMode="numeric"
                                pattern="[0-9]*"
                                className="flex-1 px-3 py-2 rounded-lg border border-[#4982AD] bg-white text-sm outline-none text-[#003A6C] placeholder:text-[#4982AD]" 
                              />
                              {errors.phone ? (
                                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                              ) : (
                                charLimitWarning.phone && (
                                  <p className="text-red-500 text-xs mt-1">
                                    {charLimitWarning.phone}
                                  </p>
                                )
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Botones Finales */}
                        <div className="flex gap-3 pt-4">
                          <button type="submit" className="bg-[#003A6C] text-white px-4 py-2 text-sm rounded-lg font-medium hover:bg-[#1a4f85]">
                            Guardar cambios
                          </button>
                          <button 
                            type="button" 
                            onClick={closeAndCancel}
                            className="bg-[#C2DBED] text-[#003A6C] px-4 py-2 text-sm rounded-lg border border-[#4982AD] font-medium hover:bg-[#C4A57C]">
                            Cancelar
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
                {success && (
                  <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/30 backdrop-blur-[2px]">
                    <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-8 text-center">
                      
                      <h3 className="text-[#003A6C] text-xl font-bold mb-2">
                        Información actualizada correctamente
                      </h3>

                      <p className="text-gray-600 text-sm">
                        {success}
                      </p>

                      <button 
                        onClick={() => setSuccess("")}
                        className="mt-4 px-4 py-2 bg-[#003A6C] text-white rounded-lg"
                      >
                        Cerrar
                      </button>

                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserPersonalData;