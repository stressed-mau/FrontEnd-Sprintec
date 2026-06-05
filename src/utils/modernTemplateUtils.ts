export function getModernRecord(record: unknown): Record<string, unknown> {
  return record && typeof record === "object" ? record as Record<string, unknown> : {}
}

export function getModernText(value: unknown) {
  return typeof value === "string" ? value : ""
}

export function getModernId(source: Record<string, unknown>) {
  return String(source.id ?? "")
}

export function getModernKey(source: Record<string, unknown>, fallback: string) {
  return `${getModernText(source.sourceTable) || fallback}-${getModernId(source)}`
}

export function getModernProjectTechnologies(project: unknown): string[] {
  const source = getModernRecord(project)
  const technologies = source.technologies ?? source.tecnologias ?? source.languages ?? []
  if (!Array.isArray(technologies)) return []

  return technologies.map(getTechnologyName).filter(Boolean)
}

function getTechnologyName(technology: unknown) {
  if (typeof technology === "string") return technology
  const source = getModernRecord(technology)
  return getModernText(source.name) || getModernText(source.nombre) || getModernText(source.title)
}
