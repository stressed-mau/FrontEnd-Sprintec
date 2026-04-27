import Header from '../../components/HeaderUser';
import Sidebar from '../../components/Sidebar';
import { Footer } from '@/components/Footer';
import { Code2, Lightbulb, Search, Trash2 } from 'lucide-react';
import { useSkillsManager } from '../../hooks/useSkillsManager';
import ConfirmationModal from '../../components/ConfirmationModal';

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

const DeleteSkillsPage = () => {
  const {
    filteredSkills,
    isLoading,
    pageError,
    searchQuery,
    setSearchQuery,
    selectedSkillIds,
    toggleSelectSkill,
    toggleSelectAll,
    showConfirmDelete,
    setShowConfirmDelete,
    confirmDeleteSelected,
    cancelDelete,
    isDeleting,
    showSuccessModal,
    setShowSuccessModal,
    successMessage,
  } = useSkillsManager();

  const visibleIds = filteredSkills.map((s) => s.id);
  const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedSkillIds.has(id));
  const someSelected = visibleIds.some((id) => selectedSkillIds.has(id));
  const selectedCount = selectedSkillIds.size;

  return (
    <div className="min-h-screen bg-[#F7F0E1] flex flex-col">
      <Header />
      <div className="flex flex-col lg:flex-row flex-1">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 md:p-10">
          <div className="max-w-5xl mx-auto">

            {/* Encabezado */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-[#003A6C] md:text-4xl mb-2">
                  Eliminar Habilidades
                </h1>
                <p className="text-sm text-[#4B778D] md:text-base">
                  {selectedCount > 0
                    ? `${selectedCount} habilidad${selectedCount > 1 ? 'es' : ''} seleccionada${selectedCount > 1 ? 's' : ''}`
                    : 'Selecciona habilidades para eliminar'}
                </p>
              </div>

              {/* Botón Eliminar — aparece cuando hay selección */}
              {selectedCount > 0 && (
                <button
                  onClick={() => setShowConfirmDelete(true)}
                  disabled={isDeleting}
                  className="flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-red-700 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed self-start"
                >
                  <Trash2 className="size-4" />
                  Eliminar ({selectedCount})
                </button>
              )}
            </div>

            {/* Error de página */}
            {pageError && (
              <div className="mb-6 rounded-2xl border-2 border-red-400 bg-red-100 px-4 py-4 text-sm text-red-900 font-semibold shadow-md">
                <p className="font-bold mb-1">Error:</p>
                <p>{pageError}</p>
              </div>
            )}

            {/* Buscador */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#4B778D]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre, tipo o nivel..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#0E7D96]/20 bg-white text-[#003A6C] placeholder:text-[#4B778D]/60 outline-none focus:ring-2 focus:ring-[#0E7D96]/30 shadow-sm"
              />
            </div>

            {/* Contenido */}
            {isLoading ? (
              <div className="rounded-2xl border border-[#6dacbf]/30 bg-white py-10 text-center shadow-sm">
                <p className="text-sm text-[#4B778D]">Cargando habilidades...</p>
              </div>
            ) : filteredSkills.length === 0 ? (
              /* Empty state con ícono — mockup imagen 4 */
              <div className="rounded-2xl bg-white py-20 shadow-sm border border-[#6dacbf]/20 flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                  <Code2 className="size-8" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-[#003A6C] text-base mb-1">No hay habilidades</p>
                  <p className="text-sm text-[#4B778D]">
                    {searchQuery
                      ? 'No hay habilidades que coincidan con la búsqueda'
                      : 'Agrega habilidades para poder eliminarlas'}
                  </p>
                </div>
              </div>
            ) : (
              /* Tabla con checkboxes */
              <div className="rounded-2xl border border-[#6dacbf]/30 bg-white shadow-sm overflow-hidden">
                {/* Cabecera con checkbox "seleccionar todo" */}
                <div className="grid grid-cols-[auto_1fr_auto_auto] sm:grid-cols-[auto_1fr_120px_140px] px-5 py-3 border-b border-[#6dacbf]/20 gap-4 items-center">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected && !allSelected;
                    }}
                    onChange={() => toggleSelectAll(visibleIds)}
                    className="w-4 h-4 accent-[#003A6C] cursor-pointer rounded"
                    aria-label="Seleccionar todas las habilidades"
                  />
                  <span className="text-xs font-bold text-[#4B778D] uppercase tracking-wider">
                    Habilidad
                  </span>
                  <span className="text-xs font-bold text-[#4B778D] uppercase tracking-wider hidden sm:block">
                    Tipo
                  </span>
                  <span className="text-xs font-bold text-[#4B778D] uppercase tracking-wider hidden sm:block">
                    Nivel
                  </span>
                </div>

                {/* Filas */}
                {filteredSkills.map((skill, idx) => {
                  const isSelected = selectedSkillIds.has(skill.id);
                  const isTechnical = skill.type === 'tecnica';
                  return (
                    <div
                      key={skill.id}
                      onClick={() => toggleSelectSkill(skill.id)}
                      className={`grid grid-cols-[auto_1fr_auto_auto] sm:grid-cols-[auto_1fr_120px_140px] px-5 py-4 items-center gap-4 cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50' : 'hover:bg-[#EEF6FC]'
                      } ${idx !== filteredSkills.length - 1 ? 'border-b border-[#6dacbf]/10' : ''}`}
                    >
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectSkill(skill.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 accent-[#003A6C] cursor-pointer rounded"
                        aria-label={`Seleccionar ${skill.name}`}
                      />

                      {/* Nombre con ícono de tipo */}
                      <div className="flex items-center gap-2 min-w-0">
                        {isTechnical ? (
                          <Code2 className="size-4 text-[#4B778D] shrink-0" />
                        ) : (
                          <Lightbulb className="size-4 text-[#4B778D] shrink-0" />
                        )}
                        <span
                          className={`font-semibold truncate ${
                            isSelected ? 'text-[#003A6C]' : 'text-[#003A6C]'
                          }`}
                        >
                          {skill.name}
                        </span>
                      </div>

                      {/* Tipo */}
                      <span className="text-[#4B778D] text-sm hidden sm:block">
                        {isTechnical ? 'Técnica' : 'Blanda'}
                      </span>

                      {/* Nivel */}
                      <div className="hidden sm:block">
                        {skill.level ? (
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                              LEVEL_COLORS[skill.level.toLowerCase()] ??
                              'bg-gray-100 text-gray-600'
                            }`}
                          >
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

      {/* Modal de confirmación de eliminación — Criterios 14, 15, 16, 17 */}
      {showConfirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="size-7 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-[#003A6C] mb-2">
              ¿Está seguro de que desea eliminar{' '}
              {selectedCount > 1 ? `estas ${selectedCount} habilidades` : 'esta habilidad'}?
            </h3>
            <p className="text-sm text-gray-500 mb-6">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              {/* Criterio 16: botón Eliminar */}
              <button
                onClick={() => void confirmDeleteSelected()}
                disabled={isDeleting}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-semibold hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Eliminando...' : 'Eliminar'}
              </button>
              {/* Criterio 17: botón Cancelar */}
              <button
                onClick={cancelDelete}
                disabled={isDeleting}
                className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-semibold hover:bg-gray-200 disabled:opacity-60"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de éxito — Criterio 16 */}
      <ConfirmationModal
        isOpen={showSuccessModal}
        title="Éxito"
        message={successMessage || 'Habilidad eliminada correctamente.'}
        onClose={() => setShowSuccessModal(false)}
      />

      <Footer />
    </div>
  );
};

export default DeleteSkillsPage;