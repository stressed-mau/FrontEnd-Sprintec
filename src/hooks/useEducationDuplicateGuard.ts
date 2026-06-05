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

  function validateUniqueInstitution() {
    clearDuplicateMessage()

    const institution = normalizeDuplicateText(formData.company)
    if (!institution) return true

    const hasDuplicateEducation = education.some((item) => normalizeDuplicateText(item.company) === institution)
    if (!hasDuplicateEducation) return true

    onBlur("company")
    setDuplicateMessage("Ya existe una formación académica registrada con esa institución. Ingresa una institución diferente.")
    return false
  }

  return {
    duplicateMessage,
    clearDuplicateMessage,
    validateUniqueInstitution,
  }
}

function normalizeDuplicateText(value: string) {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase("es-BO")
}
