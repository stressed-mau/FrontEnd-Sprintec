import type { EducationItem } from "@/types/education"

const ITEMS_PER_PAGE = 5

export function filterEducation(education: EducationItem[], searchTerm: string) {
  const normalizedSearch = normalizeSearch(searchTerm)
  if (!normalizedSearch) return education

  return education.filter((item) =>
    [item.company, item.position, item.fieldOfStudy, item.description]
      .map(normalizeSearch)
      .some((value) => value.includes(normalizedSearch))
  )
}

export function paginateEducation(education: EducationItem[], currentPage: number) {
  const totalPages = Math.max(1, Math.ceil(education.length / ITEMS_PER_PAGE))
  const safePage = Math.min(Math.max(1, currentPage), totalPages)
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE

  return {
    currentPage: safePage,
    totalPages,
    startIndex,
    endIndex,
    items: education.slice(startIndex, endIndex),
  }
}

function normalizeSearch(value: string) {
  return value.trim().toLocaleLowerCase("es-BO")
}
