export type RegisterRequest = {
  username: string
  email: string
  password: string
  password_confirmation: string
}

export type LoginRequest = {
  user: string
  password: string
}

export type AuthUserInformation = {
  id: number
  fullname: string | null
  occupation: string | null
  biography: string | null
  image_url: string | null
  image_public_id: string | null
  nationality: string | null
  phone_number: string | null
  public_email: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  user_id: number
}

export type AuthUser = {
  id: number
  username: string
  email: string
  role_id: number
  /**
   * Compat: algunos endpoints antiguos devuelven `info_id`.
   * El backend actual devuelve `user_information` y este id vive en `user_information.id`.
   */
  info_id?: number
  is_active: boolean
  created_at: string
  updated_at: string
  user_information?: AuthUserInformation
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
