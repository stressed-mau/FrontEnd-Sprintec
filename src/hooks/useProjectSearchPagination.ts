import { useMemo, useState } from "react"

import { usePagination } from "@/hooks/usePagination"
import type { ProjectItem } from "@/types/project"

type ProjectFilter = (projects: ProjectItem[], searchTerm: string) => ProjectItem[]

export function useProjectSearchPagination(projects: ProjectItem[], filterProjects: ProjectFilter) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProjects = useMemo(() => filterProjects(projects, searchTerm), [filterProjects, projects, searchTerm])
  const pagination = usePagination({ items: filteredProjects })

  function handleSearchChange(value: string) {
    setSearchTerm(value)
    pagination.goToPage(1)
  }

  return {
    currentPage: pagination.currentPage,
    filteredProjects,
    handleSearchChange,
    pagination,
    searchTerm,
    setCurrentPage: pagination.goToPage,
  }
}
