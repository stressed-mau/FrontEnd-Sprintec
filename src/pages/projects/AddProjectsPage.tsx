import { type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { useProjectsManager } from "@/hooks/useProjectsManager";
import { FeedbackMessage, ProjectForm, ProjectPageShell } from "@/pages/projects/ProjectPageParts";

export default function AddProjectsPage() {
  const navigate = useNavigate();
  const manager = useProjectsManager();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const saved = await manager.submitProject(event);
    if (saved) navigate("/proyectos/ver");
  }

  return (
    <ProjectPageShell title="Agregar proyecto" description="Registra un nuevo proyecto para mostrarlo en tu portafolio.">
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
    </ProjectPageShell>
  );
}
