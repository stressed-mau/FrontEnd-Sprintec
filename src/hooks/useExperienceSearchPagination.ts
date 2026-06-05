import { useMemo, useState } from "react"

import { filterExperiences, paginateExperiences } from "@/lib/experienceListUtils"
import type { ExperienceItem } from "@/types/experience"

export function useExperienceSearchPagination(experiences: ExperienceItem[]) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const filteredExperiences = useMemo(() => filterExperiences(experiences, searchTerm), [experiences, searchTerm])
  const pagination = paginateExperiences(filteredExperiences, currentPage)

  function handleSearchChange(value: string) {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  return {
    filteredExperiences,
    handleSearchChange,
    pagination,
    searchTerm,
    setCurrentPage,
  }
}
