import axios from "axios"

import { api } from "@/services/api"
import { toAbsoluteAssetUrl } from "@/services/assetUrl"

export type ExperienceType = "laboral" | "academica"

type UnknownRecord = Record<string, unknown>

export type ExperienceItem = {
  id: string
  type: ExperienceType
  company: string
  email: string
  position: string
  location: string
  fieldOfStudy: string
  description: string
  startDate: string
  endDate: string
  current: boolean
  image: string
  certificate: string
}

export type ExperiencePayload = {
  type: ExperienceType
  company: string
  email: string
  position: string
  location: string
  fieldOfStudy: string
  description: string
  startDate: string
  endDate: string
  current: boolean
  logoFile?: File | null
  certificateFile?: File | null
  removeLogo?: boolean
  removeCertificate?: boolean
}

export type WorkOptions = {
  roles: string[]
}

type ExperienceDto = {
  id?: string | number
  experience_id?: string | number
  type?: string
  category?: string
  experience_type?: string
  name?: string
  nombre?: string
  company?: string
  company_name?: string
  empresa?: string
  organization?: string
  institution?: string
  institution_name?: string
  institucion?: string
  school?: string
  university?: string
  college?: string
  title?: string
  degree?: string
  role?: string
  job_title?: string
  titulo?: string
  position?: string
  cargo?: string
  puesto?: string
  description?: string | null
  descripcion?: string | null
  summary?: string | null
  details?: string | null
  content?: string | null
  start_date?: string | null
  initial_date?: string | null
  startDate?: string | null
  fecha_inicio?: string | null
  end_date?: string | null
  final_date?: string | null
  endDate?: string | null
  fecha_fin?: string | null
  company_email?: string | null
  companyEmail?: string | null
  email?: string | null
  correo_empresa?: string | null
  ubication?: string | null
  location?: string | null
  ubicacion?: string | null
  field_of_study?: string | null
  field?: string | null
  campo_estudio?: string | null
  logo?: string | null
  logo_url?: string | null
  logo_path?: string | null
  photograph?: string | null
  image_url?: string | null
  image?: string | null
  certificate?: string | null
  certificate_url?: string | null
  certification_url?: string | null
  certification?: string | null
  certification_path?: string | null
  certificate_file?: string | null
  certificate_file_url?: string | null
  certificate_path?: string | null
  document?: string | null
  document_url?: string | null
  document_path?: string | null
  file?: string | null
  file_url?: string | null
  file_path?: string | null
  attachment?: string | null
  current?: boolean | number | string | null
  is_current?: boolean | number | string | null
  isCurrent?: boolean | number | string | null
}

type ExperienceGroup = {
  items: ExperienceDto[]
  type?: ExperienceType
}

const EXPERIENCES_ENDPOINT = "/experiences"
const WORK_OPTIONS_ENDPOINT = "/work/options"
const EXPERIENCE_MUTATION_TIMEOUT_MS = 30_000

function formatError(error: unknown): Error {
  if (axios.isAxiosError(error)) {
    if (error.code === "ECONNABORTED") {
      return new Error("La solicitud tardó demasiado. Intenta nuevamente.")
    }

    if (error.code === "ERR_NETWORK") {
      return new Error("No se pudo conectar con el backend")
    }

    const backendMessage =
      (error.response?.data as { message?: string } | undefined)?.message ??
      error.message

    return new Error(backendMessage || "Error inesperado al consumir experiences API.")
  }

  return new Error("Error inesperado al consumir experiences API.")
}

function unwrapPayload(data: unknown): unknown {
  if (!data || typeof data !== "object") {
    return data
  }

  const record = data as UnknownRecord

  if ("data" in record && record.data && typeof record.data === "object") {
    return unwrapPayload(record.data)
  }

  if ("experience" in record && record.experience && typeof record.experience === "object") {
    return unwrapPayload(record.experience)
  }

  if ("education" in record && record.education && typeof record.education === "object") {
    return unwrapPayload(record.education)
  }

  return data
}

function unwrapExperienceGroups(data: unknown): ExperienceGroup[] {
  const unwrapped = unwrapPayload(data)

  if (Array.isArray(unwrapped)) {
    return [{ items: unwrapped as ExperienceDto[] }]
  }

  if (!unwrapped || typeof unwrapped !== "object") {
    return []
  }

  const record = unwrapped as UnknownRecord

  if (Array.isArray(record.experiences)) {
    return [{ items: record.experiences as ExperienceDto[] }]
  }

  if (Array.isArray(record.experience)) {
    return [{ items: record.experience as ExperienceDto[] }]
  }

  if (Array.isArray(record.laboral) || Array.isArray(record.academica)) {
    const laboral = Array.isArray(record.laboral) ? record.laboral as ExperienceDto[] : []
    const academica = Array.isArray(record.academica) ? record.academica as ExperienceDto[] : []
    return [
      { items: laboral, type: "laboral" },
      { items: academica, type: "academica" },
    ]
  }

  if (
    Array.isArray(record.work_experience) ||
    Array.isArray(record.work_experiences) ||
    Array.isArray(record.education) ||
    Array.isArray(record.educations)
  ) {
    const workExperience = Array.isArray(record.work_experience) ? record.work_experience as ExperienceDto[] : []
    const workExperiences = workExperience.length ? workExperience : Array.isArray(record.work_experiences) ? record.work_experiences as ExperienceDto[] : []
    const education = Array.isArray(record.education) ? record.education as ExperienceDto[] : []
    const educations = education.length ? education : Array.isArray(record.educations) ? record.educations as ExperienceDto[] : []
    return [
      { items: workExperiences, type: "laboral" },
      { items: educations, type: "academica" },
    ]
  }

  if (Array.isArray(record.data)) {
    return [{ items: record.data as ExperienceDto[] }]
  }

  return []
}

function unwrapExperience(data: unknown): ExperienceDto {
  const unwrapped = unwrapPayload(data)
  return (unwrapped ?? {}) as ExperienceDto
}

function parseResponseData(data: unknown): unknown {
  if (data == null || data === "") {
    return []
  }

  if (typeof data !== "string") {
    return data
  }

  try {
    return JSON.parse(data)
  } catch {
    return data
  }
}

function normalizeType(value: unknown): ExperienceType {
  const normalizedValue = typeof value === "string"
    ? value
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
    : ""

  if ([
    "academica",
    "academico",
    "academic",
    "education",
    "educacion",
    "formacion",
    "study",
    "estudio",
  ].includes(normalizedValue)) {
    return "academica"
  }

  return "laboral"
}

function asString(value: unknown): string {
  if (typeof value === "string") {
    return value.trim()
  }

  if (typeof value === "number") {
    return String(value)
  }

  return ""
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.map((item) => asString(item)).filter(Boolean)
}

function asId(value: unknown, fallback: string): string {
  const parsed = asString(value)
  return parsed || fallback
}

function asBoolean(value: unknown): boolean | null {
  if (typeof value === "boolean") {
    return value
  }

  if (typeof value === "number") {
    return value === 1
  }

  if (typeof value === "string") {
    const normalizedValue = value.trim().toLowerCase()

    if (["1", "true", "si", "sí", "actual"].includes(normalizedValue)) {
      return true
    }

    if (["0", "false", "no"].includes(normalizedValue)) {
      return false
    }
  }

  return null
}

function normalizeDateValue(value: unknown): string {
  const rawValue = asString(value)

  if (!rawValue) {
    return ""
  }

  const isoDateMatch = rawValue.match(/^(\d{4}-\d{2}-\d{2})/)

  if (isoDateMatch) {
    return isoDateMatch[1]
  }

  const slashDateMatch = rawValue.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)

  if (slashDateMatch) {
    return `${slashDateMatch[3]}-${slashDateMatch[2]}-${slashDateMatch[1]}`
  }

  return rawValue
}

function normalizeExperience(dto: ExperienceDto, index: number, typeHint?: ExperienceType): ExperienceItem {
  const endDate = normalizeDateValue(dto.end_date ?? dto.final_date ?? dto.endDate ?? dto.fecha_fin)
  const explicitCurrent = asBoolean(dto.current ?? dto.is_current ?? dto.isCurrent)
  const normalizedType = typeHint ?? normalizeType(dto.type ?? dto.category ?? dto.experience_type)

  return {
    id: asId(dto.id ?? dto.experience_id, `experience-${index + 1}`),
    type: normalizedType,
    company: asString(
      dto.name ??
      dto.nombre ??
      dto.company ??
      dto.company_name ??
      dto.empresa ??
      dto.organization ??
      dto.institution ??
      dto.institution_name ??
      dto.institucion ??
      dto.school ??
      dto.university ??
      dto.college,
    ),
    email: asString(dto.company_email ?? dto.companyEmail ?? dto.correo_empresa ?? dto.email),
    location: asString(dto.ubication ?? dto.location ?? dto.ubicacion),
    fieldOfStudy: asString(dto.field_of_study ?? dto.field ?? dto.campo_estudio),
    position: asString(
      dto.title ??
      dto.degree ??
      dto.role ??
      dto.job_title ??
      dto.titulo ??
      dto.position ??
      dto.cargo ??
      dto.puesto,
    ),
    description: asString(dto.description ?? dto.descripcion ?? dto.summary ?? dto.details ?? dto.content),
    startDate: normalizeDateValue(dto.start_date ?? dto.initial_date ?? dto.startDate ?? dto.fecha_inicio),
    endDate,
    current: explicitCurrent ?? !endDate,
    image: toAbsoluteAssetUrl(dto.logo_url ?? dto.logo_path ?? dto.logo ?? dto.image_url ?? dto.image ?? dto.photograph),
    certificate: toAbsoluteAssetUrl(
      dto.certification_url ??
      dto.certification_path ??
      dto.certification ??
      dto.certificate_file_url ??
      dto.certificate_file ??
      dto.certificate_url ??
      dto.certificate_path ??
      dto.certificate ??
      dto.document_url ??
      dto.document_path ??
      dto.document ??
      dto.file_url ??
      dto.file_path ??
      dto.file ??
      dto.attachment,
    ),
  }
}

function buildExperienceFormData(payload: ExperiencePayload, options?: { mode?: "create" | "update" }) {
  const formData = new FormData()

  const description = payload.description.trim()
  const email = payload.email.trim()
  const endDate = payload.endDate.trim()
  const location = payload.location.trim()

  if (options?.mode !== "update") {
    formData.append("company_name", payload.company.trim())
    formData.append("role", payload.position.trim())
    formData.append("start_date", payload.startDate.trim())

    formData.append("company_email", email)

    if (payload.logoFile) {
      formData.append("logo", payload.logoFile)
    }
  }

  if (description) {
    formData.append("description", description)
  }

  if (location) {
    formData.append("ubication", location)
  }

  if (endDate) {
    formData.append("end_date", endDate)
  }

  formData.append("is_current", payload.current ? "1" : "0")
  formData.append("current", payload.current ? "1" : "0")

  return formData
}

function buildExperienceUpdateBody(payload: ExperiencePayload) {
  return {
    description: payload.description.trim(),
    ubication: payload.location.trim(),
    end_date: payload.endDate.trim() || null,
  }
}

export async function getExperiences(): Promise<ExperienceItem[]> {
  try {
    const response = await api.get(EXPERIENCES_ENDPOINT, {
      responseType: "text",
      transformResponse: (value) => value,
    })

    if (response.status === 204) {
      return []
    }

    return unwrapExperienceGroups(parseResponseData(response.data)).flatMap((group) =>
      group.items.map((item, index) => normalizeExperience(item, index, group.type ?? "laboral")),
    )
  } catch (error) {
    throw formatError(error)
  }
}

export async function getWorkOptions(): Promise<WorkOptions> {
  try {
    const response = await api.get(WORK_OPTIONS_ENDPOINT)
    const data = response.data && typeof response.data === "object"
      ? (response.data as UnknownRecord).data
      : null
    const options = data && typeof data === "object" ? data as UnknownRecord : {}

    return {
      roles: asStringArray(options.roles ?? options.positions ?? options.titles ?? options.cargos),
    }
  } catch (error) {
    throw formatError(error)
  }
}

export async function createExperience(payload: ExperiencePayload): Promise<ExperienceItem> {
  try {
    const response = await api.post(EXPERIENCES_ENDPOINT, buildExperienceFormData(payload), {
      timeout: EXPERIENCE_MUTATION_TIMEOUT_MS,
      headers: {
        Accept: "application/json",
      },
    })

    return normalizeExperience(unwrapExperience(response.data), 0, payload.type)
  } catch (error) {
    throw formatError(error)
  }
}

export async function updateExperience(id: string, payload: ExperiencePayload): Promise<ExperienceItem> {
  try {
    const response = await api.put(`${EXPERIENCES_ENDPOINT}/${id}`, buildExperienceUpdateBody(payload), {
      timeout: EXPERIENCE_MUTATION_TIMEOUT_MS,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    return normalizeExperience(unwrapExperience(response.data), 0, payload.type)
  } catch (error) {
    throw formatError(error)
  }
}

export async function removeExperience(id: string): Promise<void> {
  try {
    await api.delete(`${EXPERIENCES_ENDPOINT}/${id}`, {
      timeout: EXPERIENCE_MUTATION_TIMEOUT_MS,
    })
  } catch (error) {
    throw formatError(error)
  }
}
