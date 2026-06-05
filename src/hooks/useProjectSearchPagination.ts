import { useMemo, useState } from "react"

import { paginateProjects } from "@/lib/projectListUtils"
import type { ProjectItem } from "@/types/project"

type ProjectFilter = (projects: ProjectItem[], searchTerm: string) => ProjectItem[]

export function useProjectSearchPagination(projects: ProjectItem[], filterProjects: ProjectFilter) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const filteredProjects = useMemo(() => filterProjects(projects, searchTerm), [filterProjects, projects, searchTerm])
  const pagination = paginateProjects(filteredProjects, currentPage)

  function handleSearchChange(value: string) {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  return {
    currentPage,
    filteredProjects,
    handleSearchChange,
    pagination,
    searchTerm,
    setCurrentPage,
  }
}
