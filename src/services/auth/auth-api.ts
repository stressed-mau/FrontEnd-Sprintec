import axios from "axios"

import { API_BASE_URL } from "@/services/api"
import { buildAuthServiceError } from "@/services/auth/auth-errors"
import type { AuthResponse, LoginRequest, RegisterRequest } from "@/services/auth/auth-types"

function buildLoginPayload(payload: LoginRequest): LoginRequest {
  return {
    user: payload.user.trim(),
    password: payload.password,
  }
}

async function postPublicAuth(path: string, payload: Record<string, string>) {
  const response = await axios.post<AuthResponse>(
    `${API_BASE_URL.replace(/\/+$/, "")}${path}`,
    payload,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    },
  )

  if (!response.data || typeof response.data !== "object" || !("access_token" in response.data)) {
    throw new Error("El backend no devolvió una respuesta JSON válida de autenticación.")
  }

  return response.data
}

export async function registerUser(payload: RegisterRequest) {
  try {
    return await postPublicAuth("/registro", payload)
  } catch (error) {
    throw buildAuthServiceError(error, "No se pudo completar el registro.")
  }
}

export async function loginUser(payload: LoginRequest) {
  try {
    return await postPublicAuth("/login", buildLoginPayload(payload))
  } catch (error) {
    throw buildAuthServiceError(error, "No se pudo iniciar sesión.")
  }
}
