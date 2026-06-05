import { formatExperienceDate } from "@/hooks/useExperienceManager"
import type { ExperienceItem } from "@/types/experience"

const ITEMS_PER_PAGE = 5

export function getExperienceTypeLabel(type: ExperienceItem["type"]) {
  return type === "academica" ? "Formación Académica" : "Experiencia Laboral"
}

export function filterExperiences(experiences: ExperienceItem[], searchTerm: string) {
  const normalizedSearch = searchTerm.trim().toLowerCase()
  if (!normalizedSearch) return experiences

  return experiences.filter((experience) =>
    [experience.company, experience.position, experience.email, experience.location, experience.fieldOfStudy, getExperienceTypeLabel(experience.type)]
      .some((value) => value.toLowerCase().includes(normalizedSearch)),
  )
}

export function paginateExperiences(experiences: ExperienceItem[], currentPage: number) {
  const totalPages = Math.max(1, Math.ceil(experiences.length / ITEMS_PER_PAGE))
  const safePage = Math.min(Math.max(currentPage, 1), totalPages)
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, experiences.length)

  return {
    currentPage: safePage,
    endIndex,
    items: experiences.slice(startIndex, endIndex),
    startIndex,
    totalPages,
  }
}

export function formatExperiencePeriod(experience: ExperienceItem) {
  if (experience.type === "academica") return experience.endDate ? formatExperienceDate(experience.endDate) : "Actual"
  return `${formatExperienceDate(experience.startDate)} - ${experience.current ? "Actual" : formatExperienceDate(experience.endDate)}`
}
