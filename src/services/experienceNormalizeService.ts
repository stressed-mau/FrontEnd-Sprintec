import { toAbsoluteAssetUrl } from "@/services/assetUrl"
import type { ExperienceDto } from "@/services/experienceDtoService"
import type { ExperienceItem, ExperienceType } from "@/types/experience"

export function normalizeExperience(dto: ExperienceDto, index: number, typeHint?: ExperienceType): ExperienceItem {
  const endDate = normalizeDateValue(dto.end_date ?? dto.final_date ?? dto.endDate ?? dto.fecha_fin)
  const explicitCurrent = asBoolean(dto.current ?? dto.is_current ?? dto.isCurrent)

  return {
    id: asId(dto.id ?? dto.experience_id, `experience-${index + 1}`),
    type: typeHint ?? normalizeType(dto.type ?? dto.category ?? dto.experience_type),
    company: resolveCompany(dto),
    email: asString(dto.company_email ?? dto.companyEmail ?? dto.correo_empresa ?? dto.email),
    location: asString(dto.ubication ?? dto.location ?? dto.ubicacion),
    fieldOfStudy: asString(dto.field_of_study ?? dto.field ?? dto.campo_estudio),
    position: resolvePosition(dto),
    description: asString(dto.description ?? dto.descripcion ?? dto.summary ?? dto.details ?? dto.content),
    startDate: normalizeDateValue(dto.start_date ?? dto.initial_date ?? dto.startDate ?? dto.fecha_inicio),
    endDate,
    current: explicitCurrent ?? !endDate,
    image: resolveImage(dto),
    certificate: resolveCertificate(dto),
  }
}

export function asString(value: unknown): string {
  if (typeof value === "string") return value.trim()
  if (typeof value === "number") return String(value)
  return ""
}

export function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map((item) => asString(item)).filter(Boolean) : []
}

function normalizeType(value: unknown): ExperienceType {
  const normalizedValue = asString(value).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  const educationTypes = ["academica", "academico", "academic", "education", "educacion", "formacion", "study", "estudio"]
  return educationTypes.includes(normalizedValue) ? "academica" : "laboral"
}

function asId(value: unknown, fallback: string): string {
  return asString(value) || fallback
}

function asBoolean(value: unknown): boolean | null {
  if (typeof value === "boolean") return value
  if (typeof value === "number") return value === 1
  if (typeof value !== "string") return null

  const normalizedValue = value.trim().toLowerCase()
  if (["1", "true", "si", "sí", "actual"].includes(normalizedValue)) return true
  if (["0", "false", "no"].includes(normalizedValue)) return false
  return null
}

function normalizeDateValue(value: unknown): string {
  const rawValue = asString(value)
  const isoDateMatch = rawValue.match(/^(\d{4}-\d{2}-\d{2})/)
  const slashDateMatch = rawValue.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)

  if (!rawValue) return ""
  if (isoDateMatch) return isoDateMatch[1]
  if (slashDateMatch) return `${slashDateMatch[3]}-${slashDateMatch[2]}-${slashDateMatch[1]}`
  return rawValue
}

function resolveCompany(dto: ExperienceDto) {
  return asString(
    dto.name ?? dto.nombre ?? dto.company ?? dto.company_name ?? dto.empresa ?? dto.organization ??
    dto.institution ?? dto.institution_name ?? dto.institucion ?? dto.school ?? dto.university ?? dto.college,
  )
}

function resolvePosition(dto: ExperienceDto) {
  return asString(dto.title ?? dto.degree ?? dto.role ?? dto.job_title ?? dto.titulo ?? dto.position ?? dto.cargo ?? dto.puesto)
}

function resolveImage(dto: ExperienceDto) {
  return toAbsoluteAssetUrl(dto.logo_url ?? dto.logo_path ?? dto.logo ?? dto.image_url ?? dto.image ?? dto.photograph)
}

function resolveCertificate(dto: ExperienceDto) {
  return toAbsoluteAssetUrl(
    dto.certification_url ?? dto.certification_path ?? dto.certification ?? dto.certificate_file_url ??
    dto.certificate_file ?? dto.certificate_url ?? dto.certificate_path ?? dto.certificate ??
    dto.document_url ?? dto.document_path ?? dto.document ?? dto.file_url ?? dto.file_path ?? dto.file ?? dto.attachment,
  )
}
