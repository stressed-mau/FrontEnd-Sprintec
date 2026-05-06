import { useState } from "react";
import { publishPortfolioRequest } from "../services/PublishPortfolioService";
import { api } from "../services/api";
import { getAuthSession } from "@/services/auth/auth-storage";
export const usePublishPortfolio = () => {
  const [isPublished, setIsPublished] = useState(false);
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
const cleanUrl = (url: any): string => {
  if (!url || typeof url !== 'string' || !url.startsWith('http')) return "";

  try {
    const urlObj = new URL(url);
    
    // Cambiamos el puerto solo si estamos en localhost
    if (urlObj.hostname === 'localhost' || urlObj.hostname === '127.0.0.1') {
      urlObj.port = '5173'; 
    }

    // Limpiamos el path: eliminamos /api del inicio si existe
    urlObj.pathname = urlObj.pathname.replace(/^\/api/, '');

    return urlObj.toString();
  } catch (e) {
    // Si falla la conversión, devolvemos un fallback seguro
    return url.replace('/api/p/', '/p/').replace(':8000', ':5173');
  }
};
  const handlePublish = async (template: number, isPublic: boolean = true) => {
    try {
      setLoading(true);
      setError(null);
      console.log("INICIANDO PUBLICACIÓN");
      const result = await publishPortfolioRequest(template, isPublic);
      console.log("RESULT:", result);
      window.dispatchEvent(new Event("portfolioUpdated"));

      setIsPublished(result.is_public); 
      setPortfolioUrl(cleanUrl(result.public_url));
      setSelectedTemplate(result.template);
      return result;
    } catch (err: any) {
      console.error("ERROR PUBLICANDO:", err);
      setError(err?.response?.data?.message || err.message || "Error al publicar");
    } finally {
      setLoading(false);
    }
  };

  const handleUnpublish = async (template: number) => {
    try {
      setLoading(true);
      setError(null);
      await publishPortfolioRequest(template, false);
      window.dispatchEvent(new Event("portfolioUpdated"));
      setIsPublished(false);
      setPortfolioUrl("");
    } catch (err: any) {
      setError(err.message || "Error al ocultar el portafolio");
    } finally {
      setLoading(false);
    }
  };

  const checkInitialStatus = async () => {
    const session = getAuthSession();
    const username = session?.user?.username;
    if (!username) return;
    try {
      setLoading(true);
      const res = await api.get(`/p/${username}`);

      if (res.data?.success) {
        const portfolioData = res.data.data;
        const config = portfolioData.config; 
        setSelectedTemplate(portfolioData.config?.template ?? null);
        setIsPublished(config?.is_public ?? portfolioData.is_public ?? false);
        setPortfolioUrl(cleanUrl(portfolioData.public_url));
        const userSlug = config?.slug || username;
        const finalUrl = portfolioData.public_url 
        ? cleanUrl(portfolioData.public_url) 
        : `${window.location.origin}/p/${userSlug}`;
        setPortfolioUrl(finalUrl);
      }
    } catch (err: any) {
    if (err?.response?.status === 404) {
        // No borres la URL aquí si quieres mostrar una URL "predeterminada"
        setSelectedTemplate(null);
        setIsPublished(false);
        const session = getAuthSession();
        setPortfolioUrl(`${window.location.origin}/p/${session?.user?.username}`);
    } else {
        setPortfolioUrl(""); // Solo borrar si es un error grave de servidor
    }
} finally {
    setLoading(false); 
  }
};

  

  return {
    isPublished,
    portfolioUrl,
    loading,
    error,
    selectedTemplate,
    handlePublish,
    handleUnpublish,
    checkInitialStatus,
  };
};