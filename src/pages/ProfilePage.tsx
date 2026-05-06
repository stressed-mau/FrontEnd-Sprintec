import { useState, useEffect } from 'react';
import { Footer } from '@/components/Footer';
import Header from '../components/HeaderUser';
import Sidebar from '../components/Sidebar';
import { User, Mail, SquarePen, X, ShieldCheck, Loader2, Lock } from 'lucide-react';
import { Eye, EyeOff } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { usePasswordVisibility } from '@/hooks/usePasswordVisibility';
import ConfirmActionModal from '@/components/ConfirmActionModal';
import ConfirmationModal from '@/components/ConfirmationModal';

type TabType = 'info' | 'password';

const ProfilePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [actionType, setActionType] = useState<'info' | 'password' | null>(null);

  const {
    profile,
    form,
    errors,
    loading,
    isSubmitting,
    suggestion,
    serverMessage,
    handleChange,
    handleUpdateInfo,
    handleChangePassword,
    resetForm,
    applyEmailSuggestion,
  } = useProfile();

  const { isVisible: showCurrentPass, toggleVisibility: toggleCurrentPass } = usePasswordVisibility();
  const { isVisible: showNewPass,     toggleVisibility: toggleNewPass     } = usePasswordVisibility();
  const { isVisible: showConfirmPass, toggleVisibility: toggleConfirmPass } = usePasswordVisibility();

  const handleConfirm = async () => {
    setShowConfirmModal(false);
    if (actionType === 'info') {
      await handleUpdateInfo();
    } else if (actionType === 'password') {
      await handleChangePassword();
    }
    setActionType(null);
  };

  useEffect(() => {
    if (serverMessage.type === 'success' && serverMessage.text) {
      setShowSuccessModal(true);
    }
  }, [serverMessage]);

  // Resetear tab al abrir el modal
  const openModal = () => {
    resetForm();
    setActiveTab('info');
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F0E1] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#003A6C]" size={48} />
      </div>
    );
  }

  // ─── Estilos de tab ───────────────────────────────────────────────────────────
  const tabBase =
    'flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl transition-all duration-150 select-none';
  const tabActive   = 'bg-white text-[#003A6C] shadow-sm';
  const tabInactive = 'text-[#5B8FB9] hover:bg-white/50';

  return (
    <div id="profile-page" className="min-h-screen bg-[#F7F0E1] relative flex flex-col">
      <Header />

      <div className="flex flex-col lg:flex-row flex-1">
        <Sidebar />

        <main id="profile-main" className="flex-1 p-4 sm:p-6 md:p-10">
          <div className="max-w-5xl mx-auto">

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
                  onClick={openModal}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#003057] text-white px-4 py-2 text-sm rounded-md hover:bg-[#1a4f7a] transition-colors"
                >
                  <SquarePen size={16} />
                  <span>Editar credenciales</span>
                </button>
              </div>

              <div id="profile-info-list" className="space-y-3 md:space-y-4">
                <div id="profile-item-0" className="bg-[#F8FAFC] p-3 md:p-4 rounded-xl flex items-center gap-3 md:gap-4">
                  <div className="text-slate-400 shrink-0"><User size={20} /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 font-medium">Nombre de usuario</p>
                    <p className="text-[#003A6C] text-base md:text-lg truncate font-bold">
                      {profile.username || 'Usuario'}
                    </p>
                  </div>
                </div>

                <div id="profile-item-1" className="bg-[#F8FAFC] p-3 md:p-4 rounded-xl flex items-center gap-3 md:gap-4">
                  <div className="text-slate-400 shrink-0"><Mail size={20} /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 font-medium">Correo electrónico</p>
                    <p className="text-[#003A6C] text-base md:text-lg truncate font-semibold">
                      {profile.email || 'usuario@gmail.com'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

      <Footer />

      {/* ── MODAL DE EDICIÓN CON TABS ─────────────────────────────────────────── */}
      {isModalOpen && (
        <div
          id="modal-overlay"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-3 sm:px-4"
        >
          <div
            id="modal-container"
            className="bg-[#C2DBED] w-full max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="px-5 pt-5 pb-3 flex justify-between items-start">
              <div>
                <h2 id="modal-title" className="text-[#003A6C] text-xl font-bold">
                  Editar credenciales de inicio de sesión
                </h2>
                <p className="text-[#5B8FB9] text-xs mt-0.5">
                  Selecciona qué deseas actualizar
                </p>
              </div>
              <button
                id="btn-close-modal"
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="text-[#003A6C] hover:bg-white/30 p-1 rounded-full transition-colors"
              >
                <X size={22} />
              </button>
            </div>

            {/* Tabs */}
            <div className="px-5 pb-0">
              <div className="flex gap-1 bg-[#A8CEDE]/40 rounded-xl p-1">
                <button
                  id="tab-btn-info"
                  className={`${tabBase} ${activeTab === 'info' ? tabActive : tabInactive}`}
                  onClick={() => setActiveTab('info')}
                >
                  <User size={15} />
                  Datos de cuenta
                </button>
                <button
                  id="tab-btn-password"
                  className={`${tabBase} ${activeTab === 'password' ? tabActive : tabInactive}`}
                  onClick={() => setActiveTab('password')}
                >
                  <Lock size={15} />
                  Contraseña
                </button>
              </div>
            </div>

            {/* Panel blanco */}
            <div className="bg-white mx-5 mb-5 mt-3 rounded-xl p-5 shadow-sm">

              {/* Feedback del servidor — solo errores; el éxito va al ConfirmationModal */}
              {serverMessage.type === 'error' && serverMessage.text && (
                <div className="p-3 mb-4 rounded-lg text-sm border bg-red-50 border-red-200 text-red-700">
                  {serverMessage.text}
                </div>
              )}

              {/* ── PANEL: Datos de cuenta ─────────────────────────────────────── */}
              {activeTab === 'info' && (
                <div id="panel-info" className="space-y-4">

                  {/* Username */}
                  <div>
                    <label className="text-[#003A6C] text-xs font-semibold mb-1 block">
                      Nombre de usuario <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="input-username"
                      name="username"
                      type="text"
                      maxLength={30}
                      value={form.username}
                      onChange={handleChange}
                      className={`w-full p-2.5 rounded-lg border bg-white text-[#003A6C] text-sm outline-none focus:ring-2 ring-blue-200 ${
                        errors.username ? 'border-red-500' : 'border-[#A5D7E8]'
                      }`}
                    />
                    {errors.username && (
                      <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.username}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-[#003A6C] text-xs font-semibold mb-1 block">
                      Correo electrónico
                    </label>
                    <input
                      id="input-email"
                      type="email"
                      name="email"
                      maxLength={60}
                      value={form.email}
                      onChange={handleChange}
                      className={`w-full p-2.5 rounded-lg border bg-white text-[#003A6C] text-sm outline-none focus:ring-2 ring-blue-200 ${
                        errors.email ? 'border-red-500' : 'border-[#A5D7E8]'
                      }`}
                    />
                    {suggestion && (
                      <p className="mt-1 text-xs text-[#003A6C]">
                        ¿Quisiste decir{' '}
                        <span
                          className="underline cursor-pointer font-bold text-[#7C4AA6] hover:text-[#003A6C]"
                          onClick={() => applyEmailSuggestion(suggestion.full)}
                        >
                          {suggestion.full}
                        </span>
                        ?
                      </p>
                    )}
                    {errors.email && (
                      <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.email}</p>
                    )}
                  </div>

                  {/* Contraseña actual — solo si el username o email fue modificado */}
                  {(form.username.trim() !== profile.username.trim() || form.email.trim() !== profile.email.trim()) && (
                    <div>
                      <label className="text-[#003A6C] text-xs font-semibold mb-1 block">
                        Contraseña actual <span className="text-red-500">*</span>
                        <span className="text-[#5B8FB9] font-normal ml-1">(requerida para cambiar la información)</span>
                      </label>
                      <div className="relative">
                        <input
                          id="input-current-password-info"
                          name="currentPasswordInfo"
                          type={showCurrentPass ? 'text' : 'password'}
                          autoComplete="off"
                          placeholder="••••••••"
                          maxLength={20}
                          value={form.currentPasswordInfo}
                          onChange={handleChange}
                          className={`w-full p-2.5 pr-10 rounded-lg border bg-white text-sm outline-none focus:ring-2 ring-blue-200 ${
                            errors.currentPasswordInfo ? 'border-red-500' : 'border-[#A5D7E8]'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={toggleCurrentPass}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B88A0] hover:text-[#003A6C]"
                        >
                          {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {errors.currentPasswordInfo && (
                        <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.currentPasswordInfo}</p>
                      )}
                    </div>
                  )}

                  <button
                    id="btn-update-info"
                    onClick={() => {
                      setActionType('info');
                      setShowConfirmModal(true);
                    }}
                    disabled={isSubmitting}
                    className="w-full bg-[#003A6C] text-white py-2.5 rounded-lg font-semibold text-sm mt-1 hover:bg-[#1a4f7a] transition-all disabled:opacity-50 flex justify-center items-center gap-2"
                  >
                    {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                    Actualizar información
                  </button>
                </div>
              )}

              {/* ── PANEL: Contraseña ─────────────────────────────────────────── */}
              {activeTab === 'password' && (
                <div id="panel-password" className="space-y-4">

                  {/* Contraseña actual */}
                  <div>
                    <label className="text-[#003A6C] text-xs font-semibold mb-1 block">
                      Contraseña actual <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="input-current-password"
                        name="currentPasswordPassword"
                        type={showCurrentPass ? 'text' : 'password'}
                        autoComplete="off"
                        placeholder="••••••••"
                        maxLength={20}
                        value={form.currentPasswordPassword}
                        onChange={handleChange}
                        className={`w-full p-2.5 pr-10 rounded-lg border bg-white text-sm outline-none focus:ring-2 ring-blue-200 ${
                          errors.currentPasswordPassword ? 'border-red-500' : 'border-[#A5D7E8]'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={toggleCurrentPass}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B88A0] hover:text-[#003A6C]"
                      >
                        {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.currentPasswordPassword && (
                      <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.currentPasswordPassword}</p>
                    )}
                  </div>

                  {/* Nueva contraseña */}
                  <div>
                    <label className="text-[#003A6C] text-xs font-semibold mb-1 block">
                      Nueva contraseña <span className="text-red-500">*</span>
                    </label>
                    <p className="text-[10px] leading-4 text-[#5E7D95] mb-2 italic">
                      La contraseña debe contener entre 8 y 20 caracteres, e incluir al menos una letra mayúscula, un número y un carácter especial.
                    </p>
                    <div className="relative">
                      <input
                        id="input-new-password"
                        name="newPassword"
                        type={showNewPass ? 'text' : 'password'}
                        autoComplete="new-password"
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
                    {errors.newPassword && (
                      <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.newPassword}</p>
                    )}
                  </div>

                  {/* Confirmar contraseña */}
                  <div>
                    <label className="text-[#003A6C] text-xs font-semibold mb-1 block">
                      Confirmar nueva contraseña <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="input-confirm-password"
                        name="confirmPassword"
                        type={showConfirmPass ? 'text' : 'password'}
                        autoComplete="new-password"
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
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <button
                    id="btn-change-password"
                    onClick={() => {
                      setActionType('password');
                      setShowConfirmModal(true);
                    }}
                    disabled={isSubmitting}
                    className="w-full bg-[#003A6C] text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-[#1a4f7a] transition-all disabled:opacity-50 flex justify-center items-center gap-2"
                  >
                    {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                    Cambiar contraseña
                  </button>

                  {/* Banner de Seguridad */}
                  <div className="bg-[#EEF6FB] rounded-xl p-4 flex gap-3 border border-[#A5D7E8] mt-2">
                    <div className="text-[#378ADD] shrink-0">
                      <ShieldCheck size={22} />
                    </div>
                    <div>
                      <h4 id="security-banner" className="text-[#003A6C] font-bold text-xs">
                        Seguridad de tu cuenta
                      </h4>
                      <p id="security-message" className="text-[#5B8FB9] text-[10px] leading-relaxed mt-0.5">
                        Mantén tu contraseña segura y no la compartas con nadie. Te recomendamos usar una contraseña única y cambiarla periódicamente.
                      </p>
                    </div>
                  </div>

                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de acción */}
      <ConfirmActionModal
        isOpen={showConfirmModal}
        title={
          actionType === 'info' ? 'Actualizar información' : 'Cambiar contraseña'
        }
        message="¿Está seguro de que desea aplicar los cambios?"
        confirmText="Aceptar"
        cancelText="Cancelar"
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirmModal(false)}
      />

      {/* Modal de éxito */}
      <ConfirmationModal
        isOpen={showSuccessModal}
        title="Operación exitosa"
        message={serverMessage.text || 'Los cambios se guardaron correctamente.'}
        buttonText="Aceptar"
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
};

export default ProfilePage;
