import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_SIZE_BYTES,
  MAX_PROJECT_DESCRIPTION_LENGTH,
  MAX_PROJECT_NAME_LENGTH,
  MAX_PROJECT_URL_LENGTH,
} from "@/lib/projectFormConstants"
import type { ProjectFormErrors, ProjectValidationInput } from "@/types/projectForm"

export function normalizeProjectName(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase()
}

export function validateProjectForm(input: ProjectValidationInput): ProjectFormErrors {
  const errors: ProjectFormErrors = {}
  const isEditing = Boolean(input.originalProject)

  validateProjectName(errors, input)
  validateProjectDescription(errors, input)
  validateProjectDates(errors, input)
  validateProjectLinks(errors, input.form)

  if (!isEditing) validateCreateOnlyFields(errors, input)
  validateOriginalRequiredFields(errors, input)

  return errors
}

function validateProjectName(errors: ProjectFormErrors, input: ProjectValidationInput) {
  const { form, originalProject, projects } = input
  const normalizedName = normalizeProjectName(form.nombre)
  const isEditing = Boolean(originalProject)

  if (!isEditing && !form.nombre.trim()) errors.nombre = "El campo Nombre del proyecto es obligatorio."
  if (form.nombre.trim().length > MAX_PROJECT_NAME_LENGTH) {
    errors.nombre = `El campo Nombre del proyecto permite ingresar un máximo de ${MAX_PROJECT_NAME_LENGTH} caracteres.`
  }
  if (!isEditing && projects.some((project) => normalizeProjectName(project.nombre) === normalizedName)) {
    errors.nombre = "Ya existe un proyecto registrado con ese nombre."
  }
}

function validateProjectDescription(errors: ProjectFormErrors, input: ProjectValidationInput) {
  if (input.form.descripcion.length > MAX_PROJECT_DESCRIPTION_LENGTH) {
    errors.descripcion = `El campo Descripción permite un máximo de ${MAX_PROJECT_DESCRIPTION_LENGTH} caracteres.`
  }
}

function validateCreateOnlyFields(errors: ProjectFormErrors, input: ProjectValidationInput) {
  validateProjectRole(errors, input)
  validateProjectTechnologies(errors, input)
  validateProjectImage(errors, input.imageFile)
}

function validateProjectRole(errors: ProjectFormErrors, input: ProjectValidationInput) {
  const role = input.form.rol.trim()

  if (!role) errors.rol = "Debes seleccionar al menos un rol."
  if (role.length > 255) errors.rol = "El rol no debe exceder 255 caracteres."
  if (input.enforceRoleOption && input.roleOptions.length > 0 && !hasRoleOption(input.roleOptions, role)) {
    errors.rol = "Selecciona un rol de la lista."
  }
}

function hasRoleOption(roleOptions: string[], role: string) {
  return roleOptions.some((option) => option.toLowerCase() === role.toLowerCase())
}

function validateProjectTechnologies(errors: ProjectFormErrors, input: ProjectValidationInput) {
  if (input.selectedTechs.length === 0) errors.tecnologias = "Debes seleccionar al menos una tecnología."
  if (input.selectedTechs.length > 10) errors.tecnologias = "Se permite un máximo de 10 tecnologías."
}

function validateProjectDates(errors: ProjectFormErrors, input: ProjectValidationInput) {
  const { form } = input
  const today = getToday()

  if (!input.originalProject && !form.fechaInicio) errors.fechaInicio = "El campo Fecha de inicio es obligatorio."
  if (!input.originalProject && !form.is_current && !form.fechaFin) {
    errors.fechaFin = "El campo Fecha de finalización es obligatorio, si el proyecto no está en curso."
  }
  if (form.fechaInicio && new Date(form.fechaInicio) > today) errors.fechaInicio = "La fecha de inicio no puede ser futura."
  if (form.fechaFin) validateEndDate(errors, form.fechaInicio, form.fechaFin, today)
}

function validateEndDate(errors: ProjectFormErrors, startDate: string, endDateValue: string, today: Date) {
  const endDate = new Date(endDateValue)

  if (endDate > today) errors.fechaFin = "La fecha de finalización no puede ser posterior a la fecha actual."
  if (startDate && new Date(startDate) > endDate) {
    errors.fechaFin = "La fecha de finalización no puede ser anterior a la fecha de inicio."
  }
}

function validateProjectLinks(errors: ProjectFormErrors, form: ProjectValidationInput["form"]) {
  validateGithubLink(errors, form.github)
  validateDemoLink(errors, form.demo)
}

function validateGithubLink(errors: ProjectFormErrors, value: string) {
  if (!value.trim()) return
  if (value.length > MAX_PROJECT_URL_LENGTH) errors.github = `El campo Enlace de GitHub permite un máximo de ${MAX_PROJECT_URL_LENGTH} caracteres.`
  if (!errors.github && !isValidUrl(value)) errors.github = "El enlace de GitHub debe ser una URL válida."
  if (!errors.github && !isGithubUrl(value)) errors.github = "El enlace debe pertenecer al dominio github.com."
}

function validateDemoLink(errors: ProjectFormErrors, value: string) {
  if (!value.trim()) return
  if (value.length > MAX_PROJECT_URL_LENGTH) errors.demo = `El campo Enlace de la demo permite un máximo de ${MAX_PROJECT_URL_LENGTH} caracteres.`
  if (!errors.demo && !isValidUrl(value)) errors.demo = "El enlace de la demo debe ser una URL válida."
}

function validateProjectImage(errors: ProjectFormErrors, imageFile: File | null) {
  if (!imageFile) return
  if (!ALLOWED_IMAGE_TYPES.includes(imageFile.type)) errors.image = "El campo imagen del proyecto solo permite archivos JPG o PNG."
  if (imageFile.size > MAX_IMAGE_SIZE_BYTES) errors.image = "La imagen no debe superar los 2 MB."
}

function validateOriginalRequiredFields(errors: ProjectFormErrors, input: ProjectValidationInput) {
  const project = input.originalProject
  if (!project) return

  if (project.descripcion.trim() && !input.form.descripcion.trim()) errors.descripcion = "El campo Descripción no puede quedar vacío."
  if (project.fechaFin?.trim() && !input.form.fechaFin.trim()) errors.fechaFin = "El campo Fecha de finalización no puede quedar vacío."
  if (project.github?.trim() && !input.form.github.trim()) errors.github = "El campo Enlace de GitHub no puede quedar vacío."
  if (project.demo?.trim() && !input.form.demo.trim()) errors.demo = "El campo Enlace de la demo no puede quedar vacío."
}

function isValidUrl(value: string) {
  return /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(value)
}

function isGithubUrl(value: string) {
  const hostname = new URL(value).hostname.toLowerCase()
  return hostname === "github.com" || hostname.endsWith(".github.com")
}

function getToday() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}
