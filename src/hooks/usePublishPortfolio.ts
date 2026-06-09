import { useState } from "react";
import { publishPortfolioRequest } from "../services/PublishPortfolioService";
import { getPortfolioVisibilityDataService } from "@/services/portfolioVisibilityService";
import { api } from "../services/api";
import { getAuthSession } from "@/services/auth/authStorageService";

type PublishPortfolioData = {
  config?: {
    template?: number | null;
    slug?: string;
    is_public?: boolean;
  };
  public_url?: string;
  is_public?: boolean;
};

type PublishPortfolioResponse = {
  success?: boolean;
  data?: PublishPortfolioData;
};

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return error.message || fallback;
  }

  if (typeof error === "object" && error !== null) {
    const candidate = error as { response?: { data?: { message?: string } }; message?: string };
    return candidate.response?.data?.message || candidate.message || fallback;
  }

  return fallback;
}

export const usePublishPortfolio = () => {
  const [isPublished, setIsPublished] = useState(false);
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [hasPortfolioContent, setHasPortfolioContent] = useState(true);
  const cleanUrl = (url: unknown): string => {
    if (typeof url !== "string" || !url.startsWith("http")) return "";

    try {
      const urlObj = new URL(url);
      
      // Cambiamos el puerto solo si estamos en localhost
      if (urlObj.hostname === "localhost" || urlObj.hostname === "127.0.0.1") {
        urlObj.port = "5173";
      }

      urlObj.pathname = urlObj.pathname.replace(/^\/api/, "");

      return urlObj.toString();
    } catch {
      return url.replace("/api/p/", "/p/").replace(":8000", ":5173");
    }
  };
  const validatePortfolioContent = async () => {
    try {
      const data = await getPortfolioVisibilityDataService();

      const hasContent =
        data.projects.length > 0 ||
        data.skills.length > 0 ||
        data.experience.length > 0 ||
        data.education.length > 0 ||
        data.certificates.length > 0 ||
        data.networks.length > 0;

      setHasPortfolioContent(hasContent);

      return hasContent;
    } catch (error) {
      console.error("Error validando contenido:", error);
      setHasPortfolioContent(false);
      return false;
    }
  };
  const handlePublish = async (template: number, isPublic: boolean = true) => {
    const hasContent = await validatePortfolioContent();

    if (!hasContent) {
      setError("Debes registrar al menos un elemento de alguna sección antes de publicar.");
      await publishPortfolioRequest(template, false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const result = await publishPortfolioRequest(template, isPublic) as {
        is_public?: boolean;
        public_url?: string;
        template?: number | null;
      };
      window.dispatchEvent(new Event("portfolioUpdated"));

      setIsPublished(Boolean(result.is_public));
      setPortfolioUrl(cleanUrl(result.public_url ?? ""));
      setSelectedTemplate(result.template ?? null);
      return result;
    } catch (error) {
      console.error("ERROR PUBLICANDO:", error);
      setError(getErrorMessage(error, "Error al publicar"));
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
    } catch (error) {
      setError(getErrorMessage(error, "Error al ocultar el portafolio"));
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
      const res = await api.get<PublishPortfolioResponse>(`/p/${username}`);

      if (res.data?.success) {
        const portfolioData = res.data.data ?? ({} as PublishPortfolioData);
        const config = portfolioData.config ?? {};
        setSelectedTemplate(config.template ?? null);
        setIsPublished(Boolean(config.is_public ?? portfolioData.is_public ?? false));
        setPortfolioUrl(cleanUrl(portfolioData.public_url ?? ""));

        const userSlug = config?.slug || username;
        const finalUrl = portfolioData.public_url 
        ? cleanUrl(portfolioData.public_url) 
        : `${window.location.origin}/p/${userSlug}`;
        setPortfolioUrl(finalUrl);
      }
    } catch (error) {
    const candidate = error as { response?: { status?: number } } | undefined;
    if (candidate?.response?.status === 404) {
        setIsPublished(false);
        const session = getAuthSession();
        setPortfolioUrl(`${window.location.origin}/p/${session?.user?.username}`);
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
