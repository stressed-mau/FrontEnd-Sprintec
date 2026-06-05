export interface SocialNetworkDto {
  id?: string | number
  user_id?: string | number
  name?: string
  url?: string
  is_public?: boolean
  created_at?: string
  updated_at?: string
}

export interface SocialNetwork {
  id: string
  userId?: string
  name: string
  url: string
  isPublic: boolean
  createdAt?: string
  updatedAt?: string
}

export interface UpdateSocialNetworkPayload {
  name?: string
  url?: string
  is_public?: boolean
}
