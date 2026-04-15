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
  
  const handlePublish = async (templateId: number) => {
    try {
      setLoading(true);
      setError(null);

      const result = await publishPortfolioRequest(templateId, true);
      window.dispatchEvent(new Event("portfolioUpdated"));

      setIsPublished(result.is_public); 
      setPortfolioUrl(result.url);
      setSelectedTemplate(templateId);

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

  if (!username) return; // Si no hay usuario, no hacemos nada

  try {
    setLoading(true);
    const res = await api.get(`/p/${username}`);
    
    if (res.data?.success) {
      const portfolioData = res.data.data;
      setIsPublished(true); 
      setPortfolioUrl(portfolioData.public_url || `${window.location.origin}/p/${portfolioData.config.slug}`);
      setSelectedTemplate(portfolioData.config.template); 
    }
  } catch (err: any) {
    setIsPublished(false);
    setPortfolioUrl("");
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