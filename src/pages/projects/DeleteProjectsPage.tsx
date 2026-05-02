import { Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import ConfirmationModal from "@/components/ConfirmationModal";
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
      description={
        selectedId == null
          ? "Selecciona un proyecto para eliminarlo."
          : "1 proyecto seleccionado."
      }
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

      {showConfirmDelete ? (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-red-100">
              <Trash2 className="size-7 text-red-600" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-[#003A6C]">
              ¿Está seguro de que desea eliminar este proyecto?
            </h3>
            <p className="mb-6 text-sm text-gray-500">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => void handleConfirmDelete()}
                disabled={manager.isDeleting}
                className="flex-1 rounded-xl bg-red-600 py-2.5 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {manager.isDeleting ? "Eliminando..." : "Eliminar"}
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmDelete(false)}
                disabled={manager.isDeleting}
                className="flex-1 rounded-xl bg-gray-100 py-2.5 font-semibold text-gray-700 hover:bg-gray-200 disabled:opacity-60"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      ) : null}

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
