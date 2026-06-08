import { useCallback, useEffect, useState } from "react"
import {getNotifications,markAllNotificationsAsRead,markNotificationAsRead,type NotificationItem,type NotificationsPageMeta,DEFAULT_NOTIFICATIONS_PER_PAGE,} from "@/services/notificationsService"
import { normalizeNotification } from "@/utils/notifications/notificationMapperUtils"
import { getAuthSession } from "@/services/auth"
import { subscribeToUserNotifications } from "@/services/realtimeNotificationsService"

type UseNotificationsOptions = { pollIntervalMs?: number}

export function useNotifications(options: UseNotificationsOptions = {}) {
  const { pollIntervalMs = 0 } = options
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState("")
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState<NotificationsPageMeta>({ currentPage: 1, perPage: DEFAULT_NOTIFICATIONS_PER_PAGE, total: 0, totalPages: 1 })
  const refreshNotifications = useCallback(
    async (showLoading = false) => {
      if (showLoading) {
        setLoading(true)
      }
      try {
        const result = await getNotifications(page, DEFAULT_NOTIFICATIONS_PER_PAGE)
        setNotifications(result.notifications)
        setMeta(result.meta)
        setPageError("")
      } catch (error) {
        setNotifications([])
        setMeta({ currentPage: 1, perPage: DEFAULT_NOTIFICATIONS_PER_PAGE, total: 0, totalPages: 1 })
        setPageError(error instanceof Error ? error.message : "No se pudieron cargar las notificaciones.")
      } finally {
        if (showLoading) {
          setLoading(false)
        }
      }
    },
    [page],
  )

  useEffect(() => {
    void refreshNotifications(true)
  }, [refreshNotifications])

  useEffect(() => {
    if (!pollIntervalMs) return

    const intervalId = window.setInterval(() => {
      void refreshNotifications(false)
    }, pollIntervalMs)

    return () => window.clearInterval(intervalId)
  }, [pollIntervalMs, refreshNotifications])

  useEffect(() => {
    const userId = getAuthSession()?.user?.id

    if (userId == null) {
      return
    }

    return subscribeToUserNotifications(String(userId), {
      onGeneric: () => {
        void refreshNotifications(false)
      },
      onCreated: (payload: any) => {
        const newItem = normalizeNotification(payload)
        setNotifications((current) => {
          if (current.some((n) => n.id === newItem.id)) return current
          return [newItem, ...current]
        })
        setMeta((current) => ({
          ...current,
          total: current.total + 1,
        }))
      },
      onRead: (payload: { id: string; unread_count: number }) => {
        setNotifications((current) =>
          current.map((n) => (n.id === payload.id ? { ...n, read: true } : n))
        )
      }
    })
  }, [refreshNotifications])

  const markAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id)
      await refreshNotifications(false)
      setPageError("")
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "No se pudo actualizar la notificacion.")
    }
  }

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead()
      await refreshNotifications(false)
      setPageError("")
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "No se pudieron marcar todas las notificaciones como leidas.")
    }
  }

  const unreadCount = notifications.filter((notification) => !notification.read).length

  return {notifications,unreadCount,loading,pageError,markAsRead,markAllAsRead,refreshNotifications, page,setPage, meta, }
}