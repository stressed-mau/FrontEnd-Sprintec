import { api } from "@/services/api";

const IMAGE_UPLOAD_TIMEOUT_MS = 180_000;

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
function extractProjectList(body: unknown): unknown[] | null {
  if (Array.isArray(body)) return body;
  if (body && typeof body === "object") {
    const o = body as Record<string, unknown>;
    if (Array.isArray(o.data)) return o.data;
    if (Array.isArray(o.projects)) return o.projects;
  }
  return null;
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

  const imageId = extractImageIdFromResponse(res.data);
  if (imageId == null) {
    console.error("Respuesta de POST /images sin id reconocible:", res.data);
    throw new Error("La respuesta de imágenes no incluye el id. Revisa el formato del API.");
  }
  return imageId;
};
