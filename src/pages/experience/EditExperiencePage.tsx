import { ExperienceManagerModals } from "@/components/experience/ExperienceManagerModals"
import { ExperiencePageShell } from "@/components/experience/ExperiencePageShell"
import { ExperiencePagination } from "@/components/experience/ExperiencePagination"
import { ExperienceSearch } from "@/components/experience/ExperienceSearch"
import { ExperienceTable } from "@/components/experience/ExperienceTable"
import { FeedbackMessage } from "@/components/experience/FeedbackMessage"
import { useExperienceManager } from "@/hooks/useExperienceManager"
import { useExperienceSearchPagination } from "@/hooks/useExperienceSearchPagination"

export default function EditExperiencePage() {
  const manager = useExperienceManager()
  const experiences = manager.laboralExperiences
  const search = useExperienceSearchPagination(experiences)

  return (
    <ExperiencePageShell title="Editar Experiencia Laboral" description="Selecciona una Experiencia Laboral de la tabla para actualizar sus datos.">
      <FeedbackMessage message={manager.feedbackMessage || manager.pageError} type={manager.feedbackType || "error"} />
      {experiences.length > 0 ? <ExperienceSearch value={search.searchTerm} onChange={search.handleSearchChange} /> : null}
      {manager.isLoading ? (
        <div className="rounded-2xl border border-[#A5D7E8] bg-white px-6 py-10 text-center text-sm text-[#4B778D] shadow-sm">Cargando Experiencia Laboral...</div>
      ) : (
        <ExperienceTable experiences={search.pagination.items} emptyMessage={search.searchTerm ? "No se encontró Experiencia Laboral con ese criterio." : "No hay Experiencia Laboral para editar."} searchTerm={search.searchTerm} onRowClick={manager.openEditModal} />
      )}
      <ExperiencePagination currentPage={search.pagination.currentPage} totalPages={search.pagination.totalPages} startIndex={search.pagination.startIndex} endIndex={search.pagination.endIndex} totalItems={search.filteredExperiences.length} onPageChange={search.setCurrentPage} />
      <ExperienceManagerModals manager={manager} hideTypeField />
    </ExperiencePageShell>
  )
}
