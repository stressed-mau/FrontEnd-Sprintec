import { useMemo, useState, type FormEvent } from "react";

import ConfirmActionModal from "@/components/ConfirmActionModal";
import ConfirmationModal from "@/components/ConfirmationModal";
import { useProjectsManager, type ProjectItem } from "@/hooks/useProjectsManager";
import {
  FeedbackMessage,
  filterProjects,
  paginateProjects,
  ProjectForm,
  ProjectFormModal,
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
  const [showConfirmEdit, setShowConfirmEdit] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
          variant="edit"
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
            canEditGithub={Boolean(manager.editingProject.github)}
            canEditDemo={Boolean(manager.editingProject.demo)}
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
