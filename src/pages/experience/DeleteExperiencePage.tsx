import { useEffect, useMemo, useState } from "react"
import { Trash2 } from "lucide-react"

import ConfirmationModal from "@/components/ConfirmationModal"
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal"
import { Button } from "@/components/ui/button"
import {
  ExperiencePageShell,
  ExperiencePagination,
  ExperienceSearch,
  ExperienceTable,
  FeedbackMessage,
} from "@/pages/experience/ExperiencePageParts"
import { filterExperiences, paginateExperiences } from "@/pages/experience/ExperiencePageUtils"
import { useExperienceManager } from "@/hooks/useExperienceManager"

export default function DeleteExperiencePage() {
  const manager = useExperienceManager()
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [feedbackMessage, setFeedbackMessage] = useState("")
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "">("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [deletedExperienceName, setDeletedExperienceName] = useState("")

  const experiences = manager.laboralExperiences
  const filteredExperiences = useMemo(() => filterExperiences(experiences, searchTerm), [experiences, searchTerm])
  const pagination = paginateExperiences(filteredExperiences, currentPage)
  const selectedExperience = useMemo(
    () => experiences.find((experience) => experience.id === selectedId) ?? null,
    [experiences, selectedId],
  )
  const selectedIds = useMemo(() => (selectedId == null ? new Set<string>() : new Set([selectedId])), [selectedId])

  function handleSearchChange(value: string) {
    setSearchTerm(value)
    setCurrentPage(1)
    setSelectedId(null)
  }

  useEffect(() => {
    if (selectedId != null && !experiences.some((experience) => experience.id === selectedId)) {
      setSelectedId(null)
    }
  }, [experiences, selectedId])

  function handleSelect(id: string, checked: boolean) {
    setSelectedId(checked ? id : null)
  }

  async function handleDeleteSelected() {
    if (selectedId == null || isDeleting) {
      return
    }

    setIsDeleting(true)
    setFeedbackMessage("")
    setFeedbackType("")

    try {
      const experienceName = selectedExperience?.company ?? ""
      const deleted = await manager.handleDelete(selectedId)

      if (!deleted) {
        setFeedbackMessage(manager.pageError || "No se pudo eliminar la Experiencia Laboral.")
        setFeedbackType("error")
        return
      }

      setSelectedId(null)
      setDeletedExperienceName(experienceName)
      setShowConfirmDelete(false)
      setShowSuccessModal(true)
      await manager.reloadExperiences()
    } catch (error) {
      setFeedbackMessage(error instanceof Error ? error.message : "No se pudo eliminar la Experiencia Laboral.")
      setFeedbackType("error")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <ExperiencePageShell
      title="Eliminar Experiencia Laboral"
      description={
        selectedId == null
          ? "Selecciona una Experiencia Laboral para eliminarla."
          : "1 Experiencia Laboral seleccionada."
      }
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          {experiences.length > 0 ? <ExperienceSearch value={searchTerm} onChange={handleSearchChange} /> : null}
        </div>
        <Button
          type="button"
          variant="destructive"
          onClick={() => setShowConfirmDelete(true)}
          disabled={selectedId == null || isDeleting}
          className="h-11 bg-[#B42318] px-5 text-white hover:bg-[#8F1C14]"
        >
          <Trash2 className="mr-2 size-4" />
          {isDeleting ? "Eliminando..." : "Eliminar"}
        </Button>
      </div>

      <FeedbackMessage message={feedbackMessage || manager.pageError} type={feedbackType || "error"} />

      {manager.isLoading ? (
        <div className="rounded-2xl border border-[#A5D7E8] bg-white px-6 py-10 text-center text-sm text-[#4B778D] shadow-sm">
          Cargando Experiencia Laboral...
        </div>
      ) : (
        <ExperienceTable
          experiences={pagination.items}
          emptyMessage={searchTerm ? "No se encontró Experiencia Laboral con ese criterio." : "No hay Experiencia Laboral para eliminar."}
          searchTerm={searchTerm}
          selectedIds={selectedIds}
          onSelect={handleSelect}
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

      <DeleteConfirmationModal
        isOpen={showConfirmDelete}
        title="¿Está seguro de que desea eliminar esta Experiencia Laboral?"
        isLoading={isDeleting}
        onConfirm={() => void handleDeleteSelected()}
        onCancel={() => setShowConfirmDelete(false)}
      />

      <ConfirmationModal
        isOpen={showSuccessModal}
        title="Exito"
        message={`Experiencia Laboral${deletedExperienceName ? ` "${deletedExperienceName}"` : ""} eliminada correctamente.`}
        onClose={() => setShowSuccessModal(false)}
      />
    </ExperiencePageShell>
  )
}
