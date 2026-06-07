import { asRecord } from "@/utils/notifications/notificationHelpers"
import { formatRelativeTime } from "@/utils/notifications/notificationTimeUtils"
import { getFirstValue } from "@/utils/notifications/notificationHelpers"
import { MESSAGES_ROUTE } from "@/routes/route-paths"
import type { NotificationItem } from "@/services/notificationsService"

export function normalizeNotification(notification: Record<string, unknown>): NotificationItem {
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
