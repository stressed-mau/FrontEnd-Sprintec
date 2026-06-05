import { useState } from "react"

import type { EducationFormValues, EducationItem } from "@/types/education"

type EducationDuplicateGuardOptions = {
  education: EducationItem[]
  formData: EducationFormValues
  onBlur: (field: keyof EducationFormValues) => void
}

export function useEducationDuplicateGuard({ education, formData, onBlur }: EducationDuplicateGuardOptions) {
  const [duplicateMessage, setDuplicateMessage] = useState("")

  function clearDuplicateMessage() {
    setDuplicateMessage("")
  }

  function validateUniqueEducation() {
    clearDuplicateMessage()
    if (!hasRequiredDuplicateFields(formData)) return true
    if (!hasDuplicateEducationRecord(education, formData)) return true

    markDuplicateFields(onBlur)
    setDuplicateMessage("Ya existe una formación académica registrada con esos datos.")
    return false
  }

  return {
    duplicateMessage,
    clearDuplicateMessage,
    validateUniqueEducation,
  }
}

function hasDuplicateEducationRecord(education: EducationItem[], formData: EducationFormValues) {
  return education.some((item) => (
    normalizeDuplicateText(item.company) === normalizeDuplicateText(formData.company) &&
    normalizeDuplicateText(item.position) === normalizeDuplicateText(formData.position) &&
    normalizeDuplicateText(item.fieldOfStudy) === normalizeDuplicateText(formData.fieldOfStudy)
  ))
}

function hasRequiredDuplicateFields(formData: EducationFormValues) {
  return Boolean(
    normalizeDuplicateText(formData.company) &&
    normalizeDuplicateText(formData.position) &&
    normalizeDuplicateText(formData.fieldOfStudy),
  )
}

function markDuplicateFields(onBlur: (field: keyof EducationFormValues) => void) {
  onBlur("company")
  onBlur("position")
  onBlur("fieldOfStudy")
}

function normalizeDuplicateText(value: string) {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase("es-BO")
}
