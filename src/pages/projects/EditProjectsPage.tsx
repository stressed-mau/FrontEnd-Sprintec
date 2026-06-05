import { useState, type FormEvent } from "react";

import ConfirmActionModal from "@/components/ConfirmActionModal";
import ConfirmationModal from "@/components/ConfirmationModal";
import { FeedbackMessage } from "@/components/projects/FeedbackMessage";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { ProjectFormModal } from "@/components/projects/ProjectFormModal";
import { ProjectPageShell } from "@/components/projects/ProjectPageShell";
import { ProjectPagination } from "@/components/projects/ProjectPagination";
import { ProjectSearch } from "@/components/projects/ProjectSearch";
import { ProjectTable } from "@/components/projects/ProjectTable";
import { useProjectSearchPagination } from "@/hooks/useProjectSearchPagination";
import { useProjectsManager, type ProjectItem } from "@/hooks/useProjectsManager";
import { filterProjects } from "@/lib/projectListUtils";

export default function EditProjectsPage() {
  const manager = useProjectsManager();
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmEdit, setShowConfirmEdit] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const search = useProjectSearchPagination(manager.projects, filterProjects);

  function handleProjectSelect(project: ProjectItem) {
    manager.startEdit(project);
    setIsEditing(true);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!manager.canSaveProject) {
      manager.validateProjectForm();
      return;
    }
    if (manager.validateProjectForm()) {
      setShowConfirmEdit(true);
    }
  }

  async function handleConfirmEdit() {
    const saved = await manager.saveProject();
    setShowConfirmEdit(false);
    if (saved) {
      setIsEditing(false);
      setShowSuccessModal(true);
    }
  }

  return (
    <ProjectPageShell title="Editar Proyectos" description="Haz clic en una fila para editar">
      <FeedbackMessage message={manager.pageError} type="error" />
      <FeedbackMessage message={manager.successMessage} type="success" />

      {manager.projects.length > 0 ? <ProjectSearch value={search.searchTerm} onChange={search.handleSearchChange} /> : null}

      {manager.isLoading ? (
        <div className="rounded-2xl border border-[#A5D7E8] bg-white px-6 py-10 text-center text-sm text-[#4B778D] shadow-sm">
          Cargando proyectos...
        </div>
      ) : (
        <ProjectTable
          projects={search.pagination.items}
          emptyMessage={search.searchTerm ? "No se encontraron proyectos con ese criterio." : "No hay proyectos para editar."}
          onRowClick={handleProjectSelect}
          variant="edit"
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

      {isEditing && manager.editingProject ? (
        <ProjectFormModal
          title="Editar Proyecto"
          description="Actualiza la información del proyecto"
          onClose={() => {
            manager.resetForm();
            setIsEditing(false);
          }}
        >
          <ProjectForm
            formData={manager.formData}
            errors={manager.errors}
            technologies={manager.technologies}
            roleOptions={manager.roleOptions}
            selectedTechs={manager.selectedTechs}
            preview={manager.preview}
            isSaving={manager.isSaving}
            canSave={manager.canSaveProject}
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
            tone="modal"
            readOnlyFields
            canEditGithub
            canEditDemo
            canEditEndDate={manager.editingProject.is_current}
          />
        </ProjectFormModal>
      ) : null}

      <ConfirmActionModal
        isOpen={showConfirmEdit}
        title="Confirmar cambios"
        message="¿Está seguro de que desea guardar los cambios realizados?"
        confirmText={manager.isSaving ? "Guardando..." : "Aceptar"}
        cancelText="Cancelar"
        onConfirm={() => void handleConfirmEdit()}
        onCancel={() => setShowConfirmEdit(false)}
      />

      <ConfirmationModal
        isOpen={showSuccessModal}
        title="Éxito"
        message={manager.successMessage || "Proyecto actualizado correctamente."}
        onClose={() => setShowSuccessModal(false)}
      />
    </ProjectPageShell>
  );
}
