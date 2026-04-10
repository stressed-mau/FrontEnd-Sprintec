import axios from "axios"

import { api } from "@/services/api"

export type ExperienceType = "laboral" | "academica"

type UnknownRecord = Record<string, unknown>

export type ExperienceItem = {
  id: string
  type: ExperienceType
  company: string
  email: string
  position: string
  description: string
  startDate: string
  endDate: string
  current: boolean
  image: string
}

export type ExperiencePayload = {
  type: ExperienceType
  company: string
  email: string
  position: string
  description: string
  startDate: string
  endDate: string
  current: boolean
  logoFile?: File | null
  removeLogo?: boolean
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
  startDate?: string | null
  fecha_inicio?: string | null
  end_date?: string | null
  endDate?: string | null
  fecha_fin?: string | null
  company_email?: string | null
  email?: string | null
  correo_empresa?: string | null
  logo?: string | null
  logo_url?: string | null
  logo_path?: string | null
  image_url?: string | null
  image?: string | null
  current?: boolean | number | string | null
  is_current?: boolean | number | string | null
}

type ExperienceGroup = {
  items: ExperienceDto[]
  type?: ExperienceType
}

const EXPERIENCES_ENDPOINT = "/experiences"
const EXPERIENCE_MUTATION_TIMEOUT_MS = 10_000

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

  if (Array.isArray(record.work_experience) || Array.isArray(record.education)) {
    const workExperience = Array.isArray(record.work_experience) ? record.work_experience as ExperienceDto[] : []
    const education = Array.isArray(record.education) ? record.education as ExperienceDto[] : []
    return [
      { items: workExperience, type: "laboral" },
      { items: education, type: "academica" },
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

function toAbsoluteAssetUrl(value: unknown): string {
  const rawValue = asString(value)

  if (!rawValue) {
    return ""
  }

  if (/^(https?:|data:|blob:)/i.test(rawValue)) {
    return rawValue
  }

  const apiBaseUrl = api.defaults.baseURL ?? ""

  try {
    const rootUrl = apiBaseUrl.replace(/\/api\/?$/, "/")
    return new URL(rawValue.replace(/^\/+/, ""), rootUrl).toString()
  } catch {
    return rawValue
  }
}

function normalizeExperience(dto: ExperienceDto, index: number, typeHint?: ExperienceType): ExperienceItem {
  const endDate = normalizeDateValue(dto.end_date ?? dto.endDate ?? dto.fecha_fin)
  const explicitCurrent = asBoolean(dto.current ?? dto.is_current)
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
    email: asString(dto.company_email ?? dto.correo_empresa ?? dto.email),
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
    startDate: normalizeDateValue(dto.start_date ?? dto.startDate ?? dto.fecha_inicio),
    endDate,
    current: explicitCurrent ?? !endDate,
    image: toAbsoluteAssetUrl(dto.logo_url ?? dto.logo_path ?? dto.logo ?? dto.image_url ?? dto.image),
  }
}

function buildFormData(payload: ExperiencePayload, options?: { methodOverride?: "PUT" }) {
  const formData = new FormData()

  if (options?.methodOverride) {
    formData.append("_method", options.methodOverride)
  }

  formData.append("type", payload.type)
  formData.append("name", payload.company.trim())
  formData.append("company", payload.company.trim())
  formData.append(payload.type === "academica" ? "institution" : "company_name", payload.company.trim())
  formData.append("title", payload.position.trim())
  formData.append("position", payload.position.trim())
  formData.append(payload.type === "academica" ? "degree" : "job_title", payload.position.trim())
  formData.append("start_date", payload.startDate.trim())

  const description = payload.description.trim()
  const email = payload.email.trim()
  const endDate = payload.current ? "" : payload.endDate.trim()

  if (description) {
    formData.append("description", description)
    formData.append("summary", description)
  }

  if (email) {
    formData.append("company_email", email)
    formData.append("email", email)
  }

  if (endDate) {
    formData.append("end_date", endDate)
  }

  if (payload.logoFile) {
    formData.append("logo", payload.logoFile)
  }

  if (payload.removeLogo) {
    formData.append("remove_logo", "1")
  }

  return formData
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
      group.items.map((item, index) => normalizeExperience(item, index, group.type)),
    )
  } catch (error) {
    throw formatError(error)
  }
}

export async function createExperience(payload: ExperiencePayload): Promise<ExperienceItem> {
  try {
    const response = await api.post(EXPERIENCES_ENDPOINT, buildFormData(payload), {
      timeout: EXPERIENCE_MUTATION_TIMEOUT_MS,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    return normalizeExperience(unwrapExperience(response.data), 0)
  } catch (error) {
    throw formatError(error)
  }
}

export async function updateExperience(id: string, payload: ExperiencePayload): Promise<ExperienceItem> {
  try {
    const response = await api.post(`${EXPERIENCES_ENDPOINT}/${id}`, buildFormData(payload, { methodOverride: "PUT" }), {
      timeout: EXPERIENCE_MUTATION_TIMEOUT_MS,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    return normalizeExperience(unwrapExperience(response.data), 0)
  } catch (error) {
    throw formatError(error)
  }
}

export async function removeExperience(id: string, type: ExperienceType): Promise<void> {
  try {
    await api.delete(`${EXPERIENCES_ENDPOINT}/${id}`, {
      timeout: EXPERIENCE_MUTATION_TIMEOUT_MS,
      params: { type },
    })
  } catch (error) {
    throw formatError(error)
  }
}
