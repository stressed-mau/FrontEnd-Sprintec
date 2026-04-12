import { useState } from "react";
import { publishPortfolioRequest } from "../services/PublishPortfolioService";

export const usePublishPortfolio = () => {
  const [isPublished, setIsPublished] = useState(false);
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

 
    const handlePublish = async (templateId: number) => {
    const result = await publishPortfolioRequest(templateId, true);
    
    console.log("El nombre del usuario es:", result.slug); // Imprime "dana"
    console.log("La URL para compartir es:", result.public_url); // Imprime la URL completa
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