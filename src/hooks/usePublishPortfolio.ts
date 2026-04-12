import { useState } from "react";
import { publishPortfolioRequest } from "../services/PublishPortfolioService";

export const usePublishPortfolio = () => {
  const [isPublished, setIsPublished] = useState(false);
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // En usePublishPortfolio.ts
    const handlePublish = async (template: number) => {
    try {
        console.log(" FRONTEND: Intentando publicar...");
        console.log(" Datos enviados:", { template, is_public: true });
        
        setLoading(true);
        const data = await publishPortfolioRequest(template, true);

        console.log(" BACKEND RESPONDIÓ:", data);
        setIsPublished(true);
        return data;
    } catch (err: any) {
        console.error(" ERROR DETECTADO:");
        console.log("Mensaje:", err.message);
        // Esto te dirá si el error es de red o del servidor
        if (err.response) {
        console.log("Status del servidor:", err.response.status); 
        }
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