import { api } from "@/services/api";

export interface Project {
  id: number;
  nombre: string;
  descripcion: string;
  rol: string;
  tecnologias: { id: number; name: string }[];
  is_public: boolean;
  imagen: string | null;
}

const IMAGE_UPLOAD_TIMEOUT_MS = 180_000;

function extractImageUrlFromResponse(body: unknown): string | null {
  if (body == null || typeof body !== "object") return null;
  const p = body as Record<string, unknown>;

  const tryString = (v: unknown): string | null => {
    if (typeof v !== "string") return null;
    const s = v.trim();
    return s.length > 0 ? s : null;
  };

  const direct =
    tryString(p.url) ??
    tryString(p.image_url) ??
    (typeof p.path === "string" && /^https?:\/\//i.test(p.path) ? p.path.trim() : null);
  if (direct) return direct;

  const nested = p.data;
  if (typeof nested === "string" && /^https?:\/\//i.test(nested)) return nested.trim();
  if (nested && typeof nested === "object") {
    const d = nested as Record<string, unknown>;
    return (
      tryString(d.url) ??
      tryString(d.image_url) ??
      (typeof d.path === "string" && /^https?:\/\//i.test(d.path) ? d.path.trim() : null)
    );
  }
  return null;
}

export const createProject = async (data: any) => {
  const res = await api.post("/projects", data);

  if (res.data?.success === false) {
    const msg =
      typeof res.data?.message === "string" && res.data.message.trim()
        ? res.data.message
        : "Error al crear proyecto";
    throw new Error(msg);
  }

  return res.data;
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

function extractProjectList(body: unknown): Project[] | null {
  if (body == null || typeof body !== "object") return null;

  const res = body as any;
  let rawList: any[] | null = null;

  // Detectar la estructura data.projects
  if (Array.isArray(res)) {
    rawList = res;
  } else if (res.data && Array.isArray(res.data)) {
    rawList = res.data;
  } else if (res.data && res.data.projects && Array.isArray(res.data.projects)) {
    rawList = res.data.projects;
  }

  if (!rawList) return null;

  return rawList.map((p: any) => ({
    id: p.id,
    nombre: p.title || p.nombre || "Proyecto sin título",
    descripcion: p.description || p.descripcion || "",
    rol: p.project_rol || p.rol || "",
    
    tecnologias: Array.isArray(p.languages) ? p.languages : (Array.isArray(p.tecnologias) ? p.tecnologias : []),
    is_public: !!p.is_public,
    imagen: p.photograph || p.imagen || null
  }));
}

export const getProjects = async () => {
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
  if (list) return list;

  throw new Error("Formato de respuesta inesperado al listar proyectos");
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

  const url = extractImageUrlFromResponse(res.data);
  if (!url) {
    console.error("Respuesta de POST /images sin URL reconocible:", res.data);
    throw new Error(
      "La respuesta de imágenes no incluye la URL. Revisa el formato del API."
    );
  }
  return url;
};
