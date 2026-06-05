import isEmail from "validator/lib/isEmail"

import {
  ALLOWED_IMAGE_EXTENSIONS,
  ALLOWED_IMAGE_TYPES,
  COMPANY_ALLOWED_CHARACTERS,
  COMPANY_MAX_LENGTH,
  MAX_IMAGE_SIZE_BYTES,
} from "@/constants/experienceFormConstants"
import { isFutureExperienceDate, isIsoExperienceDate, normalizeExperienceFormDate, parseExperienceDate } from "@/utils/experienceDateUtils"
import type { ExperienceFormErrors, ExperienceFormValues } from "@/hooks/useExperienceManager"
import type { ExperienceItem } from "@/types/experience"

export function normalizeExperienceText(value: string) {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase("es-BO")
}

export function hasDuplicateExperienceRecord(values: ExperienceFormValues, experiences: ExperienceItem[]) {
  return experiences.some((experience) => isSameExperienceRecord(values, experience))
}

export function sanitizeExperienceCompany(value: string) {
  return value.replace(/[^\p{L}\s.,]/gu, "").slice(0, COMPANY_MAX_LENGTH)
}

export function validateExperienceForm(values: ExperienceFormValues, imageFile: File | null, roleOptions: string[]) {
  const errors: ExperienceFormErrors = {
    company: validateExperienceField("company", values),
    email: validateExperienceField("email", values),
    position: validateExperienceField("position", values, roleOptions),
    location: validateExperienceField("location", values),
    description: validateExperienceField("description", values),
    startDate: validateExperienceField("startDate", values),
    endDate: validateExperienceField("endDate", values),
    image: validateExperienceImageFile(imageFile),
  }

  return errors
}

export function validateExperienceField(field: keyof ExperienceFormValues, values: ExperienceFormValues, roleOptions: string[] = []) {
  if (field === "company") return validateCompany(values.company)
  if (field === "email") return validateEmail(values.email)
  if (field === "position") return validatePosition(values.position, roleOptions)
  if (field === "description" && values.description.trim().length > 300) return "La descripción no puede exceder los 300 caracteres."
  if (field === "startDate") return validateStartDate(values.startDate)
  if (field === "endDate") return validateEndDate(values)
  return ""
}

export function validateExperienceImageFile(file: File | null): string {
  if (!file) return ""
  if (!hasAllowedImageFormat(file)) return "La imagen solo permite archivos JPG, JPEG o PNG."
  if (file.size > MAX_IMAGE_SIZE_BYTES) return "La imagen permite archivos de hasta 2 MB."
  return ""
}

function validateCompany(value: string) {
  const company = value.trim()
  if (!company) return "El campo empresa es obligatorio."
  if (!COMPANY_ALLOWED_CHARACTERS.test(company)) return "El campo empresa solo permite ingresar caracteres literales, puntos y comas."
  if (company.length > COMPANY_MAX_LENGTH) return "El nombre de la empresa no puede exceder los 100 caracteres."
  return ""
}

function isSameExperienceRecord(values: ExperienceFormValues, experience: ExperienceItem) {
  return (
    normalizeExperienceText(values.company) === normalizeExperienceText(experience.company) &&
    normalizeExperienceText(values.email) === normalizeExperienceText(experience.email) &&
    normalizeExperienceText(values.position) === normalizeExperienceText(experience.position) &&
    normalizeExperienceText(values.location) === normalizeExperienceText(experience.location) &&
    normalizeExperienceFormDate(values.startDate) === normalizeExperienceFormDate(experience.startDate) &&
    normalizeExperienceFormDate(values.endDate) === normalizeExperienceFormDate(experience.endDate) &&
    values.current === experience.current
  )
}

function validateEmail(value: string) {
  const normalizedEmail = value.trim()
  if (value.length > 0 && /\s/.test(value)) return "El campo Correo electrónico de la empresa no puede contener espacios en blanco"
  if (!normalizedEmail) return "El campo Correo electrónico de la empresa es obligatorio."
  if (normalizedEmail.length > 60) return "El campo Correo electrónico permite un máximo de 60 caracteres."
  if (!isEmail(normalizedEmail)) return "El Correo electrónico debe tener un formato válido (ej. usuario@gmail.com)."
  return ""
}

function validatePosition(value: string, roleOptions: string[]) {
  const position = value.trim()
  if (!position) return "Se debe seleccionar un cargo."
  if (position.length > 80) return "El cargo no puede exceder los 80 caracteres."
  if (!roleOptions.length || hasOption(roleOptions, position)) return ""
  return "Selecciona un cargo de la lista."
}

function validateStartDate(value: string) {
  if (!value.trim()) return "El campo Fecha de inicio es obligatorio."
  if (!isIsoExperienceDate(value) || !parseExperienceDate(value)) return "Seleccione una fecha válida."
  if (isFutureExperienceDate(value)) return "La fecha no puede ser mayor a la fecha actual."
  return ""
}

function validateEndDate(values: ExperienceFormValues) {
  if (!values.endDate.trim() && !values.current) return "El campo Fecha de finalización es obligatorio."
  if (!values.endDate.trim()) return ""
  if (!isIsoExperienceDate(values.endDate) || !parseExperienceDate(values.endDate)) return "Seleccione una fecha válida."
  if (isFutureExperienceDate(values.endDate)) return "La fecha no puede ser mayor a la fecha actual."
  return validateDateOrder(values.startDate, values.endDate)
}

function validateDateOrder(startDate: string, endDate: string) {
  const parsedStartDate = parseExperienceDate(startDate)
  const parsedEndDate = parseExperienceDate(endDate)
  return parsedStartDate && parsedEndDate && parsedEndDate < parsedStartDate
    ? "La fecha de finalización no puede ser anterior a la fecha de inicio."
    : ""
}

function hasAllowedImageFormat(file: File) {
  const fileName = file.name.trim().toLowerCase()
  return ALLOWED_IMAGE_EXTENSIONS.some((extension) => fileName.endsWith(extension)) || ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase())
}

function hasOption(options: string[], value: string) {
  const normalizedValue = normalizeExperienceText(value)
  return options.some((option) => normalizeExperienceText(option) === normalizedValue)
}
