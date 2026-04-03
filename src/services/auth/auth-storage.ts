import type { AuthResponse, AuthSession } from "@/services/auth/auth-types"

export const AUTH_SESSION_STORAGE_KEY = "portfolio_auth_session"

export function saveAuthSession(response: AuthResponse) {
  if (typeof window === "undefined") {
    return
  }

  const session: AuthSession = {
    accessToken: response.access_token,
    tokenType: response.token_type,
    user: response.data,
  }

  window.localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session))
}

export function getAuthSession() {
  if (typeof window === "undefined") {
    return null
  }

  const rawSession = window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY)

  if (!rawSession) {
    return null
  }

  try {
    return JSON.parse(rawSession) as AuthSession
  } catch {
    return null
  }
}

export function getAuthToken() {
  return getAuthSession()?.accessToken ?? null
}

export function isAuthenticated() {
  return Boolean(getAuthToken())
}

export function clearAuthSession() {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY)
}
