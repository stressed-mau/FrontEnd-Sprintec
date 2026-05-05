import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { ChangeEvent, FormEvent } from "react"

import isEmail from "validator/lib/isEmail"
import {
  createEducation,
  getEducation,
  removeEducation,
  updateEducation,
} from "@/services/educationService"
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
export type ExperienceEditableFieldState = Partial<Record<keyof ExperienceFormValues, boolean>>

const EMPTY_FORM: ExperienceFormValues = {
  type: "laboral",
  company: "",
  email: "",
  position: "",
  location: "",
  fieldOfStudy: "",
  description: "",
  startDate: "",
  endDate: "",
  current: false,
  image: "",
  certificate: "",
}

const DATE_PATTERN = /^(\d{2})\/(\d{2})\/(\d{4})$/
const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/
const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024
const MAX_CERTIFICATE_SIZE_BYTES = 2 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"]
const ALLOWED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png"]
const ALLOWED_CERTIFICATE_TYPES = ["image/jpeg", "image/png", "image/jpg", "application/pdf"]
const ALLOWED_CERTIFICATE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".pdf"]
const COMPANY_MAX_LENGTH = 100
const COMPANY_ALLOWED_CHARACTERS = /^[\p{L}\s.,]+$/u
const ACADEMIC_INSTITUTION_ALLOWED_CHARACTERS = /^[\p{L}0-9\s]+$/u
function normalizeExperienceTypeValue(value: string): ExperienceFormValues["type"] {
  return value === "academica" ? "academica" : "laboral"
}

function sanitizeCompanyInput(value: string, type: ExperienceFormValues["type"]) {
  const allowedCharacters = type === "academica"
    ? /[^\p{L}0-9\s]/gu
    : /[^\p{L}\s.,]/gu

  return value.replace(allowedCharacters, "").slice(0, COMPANY_MAX_LENGTH)
}

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

function normalizeComparableText(value: string) {
  return value.trim().toLocaleLowerCase("es-BO")
}

function resolveExperienceRange(values: Pick<ExperienceFormValues, "startDate" | "endDate" | "current">) {
  const start = parseDate(values.startDate)

  if (!start) {
    return null
  }

  const end = values.current || !values.endDate.trim() ? null : parseDate(values.endDate)

  if (values.endDate.trim() && !values.current && !end) {
    return null
  }

  return { start, end }
}

function experiencesOverlap(
  left: Pick<ExperienceFormValues, "startDate" | "endDate" | "current">,
  right: Pick<ExperienceFormValues, "startDate" | "endDate" | "current">,
) {
  const leftRange = resolveExperienceRange(left)
  const rightRange = resolveExperienceRange(right)

  if (!leftRange || !rightRange) {
    return false
  }

  const leftEndTime = leftRange.end?.getTime() ?? Number.POSITIVE_INFINITY
  const rightEndTime = rightRange.end?.getTime() ?? Number.POSITIVE_INFINITY

  return leftRange.start.getTime() <= rightEndTime && rightRange.start.getTime() <= leftEndTime
}

function findDuplicateExperience(
  experiences: ExperienceItem[],
  values: ExperienceFormValues,
  editingExperienceId?: string,
) {
  const normalizedType = normalizeExperienceTypeValue(values.type)
  const normalizedCompany = normalizeComparableText(values.company)
  const normalizedPosition = normalizeComparableText(values.position)

  return experiences.find((experience) => {
    if (editingExperienceId && experience.id === editingExperienceId) {
      return false
    }

    return (
      normalizeExperienceTypeValue(experience.type) === normalizedType &&
      normalizeComparableText(experience.company) === normalizedCompany &&
      normalizeComparableText(experience.position) === normalizedPosition &&
      experiencesOverlap(values, experience)
    )
  })
}

function hasAllowedImageFormat(file: File) {
  const normalizedFileName = file.name.trim().toLowerCase()
  const hasAllowedExtension = ALLOWED_IMAGE_EXTENSIONS.some((extension) => normalizedFileName.endsWith(extension))

  if (hasAllowedExtension) {
    return true
  }

  return ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase())
}

function hasAllowedCertificateFormat(file: File) {
  const normalizedFileName = file.name.trim().toLowerCase()
  const hasAllowedExtension = ALLOWED_CERTIFICATE_EXTENSIONS.some((extension) => normalizedFileName.endsWith(extension))

  if (hasAllowedExtension) {
    return true
  }

  return ALLOWED_CERTIFICATE_TYPES.includes(file.type.toLowerCase())
}

function validateImageFile(file: File | null): string {
  if (!file) {
    return ""
  }

  if (!hasAllowedImageFormat(file)) {
    return "La imagen solo permite archivos JPG, JPEG o PNG."
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return "La imagen permite archivos de hasta 2 MB."
  }

  return ""
}

function validateCertificateFile(file: File | null): string {
  if (!file) {
    return ""
  }

  if (!hasAllowedCertificateFormat(file)) {
    return "El documento de formación solo permite subir archivos PDF, JPG, JPEG o PNG."
  }

  if (file.size > MAX_CERTIFICATE_SIZE_BYTES) {
    return "El tamaño máximo permitido para el archivo de certificación es de 2 MB."
  }

  return ""
}

function validateExperienceField(
  field: keyof ExperienceFormValues,
  values: ExperienceFormValues,
): string {
  const company = values.company.trim()
  const position = values.position.trim()
  const fieldOfStudy = values.fieldOfStudy.trim()
  const description = values.description.trim()
  const startDate = values.startDate.trim()
  const endDate = values.endDate.trim()

  if (field === "type") {
    if (values.type !== "laboral" && values.type !== "academica") {
      return "Seleccione un tipo de experiencia válido."
    }
  }

  if (field === "company") {
    if (!company) {
      return values.type === "laboral"
        ? "El campo empresa es obligatorio."
        : "El campo Institución académica es obligatorio."
    }

    const hasValidCompanyCharacters = values.type === "academica"
      ? ACADEMIC_INSTITUTION_ALLOWED_CHARACTERS.test(company)
      : COMPANY_ALLOWED_CHARACTERS.test(company)

    if (!hasValidCompanyCharacters) {
      return values.type === "laboral"
        ? "El campo empresa solo permite ingresar caracteres literales, puntos y comas."
        : "El campo Institución académica contiene caracteres no válidos."
    }

    if (company.length > COMPANY_MAX_LENGTH) {
      return values.type === "laboral"
        ? "El nombre de la empresa no puede exceder los 100 caracteres."
        : ""
    }
  }

  if (field === "email") {
    if (values.type !== "laboral") {
      return ""
    }

    const rawEmail = values.email
    const normalizedEmail = rawEmail.trim()

    if (rawEmail.length > 0 && /\s/.test(rawEmail)) {
      return "El campo Correo electrónico de la empresa no puede contener espacios en blanco"
    }

    if (!normalizedEmail) {
      return "El campo Correo electrónico de la empresa es obligatorio."
    }

    if (normalizedEmail.length > 60) {
      return "El campo Correo electrónico permite un máximo de 60 caracteres."
    }

    if (!isEmail(normalizedEmail)) {
      return "El Correo electrónico debe tener un formato válido (ej. usuario@gmail.com)."
    }
  }

  if (field === "position") {
    if (!position) {
      return values.type === "academica"
        ? "Se debe seleccionar un nivel de formación."
        : "Se debe seleccionar un cargo."
    }

    if (position.length > 80) {
      return values.type === "academica"
        ? "El nivel de formación no puede exceder los 80 caracteres."
        : "El cargo no puede exceder los 80 caracteres."
    }
  }

  if (field === "fieldOfStudy" && values.type === "academica") {
    if (!fieldOfStudy) {
      return "Se debe seleccionar un área de estudio."
    }

    if (fieldOfStudy.length > 100) {
      return "El área de estudio no puede exceder los 100 caracteres."
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
    if (!endDate && !values.current) {
      return "El campo Fecha de finalización es obligatorio."
    }

    if (!endDate) {
      return ""
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
      return "La fecha de finalización no puede ser anterior a la fecha de inicio."
    }
  }

  return ""
}

function validateRequiredEditedField(
  field: keyof ExperienceFormValues,
  value: string | boolean,
  originalValues: ExperienceFormValues | null,
) {
  if (!originalValues || typeof value !== "string") {
    return ""
  }

  const originalValue = originalValues[field]
  if (typeof originalValue !== "string" || !originalValue.trim() || value.trim()) {
    return ""
  }

  if (field === "location" || field === "description" || field === "fieldOfStudy") {
    return "Este campo no puede quedar vacío."
  }

  return ""
}

function hasPayloadChanges(
  payload: ExperiencePayload,
  originalValues: ExperienceFormValues | null,
) {
  if (!originalValues) {
    return true
  }

  return (
    payload.type !== originalValues.type ||
    payload.company !== originalValues.company.trim() ||
    payload.email !== originalValues.email.trim() ||
    payload.position !== originalValues.position.trim() ||
    payload.location !== originalValues.location.trim() ||
    payload.fieldOfStudy !== originalValues.fieldOfStudy.trim() ||
    payload.description !== originalValues.description.trim() ||
    payload.startDate !== originalValues.startDate.trim() ||
    payload.endDate !== originalValues.endDate.trim() ||
    payload.current !== originalValues.current ||
    Boolean(payload.logoFile) ||
    Boolean(payload.certificateFile) ||
    Boolean(payload.removeLogo) ||
    Boolean(payload.removeCertificate)
  )
}

export function useExperienceManager() {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConfirmEditModalOpen, setIsConfirmEditModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false)
  const [editingExperience, setEditingExperience] = useState<ExperienceItem | null>(null)
  const [originalEditingValues, setOriginalEditingValues] = useState<ExperienceFormValues | null>(null)
  const [pendingEditPayload, setPendingEditPayload] = useState<ExperiencePayload | null>(null)
  const [formData, setFormData] = useState<ExperienceFormValues>(EMPTY_FORM)
  const [errors, setErrors] = useState<ExperienceFormErrors>({})
  const [feedbackMessage, setFeedbackMessage] = useState("")
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "">("")
  const [successTitle, setSuccessTitle] = useState("Éxito")
  const [successMessage, setSuccessMessage] = useState("")
  const [duplicateMessage, setDuplicateMessage] = useState("")
  const [pageError, setPageError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [selectedCertificateFile, setSelectedCertificateFile] = useState<File | null>(null)
  const [hasRemovedExistingImage, setHasRemovedExistingImage] = useState(false)
  const [hasRemovedExistingCertificate, setHasRemovedExistingCertificate] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const certificateInputRef = useRef<HTMLInputElement | null>(null)

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
  const canRemoveCertificate = useMemo(
    () => Boolean(selectedCertificateFile) || Boolean(formData.certificate),
    [formData.certificate, selectedCertificateFile],
  )

  const loadExperiences = useCallback(async () => {
    setIsLoading(true)
    setPageError("")

    try {
      const [remoteExperiences, remoteEducation] = await Promise.all([
        getExperiences(),
        getEducation(),
      ])
      setExperiences([...remoteExperiences, ...remoteEducation])
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

  function showSuccessModal(message: string, title = "Éxito") {
    setSuccessTitle(title)
    setSuccessMessage(message)
    setIsSuccessModalOpen(true)
  }

  function openConfirmEditModal(payload: ExperiencePayload) {
    setPendingEditPayload(payload)
    setIsConfirmEditModalOpen(true)
  }

  function closeConfirmEditModal() {
    setPendingEditPayload(null)
    setIsConfirmEditModalOpen(false)
  }

  function closeSuccessModal() {
    setIsSuccessModalOpen(false)
    setSuccessTitle("Éxito")
    setSuccessMessage("")
  }

  function showDuplicateModal(message: string) {
    setDuplicateMessage(message)
    setIsDuplicateModalOpen(true)
  }

  function closeDuplicateModal() {
    setIsDuplicateModalOpen(false)
    setDuplicateMessage("")
  }

  function resetForm() {
    setEditingExperience(null)
    setOriginalEditingValues(null)
    setSelectedImageFile(null)
    setSelectedCertificateFile(null)
    setHasRemovedExistingImage(false)
    setHasRemovedExistingCertificate(false)
    closeConfirmEditModal()
    setFormData(EMPTY_FORM)
    setErrors({})

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }

    if (certificateInputRef.current) {
      certificateInputRef.current.value = ""
    }
  }

  function closeModal() {
    resetForm()
    setIsModalOpen(false)
  }

  function openCreateModal(initialType: ExperienceFormValues["type"] = "laboral") {
    clearFeedback()
    closeConfirmEditModal()
    closeSuccessModal()
    closeDuplicateModal()
    resetForm()
    setFormData({ ...EMPTY_FORM, type: normalizeExperienceTypeValue(initialType) })
    setIsModalOpen(true)
  }

  function prepareCreateForm(initialType: ExperienceFormValues["type"] = "laboral") {
    clearFeedback()
    closeConfirmEditModal()
    closeSuccessModal()
    closeDuplicateModal()
    resetForm()
    setFormData({ ...EMPTY_FORM, type: normalizeExperienceTypeValue(initialType) })
  }

  function openEditModal(experience: ExperienceItem) {
    clearFeedback()
    closeConfirmEditModal()
    closeSuccessModal()
    closeDuplicateModal()
    const nextFormData = {
      type: normalizeExperienceTypeValue(experience.type),
      company: experience.company,
      email: experience.email,
      position: experience.position,
      location: experience.location,
      fieldOfStudy: experience.fieldOfStudy,
      description: experience.description,
      startDate: normalizeFormDate(experience.startDate),
      endDate: normalizeFormDate(experience.endDate),
      current: experience.current,
      image: experience.image,
      certificate: experience.certificate,
    }

    setEditingExperience(experience)
    setOriginalEditingValues(nextFormData)
    setSelectedImageFile(null)
    setSelectedCertificateFile(null)
    setHasRemovedExistingImage(false)
    setHasRemovedExistingCertificate(false)
    setFormData(nextFormData)
    setErrors({})

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }

    if (certificateInputRef.current) {
      certificateInputRef.current.value = ""
    }

    setIsModalOpen(true)
  }

  function updateField(field: keyof ExperienceFormValues, value: string | boolean) {
    if (editingExperience && originalEditingValues) {
      const lockedFields: Array<keyof ExperienceFormValues> = ["type", "company", "email", "position", "startDate"]

      if (lockedFields.includes(field)) {
        return
      }

      if (editingExperience.type === "laboral" && !originalEditingValues.current) {
        return
      }

      if (field !== "endDate" && field !== "description" && field !== "location" && typeof value === "string" && typeof originalEditingValues[field] === "string") {
        const originalValue = originalEditingValues[field]

        if (!originalValue.trim()) {
          return
        }
      }
    }

    const normalizedValue =
      field === "type" && typeof value === "string"
        ? normalizeExperienceTypeValue(value)
        : field === "company" && typeof value === "string"
          ? sanitizeCompanyInput(value, formData.type)
        : field === "email" && typeof value === "string"
          ? value.slice(0, 60)
          : value

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

    if (field === "endDate" && typeof normalizedValue === "string" && normalizedValue.trim()) {
      nextValues.current = false
    }

    setFormData(nextValues)

    if (field === "current") {
      setErrors((currentErrors) => ({
        ...currentErrors,
        current: "",
        endDate: validateExperienceField("endDate", nextValues),
      }))
      return
    }

    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: validateRequiredEditedField(field, normalizedValue, originalEditingValues) || validateExperienceField(field, nextValues),
      ...(field === "type" && nextValues.type === "academica"
        ? { email: "" }
        : {}),
      ...(field === "startDate" || field === "endDate" || field === "type"
        ? { endDate: validateExperienceField("endDate", nextValues) }
        : {}),
    }))
  }

  function handleBlur(field: keyof ExperienceFormValues) {
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: validateRequiredEditedField(field, formData[field], originalEditingValues) || validateExperienceField(field, formData),
    }))

    if (field === "startDate" || field === "endDate") {
      setErrors((currentErrors) => ({
        ...currentErrors,
          [field]: validateRequiredEditedField(field, formData[field], originalEditingValues) || validateExperienceField(field, formData),
        endDate: validateExperienceField("endDate", formData),
      }))
    }
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const imageError = validateImageFile(file)

    if (imageError) {
      setSelectedImageFile(null)
      setFormData((current) => ({ ...current, image: editingExperience?.image ?? "" }))
      setErrors((currentErrors) => ({
        ...currentErrors,
        image: imageError,
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
    if (editingExperience?.image) {
      return false
    }

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

  function handleCertificateChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const certificateError = validateCertificateFile(file)

    if (certificateError) {
      setSelectedCertificateFile(null)
      setFormData((current) => ({ ...current, certificate: editingExperience?.certificate ?? "" }))
      setErrors((currentErrors) => ({
        ...currentErrors,
        certificate: certificateError,
      }))

      if (certificateInputRef.current) {
        certificateInputRef.current.value = ""
      }

      return
    }

    setSelectedCertificateFile(file)
    setHasRemovedExistingCertificate(false)

    const reader = new FileReader()
    reader.onload = () => {
      setFormData((current) => ({
        ...current,
        certificate: typeof reader.result === "string" ? reader.result : "",
      }))
      setErrors((currentErrors) => ({
        ...currentErrors,
        certificate: "",
      }))
    }
    reader.readAsDataURL(file)
  }

  function removeCertificate() {
    if (editingExperience?.certificate) {
      return false
    }

    setSelectedCertificateFile(null)
    setHasRemovedExistingCertificate(Boolean(editingExperience?.certificate))
    setFormData((current) => ({ ...current, certificate: "" }))
    setErrors((currentErrors) => ({
      ...currentErrors,
      certificate: "",
    }))

    if (certificateInputRef.current) {
      certificateInputRef.current.value = ""
    }
  }

  async function persistExperience(payload: ExperiencePayload) {
    try {
      setIsSaving(true)

      if (editingExperience) {
        if (payload.type === "academica") {
          await updateEducation(editingExperience.id, payload)
        } else {
          await updateExperience(editingExperience.id, payload)
        }

        closeConfirmEditModal()
        closeModal()
        await loadExperiences()
        showSuccessModal(
          payload.type === "academica"
            ? "Formación académica actualizada correctamente."
            : "Experiencia actualizada correctamente.",
        )
      } else {
        if (payload.type === "academica") {
          await createEducation(payload)
        } else {
          await createExperience(payload)
        }
        closeModal()
        showSuccessModal(
          payload.type === "academica"
            ? "La formación académica ha sido registrada correctamente."
            : "Experiencia registrada correctamente.",
        )
      }

      if (!editingExperience) {
        await loadExperiences()
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo guardar la experiencia."
      showFeedback(message, "error")
    } finally {
      setIsSaving(false)
    }
  }

  async function confirmEditSave() {
    if (!editingExperience || !pendingEditPayload || isSaving) {
      return
    }

    await persistExperience(pendingEditPayload)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    clearFeedback()
    closeDuplicateModal()
    setPageError("")

    if (isSaving) {
      return
    }

    const nextErrors: ExperienceFormErrors = {
      type: validateExperienceField("type", formData),
      company: validateExperienceField("company", formData),
      email: validateExperienceField("email", formData),
      position: validateExperienceField("position", formData),
      fieldOfStudy: validateExperienceField("fieldOfStudy", formData),
      description: validateExperienceField("description", formData),
      startDate: validateExperienceField("startDate", formData),
      endDate: validateExperienceField("endDate", formData),
      image: validateImageFile(selectedImageFile),
      certificate: validateCertificateFile(selectedCertificateFile),
    }

    if (editingExperience && originalEditingValues) {
      const protectedFields: Array<keyof ExperienceFormValues> = ["location", "fieldOfStudy", "description"]

      protectedFields.forEach((field) => {
        const originalValue = originalEditingValues[field]
        const currentValue = formData[field]

        if (typeof originalValue === "string" && originalValue.trim() && typeof currentValue === "string" && !currentValue.trim()) {
          nextErrors[field] = "Este campo no puede quedar vacío."
        }
      })
    }

    setErrors(nextErrors)

    if (Object.values(nextErrors).some(Boolean)) {
      return
    }

    const duplicateExperience = findDuplicateExperience(
      experiences,
      formData,
      editingExperience?.id,
    )

    if (duplicateExperience) {
      const duplicatedTypeLabel =
        duplicateExperience.type === "academica" ? "Formación Académica" : "Experiencia Laboral"

      showDuplicateModal(
        `Ya tienes una ${duplicatedTypeLabel} registrada en ${duplicateExperience.company} como ${duplicateExperience.position} dentro de un periodo que se cruza con las fechas ingresadas. Revisa las fechas o edita el registro existente.`,
      )
      return
    }

    const payload: ExperiencePayload = {
      type: normalizeExperienceTypeValue(formData.type),
      company: formData.company.trim(),
      email: formData.email.trim(),
      position: formData.position.trim(),
      location: formData.location.trim(),
      fieldOfStudy: formData.fieldOfStudy.trim(),
      description: formData.description.trim(),
      startDate: formData.startDate.trim(),
      endDate: formData.endDate.trim(),
      current: formData.current,
      logoFile: selectedImageFile,
      certificateFile: selectedCertificateFile,
      removeLogo: hasRemovedExistingImage && !selectedImageFile,
      removeCertificate: hasRemovedExistingCertificate && !selectedCertificateFile,
    }

    if (editingExperience) {
      if (!hasPayloadChanges(payload, originalEditingValues)) {
        showSuccessModal("No hay cambios para guardar.", "Sin cambios")
        return
      }

      openConfirmEditModal(payload)
      return
    }

    await persistExperience(payload)
  }

  async function handleDelete(id: string) {
    clearFeedback()
    setPageError("")

    const targetExperience = experiences.find((experience) => experience.id === id)

    if (!targetExperience) {
      setPageError("No se encontró la experiencia seleccionada.")
      return false
    }

    try {
      if (targetExperience.type === "academica") {
        await removeEducation(id)
      } else {
        await removeExperience(id)
      }
      await loadExperiences()
      showFeedback("Experiencia eliminada correctamente.", "success")
      return true
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo eliminar la experiencia."
      setPageError(message)
      return false
    }
  }

  return {
    formData,
    errors,
    isModalOpen,
    isEditing,
    originalEditingValues,
    isConfirmEditModalOpen,
    feedbackMessage,
    feedbackType,
    isDuplicateModalOpen,
    isSuccessModalOpen,
    duplicateMessage,
    successTitle,
    successMessage,
    pageError,
    isLoading,
    isSaving,
    canRemoveImage,
    canRemoveCertificate,
    pendingEditPayload,
    laboralExperiences,
    academicExperiences,
    fileInputRef,
    certificateInputRef,
    openCreateModal,
    prepareCreateForm,
    openEditModal,
    closeModal,
    closeConfirmEditModal,
    closeDuplicateModal,
    closeSuccessModal,
    confirmEditSave,
    updateField,
    handleBlur,
    handleImageChange,
    handleCertificateChange,
    removeImage,
    removeCertificate,
    handleSubmit,
    handleDelete,
    reloadExperiences: loadExperiences,
  }
}

