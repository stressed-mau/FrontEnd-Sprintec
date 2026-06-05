import axios from "axios"

import { api } from "@/services/api"
import type { ApiMessage, InboxMessage, SendPortfolioMessagePayload } from "@/types/messages"
import { composeBackendMessage, normalizeInboxMessage } from "@/utils/messageFormatUtils"

export type {
  ApiMessage,
  InboxMessage,
  MessageReason,
  SendPortfolioMessagePayload,
} from "@/types/messages"

const MESSAGES_ENDPOINT = "/messages"
const PUBLIC_PORTFOLIO_MESSAGES_ENDPOINT = "/public/portfolio-messages"

interface MessageErrorResponse {
  message?: string
  error?: string
}

function buildErrorMessage(error: unknown, fallback: string) {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : fallback
  }

  const responseData = error.response?.data as MessageErrorResponse | undefined
  return responseData?.message || responseData?.error || error.message || fallback
}

function unwrapMessagePayload(data: unknown): unknown {
  if (!data || typeof data !== "object") return data

  const record = data as Record<string, unknown>
  if (Array.isArray(record.data) || Array.isArray(record.messages)) return record.data ?? record.messages
  if ("data" in record && record.data) return unwrapMessagePayload(record.data)
  if ("message" in record && record.message && typeof record.message === "object") {
    return unwrapMessagePayload(record.message)
  }

  return data
}

export async function sendPortfolioMessage(payload: SendPortfolioMessagePayload): Promise<ApiMessage> {
  try {
    const isGuestMessage = Boolean(payload.contact_name?.trim() || payload.contact_email?.trim())
    const endpoint = isGuestMessage ? PUBLIC_PORTFOLIO_MESSAGES_ENDPOINT : MESSAGES_ENDPOINT
    const response = await api.post(endpoint, buildMessageRequest(payload, isGuestMessage), {
      skipAuth: isGuestMessage,
      skipAuthRedirect: true,
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
    return normalizeInboxMessage(unwrapMessagePayload(response.data) as ApiMessage)
  } catch (error) {
    throw new Error(buildErrorMessage(error, "No se pudo cargar el mensaje."))
  }
}

function buildMessageRequest(payload: SendPortfolioMessagePayload, isGuestMessage: boolean) {
  return {
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
  }
}
