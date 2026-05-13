import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { allCountries } from 'country-telephone-data';
import { AlertTriangle, Upload, X, User } from 'lucide-react';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header'; // Usamos el Header público/general
import { useUserPersonalData } from '@/hooks/useUserPersonalData'; // Reutilizamos el hook
import { USER_HOME_ROUTE } from '@/routes/route-paths';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ConfirmActionModal from '@/components/ConfirmActionModal';
import ConfirmationModal from '@/components/ConfirmationModal';
import HeaderUser from '@/components/HeaderUser';
import Sidebar from '@/components/Sidebar';

export default function RegisterProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const isInitialRegisterFlow = Boolean((location.state as { fromRegister?: boolean } | null)?.fromRegister);

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
    loading,
    hasPersonalData,
  } = useUserPersonalData();
  
  const handleConfirmSave = async () => {
    setShowConfirmModal(false);
    const fakeEvent = {
        preventDefault: () => {},
    } as React.FormEvent<HTMLFormElement>;

    try {
        const success = await handleSubmit(fakeEvent);
        if (!success) return; 
        setShowSuccessModal(true);
        
    } catch (error) {
        console.error("Error al registrar los datos:", error);
    }
  };

  const renderHeader = () => (isInitialRegisterFlow ? <Header /> : <HeaderUser />);
  const renderMain = (content: React.ReactNode) =>
    isInitialRegisterFlow ? (
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 sm:py-14">{content}</main>
    ) : (
      <div className="flex flex-col lg:flex-row flex-1">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 md:p-10">{content}</main>
      </div>
    );

  if (loading) {
    return (
      <div className={`flex min-h-screen flex-col ${isInitialRegisterFlow ? 'bg-[#C2DBED]' : 'bg-[#F7F0E1]'}`}>
        {renderHeader()}
        {renderMain(
          <div className="flex items-center text-[#003A6C]">
            <div className="mr-2 h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Cargando...
          </div>
        )}
        <Footer />
      </div>
    );
  }

  if (hasPersonalData) {
    return (
      <div className={`flex min-h-screen flex-col ${isInitialRegisterFlow ? 'bg-[#C2DBED]' : 'bg-[#F7F0E1]'}`}>
        {renderHeader()}
        {renderMain(
          <Card className="mx-auto w-full max-w-xl border-2 border-[#F2C94C] bg-white/95 text-center shadow-2xl backdrop-blur-sm">
            <CardHeader className="flex flex-col items-center space-y-4 px-8 pt-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF4CC] text-[#B7791F]">
                <AlertTriangle className="h-9 w-9" />
              </div>
              <CardTitle className="text-2xl font-bold text-[#003A6C]">Registro ya completado</CardTitle>
              <CardDescription className="mx-auto max-w-md text-center text-sm leading-6 text-[#4F6F88]">
                El registro de datos personales solo se hace una vez. Si quieres modificar tu informacion, ve a la subseccion de editar datos personales.
              </CardDescription>
            </CardHeader>
            <CardContent className="mx-auto flex w-full max-w-md flex-col gap-3 px-8 pb-8 sm:flex-row">
              <Button
                type="button"
                onClick={() => navigate('/personal/editar')}
                className="h-11 flex-1 bg-[#003A6C] text-white hover:bg-[#002d54]"
              >
                Ir a editar datos personales
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(USER_HOME_ROUTE)}
                className="h-11 flex-1 border-[#4982AD] text-[#003A6C] hover:bg-[#E2EEF6]"
              >
                Volver al Home
              </Button>
            </CardContent>
          </Card>
        )}
        <Footer />
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen flex-col ${isInitialRegisterFlow ? 'bg-[#C2DBED]' : 'bg-[#F7F0E1]'}`}>
      {renderHeader()}
      {renderMain(
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
                  
                  <p className="text-[#003A6C] text-sm font-medium mt-2">Foto de perfil *</p>
                  
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
                        Correo público *
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
                    <label htmlFor="phone" className="block text-sm font-medium text-[#003A6C]">Numero de contacto *</label>
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
                <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-12 flex-1 bg-[#003A6C] hover:bg-[#002d54] text-white font-bold rounded-xl shadow-lg transition-all"
                    >
                        {isSubmitting ? "Guardando..." : isInitialRegisterFlow ? "Registrar datos personales" : "Registrar"}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isSubmitting}
                        onClick={() => navigate(USER_HOME_ROUTE, { replace: true })}
                        className="h-12 flex-1 border-[#4982AD] bg-white text-[#003A6C] font-bold rounded-xl hover:bg-[#E2EEF6]"
                    >
                        {isInitialRegisterFlow ? "Dejar para despues y entrar al Home" : "Cancelar"}
                    </Button>
                    </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
      <Footer />

      {/* Modal de Confirmación - Reutilizado */}
      <ConfirmActionModal
        isOpen={showConfirmModal}
        title="¿Completar registro?"
        message="Tus datos personales se guardarán y serás redirigido a tu panel principal."
        confirmText="Aceptar"
        cancelText="Cancelar"
        onConfirm={handleConfirmSave} // Aquí es donde ocurre la navegación
        onCancel={() => setShowConfirmModal(false)}
      />
      <ConfirmationModal
        isOpen={showSuccessModal}
        message="Datos personales registrados correctamente."
        onClose={() => {
          setShowSuccessModal(false);
          navigate(USER_HOME_ROUTE, { replace: true });
        }}
      />
    </div>
  );
}
