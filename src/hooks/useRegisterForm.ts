import { useState } from "react"

import { useNavigate } from "react-router-dom"

import { useEmailValidation } from "@/hooks/useEmailValidation"
import { REGISTER_PROFILE_ROUTE } from "@/routes/route-paths"
import {
  AuthServiceError,
  registerUser,
  saveAuthSession,
  type ApiValidationErrors,
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
const EMOJI_REGEX = /\p{Extended_Pictographic}/u

export const WELCOME_MESSAGE = `¡Te damos la bienvenida a Portafolio Gen!

Tu registro se ha completado exitosamente. Ya puedes acceder a tu cuenta y comenzar a explorar todas las funcionalidades que tenemos para ti.`

function validateRegisterField(field: keyof RegisterValues, values: RegisterValues): string {
  const name = values.name.trim()
  const password = values.password
  const confirmPassword = values.confirmPassword

  if (field === "name") {
    if (!name) return "El campo Nombre usuario es obligatorio."
    if (EMOJI_REGEX.test(values.name)) return "El nombre de usuario no permite emoticones."
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
    if (/\s/.test(password)) return "La contraseña no puede contener espacios en blanco."
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

function getValidationMessage(errorList?: string[]) {
  return Array.isArray(errorList) && errorList.length > 0 ? errorList[0] : ""
}

function normalizeRegisterApiMessage(message: string) {
  if (/(username|user name|nombre).*(taken|used|exist|duplicate|unique)/i.test(message)) {
    return "El nombre de usuario ya está registrado, elige otro."
  }

  if (/email.*(taken|used|exist|duplicate|unique)/i.test(message)) {
    return "El correo electrónico ya está registrado, elige otro."
  }

  return message
}

function isDuplicateRegisterError(message: string) {
  return /(exist|registrad|taken|used|duplicate|unique)/i.test(message)
}

function mapApiErrors(validationErrors?: ApiValidationErrors): RegisterFormErrors {
  if (!validationErrors) {
    return {}
  }

  return {
    name: normalizeRegisterApiMessage(getValidationMessage(validationErrors.username)),
    email: normalizeRegisterApiMessage(getValidationMessage(validationErrors.email)),
    password: normalizeRegisterApiMessage(getValidationMessage(validationErrors.password)),
    confirmPassword: normalizeRegisterApiMessage(getValidationMessage(validationErrors.password_confirmation)),
  }
}

export function useRegisterForm() {
  const navigate = useNavigate()
  const [values, setValues] = useState<RegisterValues>(INITIAL_VALUES)
  const [errors, setErrors] = useState<RegisterFormErrors>({})
  const [showSuccessModal, setShowSuccessModal] = useState(false)
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
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

    try {
      const normalizedEmail = emailValidation.normalizedEmail.toLowerCase()
      const response = await registerUser({
        username: normalizedValues.name.trim(),
        email: normalizedEmail,
        password: normalizedValues.password,
        password_confirmation: normalizedValues.confirmPassword,
      })

      saveAuthSession(response)

      window.localStorage.setItem(
        "portfolio_last_welcome_email",
        JSON.stringify({
          to: normalizedEmail,
          subject: "¡Te damos la bienvenida a Portafolio Gen!",
          body: WELCOME_MESSAGE,
        }),
      )

      setShowSuccessModal(true)
    } catch (error) {
      if (error instanceof AuthServiceError) {
        const fieldErrors = mapApiErrors(error.validationErrors)
        const hasSpecificDuplicateError = Boolean(fieldErrors.email || fieldErrors.name)

        setErrors({
          ...fieldErrors,
          form: hasSpecificDuplicateError || isDuplicateRegisterError(error.message) ? "" : error.message,
        })
        return
      }

      setErrors({ form: "No se pudo completar el registro." })
    } finally {
      setIsSubmitting(false)
    }
  }

  function closeSuccessModal() {
    setShowSuccessModal(false)
    navigate(REGISTER_PROFILE_ROUTE, { replace: true })
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
    showSuccessModal,
    isSubmitting,
    updateField,
    handleBlur,
    handleSubmit,
    applyEmailSuggestion,
    closeSuccessModal,
  }
}
