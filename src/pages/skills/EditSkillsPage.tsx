import { Code2, X } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { ExperiencePagination } from '@/components/experience/ExperiencePagination';
import { SectionHeader } from '@/components/sections/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { useSkillsManager } from '@/hooks/skills/useSkillsManager';
import { usePagination } from '@/hooks/usePagination';
import SkillsSearchBar from '@/components/skills/skillsSearchBar';
import SkillsLoading from '@/components/skills/SkillsLoading';
import SkillsEmptyState from '@/components/skills/SkillsEmptyState';
import SkillLevelBadge from '@/components/skills/SkillLevelBadge';
import Header from '../../components/HeaderUser';
import Sidebar from '../../components/Sidebar';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import ConfirmActionModal from '../../components/modals/ConfirmActionModal';

const EditSkillsPage = () => {
  const {
    filteredTechnicalSkills, isLoading, pageError, searchQuery, setSearchQuery, openModal,
    isModalOpen, closeModal, editingSkill, skillName, handleSkillNameChange, skillLevel, setSkillLevel, handleSave,
    isSaving, canSaveSkill, errorMessage, showConfirmEdit, setShowConfirmEdit, showSuccessModal, closeSuccessModal, successMessage,
  } = useSkillsManager();
  const pagination = usePagination({ items: filteredTechnicalSkills, itemsPerPage: 5 });

  const hasNameError = Boolean(errorMessage);
  const isTechnical = editingSkill?.type === 'tecnica';

  return (
    <div className="min-h-screen bg-[#F7F0E1] flex flex-col">
      <Header />
      <div className="flex flex-col lg:flex-row flex-1">
        <Sidebar />
        <main className="flex-1 px-4 py-6 md:px-8 lg:px-10">
          <div className="mx-auto max-w-6xl space-y-6">
            <SectionHeader
              title="Editar Habilidades"
              description="Haz clic en una fila para editar"
            />

            {pageError && (
              <div className="mb-6 rounded-2xl border-2 border-red-400 bg-red-100 px-4 py-4 text-sm text-red-900 font-semibold shadow-md">
                <p className="font-bold mb-1">Error:</p>
                <p>{pageError}</p>
              </div>
            )}

            <div className="relative mb-8">
             <SkillsSearchBar
                 value={searchQuery}
                 onChange={setSearchQuery}
                 placeholder="Buscar por nombre o nivel..."/> </div>

            <section className="space-y-4">
              <div className="flex items-center gap-2 text-[#003A6C]">
                <Code2 className="size-5" />
                <h2 className="text-xl sm:text-2xl">Habilidades Técnicas</h2>
              </div>

              {isLoading ? (
                <SkillsLoading />
              ) : filteredTechnicalSkills.length === 0 ? (
                <SkillsEmptyState
                  searchQuery={searchQuery}
                  emptyMessage="No hay habilidades técnicas registradas"
                  searchMessage="No hay habilidades técnicas que coincidan con la búsqueda"
                />
              ) : (
                <>
                  <Card className="rounded-2xl border border-[#A5D7E8] bg-white py-0 shadow-sm">
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-full border-collapse">
                          <thead className="bg-[#EEF5F9] text-left text-xs uppercase text-[#003A6C]">
                            <tr>
                              <th className="px-4 py-3 font-semibold">Habilidad</th>
                              <th className="px-4 py-3 font-semibold">Tipo</th>
                              <th className="px-4 py-3 font-semibold">Nivel</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#D9EAF4]">
                            {pagination.items.map((skill) => (
                              <tr
                                key={skill.id}
                                onClick={() => openModal(skill)}
                                className="cursor-pointer transition hover:bg-[#EEF5F9]"
                              >
                                <td className="px-4 py-2">
                                  <div className="flex items-center gap-3">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#D9EAF4] text-[#003A6C]">
                                      <Code2 className="size-5" />
                                    </div>
                                    <div>
                                      <p className="font-medium text-[#003A6C]">{skill.name}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-2 text-sm text-[#355468]">Técnica</td>
                                <td className="px-4 py-2 text-sm text-[#355468]">
                                  <SkillLevelBadge level={skill.level} />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>

                  <ExperiencePagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    startIndex={pagination.startIndex}
                    endIndex={pagination.endIndex}
                    totalItems={filteredTechnicalSkills.length}
                    onPageChange={pagination.goToPage}
                  />
                </>
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

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isSaving || !canSaveSkill}
                  className="flex-1 bg-[#003A6C] text-white py-3 rounded-xl font-bold hover:bg-[#002a50] transition-all disabled:cursor-not-allowed disabled:opacity-60" >
                  {isSaving ? 'Guardando...' : 'Guardar'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-[#C2DBED] text-[#003A6C] py-3 rounded-xl font-bold border border-[#6dacbf] hover:bg-[#b0cfeb]"      >
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