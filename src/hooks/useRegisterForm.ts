import { useState } from "react"

import type { FormEvent } from "react"
import { useNavigate } from "react-router-dom"

import { USER_GUIDE_PENDING_KEY } from "@/components/UserGuide"
import { useEmailValidation } from "@/hooks/useEmailValidation"
import { useRegisterErrorHandler } from "@/hooks/useRegisterErrorHandler"
import { sanitizeUsernameInput, validateRegisterField } from "@/lib/registerValidation"
import { USER_HOME_ROUTE } from "@/routes/route-paths"
import { buildRegisterPayload, submitRegister } from "@/services/auth/registerSubmitService"
import {
  INITIAL_REGISTER_VALUES,
  type RegisterFormErrors,
  type RegisterValues,
} from "@/types/registerForm"

export function useRegisterForm() {
  const navigate = useNavigate()
  const [values, setValues] = useState<RegisterValues>(INITIAL_REGISTER_VALUES)
  const [errors, setErrors] = useState<RegisterFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registrationComplete, setRegistrationComplete] = useState(false)
  const { suggestion, sanitizeEmailInput, validateEmail } = useEmailValidation(INITIAL_REGISTER_VALUES.email)
  const { handleRegisterError } = useRegisterErrorHandler(setErrors)

  function updateField(field: keyof RegisterValues, value: string) {
    const sanitizedValue =
      field === "name" ? sanitizeUsernameInput(value) : field === "email" ? sanitizeEmailInput(value) : value
    const emailValidation = field === "email" ? validateEmail(sanitizedValue) : null

    setValues((current) => ({ ...current, [field]: sanitizedValue }))

    if (!errors[field] && !errors.form) return

    const nextValues = { ...values, [field]: sanitizedValue }
    const nextFieldError = field === "email" ? emailValidation?.error ?? "" : validateRegisterField(field, nextValues)

    setErrors((current) => ({
      ...current,
      form: "",
      [field]: nextFieldError,
    }))
  }

  function handleBlur(field: keyof RegisterValues) {
    if (field === "email") {
      handleEmailBlur()
      return
    }

    setErrors((current) => ({
      ...current,
      [field]: validateRegisterField(field, values),
    }))
  }

  function handleEmailBlur() {
    const { normalizedEmail, error } = validateEmail(values.email)

    if (normalizedEmail !== values.email) {
      setValues((current) => ({ ...current, email: normalizedEmail }))
    }

    setErrors((current) => ({
      ...current,
      email: error,
    }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const emailValidation = validateEmail(values.email)
    const normalizedValues = normalizeSubmitValues(emailValidation.normalizedEmail)

    const nextErrors = buildSubmitErrors(normalizedValues, emailValidation.error)
    setErrors(nextErrors)

    if (Object.values(nextErrors).some(Boolean)) return

    setIsSubmitting(true)

    const normalizedEmail = emailValidation.normalizedEmail.toLowerCase()
    const registerPayload = buildRegisterPayload(normalizedValues, normalizedEmail)
    const loginPayload = { user: normalizedEmail, password: normalizedValues.password }

    try {
      await submitRegister(registerPayload, loginPayload)
      setRegistrationComplete(true)
    } catch (error) {
      await handleRegisterError(error, registerPayload)
    } finally {
      setIsSubmitting(false)
    }
  }

  function normalizeSubmitValues(normalizedEmail: string): RegisterValues {
    const normalizedValues = {
      ...values,
      name: sanitizeUsernameInput(values.name),
      email: normalizedEmail,
    }

    if (normalizedValues.email !== values.email || normalizedValues.name !== values.name) {
      setValues(normalizedValues)
    }

    return normalizedValues
  }

  function buildSubmitErrors(normalizedValues: RegisterValues, emailError: string): RegisterFormErrors {
    return {
      name: validateRegisterField("name", normalizedValues),
      email: emailError,
      password: validateRegisterField("password", normalizedValues),
      confirmPassword: validateRegisterField("confirmPassword", normalizedValues),
      form: "",
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

  function continueAfterRegistration() {
    setRegistrationComplete(false)
    window.localStorage.setItem(USER_GUIDE_PENDING_KEY, "1")
    navigate(USER_HOME_ROUTE, { replace: true })
  }

  return {
    values,
    errors,
    emailSuggestion: suggestion,
    isSubmitting,
    registrationComplete,
    updateField,
    handleBlur,
    handleSubmit,
    applyEmailSuggestion,
    continueAfterRegistration,
  }
}
