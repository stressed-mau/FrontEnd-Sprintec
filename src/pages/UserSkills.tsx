import Header from '../components/HeaderUser';
import Sidebar from '../components/Sidebar';
import { Plus, Code2, Lightbulb, X, Edit3, Trash2, Check} from 'lucide-react';
import { useSkillsManager, type Skill } from '../hooks/useSkillsManager';

const LEVEL_LABELS: Record<string, string> = {
  experto: 'Experto',  
  avanzado: 'Avanzado',
  intermedio: 'Intermedio',
   basico: 'Basico',
};

function getLevelLabel(level: string): string {
  return LEVEL_LABELS[level] ?? level;
}

const UserSkills = () => {
  const {    isModalOpen, technicalSkills, softSkills, editingSkill, skillType, skillName, skillLevel, errorMessage,showSuccessModal, pageError, isLoading, isSaving, isDeleting,
            showConfirmEdit, showConfirmDelete, skillToDelete, setShowSuccessModal, setShowConfirmEdit,setSkillType, setSkillLevel, openModal,  closeModal, handleSave, requestDelete, cancelDelete, confirmDelete, handleSkillNameChange, } = useSkillsManager();
  const hasNameError = Boolean(errorMessage);

  return (
    <div className="min-h-screen bg-[#F7F0E1]">
      <Header />
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 md:p-10">
          <div className="max-w-5xl mx-auto">
            {pageError && (
              <div className="mb-6 rounded-2xl border-2 border-red-400 bg-red-100 px-4 py-4 text-sm text-red-900 font-semibold shadow-md">
                <p className="font-bold mb-1">Error cargando habilidades:</p>
                <p>{pageError}</p>
              </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h1 id="titulo-pagina-habilidades" className="mb-2 text-3xl font-bold text-[#003A6C] md:text-4xl">Mis Habilidades</h1>
                <p id="descripcion-pagina-habilidad"  className="text-sm text-[#4B778D] md:text-base">Gestiona tus habilidades técnicas y blandas</p>
              </div>
              <button onClick={() => openModal()} className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#003A6C] px-5 py-2 font-semibold text-white shadow-sm transition-all hover:bg-[#002a50] sm:w-auto">
                <Plus className="size-5" /> Agregar habilidad
              </button>
            </div>

            <section className="mb-8 space-y-4 sm:mb-10">
              <div className="flex items-center gap-2 mb-4 text-[#003A6C]">
                <Code2 className="size-5" />
                <h2 className="text-xl font-bold sm:text-2xl">Habilidades Técnicas</h2>
              </div>
              <div className="space-y-3">
                {isLoading ? (
                  <div className="rounded-3xl border border-[#6dacbf]/30 bg-white py-0 shadow-sm">
                    <div className="px-6 py-8 text-center sm:py-10">
                      <p className="text-sm text-[#4B778D] sm:text-base">Cargando habilidades...</p>
                    </div>
                  </div>
                ) : technicalSkills.length === 0 ? (
                  <div className="rounded-3xl border-2 border-dashed border-[#6dacbf] bg-white py-0 shadow-sm">
                    <div className="px-6 py-12 text-center sm:py-14">
                      <p className="text-sm text-[#4B778D] sm:text-base">No hay habilidades técnicas registradas</p>
                    </div>
                  </div>
                ) : (  technicalSkills.map(skill => (
                    <SkillCard key={skill.id} skill={skill} disabled={isLoading || isSaving || isDeleting} onEdit={() => openModal(skill)} onDelete={() => requestDelete(skill)} />
                  ))
                )}
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-4 text-[#003A6C]">
                <Lightbulb className="size-5" /> <h2 className="text-xl font-bold sm:text-2xl">Habilidades Blandas</h2> </div>
              <div className="space-y-3">
                {isLoading ? (
                  <div className="rounded-3xl border border-[#6dacbf]/30 bg-white py-0 shadow-sm">
                    <div className="px-6 py-8 text-center sm:py-10"> <p className="text-sm text-[#4B778D] sm:text-base">Cargando habilidades...</p>  </div>
                  </div>
                ) : softSkills.length === 0 ? (
                  <div className="rounded-3xl border-2 border-dashed border-[#6dacbf] bg-white py-0 shadow-sm">
                    <div className="px-6 py-12 text-center sm:py-14">
                      <p className="text-sm text-[#4B778D] sm:text-base">No hay habilidades blandas registradas</p>
                    </div>
                  </div>
                ) : ( softSkills.map(skill => (
                    <SkillCard key={skill.id} skill={skill} disabled={isLoading || isSaving || isDeleting} onEdit={() => openModal(skill)} onDelete={() => requestDelete(skill)} />
                  ))
                )}
              </div>
            </section>
          </div>
        </main>
      </div>

      {isModalOpen && ( <div className="fixed inset-0 z-100 flex items-end justify-center bg-black/30 px-3 backdrop-blur-[2px] sm:items-center sm:px-4">
          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-white/20 bg-[#D9EAF8] shadow-xl animate-in zoom-in-95 duration-200 sm:rounded-[2rem]">
            <div className="px-8 pt-8 pb-2 flex justify-between items-start">
              <div>
                <h2 className="text-[#003A6C] text-2xl font-bold">{editingSkill ? 'Editar habilidad' : 'Nueva habilidad'}</h2>
                <p className="text-[#4982AD] text-sm">{editingSkill ? 'Actualiza la habilidad seleccionada' : 'Agrega una habilidad a tu portafolio'}</p>
              </div>
              <button onClick={closeModal} className="text-[#003A6C] hover:bg-white/30 p-1 rounded-full"><X className="size-6" /></button>
            </div>

            <form onSubmit={handleSave} className="p-8 pt-4 space-y-5">
              <div>
                <label className="block text-[#003A6C] font-semibold text-sm mb-1.5">Tipo de habilidad *</label>
                <select 
                  value={skillType} 
                  onChange={(e) => setSkillType(e.target.value as any)}
                  className="w-full py-2.5 px-4 border border-[#0E7D96]/20 rounded-xl bg-white text-[#003A6C] focus:ring-2 focus:ring-[#0E7D96]/40 outline-none"
                >
                  <option value="tecnica">Habilidad técnica</option>
                  <option value="blanda">Habilidad blanda</option>
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
                  maxLength={40}
                  aria-invalid={hasNameError}
                  aria-describedby={hasNameError ? 'skill-name-error' : undefined}
                  placeholder={skillType === 'tecnica' ? 'Ej: React, Python' : 'Ej: Trabajo en equipo'}
                  className={`w-full py-2.5 px-4 rounded-xl bg-white text-[#003A6C] outline-none placeholder:text-[#0E7D96]/40 focus:ring-2 ${hasNameError ? 'border border-red-400 focus:ring-red-200' : 'border border-[#0E7D96]/20 focus:ring-[#0E7D96]/40'}`}
                />
                {errorMessage && (
                  <p id="skill-name-error" className="mt-1.5 text-sm font-medium text-red-600">
                    {errorMessage}
                  </p>
                )}
              </div>

              {skillType === "tecnica" && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  <label className="block text-[#003A6C] font-semibold text-sm mb-1.5">Nivel de dominio</label>
                  <select 
                    value={skillLevel}
                    onChange={(e) => setSkillLevel(e.target.value)}
                    className="w-full py-2.5 px-4 border border-[#0E7D96]/20 rounded-xl bg-white text-[#003A6C] focus:ring-2 focus:ring-[#0E7D96]/40 outline-none"
                  >
                    <option value="basico">Basico</option>
                    <option value="intermedio">Intermedio</option>
                    <option value="avanzado">Avanzado</option>
                    <option value="experto">Experto</option>

                  </select>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={isSaving} className="flex-1 bg-[#003A6C] text-white py-3 rounded-xl font-bold hover:bg-[#002a50] transition-all disabled:cursor-not-allowed disabled:opacity-60">
                  {isSaving ? 'Guardando...' : 'Guardar'}
                </button>
                <button type="button" onClick={closeModal} className="flex-1 bg-[#C2DBED] text-[#003A6C] py-3 rounded-xl font-bold border border-[#6dacbf] hover:bg-[#b0cfeb]">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
{showConfirmEdit && (
        <div className="fixed inset-0 z-120 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl text-center">
            <h3 className="text-lg font-bold text-[#003A6C] mb-4">¿Estás seguro que desea guardar los cambios realizados?</h3>
            <div className="flex gap-3">
              <button onClick={() => handleSave()} className="flex-1 bg-[#003A6C] text-white py-2 rounded-lg font-semibold hover:bg-[#002a50]">Confirmar</button>
              <button onClick={() => setShowConfirmEdit(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300">Cancelar</button>
            </div>
          </div>
        </div>
      )}
      {showConfirmDelete && (
        <div className="fixed inset-0 z-120 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl text-center">
            <h3 className="text-lg font-bold text-[#003A6C] mb-2">¿Deseas eliminar esta habilidad?</h3>
            <p className="text-sm text-gray-600 mb-4">
              {skillToDelete ? `Se eliminará "${skillToDelete.name}" de forma permanente.` : 'Esta acción no se puede deshacer.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => void confirmDelete()}
                disabled={isDeleting}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Eliminando...' : 'Eliminar'}
              </button>
              <button
                onClick={cancelDelete}
                disabled={isDeleting}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      {showSuccessModal && (
  <div className="fixed inset-0 z-150 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
    <div className="bg-white w-full max-w-100 rounded-[32px] shadow-2xl p-8 relative animate-in zoom-in-95 duration-200">
      <button 
        onClick={() => setShowSuccessModal(false)}  className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors" >
        <X className="size-6" />
      </button>
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-[#E1EFFE] rounded-full flex items-center justify-center mb-6">
          <Check className="size-8 text-[#003A6C] stroke-[3px]" />
        </div>
        <h3 className="text-[#003A6C] text-2xl font-bold mb-2">Éxito</h3>
        <p className="text-[#6B7280] text-center text-lg mb-8">
          {editingSkill ? "Habilidad actualizada correctamente." : "Habilidad registrada correctamente."}
        </p>
        <button 
          onClick={() => setShowSuccessModal(false)}
          className="w-full bg-[#003A6C] text-white py-4 rounded-xl font-bold text-xl hover:bg-[#002a50] transition-all shadow-lg active:scale-[0.98]"> Continuar
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

// COMPONENTE PARA CADA TARJETA DE HABILIDAD
const SkillCard = ({ skill, onEdit, onDelete, disabled }: { skill: Skill, onEdit: () => void, onDelete: () => void, disabled?: boolean }) => (
  <div className="flex flex-col gap-4 rounded-2xl border border-[#0E7D96]/30 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
    <div className="flex min-w-0 flex-wrap items-center gap-3 sm:gap-4">
      <span className="wrap-break-words text-lg font-bold text-[#003A6C]">{skill.name}</span>
      {skill.level && (
        <span className="bg-[#F1F5F9] text-gray-500 text-xs px-3 py-1 rounded-full border border-gray-100 font-medium">
          {getLevelLabel(skill.level)}
        </span>
      )}
    </div>
    <div className="flex w-full gap-2 sm:w-auto">
      <button type="button" disabled={disabled} onClick={onEdit} className="flex-1 rounded-lg border border-[#6dacbf]/30 bg-[#C2DBED]/50 p-2 text-[#003A6C] transition-colors hover:bg-[#C2DBED] disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none">
        <Edit3 className="size-4" />
      </button>
      <button type="button" disabled={disabled} onClick={onDelete} className="flex-1 rounded-lg border border-red-200 bg-red-50 p-2 text-red-500 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none">
        <Trash2 className="size-4" />
      </button>
    </div>
  </div>
);

export default UserSkills;