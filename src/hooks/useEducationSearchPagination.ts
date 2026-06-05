import { useMemo, useState } from "react"

import { filterEducation, paginateEducation } from "@/utils/educationPaginationUtils"
import type { EducationItem } from "@/types/education"

export function useEducationSearchPagination(education: EducationItem[]) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const filteredEducation = useMemo(() => filterEducation(education, searchTerm), [education, searchTerm])
  const pagination = paginateEducation(filteredEducation, currentPage)

  function handleSearchChange(value: string) {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  return { filteredEducation, handleSearchChange, pagination, searchTerm, setCurrentPage }
}
