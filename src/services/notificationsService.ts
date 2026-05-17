import axios from "axios"

import { api } from "./api"

export interface NotificationItem {
  id: string
  title: string
  description: string
  time: string
  read: boolean
  link: string
}

const NOTIFICATIONS_ENDPOINT = "/notifications"

function buildErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || "No se pudieron cargar las notificaciones."
  }

  return "No se pudieron cargar las notificaciones."
}

function normalizeNotification(notification: Partial<NotificationItem> & { id?: string | number }): NotificationItem {
  return {
    id: String(notification.id ?? crypto.randomUUID()),
    title: notification.title ?? "",
    description: notification.description ?? "",
    time: notification.time ?? "",
    read: Boolean(notification.read),
    link: notification.link ?? "/",
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

export async function getNotifications(): Promise<NotificationItem[]> {
  try {
    const response = await api.get(NOTIFICATIONS_ENDPOINT)
    const payload = unwrapNotificationsPayload(response.data)

    if (Array.isArray(payload)) {
      return payload.map((item) => normalizeNotification(item as Partial<NotificationItem> & { id?: string | number }))
    }

    if (payload && typeof payload === "object") {
      const record = payload as Record<string, unknown>
      const notifications = Array.isArray(record.notifications) ? record.notifications : Array.isArray(record.data) ? record.data : []
      return notifications.map((item) => normalizeNotification(item as Partial<NotificationItem> & { id?: string | number }))
    }

    return []
  } catch (error) {
    throw new Error(buildErrorMessage(error))
  }
}