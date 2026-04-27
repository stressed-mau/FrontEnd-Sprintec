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

function toFormUrlEncoded(payload: Record<string, string>) {
  const params = new URLSearchParams()

  Object.entries(payload).forEach(([key, value]) => {
    params.append(key, value)
  })

  return params
}

async function postPublicAuth(path: string, payload: Record<string, string>) {
  const response = await axios.post<AuthResponse>(
    `${API_BASE_URL.replace(/\/+$/, "")}${path}`,
    toFormUrlEncoded(payload),
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    },
  )

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
