
import { useState } from 'react';
import { createProject, getProjects, uploadImage } from "@/services/ProjectService";

import { useEffect } from "react";
export interface Project {
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

export const useCreateProyect = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [errors, setErrors] = useState<any>({});
  const [success, setSuccess] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();

        const mapped = data.map((p: any) => ({
          nombre: p.title,
          descripcion: p.description,
          tecnologias: p.technologies || [],
          rol: p.project_rol,
          fechaInicio: p.initial_date,
          fechaFin: p.final_date,
          is_current: p.is_current,
          github: p.url_to_project,
          demo: p.url_to_deploy,
          image: p.photoghaph || ""
        }));

        setProjects(mapped);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProjects();
  }, []);
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
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    selectedTechs: { id: number; name: string }[]
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const nombre = (formData.get('nombre') as string) || "";
    const descripcion = (formData.get('descripcion') as string) || "";
    const rol = (formData.get('rol') as string) || "";
    const fechaInicio = formData.get('fechaInicio') as string;
    const fechaFinRaw = formData.get('fechaFin') as string;
    const fechaFin = fechaFinRaw ? fechaFinRaw : null;
    const is_current = formData.get('is_current') === 'on';
    const github = (formData.get('github') as string) || "";
    const demo = (formData.get('demo') as string) || "";
    const file = formData.get('image') as File | null;

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
    if (selectedTechs.length === 0) {
      newErrors.tecnologias = "Debes seleccionar al menos una tecnología.";
    }
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
    const technologyIds = selectedTechs.map(t => t.id);
    let imageUrl = null;

    if (file && file.size > 0) {
      imageUrl = await uploadImage(file);
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
      project_rol: rol, 
      is_current,
    };

    await createProject(payload);
    const data = await getProjects();

    const mapped = data.map((p: any) => ({
      nombre: p.title,
      descripcion: p.description,
      tecnologias: p.technologies || [],
      rol: p.project_rol,
      fechaInicio: p.initial_date,
      fechaFin: p.final_date,
      is_current: p.is_current,
      github: p.url_to_project,
      demo: p.url_to_deploy,
      image: p.photoghaph || ""
    }));

    setProjects(mapped);
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