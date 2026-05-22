import { api } from "@/services/api"
import { AuthServiceError, buildAuthServiceError, normalizeValidationErrors } from "@/services/auth/auth-errors"
import type { AuthResponse, LoginRequest, RegisterRequest } from "@/services/auth/auth-types"

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value))
}

function buildLoginPayload(payload: LoginRequest): LoginRequest {
  return {
    user: payload.user.trim(),
    password: payload.password,
  }
}

function assertSuccessfulAuthResponse(payload: unknown, status?: number) {
  if (!isRecord(payload)) {
    throw new AuthServiceError("El servidor no devolvió una respuesta JSON válida.", { status })
  }

  const validationErrors = normalizeValidationErrors(payload.errors)
  if (payload.success === false || validationErrors) {
    const message = typeof payload.message === "string" ? payload.message : "Hay errores en el formulario."
    throw new AuthServiceError(message, { status, validationErrors })
  }

  if (!isRecord(payload.data) || typeof payload.access_token !== "string" || typeof payload.token_type !== "string") {
    throw new AuthServiceError("Respuesta de autenticación inválida.", { status })
  }
}

function assertSuccessfulRegisterResponse(payload: unknown, status?: number) {
  if (!isRecord(payload)) {
    throw new AuthServiceError("El servidor no devolvió una respuesta JSON válida.", { status })
  }

  const validationErrors = normalizeValidationErrors(payload.errors)
  if (payload.success === false || validationErrors) {
    const message = typeof payload.message === "string" ? payload.message : "Hay errores en el formulario."
    throw new AuthServiceError(message, { status, validationErrors })
  }

  if (!isRecord(payload.data) && !isRecord(payload.user)) {
    throw new AuthServiceError("Respuesta de registro inválida.", { status })
  }
}

export async function registerUser(payload: RegisterRequest) {
  try {
    const response = await api.post<AuthResponse>("/register", payload)
    assertSuccessfulRegisterResponse(response.data, response.status)
    return response.data
  } catch (error) {
    if (error instanceof AuthServiceError) {
      throw error
    }

    throw buildAuthServiceError(error, "")
  }
}

export async function loginUser(payload: LoginRequest) {
  try {
    const response = await api.post<AuthResponse>("/login", buildLoginPayload(payload))
    assertSuccessfulAuthResponse(response.data, response.status)
    return response.data
  } catch (error) {
    throw buildAuthServiceError(error, "No se pudo iniciar sesión.")
  }
}
