import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { ChangeEvent, FormEvent } from "react"

import { useEmailValidation } from "@/hooks/useEmailValidation"
import {
  createExperience,
  getExperiences,
  removeExperience,
  updateExperience,
  type ExperienceItem,
  type ExperiencePayload,
} from "@/services/experienceService"

export type { ExperienceItem, ExperienceType } from "@/services/experienceService"

export type ExperienceFormValues = Omit<ExperienceItem, "id">

export type ExperienceFormErrors = Partial<Record<keyof ExperienceFormValues, string>>

const EMPTY_FORM: ExperienceFormValues = {
  type: "laboral",
  company: "",
  email: "",
  position: "",
  description: "",
  startDate: "",
  endDate: "",
  current: false,
  image: "",
}

const DATE_PATTERN = /^(\d{2})\/(\d{2})\/(\d{4})$/
const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/
const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png"]

function normalizeFormDate(value: string) {
  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return ""
  }

  const isoDateMatch = trimmedValue.match(/^(\d{4}-\d{2}-\d{2})/)

  if (isoDateMatch) {
    return isoDateMatch[1]
  }

  const slashDateMatch = trimmedValue.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)

  if (slashDateMatch) {
    return `${slashDateMatch[3]}-${slashDateMatch[2]}-${slashDateMatch[1]}`
  }

  return trimmedValue
}

function parseDate(value: string) {
  const trimmedValue = value.trim()
  const isoMatches = ISO_DATE_PATTERN.exec(trimmedValue)

  if (isoMatches) {
    const year = Number(isoMatches[1])
    const month = Number(isoMatches[2])
    const day = Number(isoMatches[3])
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

function isIsoDate(value: string) {
  return ISO_DATE_PATTERN.test(value.trim())
}

function validateExperienceField(
  field: keyof ExperienceFormValues,
  values: ExperienceFormValues,
): string {
  const company = values.company.trim()
  const email = values.email.trim()
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

  if (field === "email") {
    if (values.type !== "laboral") {
      return ""
    }

    if (!email) {
      return "El correo electrónico es obligatorio para una experiencia laboral."
    }

    if (email.length > 60) {
      return "El correo electrónico no puede exceder los 60 caracteres."
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "El correo electrónico debe tener un formato válido."
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

    if (!isIsoDate(startDate) || !parseDate(startDate)) {
      return "Seleccione una fecha válida."
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

    if (!isIsoDate(endDate) || !parseDate(endDate)) {
      return "Seleccione una fecha válida."
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

  if (field === "image" && values.image.length > 0 && values.image.length > 10_000_000) {
    return "La imagen seleccionada no es válida."
  }

  return ""
}

export function useExperienceManager() {
  const { sanitizeEmailInput, validateEmail } = useEmailValidation()

  const [experiences, setExperiences] = useState<ExperienceItem[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingExperience, setEditingExperience] = useState<ExperienceItem | null>(null)
  const [formData, setFormData] = useState<ExperienceFormValues>(EMPTY_FORM)
  const [errors, setErrors] = useState<ExperienceFormErrors>({})
  const [feedbackMessage, setFeedbackMessage] = useState("")
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "">("")
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [pageError, setPageError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [hasRemovedExistingImage, setHasRemovedExistingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const isEditing = useMemo(() => editingExperience !== null, [editingExperience])
  const laboralExperiences = useMemo(
    () => experiences.filter((experience) => experience.type === "laboral"),
    [experiences],
  )
  const academicExperiences = useMemo(
    () => experiences.filter((experience) => experience.type === "academica"),
    [experiences],
  )
  const canRemoveImage = useMemo(
    () => Boolean(selectedImageFile) || Boolean(formData.image),
    [formData.image, selectedImageFile],
  )

  const loadExperiences = useCallback(async () => {
    setIsLoading(true)
    setPageError("")

    try {
      const remoteExperiences = await getExperiences()
      setExperiences(remoteExperiences)
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudieron cargar las experiencias."
      setPageError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadExperiences()
  }, [loadExperiences])

  function showFeedback(message: string, type: "success" | "error") {
    setFeedbackMessage(message)
    setFeedbackType(type)
  }

  function clearFeedback() {
    setFeedbackMessage("")
    setFeedbackType("")
  }

  function openSuccessModal(message: string) {
    setSuccessMessage(message)
    setIsSuccessModalOpen(true)
  }

  function closeSuccessModal() {
    setIsSuccessModalOpen(false)
    setSuccessMessage("")
  }

  function resetForm() {
    setEditingExperience(null)
    setSelectedImageFile(null)
    setHasRemovedExistingImage(false)
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
    closeSuccessModal()
    resetForm()
    setIsModalOpen(true)
  }

  function openEditModal(experience: ExperienceItem) {
    clearFeedback()
    closeSuccessModal()
    setEditingExperience(experience)
    setSelectedImageFile(null)
    setHasRemovedExistingImage(false)
    setFormData({
      type: experience.type,
      company: experience.company,
      email: experience.email,
      position: experience.position,
      description: experience.description,
      startDate: normalizeFormDate(experience.startDate),
      endDate: normalizeFormDate(experience.endDate),
      current: experience.current,
      image: experience.image,
    })
    setErrors({})

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }

    setIsModalOpen(true)
  }

  function updateField(field: keyof ExperienceFormValues, value: string | boolean) {
    const normalizedValue =
      field === "email" && typeof value === "string" ? sanitizeEmailInput(value) : value

    const nextValues: ExperienceFormValues = {
      ...formData,
      [field]: normalizedValue,
    } as ExperienceFormValues

    if (field === "type" && value === "academica") {
      nextValues.email = ""
    }

    if (field === "current" && value === true) {
      nextValues.endDate = ""
    }

    setFormData(nextValues)

    if (field === "type") {
      setErrors((currentErrors) => ({
        ...currentErrors,
        email: validateExperienceField("email", nextValues),
      }))
    }

    if (field === "current") {
      setErrors((currentErrors) => ({
        ...currentErrors,
        endDate: validateExperienceField("endDate", nextValues),
      }))
      return
    }

    if (field === "email" && typeof normalizedValue === "string") {
      validateEmail(normalizedValue)
    }

    if (field === "type") {
      validateEmail(nextValues.email)
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

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        image: "El logo solo permite archivos JPG o PNG.",
      }))

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      return
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        image: "El logo permite archivos de hasta 2 MB.",
      }))

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      return
    }

    setSelectedImageFile(file)
    setHasRemovedExistingImage(false)

    const reader = new FileReader()
    reader.onload = () => {
      setFormData((current) => ({
        ...current,
        image: typeof reader.result === "string" ? reader.result : "",
      }))
      setErrors((currentErrors) => ({
        ...currentErrors,
        image: "",
      }))
    }
    reader.readAsDataURL(file)
  }

  function removeImage() {
    setSelectedImageFile(null)
    setHasRemovedExistingImage(Boolean(editingExperience?.image))
    setFormData((current) => ({ ...current, image: "" }))
    setErrors((currentErrors) => ({
      ...currentErrors,
      image: "",
    }))

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    clearFeedback()
    setPageError("")

    if (isSaving) {
      return
    }

    const nextErrors: ExperienceFormErrors = {
      company: validateExperienceField("company", formData),
      email: validateExperienceField("email", formData),
      position: validateExperienceField("position", formData),
      description: validateExperienceField("description", formData),
      startDate: validateExperienceField("startDate", formData),
      endDate: validateExperienceField("endDate", formData),
    }

    setErrors(nextErrors)

    if (Object.values(nextErrors).some(Boolean)) {
      return
    }

    const payload: ExperiencePayload = {
      type: formData.type,
      company: formData.company.trim(),
      email: formData.type === "laboral" ? formData.email.trim() : "",
      position: formData.position.trim(),
      description: formData.description.trim(),
      startDate: formData.startDate.trim(),
      endDate: formData.current ? "" : formData.endDate.trim(),
      current: formData.current,
      logoFile: selectedImageFile,
      removeLogo: hasRemovedExistingImage && !selectedImageFile,
    }

    try {
      setIsSaving(true)

      if (editingExperience) {
        await updateExperience(editingExperience.id, payload)
        closeModal()
        openSuccessModal("Experiencia actualizada correctamente.")
      } else {
        await createExperience(payload)
        closeModal()
        openSuccessModal("Experiencia registrada correctamente.")
      }

      await loadExperiences()
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo guardar la experiencia."
      showFeedback(message, "error")
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete(id: string) {
    clearFeedback()
    setPageError("")

    const targetExperience = experiences.find((experience) => experience.id === id)

    if (!targetExperience) {
      setPageError("No se encontró la experiencia seleccionada.")
      return
    }

    try {
      await removeExperience(id, targetExperience.type)
      await loadExperiences()
      showFeedback("Experiencia eliminada correctamente.", "success")
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo eliminar la experiencia."
      setPageError(message)
    }
  }

  return {
    formData,
    errors,
    isModalOpen,
    isEditing,
    feedbackMessage,
    feedbackType,
    isSuccessModalOpen,
    successMessage,
    pageError,
    isLoading,
    isSaving,
    canRemoveImage,
    laboralExperiences,
    academicExperiences,
    fileInputRef,
    openCreateModal,
    openEditModal,
    closeModal,
    closeSuccessModal,
    updateField,
    handleBlur,
    handleImageChange,
    removeImage,
    handleSubmit,
    handleDelete,
    reloadExperiences: loadExperiences,
  }
}
