import Header from '../../components/HeaderUser';
import Sidebar from '../../components/Sidebar';
import { Footer } from '@/components/Footer';
import { Plus } from 'lucide-react';
import { useSkillsManager } from '@/hooks/useSkillsManager';
import ConfirmationModal from '../../components/ConfirmationModal';

const AddSkillsPage = () => {
  const { skillType,setSkillType,skillName,handleSkillNameChange,skillLevel,setSkillLevel,handleSave,
          isSaving,errorMessage,showSuccessModal,closeSuccessModal,successMessage, } = useSkillsManager();

  const hasNameError = Boolean(errorMessage);

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-[#F7F0E1] flex flex-col">
      <Header />
      <div className="flex flex-col lg:flex-row flex-1">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 md:p-10">
          <div className="mx-auto max-w-6xl space-y-6">

              <h1 className="text-3xl font-bold text-[#003A6C] md:text-4xl mb-2">
                Añadir Habilidad
              </h1>
              <p className="text-sm text-[#4B778D] md:text-base">
                Agrega una nueva habilidad a tu portafolio
              </p>

            <div className="bg-white rounded-2xl p-5 shadow-sm sm:p-6 border border-[#a5d7e8]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void handleSave(e as any);
                }}
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
                    }`}
                  />
                  {errorMessage && (
                    <p
                      id="skill-name-error"
                      className="mt-1.5 text-sm font-medium text-red-600"
                    >
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
                      className="w-full py-2.5 px-4 border border-[#0E7D96]/20 rounded-xl bg-[#F8FAFC] text-[#003A6C] focus:ring-2 focus:ring-[#0E7D96]/40 outline-none"
                    >
                      <option value="basico">Básico</option>
                      <option value="intermedio">Intermedio</option>
                      <option value="avanzado">Avanzado</option>
                      <option value="experto">Experto</option>
                    </select>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center justify-center gap-2 flex-1 bg-[#003A6C] text-white py-3 rounded-xl font-bold hover:bg-[#002a50] transition-all disabled:cursor-not-allowed disabled:opacity-60" >
                    <Plus className="size-4" />
                    {isSaving ? 'Guardando...' : 'Agregar habilidad'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="flex-1 bg-[#C2DBED] text-[#003A6C] py-3 rounded-xl font-bold border border-[#6dacbf] hover:bg-[#b0cfeb] transition-all disabled:opacity-60" >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>

          </div>
        </main>
      </div>

      {/* Modal de éxito — Criterio 10 */}
      <ConfirmationModal
        isOpen={showSuccessModal}
        title="Éxito"
        message={successMessage}
        onClose={closeSuccessModal}
      />

      <Footer />
    </div>
  );
};

export default AddSkillsPage;