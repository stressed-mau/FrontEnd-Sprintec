import { api } from "./api"
import { buildErrorMessage } from "@/utils/notifications/notificationErrorUtils"
import { normalizeNotificationsResponse } from "@/utils/notifications/notificationResponseUtils"
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
export const DEFAULT_NOTIFICATIONS_PER_PAGE = 5

export async function getNotifications(page = 1, perPage = DEFAULT_NOTIFICATIONS_PER_PAGE): Promise<NotificationsResponse> {
  try {
    const response = await api.get(NOTIFICATIONS_ENDPOINT, {
      params: { page, per_page: perPage },
    })
    return normalizeNotificationsResponse(response.data?.data ?? response.data)
  } catch (error) {
    throw new Error(buildErrorMessage(error))
  }}

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
