import type { AuthResponse, AuthSession } from "@/services/auth/auth-types"

export const AUTH_SESSION_STORAGE_KEY = "portfolio_auth_session"
const AUTH_SESSION_DURATION_MS = 8 * 60 * 60 * 1000

export function saveAuthSession(response: AuthResponse) {
  if (typeof window === "undefined") {
    return
  }

  const infoIdFromNested = response.data?.user_information?.id
  const session: AuthSession = {
    accessToken: response.access_token,
    tokenType: response.token_type,
    expiresAt: Date.now() + AUTH_SESSION_DURATION_MS,
    user: {
      ...response.data,
      info_id: response.data.info_id ?? infoIdFromNested,
    },
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
    const session = JSON.parse(rawSession) as AuthSession

    if (!session.expiresAt || session.expiresAt <= Date.now()) {
      clearAuthSession()
      return null
    }

    return session
  } catch {
    clearAuthSession()
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
