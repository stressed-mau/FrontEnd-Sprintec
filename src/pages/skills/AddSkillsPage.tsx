import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, X } from 'lucide-react';
import Header from '../../components/HeaderUser';
import Sidebar from '../../components/Sidebar';
import { Footer } from '@/components/Footer';
import { useSkillsManager } from '@/hooks/useSkillsManager';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import { VIEW_SKILLS_ROUTE } from '@/routes/route-paths';

const DUPLICATE_SKILL_MESSAGE = 'Ya existe una habilidad registrada con ese nombre. Ingresa un nombre diferente.';

const AddSkillsPage = () => {
  const navigate = useNavigate();
  const { skillType,setSkillType,skillName,handleSkillNameChange,skillLevel,setSkillLevel,handleSave,
          isSaving,errorMessage,showSuccessModal,closeSuccessModal,successMessage, } = useSkillsManager();
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [saveAttempt, setSaveAttempt] = useState(0);

  const hasNameError = Boolean(errorMessage);

  useEffect(() => {
    if (saveAttempt === 0 || errorMessage !== DUPLICATE_SKILL_MESSAGE) {
      return;
    }

    setShowDuplicateModal(true);
  }, [errorMessage, saveAttempt]);

  const handleSuccessClose = useCallback(() => {
    closeSuccessModal();
    navigate(VIEW_SKILLS_ROUTE);
  }, [closeSuccessModal, navigate]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setSaveAttempt((current) => current + 1);
    e.preventDefault();
    await handleSave(e);
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-[#F7F0E1] flex flex-col">
      <Header />
      <div className="flex flex-col lg:flex-row flex-1">
        <Sidebar />
        <main className="flex-1 px-4 py-6 md:px-8 lg:px-10">
          <div className="mx-auto max-w-6xl space-y-6">

              <h1 className="mb-2 text-3xl font-bold text-[#003A6C]">
                Registro de habilidad
              </h1>
              <p className="text-sm text-[#4B778D] md:text-base">
                Registra una nueva habilidad en tu portafolio
              </p>

            <div className="bg-white rounded-2xl p-5 shadow-sm sm:p-6 border border-[#a5d7e8]">
              <form
                onSubmit={handleSubmit}
                className="space-y-6">
              
                <div>
                  <label className="block text-[#003A6C] font-semibold text-sm mb-1.5">
                    Tipo de habilidad *
                  </label>
                  <select
                    value={skillType}
                    onChange={(e) => setSkillType(e.target.value as any)}
                    className="w-full py-2.5 px-4 border border-[#0E7D96]/20 rounded-xl bg-[#F8FAFC] text-[#003A6C] focus:ring-2 focus:ring-[#0E7D96]/40 outline-none" >
                    <option value="tecnica">Técnica</option>
                    <option value="blanda">Blanda</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#003A6C] font-semibold text-sm mb-1.5">
                    Nombre de la habilidad *
                  </label>
                  <input
                    type="text"
                    value={skillName}
                    onChange={(e) => handleSkillNameChange(e.target.value)}
                    maxLength={40}
                    aria-invalid={hasNameError}
                    aria-describedby={hasNameError ? 'skill-name-error' : undefined}
                    placeholder={
                      skillType === 'tecnica'
                        ? 'Ej: React, Python, JavaScript'
                        : 'Ej: Trabajo en equipo'
                    }
                    className={`w-full py-2.5 px-4 rounded-xl bg-white text-[#003A6C] outline-none placeholder:text-[#0E7D96]/40 focus:ring-2 ${
                      hasNameError
                        ? 'border border-red-400 focus:ring-red-200'
                        : 'border border-[#0E7D96]/20 focus:ring-[#0E7D96]/40'
                    }`} />
                  {errorMessage && (
                    <p
                      id="skill-name-error"
                      className="mt-1.5 text-sm font-medium text-red-600"  >
                      {errorMessage}
                    </p>
                  )}
                </div>

                {skillType === 'tecnica' && (
                  <div className="animate-in fade-in slide-in-from-top-2">
                    <label className="block text-[#003A6C] font-semibold text-sm mb-1.5">
                      Nivel de dominio *
                    </label>
                    <select
                      value={skillLevel}
                      onChange={(e) => setSkillLevel(e.target.value)}
                      className="w-full py-2.5 px-4 border border-[#0E7D96]/20 rounded-xl bg-[#F8FAFC] text-[#003A6C] focus:ring-2 focus:ring-[#0E7D96]/40 outline-none"              >
                      <option value="basico">Básico</option>
                      <option value="intermedio">Intermedio</option>
                      <option value="avanzado">Avanzado</option>
                      <option value="experto">Experto</option>
                    </select>
                  </div>
                )}

                  <div className="flex flex-wrap gap-4 pt-2 justify-center">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="w-auto px-3 py-2 bg-[#003A6C] text-white text-sm mb-1.5 shadow-sm  rounded-sm font-bold hover:bg-[#4982AD] transition-all disabled:cursor-not-allowed disabled:opacity-60">
                        {isSaving ? "Guardando..." : "Registrar"}
                        </button>
                     <button
                        type="button"
                        onClick={handleCancel}
                        disabled={isSaving}
                        className="w-auto px-2 py-2 border-[#A5D7E8] bg-[#F7F0E1] text-[#003A6C] text-sm mb-1.5 rounded-sm font-bold border shadow-sm hover:bg-[#F7F0E1]/80 transition-all disabled:opacity-60" >
                        Cancelar
                      </button>
                  </div>
              </form>
            </div>

          </div>
        </main>
      </div>

      <ConfirmationModal
        isOpen={showSuccessModal}
        title="Éxito"
        message={successMessage}
        onClose={handleSuccessClose} />

      {showDuplicateModal ? (
        <div className="fixed inset-0 z-150 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-[32px] bg-white p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setShowDuplicateModal(false)}
              className="absolute right-5 top-5 text-gray-400 transition-colors hover:text-gray-600" 
              aria-label="Cerrar alerta de habilidad duplicada"          >
              <X className="size-7" />
            </button>
              <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="size-10 text-red-600" />
              </div>
                <h3 className="mb-3 text-3xl font-bold text-[#003A6C]">Habilidad duplicada</h3>
                <p className="mb-8 text-center text-lg leading-relaxed text-[#6B7280]">{errorMessage}</p>
              <button
                type="button"
                onClick={() => setShowDuplicateModal(false)}
                className="w-full rounded-xl bg-[#003A6C] py-4 text-xl font-bold text-white shadow-lg transition-all hover:bg-[#002a50] active:scale-[0.98]"     >
                Entendido
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <Footer />
    </div>
  );
};

export default AddSkillsPage;
