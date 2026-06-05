import { api } from "@/services/api"
import { formatExperienceError } from "@/services/experienceErrorService"
import { asStringArray, normalizeExperience } from "@/services/experienceNormalizeService"
import { buildExperienceFormData, buildExperienceUpdateBody } from "@/services/experiencePayloadService"
import { parseExperienceResponse, unwrapExperience, unwrapExperienceGroups } from "@/services/experienceResponseService"
import type { UnknownRecord } from "@/services/experienceDtoService"
import type { ExperienceItem, ExperiencePayload, WorkOptions } from "@/types/experience"

export type { ExperienceItem, ExperiencePayload, ExperienceType, WorkOptions } from "@/types/experience"

const EXPERIENCES_ENDPOINT = "/experiences"
const WORK_OPTIONS_ENDPOINT = "/work/options"
const EXPERIENCE_MUTATION_TIMEOUT_MS = 30_000

export async function getExperiences(): Promise<ExperienceItem[]> {
  try {
    const response = await api.get(EXPERIENCES_ENDPOINT, {
      responseType: "text",
      transformResponse: (value) => value,
    })

    if (response.status === 204) {
      return []
    }

    return unwrapExperienceGroups(parseExperienceResponse(response.data)).flatMap((group) =>
      group.items.map((item, index) => normalizeExperience(item, index, group.type ?? "laboral")),
    )
  } catch (error) {
    throw formatExperienceError(error)
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
    throw formatExperienceError(error)
  }
}

export async function createExperience(payload: ExperiencePayload): Promise<ExperienceItem> {
  try {
    const response = await api.post(EXPERIENCES_ENDPOINT, buildExperienceFormData(payload), {
      timeout: EXPERIENCE_MUTATION_TIMEOUT_MS,
      headers: { Accept: "application/json" },
    })

    return normalizeExperience(unwrapExperience(response.data), 0, payload.type)
  } catch (error) {
    throw formatExperienceError(error)
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
    throw formatExperienceError(error)
  }
}

export async function removeExperience(id: string): Promise<void> {
  try {
    await api.delete(`${EXPERIENCES_ENDPOINT}/${id}`, {
      timeout: EXPERIENCE_MUTATION_TIMEOUT_MS,
    })
  } catch (error) {
    throw formatExperienceError(error)
  }
}
