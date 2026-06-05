import type { AuthResponse, AuthSession, AuthUser } from "@/types/auth"

export const AUTH_SESSION_STORAGE_KEY = "portfolio_auth_session"
export const AUTH_SESSION_CHANGED_EVENT = "portfolio-auth-session-changed"
const AUTH_SESSION_DURATION_MS = 8 * 60 * 60 * 1000

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value))
}

function getResponseUser(response: AuthResponse): AuthUser | null {
  const responseRecord = response as unknown as Record<string, unknown>
  const data = responseRecord.data

  if (isRecord(data)) {
    return data as AuthUser
  }

  const user = responseRecord.user
  if (isRecord(user)) {
    return user as AuthUser
  }

  return null
}

export function saveAuthSession(response: AuthResponse) {
  if (typeof window === "undefined") {
    return
  }

  const user = getResponseUser(response)
  if (!user) {
    throw new Error("Respuesta de autenticación inválida.")
  }

  if (typeof response.access_token !== "string" || typeof response.token_type !== "string") {
    throw new Error("Respuesta de autenticación inválida.")
  }

  const session: AuthSession = {
    accessToken: response.access_token,
    tokenType: response.token_type,
    expiresAt: Date.now() + AUTH_SESSION_DURATION_MS,
    user,
  }

  window.localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session))
  window.dispatchEvent(new Event(AUTH_SESSION_CHANGED_EVENT))
}

export function updateAuthSession(userUpdates: Partial<AuthUser>) {
  if (typeof window === "undefined") {
    return
  }

  const currentSession = getAuthSession()
  if (!currentSession) {
    return
  }

  const updatedSession: AuthSession = {
    ...currentSession,
    user: {
      ...currentSession.user,
      ...userUpdates,
    },
  }

  window.localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(updatedSession))
  window.dispatchEvent(new Event(AUTH_SESSION_CHANGED_EVENT))
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
  window.dispatchEvent(new Event(AUTH_SESSION_CHANGED_EVENT))
}
