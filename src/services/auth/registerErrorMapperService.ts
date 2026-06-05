import type { RegisterFormErrors } from "@/types/registerForm"
import type { ApiValidationErrors } from "@/services/auth"

const DUPLICATE_USERNAME_MESSAGE = "El nombre de usuario ya está registrado, elige otro."
const DUPLICATE_EMAIL_MESSAGE = "El correo electrónico ya está registrado, elige otro."

export function mapTopLevelRegisterError(message: string): RegisterFormErrors {
  if (!message) return {}
  if (!hasDuplicateIndicator(message)) return { form: message }

  const errors: RegisterFormErrors = {}

  if (messageMentionsEmail(message)) errors.email = DUPLICATE_EMAIL_MESSAGE
  if (messageMentionsUsername(message)) errors.name = DUPLICATE_USERNAME_MESSAGE

  return errors.email || errors.name ? errors : { form: message }
}

export function mapApiErrors(validationErrors?: ApiValidationErrors): RegisterFormErrors {
  if (!validationErrors) return {}

  const fieldErrors: RegisterFormErrors = {
    name: normalizeRegisterApiMessage(getValidationMessage(validationErrors.username), "name"),
    email: normalizeRegisterApiMessage(getValidationMessage(validationErrors.email), "email"),
    password: getValidationMessage(validationErrors.password),
    confirmPassword: getValidationMessage(validationErrors.password_confirmation),
  }

  Object.entries(validationErrors).forEach(([key, value]) => applyMappedError(fieldErrors, key, value))

  return fieldErrors
}

function applyMappedError(fieldErrors: RegisterFormErrors, key: string, value: unknown) {
  const fieldFromKey = getRegisterFieldFromErrorKey(key)

  getValidationMessages(value).forEach((message) => {
    const field = getFieldFromMessage(message) ?? fieldFromKey

    if (field === "email" && !fieldErrors.email) {
      fieldErrors.email = fieldErrors.email || normalizeRegisterApiMessage(message, "email")
    }

    if (field === "name" && !fieldErrors.name) {
      fieldErrors.name = fieldErrors.name || normalizeRegisterApiMessage(message, "name")
    }
  })
}

function getFieldFromMessage(message: string) {
  if (messageMentionsEmail(message)) return "email"
  if (messageMentionsUsername(message)) return "name"
  return null
}

function getValidationMessages(errorList?: unknown) {
  if (typeof errorList === "string") return [errorList]
  return Array.isArray(errorList) ? errorList.filter((item): item is string => typeof item === "string") : []
}

function getValidationMessage(errorList?: unknown) {
  return getValidationMessages(errorList)[0] ?? ""
}

function hasDuplicateIndicator(message: string) {
  return /(taken|used|exist|existe|registrad|registrado|duplicate|duplicad|unique|ya est|ya está)/i.test(message)
}

function messageMentionsEmail(message: string) {
  return /(email|e-mail|correo|mail)/i.test(message)
}

function messageMentionsUsername(message: string) {
  return /(username|user name|nombre de usuario|nombre_usuario)/i.test(message)
}

function getRegisterFieldFromErrorKey(key: string): "name" | "email" | null {
  const normalizedKey = key.toLowerCase().replace(/\[[^\]]*\]/g, "")
  const keyParts = normalizedKey.split(/[._-]/).filter(Boolean)

  if (keyParts.some((part) => ["email", "correo", "mail"].includes(part))) return "email"
  if (keyParts.some((part) => ["username", "user", "nombre", "usuario", "name"].includes(part))) return "name"

  return null
}

function normalizeRegisterApiMessage(message: string, field?: "name" | "email") {
  if (!message) return ""

  if (hasDuplicateIndicator(message)) {
    if (messageMentionsEmail(message) || field === "email") return DUPLICATE_EMAIL_MESSAGE
    if (messageMentionsUsername(message) || field === "name") return DUPLICATE_USERNAME_MESSAGE
  }

  return message
}
