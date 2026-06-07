import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import { DuplicateRegistrationModal } from "@/components/modals/DuplicateRegistrationModal";
import { FeedbackMessage } from "@/components/projects/FeedbackMessage";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { ProjectPageShell } from "@/components/projects/ProjectPageShell";
import { useProjectDuplicateGuard } from "@/hooks/useProjectDuplicateGuard";
import { useProjectsManager } from "@/hooks/useProjectsManager";

export default function AddProjectsPage() {
  const navigate = useNavigate();
  const manager = useProjectsManager();
  const duplicateGuard = useProjectDuplicateGuard(manager.projects);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!duplicateGuard.validateUniqueProjectName(manager.formData.nombre)) {
      manager.validateProjectForm();
      return;
    }

    const saved = await manager.saveProject();
    if (saved) setShowSuccessModal(true);
  }

  return (
    <ProjectPageShell title="Registrar un proyecto" description="Registra un nuevo proyecto para mostrarlo en tu portafolio.">
      <FeedbackMessage message={manager.successMessage} type="success" />
      <ProjectForm
        formData={manager.formData}
        errors={manager.errors}
        technologies={manager.technologies}
        roleOptions={manager.roleOptions}
        selectedTechs={manager.selectedTechs}
        preview={manager.preview}
        isSaving={manager.isSaving}
        submitLabel="Registrar proyecto"
        onSubmit={handleSubmit}
        onCancel={() => navigate("/proyectos/ver")}
        onFieldChange={manager.updateField}
        onTechnologyAdd={manager.addTechnology}
        onTechnologyRemove={manager.removeTechnology}
        onImageChange={manager.handleImageChange}
        onImageRemove={manager.removeImage}
      />
      <ConfirmationModal
        isOpen={showSuccessModal}
        message="El proyecto ha sido registrado correctamente."
        onClose={() => {
          setShowSuccessModal(false);
          navigate("/proyectos/ver");
        }}
      />
      <DuplicateRegistrationModal
        title="Proyecto duplicado"
        message={duplicateGuard.duplicateMessage}
        onClose={duplicateGuard.clearDuplicateMessage}
      />
    </ProjectPageShell>
  );
}
