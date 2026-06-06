import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { allCountries } from 'country-telephone-data';
import { AlertTriangle, Check, Upload, X, User } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header'; 
import { useUserPersonalData } from '@/hooks/useUserPersonalData';
import { USER_HOME_ROUTE } from '@/routes/route-paths';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputField } from "@/components/forms/InputFieldPersonalData";
import { TextAreaField } from "@/components/forms/TextAreaFieldPersonalData";
import ConfirmActionModal from '@/components/ConfirmActionModal';
import ConfirmationModal from '@/components/ConfirmationModal';
import HeaderUser from '@/components/HeaderUser';
import Sidebar from '@/components/Sidebar';

function RegisterProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const isInitialRegisterFlow = Boolean((location.state as { fromRegister?: boolean } | null)?.fromRegister);

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
    canSavePersonalData,
    success,
    setSuccess,
  } = useUserPersonalData();
  
  const handleConfirmSave = async () => {
    setShowConfirmModal(false);
    const fakeEvent = {
      preventDefault: () => {},
    } as React.FormEvent<HTMLFormElement>;
    const saved = await handleSubmit(fakeEvent);
    if (saved) {
      setShowSuccessModal(true);
    }
  };

  const renderHeader = () => (isInitialRegisterFlow ? <Header /> : <HeaderUser />);
  const renderMain = (content: React.ReactNode) => isInitialRegisterFlow ? (
    <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 sm:py-14">{content}</main>
  ) : (
    <div className="flex flex-col lg:flex-row flex-1">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 md:p-10">{content}</main>
    </div>
  );
  useEffect(() => {
    if (success && !showSuccessModal) {
      setShowSuccessModal(true);
    }
  }, [success, showSuccessModal]);

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

  if (hasPersonalData && form.image && !showSuccessModal) {
    return (
      <div className={`flex min-h-screen flex-col ${isInitialRegisterFlow ? 'bg-[#C2DBED]' : 'bg-[#F7F0E1]'}`}>
        {renderHeader()}
        {renderMain(
          <Card className="mx-auto w-full max-w-xl border-2 border-gray-100 bg-white/95 text-center backdrop-blur-sm">
            <CardHeader className="flex flex-col items-center space-y-4 px-8 pt-8 text-center">
              <div className="w-16 h-16 bg-[#E1EFFE] rounded-full flex items-center justify-center mb-6">
                <Check className="size-8 text-[#003A6C] stroke-[3px]" />
              </div>
              <CardTitle className="text-2xl font-bold text-[#003A6C]">Registro ya completado</CardTitle>
              <CardDescription className="mx-auto max-w-md text-center text-sm leading-6 text-[#4F6F88]">
                Tus datos personales ya se encuentran registrados correctamente en la plataforma.
              </CardDescription>
            </CardHeader>
            <CardContent className="mx-auto flex w-full max-w-md flex-col gap-3 px-8 pb-8 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(USER_HOME_ROUTE)}
                className="h-11 flex-1 bg-[#003A6C] text-white hover:bg-[#002d54] hover:text-white"
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
        <div className="w-full max-w-6xl space-y-6">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold text-[#003A6C] md:text-4xl">Registro de datos personales</h1>
            <p className="mt-2 text-sm text-[#4B778D] md:text-base">
              Registra tus datos con cuidado y verifica que esten correctos, porque este registro solo se podra realizar una sola vez. Despues podras ajustar la informacion permitida desde la subseccion de editar datos personales.
            </p>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-[#F97316] bg-[#FFF7ED] px-4 py-3">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-[#EA580C]" />
            <p className="text-xs font-medium leading-5 text-[#7C2D12]">
              Revisa especialmente tu nombre, correo, telefono y foto antes de guardar. Esta informacion se usara en tu perfil profesional.
            </p>
          </div>

          <Card className="border-[#9CC2DB] bg-white/95 shadow-2xl backdrop-blur-sm">
            <CardContent className="px-5 py-5 sm:px-6 sm:py-6">
              <form 
                noValidate 
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (canSavePersonalData) {
                    setShowConfirmModal(true);
                    return;
                  }
                  await handleSubmit(e);
                }} 
                className="grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)]"
              >
                <div className="flex flex-col items-center gap-3 rounded-xl border border-[#C2DBED] bg-[#F8FBFD] p-4 text-center lg:self-start">
                  <div className="flex size-24 items-center justify-center overflow-hidden rounded-full border border-gray-300 bg-[#E2E8F0] shadow-inner">
                    {preview || form.image ? (
                      <img src={preview || form.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <User size={44} className="text-gray-400" />
                    )}
                  </div>              
                  <p className="text-sm font-bold text-[#003A6C]">Foto de perfil *</p>    
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                  <div className="flex w-full flex-col gap-2">
                    <button 
                      type="button" 
                      onClick={handleClick}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#4982AD] bg-[#c2dbed] px-4 text-sm font-medium text-[#003A6C] shadow-sm transition-all hover:bg-white">
                      <Upload size={16} /> {form.image || preview ? 'Cambiar foto' : 'Subir foto'}
                    </button>
                    {(preview || form.image) && (
                      <button 
                        type="button"
                        onClick={removeImage}
                        className="inline-flex h-10 items-center justify-center rounded-xl bg-[#003A6C] px-4 text-sm font-medium text-white transition-colors hover:bg-[#1a4f85]"           >
                        <X size={16} className="mr-1 inline" /> Eliminar
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] leading-4 text-gray-500">Formatos: JPG, PNG (máx. 2MB)</p>
                  {errors.image && (
                    <p className="text-red-500 text-xs mt-1">{errors.image}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2">
                  <div className="flex flex-col gap-4">
                    <InputField 
                      id="fullName" label="Nombre completo *" value={form.fullName}
                      onChange={handleChange} error={errors.fullName} warning={charLimitWarning.fullName} 
                      maxLength={100} placeholder="Ej: Juan Pérez"/>
                    <TextAreaField 
                      id="bio" label="Biografía" value={form.bio} 
                      onChange={handleChange} error={errors.bio} warning={charLimitWarning.bio} 
                      rows={5} maxLength={300} placeholder="Cuéntanos sobre ti y tu experiencia..."/>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InputField 
                      id="occupation" label="Ocupación" value={form.occupation}
                      onChange={handleChange} error={errors.occupation} warning={charLimitWarning.occupation} 
                      maxLength={80} placeholder="Ej: Desarrollador Full Stack"
                    />
                    <InputField 
                      id="location" label="Residencia actual" value={form.location} 
                      onChange={handleChange} error={errors.location} warning={charLimitWarning.location}
                      maxLength={100} placeholder="Ej: La Paz, Bolivia"
                    />
                    <div className="space-y-1.5 md:col-span-2">
                      <InputField 
                        id="email" label="Correo electrónico público *" value={form.email} 
                        onChange={handleChange} error={errors.email} warning={charLimitWarning.email}
                        type="email" maxLength={60} placeholder="Ej: juan.perez@example.com"
                      />
                      {!errors.email && !charLimitWarning.email && emailSuggestion && (
                        <p className="text-[#003A6C] text-xs mt-1 ml-1">
                          ¿Quisiste decir{" "}
                          <span
                            className="underline cursor-pointer font-bold text-[#7C4AA6]"
                            onClick={() => applyEmailSuggestion(emailSuggestion.full)}>
                            {emailSuggestion.full}
                          </span>
                          ?
                        </p>
                      )}
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-[#003A6C]">Numero de contacto *</label>
                    <div className="flex gap-2">
                      <select 
                        value={countryCode} 
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="h-10 w-28 rounded-lg border border-[#C2DBED] bg-white px-2 text-sm text-[#003A6C] outline-none focus:ring-2 focus:ring-[#4982AD]/50">
                        {allCountries.map((c) => (
                          <option key={c.iso2} value={c.dialCode}>+{c.dialCode} ({c.iso2.toUpperCase()})</option>
                        ))}
                      </select>
                      <input id="phone" value={phoneNumber} onChange={(e) => handlePhoneChange(e.target.value)}
                        type="tel" placeholder="Ej: 77777777" maxLength={8} inputMode="numeric"
                        pattern="[0-9]*" className="h-10 flex-1 rounded-lg border border-[#C2DBED] bg-white px-3 text-sm text-[#003A6C] outline-none placeholder:text-[#7B98AF] focus:ring-2 focus:ring-[#4982AD]/50" 
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
                <div className="flex flex-col items-center justify-center gap-3 pt-1 sm:flex-row lg:col-span-2">
                  {errors.server && (
                    <p className="text-sm font-medium text-red-600 sm:flex-1">
                      {errors.server}
                    </p>
                  )}
                  <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-10 w-full bg-[#003A6C] hover:bg-[#002d54] text-white font-bold rounded-lg shadow-md transition-all sm:w-32">
                      {isSubmitting ? "Guardando..." : "Registrar"}
                  </Button>
                  <Button
                      type="button"
                      variant="outline"
                      disabled={isSubmitting}
                      onClick={() => navigate(USER_HOME_ROUTE, { replace: true })}
                      className="h-10 w-full border-[#4982AD] bg-[#F7F0E1] text-[#003A6C] font-bold rounded-lg hover:bg-[#F7F0E1]/80 sm:w-32">
                      Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
      <Footer />
      <ConfirmActionModal
        isOpen={showConfirmModal}
        title="Confirmar registro"
        message="¿Está seguro de que desea guardar sus datos personales?"
        confirmText={isSubmitting ? "Guardando..." : "Aceptar"}
        cancelText="Cancelar"
        onConfirm={handleConfirmSave}
        onCancel={() => setShowConfirmModal(false)}
      />
      <ConfirmationModal
        isOpen={showSuccessModal}
        title="Éxito"
        message="Datos personales registrados correctamente."
        buttonText="Continuar"
        onClose={() => {
          setShowSuccessModal(false);
          setSuccess('');
          navigate('/personal/ver', { replace: true });
        }}
      />
    </div>
  );
}
export default RegisterProfilePage;