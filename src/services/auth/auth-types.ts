export type RegisterRequest = {
  username: string
  email: string
  password: string
  password_confirmation: string
}

export type LoginRequest = {
  user: string
  password: string
  email?: string
  username?: string
  login?: string
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

export type AuthResponse = {
  success: boolean
  message: string
  data: AuthUser
  access_token: string
  token_type: string
}

export type AuthSession = {
  accessToken: string
  tokenType: string
  user: AuthUser
}

export type ApiValidationErrors = Partial<Record<keyof RegisterRequest | keyof LoginRequest | string, string[]>>
