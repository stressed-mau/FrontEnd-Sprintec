export function getMinimalistRecord(record: unknown): Record<string, unknown> {
  return record && typeof record === "object" ? record as Record<string, unknown> : {}
}

export function getMinimalistText(value: unknown) {
  return typeof value === "string" ? value : ""
}

export function getMinimalistId(source: Record<string, unknown>) {
  return String(source.id ?? "")
}

export function getMinimalistProjectTechnologies(project: unknown): string[] {
  const source = getMinimalistRecord(project)
  const technologies = source.technologies ?? source.tecnologias ?? source.languages ?? []
  if (!Array.isArray(technologies)) return []

  return technologies.map(getTechnologyName).filter(Boolean)
}

function getTechnologyName(technology: unknown) {
  if (typeof technology === "string") return technology.trim()
  const source = getMinimalistRecord(technology)
  return String(source.name ?? source.nombre ?? source.title ?? "").trim()
}
