import axios from "axios"

import { api } from "@/services/api"
import type { ExperienceItem, ExperiencePayload } from "@/services/experienceService"

type UnknownRecord = Record<string, unknown>

type EducationDto = {
  id?: string | number
  education_id?: string | number
  institution?: string
  institution_name?: string
  title?: string
  degree?: string
  field_to_study?: string | null
  field_of_study?: string | null
  field?: string | null
  description?: string | null
  start_date?: string | null
  initial_date?: string | null
  end_date?: string | null
  final_date?: string | null
  startDate?: string | null
  endDate?: string | null
  current?: boolean | number | string | null
  is_current?: boolean | number | string | null
  isCurrent?: boolean | number | string | null
  company_email?: string | null
  email?: string | null
  certificate?: string | null
  certificate_url?: string | null
  certification_url?: string | null
  certificate_path?: string | null
  document?: string | null
}

const EDUCATION_ENDPOINT = "/education"
const EDUCATION_MUTATION_TIMEOUT_MS = 30_000

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

    return new Error(backendMessage || "Error inesperado al consumir education API.")
  }

  return new Error("Error inesperado al consumir education API.")
}

function unwrapPayload(data: unknown): unknown {
  if (!data || typeof data !== "object") {
    return data
  }

  const record = data as UnknownRecord

  if ("data" in record && record.data && typeof record.data === "object") {
    return unwrapPayload(record.data)
  }

  if ("education" in record && record.education && typeof record.education === "object") {
    return unwrapPayload(record.education)
  }

  return data
}

function unwrapEducationList(data: unknown): EducationDto[] {
  const unwrapped = unwrapPayload(data)

  if (Array.isArray(unwrapped)) {
    return unwrapped as EducationDto[]
  }

  if (!unwrapped || typeof unwrapped !== "object") {
    return []
  }

  const record = unwrapped as UnknownRecord

  if (Array.isArray(record.education)) {
    return record.education as EducationDto[]
  }

  if (Array.isArray(record.educations)) {
    return record.educations as EducationDto[]
  }

  if (Array.isArray(record.data)) {
    return record.data as EducationDto[]
  }

  return []
}

function unwrapEducation(data: unknown): EducationDto {
  return (unwrapPayload(data) ?? {}) as EducationDto
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

function asString(value: unknown): string {
  if (typeof value === "string") {
    return value.trim()
  }

  if (typeof value === "number") {
    return String(value)
  }

  return ""
}

function asBoolean(value: unknown): boolean | null {
  if (typeof value === "boolean") return value
  if (typeof value === "number") return value === 1
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase()
    if (["1", "true", "yes", "si", "sÃ­"].includes(normalized)) return true
    if (["0", "false", "no"].includes(normalized)) return false
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

function normalizeEducation(dto: EducationDto, index: number): ExperienceItem {
  const endDate = normalizeDateValue(dto.end_date ?? dto.final_date ?? dto.endDate)
  const explicitCurrent = asBoolean(dto.current ?? dto.is_current ?? dto.isCurrent)

  return {
    id: asString(dto.id ?? dto.education_id) || `education-${index + 1}`,
    type: "academica",
    company: asString(dto.institution ?? dto.institution_name),
    email: asString(dto.company_email ?? dto.email),
    position: asString(dto.title ?? dto.degree),
    location: "",
    fieldOfStudy: asString(dto.field_to_study ?? dto.field_of_study ?? dto.field),
    description: asString(dto.description),
    startDate: normalizeDateValue(dto.start_date ?? dto.initial_date ?? dto.startDate),
    endDate,
    current: explicitCurrent ?? !endDate,
    image: "",
    certificate: toAbsoluteAssetUrl(dto.certification_url ?? dto.certificate_url ?? dto.certificate_path ?? dto.certificate ?? dto.document),
  }
}

function buildEducationFormData(payload: ExperiencePayload, options?: { mode?: "create" | "update" }) {
  const formData = new FormData()

  const description = payload.description.trim()
  const endDate = payload.endDate.trim()

  if (options?.mode !== "update") {
    formData.append("institution", payload.company.trim())
    formData.append("title", payload.position.trim())
    formData.append("field_to_study", payload.fieldOfStudy.trim())
    formData.append("start_date", payload.startDate.trim())

    if (payload.certificateFile) {
      formData.append("certificate", payload.certificateFile)
    }
  }

  if (description) {
    formData.append("description", description)
  }

  if (endDate) {
    formData.append("end_date", endDate)
  }

  formData.append("is_current", payload.current ? "1" : "0")
  formData.append("current", payload.current ? "1" : "0")

  return formData
}

function buildEducationUpdateBody(payload: ExperiencePayload) {
  return {
    description: payload.description.trim(),
    end_date: payload.current ? null : payload.endDate.trim() || null,
  }
}

export async function getEducation(): Promise<ExperienceItem[]> {
  try {
    const response = await api.get(EDUCATION_ENDPOINT, {
      responseType: "text",
      transformResponse: (value) => value,
    })

    if (response.status === 204) {
      return []
    }

    return unwrapEducationList(parseResponseData(response.data)).map((item, index) => normalizeEducation(item, index))
  } catch (error) {
    throw formatError(error)
  }
}

export async function createEducation(payload: ExperiencePayload): Promise<ExperienceItem> {
  try {
    const response = await api.post(EDUCATION_ENDPOINT, buildEducationFormData(payload), {
      timeout: EDUCATION_MUTATION_TIMEOUT_MS,
      headers: {
        Accept: "application/json",
      },
    })

    return normalizeEducation(unwrapEducation(response.data), 0)
  } catch (error) {
    throw formatError(error)
  }
}

export async function updateEducation(id: string, payload: ExperiencePayload): Promise<ExperienceItem> {
  try {
    const response = await api.put(`${EDUCATION_ENDPOINT}/${id}`, buildEducationUpdateBody(payload), {
      timeout: EDUCATION_MUTATION_TIMEOUT_MS,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    return normalizeEducation(unwrapEducation(response.data), 0)
  } catch (error) {
    throw formatError(error)
  }
}

export async function removeEducation(id: string): Promise<void> {
  try {
    await api.delete(`${EDUCATION_ENDPOINT}/${id}`, {
      timeout: EDUCATION_MUTATION_TIMEOUT_MS,
    })
  } catch (error) {
    throw formatError(error)
  }
}
