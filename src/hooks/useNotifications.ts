import { useEffect, useState } from "react"

import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  type NotificationItem,
  type NotificationsPageMeta,
} from "@/services/notificationsService"

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState("")
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState<NotificationsPageMeta>({ currentPage: 1, perPage: 15, total: 0, totalPages: 1 })

  useEffect(() => {
    let isMounted = true

    const loadNotifications = async () => {
      setLoading(true)

      try {
        const result = await getNotifications(page)

        if (isMounted) {
          setNotifications(result.notifications)
          setMeta(result.meta)
          setPageError("")
        }
      } catch (error) {
        if (isMounted) {
          setNotifications([])
          setMeta({ currentPage: 1, perPage: 15, total: 0, totalPages: 1 })
          setPageError(error instanceof Error ? error.message : "No se pudieron cargar las notificaciones.")
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    void loadNotifications()

    return () => {
      isMounted = false
    }
  }, [page])

  const refreshNotifications = async () => {
    const result = await getNotifications(page)
    setNotifications(result.notifications)
    setMeta(result.meta)
  }

  const markAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id)
      await refreshNotifications()
      setPageError("")
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "No se pudo actualizar la notificación.")
    }
  }

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead()
      await refreshNotifications()
      setPageError("")
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "No se pudieron marcar todas las notificaciones como leídas.")
    }
  }

  const unreadCount = notifications.filter((notification) => !notification.read).length

  return {
    notifications,
    unreadCount,
    loading,
    pageError,
    markAsRead,
    markAllAsRead,
    page,
    setPage,
    meta,
  }
}