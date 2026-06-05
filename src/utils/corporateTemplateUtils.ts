export function getCorporateInitials(name: string) {
  const trimmedName = name.trim()
  if (!trimmedName) return "CP"

  return trimmedName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
}

export function getCorporateRecord(record: unknown): Record<string, unknown> {
  return record && typeof record === "object" ? record as Record<string, unknown> : {}
}

export function getCorporateText(value: unknown) {
  return typeof value === "string" ? value : ""
}

export function getCorporateProjectTechnologies(project: unknown): string[] {
  const source = getCorporateRecord(project)
  const technologies = getTechnologySource(source)
  return technologies.map(normalizeTechnologyName).filter(Boolean)
}

function getTechnologySource(source: Record<string, unknown>) {
  if (Array.isArray(source.technologies) && source.technologies.length) return source.technologies
  if (Array.isArray(source.languages)) return source.languages
  if (Array.isArray(source.tecnologias)) return source.tecnologias
  return []
}

function normalizeTechnologyName(technology: unknown) {
  if (typeof technology === "string") return technology.trim()
  const source = getCorporateRecord(technology)
  return String(source.name ?? source.nombre ?? source.title ?? "").trim()
}
