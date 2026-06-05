import { useState } from "react";

import { FeedbackMessage } from "@/components/projects/FeedbackMessage";
import { ProjectDetailsModal } from "@/components/projects/ProjectDetailsModal";
import { ProjectPageShell } from "@/components/projects/ProjectPageShell";
import { ProjectPagination } from "@/components/projects/ProjectPagination";
import { ProjectSearch } from "@/components/projects/ProjectSearch";
import { ProjectTable } from "@/components/projects/ProjectTable";
import { useProjectSearchPagination } from "@/hooks/useProjectSearchPagination";
import { useProjectsManager, type ProjectItem } from "@/hooks/useProjectsManager";
import { filterProjects } from "@/lib/projectListUtils";

export default function ViewProjectsPage() {
  const manager = useProjectsManager();
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const search = useProjectSearchPagination(manager.projects, filterProjects);

  return (
    <ProjectPageShell title="Ver proyectos" description="Consulta los proyectos registrados en tu portafolio.">
      <FeedbackMessage message={manager.pageError} type="error" />

      {manager.projects.length > 0 ? <ProjectSearch value={search.searchTerm} onChange={search.handleSearchChange} /> : null}

      {manager.isLoading ? (
        <div className="rounded-2xl border border-[#A5D7E8] bg-white px-6 py-10 text-center text-sm text-[#4B778D] shadow-sm">
          Cargando proyectos...
        </div>
      ) : (
        <ProjectTable
          projects={search.pagination.items}
          emptyMessage={search.searchTerm ? "No se encontraron proyectos con ese criterio." : "No hay proyectos registrados."}
          onRowClick={setSelectedProject}
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

      <ProjectDetailsModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </ProjectPageShell>
  );
}
