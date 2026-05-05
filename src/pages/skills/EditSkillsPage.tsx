import Header from '../../components/HeaderUser';
import Sidebar from '../../components/Sidebar';
import { Footer } from '@/components/Footer';
import { Code2, Lightbulb, Search, X } from 'lucide-react';
import { useSkillsManager } from '@/hooks/useSkillsManager';
import ConfirmationModal from '../../components/ConfirmationModal';
import ConfirmActionModal from '../../components/ConfirmActionModal';

const LEVEL_LABELS: Record<string, string> = {
  experto: 'Experto',
  avanzado: 'Avanzado',
  intermedio: 'Intermedio',
  basico: 'Básico',
};

const LEVEL_COLORS: Record<string, string> = {
  experto: 'bg-purple-100 text-purple-700',
  avanzado: 'bg-pink-100 text-pink-600',
  intermedio: 'bg-blue-100 text-blue-600',
  basico: 'bg-gray-100 text-gray-600',
};

const EditSkillsPage = () => {
  const {
    filteredTechnicalSkills, filteredSoftSkills, isLoading, pageError, searchQuery, setSearchQuery, openModal,
    isModalOpen, closeModal, editingSkill, skillName, handleSkillNameChange, skillLevel, setSkillLevel, handleSave,
    isSaving, errorMessage, showConfirmEdit, setShowConfirmEdit, showSuccessModal, closeSuccessModal, successMessage,
  } = useSkillsManager();

  const hasNameError = Boolean(errorMessage);
  const isTechnical = editingSkill?.type === 'tecnica';

  return (
    <div className="min-h-screen bg-[#F7F0E1] flex flex-col">
      <Header />
      <div className="flex flex-col lg:flex-row flex-1">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 md:p-10">
          <div className="mx-auto max-w-6xl space-y-6">
           
              <h1 className="mb-1 text-2xl font-semibold text-gray-900">  Editar Habilidades </h1>
              <p className="text-sm text-[#4B778D] md:text-base"> Haz clic en una fila para editar </p>

            {pageError && (
              <div className="mb-6 rounded-2xl border-2 border-red-400 bg-red-100 px-4 py-4 text-sm text-red-900 font-semibold shadow-md">
                <p className="font-bold mb-1">Error:</p>
                <p>{pageError}</p>
              </div>
            )}

            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#4B778D]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre o nivel..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#0E7D96]/20 bg-white text-[#003A6C] placeholder:text-[#4B778D]/60 outline-none focus:ring-2 focus:ring-[#0E7D96]/30 shadow-sm"
              />
            </div>

            {/* Sección Técnicas */}
            <section className="mb-10">
              <div className="flex items-center gap-2 mb-4 text-[#003A6C]">
                <Code2 className="size-5" />
                <h2 className="text-xl sm:text-2xl">Habilidades Técnicas</h2>
              </div> 

              {isLoading ? (
                <div className="rounded-2xl border border-[#6dacbf]/30 bg-white py-10 text-center shadow-sm">
                  <p className="text-sm text-[#4B778D]">Cargando habilidades...</p>
                </div>
              ) : filteredTechnicalSkills.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-[#6dacbf] bg-[#F7F0E1] py-14 text-center shadow-sm">
                  <p className="text-sm text-[#4B778D]">
                    {searchQuery
                      ? 'No hay habilidades técnicas que coincidan con la búsqueda'
                      : 'No hay habilidades técnicas registradas'}
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-[#6dacbf]/30 bg-white shadow-sm overflow-hidden">
                  {/* Cabecera */}
                  <div className="grid grid-cols-3 px-5 py-3 border-b border-[#6dacbf]/20">
                    <span className="text-xs font-bold text-[#4B778D] uppercase tracking-wider">Habilidad</span>
                    <span className="text-xs font-bold text-[#4B778D] uppercase tracking-wider">Tipo</span>
                    <span className="text-xs font-bold text-[#4B778D] uppercase tracking-wider">Nivel</span>
                  </div>
                  {/* Filas */}
                  {filteredTechnicalSkills.map((skill, idx) => (
                    <div
                      key={skill.id}
                      onClick={() => openModal(skill)}
                      className={`grid grid-cols-3 px-5 py-4 items-center cursor-pointer transition-colors hover:bg-[#EEF6FC] ${
                        idx !== filteredTechnicalSkills.length - 1 ? 'border-b border-[#6dacbf]/10' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Code2 className="size-4 text-[#4B778D]" />
                        <span className="font-semibold text-[#003A6C]">{skill.name}</span>
                      </div>
                      <span className="text-[#4B778D] text-sm">Técnica</span>
                      {skill.level ? (
                        <span
                          className={`inline-flex w-fit px-3 py-1 rounded-full text-xs font-medium ${
                            LEVEL_COLORS[skill.level.toLowerCase()] ?? 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {LEVEL_LABELS[skill.level.toLowerCase()] ?? skill.level}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Sección Blandas */}
            <section>
              <div className="flex items-center gap-2 mb-4 text-[#003A6C]">
                <Lightbulb className="size-5" />
                <h2 className="text-xl sm:text-2xl">Habilidades Blandas</h2>
              </div>

              {isLoading ? (
                <div className="rounded-2xl border border-[#6dacbf]/30 bg-white py-10 text-center shadow-sm">
                  <p className="text-sm text-[#4B778D]">Cargando habilidades...</p>
                </div>
              ) : filteredSoftSkills.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-[#6dacbf] bg-[#F7F0E1] py-14 text-center shadow-sm">
                  <p className="text-sm text-[#4B778D]">
                    {searchQuery
                      ? 'No hay habilidades blandas que coincidan con la búsqueda'
                      : 'No hay habilidades blandas registradas'}
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-[#6dacbf]/30 bg-white shadow-sm overflow-hidden">
                  {/* Cabecera */}
                  <div className="grid grid-cols-3 px-5 py-3 border-b border-[#6dacbf]/20">
                    <span className="text-xs font-bold text-[#4B778D] uppercase tracking-wider">Habilidad</span>
                    <span className="text-xs font-bold text-[#4B778D] uppercase tracking-wider">Tipo</span>
                    <span className="text-xs font-bold text-[#4B778D] uppercase tracking-wider">Nivel</span>
                  </div>
                  {/* Filas */}
                  {filteredSoftSkills.map((skill, idx) => (
                    <div
                      key={skill.id}
                      onClick={() => openModal(skill)}
                      className={`grid grid-cols-3 px-5 py-4 items-center cursor-pointer transition-colors hover:bg-[#EEF6FC] ${
                        idx !== filteredSoftSkills.length - 1 ? 'border-b border-[#6dacbf]/10' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Lightbulb className="size-4 text-[#4B778D]" />
                        <span className="font-semibold text-[#003A6C]">{skill.name}</span>
                      </div>
                      <span className="text-[#4B778D] text-sm">Blanda</span>
                      <span className="text-gray-400 text-sm">—</span>
                    </div>
                  ))}
                </div>
              )}
            </section>

          </div>
        </main>
      </div>

      {/* Modal de Edición*/}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 px-3 backdrop-blur-[2px] sm:items-center sm:px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-white/20 bg-[#D9EAF8] shadow-xl animate-in zoom-in-95 duration-200 sm:rounded-[2rem]">
            <div className="px-8 pt-8 pb-2 flex justify-between items-start">
              <div>
                <h2 className="text-[#003A6C] text-2xl font-bold">
                  {isTechnical ? 'Editar Habilidad Técnica' : 'Editar Habilidad Blanda'}
                </h2>
                <p className="text-[#4982AD] text-sm">Actualiza la habilidad seleccionada</p>
              </div>
              <button
                onClick={closeModal}
                className="text-[#003A6C] hover:bg-white/30 p-1 rounded-full"
                aria-label="Cerrar modal"
              >
                <X className="size-6" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                void handleSave(e as any);
              }}
              className="p-8 pt-4 space-y-5" >
              <div>
                <label className="block text-[#003A6C] font-semibold text-sm mb-1.5">
                  Nombre de la habilidad *
                </label>
                <input
                  type="text"
                  value={skillName}
                  onChange={(e) => handleSkillNameChange(e.target.value)}
                  maxLength={40}
                  disabled={isTechnical}
                  aria-invalid={hasNameError}
                  aria-describedby={hasNameError ? 'edit-skill-name-error' : undefined}
                  placeholder={isTechnical ? '' : 'Ej: Trabajo en equipo'}
                  className={`w-full py-2.5 px-4 rounded-xl text-[#003A6C] outline-none ${
                    isTechnical
                      ? 'bg-gray-100 border border-gray-200 cursor-not-allowed text-gray-500'
                      : hasNameError
                      ? 'bg-white border border-red-400 focus:ring-2 focus:ring-red-200 placeholder:text-[#0E7D96]/40'
                      : 'bg-white border border-[#0E7D96]/20 focus:ring-2 focus:ring-[#0E7D96]/40 placeholder:text-[#0E7D96]/40'
                  }`}
                />
                {errorMessage && (
                  <p
                    id="edit-skill-name-error"
                    className="mt-1.5 text-sm font-medium text-red-600"
                  >
                    {errorMessage}
                  </p>
                )}
              </div>

              {isTechnical && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  <label className="block text-[#003A6C] font-semibold text-sm mb-1.5">
                    Nivel de dominio *
                  </label>
                  <select
                    value={skillLevel}
                    onChange={(e) => setSkillLevel(e.target.value)}
                    className="w-full py-2.5 px-4 border border-[#0E7D96]/20 rounded-xl bg-white text-[#003A6C] focus:ring-2 focus:ring-[#0E7D96]/40 outline-none"
                  >
                    <option value="basico">Básico</option>
                    <option value="intermedio">Intermedio</option>
                    <option value="avanzado">Avanzado</option>
                    <option value="experto">Experto</option>
                  </select>
                </div>
              )}

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-[#003A6C] text-white py-3 rounded-xl font-bold hover:bg-[#002a50] transition-all disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? 'Guardando...' : 'Guardar'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-[#C2DBED] text-[#003A6C] py-3 rounded-xl font-bold border border-[#6dacbf] hover:bg-[#b0cfeb]"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmActionModal
              isOpen={showConfirmEdit}
              title="Confirmar cambios"
              message="¿Estás seguro de que deseas guardar los cambios realizados?"
              confirmText={isSaving ? 'Guardando...' : 'Guardar'}
              cancelText="Cancelar"
              onConfirm={() => void handleSave()}
              onCancel={() => setShowConfirmEdit(false)}/>

      <ConfirmationModal
        isOpen={showSuccessModal}
        title="Éxito"
        message={successMessage || 'La habilidad se ha actualizado correctamente.'}
        onClose={closeSuccessModal} />

      <Footer />
    </div>
  );
};

export default EditSkillsPage;