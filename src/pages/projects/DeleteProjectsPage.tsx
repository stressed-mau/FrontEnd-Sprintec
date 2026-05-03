import { Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import ConfirmationModal from "@/components/ConfirmationModal";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
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
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const filteredProjects = useMemo(() => filterProjectsByTitle(manager.projects, searchTerm), [manager.projects, searchTerm]);
  const pagination = paginateProjects(filteredProjects, currentPage);
  const selectedProject = useMemo(
    () => manager.projects.find((project) => project.id === selectedId) ?? null,
    [manager.projects, selectedId],
  );
  const selectedIds = useMemo(() => (selectedId == null ? new Set<number>() : new Set([selectedId])), [selectedId]);

  function handleSearchChange(value: string) {
    setSearchTerm(value);
    setCurrentPage(1);
    setSelectedId(null);
  }

  function handleToggleSelect(id: number, selected: boolean) {
    setSelectedId(selected ? id : null);
  }

  async function handleConfirmDelete() {
    if (selectedId == null) return;

    const deleted = await manager.removeProjects([selectedId]);
    setShowConfirmDelete(false);

    if (deleted) {
      setSelectedId(null);
      setShowSuccessModal(true);
    }
  }

  return (
    <ProjectPageShell
      title="Eliminar proyectos"
      description={selectedId == null ? "Selecciona un proyecto para eliminarlo." : "1 proyecto seleccionado."}
    >
      <FeedbackMessage message={manager.pageError} type="error" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {manager.projects.length > 0 ? <ProjectSearch value={searchTerm} onChange={handleSearchChange} /> : <span />}
        <Button
          type="button"
          disabled={selectedId == null || manager.isDeleting}
          onClick={() => setShowConfirmDelete(true)}
          className="bg-red-600 text-white hover:bg-red-700"
        >
          <Trash2 className="size-4" />
          {manager.isDeleting ? "Eliminando..." : "Eliminar"}
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
        title="¿Está seguro de que desea eliminar este proyecto?"
        isLoading={manager.isDeleting}
        onConfirm={() => void handleConfirmDelete()}
        onCancel={() => setShowConfirmDelete(false)}
      />

      <ConfirmationModal
        isOpen={showSuccessModal}
        title="Éxito"
        message={manager.successMessage || `Proyecto${selectedProject ? ` "${selectedProject.nombre}"` : ""} eliminado correctamente.`}
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
