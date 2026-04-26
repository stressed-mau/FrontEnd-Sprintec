import Header from '../../components/HeaderUser';
import Sidebar from '../../components/Sidebar';
import { Footer } from '@/components/Footer';
import { Edit3, X } from 'lucide-react';
import { useSkillsManager } from '../../hooks/useSkillsManager';
import ConfirmationModal from '../../components/ConfirmationModal';

const EditSkillsPage = () => {
  const { 
    technicalSkills, softSkills, openModal, isModalOpen, closeModal, skillType,  skillName, handleSkillNameChange,
    skillLevel, setSkillLevel, handleSave, 
    showConfirmEdit, setShowConfirmEdit, showSuccessModal, setShowSuccessModal, successMessage
  } = useSkillsManager();

  return (
    <div className="min-h-screen bg-[#F7F0E1] flex flex-col">
      <Header />
      <div className="flex flex-col lg:flex-row flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-[#003A6C] mb-8">Editar Habilidades</h1>
            
            <div className="space-y-8">
              {/* Sección Técnicas */}
              <div>
                <h2 className="text-xl font-bold text-[#003A6C] mb-4">Habilidades Técnicas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {technicalSkills.map(skill => (
                    <div key={skill.id} className="bg-white p-4 rounded-2xl border border-[#6dacbf]/30 flex justify-between items-center shadow-sm hover:border-[#003A6C] transition-colors">
                      <span className="font-bold text-[#003A6C]">{skill.name}</span>
                      <button onClick={() => openModal(skill)} className="p-2 bg-[#C2DBED]/50 text-[#003A6C] rounded-lg hover:bg-[#C2DBED]">
                        <Edit3 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sección Blandas */}
              <div>
                <h2 className="text-xl font-bold text-[#003A6C] mb-4">Habilidades Blandas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {softSkills.map(skill => (
                    <div key={skill.id} className="bg-white p-4 rounded-2xl border border-[#6dacbf]/30 flex justify-between items-center shadow-sm hover:border-[#003A6C] transition-colors">
                      <span className="font-bold text-[#003A6C]">{skill.name}</span>
                      <button onClick={() => openModal(skill)} className="p-2 bg-[#C2DBED]/50 text-[#003A6C] rounded-lg hover:bg-[#C2DBED]">
                        <Edit3 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal de Edición (Reutilizando tu lógica) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-[#D9EAF8] w-full max-w-lg rounded-[2rem] p-8 shadow-2xl relative">
            <button onClick={closeModal} className="absolute right-6 top-6 text-[#003A6C]"><X /></button>
            <h2 className="text-2xl font-bold text-[#003A6C] mb-6">Editar Habilidad</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
              <input 
                type="text" 
                value={skillName} 
                onChange={(e) => handleSkillNameChange(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#0E7D96]/20 outline-none"
              />
              {skillType === 'tecnica' && (
                <select value={skillLevel} onChange={(e) => setSkillLevel(e.target.value)} className="w-full p-3 rounded-xl border border-[#0E7D96]/20">
                  <option value="basico">Basico</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="avanzado">Avanzado</option>
                  <option value="experto">Experto</option>
                </select>
              )}
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-[#003A6C] text-white py-3 rounded-xl font-bold">Actualizar</button>
                <button type="button" onClick={closeModal} className="flex-1 bg-white text-[#003A6C] py-3 rounded-xl font-bold border border-[#0E7D96]/20">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmación de guardado */}
      {showConfirmEdit && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl max-w-sm w-full text-center">
            <h3 className="font-bold text-[#003A6C] mb-4">¿Confirmas los cambios?</h3>
            <div className="flex gap-2">
              <button onClick={() => handleSave()} className="flex-1 bg-[#003A6C] text-white py-2 rounded-lg">Sí, guardar</button>
              <button onClick={() => setShowConfirmEdit(false)} className="flex-1 bg-gray-200 py-2 rounded-lg">No</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} title="Éxito" message={successMessage} />
      <Footer />
    </div>
  );
};

export default EditSkillsPage;