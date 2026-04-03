import { api } from "@/services/api"
import { buildAuthServiceError } from "@/services/auth/auth-errors"
import type { AuthResponse, LoginRequest, RegisterRequest } from "@/services/auth/auth-types"

export async function registerUser(payload: RegisterRequest) {
  try {
    const response = await api.post<AuthResponse>("/api/register", payload)
    return response.data
  } catch (error) {
    throw buildAuthServiceError(error, "No se pudo completar el registro.")
  }
}

export async function loginUser(payload: LoginRequest) {
  try {
    const response = await api.post<AuthResponse>("/api/login", payload)
    return response.data
  } catch (error) {
    throw buildAuthServiceError(error, "No se pudo iniciar sesión.")
  }
}
