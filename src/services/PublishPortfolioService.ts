import { api } from "./api";

// URL corregida según el documento
const PUBLISH_ENDPOINT = "/portfolio/publish";

export const publishPortfolioRequest = async (template: number, isPublic: boolean) => {
  const res = await api.post(PUBLISH_ENDPOINT, {
    template,
    is_public: isPublic,
  });

  if (!res.data?.success) {
    throw new Error(res.data?.message || "Error al procesar la solicitud del portafolio");
  }

  return res.data.data;
};