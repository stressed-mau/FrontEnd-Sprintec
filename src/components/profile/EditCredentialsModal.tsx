import { User, Lock, X} from "lucide-react";
import AccountInfoTab from "./AccountInfoTab";
import PasswordTab from "./PasswordTab";
import type {
  ProfileData,
  ProfileForm,
  ServerMessage,
  EmailSuggestion,
} from '@/hooks/useProfile';

type TabType = "info" | "password";

type EditCredentialsModalProps = {
  isOpen: boolean;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  form: ProfileForm;
  profile: ProfileData;
  errors: Record<string, string>;
  suggestion: EmailSuggestion | null;
  serverMessage: ServerMessage;
  isSubmitting: boolean;
  showCurrentPass: boolean;
  showNewPass: boolean;
  showConfirmPass: boolean;
  toggleCurrentPass: () => void;
  toggleNewPass: () => void;
  toggleConfirmPass: () => void;

  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (field: string) => void;

  applyEmailSuggestion: (email: string) => void;

  onClose: () => void;

  onUpdateInfo: () => void;
  onChangePassword: () => void;
};
const tabBase = "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl transition-all duration-150 select-none";
const tabActive = "bg-white text-[#003A6C] shadow-sm";
const tabInactive = "text-[#5B8FB9] hover:bg-white/50";

function EditCredentialsModal({
  isOpen,
  activeTab,
  setActiveTab,
  form,
  profile,
  errors,
  suggestion,
  serverMessage,
  isSubmitting,
  showCurrentPass,
  showNewPass,
  showConfirmPass,
  toggleCurrentPass,
  toggleNewPass,
  toggleConfirmPass,
  handleChange,
  handleBlur,
  applyEmailSuggestion,
  onClose,
  onUpdateInfo,
  onChangePassword,
}: EditCredentialsModalProps) {

  if (!isOpen) return null;
  return (
    <div
        id="modal-overlay"
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-3 sm:px-4"
    >
        <div
        id="modal-container"
        className="bg-[#C2DBED] w-full max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col"
        >
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
            onClick={onClose}
            className="text-[#003A6C] hover:bg-white/30 p-1 rounded-full transition-colors"
            >
            <X size={22} />
            </button>
        </div>
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
        <div className="bg-white mx-5 mb-5 mt-3 rounded-xl p-5 shadow-sm">
            {serverMessage.type === 'error' && serverMessage.text && (
            <div className="p-3 mb-4 rounded-lg text-sm border bg-red-50 border-red-200 text-red-700">
                {serverMessage.text}
            </div>
            )}
            {activeTab === "info" && (
                <AccountInfoTab
                    form={form}
                    profile={profile}
                    errors={errors}
                    suggestion={suggestion}
                    isSubmitting={isSubmitting}
                    showCurrentPass={showCurrentPass}
                    toggleCurrentPass={toggleCurrentPass}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    applyEmailSuggestion={applyEmailSuggestion}
                    onUpdateInfo={onUpdateInfo}
                />
                )}
                {activeTab === "password" && (
                    <PasswordTab
                        form={form}
                        errors={errors}
                        isSubmitting={isSubmitting}
                        showCurrentPass={showCurrentPass}
                        showNewPass={showNewPass}
                        showConfirmPass={showConfirmPass}
                        toggleCurrentPass={toggleCurrentPass}
                        toggleNewPass={toggleNewPass}
                        toggleConfirmPass={toggleConfirmPass}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        onChangePassword={onChangePassword}
                    />
                )}
        </div>
        </div>
    </div>
  );
}
export default EditCredentialsModal;