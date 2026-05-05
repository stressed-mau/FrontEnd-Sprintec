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

export default function ViewEducationPage() {
  const manager = useExperienceManager()
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedEducation, setSelectedEducation] = useState<ExperienceItem | null>(null)

  const education = manager.academicExperiences
  const filteredEducation = useMemo(() => filterExperiences(education, searchTerm), [education, searchTerm])
  const pagination = paginateExperiences(filteredEducation, currentPage)

  function handleSearchChange(value: string) {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  return (
    <ExperiencePageShell
      title="Ver Formación Académica"
      description="Consulta tu Formación Académica registrada."
    >
      <FeedbackMessage message={manager.pageError} type="error" />

      {education.length > 0 ? <ExperienceSearch value={searchTerm} onChange={handleSearchChange} /> : null}

      {manager.isLoading ? (
        <div className="rounded-2xl border border-[#A5D7E8] bg-white px-6 py-10 text-center text-sm text-[#4B778D] shadow-sm">
          Cargando Formación Académica...
        </div>
      ) : (
        <ExperienceTable
          experiences={pagination.items}
          emptyMessage={searchTerm ? "No se encontró Formación Académica con ese criterio." : "No hay Formación Académica registrada."}
          searchTerm={searchTerm}
          onRowClick={setSelectedEducation}
        />
      )}

      <ExperiencePagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        startIndex={pagination.startIndex}
        endIndex={pagination.endIndex}
        totalItems={filteredEducation.length}
        onPageChange={setCurrentPage}
      />

      <ExperienceDetailsModal experience={selectedEducation} onClose={() => setSelectedEducation(null)} />
    </ExperiencePageShell>
  )
}
