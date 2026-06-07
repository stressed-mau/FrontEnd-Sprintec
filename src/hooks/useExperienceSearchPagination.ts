import { useMemo, useState } from "react"

import { usePagination } from "@/hooks/usePagination"
import type { ExperienceItem } from "@/types/experience"
import { filterExperiences } from "@/utils/experiencePaginationUtils"

export function useExperienceSearchPagination(experiences: ExperienceItem[]) {
  const [searchTerm, setSearchTerm] = useState("")
  const filteredExperiences = useMemo(() => filterExperiences(experiences, searchTerm), [experiences, searchTerm])
  const pagination = usePagination({ items: filteredExperiences })

  function handleSearchChange(value: string) {
    setSearchTerm(value)
    pagination.goToPage(1)
  }

  return { filteredExperiences, handleSearchChange, pagination, searchTerm, setCurrentPage: pagination.goToPage }
}
