import { api } from "./api";

const PUBLISH_ENDPOINT = "/publish";

export const publishPortfolioRequest = async (template: number, isPublic: boolean) => {
  const res = await api.post(PUBLISH_ENDPOINT, {
    template,
    is_public: isPublic,
  });

  if (res.data?.success === false) {
    throw new Error(res.data?.message || "Error al publicar portafolio");
  }

  return res.data.data;
};