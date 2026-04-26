import Header from '../../components/HeaderUser';
import Sidebar from '../../components/Sidebar';
import { Footer } from '@/components/Footer';
import { useSkillsManager } from '../../hooks/useSkillsManager';
import ConfirmationModal from '../../components/ConfirmationModal';

const AddSkillsPage = () => {
  const { 
    skillType, setSkillType, skillName, handleSkillNameChange, 
    skillLevel, setSkillLevel, handleSave, isSaving, errorMessage,
    showSuccessModal, setShowSuccessModal, successMessage
  } = useSkillsManager();

  return (
    <div className="min-h-screen bg-[#F7F0E1] flex flex-col">
      <Header />
      <div className="flex flex-col lg:flex-row flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-2xl mx-auto bg-white rounded-[2rem] p-8 shadow-sm border border-[#6dacbf]/20">
            <h1 className="text-3xl font-bold text-[#003A6C] mb-2">Añadir Habilidad</h1>
            <p className="text-[#4982AD] mb-8">Completa la información para registrar una nueva competencia.</p>

            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
              <div>
                <label className="block text-[#003A6C] font-semibold mb-2">Tipo de habilidad *</label>
                <select 
                  value={skillType} 
                  onChange={(e) => setSkillType(e.target.value as any)}
                  className="w-full p-3.5 rounded-xl border border-[#0E7D96]/20 bg-[#F8FAFC] text-[#003A6C] outline-none focus:ring-2 focus:ring-[#0E7D96]/30"
                >
                  <option value="tecnica">Habilidad técnica</option>
                  <option value="blanda">Habilidad blanda</option>
                </select>
              </div>

              <div>
                <label className="block text-[#003A6C] font-semibold mb-2">Nombre de la habilidad *</label>
                <input 
                  type="text"
                  value={skillName}
                  onChange={(e) => handleSkillNameChange(e.target.value)}
                  placeholder="Ej: React, Liderazgo..."
                  className={`w-full p-3.5 rounded-xl border bg-white outline-none focus:ring-2 ${errorMessage ? 'border-red-400 focus:ring-red-100' : 'border-[#0E7D96]/20 focus:ring-[#0E7D96]/30'}`}
                />
                {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
              </div>

              {skillType === 'tecnica' && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  <label className="block text-[#003A6C] font-semibold mb-2">Nivel de dominio</label>
                  <select 
                    value={skillLevel}
                    onChange={(e) => setSkillLevel(e.target.value)}
                    className="w-full p-3.5 rounded-xl border border-[#0E7D96]/20 bg-[#F8FAFC] text-[#003A6C]"
                  >
                    <option value="basico">Básico</option>
                    <option value="intermedio">Intermedio</option>
                    <option value="avanzado">Avanzado</option>
                    <option value="experto">Experto</option>
                  </select>
                </div>
              )}

              <div className="flex gap-4 pt-6">
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="flex-1 bg-[#003A6C] text-white py-4 rounded-xl font-bold hover:bg-[#002a50] transition-all disabled:opacity-50"
                >
                  {isSaving ? 'Guardando...' : 'Guardar Habilidad'}
                </button>
                <button type="button" className="flex-1 bg-[#C2DBED] text-[#003A6C] py-4 rounded-xl font-bold border border-[#6dacbf]/30">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
      <ConfirmationModal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)} 
        title="¡Éxito!" 
        message={successMessage} 
      />
      <Footer />
    </div>
  );
};

export default AddSkillsPage;