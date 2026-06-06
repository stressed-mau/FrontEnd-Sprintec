import { useState } from "react"
import { Trash2 } from "lucide-react"

import ConfirmationModal from "@/components/modals/ConfirmationModal"
import DeleteConfirmationModal from "@/components/modals/DeleteConfirmationModal"
import { EducationFeedbackMessage } from "@/components/education/EducationFeedbackMessage"
import { EducationPageShell } from "@/components/education/EducationPageShell"
import { EducationPagination } from "@/components/education/EducationPagination"
import { EducationSearch } from "@/components/education/EducationSearch"
import { EducationTable } from "@/components/education/EducationTable"
import { Button } from "@/components/ui/button"
import { useEducationManager } from "@/hooks/useEducationManager"
import { useEducationSearchPagination } from "@/hooks/useEducationSearchPagination"
import { useEducationSelection } from "@/hooks/useEducationSelection"

export default function DeleteEducationPage() {
  const manager = useEducationManager()
  const education = manager.education
  const search = useEducationSearchPagination(education)
  const selection = useEducationSelection(education, search.pagination.items)
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
      const deleted = await deleteSelectedEducation(idsToDelete, manager.handleDelete)
      if (!deleted) return showDeleteError("No se pudo eliminar una de las Formaciones Académicas seleccionadas.")

      setDeletedCount(idsToDelete.length)
      selection.clearSelection()
      setShowConfirmDelete(false)
      setShowSuccessModal(true)
      await manager.reloadEducation()
    } catch (error) {
      showDeleteError(error instanceof Error ? error.message : "No se pudo eliminar la Formación Académica.")
    } finally {
      setIsDeleting(false)
    }
  }

  function showDeleteError(message: string) {
    setFeedbackMessage(message)
    setFeedbackType("error")
  }

  return (
    <EducationPageShell title="Eliminar Formación Académica" description={getDeleteDescription(selection.selectedCount)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          {education.length > 0 ? <EducationSearch value={search.searchTerm} onChange={handleSearchChange} /> : null}
        </div>
        <DeleteButton selectedCount={selection.selectedCount} isDeleting={isDeleting} onClick={() => setShowConfirmDelete(true)} />
      </div>

      <EducationFeedbackMessage message={feedbackMessage || manager.pageError} type={feedbackType || "error"} />

      {manager.isLoading ? (
        <div className="rounded-2xl border border-[#A5D7E8] bg-white px-6 py-10 text-center text-sm text-[#4B778D] shadow-sm">
          Cargando Formación Académica...
        </div>
      ) : (
        <EducationTable
          education={search.pagination.items}
          emptyMessage={search.searchTerm ? "No se encontró Formación Académica con ese criterio." : "No hay Formación Académica para eliminar."}
          searchTerm={search.searchTerm}
          selectedIds={selection.selectedIds}
          onSelect={selection.handleSelect}
          onSelectAll={selection.handleSelectAllVisible}
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

      <DeleteConfirmationModal
        isOpen={showConfirmDelete}
        title={`Está seguro de que desea eliminar ${selection.selectedCount > 1 ? "estas formaciones académicas" : "esta formación académica"}?`}
        message="Esta acción no se puede deshacer."
        isLoading={isDeleting}
        onConfirm={() => void handleDeleteSelected()}
        onCancel={() => setShowConfirmDelete(false)}
      />

      <ConfirmationModal
        isOpen={showSuccessModal}
        title="Éxito"
        message={`${deletedCount > 1 ? "Formaciones Académicas eliminadas" : "Formación Académica eliminada"} correctamente.`}
        onClose={() => setShowSuccessModal(false)}
      />
    </EducationPageShell>
  )
}

async function deleteSelectedEducation(ids: string[], deleteEducation: (id: string) => Promise<boolean>) {
  for (const id of ids) {
    const deleted = await deleteEducation(id)
    if (!deleted) return false
  }

  return true
}

function getDeleteDescription(selectedCount: number) {
  if (selectedCount === 0) return "Selecciona una o varias Formaciones Académicas para eliminarlas."
  return `${selectedCount} Formación${selectedCount > 1 ? "es" : ""} Académica${selectedCount > 1 ? "s" : ""} seleccionada${selectedCount > 1 ? "s" : ""}.`
}

function DeleteButton({ selectedCount, isDeleting, onClick }: { selectedCount: number; isDeleting: boolean; onClick: () => void }) {
  return (
    <Button type="button" variant="destructive" onClick={onClick} disabled={selectedCount === 0 || isDeleting} className="h-11 bg-[#B42318] px-5 text-white hover:bg-[#8F1C14]">
      <Trash2 className="mr-2 size-4" />
      {isDeleting ? "Eliminando..." : `Eliminar${selectedCount > 0 ? ` (${selectedCount})` : ""}`}
    </Button>
  )
}
