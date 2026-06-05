import axios from "axios"

import { AuthServiceError, type ApiValidationErrors, type AuthResponse } from "@/services/auth"

export function getRegisterValidationErrors(error: unknown): ApiValidationErrors | undefined {
  if (error instanceof AuthServiceError) return error.validationErrors

  if (isRecord(error)) {
    const validationErrors = normalizeRegisterValidationErrors(error.validationErrors)
    if (validationErrors) return validationErrors
  }

  if (!axios.isAxiosError(error)) return undefined

  const responseRecord = getAxiosResponseRecord(error.response?.data)
  const nestedData = isRecord(responseRecord.data) ? responseRecord.data : {}

  return (
    normalizeRegisterValidationErrors(responseRecord.errors) ??
    normalizeRegisterValidationErrors(nestedData.errors) ??
    normalizeRegisterValidationErrors(responseRecord.validationErrors) ??
    normalizeRegisterValidationErrors(nestedData.validationErrors)
  )
}

export function getRegisterErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data
    if (typeof responseData === "string") return responseData

    if (isRecord(responseData)) {
      const message = responseData.message ?? responseData.error ?? responseData.detail
      if (typeof message === "string" && message.trim()) return message
    }
  }

  if (error instanceof Error && error.message.trim()) return error.message

  return ""
}

export function hasAuthTokens(response: AuthResponse) {
  return typeof response.access_token === "string" && typeof response.token_type === "string"
}

export function shouldLoginAfterRegisterError(error: unknown) {
  return (
    error instanceof AuthServiceError &&
    typeof error.status === "number" &&
    error.status >= 200 &&
    error.status < 300 &&
    !error.validationErrors
  )
}

export function isRegisterHandledError(error: unknown) {
  return error instanceof AuthServiceError || axios.isAxiosError(error) || isRecord(error)
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value))
}

function getAxiosResponseRecord(responseData: unknown) {
  return isRecord(responseData) ? responseData : {}
}

function getValidationMessages(errorList?: unknown) {
  if (typeof errorList === "string") return [errorList]
  return Array.isArray(errorList) ? errorList.filter((item): item is string => typeof item === "string") : []
}

function normalizeRegisterValidationErrors(value: unknown): ApiValidationErrors | undefined {
  if (!isRecord(value)) return undefined

  const normalized: ApiValidationErrors = {}

  Object.entries(value).forEach(([key, entry]) => {
    const messages = getValidationMessages(entry)
    if (messages.length > 0) normalized[key] = messages
  })

  return Object.keys(normalized).length > 0 ? normalized : undefined
}
