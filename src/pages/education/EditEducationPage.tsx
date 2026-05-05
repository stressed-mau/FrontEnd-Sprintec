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

export default function EditEducationPage() {
  const manager = useExperienceManager()
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const education = manager.academicExperiences
  const filteredEducation = useMemo(() => filterExperiences(education, searchTerm), [education, searchTerm])
  const pagination = paginateExperiences(filteredEducation, currentPage)

  function handleSearchChange(value: string) {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  return (
    <ExperiencePageShell
      title="Editar Formación Académica"
      description="Selecciona una Formación Académica de la tabla para actualizarla."
    >
      <FeedbackMessage message={manager.feedbackMessage || manager.pageError} type={manager.feedbackType || "error"} />

      {education.length > 0 ? <ExperienceSearch value={searchTerm} onChange={handleSearchChange} /> : null}

      {manager.isLoading ? (
        <div className="rounded-2xl border border-[#A5D7E8] bg-white px-6 py-10 text-center text-sm text-[#4B778D] shadow-sm">
          Cargando formación académica...
        </div>
      ) : (
        <ExperienceTable
          experiences={pagination.items}
          emptyMessage={searchTerm ? "No se encontró Formación Académica con ese criterio." : "No hay Formación Académica para editar."}
          searchTerm={searchTerm}
          onRowClick={manager.openEditModal}
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

      <ExperienceManagerModals manager={manager} hideTypeField />
    </ExperiencePageShell>
  )
}
