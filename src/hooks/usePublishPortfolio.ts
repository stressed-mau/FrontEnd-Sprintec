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

      setIsPublished(true);
      setPortfolioUrl(data.public_url);

      return data;
    } catch (err: any) {
      setError(err.message);
      console.error(err);
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
      setError(err.message);
      console.error(err);
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