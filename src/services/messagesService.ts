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
  contact_name?: string
  contact_email?: string
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
  sender_id: number | null
  receiver_id: number
  is_read: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  guest_name?: string | null
  guest_email?: string | null
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
  contactName?: string
  contactEmail?: string
  date: string
  read: boolean
  createdAt: string
  rawMessage: string
}

const MESSAGES_ENDPOINT = "/messages"
const PUBLIC_PORTFOLIO_MESSAGES_ENDPOINT = "/public/portfolio-messages"

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

  if (payload.contact_name?.trim() || payload.contact_email?.trim()) {
    parts.push(
      [
        "Datos de contacto:",
        payload.contact_name?.trim() ? `Nombre completo: ${payload.contact_name.trim()}` : "",
        payload.contact_email?.trim() ? `Correo de contacto: ${payload.contact_email.trim()}` : "",
      ].filter(Boolean).join("\n"),
    )
  }

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
  const contactSection = sections.find((section) => /^Datos de contacto:/i.test(section)) ?? ""
  const detailsSection = sections.find((section) => /^Detalles adicionales:/i.test(section)) ?? ""
  const contactName = contactSection.match(/Nombre completo:\s*(.+)/i)?.[1]?.trim()
  const contactEmail = contactSection.match(/Correo de contacto:\s*(.+)/i)?.[1]?.trim()
  const additionalDetails = detailsSection.replace(/^Detalles adicionales:\s*/i, "").trim()

  return {
    category,
    message: body,
    contactName: contactName || undefined,
    contactEmail: contactEmail || undefined,
    additionalDetails: additionalDetails || undefined,
  }
}

export function normalizeInboxMessage(message: ApiMessage): InboxMessage {
  const sender = message.sender
  const senderInfo = sender?.user_information
  const parsedMessage = parseBackendMessage(message.message || "")
  const fallbackName = sender?.username || `Usuario ${message.sender_id}`
  const guestName = message.guest_name?.trim() || parsedMessage.contactName
  const guestEmail = message.guest_email?.trim() || parsedMessage.contactEmail

  return {
    id: String(message.id),
    senderId: message.sender_id == null ? "" : String(message.sender_id),
    receiverId: String(message.receiver_id),
    from: guestName || senderInfo?.fullname || fallbackName,
    fromEmail: guestEmail || senderInfo?.public_email || sender?.email || "Sin correo publico",
    fromPhoto: senderInfo?.image_url || undefined,
    category: parsedMessage.category,
    message: parsedMessage.message,
    additionalDetails: parsedMessage.additionalDetails,
    contactName: guestName,
    contactEmail: guestEmail,
    date: formatRelativeTime(message.created_at),
    read: Boolean(message.is_read),
    createdAt: message.created_at,
    rawMessage: message.message,
  }
}

export async function sendPortfolioMessage(payload: SendPortfolioMessagePayload): Promise<ApiMessage> {
  try {
    const isGuestMessage = Boolean(payload.contact_name?.trim() || payload.contact_email?.trim())
    const endpoint = isGuestMessage ? PUBLIC_PORTFOLIO_MESSAGES_ENDPOINT : MESSAGES_ENDPOINT
    const response = await api.post(endpoint, {
      recipient_id: payload.recipient_id,
      ...(isGuestMessage ? {} : { receiver_id: payload.recipient_id }),
      portfolio_slug: payload.portfolio_slug,
      reason: payload.reason,
      reason_title: payload.reason_title,
      base_message: payload.base_message,
      additional_details: payload.additional_details,
      contact_name: payload.contact_name,
      contact_email: payload.contact_email,
      message: composeBackendMessage(payload),
    }, { skipAuth: isGuestMessage, skipAuthRedirect: true })

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
