import { useEffect, useMemo, useState } from "react"
import { Trash2 } from "lucide-react"

import ConfirmationModal from "@/components/ui/modals/ConfirmationModal"
import DeleteConfirmationModal from "@/components/ui/modals/DeleteConfirmationModal"
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
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())
  const [feedbackMessage, setFeedbackMessage] = useState("")
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "">("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [deletedCount, setDeletedCount] = useState(0)

  const experiences = manager.laboralExperiences
  const filteredExperiences = useMemo(() => filterExperiences(experiences, searchTerm), [experiences, searchTerm])
  const pagination = paginateExperiences(filteredExperiences, currentPage)
  const selectedCount = selectedIds.size

  function handleSearchChange(value: string) {
    setSearchTerm(value)
    setCurrentPage(1)
    setSelectedIds(new Set())
  }

  useEffect(() => {
    setSelectedIds((current) => {
      const availableIds = new Set(experiences.map((experience) => experience.id))
      const next = new Set(Array.from(current).filter((id) => availableIds.has(id)))
      return next.size === current.size ? current : next
    })
  }, [experiences])

  function handleSelect(id: string, checked: boolean) {
    setSelectedIds((current) => {
      const next = new Set(current)
      if (checked) {
        next.add(id)
      } else {
        next.delete(id)
      }
      return next
    })
  }

  function handleSelectAllVisible(checked: boolean) {
    setSelectedIds((current) => {
      const next = new Set(current)
      pagination.items.forEach((experience) => {
        if (checked) {
          next.add(experience.id)
        } else {
          next.delete(experience.id)
        }
      })
      return next
    })
  }

  async function handleDeleteSelected() {
    const idsToDelete = Array.from(selectedIds)
    if (idsToDelete.length === 0 || isDeleting) {
      return
    }

    setIsDeleting(true)
    setFeedbackMessage("")
    setFeedbackType("")

    try {
      for (const id of idsToDelete) {
        const deleted = await manager.handleDelete(id)

        if (!deleted) {
          setFeedbackMessage("No se pudo eliminar una de las Experiencias Laborales seleccionadas.")
          setFeedbackType("error")
          return
        }
      }

      setDeletedCount(idsToDelete.length)
      setSelectedIds(new Set())
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
        selectedCount === 0
          ? "Selecciona una o varias Experiencias Laborales para eliminarlas."
          : `${selectedCount} Experiencia${selectedCount > 1 ? "s" : ""} Laboral${selectedCount > 1 ? "es" : ""} seleccionada${selectedCount > 1 ? "s" : ""}.`
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
          disabled={selectedCount === 0 || isDeleting}
          className="h-11 bg-[#B42318] px-5 text-white hover:bg-[#8F1C14]"
        >
          <Trash2 className="mr-2 size-4" />
          {isDeleting ? "Eliminando..." : `Eliminar${selectedCount > 0 ? ` (${selectedCount})` : ""}`}
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
          emptyMessage={searchTerm ? "No se encontro Experiencia Laboral con ese criterio." : "No hay Experiencia Laboral para eliminar."}
          searchTerm={searchTerm}
          selectedIds={selectedIds}
          onSelect={handleSelect}
          onSelectAll={handleSelectAllVisible}
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
        title={`Esta seguro de que desea eliminar ${selectedCount > 1 ? "estas Experiencias Laborales" : "esta Experiencia Laboral"}?`}
        message="Esta accion no se puede deshacer."
        isLoading={isDeleting}
        onConfirm={() => void handleDeleteSelected()}
        onCancel={() => setShowConfirmDelete(false)}
      />

      <ConfirmationModal
        isOpen={showSuccessModal}
        title="Exito"
        message={`${deletedCount > 1 ? "Experiencias Laborales eliminadas" : "Experiencia Laboral eliminada"} correctamente.`}
        onClose={() => setShowSuccessModal(false)}
      />
    </ExperiencePageShell>
  )
}
