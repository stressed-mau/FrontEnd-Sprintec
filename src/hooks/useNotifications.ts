import { useEffect, useState } from "react"

import { getNotifications, type NotificationItem } from "@/services/notificationsService"

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState("")

  useEffect(() => {
    let isMounted = true

    const loadNotifications = async () => {
      setLoading(true)

      try {
        const result = await getNotifications()

        if (isMounted) {
          setNotifications(result)
          setPageError("")
        }
      } catch (error) {
        if (isMounted) {
          setNotifications([])
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
  }, [])

  const markAsRead = (id: string) => {
    setNotifications((previous) => previous.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)))
  }

  const markAllAsRead = () => {
    setNotifications((previous) => previous.map((notification) => ({ ...notification, read: true })))
  }

  const unreadCount = notifications.filter((notification) => !notification.read).length

  return {
    notifications,
    unreadCount,
    loading,
    pageError,
    markAsRead,
    markAllAsRead,
  }
}