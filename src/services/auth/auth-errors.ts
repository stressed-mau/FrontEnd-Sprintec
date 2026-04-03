import axios from "axios"

import type { ApiValidationErrors } from "@/services/auth/auth-types"

export class AuthServiceError extends Error {
  status?: number
  validationErrors?: ApiValidationErrors

  constructor(message: string, options?: { status?: number; validationErrors?: ApiValidationErrors }) {
    super(message)
    this.name = "AuthServiceError"
    this.status = options?.status
    this.validationErrors = options?.validationErrors
  }
}

export function buildAuthServiceError(error: unknown, fallbackMessage: string) {
  if (axios.isAxiosError(error)) {
    const validationErrors =
      error.response?.data && typeof error.response.data === "object" && "errors" in error.response.data
        ? (error.response.data.errors as ApiValidationErrors)
        : undefined

    const apiMessage = typeof error.response?.data?.message === "string" ? error.response.data.message : ""
    const duplicateUserError = Object.values(validationErrors ?? {})
      .flat()
      .find((value): value is string => typeof value === "string" && /exist|registrad|taken|used|duplicate|unique/i.test(value))

    let message = apiMessage || fallbackMessage

    if (duplicateUserError) {
      message = "El usuario ya existe."
    } else if (error.response?.status === 401) {
      message = "Credenciales incorrectas."
    }

    return new AuthServiceError(message, {
      status: error.response?.status,
      validationErrors,
    })
  }

  return new AuthServiceError(fallbackMessage)
}
