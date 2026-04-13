import { useState } from 'react';
import { createProject, uploadImage } from "@/services/ProjectService";
export interface Project {
  nombre: string;
  descripcion: string;
  tecnologias: { id: number; name: string }[];
  rol: string;
  rol_id?: number;
  fechaInicio: string;
  fechaFin?: string;
  is_current: boolean; 
  github?: string;
  demo?: string;
  image?: string;
}

function projectFromCreatePayload(
  payload: {
    title: string;
    description: string;
    initial_date: string;
    final_date: string | null;
    url_to_project: string | null;
    url_to_deploy: string | null;
    photoghaph: string | null;
    rol_id?: number;
    is_current: boolean;
  },
  selectedTechs: { id: number; name: string }[],
  selectedRole: { id: number; name: string } | null
): Project {
  return {
    nombre: payload.title,
    descripcion: payload.description,
    tecnologias: selectedTechs,
    rol: selectedRole?.name || "", 
    rol_id: payload.rol_id,
    fechaInicio: payload.initial_date,
    fechaFin: payload.final_date ?? undefined,
    is_current: payload.is_current,
    github: payload.url_to_project ?? undefined,
    demo: payload.url_to_deploy ?? undefined,
    image: payload.photoghaph ?? "",
  };
}

export const useCreateProyect = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [errors, setErrors] = useState<any>({});
  const [success, setSuccess] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openModal = (index: number | null = null) => {
    setEditingIndex(index);
    setErrors({});
    setPreview(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPreview(null);
    setEditingIndex(null);
    setErrors({});
  };
  
  const handleChange = (e: any) => {
    const { name, value } = e.target;

    let error = "";
    const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
    if (name === "nombre") {
      if (!value.trim()) {
        error = "El campo Nombre del proyecto es obligatorio.";
      } 
    }
    if (name === "descripcion") {
        if (value.length > 250) {
        error = "La descripción no puede exceder 250 caracteres.";
        }
    }
    if (name === "techSearch") {
      const trimmed = value.trim();
      // Permite letras, números y símbolos clásicos de programación (C#, C++, .NET)
      const regexValida = /^[a-zA-Z0-9\s+#.-]*$/;
      // Verifica si al menos contiene una letra (para evitar nombres como "123")
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
    if (name === "fechaInicio" || name === "fechaFin") {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate > today) {
        error = "La fecha no puede ser mayor a la fecha actual.";
      }

      // Validación cruzada
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
    setErrors((prev: any) => {
      const updated = { ...prev };
      if (error) {
        updated[name] = error;
      } else {
        delete updated[name]; 
      }
      if (name === "fechaInicio" || name === "fechaFin") {
        delete updated.fechaInicio;
        delete updated.fechaFin;

        if (error) updated.fechaError = error;
        else delete updated.fechaError;
      } else {
        updated[name] = error;
      }

    return updated;
    });
  };
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    selectedTechs: { id: number; name: string }[],
    selectedRole: { id: number; name: string } | null,
    isCurrentFromUi: boolean
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const nombre = (formData.get('nombre') as string) || "";
    const descripcion = (formData.get('descripcion') as string) || "";
    const fechaInicio = formData.get('fechaInicio') as string;
    const fechaFinRaw = formData.get('fechaFin') as string;
    const fechaFin = fechaFinRaw ? fechaFinRaw : null;
    const is_current = isCurrentFromUi;
    const github = (formData.get('github') as string) || "";
    const demo = (formData.get('demo') as string) || "";
    const file = formData.get("image");
    let newErrors: any = {};
    const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;

    // --- VALIDACIONES PREVIAS (Nombre, Tecnologías, Rol) ---
    if (!nombre || !nombre.trim()) {
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
    
    if (selectedTechs.length === 0) {
      newErrors.tecnologias = "Debes seleccionar al menos una tecnología.";
    } else if (selectedTechs.length > 10) {
      newErrors.tecnologias = "Se debe permitir seleccionar un máximo de 10 tecnologías.";
    }

    if (!selectedRole) {
      newErrors.rol = "Debes seleccionar un rol.";
    }
    // --- VALIDACIÓN: FECHA ---
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
        newErrors.fechaInicio = "Las fechas no pueden ser futuras.";
      }

      if (inicio >= fin) {
        newErrors.fechaError = "La fecha de inicio debe ser menor que la fecha final.";
      }
    }

    // --- VALIDACIÓN: GITHUB ---
    if (github.trim()) {
      if (github.length > 50) {
        newErrors.github = "El campo Enlace de GitHub permite un máximo de 50 caracteres.";
      } else if (!urlRegex.test(github)) {
        newErrors.github = "El enlace de GitHub debe ser una URL válida.";
      } else if (!github.includes("github.com")) {
        newErrors.github = "El enlace debe pertenecer al dominio github.com.";
      }
    }

    // --- VALIDACIÓN: DEMO ---
    if (demo.trim()) {
      if (demo.length > 100) {
        newErrors.demo = "El campo Enlace a la demo permite un máximo de 100 caracteres.";
      } else if (!urlRegex.test(demo)) {
        newErrors.demo = "El enlace demo debe ser una URL válida.";
      }
    }

    // --- VALIDACIÓN: IMAGEN ---
    if (typeof Blob !== "undefined" && file instanceof Blob && file.size > 0) {
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
      const technologyIds = selectedTechs.map(t => t.id);
      let imageUrl: string | null = null;

      const fileInput = formData.get("image");
      const hasImage =
        typeof Blob !== "undefined" &&
        fileInput instanceof Blob &&
        fileInput.size > 0;

      if (hasImage) {
        imageUrl = await uploadImage(fileInput);
      }
      const payload = {
        title: nombre,
        description: descripcion,
        initial_date: fechaInicio,
        final_date: is_current ? null : fechaFin,
        url_to_project: github || null,
        url_to_deploy: demo || null,
        photoghaph: imageUrl,
        technologies: technologyIds,
        role_id: selectedRole?.id,
        is_current,
      };

      await createProject(payload);

      setProjects((prev) => [
        ...prev,
        projectFromCreatePayload(payload, selectedTechs, selectedRole),
      ]);

      closeModal();
      setSuccess("Proyecto guardado correctamente.");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err: any) {
    let message = "No se pudo guardar el proyecto. Revisa los datos ingresados.";

    if (err.response && err.response.data) {
      const data = err.response.data;

      if (data.message === "The given data was invalid.") {
        message = "Los datos proporcionados son inválidos. Por favor, revisa los campos marcados.";
      } 
      else if (data.errors) {

        const firstErrorKey = Object.keys(data.errors)[0];
        message = data.errors[firstErrorKey][0]; 
      }
      else if (data.message) {
        message = data.message;
      }
    } else if (err instanceof Error) {
      message = err.message;
    }

    console.error(err);
    setErrors((prev: any) => ({ ...prev, form: message }));
  } finally {
      setIsSubmitting(false);
    }
  };

  return {
    projects, isModalOpen, editingIndex, errors, success, setSuccess, preview,
    setPreview, isSubmitting,
    handleDelete: (index: number) => setProjects(projects.filter((_, i) => i !== index)),
    handleEdit: (index: number) => { setEditingIndex(index); setIsModalOpen(true); },
    handleSubmit, handleChange, openModal, closeModal
  };
};
