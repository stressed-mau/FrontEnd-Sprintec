import { useMemo, useState } from "react"

import {
  ExperienceManagerModals,
  ExperiencePageShell,
  ExperiencePagination,
  ExperienceSearch,
  ExperienceTable,
  FeedbackMessage,
} from "@/pages/experience/ExperiencePageParts"
import { filterExperiences, paginateExperiences } from "@/pages/experience/ExperiencePageUtils"
import { useExperienceManager } from "@/hooks/useExperienceManager"

export default function EditExperiencePage() {
  const manager = useExperienceManager()
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const experiences = manager.laboralExperiences
  const filteredExperiences = useMemo(() => filterExperiences(experiences, searchTerm), [experiences, searchTerm])
  const pagination = paginateExperiences(filteredExperiences, currentPage)

  function handleSearchChange(value: string) {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  return (
    <ExperiencePageShell
      title="Editar experiencia"
      description="Selecciona una experiencia de la tabla para actualizar sus datos."
    >
      <FeedbackMessage message={manager.feedbackMessage || manager.pageError} type={manager.feedbackType || "error"} />

      {experiences.length > 0 ? <ExperienceSearch value={searchTerm} onChange={handleSearchChange} /> : null}

      {manager.isLoading ? (
        <div className="rounded-2xl border border-[#A5D7E8] bg-white px-6 py-10 text-center text-sm text-[#4B778D] shadow-sm">
          Cargando experiencias...
        </div>
      ) : (
        <ExperienceTable
          experiences={pagination.items}
          emptyMessage={searchTerm ? "No se encontraron experiencias con ese criterio." : "No hay experiencias para editar."}
          searchTerm={searchTerm}
          onRowClick={manager.openEditModal}
        />
      )}

      <ExperiencePagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        startIndex={pagination.startIndex}
        endIndex={pagination.endIndex}
        totalItems={filteredExperiences.length}
        onPageChange={setCurrentPage}
      />

      <ExperienceManagerModals manager={manager} hideTypeField />
    </ExperiencePageShell>
  )
}
