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
  
  const handlePublish = async (templateId: number, isPublic: boolean = true) => {
    try {
      setLoading(true);
      setError(null);

      const result = await publishPortfolioRequest(templateId, isPublic);
      window.dispatchEvent(new Event("portfolioUpdated"));

      setIsPublished(result.is_public); 
      setPortfolioUrl(result.public_url);
      setSelectedTemplate(result.templateId);

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
        setSelectedTemplate(portfolioData.config?.template || portfolioData.template); 
        setIsPublished(config?.is_public ?? portfolioData.is_public ?? false);
        const userSlug = config?.slug || username;
        setPortfolioUrl(portfolioData.public_url || `${window.location.origin}/p/${userSlug}`);
      }
    } catch (err: any) {
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