import { useMemo, useState } from "react";

import { useProjectsManager, type ProjectItem } from "@/hooks/useProjectsManager";
import {
  FeedbackMessage,
  filterProjects,
  paginateProjects,
  ProjectDetailsModal,
  ProjectPageShell,
  ProjectPagination,
  ProjectSearch,
  ProjectTable,
} from "@/pages/projects/ProjectPageParts";

export default function ViewProjectsPage() {
  const manager = useProjectsManager();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const filteredProjects = useMemo(() => filterProjects(manager.projects, searchTerm), [manager.projects, searchTerm]);
  const pagination = paginateProjects(filteredProjects, currentPage);

  function handleSearchChange(value: string) {
    setSearchTerm(value);
    setCurrentPage(1);
  }

  return (
    <ProjectPageShell title="Ver proyectos" description="Consulta los proyectos registrados en tu portafolio.">
      <FeedbackMessage message={manager.pageError} type="error" />

      {manager.projects.length > 0 ? <ProjectSearch value={searchTerm} onChange={handleSearchChange} /> : null}

      {manager.isLoading ? (
        <div className="rounded-2xl border border-[#A5D7E8] bg-white px-6 py-10 text-center text-sm text-[#4B778D] shadow-sm">
          Cargando proyectos...
        </div>
      ) : (
        <ProjectTable
          projects={pagination.items}
          emptyMessage={searchTerm ? "No se encontraron proyectos con ese criterio." : "No hay proyectos registrados."}
          onRowClick={setSelectedProject}
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

      <ProjectDetailsModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </ProjectPageShell>
  );
}
