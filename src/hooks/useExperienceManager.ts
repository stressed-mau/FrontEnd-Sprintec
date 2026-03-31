import { useMemo, useRef, useState } from "react"
import type { ChangeEvent, FormEvent } from "react"

export type ExperienceType = "laboral" | "academica"

export type ExperienceItem = {
  id: number
  type: ExperienceType
  company: string
  position: string
  description: string
  startDate: string
  endDate: string
  current: boolean
  image: string
}

export type ExperienceFormValues = Omit<ExperienceItem, "id">

export type ExperienceFormErrors = Partial<Record<keyof ExperienceFormValues, string>>

const EMPTY_FORM: ExperienceFormValues = {
  type: "laboral",
  company: "",
  position: "",
  description: "",
  startDate: "",
  endDate: "",
  current: false,
  image: "",
}

const DATE_PATTERN = /^(\d{2})\/(\d{2})\/(\d{4})$/

function parseDate(value: string) {
  const trimmedValue = value.trim()
  const matches = DATE_PATTERN.exec(trimmedValue)

  if (!matches) {
    return null
  }

  const day = Number(matches[1])
  const month = Number(matches[2])
  const year = Number(matches[3])
  const parsedDate = new Date(year, month - 1, day)

  const isSameDate =
    parsedDate.getFullYear() === year &&
    parsedDate.getMonth() === month - 1 &&
    parsedDate.getDate() === day

  if (!isSameDate) {
    return null
  }

  parsedDate.setHours(0, 0, 0, 0)
  return parsedDate
}

function isFutureDate(value: string) {
  const parsedDate = parseDate(value)

  if (!parsedDate) {
    return false
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return parsedDate.getTime() > today.getTime()
}

export function formatExperienceDate(value: string) {
  const parsedDate = parseDate(value)

  if (!parsedDate) {
    return value
  }

  return parsedDate.toLocaleDateString("es-BO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

function validateExperienceField(
  field: keyof ExperienceFormValues,
  values: ExperienceFormValues,
): string {
  const company = values.company.trim()
  const position = values.position.trim()
  const description = values.description.trim()
  const startDate = values.startDate.trim()
  const endDate = values.endDate.trim()

  if (field === "company") {
    if (!company) {
      return "El campo empresa o institución es obligatorio."
    }

    if (company.length > 100) {
      return "El nombre de la empresa no puede exceder los 100 caracteres."
    }
  }

  if (field === "position") {
    if (!position) {
      return "El campo cargo es obligatorio."
    }

    if (position.length > 80) {
      return "El cargo no puede exceder los 80 caracteres."
    }
  }

  if (field === "description" && description.length > 300) {
    return "La descripción no puede exceder los 300 caracteres."
  }

  if (field === "startDate") {
    if (!startDate) {
      return "El campo Fecha de inicio es obligatorio."
    }

    if (!parseDate(startDate)) {
      return "La fecha debe tener un formato válido (dd/mm/aaaa)."
    }

    if (isFutureDate(startDate)) {
      return "La fecha no puede ser mayor a la fecha actual."
    }
  }

  if (field === "endDate") {
    if (values.current) {
      return ""
    }

    if (!endDate) {
      return "El campo Fecha de fin es obligatorio."
    }

    if (!parseDate(endDate)) {
      return "La fecha debe tener un formato válido (dd/mm/aaaa)."
    }

    if (isFutureDate(endDate)) {
      return "La fecha no puede ser mayor a la fecha actual."
    }

    const parsedStartDate = parseDate(startDate)
    const parsedEndDate = parseDate(endDate)

    if (parsedStartDate && parsedEndDate && parsedEndDate < parsedStartDate) {
      return "La fecha de fin no puede ser anterior a la fecha de inicio."
    }
  }

  return ""
}

export function useExperienceManager() {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<ExperienceFormValues>(EMPTY_FORM)
  const [errors, setErrors] = useState<ExperienceFormErrors>({})
  const [feedbackMessage, setFeedbackMessage] = useState("")
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "">("")
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const isEditing = useMemo(() => editingId !== null, [editingId])
  const laboralExperiences = useMemo(
    () => experiences.filter((experience) => experience.type === "laboral"),
    [experiences],
  )
  const academicExperiences = useMemo(
    () => experiences.filter((experience) => experience.type === "academica"),
    [experiences],
  )

  function showFeedback(message: string, type: "success" | "error") {
    setFeedbackMessage(message)
    setFeedbackType(type)
  }

  function clearFeedback() {
    setFeedbackMessage("")
    setFeedbackType("")
  }

  function resetForm() {
    setEditingId(null)
    setFormData(EMPTY_FORM)
    setErrors({})

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  function closeModal() {
    resetForm()
    setIsModalOpen(false)
  }

  function openCreateModal() {
    clearFeedback()
    resetForm()
    setIsModalOpen(true)
  }

  function openEditModal(experience: ExperienceItem) {
    clearFeedback()
    setEditingId(experience.id)
    setFormData({
      type: experience.type,
      company: experience.company,
      position: experience.position,
      description: experience.description,
      startDate: experience.startDate,
      endDate: experience.endDate,
      current: experience.current,
      image: experience.image,
    })
    setErrors({})
    setIsModalOpen(true)
  }

  function updateField(field: keyof ExperienceFormValues, value: string | boolean) {
    const nextValues: ExperienceFormValues = {
      ...formData,
      [field]: value,
    } as ExperienceFormValues

    if (field === "current" && value === true) {
      nextValues.endDate = ""
    }

    setFormData(nextValues)

    if (field === "current") {
      setErrors((currentErrors) => ({
        ...currentErrors,
        endDate: validateExperienceField("endDate", nextValues),
      }))
      return
    }

    if (errors[field]) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [field]: validateExperienceField(field, nextValues),
      }))
    }

    if ((field === "startDate" || field === "endDate") && errors.endDate) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        endDate: validateExperienceField("endDate", nextValues),
      }))
    }
  }

  function handleBlur(field: keyof ExperienceFormValues) {
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: validateExperienceField(field, formData),
    }))

    if (field === "startDate" || field === "endDate") {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [field]: validateExperienceField(field, formData),
        endDate: validateExperienceField("endDate", formData),
      }))
    }
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setFormData((current) => ({
        ...current,
        image: typeof reader.result === "string" ? reader.result : "",
      }))
    }
    reader.readAsDataURL(file)
  }

  function removeImage() {
    setFormData((current) => ({ ...current, image: "" }))

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    clearFeedback()

    const nextErrors: ExperienceFormErrors = {
      company: validateExperienceField("company", formData),
      position: validateExperienceField("position", formData),
      description: validateExperienceField("description", formData),
      startDate: validateExperienceField("startDate", formData),
      endDate: validateExperienceField("endDate", formData),
    }

    setErrors(nextErrors)

    if (Object.values(nextErrors).some(Boolean)) {
      return
    }

    const payload: ExperienceItem = {
      id: editingId ?? Date.now(),
      type: formData.type,
      company: formData.company.trim(),
      position: formData.position.trim(),
      description: formData.description.trim(),
      startDate: formData.startDate.trim(),
      endDate: formData.current ? "" : formData.endDate.trim(),
      current: formData.current,
      image: formData.image,
    }

    if (isEditing) {
      setExperiences((current) =>
        current.map((experience) => (experience.id === editingId ? payload : experience)),
      )
    } else {
      setExperiences((current) => [payload, ...current])
    }

    showFeedback("Experiencia registrada correctamente.", "success")
    closeModal()
  }

  function handleDelete(id: number) {
    clearFeedback()
    setExperiences((current) => current.filter((experience) => experience.id !== id))
  }

  return {
    formData,
    errors,
    isModalOpen,
    isEditing,
    feedbackMessage,
    feedbackType,
    laboralExperiences,
    academicExperiences,
    fileInputRef,
    openCreateModal,
    openEditModal,
    closeModal,
    updateField,
    handleBlur,
    handleImageChange,
    removeImage,
    handleSubmit,
    handleDelete,
  }
}
