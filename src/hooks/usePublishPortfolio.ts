import { useState } from "react";
import { publishPortfolioRequest } from "../services/publishPortfolioService";
import { getPortfolioVisibilityData } from "@/services/portfolioVisibilityService";
import { api } from "../services/api";
import { getAuthSession } from "@/services/auth/auth-storage";
type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message?: string;
};
type PortfolioApiData = {
  config?: {
    template?: number;
    is_public?: boolean;
    slug?: string;
  };
  public_url?: string;
  is_public?: boolean;
};
type PortfolioVisibilityData = {
  projects: unknown[];
  skills: unknown[];
  experience: unknown[];
  education: unknown[];
  certificates: unknown[];
  networks: unknown[];
};
export const usePublishPortfolio = () => {
  const [isPublished, setIsPublished] = useState(false);
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [hasPortfolioContent, setHasPortfolioContent] = useState(true);
  const cleanUrl = (url?: string): string => {
    if (!url || typeof url !== 'string' || !url.startsWith('http')) return "";
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname === 'localhost' || urlObj.hostname === '127.0.0.1') {
        urlObj.port = '5173'; 
      }
      urlObj.pathname = urlObj.pathname.replace(/^\/api/, '');
      return urlObj.toString();
    } catch (e) {
      return url.replace('/api/p/', '/p/').replace(':8000', ':5173');
    }
  };
  const buildPortfolioUrl = (data: PortfolioApiData, username: string) => {
    const config = data.config;
    const userSlug = config?.slug || username;
    return data.public_url
      ? cleanUrl(data.public_url)
      : `${window.location.origin}/p/${userSlug}`;
  };
  const extractPortfolioState = (data: PortfolioApiData) => {
    return {
      template: data.config?.template ?? null,
      isPublic: data.config?.is_public ?? data.is_public ?? false,
    };
  };
  const publishWithValidation = async (template: number, isPublic: boolean) => {
    const hasContent = await validatePortfolioContent();
    if (!hasContent) {
      setError("Debes registrar al menos un elemento de alguna sección antes de publicar.");
      await publishPortfolioRequest(template, false);
      return null;
    }
    return publishPortfolioRequest(template, isPublic);
  };
  const hasAnyContent = (data: PortfolioVisibilityData): boolean => {
    const sections = [
      data.projects,
      data.skills,
      data.experience,
      data.education,
      data.certificates,
      data.networks,
    ];
    return sections.some(section => section.length > 0);
  };
  const validatePortfolioContent = async () => {
    try {
      const data = await getPortfolioVisibilityData();
      const hasContent = hasAnyContent(data);
      setHasPortfolioContent(hasContent);
      return hasContent;
    } catch (error) {
      console.error("Error validando contenido:", error);
      setHasPortfolioContent(false);
      return false;
    }
  };
  const handlePublish = async (template: number, isPublic = true) => {
    try {
      setLoading(true);
      setError(null);

      const result = await publishWithValidation(template, isPublic);
      if (!result) return;

      window.dispatchEvent(new Event("portfolioUpdated"));

      setIsPublished(result.is_public);
      setPortfolioUrl(cleanUrl(result.public_url));
      setSelectedTemplate(result.template);

      return result;

    } catch (err: unknown) {
      const error = err as ApiError;
      setError(
        error?.response?.data?.message ||
        error?.message ||
        "Error al publicar"
      );
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
    } catch (err: unknown) {
      const error = err as ApiError;
      setError(error?.response?.data?.message || error?.message || "Error al ocultar el portafolio");
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
      if (!res.data?.success) return;
      const portfolioData = res.data.data;
      const { template, isPublic } = extractPortfolioState(portfolioData);
      setSelectedTemplate(template);
      setIsPublished(isPublic);
      setPortfolioUrl(buildPortfolioUrl(portfolioData, username));

    } catch (err: unknown) {
      const error = err as ApiError;
      if (error?.response?.status === 404) {
        setIsPublished(false);
        const session = getAuthSession();
        setPortfolioUrl(
          `${window.location.origin}/p/${session?.user?.username}`
        );
      } else {
        setPortfolioUrl("");
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
    hasPortfolioContent,
    validatePortfolioContent,
  };
};