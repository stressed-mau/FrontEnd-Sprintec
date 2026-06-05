import { api } from "@/services/api"
import { formatEducationError } from "@/services/educationErrorService"
import { normalizeEducation, asStringArray } from "@/services/educationNormalizeService"
import { buildEducationFormData, buildEducationJsonBody, buildEducationUpdateBody } from "@/services/educationPayloadService"
import { parseEducationResponse, unwrapEducation, unwrapEducationList } from "@/services/educationResponseService"
import type { EducationItem, EducationOptions, EducationPayload } from "@/types/education"

export type { EducationOptions } from "@/types/education"

const EDUCATION_ENDPOINT = "/education"
const EDUCATION_OPTIONS_ENDPOINT = "/education/options"
const EDUCATION_MUTATION_TIMEOUT_MS = 30_000

export async function getEducation(): Promise<EducationItem[]> {
  try {
    const response = await api.get(EDUCATION_ENDPOINT, {
      responseType: "text",
      transformResponse: (value) => value,
    })

    if (response.status === 204) return []
    return unwrapEducationList(parseEducationResponse(response.data)).map((item, index) => normalizeEducation(item, index))
  } catch (error) {
    throw formatEducationError(error)
  }
}

export async function getEducationOptions(): Promise<EducationOptions> {
  try {
    const response = await api.get(EDUCATION_OPTIONS_ENDPOINT)
    const options = getOptionsRecord(response.data)

    return {
      titles: asStringArray(options.titles),
      fields: asStringArray(options.fields),
    }
  } catch (error) {
    throw formatEducationError(error)
  }
}

export async function createEducation(payload: EducationPayload): Promise<EducationItem> {
  try {
    const hasCertificate = Boolean(payload.certificateFile)
    const body = hasCertificate ? buildEducationFormData(payload) : buildEducationJsonBody(payload)
    const response = await api.post(EDUCATION_ENDPOINT, body, {
      timeout: EDUCATION_MUTATION_TIMEOUT_MS,
      headers: hasCertificate ? { Accept: "application/json" } : { Accept: "application/json", "Content-Type": "application/json" },
    })

    return normalizeEducation(unwrapEducation(response.data), 0)
  } catch (error) {
    throw formatEducationError(error)
  }
}

export async function updateEducation(id: string, payload: EducationPayload): Promise<EducationItem> {
  try {
    const response = await api.put(`${EDUCATION_ENDPOINT}/${id}`, buildEducationUpdateBody(payload), {
      timeout: EDUCATION_MUTATION_TIMEOUT_MS,
      headers: { Accept: "application/json", "Content-Type": "application/json" },
    })

    return normalizeEducation(unwrapEducation(response.data), 0)
  } catch (error) {
    throw formatEducationError(error)
  }
}

export async function removeEducation(id: string): Promise<void> {
  try {
    await api.delete(`${EDUCATION_ENDPOINT}/${id}`, {
      timeout: EDUCATION_MUTATION_TIMEOUT_MS,
    })
  } catch (error) {
    throw formatEducationError(error)
  }
}

function getOptionsRecord(data: unknown): Record<string, unknown> {
  if (!data || typeof data !== "object" || Array.isArray(data)) return {}

  const record = data as Record<string, unknown>
  return record.data && typeof record.data === "object" && !Array.isArray(record.data)
    ? (record.data as Record<string, unknown>)
    : record
}
