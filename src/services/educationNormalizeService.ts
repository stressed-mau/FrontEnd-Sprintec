import { toAbsoluteAssetUrl } from "@/services/assetUrl"
import type { EducationDto, EducationItem } from "@/types/education"

export function normalizeEducation(dto: EducationDto, index: number): EducationItem {
  const endDate = normalizeDateValue(dto.end_date ?? dto.final_date ?? dto.endDate)
  const currentlyStudying = asBoolean(dto.currently_studying ?? dto.current ?? dto.is_current ?? dto.isCurrent)

  return {
    id: asString(dto.id ?? dto.education_id) || `education-${index + 1}`,
    type: "academica",
    company: asString(dto.institution ?? dto.institution_name),
    email: asString(dto.company_email ?? dto.email),
    position: asString(dto.title ?? dto.degree),
    location: "",
    fieldOfStudy: asString(dto.field_to_study ?? dto.field_of_study ?? dto.field),
    description: asString(dto.description ?? dto.descripcion),
    startDate: getEducationStartDate(dto),
    endDate,
    current: currentlyStudying ?? !endDate,
    image: "",
    certificate: getEducationCertificateUrl(dto),
  }
}

export function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map((item) => asString(item)).filter(Boolean) : []
}

function getEducationStartDate(dto: EducationDto) {
  return normalizeDateValue(
    dto.start_date ?? dto.initial_date ?? dto.startDate ?? dto.issue_date ?? dto.issued_at ??
      dto.date_issued ?? dto.emission_date ?? dto.fecha_emision,
  )
}

function getEducationCertificateUrl(dto: EducationDto) {
  return toAbsoluteAssetUrl(
    dto.certification_url ?? dto.certification_path ?? dto.certification ?? dto.certificate_file_url ??
      dto.certificate_file ?? dto.certificate_url ?? dto.certificate_path ?? dto.certificate ??
      dto.document_url ?? dto.document_path ?? dto.document ?? dto.file_url ?? dto.file_path ?? dto.file ?? dto.attachment,
  )
}

function asString(value: unknown): string {
  if (typeof value === "string") return value.trim()
  if (typeof value === "number") return String(value)
  return ""
}

function asBoolean(value: unknown): boolean | null {
  if (typeof value === "boolean") return value
  if (typeof value === "number") return value === 1
  if (typeof value !== "string") return null

  const normalized = value.trim().toLowerCase()
  if (["1", "true", "si", "sí", "yes", "cursando"].includes(normalized)) return true
  if (["0", "false", "no", "concluido", "finalizado", "pendiente"].includes(normalized)) return false
  return null
}

function normalizeDateValue(value: unknown): string {
  const rawValue = asString(value)
  if (!rawValue) return ""

  const isoDateMatch = rawValue.match(/^(\d{4}-\d{2}-\d{2})/)
  if (isoDateMatch) return isoDateMatch[1]

  const slashDateMatch = rawValue.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  return slashDateMatch ? `${slashDateMatch[3]}-${slashDateMatch[2]}-${slashDateMatch[1]}` : rawValue
}
