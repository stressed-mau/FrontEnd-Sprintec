import type { ProjectItem, ProjectTechnology } from "@/types/project"

export function extractProjectList(body: unknown): unknown[] | null {
  if (Array.isArray(body)) return body
  if (!isRecord(body)) return null

  const data = body.data

  if (Array.isArray(data)) return data
  if (Array.isArray(body.projects)) return body.projects
  if (!isRecord(data)) return null
  if (Array.isArray(data.projects)) return data.projects
  if (Array.isArray(data.data)) return data.data
  if (isRecord(data.data) && Array.isArray(data.data.projects)) return data.data.projects

  return null
}

export function normalizeTechnology(value: unknown, index = 0): ProjectTechnology | null {
  if (typeof value === "string") {
    const name = value.trim()
    return name ? { id: index, name } : null
  }

  if (!isRecord(value)) return null

  const id = Number(value.id ?? index)
  const name = getTechnologyName(value)

  return Number.isFinite(id) && name ? { id, name } : null
}

export function normalizeProject(value: unknown): ProjectItem {
  const record = isRecord(value) ? value : {}
  const technologies = normalizeTechnologies(record.languages ?? record.technologies ?? record.tecnologias)
  const finalDate = normalizeDate(record.final_date ?? record.end_date ?? record.fechaFin)

  return {
    id: Number(record.id ?? 0),
    nombre: String(record.title ?? record.nombre ?? "Proyecto sin titulo"),
    descripcion: String(record.description ?? record.descripcion ?? ""),
    tecnologias: technologies,
    rol: String(record.project_rol ?? record.project_role ?? record.role ?? record.rol ?? record.projectRole ?? ""),
    fechaInicio: normalizeDate(record.initial_date ?? record.start_date ?? record.fechaInicio),
    fechaFin: finalDate || undefined,
    is_current: normalizeBoolean(record.is_current ?? record.current),
    github: record.url_to_project || record.github ? String(record.url_to_project ?? record.github) : undefined,
    demo: record.url_to_deploy || record.demo ? String(record.url_to_deploy ?? record.demo) : undefined,
    image: extractImageUrl(record),
  }
}

function normalizeTechnologies(value: unknown) {
  if (!Array.isArray(value)) return []
  return value.map(normalizeTechnology).filter((technology): technology is ProjectTechnology => Boolean(technology))
}

function getTechnologyName(value: Record<string, unknown>) {
  if (typeof value.name === "string") return value.name
  if (typeof value.nombre === "string") return value.nombre
  return typeof value.title === "string" ? value.title : ""
}

function extractImageUrl(value: Record<string, unknown>): string | undefined {
  const direct = value.photograph ?? value.image ?? value.image_url ?? value.url_image
  if (typeof direct === "string") return direct

  const image = value.image
  if (!isRecord(image)) return undefined

  if (typeof image.url === "string") return image.url
  return typeof image.path === "string" ? image.path : undefined
}

function normalizeDate(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) return ""
  const trimmed = value.trim()
  const isoDate = trimmed.match(/^(\d{4}-\d{2}-\d{2})/)
  if (isoDate) return isoDate[1]

  const slashDate = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  return slashDate ? `${slashDate[3]}-${slashDate[2]}-${slashDate[1]}` : trimmed
}

function normalizeBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value
  if (typeof value === "number") return value === 1
  if (typeof value !== "string") return false
  return ["1", "true", "si", "sí", "yes"].includes(value.trim().toLowerCase())
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value))
}
