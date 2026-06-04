import { Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import ConfirmationModal from "@/components/modals/ConfirmationModal";
import DeleteConfirmationModal from "@/components/modals/DeleteConfirmationModal";
import { Button } from "@/components/ui/button";
import { useProjectsManager, type ProjectItem } from "@/hooks/useProjectsManager";
import {
  FeedbackMessage,
  paginateProjects,
  ProjectPageShell,
  ProjectPagination,
  ProjectSearch,
  ProjectTable,
} from "@/pages/projects/ProjectPageParts";

export default function DeleteProjectsPage() {
  const manager = useProjectsManager();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(() => new Set());
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [deletedCount, setDeletedCount] = useState(0);

  const filteredProjects = useMemo(() => filterProjectsByTitle(manager.projects, searchTerm), [manager.projects, searchTerm]);
  const pagination = paginateProjects(filteredProjects, currentPage);
  const selectedCount = selectedIds.size;

  function handleSearchChange(value: string) {
    setSearchTerm(value);
    setCurrentPage(1);
    setSelectedIds(new Set());
  }

  function handleToggleSelect(id: number, selected: boolean) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (selected) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }

  function handleSelectAllVisible(selected: boolean) {
    setSelectedIds((current) => {
      const next = new Set(current);
      pagination.items.forEach((project) => {
        if (selected) {
          next.add(project.id);
        } else {
          next.delete(project.id);
        }
      });
      return next;
    });
  }

  async function handleConfirmDelete() {
    const idsToDelete = Array.from(selectedIds);
    if (idsToDelete.length === 0) return;

    const deleted = await manager.removeProjects(idsToDelete);
    setShowConfirmDelete(false);

    if (deleted) {
      setDeletedCount(idsToDelete.length);
      setSelectedIds(new Set());
      setShowSuccessModal(true);
    }
  }

  return (
    <ProjectPageShell
      title="Eliminar proyectos"
      description={
        selectedCount === 0
          ? "Selecciona uno o varios proyectos para eliminarlos."
          : `${selectedCount} proyecto${selectedCount > 1 ? "s" : ""} seleccionado${selectedCount > 1 ? "s" : ""}.`
      }
    >
      <FeedbackMessage message={manager.pageError} type="error" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {manager.projects.length > 0 ? <ProjectSearch value={searchTerm} onChange={handleSearchChange} /> : <span />}
        <Button
          type="button"
          disabled={selectedCount === 0 || manager.isDeleting}
          onClick={() => setShowConfirmDelete(true)}
          className="bg-red-600 text-white hover:bg-red-700"
        >
          <Trash2 className="size-4" />
          {manager.isDeleting ? "Eliminando..." : `Eliminar${selectedCount > 0 ? ` (${selectedCount})` : ""}`}
        </Button>
      </div>

      {manager.isLoading ? (
        <div className="rounded-2xl border border-[#A5D7E8] bg-white px-6 py-10 text-center text-sm text-[#4B778D] shadow-sm">
          Cargando proyectos...
        </div>
      ) : (
        <ProjectTable
          projects={pagination.items}
          emptyMessage={searchTerm ? "No se encontraron proyectos con ese criterio." : "No hay proyectos para eliminar."}
          selectable
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onSelectAll={handleSelectAllVisible}
        />
      )}

      <ProjectPagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        startIndex={pagination.startIndex}
        endIndex={pagination.endIndex}
        totalItems={filteredProjects.length}
        onPageChange={setCurrentPage}
      />

      <DeleteConfirmationModal
        isOpen={showConfirmDelete}
        title={`Esta seguro de que desea eliminar ${selectedCount > 1 ? "estos proyectos" : "este proyecto"}?`}
        message="Esta accion no se puede deshacer."
        isLoading={manager.isDeleting}
        onConfirm={() => void handleConfirmDelete()}
        onCancel={() => setShowConfirmDelete(false)}
      />

      <ConfirmationModal
        isOpen={showSuccessModal}
        title="Exito"
        message={manager.successMessage || `${deletedCount > 1 ? "Proyectos eliminados" : "Proyecto eliminado"} correctamente.`}
        onClose={() => setShowSuccessModal(false)}
      />
    </ProjectPageShell>
  );
}

function filterProjectsByTitle(projects: ProjectItem[], searchTerm: string) {
  const normalizedSearch = searchTerm.trim().toLowerCase();
  if (!normalizedSearch) return projects;

  return projects.filter((project) => project.nombre.toLowerCase().includes(normalizedSearch));
}
