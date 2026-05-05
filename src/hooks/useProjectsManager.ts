import { useCallback, useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";

import {
  createProject,
  deleteProject,
  getLanguages,
  getProjects,
  getWorkOptions,
  type ProjectItem,
  type ProjectPayload,
  type ProjectTechnology,
  type WorkOptions,
  type ProjectUpdatePayload,
  updateProject,
  uploadImage,
} from "@/services/ProjectService";

export type { ProjectItem, ProjectTechnology };

export type ProjectFormValues = {
  nombre: string;
  descripcion: string;
  rol: string;
  fechaInicio: string;
  fechaFin: string;
  is_current: boolean;
  github: string;
  demo: string;
};

export type ProjectFormErrors = Partial<Record<keyof ProjectFormValues | "tecnologias" | "image" | "form", string>>;

const EMPTY_FORM: ProjectFormValues = {
  nombre: "",
  descripcion: "",
  rol: "",
  fechaInicio: "",
  fechaFin: "",
  is_current: false,
  github: "",
  demo: "",
};

const FIXED_ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Fullstack Developer",
  "Mobile Developer",
  "Software Architect",
  "Tech Lead",
  "QA Engineer",
  "Project Manager",
  "Product Manager",
  "Data Scientist",
];

const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png"];
const MAX_PROJECT_NAME_LENGTH = 60;
const MAX_PROJECT_DESCRIPTION_LENGTH = 250;
const MAX_PROJECT_URL_LENGTH = 50;

function validateUrl(value: string) {
  return /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(value);
}

function validateForm(
  form: ProjectFormValues,
  selectedTechs: ProjectTechnology[],
  imageFile: File | null,
  roleOptions: string[],
  enforceRoleOption: boolean,
) {
  const errors: ProjectFormErrors = {};
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!form.nombre.trim()) errors.nombre = "El campo Nombre del proyecto es obligatorio.";
  else if (form.nombre.trim().length > MAX_PROJECT_NAME_LENGTH) {
    errors.nombre = `El campo Nombre del proyecto permite ingresar un máximo de ${MAX_PROJECT_NAME_LENGTH} caracteres.`;
  }
  if (form.descripcion.length > MAX_PROJECT_DESCRIPTION_LENGTH) {
    errors.descripcion = `El campo Descripción permite un máximo de ${MAX_PROJECT_DESCRIPTION_LENGTH} caracteres.`;
  }
  if (!form.rol.trim()) errors.rol = "Debes seleccionar al menos un rol.";
  else if (form.rol.trim().length > 255) errors.rol = "El rol no debe exceder 255 caracteres.";
  else if (enforceRoleOption && roleOptions.length > 0 && !roleOptions.some((role) => role.toLowerCase() === form.rol.trim().toLowerCase())) {
    errors.rol = "Selecciona un rol de la lista.";
  }
  if (selectedTechs.length === 0) errors.tecnologias = "Debes seleccionar al menos una tecnología.";
  if (selectedTechs.length > 10) errors.tecnologias = "Se permite un máximo de 10 tecnologías.";
  if (!form.fechaInicio) errors.fechaInicio = "El campo Fecha de inicio es obligatorio.";
  if (!form.is_current && !form.fechaFin) {
    errors.fechaFin = "El campo Fecha de finalización es obligatorio, si el proyecto no está en curso.";
  }

  if (form.fechaInicio) {
    const startDate = new Date(form.fechaInicio);
    if (startDate > today) errors.fechaInicio = "La fecha de inicio no puede ser futura.";
  }

  if (form.fechaFin) {
    const endDate = new Date(form.fechaFin);
    if (endDate > today) errors.fechaFin = "La fecha de finalización no puede ser posterior a la fecha actual.";
    if (form.fechaInicio && new Date(form.fechaInicio) > endDate) {
      errors.fechaFin = "La fecha de finalización no puede ser anterior a la fecha de inicio.";
    }
  }

  if (form.github.trim()) {
    if (form.github.length > MAX_PROJECT_URL_LENGTH) {
      errors.github = `El campo Enlace de GitHub permite un máximo de ${MAX_PROJECT_URL_LENGTH} caracteres.`;
    } else if (!validateUrl(form.github)) {
      errors.github = "El enlace de GitHub debe ser una URL válida.";
    } else {
      const hostname = new URL(form.github).hostname.toLowerCase();
      if (hostname !== "github.com" && !hostname.endsWith(".github.com")) {
        errors.github = "El enlace debe pertenecer al dominio github.com.";
      }
    }
  }

  if (form.demo.trim()) {
    if (form.demo.length > MAX_PROJECT_URL_LENGTH) {
      errors.demo = `El campo Enlace de la demo permite un máximo de ${MAX_PROJECT_URL_LENGTH} caracteres.`;
    } else if (!validateUrl(form.demo)) {
      errors.demo = "El enlace de la demo debe ser una URL válida.";
    }
  }

  if (imageFile) {
    if (!ALLOWED_IMAGE_TYPES.includes(imageFile.type)) {
      errors.image = "El campo imagen del proyecto solo permite archivos JPG o PNG.";
    } else if (imageFile.size > MAX_IMAGE_SIZE_BYTES) {
      errors.image = "La imagen no debe superar los 2 MB.";
    }
  }

  return errors;
}

export function useProjectsManager() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [technologies, setTechnologies] = useState<ProjectTechnology[]>([]);
  const [formData, setFormData] = useState<ProjectFormValues>(EMPTY_FORM);
  const [selectedTechs, setSelectedTechs] = useState<ProjectTechnology[]>([]);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<ProjectFormErrors>({});
  const [pageError, setPageError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [workOptions, setWorkOptions] = useState<WorkOptions>({ roles: [] });

  const roleOptions = useMemo(() => (workOptions.roles.length ? workOptions.roles : FIXED_ROLES), [workOptions.roles]);

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    setPageError("");

    try {
      const remoteProjects = await getProjects();
      setProjects(remoteProjects);
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "No se pudieron cargar los proyectos.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  useEffect(() => {
    async function loadWorkOptions() {
      try {
        const options = await getWorkOptions();
        setWorkOptions(options);
      } catch {
        setWorkOptions({ roles: [] });
      }
    }

    void loadWorkOptions();
  }, []);

  useEffect(() => {
    async function loadTechnologies() {
      try {
        const remoteTechnologies = await getLanguages();
        setTechnologies(remoteTechnologies);
      } catch {
        setTechnologies([]);
      }
    }

    void loadTechnologies();
  }, []);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function updateField(field: keyof ProjectFormValues, value: string | boolean) {
    setFormData((current) => ({
      ...current,
      [field]: value,
      ...(field === "is_current" && value === true ? { fechaFin: "" } : {}),
      ...(field === "fechaFin" && typeof value === "string" && value.trim() ? { is_current: false } : {}),
    }));
    setErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function addTechnology(technologyId: string) {
    const technology = technologies.find((item) => String(item.id) === technologyId);
    if (!technology || selectedTechs.some((item) => item.id === technology.id) || selectedTechs.length >= 10) return;
    setSelectedTechs((current) => [...current, technology]);
    setErrors((current) => {
      const next = { ...current };
      delete next.tecnologias;
      return next;
    });
  }

  function removeTechnology(id: number) {
    setSelectedTechs((current) => current.filter((item) => item.id !== id));
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setErrors((current) => {
      const next = { ...current };
      delete next.image;
      return next;
    });

    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);

    if (!file) {
      setImageFile(null);
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setImageFile(null);
      event.target.value = "";
      setErrors((current) => ({
        ...current,
        image: "El campo imagen del proyecto solo permite archivos JPG o PNG.",
      }));
      return;
    }

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  function removeImage() {
    setImageFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
  }

  function startEdit(project: ProjectItem) {
    setEditingProject(project);
    setFormData({
      nombre: project.nombre,
      descripcion: project.descripcion,
      rol: project.rol,
      fechaInicio: project.fechaInicio,
      fechaFin: project.fechaFin ?? "",
      is_current: project.is_current,
      github: project.github ?? "",
      demo: project.demo ?? "",
    });
    setSelectedTechs(project.tecnologias);
    setImageFile(null);
    setPreview(project.image ?? null);
    setErrors({});
    setSuccessMessage("");
  }

  function resetForm() {
    setEditingProject(null);
    setFormData(EMPTY_FORM);
    setSelectedTechs([]);
    setImageFile(null);
    setPreview(null);
    setErrors({});
    setSuccessMessage("");
  }

  async function submitProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    return saveProject();
  }

  function validateProjectForm() {
    setSuccessMessage("");

    const newErrors = validateForm(formData, selectedTechs, imageFile, roleOptions, !editingProject);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function saveProject() {
    setSuccessMessage("");

    if (!validateProjectForm()) return false;

    setIsSaving(true);

    try {
      const imageId = !editingProject && imageFile ? await uploadImage(imageFile) : undefined;
      const createPayload: ProjectPayload = {
        title: formData.nombre.trim(),
        description: formData.descripcion.trim(),
        initial_date: formData.fechaInicio,
        final_date: formData.fechaFin || null,
        url_to_project: formData.github.trim() || null,
        url_to_deploy: formData.demo.trim() || null,
        project_rol: formData.rol,
        is_current: formData.is_current,
        technologies: selectedTechs.map((item) => item.id),
        ...(imageId ? { image_id: imageId } : {}),
      };

      if (editingProject) {
        const updatePayload: ProjectUpdatePayload = {
          description: createPayload.description,
          is_current: createPayload.is_current,
          ...(createPayload.url_to_project ? { url_to_project: createPayload.url_to_project } : {}),
          ...(createPayload.url_to_deploy ? { url_to_deploy: createPayload.url_to_deploy } : {}),
          final_date: createPayload.final_date,
        };

        await updateProject(editingProject.id, updatePayload);
        setSuccessMessage("Proyecto actualizado correctamente.");
      } else {
        await createProject(createPayload);
        resetForm();
        setSuccessMessage("El proyecto ha sido registrado correctamente.");
      }

      await loadProjects();
      return true;
    } catch (error) {
      setErrors((current) => ({
        ...current,
        form: error instanceof Error ? error.message : "No se pudo guardar el proyecto.",
      }));
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function removeProjects(ids: number[]) {
    if (ids.length === 0) return false;
    setIsDeleting(true);
    setPageError("");

    try {
      await Promise.all(ids.map((id) => deleteProject(id)));
      setSuccessMessage("Proyecto eliminado correctamente.");
      await loadProjects();
      return true;
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "No se pudieron eliminar los proyectos.");
      return false;
    } finally {
      setIsDeleting(false);
    }
  }

  return {
    projects,
    technologies,
    roleOptions,
    formData,
    selectedTechs,
    editingProject,
    imageFile,
    preview,
    errors,
    pageError,
    successMessage,
    isLoading,
    isSaving,
    isDeleting,
    updateField,
    addTechnology,
    removeTechnology,
    handleImageChange,
    removeImage,
    startEdit,
    resetForm,
    submitProject,
    validateProjectForm,
    saveProject,
    removeProjects,
  };
}
