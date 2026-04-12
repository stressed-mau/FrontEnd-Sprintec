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

      setIsPublished(result.is_public); 
      setPortfolioUrl(result.public_url); 
      
      console.log("Portafolio de:", result.slug);
    } catch (err: any) {
      setError(err.message || "Error al publicar el portafolio");
    } finally {
      setLoading(false);
    }
  };

  const handleUnpublish = async (template: number) => {
    try {
      setLoading(true);
      setError(null);

      // Enviamos template y is_public: false
      await publishPortfolioRequest(template, false);

      setIsPublished(false);
      setPortfolioUrl("");
    } catch (err: any) {
      setError(err.message || "Error al ocultar el portafolio");
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