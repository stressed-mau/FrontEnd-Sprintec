import axios from "axios"

import { api } from "@/services/api"
import { toAbsoluteAssetUrl } from "@/services/assetUrl"
import type { ExperienceItem, ExperiencePayload } from "@/services/experienceService"

type UnknownRecord = Record<string, unknown>

export type EducationOptions = {
  titles: string[]
  fields: string[]
}

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
  descripcion?: string | null
  start_date?: string | null
  initial_date?: string | null
  issue_date?: string | null
  issued_at?: string | null
  date_issued?: string | null
  emission_date?: string | null
  fecha_emision?: string | null
  end_date?: string | null
  final_date?: string | null
  startDate?: string | null
  endDate?: string | null
  current?: boolean | number | string | null
  is_current?: boolean | number | string | null
  isCurrent?: boolean | number | string | null
  status?: string | null
  estado?: string | null
  company_email?: string | null
  email?: string | null
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
}

const EDUCATION_ENDPOINT = "/education"
const EDUCATION_OPTIONS_ENDPOINT = "/education/options"
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

function normalizeEducation(dto: EducationDto, index: number): ExperienceItem {
  const endDate = normalizeDateValue(dto.end_date ?? dto.final_date ?? dto.endDate)
  const startDate = normalizeDateValue(
    dto.end_date ??
    dto.final_date ??
    dto.endDate ??
    dto.issue_date ??
    dto.issued_at ??
    dto.date_issued ??
    dto.emission_date ??
    dto.fecha_emision
  )

  return {
    id: asString(dto.id ?? dto.education_id) || `education-${index + 1}`,
    type: "academica",
    company: asString(dto.institution ?? dto.institution_name),
    email: asString(dto.company_email ?? dto.email),
    position: asString(dto.title ?? dto.degree),
    location: "",
    fieldOfStudy: asString(dto.field_to_study ?? dto.field_of_study ?? dto.field),
    description: asString(dto.description ?? dto.descripcion),
    startDate,
    endDate,
    current: !endDate,
    image: "",
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

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((item) => asString(item))
    .filter(Boolean)
}

function buildEducationFormData(payload: ExperiencePayload, options?: { mode?: "create" | "update" }) {
  const formData = new FormData()

  const description = payload.description.trim()
  const issueDate = payload.startDate.trim()
  const institution = payload.company.trim()
  const title = payload.position.trim()
  const fieldOfStudy = payload.fieldOfStudy.trim()

  if (options?.mode !== "update") {
    formData.append("institution", institution)
    formData.append("institution_name", institution)
    formData.append("title", title)
    formData.append("degree", title)
    formData.append("field_to_study", fieldOfStudy)
    formData.append("field_of_study", fieldOfStudy)

    if (issueDate) {
      formData.append("end_date", issueDate)
      formData.append("issue_date", issueDate)
      formData.append("date_issued", issueDate)
      formData.append("fecha_emision", issueDate)
    }

    if (payload.certificateFile) {
      formData.append("certificate", payload.certificateFile)
    }
  }

  if (description) {
    formData.append("description", description)
  }

  formData.append("is_current", payload.current ? "1" : "0")
  formData.append("current", payload.current ? "1" : "0")
  formData.append("status", payload.current ? "cursando" : "concluido")

  return formData
}

function buildEducationUpdateBody(payload: ExperiencePayload) {
  return {
    description: payload.description.trim(),
    end_date: payload.startDate.trim() || null,
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

export async function getEducationOptions(): Promise<EducationOptions> {
  try {
    const response = await api.get(EDUCATION_OPTIONS_ENDPOINT)
    const data = response.data && typeof response.data === "object"
      ? (response.data as UnknownRecord).data
      : null
    const options = data && typeof data === "object" ? data as UnknownRecord : {}

    return {
      titles: asStringArray(options.titles),
      fields: asStringArray(options.fields),
    }
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
