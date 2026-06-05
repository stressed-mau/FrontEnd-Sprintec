import type { ExperiencePayload } from "@/types/experience"

export function buildExperienceFormData(payload: ExperiencePayload, options?: { mode?: "create" | "update" }) {
  const formData = new FormData()

  appendCreateFields(formData, payload, options)
  appendOptionalTextField(formData, "description", payload.description)
  appendOptionalTextField(formData, "ubication", payload.location)
  appendOptionalTextField(formData, "end_date", payload.endDate)
  appendCurrentState(formData, payload.current)

  return formData
}

export function buildExperienceUpdateBody(payload: ExperiencePayload) {
  return {
    description: payload.description.trim(),
    ubication: payload.location.trim(),
    end_date: payload.endDate.trim() || null,
  }
}

function appendCreateFields(formData: FormData, payload: ExperiencePayload, options?: { mode?: "create" | "update" }) {
  if (options?.mode === "update") return

  formData.append("company_name", payload.company.trim())
  formData.append("role", payload.position.trim())
  formData.append("start_date", payload.startDate.trim())
  formData.append("company_email", payload.email.trim())
  if (payload.logoFile) formData.append("logo", payload.logoFile)
}

function appendOptionalTextField(formData: FormData, field: string, value: string) {
  const trimmedValue = value.trim()
  if (trimmedValue) formData.append(field, trimmedValue)
}

function appendCurrentState(formData: FormData, current: boolean) {
  formData.append("is_current", current ? "1" : "0")
  formData.append("current", current ? "1" : "0")
}
