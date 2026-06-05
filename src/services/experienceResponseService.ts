import type { ExperienceDto, ExperienceType } from "@/types/experience"

type UnknownRecord = Record<string, unknown>

export interface ExperienceGroup {
  items: ExperienceDto[]
  type?: ExperienceType
}

export function parseExperienceResponse(data: unknown): unknown {
  if (data == null || data === "") return []
  if (typeof data !== "string") return data

  try {
    return JSON.parse(data)
  } catch {
    return data
  }
}

export function unwrapExperience(data: unknown): ExperienceDto {
  const unwrapped = unwrapPayload(data)
  return (unwrapped ?? {}) as ExperienceDto
}

export function unwrapExperienceGroups(data: unknown): ExperienceGroup[] {
  const unwrapped = unwrapPayload(data)
  if (Array.isArray(unwrapped)) return [{ items: unwrapped as ExperienceDto[] }]
  if (!isRecord(unwrapped)) return []

  return getDirectGroups(unwrapped) ?? getTypedGroups(unwrapped) ?? getLegacyGroups(unwrapped) ?? []
}

function unwrapPayload(data: unknown): unknown {
  if (!isRecord(data)) return data
  if (isRecord(data.data)) return unwrapPayload(data.data)
  if (isRecord(data.experience)) return unwrapPayload(data.experience)
  if (isRecord(data.education)) return unwrapPayload(data.education)
  return data
}

function getDirectGroups(record: UnknownRecord) {
  if (Array.isArray(record.experiences)) return [{ items: record.experiences as ExperienceDto[] }]
  if (Array.isArray(record.experience)) return [{ items: record.experience as ExperienceDto[] }]
  if (Array.isArray(record.data)) return [{ items: record.data as ExperienceDto[] }]
  return null
}

function getTypedGroups(record: UnknownRecord) {
  if (!Array.isArray(record.laboral) && !Array.isArray(record.academica)) return null

  return [
    { items: toExperienceList(record.laboral), type: "laboral" as const },
    { items: toExperienceList(record.academica), type: "academica" as const },
  ]
}

function getLegacyGroups(record: UnknownRecord) {
  const hasLegacyGroups = ["work_experience", "work_experiences", "education", "educations"].some((key) =>
    Array.isArray(record[key]),
  )
  if (!hasLegacyGroups) return null

  const workExperience = toExperienceList(record.work_experience)
  const education = toExperienceList(record.education)
  return [
    { items: workExperience.length ? workExperience : toExperienceList(record.work_experiences), type: "laboral" as const },
    { items: education.length ? education : toExperienceList(record.educations), type: "academica" as const },
  ]
}

function toExperienceList(value: unknown) {
  return Array.isArray(value) ? (value as ExperienceDto[]) : []
}

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value && typeof value === "object" && !Array.isArray(value))
}
