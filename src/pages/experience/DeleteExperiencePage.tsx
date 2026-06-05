import { useState } from "react"
import { Trash2 } from "lucide-react"

import ConfirmationModal from "@/components/ConfirmationModal"
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal"
import { ExperiencePageShell } from "@/components/experience/ExperiencePageShell"
import { ExperiencePagination } from "@/components/experience/ExperiencePagination"
import { ExperienceSearch } from "@/components/experience/ExperienceSearch"
import { ExperienceTable } from "@/components/experience/ExperienceTable"
import { FeedbackMessage } from "@/components/experience/FeedbackMessage"
import { Button } from "@/components/ui/button"
import { useExperienceManager } from "@/hooks/useExperienceManager"
import { useExperienceSearchPagination } from "@/hooks/useExperienceSearchPagination"
import { useExperienceSelection } from "@/hooks/useExperienceSelection"

export default function DeleteExperiencePage() {
  const manager = useExperienceManager()
  const experiences = manager.laboralExperiences
  const search = useExperienceSearchPagination(experiences)
  const selection = useExperienceSelection(experiences, search.pagination.items)
  const [feedbackMessage, setFeedbackMessage] = useState("")
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "">("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [deletedCount, setDeletedCount] = useState(0)

  function handleSearchChange(value: string) {
    search.handleSearchChange(value)
    selection.clearSelection()
  }

  async function handleDeleteSelected() {
    const idsToDelete = Array.from(selection.selectedIds)
    if (idsToDelete.length === 0 || isDeleting) return

    setIsDeleting(true)
    setFeedbackMessage("")
    setFeedbackType("")

    try {
      const deleted = await deleteSelectedExperiences(idsToDelete, manager.handleDelete)
      if (!deleted) return showDeleteError("No se pudo eliminar una de las Experiencias Laborales seleccionadas.")

      setDeletedCount(idsToDelete.length)
      selection.clearSelection()
      setShowConfirmDelete(false)
      setShowSuccessModal(true)
      await manager.reloadExperiences()
    } catch (error) {
      showDeleteError(error instanceof Error ? error.message : "No se pudo eliminar la Experiencia Laboral.")
    } finally {
      setIsDeleting(false)
    }
  }

  function showDeleteError(message: string) {
    setFeedbackMessage(message)
    setFeedbackType("error")
  }

  return (
    <ExperiencePageShell title="Eliminar Experiencia Laboral" description={getDeleteDescription(selection.selectedCount)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">{experiences.length > 0 ? <ExperienceSearch value={search.searchTerm} onChange={handleSearchChange} /> : null}</div>
        <DeleteButton selectedCount={selection.selectedCount} isDeleting={isDeleting} onClick={() => setShowConfirmDelete(true)} />
      </div>

      <FeedbackMessage message={feedbackMessage || manager.pageError} type={feedbackType || "error"} />

      {manager.isLoading ? (
        <div className="rounded-2xl border border-[#A5D7E8] bg-white px-6 py-10 text-center text-sm text-[#4B778D] shadow-sm">Cargando Experiencia Laboral...</div>
      ) : (
        <ExperienceTable experiences={search.pagination.items} emptyMessage={search.searchTerm ? "No se encontró Experiencia Laboral con ese criterio." : "No hay Experiencia Laboral para eliminar."} searchTerm={search.searchTerm} selectedIds={selection.selectedIds} onSelect={selection.handleSelect} onSelectAll={selection.handleSelectAllVisible} />
      )}

      <ExperiencePagination currentPage={search.pagination.currentPage} totalPages={search.pagination.totalPages} startIndex={search.pagination.startIndex} endIndex={search.pagination.endIndex} totalItems={search.filteredExperiences.length} onPageChange={search.setCurrentPage} />

      <DeleteConfirmationModal isOpen={showConfirmDelete} title={`Está seguro de que desea eliminar ${selection.selectedCount > 1 ? "estas Experiencias Laborales" : "esta Experiencia Laboral"}?`} message="Esta acción no se puede deshacer." isLoading={isDeleting} onConfirm={() => void handleDeleteSelected()} onCancel={() => setShowConfirmDelete(false)} />

      <ConfirmationModal isOpen={showSuccessModal} title="Éxito" message={`${deletedCount > 1 ? "Experiencias Laborales eliminadas" : "Experiencia Laboral eliminada"} correctamente.`} onClose={() => setShowSuccessModal(false)} />
    </ExperiencePageShell>
  )
}

async function deleteSelectedExperiences(ids: string[], deleteExperience: (id: string) => Promise<boolean>) {
  for (const id of ids) {
    const deleted = await deleteExperience(id)
    if (!deleted) return false
  }

  return true
}

function getDeleteDescription(selectedCount: number) {
  if (selectedCount === 0) return "Selecciona una o varias Experiencias Laborales para eliminarlas."
  return `${selectedCount} Experiencia${selectedCount > 1 ? "s" : ""} Laboral${selectedCount > 1 ? "es" : ""} seleccionada${selectedCount > 1 ? "s" : ""}.`
}

function DeleteButton({ selectedCount, isDeleting, onClick }: { selectedCount: number; isDeleting: boolean; onClick: () => void }) {
  return (
    <Button type="button" variant="destructive" onClick={onClick} disabled={selectedCount === 0 || isDeleting} className="h-11 bg-[#B42318] px-5 text-white hover:bg-[#8F1C14]">
      <Trash2 className="mr-2 size-4" />
      {isDeleting ? "Eliminando..." : `Eliminar${selectedCount > 0 ? ` (${selectedCount})` : ""}`}
    </Button>
  )
}
