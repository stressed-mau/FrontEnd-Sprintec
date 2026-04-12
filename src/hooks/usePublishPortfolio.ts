import { useState } from "react";

import { publishPortfolioRequest } from "../services/PublishPortfolioService";

export const usePublishPortfolio = () => {
  const [isPublished, setIsPublished] = useState(false);
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePublish = async (templateId: number) => {
    try {
      setLoading(true);
      setError(null);

      const result = await publishPortfolioRequest(templateId, true);
      
      // Actualizamos los estados con la respuesta del backend
      setIsPublished(true);
      setPortfolioUrl(result.public_url); // Guardamos "http://localhost:8000/p/dana"

      console.log("El nombre del usuario es:", result.slug); 
      console.log("La URL para compartir es:", result.public_url);

      return result; 
    } catch (err: any) {
      const errorMessage = err.message || "Error al publicar el portafolio";
      setError(errorMessage);
      console.error("Error en handlePublish:", err);
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