import axios from "axios"

import { api } from "./api"

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

const SOCIAL_NETWORKS_ENDPOINT = "/social_network"
const SOCIAL_NETWORK_MUTATION_TIMEOUT_MS = 5000

function formatError(error: unknown): Error {
  if (axios.isAxiosError(error)) {
    if (error.code === "ECONNABORTED") {
      return new Error("La solicitud tardó demasiado. Intenta nuevamente.")
    }

    if (error.code === "ERR_NETWORK") {
      return new Error("No se pudo conectar con el backend. Verifica que Laravel esté levantado.")
    }

    const backendMessage =
      (error.response?.data as { message?: string } | undefined)?.message ??
      error.message

    return new Error(backendMessage || "Error inesperado al consumir redes sociales.")
  }

  return new Error("Error inesperado al consumir redes sociales.")
}

function unwrapPayload(data: unknown): unknown {
  if (!data || typeof data !== "object") {
    return data
  }

  const record = data as Record<string, unknown>

  if (Array.isArray(record.data)) {
    return record.data
  }

  if ("data" in record && record.data && typeof record.data === "object") {
    return unwrapPayload(record.data)
  }

  return data
}

function unwrapSocialNetworks(data: unknown): SocialNetworkDto[] {
  const unwrapped = unwrapPayload(data)

  if (Array.isArray(unwrapped)) {
    return unwrapped as SocialNetworkDto[]
  }

  return []
}

function unwrapSocialNetwork(data: unknown): SocialNetworkDto {
  const unwrapped = unwrapPayload(data)
  return (unwrapped ?? {}) as SocialNetworkDto
}

function normalizeSocialNetwork(dto: SocialNetworkDto): SocialNetwork {
  return {
    id: String(dto.id ?? crypto.randomUUID()),
    userId: dto.user_id != null ? String(dto.user_id) : undefined,
    name: dto.name ?? "",
    url: dto.url ?? "",
    isPublic: Boolean(dto.is_public ?? true),
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  }
}

export async function fetchOAuthUrl(provider: string): Promise<string> {
  try {
    const response = await api.get<{ url: string }>(`/social/connect/${provider}`, {
      maxRedirects: 0,
    })
    return response.data.url
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status) {
      if (error.response.status >= 300 && error.response.status < 400) {
        const locationHeader = error.response.headers?.location
        const responseData = error.response.data as { url?: string } | undefined
        const url = locationHeader || responseData?.url

        if (url) {
          return url
        }
      }
    }

    throw formatError(error)
  }
}

export async function getUserSocialNetworks(): Promise<SocialNetwork[]> {
  try {
    const response = await api.get(SOCIAL_NETWORKS_ENDPOINT)
    return unwrapSocialNetworks(response.data).map(normalizeSocialNetwork)
  } catch (error) {
    throw formatError(error)
  }
}

export async function updateSocialNetwork(
  id: string,
  payload: UpdateSocialNetworkPayload,
): Promise<SocialNetwork> {
  try {
    const response = await api.put(`${SOCIAL_NETWORKS_ENDPOINT}/${id}`, payload, {
      timeout: SOCIAL_NETWORK_MUTATION_TIMEOUT_MS,
    })
    return normalizeSocialNetwork(unwrapSocialNetwork(response.data))
  } catch (error) {
    throw formatError(error)
  }
}

export async function removeSocialNetwork(id: string): Promise<void> {
  try {
    await api.delete(`${SOCIAL_NETWORKS_ENDPOINT}/${id}`, {
      timeout: SOCIAL_NETWORK_MUTATION_TIMEOUT_MS,
    })
  } catch (error) {
    throw formatError(error)
  }
}
