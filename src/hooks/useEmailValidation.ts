import { useState } from "react"

import Mailcheck from "mailcheck"
import isEmail from "validator/lib/isEmail"

export type EmailSuggestion = {
  address: string
  domain: string
  full: string
}

type EmailValidationResult = {
  normalizedEmail: string
  error: string
  suggestion: EmailSuggestion | null
}

function normalizeEmail(value: string) {
  return value.trim()
}

function getEmailSuggestion(email: string) {
  let suggestion: EmailSuggestion | null = null

  Mailcheck.run({
    email,
    suggested: (nextSuggestion) => {
      suggestion = nextSuggestion
    },
    empty: () => {
      suggestion = null
    },
  })

  return suggestion
}

function validateEmailValue(rawEmail: string): EmailValidationResult {
  const normalizedEmail = normalizeEmail(rawEmail)

  if (!normalizedEmail) {
    return {
      normalizedEmail,
      error: "El campo Correo electrónico es obligatorio.",
      suggestion: null,
    }
  }

  if (normalizedEmail.length > 60) {
    return {
      normalizedEmail,
      error: "El campo Correo electrónico permite un máximo de 60 caracteres.",
      suggestion: null,
    }
  }

  if (!isEmail(normalizedEmail)) {
    return {
      normalizedEmail,
      error: "El Correo electrónico debe tener un formato válido.",
      suggestion: getEmailSuggestion(normalizedEmail),
    }
  }

  return {
    normalizedEmail,
    error: "",
    suggestion: getEmailSuggestion(normalizedEmail),
  }
}

export function useEmailValidation(initialValue = "") {
  const [suggestion, setSuggestion] = useState<EmailSuggestion | null>(null)

  function sanitizeEmailInput(value: string) {
    return normalizeEmail(value.replace(/\s+/g, ""))
  }

  function validateEmail(rawEmail: string) {
    const result = validateEmailValue(rawEmail)
    setSuggestion(result.suggestion)
    return result
  }

  function initializeSuggestion(rawEmail = initialValue) {
    const result = validateEmailValue(rawEmail)
    setSuggestion(result.suggestion)
  }

  function clearSuggestion() {
    setSuggestion(null)
  }

  return {
    suggestion,
    sanitizeEmailInput,
    validateEmail,
    initializeSuggestion,
    clearSuggestion,
  }
}
