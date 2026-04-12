import { api } from "./api";


const PUBLISH_ENDPOINT = "/publish";
const VIEW_PORTFOLIO_ENDPOINT = "/view-portfolio";


export const publishPortfolioRequest = async (template: number, isPublic: boolean) => {
  const res = await api.post(PUBLISH_ENDPOINT, {
    template,
    is_public: isPublic,
  });

  if (res.data?.success === false) {
    throw new Error(res.data?.message || "Error al procesar la publicación");
  }

  const data = res.data.data;
  
  return data; 
};

export const getPublicPortfolio = async (slug: string) => {
  const res = await api.get(`${VIEW_PORTFOLIO_ENDPOINT}/${slug}`);

  if (res.data?.success === false) {
    throw new Error(res.data?.message || "No se pudo encontrar el portafolio solicitado");
  }

  return res.data.data;
};