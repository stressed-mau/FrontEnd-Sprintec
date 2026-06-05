import axios from "axios"

import type { ApiValidationErrors } from "@/types/auth"

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

function asValidationMessages(value: unknown): string[] {
  if (typeof value === "string") return [value]
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") return item
        if (item && typeof item === "object" && !Array.isArray(item)) {
          const record = item as Record<string, unknown>
          return typeof record.message === "string" ? record.message : ""
        }
        return ""
      })
      .filter(Boolean)
  }
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const record = value as Record<string, unknown>
    const message = record.message ?? record.error ?? record.detail
    if (typeof message === "string") {
      return [message]
    }
  }
  return []
}

export function normalizeValidationErrors(value: unknown): ApiValidationErrors | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined
  }

  const normalized: ApiValidationErrors = {}

  Object.entries(value as Record<string, unknown>).forEach(([key, entry]) => {
    const messages = asValidationMessages(entry)
    if (messages.length > 0) {
      normalized[key] = messages
    }
  })

  return Object.keys(normalized).length > 0 ? normalized : undefined
}

function getResponseRecord(data: unknown): Record<string, unknown> {
  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data) as unknown
      return getResponseRecord(parsed)
    } catch {
      return {}
    }
  }

  return data && typeof data === "object" && !Array.isArray(data) ? (data as Record<string, unknown>) : {}
}

function getResponseMessage(...records: Record<string, unknown>[]) {
  for (const record of records) {
    const message = record.message ?? record.error ?? record.detail
    if (typeof message === "string" && message.trim()) {
      return message
    }
  }

  return ""
}

export function buildAuthServiceError(error: unknown, fallbackMessage: string) {
  if (axios.isAxiosError(error)) {
    const rawResponseData = error.response?.data
    const responseData = getResponseRecord(rawResponseData)
    const nestedData = getResponseRecord(responseData.data)
    const validationErrors =
      normalizeValidationErrors(responseData.errors) ??
      normalizeValidationErrors(nestedData.errors) ??
      normalizeValidationErrors(responseData.validationErrors) ??
      normalizeValidationErrors(nestedData.validationErrors) ??
      normalizeValidationErrors(nestedData)

    const apiMessage = typeof rawResponseData === "string" ? rawResponseData : getResponseMessage(responseData, nestedData)
    const duplicateUserError = Object.values(validationErrors ?? {})
      .flat()
      .find((value): value is string => typeof value === "string" && /exist|registrad|taken|used|duplicate|unique/i.test(value))

    let message = apiMessage || fallbackMessage

    if (duplicateUserError) {
      message = duplicateUserError
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
