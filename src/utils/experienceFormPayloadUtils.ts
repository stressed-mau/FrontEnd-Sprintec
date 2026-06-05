import type { ExperienceItem, ExperiencePayload } from "@/types/experience"
import type { ExperienceFormValues } from "@/hooks/useExperienceManager"

export function toExperienceFormValues(experience: ExperienceItem): ExperienceFormValues {
  return {
    type: "laboral",
    company: experience.company,
    email: experience.email,
    position: experience.position,
    location: experience.location,
    fieldOfStudy: experience.fieldOfStudy,
    description: experience.description,
    startDate: experience.startDate,
    endDate: experience.endDate,
    current: experience.current,
    image: experience.image,
    certificate: experience.certificate,
  }
}

export function buildExperiencePayload(values: ExperienceFormValues, imageFile: File | null): ExperiencePayload {
  return {
    type: "laboral",
    company: values.company.trim(),
    email: values.email.trim(),
    position: values.position.trim(),
    location: values.location.trim(),
    fieldOfStudy: "",
    description: values.description.trim(),
    startDate: values.startDate.trim(),
    endDate: values.endDate.trim(),
    current: values.current,
    logoFile: imageFile,
  }
}

export function hasExperienceChanges(payload: ExperiencePayload, originalValues: ExperienceFormValues | null) {
  if (!originalValues) return true

  return (
    payload.company !== originalValues.company.trim() ||
    payload.email !== originalValues.email.trim() ||
    payload.position !== originalValues.position.trim() ||
    payload.location !== originalValues.location.trim() ||
    payload.description !== originalValues.description.trim() ||
    payload.startDate !== originalValues.startDate.trim() ||
    payload.endDate !== originalValues.endDate.trim() ||
    payload.current !== originalValues.current ||
    Boolean(payload.logoFile)
  )
}
