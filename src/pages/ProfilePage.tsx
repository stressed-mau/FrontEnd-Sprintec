import { useState } from 'react';
import { useEffect } from 'react';
import { Footer } from '@/components/Footer';
import Header from '../components/HeaderUser';
import Sidebar from '../components/Sidebar';
import { User, Mail, Lock, SquarePen, X, ShieldCheck, Loader2 } from 'lucide-react';
import { Eye, EyeOff} from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { usePasswordVisibility } from '@/hooks/usePasswordVisibility';
import ConfirmActionModal from '@/components/ConfirmActionModal';
import ConfirmationModal from '@/components/ConfirmationModal';
const ProfilePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  // Integración del hook de lógica
  const {
    form,
    errors,
    loading,
    isSubmitting,
    suggestion,
    serverMessage,
    handleChange,
    handleUpdateInfo,
    handleChangePassword,
    applyEmailSuggestion
  } = useProfile();
  const { isVisible: showNewPass, toggleVisibility: toggleNewPass } = usePasswordVisibility();
  const { isVisible: showConfirmPass, toggleVisibility: toggleConfirmPass } = usePasswordVisibility();
  const [actionType, setActionType] = useState<"info" | "password" | null>(null);

  const handleConfirm = async () => {
    setShowConfirmModal(false);

    if (actionType === "info") {
      await handleUpdateInfo();
    } else if (actionType === "password") {
      await handleChangePassword();
    }

    setActionType(null);
  };
  useEffect(() => {
    if (serverMessage.type === "success" && serverMessage.text) {
      setShowSuccessModal(true);
    }
  }, [serverMessage]);
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F0E1] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#003A6C]" size={48} />
      </div>
    );
  }

  

  return (
    <div id="profile-page" className="min-h-screen bg-[#F7F0E1] relative flex flex-col">
      <Header />

      <div className="flex flex-col lg:flex-row flex-1">
        <Sidebar />

        <main id="profile-main" className="flex-1 p-4 sm:p-6 md:p-10">
          <div className="max-w-5xl mx-auto">
            
            {/* Título adaptable */}
            <div id="profile-header" className="text-left mb-6 md:mb-8">
              <h1 id="profile-title" className="text-[#003A6C] text-2xl sm:text-3xl md:text-4xl font-bold mb-1 md:mb-2">
                Mi Perfil
              </h1>
              <p id="profile-subtitle" className="text-[#003A6C] opacity-80 text-sm md:text-base">
                Configuración de cuenta y estadísticas
              </p>
            </div>

            {/* Tarjeta Principal */}
            <div id="profile-card" className="bg-white border border-[#A5D7E8] rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 md:mb-8">
                <div>
                  <div className="flex items-center gap-2 text-[#003A6C]">
                    <User size={22} className="md:w-6 md:h-6" />
                    <h2 id="account-info-title" className="text-xl md:text-2xl font-semibold">Información de la cuenta</h2>
                  </div>
                  <p id="account-info-description" className="text-[#4B778D] text-xs md:text-sm ml-8">Datos de acceso a tu cuenta</p>
                </div>
                
                <button 
                  id="btn-edit-profile"
                  onClick={() => setIsModalOpen(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#003057] text-white px-4 py-2 text-sm rounded-md hover:bg-[#1a4f7a] transition-colors"
                >
                  <SquarePen size={16} />
                  <span>Editar información</span>
                </button>
              </div>

              {/* Vista de datos */}
              <div id="profile-info-list" className="space-y-3 md:space-y-4">
                <div id="profile-item-0" className="bg-[#F8FAFC] p-3 md:p-4 rounded-xl flex items-center gap-3 md:gap-4">
                  <div className="text-slate-400 shrink-0"><User size={20} /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 font-medium">Nombre de usuario</p>
                    <p className="text-[#003A6C] text-base md:text-lg truncate font-bold">
                      {form.username || "Usuario"}
                    </p>
                  </div>
                </div>

                <div id="profile-item-1" className="bg-[#F8FAFC] p-3 md:p-4 rounded-xl flex items-center gap-3 md:gap-4">
                  <div className="text-slate-400 shrink-0"><Mail size={20} /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 font-medium">Correo electrónico</p>
                    <p className="text-[#003A6C] text-base md:text-lg truncate font-semibold">
                      {form.email || "usuario@gmail.com"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />

      {/* --- MODAL DE EDICIÓN --- */}
      {isModalOpen && (
        <div id="modal-overlay" className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-3 sm:px-4">
          <div 
            id="modal-container" 
            className="bg-[#C2DBED] w-full max-w-2xl rounded-t-2xl sm:rounded-xl shadow-2xl flex flex-col h-[90vh] sm:h-auto max-h-[92vh]"
          >
            
            {/* Header Modal */}
            <div className="p-5 md:p-6 pb-2 flex justify-between items-start">
              <div>
                <h2 id="modal-title" className="text-[#003A6C] text-xl md:text-2xl font-bold">Editar información de cuenta</h2>
                <p className="text-[#5B8FB9] text-xs md:text-sm">Actualiza tu nombre de usuario, correo electrónico y contraseña</p>
              </div>
              <button id="btn-close-modal" onClick={() => setIsModalOpen(false)} className="text-[#003A6C] hover:bg-white/20 p-1 rounded-full">
                <X size={24} />
              </button>
            </div>

            {/* Cuerpo con Scroll */}
            <div className="flex-1 overflow-y-auto p-5 md:p-6 pt-2 custom-scrollbar">
              
              {/* Feedback del servidor */}
              {serverMessage.text && (
                <div className={`p-3 mb-4 rounded-lg text-sm border ${
                  serverMessage.type === 'success' 
                    ? 'bg-green-100 border-green-200 text-green-700' 
                    : 'bg-red-100 border-red-200 text-red-700'
                }`}>
                  {serverMessage.text}
                </div>
              )}

              {/* Sección Datos de Cuenta */}
              <div className="mb-6 md:mb-8">
                <div className="flex items-center gap-2 text-[#003A6C] mb-4">
                  <User size={18} />
                  <h3 id="section-account-data" className="font-bold text-sm md:text-base">Datos de cuenta</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-[#003A6C] text-xs md:text-sm font-medium mb-1 block">Nombre de usuario</label>
                    <input
                      id="input-username"
                      name="username" 
                      type="text"
                      value={form.username || "Usuario"}
                      onChange={handleChange}
                      className={`w-full p-2.5 rounded-lg border bg-white text-[#003A6C] text-sm outline-none focus:ring-2 ring-blue-200 ${
                        errors.username ? 'border-red-500' : 'border-[#A5D7E8]'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="text-[#003A6C] text-xs md:text-sm font-medium mb-1 block">Correo electrónico</label>
                    <input
                      id="input-email"
                      type="email"
                      name="email"
                      value={form.email || "usuario@gmail.com"}
                      onChange={handleChange}
                      className={`w-full p-2.5 rounded-lg border bg-white text-[#003A6C] text-sm outline-none focus:ring-2 ring-blue-200 ${
                        errors.email ? 'border-red-500' : 'border-[#A5D7E8]'
                      }`}
                    />
                    {/* Sugerencia de mailcheck */}
                    {suggestion && (
                      <p className="mt-1 text-xs text-[#003A6C]">
                        ¿Quisiste decir <span 
                          className="underline cursor-pointer font-bold text-[#7C4AA6] hover:text-[#003A6C]"
                          onClick={() => applyEmailSuggestion(suggestion.full)}
                        >
                          {suggestion.full}
                        </span>?
                      </p>
                    )}
                    {errors.email && <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.email}</p>}
                  </div>

                  {/* Campo de contraseña actual para validar cambios de información */}

                  <button 
                    id="btn-update-info" 
                    onClick={() => {
                      setActionType("info");
                      setShowConfirmModal(true);
                    }}
                    disabled={isSubmitting}
                    className="w-full bg-[#003A6C] text-white py-2.5 rounded-lg font-semibold text-sm mt-2 hover:bg-[#1a4f7a] transition-all disabled:opacity-50 flex justify-center items-center gap-2"
                  >
                    {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                    Actualizar información
                  </button>
                </div>
              </div>

              <hr className="border-[#A5D7E8] mb-6 md:mb-8" />

              {/* Sección Cambiar Contraseña */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-[#003A6C] mb-4">
                  <Lock size={18} />
                  <h3 id="section-password" className="font-bold text-sm md:text-base">Cambiar contraseña</h3>
                </div>
                
                <div className="space-y-4">
                  {/* Contraseña Actual */}
                  <div>
                    <label className="text-[#003A6C] text-xs md:text-sm font-medium mb-1 block">Contraseña actual</label>
                    <input
                      id="input-current-password"
                      name="currentPassword"
                      type="password"
                      placeholder="••••••••"
                      value={form.currentPassword}
                      onChange={handleChange}
                      className={`w-full p-2.5 rounded-lg border bg-white text-sm outline-none focus:ring-2 ring-blue-200 ${
                        errors.currentPassword ? 'border-red-500' : 'border-[#A5D7E8]'
                      }`}
                    />
                    {errors.currentPassword && <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.currentPassword}</p>}
                  </div>

                  {/* Nueva Contraseña con Ojo y Texto de Ayuda */}
                  <div>
                    <label className="text-[#003A6C] text-xs md:text-sm font-medium mb-1 block">Nueva contraseña</label>
                    <p className="text-[10px] leading-4 text-[#5E7D95] mb-2 italic">
                      Debe contener entre 8 y 20 caracteres, incluir una mayúscula, un número y un carácter especial.
                    </p>
                    <div className="relative">
                      <input
                        id="input-new-password"
                        name="newPassword"
                        type={showNewPass ? "text" : "password"}
                        placeholder="••••••••"
                        maxLength={20}
                        value={form.newPassword}
                        onChange={handleChange}
                        className={`w-full p-2.5 pr-10 rounded-lg border bg-white text-sm outline-none focus:ring-2 ring-blue-200 ${
                          errors.newPassword ? 'border-red-500' : 'border-[#A5D7E8]'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={toggleNewPass}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B88A0] hover:text-[#003A6C]"
                      >
                        {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.newPassword && <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.newPassword}</p>}
                  </div>

                  {/* Confirmar Nueva Contraseña */}
                  <div>
                    <label className="text-[#003A6C] text-xs md:text-sm font-medium mb-1 block">Confirmar nueva contraseña</label>
                    <div className="relative">
                      <input
                        id="input-confirm-password"
                        name="confirmPassword"
                        type={showConfirmPass ? "text" : "password"}
                        placeholder="••••••••"
                        maxLength={20}
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className={`w-full p-2.5 pr-10 rounded-lg border bg-white text-sm outline-none focus:ring-2 ring-blue-200 ${
                          errors.confirmPassword ? 'border-red-500' : 'border-[#A5D7E8]'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={toggleConfirmPass}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B88A0] hover:text-[#003A6C]"
                      >
                        {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.confirmPassword}</p>}
                  </div>
                  
                  <button 
                    onClick={() => {
                      setActionType("password");
                      setShowConfirmModal(true);
                    }}
                    disabled={isSubmitting}
                    className="w-full bg-[#003A6C] text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-[#1a4f7a] transition-all disabled:opacity-50 flex justify-center items-center gap-2"
                  >
                    {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                    Cambiar contraseña
                  </button>
                </div>
              </div>

              {/* Banner de Seguridad */}
              <div className="bg-white rounded-xl p-4 flex gap-3 border border-[#A5D7E8] mb-6">
                <div className="text-blue-500 shrink-0">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 id="security-banner" className="text-[#003A6C] font-bold text-xs md:text-sm">Seguridad de tu cuenta</h4>
                  <p id="security-message" className="text-[#5B8FB9] text-[10px] md:text-xs leading-relaxed">
                    Mantén tu contraseña segura y no la compartas con nadie. Te recomendamos usar una contraseña única y cambiarla periódicamente.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
      <ConfirmActionModal
        isOpen={showConfirmModal}
        title={
          actionType === "info"
            ? "Actualizar información"
            : "Cambiar contraseña"
        }
        message={
          actionType === "info"
            ? "¿Estás seguro de que deseas actualizar tu información de cuenta?"
            : "¿Estás seguro de que deseas cambiar tu contraseña?"
        }
        confirmText="Confirmar"
        cancelText="Cancelar"
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirmModal(false)}
      />

      <ConfirmationModal
        isOpen={showSuccessModal}
        title="Operación exitosa"
        message={serverMessage.text || "Los cambios se guardaron correctamente"}
        buttonText="Aceptar"
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
};

export default ProfilePage;