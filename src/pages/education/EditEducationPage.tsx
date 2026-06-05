import { EducationFeedbackMessage } from "@/components/education/EducationFeedbackMessage"
import { EducationManagerModals } from "@/components/education/EducationManagerModals"
import { EducationPageShell } from "@/components/education/EducationPageShell"
import { EducationPagination } from "@/components/education/EducationPagination"
import { EducationSearch } from "@/components/education/EducationSearch"
import { EducationTable } from "@/components/education/EducationTable"
import { useEducationManager } from "@/hooks/useEducationManager"
import { useEducationSearchPagination } from "@/hooks/useEducationSearchPagination"

export default function EditEducationPage() {
  const manager = useEducationManager()
  const education = manager.education
  const search = useEducationSearchPagination(education)

  return (
    <EducationPageShell title="Editar Formación Académica" description="Selecciona una Formación Académica de la tabla para actualizarla.">
      <EducationFeedbackMessage message={manager.feedbackMessage || manager.pageError} type={manager.feedbackType || "error"} />

      {education.length > 0 ? <EducationSearch value={search.searchTerm} onChange={search.handleSearchChange} /> : null}

      {manager.isLoading ? (
        <div className="rounded-2xl border border-[#A5D7E8] bg-white px-6 py-10 text-center text-sm text-[#4B778D] shadow-sm">
          Cargando Formación Académica...
        </div>
      ) : (
        <EducationTable
          education={search.pagination.items}
          emptyMessage={search.searchTerm ? "No se encontró Formación Académica con ese criterio." : "No hay Formación Académica para editar."}
          searchTerm={search.searchTerm}
          onRowClick={manager.openEditModal}
        />
      )}

      <EducationPagination
        currentPage={search.pagination.currentPage}
        totalPages={search.pagination.totalPages}
        startIndex={search.pagination.startIndex}
        endIndex={search.pagination.endIndex}
        totalItems={search.filteredEducation.length}
        onPageChange={search.setCurrentPage}
      />

      <EducationManagerModals manager={manager} />
    </EducationPageShell>
  )
}
