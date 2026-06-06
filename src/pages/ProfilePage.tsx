import { useState, useEffect } from 'react';
import { User, Mail, SquarePen, Loader2} from 'lucide-react';
import { Footer } from '@/components/Footer';
import EditCredentialsModal from "@/components/profile/EditCredentialsModal";
import ConfirmActionModal from '@/components/modals/ConfirmActionModal';
import ConfirmationModal from '@/components/modals/ConfirmationModal';
import { useProfile } from '@/hooks/useProfile';
import { usePasswordVisibility } from '@/hooks/usePasswordVisibility';
import { getAuthSession } from '@/services/auth';
import Header from '../components/HeaderUser';
import Sidebar from '../components/Sidebar';
import AdminSidebar from '../components/admin/AdminSidebar';

type TabType = 'info' | 'password';

const ProfilePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [actionType, setActionType] = useState<'info' | 'password' | null>(null);
  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleUpdateInfoClick = () => {
    setActionType("info");
    setShowConfirmModal(true);
  };

  const handlePasswordClick = () => {
    setActionType("password");
    setShowConfirmModal(true);
  };
  const session = getAuthSession();
  const roleId = session?.user?.role_id;
  const isAdmin = roleId === 2;
  const {
    profile,
    form,
    errors,
    loading,
    isSubmitting,
    suggestion,
    serverMessage,
    handleChange,
    handleBlur,
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
  
  return (
    <div id="profile-page" className="min-h-screen bg-[#F7F0E1] relative flex flex-col">
      <Header />

      <div className="flex flex-col lg:flex-row flex-1">
        {isAdmin ? <AdminSidebar /> : <Sidebar />}

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
      <EditCredentialsModal
        isOpen={isModalOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        form={form}
        profile={profile}
        errors={errors}
        suggestion={suggestion}
        serverMessage={serverMessage}
        isSubmitting={isSubmitting}
        showCurrentPass={showCurrentPass}
        showNewPass={showNewPass}
        showConfirmPass={showConfirmPass}
        toggleCurrentPass={toggleCurrentPass}
        toggleNewPass={toggleNewPass}
        toggleConfirmPass={toggleConfirmPass}
        handleChange={handleChange}
        handleBlur={handleBlur}
        applyEmailSuggestion={applyEmailSuggestion}
        onClose={closeModal}
        onUpdateInfo={handleUpdateInfoClick}
        onChangePassword={handlePasswordClick}
      />
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
