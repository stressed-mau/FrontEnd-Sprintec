import { useMemo, useState } from "react"

import {
  ExperienceDetailsModal,
  ExperiencePageShell,
  ExperiencePagination,
  ExperienceSearch,
  ExperienceTable,
  FeedbackMessage,
} from "@/pages/experience/ExperiencePageParts"
import { filterExperiences, paginateExperiences } from "@/pages/experience/ExperiencePageUtils"
import { type ExperienceItem, useExperienceManager } from "@/hooks/useExperienceManager"

export default function ViewExperiencePage() {
  const manager = useExperienceManager()
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedExperience, setSelectedExperience] = useState<ExperienceItem | null>(null)

  const experiences = manager.laboralExperiences
  const filteredExperiences = useMemo(() => filterExperiences(experiences, searchTerm), [experiences, searchTerm])
  const pagination = paginateExperiences(filteredExperiences, currentPage)

  function handleSearchChange(value: string) {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  return (
    <ExperiencePageShell
      title="Ver experiencia"
      description="Consulta tus experiencias laborales registradas."
    >
      <FeedbackMessage message={manager.pageError} type="error" />

      {experiences.length > 0 ? <ExperienceSearch value={searchTerm} onChange={handleSearchChange} /> : null}

      {manager.isLoading ? (
        <div className="rounded-2xl border border-[#A5D7E8] bg-white px-6 py-10 text-center text-sm text-[#4B778D] shadow-sm">
          Cargando experiencias...
        </div>
      ) : (
        <ExperienceTable
          experiences={pagination.items}
          emptyMessage={searchTerm ? "No se encontraron experiencias con ese criterio." : "No hay experiencias registradas."}
          searchTerm={searchTerm}
          onRowClick={setSelectedExperience}
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

      <ExperienceDetailsModal experience={selectedExperience} onClose={() => setSelectedExperience(null)} />
    </ExperiencePageShell>
  )
}
