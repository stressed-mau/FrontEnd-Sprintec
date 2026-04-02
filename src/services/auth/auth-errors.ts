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
    const message =
      typeof error.response?.data?.message === "string" ? error.response.data.message : fallbackMessage

    const validationErrors =
      error.response?.data && typeof error.response.data === "object" && "errors" in error.response.data
        ? (error.response.data.errors as ApiValidationErrors)
        : undefined

    return new AuthServiceError(message, {
      status: error.response?.status,
      validationErrors,
    })
  }

  return new AuthServiceError(fallbackMessage)
}
