import type { ExperienceDto, ExperienceGroup, UnknownRecord } from "@/services/experienceDtoService"

export function parseExperienceResponse(data: unknown): unknown {
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

export function unwrapExperience(data: unknown): ExperienceDto {
  const unwrapped = unwrapPayload(data)
  return (unwrapped ?? {}) as ExperienceDto
}

export function unwrapExperienceGroups(data: unknown): ExperienceGroup[] {
  const unwrapped = unwrapPayload(data)

  if (Array.isArray(unwrapped)) {
    return [{ items: unwrapped as ExperienceDto[] }]
  }

  if (!unwrapped || typeof unwrapped !== "object") {
    return []
  }

  return unwrapRecordGroups(unwrapped as UnknownRecord)
}

function unwrapPayload(data: unknown): unknown {
  if (!data || typeof data !== "object") {
    return data
  }

  const record = data as UnknownRecord
  const nextPayload = record.data ?? record.experience ?? record.education

  if (nextPayload && typeof nextPayload === "object") {
    return unwrapPayload(nextPayload)
  }

  return data
}

function unwrapRecordGroups(record: UnknownRecord): ExperienceGroup[] {
  if (Array.isArray(record.experiences)) {
    return [{ items: record.experiences as ExperienceDto[] }]
  }

  if (Array.isArray(record.experience)) {
    return [{ items: record.experience as ExperienceDto[] }]
  }

  if (Array.isArray(record.laboral) || Array.isArray(record.academica)) {
    return buildTypedGroups(record.laboral, record.academica)
  }

  if (hasLegacyGroups(record)) {
    return buildTypedGroups(resolveWorkItems(record), resolveEducationItems(record))
  }

  return Array.isArray(record.data) ? [{ items: record.data as ExperienceDto[] }] : []
}

function hasLegacyGroups(record: UnknownRecord) {
  return ["work_experience", "work_experiences", "education", "educations"].some((key) => Array.isArray(record[key]))
}

function resolveWorkItems(record: UnknownRecord) {
  const single = Array.isArray(record.work_experience) ? record.work_experience : []
  return single.length ? single : record.work_experiences
}

function resolveEducationItems(record: UnknownRecord) {
  const single = Array.isArray(record.education) ? record.education : []
  return single.length ? single : record.educations
}

function buildTypedGroups(workItems: unknown, educationItems: unknown): ExperienceGroup[] {
  return [
    { items: Array.isArray(workItems) ? workItems as ExperienceDto[] : [], type: "laboral" },
    { items: Array.isArray(educationItems) ? educationItems as ExperienceDto[] : [], type: "academica" },
  ]
}
