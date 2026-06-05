import type { ExperienceItem } from "@/types/experience"

const ITEMS_PER_PAGE = 5

export function filterExperiences(experiences: ExperienceItem[], searchTerm: string) {
  const normalizedSearch = normalizeSearch(searchTerm)
  if (!normalizedSearch) return experiences

  return experiences.filter((experience) =>
    [experience.company, experience.position, experience.email, experience.location]
      .map(normalizeSearch)
      .some((value) => value.includes(normalizedSearch))
  )
}

export function paginateExperiences(experiences: ExperienceItem[], currentPage: number) {
  const totalPages = Math.max(1, Math.ceil(experiences.length / ITEMS_PER_PAGE))
  const safePage = Math.min(Math.max(1, currentPage), totalPages)
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE

  return {
    currentPage: safePage,
    totalPages,
    startIndex,
    endIndex,
    items: experiences.slice(startIndex, endIndex),
  }
}

function normalizeSearch(value: string) {
  return value.trim().toLocaleLowerCase("es-BO")
}
