import type { ExperienceItem } from "@/hooks/useExperienceManager"

export const ITEMS_PER_PAGE = 10

export function getExperienceTypeLabel(type: ExperienceItem["type"]) {
  return type === "academica" ? "Academica" : "Laboral"
}

export function filterExperiences(experiences: ExperienceItem[], searchTerm: string) {
  const query = searchTerm.trim().toLocaleLowerCase("es-BO")

  if (!query) {
    return experiences
  }

  return experiences.filter((experience) =>
    [
      experience.company,
      experience.position,
      experience.email,
      experience.location,
      experience.fieldOfStudy,
      getExperienceTypeLabel(experience.type),
    ].some((value) => value.toLocaleLowerCase("es-BO").includes(query)),
  )
}

export function paginateExperiences(experiences: ExperienceItem[], currentPage: number) {
  const totalPages = Math.max(1, Math.ceil(experiences.length / ITEMS_PER_PAGE))
  const safePage = Math.min(currentPage, totalPages)
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
