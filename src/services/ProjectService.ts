import { api } from "@/services/api";
import axios from "axios";

const IMAGE_UPLOAD_TIMEOUT_MS = 180_000;

export type ProjectTechnology = {
  id: number;
  name: string;
};

export type ProjectItem = {
  id: number;
  nombre: string;
  descripcion: string;
  tecnologias: ProjectTechnology[];
  rol: string;
  fechaInicio: string;
  fechaFin?: string;
  is_current: boolean;
  github?: string;
  demo?: string;
  image?: string;
};

export type ProjectPayload = {
  title: string;
  description: string;
  initial_date: string;
  final_date: string | null;
  url_to_project: string | null;
  url_to_deploy: string | null;
  project_rol: string | null;
  is_current: boolean;
  technologies: number[];
  image_id?: number;
};

export type ProjectUpdatePayload = Partial<Omit<ProjectPayload, "final_date">> & {
  final_date?: string | null;
};

function formatProjectError(error: unknown, fallback: string): Error {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string; errors?: Record<string, string[] | string> } | undefined;
    const firstFieldError = data?.errors
      ? Object.values(data.errors)
          .map((value) => (Array.isArray(value) ? value[0] : value))
          .find((value): value is string => typeof value === "string" && value.trim().length > 0)
      : undefined;

    return new Error(firstFieldError || data?.message || error.message || fallback);
  }

  return error instanceof Error ? error : new Error(fallback);
}

function extractImageIdFromResponse(body: unknown): number | null {
  if (body == null || typeof body !== "object") return null;
  const p = body as Record<string, unknown>;

  const tryNumber = (v: unknown): number | null => (typeof v === "number" && Number.isFinite(v) ? v : null);

  const direct = tryNumber(p.id) ?? tryNumber(p.image_id);
  if (direct != null) return direct;

  const nested = p.data;
  if (nested && typeof nested === "object") {
    const d = nested as Record<string, unknown>;
    return tryNumber(d.id) ?? tryNumber(d.image_id);
  }

  return null;
}

export const createProject = async (data: ProjectPayload) => {
  try {
    const res = await api.post("/projects", data);

    if (res.data?.success === false) {
      const msg =
        typeof res.data?.message === "string" && res.data.message.trim()
          ? res.data.message
          : "Error al crear proyecto";
      throw new Error(msg);
    }

    return res.data;
  } catch (error) {
    throw formatProjectError(error, "Error al crear proyecto");
  }
};

export const getLanguages = async (search = "") => {
  const res = await api.get(`/languages?search=${search}`);

  if (!res.data.success) {
    throw new Error("Error al obtener tecnologías");
  }

  return res.data.data;
};

export const createLanguage = async (name: string) => {
  const res = await api.post("/languages", { name });

  if (!res.data.success) {
    throw new Error("Error al crear tecnología");
  }

  return res.data.data;
};

export const getRoles = async (search = "") => {
  const res = await api.get(`/roles?search=${search}`);

  if (!res.data.success) {
    throw new Error("Error al obtener roles");
  }

  return res.data.data;
};

export const createRole = async (name: string) => {
  const res = await api.post("/roles", { name });

  if (!res.data.success) {
    throw new Error("Error al crear rol");
  }

  return res.data.data;
};
function extractProjectList(body: unknown): unknown[] | null {
  if (Array.isArray(body)) return body;
  if (body && typeof body === "object") {
    const o = body as Record<string, unknown>;
    if (Array.isArray(o.data)) return o.data;
    if (Array.isArray(o.projects)) return o.projects;
    if (o.data && typeof o.data === "object") {
      const data = o.data as Record<string, unknown>;
      if (Array.isArray(data.projects)) return data.projects;
      if (Array.isArray(data.data)) return data.data;
    }
  }
  return null;
}

function normalizeTechnology(value: unknown): ProjectTechnology | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const id = Number(record.id);
  const name = typeof record.name === "string" ? record.name : "";

  if (!Number.isFinite(id) || !name) return null;
  return { id, name };
}

function extractImageUrl(value: Record<string, unknown>): string | undefined {
  const direct = value.photograph ?? value.image ?? value.image_url ?? value.url_image;
  if (typeof direct === "string") return direct;

  const image = value.image;
  if (image && typeof image === "object") {
    const record = image as Record<string, unknown>;
    if (typeof record.url === "string") return record.url;
    if (typeof record.path === "string") return record.path;
  }

  return undefined;
}

export function normalizeProject(value: unknown): ProjectItem {
  const record = (value && typeof value === "object" ? value : {}) as Record<string, unknown>;
  const technologiesSource = record.languages ?? record.technologies ?? record.tecnologias;
  const technologies = Array.isArray(technologiesSource)
    ? technologiesSource.map(normalizeTechnology).filter((tech): tech is ProjectTechnology => Boolean(tech))
    : [];

  return {
    id: Number(record.id ?? 0),
    nombre: String(record.title ?? record.nombre ?? ""),
    descripcion: String(record.description ?? record.descripcion ?? ""),
    tecnologias: technologies,
    rol: String(record.project_rol ?? record.rol ?? ""),
    fechaInicio: String(record.initial_date ?? record.fechaInicio ?? ""),
    fechaFin: record.final_date || record.fechaFin ? String(record.final_date ?? record.fechaFin) : undefined,
    is_current: Boolean(record.is_current ?? record.current),
    github: record.url_to_project || record.github ? String(record.url_to_project ?? record.github) : undefined,
    demo: record.url_to_deploy || record.demo ? String(record.url_to_deploy ?? record.demo) : undefined,
    image: extractImageUrl(record),
  };
}

export const getProjects = async () => {
  try {
    const res = await api.get("/projects");
    const body = res.data;

    if (body && typeof body === "object" && (body as { success?: boolean }).success === false) {
      const msg =
        typeof (body as { message?: string }).message === "string" &&
        (body as { message: string }).message.trim()
          ? (body as { message: string }).message
          : "Error al obtener proyectos";
      throw new Error(msg);
    }

    const list = extractProjectList(body);
    if (list) return list.map(normalizeProject);

    throw new Error("Formato de respuesta inesperado al listar proyectos");
  } catch (error) {
    throw formatProjectError(error, "Error al obtener proyectos");
  }
};

export const updateProject = async (id: number, data: ProjectUpdatePayload) => {
  try {
    const res = await api.put(`/projects/${id}`, data);

    if (res.data?.success === false) {
      throw new Error(typeof res.data?.message === "string" ? res.data.message : "Error al actualizar proyecto");
    }

    return res.data;
  } catch (error) {
    throw formatProjectError(error, "Error al actualizar proyecto");
  }
};

export const deleteProject = async (id: number) => {
  try {
    const res = await api.delete(`/projects/${id}`);

    if (res.data?.success === false) {
      throw new Error(typeof res.data?.message === "string" ? res.data.message : "Error al eliminar proyecto");
    }

    return res.data;
  } catch (error) {
    throw formatProjectError(error, "Error al eliminar proyecto");
  }
};

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file, file.name);

  const res = await api.post("/images", formData, {
    timeout: IMAGE_UPLOAD_TIMEOUT_MS,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  // Solo tratar como fallo explícito si el backend lo indica (no exigir success en 2xx).
  const body = res.data as Record<string, unknown> | undefined;
  if (body?.success === false) {
    const msg =
      typeof body.message === "string" && body.message.trim()
        ? body.message
        : "Error al subir imagen";
    throw new Error(msg);
  }

  const imageId = extractImageIdFromResponse(res.data);
  if (imageId == null) {
    console.error("Respuesta de POST /images sin id reconocible:", res.data);
    throw new Error("La respuesta de imágenes no incluye el id. Revisa el formato del API.");
  }
  return imageId;
};
