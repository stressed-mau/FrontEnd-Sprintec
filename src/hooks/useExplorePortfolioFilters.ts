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
  const [minProjects, setMinProjects] = useState<ThresholdValue>("all")
  const [minSkills, setMinSkills] = useState<ThresholdValue>("all")

  const occupationOptions = useMemo(() => {
    return Array.from(new Set(portfolios.map((portfolio) => portfolio.occupation).filter(Boolean))).sort()
  }, [portfolios])

  const filteredPortfolios = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    const projectsThreshold = minProjects === "all" ? null : Number(minProjects)
    const skillsThreshold = minSkills === "all" ? null : Number(minSkills)

    return portfolios.filter((portfolio) => {
      const searchableText = [portfolio.fullName, portfolio.occupation, ...portfolio.topSkills].join(" ").toLowerCase()

      const matchesSearch = !query || searchableText.includes(query)
      const matchesOccupation = selectedOccupation === "all" || portfolio.occupation === selectedOccupation
      const matchesProjects = projectsThreshold === null || portfolio.projectsCount >= projectsThreshold
      const matchesSkills = skillsThreshold === null || portfolio.skillsCount >= skillsThreshold

      return matchesSearch && matchesOccupation && matchesProjects && matchesSkills
    })
  }, [portfolios, searchTerm, selectedOccupation, minProjects, minSkills])

  const hasActiveFilters =
    searchTerm.trim().length > 0 || selectedOccupation !== "all" || minProjects !== "all" || minSkills !== "all"

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedOccupation("all")
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
    minProjects,
    setMinProjects,
    minSkills,
    setMinSkills,
    occupationOptions,
    filteredPortfolios,
    hasActiveFilters,
    clearFilters,
  }
}