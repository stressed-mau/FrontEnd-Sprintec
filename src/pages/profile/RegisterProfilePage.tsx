import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { allCountries } from 'country-telephone-data';
import { Upload, X, User } from 'lucide-react';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header'; // Usamos el Header público/general
import { useUserPersonalData } from '@/hooks/useUserPersonalData'; // Reutilizamos el hook
import { USER_HOME_ROUTE } from '@/routes/route-paths';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ConfirmActionModal from '@/components/ConfirmActionModal';

export default function RegisterProfilePage() {
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Reutilizamos toda la lógica del hook existente
  const {
    form,
    errors,
    preview,
    countryCode,
    phoneNumber,
    fileInputRef,
    setCountryCode,
    handlePhoneChange,
    handleChange,
    isSubmitting,
    emailSuggestion,        
    applyEmailSuggestion,
    handleSubmit,    
    handleClick,
    handleFileChange,
    removeImage,
    charLimitWarning,
  } = useUserPersonalData();
  
  const handleConfirmSave = async () => {
    setShowConfirmModal(false);
    const fakeEvent = {
        preventDefault: () => {},
    } as React.FormEvent<HTMLFormElement>;

    try {
        const success = await handleSubmit(fakeEvent);
        if (!success) return; 
        navigate(USER_HOME_ROUTE, { replace: true }); 
        
    } catch (error) {
        console.error("Error al registrar los datos:", error);
    }
  };
  return (
    <div className="flex min-h-screen flex-col bg-[#C2DBED]">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 sm:py-14">
        <div className="w-full max-w-6xl"> {/* Un poco más ancho para este formulario */}
          <Card className="border-[#9CC2DB] bg-white/95 shadow-2xl backdrop-blur-sm">
            <CardHeader className="space-y-4 text-center">
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold text-[#003A6C]">Completar Datos Personales</CardTitle>
                <CardDescription className="text-sm leading-6 text-[#4F6F88]">
                  Esta información es importante para tu perfil profesional.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent>
              {/* Usamos el formulario directamente, estilizado como en el modal pero integrado en la card */}
              <form 
                noValidate 
                onSubmit={(e) => { e.preventDefault(); setShowConfirmModal(true); }} 
                className="flex flex-col gap-8"
              >
                {/* Sección de Foto de Perfil - Reutilizada del modal */}
                <div className="flex flex-col items-center gap-2 border-b border-[#C2DBED] pb-6">
                  <div className="w-32 h-32 bg-[#E2E8F0] rounded-full flex items-center justify-center overflow-hidden border border-gray-400 shadow-inner">
                    {preview || form.image ? (
                      <img src={preview || form.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <User size={60} className="text-gray-400" />
                    )}
                  </div>
                  
                  <p className="text-[#003A6C] text-sm font-medium mt-2">Foto de perfil</p>
                  
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                  
                  <div className="flex gap-2 mt-1">
                    <button 
                      type="button" 
                      onClick={handleClick}
                      className="bg-[#c2dbed] border border-[#4982AD] text-[#003A6C] px-5 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-white transition-all shadow-sm"
                    >
                      <Upload size={16} /> {form.image || preview ? 'Cambiar foto' : 'Subir foto'}
                    </button>

                    {(preview || form.image) && (
                      <button 
                        type="button"
                        onClick={removeImage}
                        className="bg-[#003A6C] text-white px-4 py-2 text-sm rounded-xl font-medium hover:bg-[#1a4f85] transition-colors"           
                      >
                        <X size={16} className="mr-1 inline" /> Eliminar
                      </button>
                    )}
                  </div>
                  
                  <p className="text-gray-500 text-[11px] mt-1">Formatos: JPG, PNG (máx. 2MB)</p>
                  {errors.image && (
                    <p className="text-red-500 text-xs mt-1">{errors.image}</p>
                  )}
                </div>

                {/* Campos de Texto - Reutilizados y adaptados al estilo de CrearCuenta */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="flex flex-col gap-6">
                  {/* Nombre completo */}
                  <div className="space-y-2 md:col-span-2">
                    <label htmlFor="fullName" className="block text-sm font-medium text-[#003A6C]">Nombre completo *</label>
                    <input 
                      id="fullName" 
                      value={form.fullName} 
                      onChange={handleChange} 
                      type="text" 
                      maxLength={100} 
                      placeholder="Ej: Juan Pérez" 
                      className="w-full px-4 py-2.5 rounded-lg border border-[#C2DBED] bg-white text-sm outline-none focus:ring-2 focus:ring-[#4982AD]/50 text-[#003A6C] placeholder:text-[#7B98AF]" 
                    />
                    {errors.fullName ? (
                      <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                    ) : charLimitWarning.fullName && (
                      <p className="text-amber-700 text-xs mt-1">{charLimitWarning.fullName}</p>
                    )}
                  </div>
                 {/* Biografía */}
                  <div className="space-y-2 md:col-span-2">
                    <label htmlFor="bio" className="block text-sm font-medium text-[#003A6C]">Biografía</label>
                    <textarea 
                      id="bio" 
                      value={form.bio} 
                      onChange={handleChange} 
                      rows={6} 
                      maxLength={300} 
                      placeholder="Cuéntanos sobre ti y tu experiencia..." 
                      className="w-full px-4 py-2.5 rounded-lg border border-[#C2DBED] bg-white text-sm outline-none focus:ring-2 focus:ring-[#4982AD]/50 text-[#003A6C] placeholder:text-[#7B98AF] resize-none" 
                    />
                    {errors.bio ? (
                      <p className="text-red-500 text-xs mt-1">{errors.bio}</p>
                    ) : charLimitWarning.bio && (
                      <p className="text-amber-700 text-xs mt-1">{charLimitWarning.bio}</p>
                    )}
                   </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Ocupación */}
                  <div className="space-y-2">
                    <label htmlFor="occupation" className="block text-sm font-medium text-[#003A6C]">Ocupación</label>
                    <input 
                      id="occupation" 
                      value={form.occupation} 
                      onChange={handleChange} 
                      type="text" 
                      maxLength={80} 
                      placeholder="Ej: Desarrollador Full Stack" 
                      className="w-full px-4 py-2.5 rounded-lg border border-[#C2DBED] bg-white text-sm outline-none focus:ring-2 focus:ring-[#4982AD]/50 text-[#003A6C] placeholder:text-[#7B98AF]" 
                    />
                    {errors.occupation ? (
                      <p className="text-red-500 text-xs mt-1">{errors.occupation}</p>
                    ) : charLimitWarning.occupation && (
                      <p className="text-amber-700 text-xs mt-1">{charLimitWarning.occupation}</p>
                    )}
                  </div>

                  {/* Residencia actual */}
                  <div className="space-y-2">
                    <label htmlFor="location" className="block text-sm font-medium text-[#003A6C]">Residencia actual</label>
                    <input 
                      id="location" 
                      value={form.location} 
                      onChange={handleChange} 
                      type="text" 
                      maxLength={100} 
                      placeholder="Ej: La Paz, Bolivia" 
                      className="w-full px-4 py-2.5 rounded-lg border border-[#C2DBED] bg-white text-sm outline-none focus:ring-2 focus:ring-[#4982AD]/50 text-[#003A6C] placeholder:text-[#7B98AF]" 
                    />
                    {errors.location ? (
                      <p className="text-red-500 text-xs mt-1">{errors.location}</p>
                    ) : charLimitWarning.location && (
                      <p className="text-amber-700 text-xs mt-1">{charLimitWarning.location}</p>
                    )}
                  </div>


                   {/* --- CORREO PÚBLICO --- */}
                    <div className="space-y-1.5 md:col-span-2">
                    <label htmlFor="email" className="text-sm font-semibold text-[#003A6C] ml-1">
                        Correo público
                    </label>
                    <input 
                        id="email" 
                        name="email" // Importante: debe coincidir con la propiedad en tu estado 'form'
                        value={form.email} 
                        onChange={handleChange} 
                        type="email" 
                        maxLength={60} 
                        placeholder="Ej: juan.perez@example.com" 
                        className="w-full px-4 py-3 rounded-xl border border-[#9CC2DB] focus:ring-2 focus:ring-[#7C4AA6] outline-none transition-all placeholder:text-[#7B98AF]" 
                    />

                    {errors.email ? (
                        <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>
                    ) : charLimitWarning.email ? (
                        <p className="text-amber-700 text-xs mt-1 ml-1">
                        {charLimitWarning.email}
                        </p>
                    ) : emailSuggestion ? (
                        <p className="text-[#003A6C] text-xs mt-1 ml-1">
                        ¿Quisiste decir{" "}
                        <span
                            className="underline cursor-pointer font-bold text-[#7C4AA6]"
                            onClick={() => applyEmailSuggestion(emailSuggestion.full)}
                        >
                            {emailSuggestion.full}
                        </span>?
                        </p>
                    ) : null}
                    </div>
                  {/* Número de contacto */}
                  <div className="space-y-2 md:col-span-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-[#003A6C]">Número de contacto</label>
                    <div className="flex gap-2">
                      <select 
                        value={countryCode} 
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="w-28 px-3 py-2.5 rounded-lg border border-[#C2DBED] bg-white text-sm outline-none focus:ring-2 focus:ring-[#4982AD]/50 text-[#003A6C]"
                      >
                        {allCountries.map((c) => (
                          <option key={c.iso2} value={c.dialCode}>+{c.dialCode} ({c.iso2.toUpperCase()})</option>
                        ))}
                      </select>
                      <input 
                        id="phone"
                        value={phoneNumber} 
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        type="tel" 
                        placeholder="Ej: 77777777"
                        maxLength={8}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="flex-1 px-4 py-2.5 rounded-lg border border-[#C2DBED] bg-white text-sm outline-none focus:ring-2 focus:ring-[#4982AD]/50 text-[#003A6C] placeholder:text-[#7B98AF]" 
                      />
                    </div>
                    {errors.phone ? (
                      <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                    ) : charLimitWarning.phone && (
                      <p className="text-amber-700 text-xs mt-1">{charLimitWarning.phone}</p>
                    )}
                  </div>
                </div>
                </div>

                {/* Botón de Enviar - Estilo CrearCuenta */}
                <div className="pt-4">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-12 bg-[#003A6C] hover:bg-[#002d54] text-white font-bold rounded-xl shadow-lg transition-all"
                    >
                        {isSubmitting ? "Guardando..." : "Finalizar y entrar al Home"}
                    </Button>
                    </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />

      {/* Modal de Confirmación - Reutilizado */}
      <ConfirmActionModal
        isOpen={showConfirmModal}
        title="¿Completar registro?"
        message="Tus datos personales se guardarán y serás redirigido a tu panel principal."
        confirmText="Aceptar"
        cancelText="Revisar"
        onConfirm={handleConfirmSave} // Aquí es donde ocurre la navegación
        onCancel={() => setShowConfirmModal(false)}
      />
    </div>
  );
}