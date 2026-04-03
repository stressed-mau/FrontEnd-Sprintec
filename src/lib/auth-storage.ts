export const USERS_STORAGE_KEY = "portfolio_users"

export type StoredUser = {
  name: string
  email: string
  password: string
}

export function getStoredUsers(): StoredUser[] {
  if (typeof window === "undefined") {
    return []
  }

  const raw = window.localStorage.getItem(USERS_STORAGE_KEY)

  if (!raw) {
    return []
  }

  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveStoredUsers(users: StoredUser[]) {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

export function findUserByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase()
  return getStoredUsers().find((user) => user.email.trim().toLowerCase() === normalizedEmail)
}

export function registerStoredUser(user: StoredUser) {
  const users = getStoredUsers()
  users.push({
    ...user,
    email: user.email.trim().toLowerCase(),
  })
  saveStoredUsers(users)
}
