import { useMemo, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { useProjectsManager, type ProjectItem } from "@/hooks/useProjectsManager";
import {
  FeedbackMessage,
  filterProjects,
  paginateProjects,
  ProjectForm,
  ProjectPageShell,
  ProjectPagination,
  ProjectSearch,
  ProjectTable,
} from "@/pages/projects/ProjectPageParts";

export default function EditProjectsPage() {
  const manager = useProjectsManager();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);

  const filteredProjects = useMemo(() => filterProjects(manager.projects, searchTerm), [manager.projects, searchTerm]);
  const pagination = paginateProjects(filteredProjects, currentPage);

  function handleSearchChange(value: string) {
    setSearchTerm(value);
    setCurrentPage(1);
  }

  function handleProjectSelect(project: ProjectItem) {
    manager.startEdit(project);
    setIsEditing(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const saved = await manager.submitProject(event);
    if (saved) setIsEditing(false);
  }

  if (isEditing && manager.editingProject) {
    return (
      <ProjectPageShell title="Editar proyecto" description={`Actualiza la informacion de ${manager.editingProject.nombre}.`}>
        <FeedbackMessage message={manager.successMessage} type="success" />
        <ProjectForm
          formData={manager.formData}
          errors={manager.errors}
          technologies={manager.technologies}
          roleOptions={manager.roleOptions}
          selectedTechs={manager.selectedTechs}
          preview={manager.preview}
          isSaving={manager.isSaving}
          submitLabel="Guardar cambios"
          onSubmit={handleSubmit}
          onCancel={() => {
            manager.resetForm();
            setIsEditing(false);
          }}
          onFieldChange={manager.updateField}
          onTechnologyAdd={manager.addTechnology}
          onTechnologyRemove={manager.removeTechnology}
          onImageChange={manager.handleImageChange}
          onImageRemove={manager.removeImage}
        />
      </ProjectPageShell>
    );
  }

  return (
    <ProjectPageShell title="Editar proyectos" description="Selecciona un proyecto para actualizar sus datos.">
      <FeedbackMessage message={manager.pageError} type="error" />
      <FeedbackMessage message={manager.successMessage} type="success" />

      {manager.projects.length > 0 ? <ProjectSearch value={searchTerm} onChange={handleSearchChange} /> : null}

      {manager.isLoading ? (
        <div className="rounded-2xl border border-[#A5D7E8] bg-white px-6 py-10 text-center text-sm text-[#4B778D] shadow-sm">
          Cargando proyectos...
        </div>
      ) : (
        <ProjectTable
          projects={pagination.items}
          emptyMessage={searchTerm ? "No se encontraron proyectos con ese criterio." : "No hay proyectos para editar."}
          onRowClick={handleProjectSelect}
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

      {manager.projects.length > 0 ? (
        <Button type="button" variant="outline" className="border-[#A5D7E8] bg-white text-[#003A6C]" onClick={() => setCurrentPage(1)}>
          Volver al inicio
        </Button>
      ) : null}
    </ProjectPageShell>
  );
}
