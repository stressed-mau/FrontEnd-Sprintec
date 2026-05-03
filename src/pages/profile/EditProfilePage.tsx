import { Upload, User } from 'lucide-react';
import Header from '../../components/HeaderUser';
import Sidebar from '../../components/Sidebar';
import { Footer } from '@/components/Footer';
import { useUserPersonalData } from '../../hooks/useUserPersonalData';
import { allCountries } from 'country-telephone-data';
import ConfirmActionModal from '@/components/ConfirmActionModal';
import ConfirmationModal from '@/components/ConfirmationModal';
import { useState } from 'react';
import { useEffect } from "react";
const EditProfilePage = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const {
    form, errors, preview, countryCode, phoneNumber, fileInputRef,
    setCountryCode, handlePhoneChange, handleChange, handleCancel, isSubmitting,
    handleSubmit, success, setSuccess,handleFileChange, handleClick, charLimitWarning, emailSuggestion,
    applyEmailSuggestion,
  } = useUserPersonalData();

  const handleSaveTrigger = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };
   const closeAndCancel = () => {
    handleCancel();
  };

  const handleSuccessClose = () => {
      setShowSuccessModal(false);
      setSuccess("");
    };
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
   useEffect(() => {
    if (success && !showSuccessModal) {
      setShowSuccessModal(true);
    }
  }, [success]);
  return (
    <div className="min-h-screen bg-[#F7F0E1] flex flex-col">
      <Header />
      <div className="flex flex-1 justify-center px-4 py-10">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 md:p-10">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-[#003A6C] text-3xl font-bold mb-2">Editar Datos Personales</h1>
            <p className="text-gray-600 mb-8 text-sm">Actualiza la información de tu perfil</p>

            <form onSubmit={handleSaveTrigger} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              {/* Sección de Foto */}
              <div className="flex flex-col items-center justify-center mb-10 text-center">
                <div className="w-32 h-32 bg-[#E2E8F0] rounded-full flex items-center justify-center overflow-hidden border border-gray-300 mb-4">
                  {preview || form.image ? (
                    <img src={preview || form.image} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User size={60} className="text-gray-400" />
                  )}
                </div>
                
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />               
                <button 
                  type="button" 
                  onClick={handleClick} 
                  className="flex items-center gap-2 px-6 py-2 border border-[#4982AD] rounded-lg text-[#003A6C] text-sm bg-[#E2EEF6] hover:bg-white transition-all shadow-sm mb-2 font-medium"
                >
                  <Upload size={16} /> Cambiar foto
                </button>             
                <p className="text-gray-500 text-[11px]">JPG, PNG, JPEG (máx. 2MB)</p>
                {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
              </div>

              {/* SECCIÓN DE DATOS UNO ENCIMA DE OTRO */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-6">
                <div className="flex flex-col gap-6">
                {/* Nombre Completo */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-[#003A6C]">Nombre completo *</label>
                  <input 
                    id="fullName" 
                    value={form.fullName} 
                    type="text" 
                    disabled
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-400 text-[#003A6C]" 
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>

                {/* Biografía */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-[#003A6C]">Biografía</label>
                  <textarea 
                    id="bio" 
                    value={form.bio} 
                    onChange={handleChange} 
                    rows={10} 
                    placeholder="Cuéntanos sobre ti y tu experiencia..." 
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm outline-none resize-none focus:ring-2 focus:ring-blue-400 text-[#003A6C]" 
                  />
                  {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio}</p>}
                </div>
                </div>
              
              <div className="flex flex-col gap-6">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-[#003A6C]">Correo público</label>
                  <input 
                    id="email" 
                    value={form.email} 
                    onChange={handleChange} 
                    type="email" 
                    maxLength={60} 
                    placeholder="Ej: juan.perez@example.com" 
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-400 text-[#003A6C]"
                  />
                  
                  {/* Lógica de mensajes de validación y sugerencias [cite: 68, 69, 71, 75] */}
                  {errors.email ? (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  ) : charLimitWarning.email ? (
                    <p className="text-yellow-600 text-xs mt-1">
                      {charLimitWarning.email}
                    </p>
                  ) : emailSuggestion ? (
                    <p className="text-amber-700 text-xs mt-1">
                      ¿Quisiste decir{" "}
                      <span
                        className="underline cursor-pointer font-medium"
                        onClick={() => applyEmailSuggestion(emailSuggestion.full)}
                      >
                        {emailSuggestion.full}
                      </span>
                      ?
                    </p>
                  ) : null}
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-[#003A6C]">Número de contacto</label>
                  <div className="flex gap-2">
                    {/* Selector de país */}
                    <select 
                      value={countryCode} 
                      onChange={(e) => setCountryCode(e.target.value)} 
                      className="w-32 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-400 text-[#003A6C] appearance-none cursor-pointer"
                      style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%234982AD\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.2em' }}
                    >
                      {allCountries.map((c) => (
                        <option key={c.iso2} value={c.dialCode}>+{c.dialCode}</option>
                      ))}
                    </select>

                    {/* Input de número */}
                    <input 
                      value={phoneNumber} 
                      onChange={(e) => handlePhoneChange(e.target.value)} 
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={8}
                      placeholder="Ej: 77777777" 
                      className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-400 text-[#003A6C]"
                    />
                  </div>

                  {/* Lógica de mensajes de error y límites debajo de los campos */}
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

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-[#003A6C]">Residencia actual</label>
                  <input id="location" value={form.location} onChange={handleChange} placeholder="Ej: La Paz, Bolivia" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm outline-none resize-none focus:ring-2 focus:ring-blue-400 text-[#003A6C]"/>
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-[#003A6C]">Ocupación</label>
                  <input id="occupation" value={form.occupation} onChange={handleChange} placeholder="Ej: Desarrollador Full Stack" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-400 text-[#003A6C]"/>
                </div>
              </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`bg-[#003A6C] text-white px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#1a4f85]'
                  }`}
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
                </button>

                <button 
                  type="button" 
                  disabled={isSubmitting}
                  onClick={closeAndCancel}
                  className={`bg-[#C2DBED] text-[#003A6C] px-4 py-2 text-sm rounded-lg border border-[#4982AD] font-medium transition-colors ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#C4A57C]'
                  }`}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
      <ConfirmActionModal
        isOpen={showConfirmModal}
        title="Guardar cambios"
        message="¿Estás seguro de que deseas guardar los cambios?"
        onConfirm={async () => {
          setShowConfirmModal(false);
          await handleSubmit({ preventDefault: () => {} });
        }}
        onCancel={() => setShowConfirmModal(false)}
      />
      <ConfirmationModal
        isOpen={showSuccessModal}
        title="Registro completado"
        message="Tus datos personales se guardaron correctamente."
        buttonText="Continuar"
        onClose={handleSuccessClose}
      />
      <Footer />
    </div>
  );
};

export default EditProfilePage;