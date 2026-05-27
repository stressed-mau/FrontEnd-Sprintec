import { useMemo } from "react";

import type { PortfolioCard } from "@/hooks/useExplorePortfolioFilters";

function getPortfolioSortName(portfolio: PortfolioCard) {
  return (portfolio.fullName || portfolio.username || "").trim();
}

export function useSortedPortfolios(portfolios: PortfolioCard[]) {
  return useMemo(() => {
    return [...portfolios].sort((left, right) => {
      const leftName = getPortfolioSortName(left);
      const rightName = getPortfolioSortName(right);

      return leftName.localeCompare(rightName, "es", { sensitivity: "base" });
    });
  }, [portfolios]);
}