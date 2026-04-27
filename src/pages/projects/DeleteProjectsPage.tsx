import { Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { useProjectsManager } from "@/hooks/useProjectsManager";
import {
  FeedbackMessage,
  filterProjects,
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

  const filteredProjects = useMemo(() => filterProjects(manager.projects, searchTerm), [manager.projects, searchTerm]);
  const pagination = paginateProjects(filteredProjects, currentPage);

  function handleSearchChange(value: string) {
    setSearchTerm(value);
    setCurrentPage(1);
    setSelectedIds(new Set());
  }

  function handleToggleSelect(id: number, selected: boolean) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (selected) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  async function handleDelete() {
    if (selectedIds.size === 0) return;
    const confirmed = window.confirm(`Eliminar ${selectedIds.size} proyecto(s) seleccionado(s)?`);
    if (!confirmed) return;

    await manager.removeProjects(Array.from(selectedIds));
    setSelectedIds(new Set());
  }

  return (
    <ProjectPageShell
      title="Eliminar proyectos"
      description={
        selectedIds.size === 0
          ? "Selecciona uno o varios proyectos para eliminarlos."
          : `${selectedIds.size} proyecto(s) seleccionado(s).`
      }
    >
      <FeedbackMessage message={manager.pageError} type="error" />
      <FeedbackMessage message={manager.successMessage} type="success" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {manager.projects.length > 0 ? <ProjectSearch value={searchTerm} onChange={handleSearchChange} /> : <span />}
        <Button
          type="button"
          disabled={selectedIds.size === 0 || manager.isDeleting}
          onClick={handleDelete}
          className="bg-red-600 text-white hover:bg-red-700"
        >
          <Trash2 className="size-4" />
          {manager.isDeleting ? "Eliminando..." : `Eliminar (${selectedIds.size})`}
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
    </ProjectPageShell>
  );
}
