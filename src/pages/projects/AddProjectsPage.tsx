import { useState, type FormEvent } from "react";
import { AlertCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import ConfirmationModal from "@/components/modals/ConfirmationModal";
import { useProjectsManager } from "@/hooks/useProjectsManager";
import { FeedbackMessage, ProjectForm, ProjectPageShell } from "@/pages/projects/ProjectPageParts";

function normalizeProjectName(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

export default function AddProjectsPage() {
  const navigate = useNavigate();
  const manager = useProjectsManager();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [duplicateMessage, setDuplicateMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setDuplicateMessage("");

    const projectName = normalizeProjectName(manager.formData.nombre);
    const hasDuplicateProject = Boolean(projectName) && manager.projects.some((project) => normalizeProjectName(project.nombre) === projectName);

    if (hasDuplicateProject) {
      manager.validateProjectForm();
      setDuplicateMessage("Ya existe un proyecto registrado con ese nombre. Ingresa un nombre diferente.");
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
      {duplicateMessage ? (
        <div className="fixed inset-0 z-150 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-[32px] bg-white p-8 shadow-2xl">
            <button
              type="button"
              onClick={() => setDuplicateMessage("")}
              className="absolute right-5 top-5 text-gray-400 transition-colors hover:text-gray-600"
              aria-label="Cerrar alerta de proyecto duplicado"
            >
              <X className="size-6" />
            </button>
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="size-8 text-red-600" />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-[#003A6C]">Proyecto duplicado</h3>
              <p className="mb-8 text-lg text-[#6B7280]">{duplicateMessage}</p>
              <button
                type="button"
                onClick={() => setDuplicateMessage("")}
                className="w-full rounded-xl bg-[#003A6C] py-4 text-xl font-bold text-white shadow-lg transition-all hover:bg-[#002a50] active:scale-[0.98]"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </ProjectPageShell>
  );
}
