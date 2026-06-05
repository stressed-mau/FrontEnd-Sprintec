import { useMemo } from "react";

import type { ExplorePortfolioCard } from "@/services/explorePortfoliosService";

function getPortfolioSortName(portfolio: ExplorePortfolioCard) {
  return (portfolio.fullName || portfolio.username || "").trim();
}

export function useSortedPortfolios(portfolios: ExplorePortfolioCard[]) {
  return useMemo(() => {
    return [...portfolios].sort((left, right) => {
      const leftName = getPortfolioSortName(left);
      const rightName = getPortfolioSortName(right);

      return leftName.localeCompare(rightName, "es", { sensitivity: "base" });
    });
  }, [portfolios]);
}