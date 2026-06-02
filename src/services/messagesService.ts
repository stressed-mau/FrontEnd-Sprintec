import axios from "axios"

import { api } from "@/services/api"

export type MessageReason =
  | "job_opportunity"
  | "project_collaboration"
  | "technical_question"
  | "professional_networking"
  | "mentorship"
  | "freelance_proposal"

export type SendPortfolioMessagePayload = {
  recipient_id: string
  portfolio_slug?: string
  reason: MessageReason
  reason_title: string
  base_message: string
  additional_details?: string
}

export type ApiMessageUserInformation = {
  id?: number
  fullname?: string | null
  occupation?: string | null
  image_url?: string | null
  nationality?: string | null
  phone_number?: string | null
  public_email?: string | null
}

export type ApiMessageUser = {
  id: number
  username?: string | null
  email?: string | null
  is_active?: boolean
  role_id?: number
  user_information?: ApiMessageUserInformation | null
}

export type ApiMessage = {
  id: number
  message: string
  sender_id: number
  receiver_id: number
  is_read: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  sender?: ApiMessageUser | null
}

export type InboxMessage = {
  id: string
  senderId: string
  receiverId: string
  from: string
  fromEmail: string
  fromPhoto?: string
  category: string
  message: string
  additionalDetails?: string
  date: string
  read: boolean
  createdAt: string
  rawMessage: string
}

const MESSAGES_ENDPOINT = "/messages"

function buildErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data as { message?: string; error?: string } | undefined
    return responseData?.message || responseData?.error || error.message || fallback
  }

  return error instanceof Error ? error.message : fallback
}

function unwrapMessagePayload(data: unknown): unknown {
  if (!data || typeof data !== "object") {
    return data
  }

  const record = data as Record<string, unknown>

  if (Array.isArray(record.data) || Array.isArray(record.messages)) {
    return record.data ?? record.messages
  }

  if ("data" in record && record.data) {
    return unwrapMessagePayload(record.data)
  }

  if ("message" in record && record.message && typeof record.message === "object") {
    return unwrapMessagePayload(record.message)
  }

  return data
}

function formatRelativeTime(value?: string) {
  if (!value) {
    return "Reciente"
  }

  const createdAt = new Date(value)
  if (Number.isNaN(createdAt.getTime())) {
    return "Reciente"
  }

  const diffMinutes = Math.max(0, Math.floor((Date.now() - createdAt.getTime()) / 60000))
  if (diffMinutes < 1) return "Hace un momento"
  if (diffMinutes < 60) return `Hace ${diffMinutes} min`

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `Hace ${diffHours} h`

  const diffDays = Math.floor(diffHours / 24)
  return `Hace ${diffDays} d`
}

function composeBackendMessage(payload: SendPortfolioMessagePayload) {
  const parts = [payload.reason_title.trim(), payload.base_message.trim()]

  if (payload.additional_details?.trim()) {
    parts.push(`Detalles adicionales:\n${payload.additional_details.trim()}`)
  }

  return parts.filter(Boolean).join("\n\n")
}

function parseBackendMessage(value: string) {
  const sections = value
    .split(/\n{2,}/)
    .map((section) => section.trim())
    .filter(Boolean)

  const category = sections[0] || "Mensaje"
  const body = sections[1] || sections[0] || ""
  const detailsSection = sections.slice(2).join("\n\n")
  const additionalDetails = detailsSection.replace(/^Detalles adicionales:\s*/i, "").trim()

  return {
    category,
    message: body,
    additionalDetails: additionalDetails || undefined,
  }
}

export function normalizeInboxMessage(message: ApiMessage): InboxMessage {
  const sender = message.sender
  const senderInfo = sender?.user_information
  const parsedMessage = parseBackendMessage(message.message || "")
  const fallbackName = sender?.username || `Usuario ${message.sender_id}`

  return {
    id: String(message.id),
    senderId: String(message.sender_id),
    receiverId: String(message.receiver_id),
    from: senderInfo?.fullname || fallbackName,
    fromEmail: senderInfo?.public_email || sender?.email || "Sin correo publico",
    fromPhoto: senderInfo?.image_url || undefined,
    category: parsedMessage.category,
    message: parsedMessage.message,
    additionalDetails: parsedMessage.additionalDetails,
    date: formatRelativeTime(message.created_at),
    read: Boolean(message.is_read),
    createdAt: message.created_at,
    rawMessage: message.message,
  }
}

export async function sendPortfolioMessage(payload: SendPortfolioMessagePayload): Promise<ApiMessage> {
  try {
    const response = await api.post(MESSAGES_ENDPOINT, {
      receiver_id: payload.recipient_id,
      message: composeBackendMessage(payload),
    })

    return (unwrapMessagePayload(response.data) ?? response.data) as ApiMessage
  } catch (error) {
    throw new Error(buildErrorMessage(error, "No se pudo enviar el mensaje. Intentalo nuevamente."))
  }
}

export async function getInboxMessages(): Promise<InboxMessage[]> {
  try {
    const response = await api.get(MESSAGES_ENDPOINT)
    const payload = unwrapMessagePayload(response.data)
    const messages = Array.isArray(payload) ? payload : []

    return messages.map((message) => normalizeInboxMessage(message as ApiMessage))
  } catch (error) {
    throw new Error(buildErrorMessage(error, "No se pudieron cargar los mensajes."))
  }
}

export async function readInboxMessage(id: string): Promise<InboxMessage> {
  try {
    const response = await api.get(`${MESSAGES_ENDPOINT}/${id}`)
    const payload = unwrapMessagePayload(response.data)

    return normalizeInboxMessage(payload as ApiMessage)
  } catch (error) {
    throw new Error(buildErrorMessage(error, "No se pudo cargar el mensaje."))
  }
}
