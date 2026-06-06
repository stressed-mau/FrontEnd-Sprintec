import { useMemo, useState } from "react"

import type { ExplorePortfolioCard } from "@/services/explorePortfoliosService"

type ThresholdValue = "all" | string

type ExplorePortfolioInitialFilters = {
  searchTerm?: string
  isFiltersOpen?: boolean
  selectedOccupation?: string
  minProjects?: ThresholdValue
  minSkills?: ThresholdValue
}

export function useExplorePortfolioFilters(
  portfolios: ExplorePortfolioCard[],
  initialFilters: ExplorePortfolioInitialFilters = {},
) {
  const [searchTerm, setSearchTerm] = useState(initialFilters.searchTerm ?? "")
  const [isFiltersOpen, setIsFiltersOpen] = useState(initialFilters.isFiltersOpen ?? false)
  const [selectedOccupation, setSelectedOccupation] = useState(initialFilters.selectedOccupation ?? "all")
  const [selectedTechnology, setSelectedTechnology] = useState("all")
  const [minProjects, setMinProjects] = useState<ThresholdValue>(initialFilters.minProjects ?? "all")
  const [minSkills, setMinSkills] = useState<ThresholdValue>(initialFilters.minSkills ?? "all")

  const occupationOptions = useMemo(() => {
    return Array.from(new Set(portfolios.map((portfolio) => portfolio.occupation).filter(Boolean))).sort()
  }, [portfolios])

  const technologyOptions = useMemo(() => {
    return Array.from(
      new Set(
        portfolios
          .flatMap((portfolio) => portfolio.topSkills)
          .map((skill) => skill.trim())
          .filter((skill) => skill && skill !== "Sin habilidades"),
      ),
    ).sort()
  }, [portfolios])

  const parseMinThreshold = (value: ThresholdValue): number | null => {
    if (value === "all") return null
    const parsed = Number.parseInt(value, 10)
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null
  }

  const filteredPortfolios = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    const minProjectsNumber = parseMinThreshold(minProjects)
    const minSkillsNumber = parseMinThreshold(minSkills)

    return portfolios.filter((portfolio) => {
      if (query) {
        const haystack = `${portfolio.fullName} ${portfolio.username} ${portfolio.occupation} ${portfolio.topSkills.join(" ")}`.toLowerCase()
        if (!haystack.includes(query)) return false
      }

      if (selectedOccupation !== "all") {
        const occupationQuery = selectedOccupation.trim().toLowerCase()
        if (occupationQuery) {
          const occupation = (portfolio.occupation ?? "").toLowerCase()
          if (!occupation.includes(occupationQuery)) return false
        }
      }

      if (minProjectsNumber != null && portfolio.projectsCount < minProjectsNumber) return false
      if (minSkillsNumber != null && portfolio.skillsCount < minSkillsNumber) return false

      // Por ahora no aplicamos `selectedTechnology` porque la UI actual no renderiza
      // un selector consistente para tecnologías; se deja disponible para futuras mejoras.
      return true
    })
  }, [portfolios, searchTerm, selectedOccupation, minProjects, minSkills])

  const hasActiveFilters =
    searchTerm.trim().length > 0 ||
    selectedOccupation !== "all" ||
    minProjects !== "all" ||
    minSkills !== "all"

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedOccupation("all")
    setSelectedTechnology("all")
    setMinProjects("all")
    setMinSkills("all")
    setIsFiltersOpen(false)
  }

  return {
    searchTerm,
    setSearchTerm,
    isFiltersOpen,
    setIsFiltersOpen,
    selectedOccupation,
    setSelectedOccupation,
    selectedTechnology,
    setSelectedTechnology,
    minProjects,
    setMinProjects,
    minSkills,
    setMinSkills,
    occupationOptions,
    technologyOptions,
    filteredPortfolios,
    hasActiveFilters,
    clearFilters,
  }
}
