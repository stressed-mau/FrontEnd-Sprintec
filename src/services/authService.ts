import axios from "axios"

import { api } from "@/services/api"

export const AUTH_SESSION_STORAGE_KEY = "portfolio_auth_session"

export type RegisterRequest = {
  username: string
  email: string
  password: string
  password_confirmation: string
}

export type AuthUser = {
  id: number
  username: string
  email: string
  role_id: number
  info_id: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export type RegisterResponse = {
  success: boolean
  message: string
  data: AuthUser
  access_token: string
  token_type: string
}

export type ApiValidationErrors = Partial<Record<keyof RegisterRequest | string, string[]>>

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

export async function registerUser(payload: RegisterRequest) {
  try {
    const response = await api.post<RegisterResponse>("/api/register", payload)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        typeof error.response?.data?.message === "string"
          ? error.response.data.message
          : "No se pudo completar el registro."

      const validationErrors =
        error.response?.data && typeof error.response.data === "object" && "errors" in error.response.data
          ? (error.response.data.errors as ApiValidationErrors)
          : undefined

      throw new AuthServiceError(message, {
        status: error.response?.status,
        validationErrors,
      })
    }

    throw new AuthServiceError("No se pudo completar el registro.")
  }
}

export function saveAuthSession(response: RegisterResponse) {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.setItem(
    AUTH_SESSION_STORAGE_KEY,
    JSON.stringify({
      accessToken: response.access_token,
      tokenType: response.token_type,
      user: response.data,
    }),
  )
}
