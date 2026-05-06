import { createContext, useContext, useEffect } from "react";
import { usePublishPortfolio } from "../hooks/usePublishPortfolio";

const PublishPortfolioContext = createContext<ReturnType<typeof usePublishPortfolio> | null>(null);

export const PublishPortfolioProvider = ({ children }: { children: React.ReactNode }) => {
  const portfolio = usePublishPortfolio();
  useEffect(() => {
    portfolio.checkInitialStatus();
  }, []);
  return (
    <PublishPortfolioContext.Provider value={portfolio}>
      {children}
    </PublishPortfolioContext.Provider>
  );
};

export const usePublishPortfolioContext = () => {
  const context = useContext(PublishPortfolioContext);
  if (!context) {
    throw new Error("usePublishPortfolioContext must be used within a PublishPortfolioProvider");
  }
  return context;
};