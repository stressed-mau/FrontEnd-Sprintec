import type { ExperiencePayload } from "@/types/experience"

export function buildExperienceFormData(payload: ExperiencePayload) {
  const formData = new FormData()
  const description = payload.description.trim()
  const email = payload.email.trim()
  const endDate = payload.endDate.trim()
  const location = payload.location.trim()

  formData.append("company_name", payload.company.trim())
  formData.append("role", payload.position.trim())
  formData.append("start_date", payload.startDate.trim())
  formData.append("company_email", email)

  if (payload.logoFile) {
    formData.append("logo", payload.logoFile)
  }

  appendOptionalField(formData, "description", description)
  appendOptionalField(formData, "ubication", location)
  appendOptionalField(formData, "end_date", endDate)
  appendCurrentFields(formData, payload.current)

  return formData
}

export function buildExperienceUpdateBody(payload: ExperiencePayload) {
  return {
    description: payload.description.trim(),
    ubication: payload.location.trim(),
    end_date: payload.endDate.trim() || null,
  }
}

function appendOptionalField(formData: FormData, key: string, value: string) {
  if (value) {
    formData.append(key, value)
  }
}

function appendCurrentFields(formData: FormData, current: boolean) {
  formData.append("is_current", current ? "1" : "0")
  formData.append("current", current ? "1" : "0")
}
