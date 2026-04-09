
import { useState } from 'react';

export interface Project {
  nombre: string;
  descripcion: string;
  tecnologias: string[];
  rol: string;
  fechaInicio: string;
  fechaFin: string;
  github?: string;
  demo?: string;
  image?: string;
}

export const useCreateProyect = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [errors, setErrors] = useState<any>({});
  const [success, setSuccess] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

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

    if (name === "descripcion") {
        if (value && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
        error = "El campo Descripción contiene caracteres especiales. Solo se permiten letras.";
        } else if (value.length > 250) {
        error = "La descripción no puede exceder 250 caracteres.";
        }
    }
    if (name === "rol") {
        if (value && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
        error = "El campo Tu rol en el proyecto contiene caracteres especiales. Solo se permiten letras.";
        } else if (value.length > 50) {
        error = "El rol no puede exceder 50 caracteres.";
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
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const nombre = (formData.get('nombre') as string) || "";
    const descripcion = (formData.get('descripcion') as string) || "";
    const tecnologiasRaw = (formData.get('tecnologias') as string) || "";
    const rol = (formData.get('rol') as string) || "";
    const fechaInicio = formData.get('fechaInicio') as string;
    const fechaFin = formData.get('fechaFin') as string;
    const github = (formData.get('github') as string) || "";
    const demo = (formData.get('demo') as string) || "";
    const file = formData.get('image') as File;

    let newErrors: any = {};
    const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;

    // --- VALIDACIONES PREVIAS (Nombre, Tecnologías, Rol) ---
    if (!nombre || !nombre.trim()) {
        newErrors.nombre = "El campo Nombre del proyecto es obligatorio.";
    }
    if (descripcion) {
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(descripcion)) {
            newErrors.descripcion = "El campo Descripción contiene caracteres especiales. Solo se permiten letras.";
        } 
    }
    if (!tecnologiasRaw.trim()) newErrors.tecnologias = "El campo Tecnologías es obligatorio.";
    if (!rol.trim()) newErrors.rol = "El campo Tu rol en el proyecto es obligatorio.";
    if (rol) {
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(rol)) {
            newErrors.rol = "El campo Tu rol en el proyecto contiene caracteres especiales. Solo se permiten letras.";
        } else if (rol.length > 50) {
            newErrors.rol = "El rol no puede exceder 50 caracteres.";
        }
    }
    // --- VALIDACIÓN: FECHA ---
    if (!fechaInicio) {
      newErrors.fechaInicio = "La fecha de inicio es obligatoria.";
    }

    if (!fechaFin) {
      newErrors.fechaFin = "La fecha final es obligatoria.";
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
    if (file && file.size > 0) {
      const allowedTypes = ["image/jpeg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        newErrors.image = "Formato de imagen no permitido.";
      } else if (file.size > 2 * 1024 * 1024) {
        newErrors.image = "La imagen no debe superar los 2 MB.";
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Lógica de guardado...
    const tecnologias = tecnologiasRaw.split(',').map(t => t.trim());
    const newProject: Project = {
      nombre, descripcion, tecnologias, rol, fechaInicio,
      fechaFin, github, demo,
      image: file && file.size > 0 ? URL.createObjectURL(file) : (editingIndex !== null ? projects[editingIndex].image : undefined)
    };

    if (editingIndex !== null) {
      const updated = [...projects];
      updated[editingIndex] = newProject;
      setProjects(updated);
    } else {
      setProjects([...projects, newProject]);
    }

    setSuccess("Proyecto guardado correctamente.");
    setTimeout(() => {
      setSuccess("");
      closeModal();
    }, 1500);
  };

  return {
    projects, isModalOpen, editingIndex, errors, success, setSuccess, preview,
    setPreview, handleDelete: (index: number) => setProjects(projects.filter((_, i) => i !== index)),
    handleEdit: (index: number) => { setEditingIndex(index); setIsModalOpen(true); },
    handleSubmit, handleChange, openModal, closeModal
  };
};