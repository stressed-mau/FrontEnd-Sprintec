import { Trash2 } from "lucide-react";
import { useState } from "react";

import ConfirmationModal from "@/components/ConfirmationModal";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { FeedbackMessage } from "@/components/projects/FeedbackMessage";
import { ProjectPageShell } from "@/components/projects/ProjectPageShell";
import { ProjectPagination } from "@/components/projects/ProjectPagination";
import { ProjectSearch } from "@/components/projects/ProjectSearch";
import { ProjectTable } from "@/components/projects/ProjectTable";
import { Button } from "@/components/ui/button";
import { useProjectSearchPagination } from "@/hooks/useProjectSearchPagination";
import { useProjectSelection } from "@/hooks/useProjectSelection";
import { useProjectsManager } from "@/hooks/useProjectsManager";
import { filterProjectsByTitle } from "@/lib/projectListUtils";

export default function DeleteProjectsPage() {
  const manager = useProjectsManager();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [deletedCount, setDeletedCount] = useState(0);
  const search = useProjectSearchPagination(manager.projects, filterProjectsByTitle);
  const selection = useProjectSelection(search.pagination.items);

  function handleSearchChange(value: string) {
    search.handleSearchChange(value);
    selection.clearSelection();
  }

  async function handleConfirmDelete() {
    const idsToDelete = Array.from(selection.selectedIds);
    if (idsToDelete.length === 0) return;

    const deleted = await manager.removeProjects(idsToDelete);
    setShowConfirmDelete(false);

    if (deleted) {
      setDeletedCount(idsToDelete.length);
      selection.clearSelection();
      setShowSuccessModal(true);
    }
  }

  return (
    <ProjectPageShell
      title="Eliminar proyectos"
      description={
        selection.selectedCount === 0
          ? "Selecciona uno o varios proyectos para eliminarlos."
          : `${selection.selectedCount} proyecto${selection.selectedCount > 1 ? "s" : ""} seleccionado${selection.selectedCount > 1 ? "s" : ""}.`
      }
    >
      <FeedbackMessage message={manager.pageError} type="error" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {manager.projects.length > 0 ? <ProjectSearch value={search.searchTerm} onChange={handleSearchChange} /> : <span />}
        <Button
          type="button"
          disabled={selection.selectedCount === 0 || manager.isDeleting}
          onClick={() => setShowConfirmDelete(true)}
          className="bg-red-600 text-white hover:bg-red-700"
        >
          <Trash2 className="size-4" />
          {manager.isDeleting ? "Eliminando..." : `Eliminar${selection.selectedCount > 0 ? ` (${selection.selectedCount})` : ""}`}
        </Button>
      </div>

      {manager.isLoading ? (
        <div className="rounded-2xl border border-[#A5D7E8] bg-white px-6 py-10 text-center text-sm text-[#4B778D] shadow-sm">
          Cargando proyectos...
        </div>
      ) : (
        <ProjectTable
          projects={search.pagination.items}
          emptyMessage={search.searchTerm ? "No se encontraron proyectos con ese criterio." : "No hay proyectos para eliminar."}
          selectable
          selectedIds={selection.selectedIds}
          onToggleSelect={selection.handleToggleSelect}
          onSelectAll={selection.handleSelectAllVisible}
        />
      )}

      <ProjectPagination
        currentPage={search.pagination.currentPage}
        totalPages={search.pagination.totalPages}
        startIndex={search.pagination.startIndex}
        endIndex={search.pagination.endIndex}
        totalItems={search.filteredProjects.length}
        onPageChange={search.setCurrentPage}
      />

      <DeleteConfirmationModal
        isOpen={showConfirmDelete}
        title={`Está seguro de que desea eliminar ${selection.selectedCount > 1 ? "estos proyectos" : "este proyecto"}?`}
        message="Esta acción no se puede deshacer."
        isLoading={manager.isDeleting}
        onConfirm={() => void handleConfirmDelete()}
        onCancel={() => setShowConfirmDelete(false)}
      />

      <ConfirmationModal
        isOpen={showSuccessModal}
        title="Éxito"
        message={manager.successMessage || `${deletedCount > 1 ? "Proyectos eliminados" : "Proyecto eliminado"} correctamente.`}
        onClose={() => setShowSuccessModal(false)}
      />
    </ProjectPageShell>
  );
}
