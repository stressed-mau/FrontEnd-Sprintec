import { api } from "@/services/api"
import { buildAuthServiceError } from "@/services/auth/auth-errors"
import type { AuthResponse, LoginRequest, RegisterRequest } from "@/services/auth/auth-types"

function buildLoginPayload(payload: LoginRequest): LoginRequest {
  return {
    user: payload.user.trim(),
    password: payload.password,
  }
}

export async function registerUser(payload: RegisterRequest) {
  try {
    const response = await api.post<AuthResponse>("/register", payload)
    return response.data
  } catch (error) {
    throw buildAuthServiceError(error, "No se pudo completar el registro.")
  }
}

export async function loginUser(payload: LoginRequest) {
  try {
    const response = await api.post<AuthResponse>("/login", buildLoginPayload(payload))
    return response.data
  } catch (error) {
    throw buildAuthServiceError(error, "No se pudo iniciar sesión.")
  }
}
