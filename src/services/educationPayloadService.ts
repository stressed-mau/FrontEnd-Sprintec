import type { EducationPayload } from "@/types/education"

export function buildEducationFormData(payload: EducationPayload, options?: { mode?: "create" | "update" }) {
  const formData = new FormData()

  appendCreateFields(formData, payload, options)
  appendOptionalTextField(formData, "description", payload.description)

  return formData
}

export function buildEducationJsonBody(payload: EducationPayload, options?: { mode?: "create" | "update" }) {
  const description = payload.description.trim()
  const endDate = payload.current ? "" : payload.endDate.trim()

  if (options?.mode === "update") {
    return {
      description: description || null,
      start_date: null,
      end_date: endDate || null,
      currently_studying: payload.current,
    }
  }

  return {
    institution: payload.company.trim(),
    title: payload.position.trim(),
    field_to_study: payload.fieldOfStudy.trim(),
    description: description || null,
    start_date: null,
    end_date: endDate || null,
    currently_studying: payload.current,
  }
}

export function buildEducationUpdateBody(payload: EducationPayload) {
  return buildEducationJsonBody(payload, { mode: "update" })
}

function appendCreateFields(formData: FormData, payload: EducationPayload, options?: { mode?: "create" | "update" }) {
  if (options?.mode === "update") return

  formData.append("institution", payload.company.trim())
  formData.append("title", payload.position.trim())
  formData.append("field_to_study", payload.fieldOfStudy.trim())
  if (!payload.current) appendOptionalTextField(formData, "end_date", payload.endDate)
  formData.append("currently_studying", payload.current ? "1" : "0")
  if (payload.certificateFile) formData.append("certificate", payload.certificateFile)
}

function appendOptionalTextField(formData: FormData, field: string, value: string) {
  const trimmedValue = value.trim()
  if (trimmedValue) formData.append(field, trimmedValue)
}
