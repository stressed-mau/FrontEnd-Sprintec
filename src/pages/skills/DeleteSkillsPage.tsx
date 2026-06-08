import { Code2, Lightbulb, Trash2 } from 'lucide-react';
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
import DeleteConfirmationModal from '../../components/modals/DeleteConfirmationModal';

const DeleteSkillsPage = () => {
  const {
    filteredSkills, toggleSelectAll, isLoading, pageError, searchQuery, setSearchQuery, selectedSkillIds,toggleSelectSkill,
    showConfirmDelete, setShowConfirmDelete, confirmDeleteSelected,  cancelDelete, isDeleting,
    showSuccessModal, closeSuccessModal, successMessage,
  } = useSkillsManager();
  const pagination = usePagination({ items: filteredSkills, itemsPerPage: 5 });

  const selectedCount = selectedSkillIds.size;
  const visibleIds = pagination.items.map((skill) => skill.id);
  const allVisibleSelected = pagination.items.length > 0 && pagination.items.every((skill) => selectedSkillIds.has(skill.id));

  return (
    <div className="min-h-screen bg-[#F7F0E1] flex flex-col">
      <Header />
      <div className="flex flex-col lg:flex-row flex-1">
        <Sidebar />
        <main className="flex-1 px-4 py-6 md:px-8 lg:px-10">
          <div className="mx-auto max-w-6xl space-y-6">
            <SectionHeader
              title="Eliminar Habilidades"
              description={selectedCount > 0
                ? `${selectedCount} habilidad${selectedCount > 1 ? 'es' : ''} seleccionada${selectedCount > 1 ? 's' : ''}`
                : 'Selecciona una habilidad para eliminar'}
              actions={selectedCount > 0 ? (
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowConfirmDelete(true)}
                    disabled={isDeleting}
                    className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 font-bold text-white shadow-sm transition-all hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Trash2 className="size-4" />
                    Eliminar ({selectedCount})
                  </button>
                </div>
              ) : undefined}
            />

            {pageError && (
              <div className="mb-6 rounded-2xl border-2 border-red-400 bg-red-100 px-4 py-2 text-sm text-red-900 font-semibold shadow-md">
                <p className="font-bold mb-1">Error:</p>
                <p>{pageError}</p>
              </div>
            )}

            <div className="relative mb-6">
              <SkillsSearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Buscar por nombre o nivel..."
              />
            </div>

            {isLoading ? (
              <SkillsLoading />
            ) : filteredSkills.length === 0 ? (
              <SkillsEmptyState
                searchQuery={searchQuery}
                emptyMessage="No hay habilidades registradas"
                searchMessage="No hay habilidades que coincidan con la búsqueda"
              />
            ) : (              
              <>
                <Card className="rounded-2xl border border-[#A5D7E8] bg-white py-0 shadow-sm">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-full border-collapse">
                        <thead className="bg-[#EEF5F9] text-left text-xs uppercase text-[#003A6C]">
                          <tr>
                            <th className="w-12 px-4 py-2">
                              <input
                                type="checkbox"
                                checked={allVisibleSelected}
                                onChange={() => toggleSelectAll(visibleIds)}
                                className="size-4 rounded-none border-[#A5D7E8]"
                                aria-label="Seleccionar todas las habilidades visibles"
                              />
                            </th>
                            <th className="px-4 py-3 font-semibold">Habilidad</th>
                            <th className="px-4 py-3 font-semibold">Tipo</th>
                            <th className="px-4 py-3 font-semibold">Nivel</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#D9EAF4]">
                          {pagination.items.map((skill) => {
                            const isSelected = selectedSkillIds.has(skill.id);
                            const isTechnical = skill.type === 'tecnica';
                            return (
                              <tr
                                key={skill.id}
                                onClick={() => toggleSelectSkill(skill.id)}
                                className={`cursor-pointer transition hover:bg-[#EEF5F9] ${isSelected ? 'bg-[#EEF5F9]' : ''}`}
                              >
                                <td className="px-4 py-2" onClick={(event) => event.stopPropagation()}>
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => toggleSelectSkill(skill.id)}
                                    className="size-4 rounded-none border-[#A5D7E8]"
                                    aria-label={`Seleccionar ${skill.name}`}
                                  />
                                </td>
                                <td className="px-4 py-2">
                                  <div className="flex items-center gap-3">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#D9EAF4] text-[#003A6C]">
                                      {isTechnical ? <Code2 className="size-5" /> : <Lightbulb className="size-5" />}
                                    </div>
                                    <div>
                                      <p className="font-medium text-[#003A6C]">{skill.name}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-2 text-sm text-[#355468]">
                                  {isTechnical ? 'Técnica' : 'Blanda'}
                                </td>
                                <td className="px-4 py-2 text-sm text-[#355468]">
                                  <SkillLevelBadge level={skill.level} />
                                </td>
                              </tr>
                            );
                          })}
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
                  totalItems={filteredSkills.length}
                  onPageChange={pagination.goToPage}
                />
              </>
            )}
          </div>
        </main>
      </div>

    <DeleteConfirmationModal
        isOpen={showConfirmDelete}
        title={ selectedCount > 1
               ? '¿Está seguro de que desea eliminar estas habilidades?'
               : '¿Está seguro de que desea eliminar esta habilidad?'  }
        message="Esta acción no se puede deshacer."
        isLoading={isDeleting}
        onConfirm={() => void confirmDeleteSelected()}
        onCancel={cancelDelete}/>

      <ConfirmationModal
        isOpen={showSuccessModal}
        title="Éxito"
        message={successMessage || 'Habilidad eliminada correctamente.'}
        onClose={closeSuccessModal}      />

      <Footer />
    </div>
  );
};

export default DeleteSkillsPage;
