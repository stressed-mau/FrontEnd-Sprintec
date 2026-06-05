import { useState } from "react"

import { EducationDetailsModal } from "@/components/education/EducationDetailsModal"
import { EducationFeedbackMessage } from "@/components/education/EducationFeedbackMessage"
import { EducationPageShell } from "@/components/education/EducationPageShell"
import { EducationPagination } from "@/components/education/EducationPagination"
import { EducationSearch } from "@/components/education/EducationSearch"
import { EducationTable } from "@/components/education/EducationTable"
import { useEducationManager } from "@/hooks/useEducationManager"
import { useEducationSearchPagination } from "@/hooks/useEducationSearchPagination"
import type { EducationItem } from "@/types/education"

export default function ViewEducationPage() {
  const manager = useEducationManager()
  const [selectedEducation, setSelectedEducation] = useState<EducationItem | null>(null)
  const education = manager.education
  const search = useEducationSearchPagination(education)

  return (
    <EducationPageShell title="Ver Formación Académica" description="Consulta tu Formación Académica registrada.">
      <EducationFeedbackMessage message={manager.pageError} type="error" />

      {education.length > 0 ? <EducationSearch value={search.searchTerm} onChange={search.handleSearchChange} /> : null}

      {manager.isLoading ? (
        <div className="rounded-2xl border border-[#A5D7E8] bg-white px-6 py-10 text-center text-sm text-[#4B778D] shadow-sm">
          Cargando Formación Académica...
        </div>
      ) : (
        <EducationTable
          education={search.pagination.items}
          emptyMessage={search.searchTerm ? "No se encontró Formación Académica con ese criterio." : "No hay Formación Académica registrada."}
          searchTerm={search.searchTerm}
          onRowClick={setSelectedEducation}
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

      <EducationDetailsModal education={selectedEducation} onClose={() => setSelectedEducation(null)} />
    </EducationPageShell>
  )
}
