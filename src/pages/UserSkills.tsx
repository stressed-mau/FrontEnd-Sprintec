import Header from '../components/HeaderUser';
import Sidebar from '../components/Sidebar';
import { Plus, Code2, Lightbulb, X, Edit3, Trash2 } from 'lucide-react';
import { useSkillsManager, type Skill } from '../hooks/useSkillsManager';

const UserSkills = () => {
  const {    isModalOpen, skills, skillType, skillName, skillLevel, errorMessage, successMessage,showSuccessModal,
            setSkillType, setSkillLevel, openModal,  closeModal, handleSave, handleDelete, handleSkillNameChange, } = useSkillsManager();
  return (
    <div className="min-h-screen bg-[#F7F0E1]">
      <Header />
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 md:p-10">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h1 className="text-[#003A6C] text-3xl font-bold mb-1">Mis Habilidades</h1>
                <p className="text-[#6dacbf] text-sm md:text-base">Gestiona tus habilidades técnicas y blandas</p>
              </div>
              <button onClick={() => openModal()} className="flex items-center justify-center gap-2 bg-[#003A6C] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[#002a50] transition-all shadow-sm">
                <Plus className="size-5" /> Agregar habilidad
              </button>
            </div>

            <section className="mb-10">
              <div className="flex items-center gap-2 mb-4 text-[#003A6C]">
                <Code2 className="size-5" />
                <h2 className="text-xl font-bold">Habilidades Técnicas</h2>
              </div>
              <div className="space-y-3">
                {skills.filter(s => s.type === "Habilidad técnica").length === 0 ? (
                  <div className="border-2 border-dashed border-[#6dacbf]/50 rounded-2xl p-10 flex items-center justify-center bg-transparent">
                    <p className="text-gray-500 font-medium">No hay habilidades técnicas registradas</p>
                  </div>
                ) : (  skills.filter(s => s.type === "Habilidad técnica").map(skill => (
                    <SkillCard key={skill.id} skill={skill} onEdit={() => openModal(skill)} onDelete={() => handleDelete(skill.id)} />
                  ))
                )}
              </div>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4 text-[#003A6C]">
                <Lightbulb className="size-5" />
                <h2 className="text-xl font-bold">Habilidades Blandas</h2>
              </div>
              <div className="space-y-3">
                {skills.filter(s => s.type === "Habilidad blanda").length === 0 ? (
                  <div className="border-2 border-dashed border-[#6dacbf]/50 rounded-2xl p-10 flex items-center justify-center bg-transparent">
                    <p className="text-gray-500 font-medium">No hay habilidades blandas registradas</p>
                  </div>
                ) : ( skills.filter(s => s.type === "Habilidad blanda").map(skill => (
                    <SkillCard key={skill.id} skill={skill} onEdit={() => openModal(skill)} onDelete={() => handleDelete(skill.id)} />
                  ))
                )}
              </div>
            </section>
          </div>
        </main>
      </div>

      {isModalOpen && ( <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/30 backdrop-blur-[2px]">
          <div className="bg-[#D9EAF8] w-full max-w-lg rounded-[2rem] shadow-xl border border-white/20 animate-in zoom-in-95 duration-200">
            <div className="px-8 pt-8 pb-2 flex justify-between items-start">
              <div>
                <h2 className="text-[#003A6C] text-2xl font-bold">Nueva habilidad</h2>
                <p className="text-[#4982AD] text-sm">Agrega una habilidad a tu portafolio</p>
              </div>
              <button onClick={closeModal} className="text-[#003A6C] hover:bg-white/30 p-1 rounded-full"><X className="size-6" /></button>
            </div>

            <form onSubmit={handleSave} className="p-8 pt-4 space-y-5">
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <p className="text-red-700 text-sm font-medium">{errorMessage}</p>
                </div>
              )}
              
              <div>
                <label className="block text-[#003A6C] font-semibold text-sm mb-1.5">Tipo de habilidad</label>
                <select 
                  value={skillType} 
                  onChange={(e) => setSkillType(e.target.value as any)}
                  className="w-full py-2.5 px-4 border border-[#0E7D96]/20 rounded-xl bg-white text-[#003A6C] focus:ring-2 focus:ring-[#0E7D96]/40 outline-none"
                >
                  <option value="Habilidad técnica">Habilidad técnica</option>
                  <option value="Habilidad blanda">Habilidad blanda</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[#003A6C] font-semibold text-sm">Nombre de la habilidad *</label>
                </div>
                <input 
                  type="text" 
                  value={skillName}
                  onChange={(e) => handleSkillNameChange(e.target.value)}
                  placeholder="Ej: React, Python, Trabajo en equipo"
                  className="w-full py-2.5 px-4 border border-[#0E7D96]/20 rounded-xl bg-white text-[#003A6C] focus:ring-2 focus:ring-[#0E7D96]/40 outline-none placeholder:text-[#0E7D96]/40"
                />
              </div>

              {skillType === "Habilidad técnica" && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  <label className="block text-[#003A6C] font-semibold text-sm mb-1.5">Nivel de dominio</label>
                  <select 
                    value={skillLevel}
                    onChange={(e) => setSkillLevel(e.target.value)}
                    className="w-full py-2.5 px-4 border border-[#0E7D96]/20 rounded-xl bg-white text-[#003A6C] focus:ring-2 focus:ring-[#0E7D96]/40 outline-none"
                  >
                    <option value="Básico">Básico</option>
                    <option value="Intermedio" >Intermedio</option>
                    <option value="Avanzado">Avanzado</option>
                    <option value="Experto">Experto</option>
                  </select>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-[#003A6C] text-white py-3 rounded-xl font-bold hover:bg-[#002a50] transition-all">Guardar</button>
                <button type="button" onClick={closeModal} className="flex-1 bg-[#C2DBED] text-[#003A6C] py-3 rounded-xl font-bold border border-[#6dacbf] hover:bg-[#b0cfeb]">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4 bg-black/30 backdrop-blur-[2px]">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-8 text-center animate-in zoom-in-95 duration-200">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h3 className="text-[#003A6C] text-xl font-bold mb-2">¡Exito!</h3>
            <p className="text-gray-600 text-sm">{successMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// COMPONENTE PARA CADA TARJETA DE HABILIDAD (Como la última imagen)
const SkillCard = ({ skill, onEdit, onDelete }: { skill: Skill, onEdit: () => void, onDelete: () => void }) => (
  <div className="flex items-center justify-between bg-white border border-[#0E7D96]/30 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center gap-4">
      <span className="text-[#003A6C] font-bold text-lg">{skill.name}</span>
      {skill.level && (
        <span className="bg-[#F1F5F9] text-gray-500 text-xs px-3 py-1 rounded-full border border-gray-100 font-medium">
          {skill.level}
        </span>
      )}
    </div>
    <div className="flex gap-2">
      <button onClick={onEdit} className="p-2 text-[#003A6C] bg-[#C2DBED]/50 hover:bg-[#C2DBED] rounded-lg border border-[#6dacbf]/30 transition-colors">
        <Edit3 className="size-4" />
      </button>
      <button onClick={onDelete} className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors">
        <Trash2 className="size-4" />
      </button>
    </div>
  </div>
);

export default UserSkills;