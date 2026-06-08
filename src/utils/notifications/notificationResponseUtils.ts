import { normalizeNotification } from "@/utils/notifications/notificationMapperUtils"
import type { NotificationsResponse } from "@/services/notificationsService"

export function unwrapNotificationsPayload(data: unknown): unknown {
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

export function normalizeNotificationsResponse(data: unknown): NotificationsResponse {
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
    const perPage = Number(record.per_page ?? (notifications.length > 0 ? notifications.length : 5))
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
    meta: { currentPage: 1, perPage: 5, total: 0, totalPages: 1 },
  }
}
