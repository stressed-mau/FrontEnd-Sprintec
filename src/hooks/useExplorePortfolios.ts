import { useCallback, useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useSearchParams } from "react-router-dom";
import { getExplorePortfoliosService, type ExplorePortfolioCard } from "@/services/explorePortfoliosService";
import { useExplorePortfolioFilters } from "@/hooks/useExplorePortfolioFilters";
import { usePagination } from "@/hooks/usePagination";
import { useSortedPortfolios } from "@/hooks/useSortedPortfolios";

type UseExplorePortfoliosResult = {
  searchTerm: string;
  isFiltersOpen: boolean;
  selectedOccupation: string;
  minProjects: string;
  minSkills: string;
  hasActiveFilters: boolean;
  filteredPortfolios: ExplorePortfolioCard[];
  currentData: ExplorePortfolioCard[];
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
  next: () => void;
  prev: () => void;
  setIsFiltersOpen: Dispatch<SetStateAction<boolean>>;
  handleSearchChange: (value: string) => void;
  handleOccupationChange: (value: string) => void;
  handleProjectsChange: (value: string) => void;
  handleSkillsChange: (value: string) => void;
  handleClearFilters: () => void;
  loading: boolean;
  pageError: string;
};

const DEFAULT_PER_PAGE = 12;

function getPerPageForViewport() {
  if (typeof window === "undefined") return DEFAULT_PER_PAGE;
  if (window.innerWidth >= 1024) return 12;
  if (window.innerWidth >= 640) return 8;
  return 4;
}

function parsePageParam(value: string | null) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

export function useExplorePortfolios(): UseExplorePortfoliosResult {
  const [searchParams, setSearchParams] = useSearchParams();
  const [portfolios, setPortfolios] = useState<ExplorePortfolioCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [perPage, setPerPage] = useState(() => getPerPageForViewport());

  const {
    searchTerm,
    setSearchTerm,
    isFiltersOpen,
    setIsFiltersOpen,
    selectedOccupation,
    setSelectedOccupation,
    minProjects,
    setMinProjects,
    minSkills,
    setMinSkills,
    hasActiveFilters,
    clearFilters,
    filteredPortfolios,
  } = useExplorePortfolioFilters(portfolios, {
    searchTerm: searchParams.get("q") ?? "",
    isFiltersOpen: searchParams.get("filters") === "1",
    selectedOccupation: searchParams.get("occupation") ?? "all",
    minProjects: searchParams.get("minProjects") ?? "all",
    minSkills: searchParams.get("minSkills") ?? "all",
  });

  const sortedPortfolios = useSortedPortfolios(filteredPortfolios);
  const {
    currentData,
    currentPage,
    totalPages,
    goToPage,
    next,
    prev,
    setCurrentPage,
  } = usePagination({
    items: sortedPortfolios,
    itemsPerPage: perPage,
    initialPage: parsePageParam(searchParams.get("page")),
  });

  const loadPortfolios = useCallback(async () => {
    setLoading(true);

    try {
      const result = await getExplorePortfoliosService();
      setPortfolios(result.portfolios);
      setPageError("");
    } catch (error) {
      console.error("Error cargando portafolios:", error);
      setPortfolios([]);
      setPageError(error instanceof Error ? error.message : "No se pudieron cargar los portafolios.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPortfolios();
  }, [loadPortfolios]);

  useEffect(() => {
    const nextParams = new URLSearchParams();

    if (searchTerm.trim()) nextParams.set("q", searchTerm.trim());
    if (selectedOccupation !== "all") nextParams.set("occupation", selectedOccupation);
    if (minProjects !== "all") nextParams.set("minProjects", minProjects);
    if (minSkills !== "all") nextParams.set("minSkills", minSkills);
    if (isFiltersOpen) nextParams.set("filters", "1");
    if (currentPage > 1) nextParams.set("page", String(currentPage));

    setSearchParams(nextParams, { replace: true });
  }, [currentPage, isFiltersOpen, minProjects, minSkills, searchTerm, selectedOccupation, setSearchParams]);

  useEffect(() => {
    const updatePerPage = () => {
      setPerPage(getPerPageForViewport());
    };

    updatePerPage();
    window.addEventListener("resize", updatePerPage);

    return () => {
      window.removeEventListener("resize", updatePerPage);
    };
  }, []);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, setCurrentPage, totalPages]);

  const handleSearchChange = useCallback(
    (value: string) => {
      setCurrentPage(1);
      setSearchTerm(value);
    },
    [setCurrentPage, setSearchTerm]
  );

  const handleOccupationChange = useCallback(
    (value: string) => {
      setCurrentPage(1);
      const trimmed = value.trim();
      setSelectedOccupation(trimmed.length ? trimmed : "all");
    },
    [setCurrentPage, setSelectedOccupation]
  );

  const handleProjectsChange = useCallback(
    (value: string) => {
      setCurrentPage(1);
      setMinProjects(value);
    },
    [setCurrentPage, setMinProjects]
  );

  const handleSkillsChange = useCallback(
    (value: string) => {
      setCurrentPage(1);
      setMinSkills(value);
    },
    [setCurrentPage, setMinSkills]
  );

  const handleClearFilters = useCallback(() => {
    clearFilters();
    setCurrentPage(1);
  }, [clearFilters, setCurrentPage]);

  return {
    searchTerm,
    isFiltersOpen,
    selectedOccupation,
    minProjects,
    minSkills,
    hasActiveFilters,
    filteredPortfolios,
    currentData,
    currentPage,
    totalPages,
    goToPage,
    next,
    prev,
    setIsFiltersOpen,
    handleSearchChange,
    handleOccupationChange,
    handleProjectsChange,
    handleSkillsChange,
    handleClearFilters,
    loading,
    pageError,
  };
}