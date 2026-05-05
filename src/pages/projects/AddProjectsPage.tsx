import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import ConfirmationModal from "@/components/ConfirmationModal";
import { useProjectsManager } from "@/hooks/useProjectsManager";
import { FeedbackMessage, ProjectForm, ProjectPageShell } from "@/pages/projects/ProjectPageParts";

export default function AddProjectsPage() {
  const navigate = useNavigate();
  const manager = useProjectsManager();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const saved = await manager.submitProject(event);
    if (saved) setShowSuccessModal(true);
  }

  return (
    <ProjectPageShell title="Agregar un proyecto" description="Agrega un nuevo proyecto para mostrarlo en tu portafolio.">
      <FeedbackMessage message={manager.successMessage} type="success" />
      <ProjectForm
        formData={manager.formData}
        errors={manager.errors}
        technologies={manager.technologies}
        roleOptions={manager.roleOptions}
        selectedTechs={manager.selectedTechs}
        preview={manager.preview}
        isSaving={manager.isSaving}
        submitLabel="Agregar proyecto"
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
    </ProjectPageShell>
  );
}
