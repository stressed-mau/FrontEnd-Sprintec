import type { EducationDto } from "@/types/education"

type UnknownRecord = Record<string, unknown>

export function parseEducationResponse(data: unknown): unknown {
  if (data == null || data === "") return []
  if (typeof data !== "string") return data

  try {
    return JSON.parse(data)
  } catch {
    return data
  }
}

export function unwrapEducationList(data: unknown): EducationDto[] {
  const unwrapped = unwrapPayload(data)
  if (Array.isArray(unwrapped)) return unwrapped as EducationDto[]
  if (!isRecord(unwrapped)) return []

  if (Array.isArray(unwrapped.education)) return unwrapped.education as EducationDto[]
  if (Array.isArray(unwrapped.educations)) return unwrapped.educations as EducationDto[]
  if (Array.isArray(unwrapped.data)) return unwrapped.data as EducationDto[]
  return []
}

export function unwrapEducation(data: unknown): EducationDto {
  return (unwrapPayload(data) ?? {}) as EducationDto
}

function unwrapPayload(data: unknown): unknown {
  if (!isRecord(data)) return data
  if (isRecord(data.data)) return unwrapPayload(data.data)
  if (isRecord(data.education)) return unwrapPayload(data.education)
  return data
}

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value && typeof value === "object" && !Array.isArray(value))
}
