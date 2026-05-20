import { useState } from "react"

import axios from "axios"
import type { FormEvent } from "react"
import { useNavigate } from "react-router-dom"

import { useEmailValidation } from "@/hooks/useEmailValidation"
import { USER_HOME_ROUTE } from "@/routes/route-paths"
import { USER_GUIDE_PENDING_KEY } from "@/components/UserGuide"
import {
  AuthServiceError,
  clearAuthSession,
  loginUser,
  registerUser,
  saveAuthSession,
  type ApiValidationErrors,
  type AuthResponse,
  type RegisterRequest,
} from "@/services/auth"

export type RegisterValues = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export type RegisterErrors = Partial<Record<keyof RegisterValues, string>>
type RegisterFormErrors = RegisterErrors & {
  form?: string
}

const INITIAL_VALUES: RegisterValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
}

const SPECIAL_CHARACTER_REGEX = /[^A-Za-z0-9]/
const DUPLICATE_USERNAME_MESSAGE = "El nombre de usuario ya está registrado, elige otro."
const DUPLICATE_EMAIL_MESSAGE = "El correo electrónico ya está registrado, elige otro."

export const WELCOME_MESSAGE = `¡Te damos la bienvenida a Portafolio Gen!

Tu registro se ha completado exitosamente. Ya puedes acceder a tu cuenta y comenzar a explorar todas las funcionalidades que tenemos para ti.`

function validateRegisterField(field: keyof RegisterValues, values: RegisterValues): string {
  const name = values.name.trim()
  const password = values.password
  const confirmPassword = values.confirmPassword

  if (field === "name") {
    if (!name) return "El campo Nombre usuario es obligatorio."
    if (/\s/.test(values.name)) return "El nombre de usuario no permite espacios."
    if (name.length > 30) return "El campo Nombre de usuario no permite un máximo de 30 caracteres."
  }

  if (field === "email") {
    return ""
  }

  if (field === "password") {
    if (!password) return "El campo Contraseña es obligatorio."
    if (password.length < 8) return "La contraseña debe tener al menos 8 caracteres."
    if (password.length > 20) return "La contraseña permite un máximo de 20 caracteres."
    if (/\s/.test(password)) return "La contraseña no permite espacios en blanco."
    if (!/[A-Z]/.test(password)) return "La contraseña debe contener al menos una letra mayúscula."
    if (!/\d/.test(password)) return "La contraseña debe contener al menos un número."
    if (!SPECIAL_CHARACTER_REGEX.test(password)) {
      return "La contraseña debe contener al menos un carácter especial."
    }
  }

  if (field === "confirmPassword") {
    if (!confirmPassword) return "El campo Confirmar contraseña es obligatorio."
    if (confirmPassword !== password) return "Las contraseñas no coinciden."
  }

  return ""
}

function getValidationMessages(errorList?: unknown) {
  if (typeof errorList === "string") return [errorList]
  return Array.isArray(errorList) ? errorList.filter((item): item is string => typeof item === "string") : []
}

function getValidationMessage(errorList?: unknown) {
  return getValidationMessages(errorList)[0] ?? ""
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value))
}

function normalizeRegisterValidationErrors(value: unknown): ApiValidationErrors | undefined {
  if (!isRecord(value)) {
    return undefined
  }

  const normalized: ApiValidationErrors = {}

  Object.entries(value).forEach(([key, entry]) => {
    const messages = getValidationMessages(entry)
    if (messages.length > 0) {
      normalized[key] = messages
    }
  })

  return Object.keys(normalized).length > 0 ? normalized : undefined
}

function getRegisterValidationErrors(error: unknown): ApiValidationErrors | undefined {
  if (error instanceof AuthServiceError) {
    return error.validationErrors
  }

  if (isRecord(error)) {
    const validationErrors = normalizeRegisterValidationErrors(error.validationErrors)
    if (validationErrors) return validationErrors
  }

  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data
    const responseRecord = isRecord(responseData) ? responseData : {}
    const nestedData = isRecord(responseRecord.data) ? responseRecord.data : {}

    return (
      normalizeRegisterValidationErrors(responseRecord.errors) ??
      normalizeRegisterValidationErrors(nestedData.errors) ??
      normalizeRegisterValidationErrors(responseRecord.validationErrors) ??
      normalizeRegisterValidationErrors(nestedData.validationErrors)
    )
  }

  return undefined
}

function getRegisterErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data
    if (typeof responseData === "string") return responseData

    if (isRecord(responseData)) {
      const message = responseData.message ?? responseData.error ?? responseData.detail
      if (typeof message === "string" && message.trim()) {
        return message
      }
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message
  }

  return ""
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

  if (keyParts.some((part) => ["email", "correo", "mail"].includes(part))) {
    return "email"
  }

  if (keyParts.some((part) => ["username", "user", "nombre", "usuario", "name"].includes(part))) {
    return "name"
  }

  return null
}

function normalizeRegisterApiMessage(message: string, field?: "name" | "email") {
  if (!message) return ""

  if (hasDuplicateIndicator(message)) {
    if (messageMentionsEmail(message) || field === "email") {
      return DUPLICATE_EMAIL_MESSAGE
    }

    if (messageMentionsUsername(message) || field === "name") {
      return DUPLICATE_USERNAME_MESSAGE
    }
  }

  return message
}

function mapTopLevelRegisterError(message: string): RegisterFormErrors {
  if (!message) return {}

  if (hasDuplicateIndicator(message)) {
    const errors: RegisterFormErrors = {}

    if (messageMentionsEmail(message)) {
      errors.email = DUPLICATE_EMAIL_MESSAGE
    }

    if (messageMentionsUsername(message)) {
      errors.name = DUPLICATE_USERNAME_MESSAGE
    }

    if (errors.email || errors.name) {
      return errors
    }
  }

  return { form: message }
}

function hasAuthTokens(response: AuthResponse) {
  return typeof response.access_token === "string" && typeof response.token_type === "string"
}

function shouldLoginAfterRegisterError(error: unknown) {
  return (
    error instanceof AuthServiceError &&
    typeof error.status === "number" &&
    error.status >= 200 &&
    error.status < 300 &&
    !error.validationErrors
  )
}

function buildDuplicateProbePayload(payload: RegisterRequest, field: "name" | "email"): RegisterRequest {
  const uniqueSuffix = `${Date.now()}${Math.random().toString(36).slice(2, 8)}`

  return {
    username: field === "name" ? payload.username : `probe${uniqueSuffix}`.slice(0, 30),
    email: field === "email" ? payload.email : `probe-${uniqueSuffix}@example.com`,
    password: payload.password,
    password_confirmation: `${payload.password}_probe_mismatch`,
  }
}

async function probeDuplicateRegisterField(payload: RegisterRequest, field: "name" | "email") {
  try {
    await registerUser(buildDuplicateProbePayload(payload, field))
  } catch (error) {
    return mapApiErrors(getRegisterValidationErrors(error))
  }

  return {}
}

function mapApiErrors(validationErrors?: ApiValidationErrors): RegisterFormErrors {
  if (!validationErrors) {
    return {}
  }

  const fieldErrors: RegisterFormErrors = {
    name: normalizeRegisterApiMessage(getValidationMessage(validationErrors.username), "name"),
    email: normalizeRegisterApiMessage(getValidationMessage(validationErrors.email), "email"),
    password: getValidationMessage(validationErrors.password),
    confirmPassword: getValidationMessage(validationErrors.password_confirmation),
  }

  Object.entries(validationErrors).forEach(([key, value]) => {
    const fieldFromKey = getRegisterFieldFromErrorKey(key)

    getValidationMessages(value).forEach((message) => {
      const fieldFromMessage = messageMentionsEmail(message)
        ? "email"
        : messageMentionsUsername(message)
          ? "name"
          : null
      const field = fieldFromMessage ?? fieldFromKey

      if (field === "email" && !fieldErrors.email) {
        fieldErrors.email = fieldErrors.email || normalizeRegisterApiMessage(message, "email")
      }

      if (field === "name" && !fieldErrors.name) {
        fieldErrors.name = fieldErrors.name || normalizeRegisterApiMessage(message, "name")
      }
    })
  })

  return fieldErrors
}

export function useRegisterForm() {
  const navigate = useNavigate()
  const [values, setValues] = useState<RegisterValues>(INITIAL_VALUES)
  const [errors, setErrors] = useState<RegisterFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { suggestion, sanitizeEmailInput, validateEmail } = useEmailValidation(INITIAL_VALUES.email)

  function updateField(field: keyof RegisterValues, value: string) {
    const sanitizedValue =
      field === "name" ? value.replace(/\s+/g, "") : field === "email" ? sanitizeEmailInput(value) : value
    const emailValidation = field === "email" ? validateEmail(sanitizedValue) : null

    setValues((current) => ({ ...current, [field]: sanitizedValue }))

    if (errors[field] || errors.form) {
      const nextValues = { ...values, [field]: sanitizedValue }
      const nextFieldError = field === "email" ? emailValidation?.error ?? "" : validateRegisterField(field, nextValues)

      setErrors((current) => ({
        ...current,
        form: "",
        [field]: nextFieldError,
      }))
    }
  }

  function handleBlur(field: keyof RegisterValues) {
    if (field === "email") {
      const { normalizedEmail, error } = validateEmail(values.email)

      if (normalizedEmail !== values.email) {
        setValues((current) => ({ ...current, email: normalizedEmail }))
      }

      setErrors((current) => ({
        ...current,
        email: error,
      }))
      return
    }

    setErrors((current) => ({
      ...current,
      [field]: validateRegisterField(field, values),
    }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const emailValidation = validateEmail(values.email)
    const normalizedValues: RegisterValues = {
      ...values,
      email: emailValidation.normalizedEmail,
    }

    if (normalizedValues.email !== values.email) {
      setValues(normalizedValues)
    }

    const nextErrors: RegisterFormErrors = {
      name: validateRegisterField("name", normalizedValues),
      email: emailValidation.error,
      password: validateRegisterField("password", normalizedValues),
      confirmPassword: validateRegisterField("confirmPassword", normalizedValues),
      form: "",
    }

    setErrors(nextErrors)

    if (Object.values(nextErrors).some(Boolean)) {
      return
    }

    setIsSubmitting(true)

    const normalizedEmail = emailValidation.normalizedEmail.toLowerCase()
    const registerPayload: RegisterRequest = {
      username: normalizedValues.name.trim(),
      email: normalizedEmail,
      password: normalizedValues.password,
      password_confirmation: normalizedValues.confirmPassword,
    }
    const loginPayload = {
      user: normalizedEmail,
      password: normalizedValues.password,
    }

    try {
      clearAuthSession()

      let response: AuthResponse

      try {
        response = await registerUser(registerPayload)
      } catch (error) {
        if (!shouldLoginAfterRegisterError(error)) {
          throw error
        }

        response = await loginUser(loginPayload)
      }

      if (!hasAuthTokens(response)) {
        response = await loginUser(loginPayload)
      }

      saveAuthSession(response)

      window.localStorage.setItem(
        "portfolio_last_welcome_email",
        JSON.stringify({
          to: normalizedEmail,
          subject: "¡Te damos la bienvenida a Portafolio Gen!",
          body: WELCOME_MESSAGE,
        }),
      )
      window.localStorage.setItem(USER_GUIDE_PENDING_KEY, "1")

      navigate(USER_HOME_ROUTE, { replace: true })
    } catch (error) {
      if (error instanceof AuthServiceError || axios.isAxiosError(error) || isRecord(error)) {
        const fieldErrors = mapApiErrors(getRegisterValidationErrors(error))
        const topLevelErrors = mapTopLevelRegisterError(getRegisterErrorMessage(error))
        const initialFieldErrors: RegisterFormErrors = {
          ...fieldErrors,
          name: fieldErrors.name || topLevelErrors.name,
          email: fieldErrors.email || topLevelErrors.email,
        }
        const duplicateProbePromises: Promise<RegisterFormErrors>[] = []

        if (initialFieldErrors.name && !initialFieldErrors.email) {
          duplicateProbePromises.push(probeDuplicateRegisterField(registerPayload, "email"))
        }

        if (initialFieldErrors.email && !initialFieldErrors.name) {
          duplicateProbePromises.push(probeDuplicateRegisterField(registerPayload, "name"))
        }

        const duplicateProbeErrors = (await Promise.all(duplicateProbePromises)).reduce<RegisterFormErrors>(
          (nextErrors, probeErrors) => ({
            ...nextErrors,
            name: nextErrors.name || probeErrors.name,
            email: nextErrors.email || probeErrors.email,
          }),
          {},
        )
        const mergedFieldErrors: RegisterFormErrors = {
          ...initialFieldErrors,
          name: initialFieldErrors.name || duplicateProbeErrors.name,
          email: initialFieldErrors.email || duplicateProbeErrors.email,
        }
        const hasSpecificDuplicateError = Boolean(mergedFieldErrors.email || mergedFieldErrors.name)
        const remainingTopLevelErrors = hasSpecificDuplicateError ? {} : topLevelErrors

        setErrors({
          ...mergedFieldErrors,
          ...remainingTopLevelErrors,
          form: remainingTopLevelErrors.form || "",
        })
        return
      }

      setErrors({ form: "No se pudo completar el registro." })
    } finally {
      setIsSubmitting(false)
    }
  }

  function applyEmailSuggestion(suggestedEmail: string) {
    const sanitizedEmail = sanitizeEmailInput(suggestedEmail)
    const { error } = validateEmail(sanitizedEmail)

    setValues((current) => ({
      ...current,
      email: sanitizedEmail,
    }))

    setErrors((current) => ({
      ...current,
      email: error,
      form: "",
    }))
  }

  return {
    values,
    errors,
    emailSuggestion: suggestion,
    isSubmitting,
    updateField,
    handleBlur,
    handleSubmit,
    applyEmailSuggestion,
  }
}
