import type { ProjectItem } from "@/types/project"

const ITEMS_PER_PAGE = 10

export function filterProjects(projects: ProjectItem[], searchTerm: string) {
  const normalizedSearch = searchTerm.trim().toLowerCase()
  if (!normalizedSearch) return projects

  return projects.filter((project) => {
    return (
      project.nombre.toLowerCase().includes(normalizedSearch) ||
      project.rol.toLowerCase().includes(normalizedSearch) ||
      project.tecnologias.some((technology) => technology.name.toLowerCase().includes(normalizedSearch))
    )
  })
}

export function filterProjectsByTitle(projects: ProjectItem[], searchTerm: string) {
  const normalizedSearch = searchTerm.trim().toLowerCase()
  if (!normalizedSearch) return projects

  return projects.filter((project) => project.nombre.toLowerCase().includes(normalizedSearch))
}

export function paginateProjects(projects: ProjectItem[], currentPage: number) {
  const totalPages = Math.max(1, Math.ceil(projects.length / ITEMS_PER_PAGE))
  const safePage = Math.min(Math.max(currentPage, 1), totalPages)
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, projects.length)

  return {
    items: projects.slice(startIndex, endIndex),
    currentPage: safePage,
    totalPages,
    startIndex,
    endIndex,
  }
}

export function formatProjectDate(date?: string) {
  if (!date) return "-"
  const isoDate = date.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (isoDate) return formatIsoProjectDate(isoDate)

  return new Date(date).toLocaleDateString("es-ES", { month: "short", year: "numeric" })
}

function formatIsoProjectDate(isoDate: RegExpMatchArray) {
  return new Date(Number(isoDate[1]), Number(isoDate[2]) - 1, Number(isoDate[3])).toLocaleDateString("es-ES", {
    month: "short",
    year: "numeric",
  })
}
