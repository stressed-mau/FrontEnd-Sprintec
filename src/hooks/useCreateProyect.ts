import { useEffect, useState } from "react";

import { api } from "@/services/api";
import { uploadImage } from "@/services/ProjectService";

export interface Project {
  id?: number;
  nombre: string;
  descripcion: string;
  tecnologias: { id: number; name: string }[];
  rol: string;
  fechaInicio: string;
  fechaFin?: string;
  is_current: boolean;
  github?: string;
  demo?: string;
  image?: string;
}

type ProjectErrors = Record<string, string>;

type CreateProjectPayload = {
  id?: number;
  title: string;
  description: string;
  initial_date: string;
  final_date: string | null;
  url_to_project: string | null;
  url_to_deploy: string | null;
  image_id: number;
  project_rol: string | null;
  is_current: boolean;
  technologies?: number[];
};

function projectFromCreatePayload(
  payload: CreateProjectPayload,
  selectedTechs: { id: number; name: string }[],
  selectedRole: string | null,
): Project {
  return {
    id: payload.id,
    nombre: payload.title,
    descripcion: payload.description,
    tecnologias: selectedTechs,
    rol: selectedRole || "",
    fechaInicio: payload.initial_date,
    fechaFin: payload.final_date ?? undefined,
    is_current: payload.is_current,
    github: payload.url_to_project ?? undefined,
    demo: payload.url_to_deploy ?? undefined,
    // El backend ahora requiere `image_id`. Si no refrescamos por GET, no tenemos URL aún.
    image: undefined,
  };
}

function mapBackendErrors(backendErrors: Record<string, string[] | string> | undefined): ProjectErrors {
  if (!backendErrors) return {};

  const fieldMap: Record<string, string> = {
    title: "nombre",
    description: "descripcion",
    technologies: "tecnologias",
    technologies_id: "tecnologias",
    languages: "tecnologias",
    project_rol: "rol",
    rol: "rol",
    initial_date: "fechaInicio",
    final_date: "fechaFin",
    url_to_project: "github",
    url_to_deploy: "demo",
    image_id: "image",
    image: "image",
  };

  return Object.entries(backendErrors).reduce<ProjectErrors>((acc, [key, value]) => {
    const targetKey = fieldMap[key] ?? key;
    acc[targetKey] = Array.isArray(value) ? value[0] : value;
    return acc;
  }, {});
}

export const useCreateProyect = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [errors, setErrors] = useState<ProjectErrors>({});
  const [success, setSuccess] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCurrent, setIsCurrent] = useState(false);
  const [selectedTechs, setSelectedTechs] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [techSearch, setTechSearch] = useState("");
  const [roleSearch, setRoleSearch] = useState("");

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await api.get("/projects");
        if (res.data.success) {
          const proyectosTransformados = res.data.data.projects.map((proy: any) =>
            projectFromCreatePayload(
              {
                id: proy.id,
                title: proy.title,
                description: proy.description,
                initial_date: proy.initial_date,
                final_date: proy.final_date,
                url_to_project: proy.url_to_project,
                url_to_deploy: proy.url_to_deploy,
                image_id: Number(proy.image_id ?? 0),
                project_rol: proy.project_rol,
                is_current: proy.is_current,
              },
              proy.languages,
              proy.project_rol,
            ),
          );

          setProjects(proyectosTransformados);
        }
      } catch (error) {
        console.error("Error al cargar:", error);
      }
    };

    loadProjects();
  }, []);

  const openModal = (index: number | null = null) => {
    setEditingIndex(index);
    setErrors({});
    setPreview(null);

    if (index === null) {
      setSelectedRole(null);
      setSelectedTechs([]);
      setIsCurrent(false);
      setTechSearch("");
      setRoleSearch("");
    }

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPreview(null);
    setEditingIndex(null);
    setErrors({});
    setSelectedRole(null);
    setSelectedTechs([]);
    setIsCurrent(false);

    const fileNameLabel = document.getElementById("file-name");
    if (fileNameLabel) fileNameLabel.textContent = "Ningún archivo seleccionado";

    const fileInput = document.getElementById("image") as HTMLInputElement | null;
    if (fileInput) fileInput.value = "";
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    let error = "";
    const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;

    if (name === "nombre" && !value.trim()) {
      error = "El campo Nombre del proyecto es obligatorio.";
    }

    if (name === "descripcion") {
      if (!value.trim()) {
        error = "La descripción es obligatoria.";
      } else if (value.length > 250) {
        error = "La descripción no puede exceder 250 caracteres.";
      }
    }

    if (name === "techSearch") {
      const trimmed = value.trim();
      const regexValida = /^[a-zA-Z0-9\s+#.-]*$/;
      const tieneLetras = /[a-zA-Z]/.test(trimmed);

      if (trimmed.length > 0) {
        if (trimmed.length < 2) {
          error = "El nombre de la tecnología es muy corto.";
        } else if (trimmed.length > 20) {
          error = "El nombre de la tecnología no puede exceder los 20 caracteres.";
        } else if (!regexValida.test(trimmed)) {
          error = "La tecnología contiene caracteres no permitidos.";
        } else if (!tieneLetras) {
          error = "El nombre de la tecnología debe contener al menos una letra.";
        }
      }
    }

    if (name === "rol") {
      if (!value.trim()) {
        error = "El campo Tu rol en el proyecto es obligatorio.";
      } else if (value && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
        error = "El campo Tu rol en el proyecto contiene caracteres numéricos. Sólo se permiten letras.";
      } else if (value.length > 50) {
        error = "El rol no puede exceder 50 caracteres.";
      }
    }

    if (name === "github") {
      if (value.trim()) {
        if (value.length > 50) {
          error = "El campo Enlace de GitHub permite un máximo de 50 caracteres.";
        } else if (!urlRegex.test(value)) {
          error = "El enlace de GitHub debe ser una URL válida.";
        } else if (!value.includes("github.com")) {
          error = "El enlace debe pertenecer al dominio github.com.";
        }
      }
    }

    if (name === "demo" && value.trim()) {
      if (value.length > 100) {
        error = "El campo Enlace a la demo permite un máximo de 100 caracteres.";
      } else if (!urlRegex.test(value)) {
        error = "El enlace demo debe ser una URL válida.";
      }
    }

    if (name === "fechaInicio" || name === "fechaFin") {
      const selectedDate = value ? new Date(value) : null;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate && selectedDate > today) {
        error = "La fecha no puede ser mayor a la fecha actual.";
      }

      const form = e.target.form;
      const fechaInicio = form?.fechaInicio?.value;
      const fechaFin = form?.fechaFin?.value;

      if (fechaInicio && fechaFin) {
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);

        if (inicio >= fin) {
          error = "La fecha de inicio debe ser menor que la fecha final.";
        }
      }
    }

    setErrors((prev) => {
      const updated = { ...prev };

      if (name === "fechaInicio" || name === "fechaFin") {
        delete updated.fechaInicio;
        delete updated.fechaFin;

        if (error) updated.fechaError = error;
        else delete updated.fechaError;

        return updated;
      }

      if (error) {
        updated[name] = error;
      } else {
        delete updated[name];
      }

      return updated;
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    selectedTechs: { id: number; name: string }[],
    selectedRole: string | null,
    isCurrentFromUi: boolean,
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const nombre = (formData.get("nombre") as string) || "";
    const descripcion = (formData.get("descripcion") as string) || "";
    const fechaInicio = formData.get("fechaInicio") as string;
    const fechaFinRaw = formData.get("fechaFin") as string;
    const fechaFin = fechaFinRaw ? fechaFinRaw : null;
    const is_current = isCurrentFromUi;
    const github = (formData.get("github") as string) || "";
    const demo = (formData.get("demo") as string) || "";
    const file = formData.get("image");

    const newErrors: ProjectErrors = {};
    const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;

    if (!nombre.trim()) {
      newErrors.nombre = "El campo Nombre del proyecto es obligatorio.";
    } else {
      const nombreRepetido = projects.some((p, index) => {
        if (editingIndex !== null && index === editingIndex) return false;
        return p.nombre.toLowerCase() === nombre.trim().toLowerCase();
      });

      if (nombreRepetido) {
        newErrors.nombre = "Ya existe un proyecto registrado con ese nombre";
      }
    }

    if (!descripcion.trim()) {
      newErrors.descripcion = "La descripción es obligatoria.";
    } else if (descripcion.length > 250) {
      newErrors.descripcion = "La descripción no puede exceder 250 caracteres.";
    }

    if (selectedTechs.length === 0) {
      newErrors.tecnologias = "Debes seleccionar al menos una tecnología.";
    } else if (selectedTechs.length > 10) {
      newErrors.tecnologias = "Se permite un máximo de 10 tecnologías.";
    }

    if (!selectedRole || selectedRole.trim() === "") {
      newErrors.rol = "Debes seleccionar un rol.";
    }

    if (!fechaInicio) {
      newErrors.fechaInicio = "La fecha de inicio es obligatoria.";
    }

    if (!is_current && !fechaFin) {
      newErrors.fechaFin = "La fecha final es obligatoria si no estás trabajando actualmente.";
    }

    if (fechaInicio && fechaFin) {
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (inicio > today || fin > today) {
        newErrors.fechaError = "Las fechas no pueden ser futuras.";
      }

      if (inicio >= fin) {
        newErrors.fechaError = "La fecha de inicio debe ser menor que la fecha final.";
      }
    }

    if (github.trim()) {
      if (github.length > 50) {
        newErrors.github = "Máximo 50 caracteres.";
      } else if (!urlRegex.test(github) || !github.includes("github.com")) {
        newErrors.github = "Debe ser una URL válida de GitHub.";
      }
    }

    if (demo.trim()) {
      if (demo.length > 100) {
        newErrors.demo = "El campo Enlace a la demo permite un máximo de 100 caracteres.";
      } else if (!urlRegex.test(demo)) {
        newErrors.demo = "El enlace demo debe ser una URL válida.";
      }
    }

    const hasSelectedImage =
      typeof File !== "undefined" && file instanceof File && file.size > 0;

    // Backend: `image_id` es requerido => debemos subir imagen sí o sí.
    if (!hasSelectedImage) {
      newErrors.image = "La imagen del proyecto es obligatoria.";
    } else {
      const allowedTypes = ["image/jpeg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        newErrors.image = "Formato de imagen no permitido.";
      } else if (file.size > 2 * 1024 * 1024) {
        newErrors.image = "La imagen no debe superar los 2 MB.";
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      const isEditing = editingIndex !== null;
      const projectId = isEditing ? projects[editingIndex].id : null;
      const technologyIds = selectedTechs.map((t) => t.id);
      let imageId: number | null = null;

      const fileInput = formData.get("image");
      const hasImage =
        typeof File !== "undefined" &&
        fileInput instanceof File &&
        fileInput.size > 0;

      if (!hasImage) {
        throw new Error("La imagen del proyecto es obligatoria.");
      }

      imageId = await uploadImage(fileInput);

      const payload: CreateProjectPayload = {
        title: nombre,
        description: descripcion,
        initial_date: fechaInicio,
        final_date: is_current ? null : fechaFin,
        url_to_project: github || null,
        url_to_deploy: demo || null,
        image_id: imageId,
        technologies: technologyIds,
        project_rol: selectedRole,
        is_current,
      } as CreateProjectPayload & { technologies: number[] };

      if (isEditing && projectId) {
        await api.put(`/projects/${projectId}`, payload);
        setProjects((prev) => prev.map((p, i) => (i === editingIndex ? { ...p, ...payload, rol: selectedRole || "" } : p)));
        closeModal();
        setSuccess("¡Proyecto actualizado!");
      } else {
        const res = await api.post("/projects", payload);

        if (res.data.success) {
          setProjects((prev) => [
            ...prev,
            projectFromCreatePayload(payload, selectedTechs, selectedRole),
          ]);

          closeModal();
          setSuccess("¡Proyecto registrado exitosamente!");
        }
      }
    } catch (err: any) {
      let message = "No se pudo guardar el proyecto. Revisa los datos ingresados.";

      if (err.response && err.response.data) {
        const data = err.response.data;

        if (data.errors) {
          const mappedErrors = mapBackendErrors(data.errors);
          setErrors((prev) => ({ ...prev, ...mappedErrors }));

          const firstErrorKey = Object.keys(mappedErrors)[0];
          if (firstErrorKey) {
            message = mappedErrors[firstErrorKey];
          }
        } else if (data.message === "The given data was invalid.") {
          message = "Los datos proporcionados son inválidos. Por favor, revisa los campos marcados.";
        } else if (data.message) {
          message = data.message;
        }
      } else if (err instanceof Error) {
        message = err.message;
      }

      console.error(err);
      setErrors((prev) => ({ ...prev, form: message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    projects,
    isModalOpen,
    editingIndex,
    errors,
    success,
    setSuccess,
    preview,
    setPreview,
    isSubmitting,
    isCurrent,
    setIsCurrent,
    selectedTechs,
    setSelectedTechs,
    selectedRole,
    setSelectedRole,
    techSearch,
    setTechSearch,
    roleSearch,
    setRoleSearch,
    handleDelete: (index: number) => setProjects(projects.filter((_, i) => i !== index)),
    handleEdit: (index: number) => {
      setEditingIndex(index);
      setIsModalOpen(true);
    },
    handleSubmit,
    handleChange,
    openModal,
    closeModal,
  };
};
