import { useMemo, useState } from "react"

import { usePagination } from "@/hooks/usePagination"
import { filterEducation } from "@/utils/educationPaginationUtils"
import type { EducationItem } from "@/types/education"

export function useEducationSearchPagination(education: EducationItem[]) {
  const [searchTerm, setSearchTerm] = useState("")
  const filteredEducation = useMemo(() => filterEducation(education, searchTerm), [education, searchTerm])
  const pagination = usePagination({ items: filteredEducation })

  function handleSearchChange(value: string) {
    setSearchTerm(value)
    pagination.goToPage(1)
  }

  return { filteredEducation, handleSearchChange, pagination, searchTerm, setCurrentPage: pagination.goToPage }
}
