import Header from '../../components/HeaderUser';
import Sidebar from '../../components/Sidebar';
import { Footer } from '@/components/Footer';
import { Code2, Lightbulb, Trash2 } from 'lucide-react';
import { useSkillsManager } from '@/hooks/skills/useSkillsManager';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import DeleteConfirmationModal from '../../components/modals/DeleteConfirmationModal';
import {LEVEL_LABELS,LEVEL_COLORS,} from '@/constants/skillConstants';
import SkillsSearchBar from '@/components/skills/skillsSearchBar';
import SkillsLoading from '@/components/skills/SkillsLoading';

const DeleteSkillsPage = () => {
  const {
    filteredSkills, toggleSelectAll, isLoading, pageError, searchQuery, setSearchQuery, selectedSkillIds,toggleSelectSkill,
    showConfirmDelete, setShowConfirmDelete, confirmDeleteSelected,  cancelDelete, isDeleting,
    showSuccessModal, closeSuccessModal, successMessage,
  } = useSkillsManager();

  const selectedCount = selectedSkillIds.size;

  return (
    <div className="min-h-screen bg-[#F7F0E1] flex flex-col">
      <Header />
      <div className="flex flex-col lg:flex-row flex-1">
        <Sidebar />
        <main className="flex-1 px-4 py-6 md:px-8 lg:px-10">
          <div className="mx-auto max-w-6xl space-y-6">

              <div>
                <h1 className="mb-2 text-3xl font-bold text-[#003A6C]">
                  Eliminar Habilidades
                </h1>
                <p className="text-sm text-[#4B778D] md:text-base">
                  {selectedCount > 0
                    ? `${selectedCount} habilidad${selectedCount > 1 ? 'es' : ''} seleccionada${selectedCount > 1 ? 's' : ''}`
                    : 'Selecciona una habilidad para eliminar'}
                </p>
             
              {selectedCount > 0 && (
                <div className="flex justify-end">
  <button
    onClick={() => setShowConfirmDelete(true)}
    disabled={isDeleting}
    className="flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-red-700 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"  >
    <Trash2 className="size-4" />
    Eliminar ({selectedCount})
  </button>
</div>

              )}
            </div>

            {pageError && (
              <div className="mb-6 rounded-2xl border-2 border-red-400 bg-red-100 px-4 py-4 text-sm text-red-900 font-semibold shadow-md">
                <p className="font-bold mb-1">Error:</p>
                <p>{pageError}</p>
              </div>
            )}

            <div className="relative mb-6">
           <SkillsSearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Buscar por nombre o nivel..."/> </div>

            {isLoading ? (
              <SkillsLoading />
            ) : filteredSkills.length === 0 ? (
              <div className="rounded-2xl bg-white py-20 shadow-sm border border-[#6dacbf]/20 flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                  <Code2 className="size-8" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-[#003A6C] text-base mb-1">No hay habilidades</p>
                  <p className="text-sm text-[#4B778D]">
                    {searchQuery
                      ? 'No hay habilidades que coincidan con la búsqueda'
                      : 'Registra habilidades para poder eliminarlas'}
                  </p>
                </div>
              </div>
            ) : (
              
              <div className="rounded-2xl border border-[#6dacbf]/30 bg-white shadow-sm overflow-hidden">
                <div className="grid grid-cols-[auto_1fr_auto_auto] sm:grid-cols-[auto_1fr_120px_140px] px-5 py-3 border-b border-[#6dacbf]/20 gap-4 items-center">
                 <input
                      type="checkbox"
                      checked={ filteredSkills.length > 0 && filteredSkills.every((skill) => selectedSkillIds.has(skill.id)) }
                      onChange={() =>
                        toggleSelectAll(filteredSkills.map((skill) => skill.id))
                      }
                      className="w-4 h-4 accent-[#003A6C] cursor-pointer rounded" />
                  <span className="text-xs font-bold text-[#4B778D] uppercase tracking-wider">  Habilidad  </span>
                  <span className="text-xs font-bold text-[#4B778D] uppercase tracking-wider hidden sm:block">  Tipo </span>
                  <span className="text-xs font-bold text-[#4B778D] uppercase tracking-wider hidden sm:block">  Nivel  </span>
                </div>

                {filteredSkills.map((skill, idx) => {
                  const isSelected = selectedSkillIds.has(skill.id);
                  const isTechnical = skill.type === 'tecnica';
                  return (
                    <div
                      key={skill.id}
                      onClick={() => toggleSelectSkill(skill.id)}
                      className={`grid grid-cols-[auto_1fr_auto_auto] sm:grid-cols-[auto_1fr_120px_140px] px-5 py-4 items-center gap-4 cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50' : 'hover:bg-[#EEF6FC]'
                      } ${idx !== filteredSkills.length - 1 ? 'border-b border-[#6dacbf]/10' : ''}`}    >
                    
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectSkill(skill.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 accent-[#003A6C] cursor-pointer rounded"
                        aria-label={`Seleccionar ${skill.name}`}   />

                      <div className="flex items-center gap-2 min-w-0">
                        {isTechnical ? (
                          <Code2 className="size-4 text-[#4B778D] shrink-0" />
                        ) : (
                          <Lightbulb className="size-4 text-[#4B778D] shrink-0" />
                        )}
                        <span
                          className={`font-semibold truncate ${
                            isSelected ? 'text-[#003A6C]' : 'text-[#003A6C]'
                          }`}   >
                          {skill.name}
                        </span>
                      </div>

                      <span className="text-[#4B778D] text-sm hidden sm:block">
                        {isTechnical ? 'Técnica' : 'Blanda'}
                      </span>

                      <div className="hidden sm:block">
                        {skill.level ? (
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                              LEVEL_COLORS[skill.level.toLowerCase()] ??
                              'bg-gray-100 text-gray-600'  }`} >
                            {LEVEL_LABELS[skill.level.toLowerCase()] ?? skill.level}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">—</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
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
