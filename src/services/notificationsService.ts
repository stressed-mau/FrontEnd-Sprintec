import axios from "axios"

import { MESSAGES_ROUTE } from "@/routes/route-paths"
import { api } from "./api"

export interface NotificationItem {
  id: string
  title: string
  description: string
  time: string
  read: boolean
  link: string
  type?: string
  dataType?: string
  data?: Record<string, any>
  createdAt?: string
}

export interface NotificationsPageMeta {
  currentPage: number
  perPage: number
  total: number
  totalPages: number
}

export interface NotificationsResponse {
  notifications: NotificationItem[]
  meta: NotificationsPageMeta
}

const NOTIFICATIONS_ENDPOINT = "/notifications"

function buildErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || "No se pudieron cargar las notificaciones."
  }

  return "No se pudieron cargar las notificaciones."
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

function getFirstValue(...values: unknown[]) {
  return values.find((value) => value !== undefined && value !== null && String(value).trim() !== "")
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value) return null

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value)
      return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : null
    } catch {
      return null
    }
  }

  return typeof value === "object" ? (value as Record<string, unknown>) : null
}

function normalizeNotification(notification: Record<string, unknown>): NotificationItem {
  const payload = asRecord(notification.data) ?? notification
  const messageId = getFirstValue(payload.message_id, payload.messageId, notification.message_id)
  const isMessageNotification =
    Boolean(messageId) ||
    payload.type === "new_message" ||
    payload.action === "increment" ||
    notification.type === "new_message"

  const title = getFirstValue(
    payload.title,
    notification.title,
    isMessageNotification ? "Nuevo mensaje recibido" : "Notificacion",
  )
  const description = getFirstValue(
    payload.message,
    payload.description,
    notification.description,
    isMessageNotification ? "Un usuario ha contactado contigo" : "",
  )

  return {
    id: String(notification.id ?? crypto.randomUUID()),
    title: String(title),
    description: String(description),
    time: formatRelativeTime(String(notification.created_at ?? notification.createdAt ?? "")),
    read: Boolean(notification.read_at ?? notification.read ?? null),
    link: String(payload.link ?? notification.link ?? (messageId ? `${MESSAGES_ROUTE}/${messageId}` : "/notificaciones")),
    type: typeof notification.type === "string" ? notification.type : undefined,
    dataType: isMessageNotification ? "new_message" : typeof payload.type === "string" ? payload.type : undefined,
    data: { ...payload, ...(messageId ? { message_id: messageId } : {}) },
    createdAt: typeof notification.created_at === "string" ? notification.created_at : undefined,
  }
}

function unwrapNotificationsPayload(data: unknown): unknown {
  if (!data || typeof data !== "object") {
    return data
  }

  const record = data as Record<string, unknown>

  if (Array.isArray(record.data) || Array.isArray(record.notifications)) {
    return record
  }

  if ("data" in record && record.data && typeof record.data === "object") {
    return unwrapNotificationsPayload(record.data)
  }

  if ("notification" in record && record.notification && typeof record.notification === "object") {
    return unwrapNotificationsPayload(record.notification)
  }

  return data
}

function normalizeNotificationsResponse(data: unknown): NotificationsResponse {
  const payload = unwrapNotificationsPayload(data)

  if (Array.isArray(payload)) {
    return {
      notifications: payload.map((item) => normalizeNotification(item as Record<string, unknown>)),
      meta: { currentPage: 1, perPage: payload.length, total: payload.length, totalPages: 1 },
    }
  }

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>
    const notifications = Array.isArray(record.data) ? record.data : Array.isArray(record.notifications) ? record.notifications : []
    const currentPage = Number(record.current_page ?? 1)
    const perPage = Number(record.per_page ?? (notifications.length > 0 ? notifications.length : 15))
    const total = Number(record.total ?? notifications.length)
    const totalPages = perPage > 0 ? Math.max(1, Math.ceil(total / perPage)) : 1

    return {
      notifications: notifications.map((item) => normalizeNotification(item as Record<string, unknown>)),
      meta: {
        currentPage,
        perPage,
        total,
        totalPages,
      },
    }
  }

  return {
    notifications: [],
    meta: { currentPage: 1, perPage: 15, total: 0, totalPages: 1 },
  }
}

export async function getNotifications(page = 1): Promise<NotificationsResponse> {
  try {
    const response = await api.get(NOTIFICATIONS_ENDPOINT, {
      params: page > 1 ? { page } : undefined,
    })

    return normalizeNotificationsResponse(response.data?.data ?? response.data)
  } catch (error) {
    throw new Error(buildErrorMessage(error))
  }
}

export async function markNotificationAsRead(id: string): Promise<void> {
  try {
    await api.put(`${NOTIFICATIONS_ENDPOINT}/${id}/read`)
  } catch (error) {
    throw new Error(buildErrorMessage(error))
  }
}

export async function markAllNotificationsAsRead(): Promise<void> {
  try {
    await api.put(`${NOTIFICATIONS_ENDPOINT}/read-all`)
  } catch (error) {
    throw new Error(buildErrorMessage(error))
  }
}
