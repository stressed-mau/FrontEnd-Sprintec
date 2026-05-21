import { useMemo, useState } from "react"

export interface PortfolioCard {
  id: string
  slug: string
  fullName: string
  occupation: string
  profileImage: string
  projectsCount: number
  skillsCount: number
  topSkills: string[]
}

type ThresholdValue = "all" | string

export function useExplorePortfolioFilters(portfolios: PortfolioCard[]) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [selectedOccupation, setSelectedOccupation] = useState("all")
  const [selectedTechnology, setSelectedTechnology] = useState("all")
  const [minProjects, setMinProjects] = useState<ThresholdValue>("all")
  const [minSkills, setMinSkills] = useState<ThresholdValue>("all")

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

  const hasActiveFilters =
    searchTerm.trim().length > 0 || selectedOccupation !== "all" || selectedTechnology !== "all" || minProjects !== "all" || minSkills !== "all"

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
    hasActiveFilters,
    clearFilters,
  }
}