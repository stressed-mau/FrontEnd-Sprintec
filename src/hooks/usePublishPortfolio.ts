import { useState } from "react";
import { publishPortfolioRequest } from "../services/PublishPortfolioService";

export const usePublishPortfolio = () => {
  const [isPublished, setIsPublished] = useState(false);
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePublish = async (template: number) => {
    try {
      setLoading(true);
      setError(null);

      const data = await publishPortfolioRequest(template, true);

      // Si llegamos aquí, es porque success fue true
      setIsPublished(true);
      setPortfolioUrl(data.public_url);

      return data; 
    } catch (err: any) {
      // Capturamos el mensaje que viene del Service (res.data.message)
      const errorMessage = err.message || "Error inesperado al publicar";
      setError(errorMessage);
      console.error("Error en handlePublish:", err);
      
      // IMPORTANTE: Lanzar el error de nuevo o retornar null 
      // para que el componente que llama sepa que falló.
      throw err; 
    } finally {
      setLoading(false);
    }
  };

  const handleUnpublish = async (template: number) => {
    try {
      setLoading(true);
      setError(null);

      await publishPortfolioRequest(template, false);

      setIsPublished(false);
      setPortfolioUrl("");
    } catch (err: any) {
      const errorMessage = err.message || "Error al ocultar el portafolio";
      setError(errorMessage);
      console.error("Error en handleUnpublish:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    isPublished,
    portfolioUrl,
    loading,
    error,
    handlePublish,
    handleUnpublish,
  };
};