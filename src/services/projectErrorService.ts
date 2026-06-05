type ApiErrorBody = {
  message?: string
  errors?: Record<string, string[] | string>
}

type ApiError = Error & {
  response?: {
    data?: ApiErrorBody
  }
}

export function formatProjectError(error: unknown, fallback: string): Error {
  if (!isApiError(error)) {
    return error instanceof Error ? error : new Error(fallback)
  }

  const data = error.response?.data
  const firstFieldError = getFirstFieldError(data?.errors)

  return new Error(firstFieldError || data?.message || error.message || fallback)
}

function isApiError(error: unknown): error is ApiError {
  return error instanceof Error && hasObjectResponse(error)
}

function hasObjectResponse(error: Error): error is ApiError {
  return "response" in error && typeof error.response === "object"
}

function getFirstFieldError(errors?: ApiErrorBody["errors"]) {
  if (!errors) return undefined

  return Object.values(errors)
    .map((value) => (Array.isArray(value) ? value[0] : value))
    .find((value): value is string => typeof value === "string" && value.trim().length > 0)
}
