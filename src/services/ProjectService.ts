import { api } from "@/services/api";

export const createProject = async (data: any) => {
  const res = await api.post("/projects", data);

  if (!res.data.success) {
    throw new Error("Error al crear proyecto");
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
export const getProjects = async () => {
  const res = await api.get("/projects");

  if (!res.data.success) {
    throw new Error("Error al obtener proyectos");
  }

  return res.data.data;
};