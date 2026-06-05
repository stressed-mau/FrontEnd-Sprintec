import isEmail from "validator/lib/isEmail"

import type { ExperienceItem, ExperiencePayload } from "@/types/experience"

export type ExperienceFormValues = Omit<ExperienceItem, "id">
export type ExperienceFormErrors = Partial<Record<keyof ExperienceFormValues, string>>
export type ExperienceEditableFieldState = Partial<Record<keyof ExperienceFormValues, boolean>>

export const EMPTY_EXPERIENCE_FORM: ExperienceFormValues = {
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

export function normalizeExperienceTypeValue(value: string): ExperienceFormValues["type"] {
  return value === "academica" ? "academica" : "laboral"
}

export function sanitizeCompanyInput(value: string, type: ExperienceFormValues["type"]) {
  const allowedCharacters = type === "academica" ? /[^\p{L}0-9\s]/gu : /[^\p{L}\s.,]/gu
  return value.replace(allowedCharacters, "").slice(0, COMPANY_MAX_LENGTH)
}

export function normalizeFormDate(value: string) {
  const trimmedValue = value.trim()
  if (!trimmedValue) return ""

  const isoDateMatch = trimmedValue.match(/^(\d{4}-\d{2}-\d{2})/)
  if (isoDateMatch) return isoDateMatch[1]

  const slashDateMatch = trimmedValue.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  return slashDateMatch ? `${slashDateMatch[3]}-${slashDateMatch[2]}-${slashDateMatch[1]}` : trimmedValue
}

export function formatExperienceDate(value: string) {
  const parsedDate = parseDate(value)
  if (!parsedDate) return value

  return parsedDate.toLocaleDateString("es-BO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

export function normalizeComparableText(value: string) {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase("es-BO")
}

export function findDuplicateExperience(experiences: ExperienceItem[], values: ExperienceFormValues, editingExperienceId?: string) {
  const normalizedType = normalizeExperienceTypeValue(values.type)
  const normalizedCompany = normalizeComparableText(values.company)
  const normalizedPosition = normalizeComparableText(values.position)

  return experiences.find((experience) => {
    if (editingExperienceId && experience.id === editingExperienceId) return false
    if (normalizeExperienceTypeValue(experience.type) !== normalizedType) return false
    if (normalizedType === "academica") return normalizeComparableText(experience.company) === normalizedCompany
    return normalizeComparableText(experience.position) === normalizedPosition
  })
}

export function getDuplicateExperienceMessage(duplicateExperience: ExperienceItem) {
  if (duplicateExperience.type === "academica") return "Ya existe una formación académica registrada con esa institución."
  return "Ya existe una experiencia laboral registrada con ese nombre. Ingrese un nombre diferente."
}

export function validateImageFile(file: File | null): string {
  if (!file) return ""
  if (!hasAllowedImageFormat(file)) return "La imagen solo permite archivos JPG, JPEG o PNG."
  if (file.size > MAX_IMAGE_SIZE_BYTES) return "La imagen permite archivos de hasta 2 MB."
  return ""
}

export function validateCertificateFile(file: File | null): string {
  if (!file) return ""
  if (!hasAllowedCertificateFormat(file)) return "El documento de formación solo permite subir archivos PDF, JPG, JPEG o PNG."
  if (file.size > MAX_CERTIFICATE_SIZE_BYTES) return "El archivo no debe superar los 2 MB."
  return ""
}

export function validateExperienceField(field: keyof ExperienceFormValues, values: ExperienceFormValues): string {
  const text = getTrimmedFormText(values)

  if (field === "type" && values.type !== "laboral" && values.type !== "academica") return "Seleccione un tipo de experiencia válido."
  if (field === "company") return validateCompanyField(values.type, text.company)
  if (field === "email") return validateEmailField(values.type, values.email)
  if (field === "position") return validatePositionField(values.type, text.position)
  if (field === "fieldOfStudy" && values.type === "academica") return validateFieldOfStudy(text.fieldOfStudy)
  if (field === "description" && text.description.length > 300) return "La descripción no puede exceder los 300 caracteres."
  if (field === "startDate") return validateStartDate(values.type, text.startDate)
  if (field === "endDate") return validateEndDate(values, text)

  return ""
}

export function validateRequiredEditedField(field: keyof ExperienceFormValues, value: string | boolean, originalValues: ExperienceFormValues | null) {
  if (!originalValues || typeof value !== "string") return ""

  const originalValue = originalValues[field]
  if (typeof originalValue !== "string" || !originalValue.trim() || value.trim()) return ""
  return field === "location" || field === "description" || field === "fieldOfStudy" ? "Este campo no puede quedar vacío." : ""
}

export function hasEditablePayloadChanges(payload: ExperiencePayload, originalValues: ExperienceFormValues | null) {
  if (!originalValues) return true
  if (payload.type === "academica") return hasAcademicPayloadChanges(payload, originalValues)
  return hasPayloadChanges(payload, originalValues)
}

export function buildExperiencePayloadFromValues(
  values: ExperienceFormValues,
  selectedImageFile: File | null,
  selectedCertificateFile: File | null,
  hasRemovedExistingImage: boolean,
  hasRemovedExistingCertificate: boolean,
): ExperiencePayload {
  return {
    type: normalizeExperienceTypeValue(values.type),
    company: values.company.trim(),
    email: values.email.trim(),
    position: values.position.trim(),
    location: values.location.trim(),
    fieldOfStudy: values.fieldOfStudy.trim(),
    description: values.description.trim(),
    startDate: values.startDate.trim(),
    endDate: values.endDate.trim(),
    current: values.current,
    logoFile: selectedImageFile,
    certificateFile: selectedCertificateFile,
    removeLogo: hasRemovedExistingImage && !selectedImageFile,
    removeCertificate: hasRemovedExistingCertificate && !selectedCertificateFile,
  }
}

function getTrimmedFormText(values: ExperienceFormValues) {
  return {
    company: values.company.trim(),
    description: values.description.trim(),
    endDate: values.endDate.trim(),
    fieldOfStudy: values.fieldOfStudy.trim(),
    position: values.position.trim(),
    startDate: values.startDate.trim(),
  }
}

function validateCompanyField(type: ExperienceFormValues["type"], company: string) {
  if (!company) return type === "laboral" ? "El campo empresa es obligatorio." : "El campo Institución académica es obligatorio."

  const validCharacters = type === "academica" ? ACADEMIC_INSTITUTION_ALLOWED_CHARACTERS.test(company) : COMPANY_ALLOWED_CHARACTERS.test(company)
  if (!validCharacters) return type === "laboral" ? "El campo empresa solo permite ingresar caracteres literales, puntos y comas." : "El campo Institución académica contiene caracteres no válidos."
  if (company.length > COMPANY_MAX_LENGTH) return type === "laboral" ? "El nombre de la empresa no puede exceder los 100 caracteres." : ""
  return ""
}

function validateEmailField(type: ExperienceFormValues["type"], rawEmail: string) {
  if (type !== "laboral") return ""

  const normalizedEmail = rawEmail.trim()
  if (rawEmail.length > 0 && /\s/.test(rawEmail)) return "El campo Correo electrónico de la empresa no puede contener espacios en blanco"
  if (!normalizedEmail) return "El campo Correo electrónico de la empresa es obligatorio."
  if (normalizedEmail.length > 60) return "El campo Correo electrónico permite un máximo de 60 caracteres."
  return isEmail(normalizedEmail) ? "" : "El Correo electrónico debe tener un formato válido (ej. usuario@gmail.com)."
}

function validatePositionField(type: ExperienceFormValues["type"], position: string) {
  if (!position) return type === "academica" ? "Se debe seleccionar un nivel de formación." : "Se debe seleccionar un cargo."
  if (position.length > 80) return type === "academica" ? "El nivel de formación no puede exceder los 80 caracteres." : "El cargo no puede exceder los 80 caracteres."
  return ""
}

function validateFieldOfStudy(fieldOfStudy: string) {
  if (!fieldOfStudy) return "Se debe seleccionar un área de estudio."
  if (fieldOfStudy.length > 100) return "El área de estudio no puede exceder los 100 caracteres."
  return ""
}

function validateStartDate(type: ExperienceFormValues["type"], startDate: string) {
  if (!startDate) return type === "academica" ? "" : "El campo Fecha de inicio es obligatorio."
  if (!isIsoDate(startDate) || !parseDate(startDate)) return "Seleccione una fecha válida."
  if (type !== "academica" && isFutureDate(startDate)) return "La fecha no puede ser mayor a la fecha actual."
  return ""
}

function validateEndDate(values: ExperienceFormValues, text: ReturnType<typeof getTrimmedFormText>) {
  if (values.type === "academica") return validateAcademicEndDate(text.endDate)
  if (!text.endDate && !values.current) return "El campo Fecha de finalización es obligatorio."
  if (!text.endDate) return ""
  if (!isIsoDate(text.endDate) || !parseDate(text.endDate)) return "Seleccione una fecha válida."
  if (isFutureDate(text.endDate)) return "La fecha no puede ser mayor a la fecha actual."

  const parsedStartDate = parseDate(text.startDate)
  const parsedEndDate = parseDate(text.endDate)
  return parsedStartDate && parsedEndDate && parsedEndDate < parsedStartDate
    ? "La fecha de finalización no puede ser anterior a la fecha de inicio."
    : ""
}

function validateAcademicEndDate(endDate: string) {
  if (!endDate) return ""
  return !isIsoDate(endDate) || !parseDate(endDate) ? "Seleccione una fecha válida." : ""
}

function hasAllowedImageFormat(file: File) {
  const normalizedFileName = file.name.trim().toLowerCase()
  return ALLOWED_IMAGE_EXTENSIONS.some((extension) => normalizedFileName.endsWith(extension)) || ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase())
}

function hasAllowedCertificateFormat(file: File) {
  const normalizedFileName = file.name.trim().toLowerCase()
  return ALLOWED_CERTIFICATE_EXTENSIONS.some((extension) => normalizedFileName.endsWith(extension)) || ALLOWED_CERTIFICATE_TYPES.includes(file.type.toLowerCase())
}

function isIsoDate(value: string) {
  return ISO_DATE_PATTERN.test(value.trim())
}

function isFutureDate(value: string) {
  const parsedDate = parseDate(value)
  if (!parsedDate) return false

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return parsedDate.getTime() > today.getTime()
}

function parseDate(value: string) {
  const trimmedValue = value.trim()
  return parseIsoDate(trimmedValue) ?? parseSlashDate(trimmedValue)
}

function parseIsoDate(value: string) {
  const matches = ISO_DATE_PATTERN.exec(value)
  if (!matches) return null
  return buildValidDate(Number(matches[1]), Number(matches[2]), Number(matches[3]))
}

function parseSlashDate(value: string) {
  const matches = DATE_PATTERN.exec(value)
  if (!matches) return null
  return buildValidDate(Number(matches[3]), Number(matches[2]), Number(matches[1]))
}

function buildValidDate(year: number, month: number, day: number) {
  const parsedDate = new Date(year, month - 1, day)
  const isSameDate = parsedDate.getFullYear() === year && parsedDate.getMonth() === month - 1 && parsedDate.getDate() === day
  if (!isSameDate) return null

  parsedDate.setHours(0, 0, 0, 0)
  return parsedDate
}

function hasPayloadChanges(payload: ExperiencePayload, originalValues: ExperienceFormValues) {
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

function hasAcademicPayloadChanges(payload: ExperiencePayload, originalValues: ExperienceFormValues) {
  return payload.description !== originalValues.description.trim() || payload.startDate !== originalValues.startDate.trim() || payload.endDate !== originalValues.endDate.trim()
}
