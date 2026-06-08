import { useCallback, useEffect, useState } from "react"
import {getNotifications,markAllNotificationsAsRead,markNotificationAsRead,type NotificationItem,type NotificationsPageMeta,} from "@/services/notificationsService"
import { normalizeNotification } from "@/utils/notifications/notificationMapperUtils"
import { getAuthSession } from "@/services/auth"
import { subscribeToUserNotifications } from "@/services/realtimeNotificationsService"

type UseNotificationsOptions = { pollIntervalMs?: number}

function applyReadToQueue(current: NotificationItem[], id: string) {
  const targetIndex = current.findIndex((n) => n.id === id)
  if (targetIndex === -1) return current
  if (current[targetIndex].read) return current

  const targetNotification = { ...current[targetIndex], read: true }
  const filteredArray = current.filter((n) => n.id !== id)
  
  const unreadList = filteredArray.filter((n) => !n.read)
  const readList = filteredArray.filter((n) => n.read)
  
  return [...unreadList, targetNotification, ...readList]
}

export function useNotifications(options: UseNotificationsOptions = {}) {
  const { pollIntervalMs = 0 } = options
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState("")
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState<NotificationsPageMeta>({ currentPage: 1, perPage: 15, total: 0, totalPages: 1 })
  const refreshNotifications = useCallback(
    async (showLoading = false) => {
      if (showLoading) {
        setLoading(true)
      }
      try {
        const result = await getNotifications(page)
        setNotifications(result.notifications)
        setMeta(result.meta)
        setPageError("")
      } catch (error) {
        setNotifications([])
        setMeta({ currentPage: 1, perPage: 15, total: 0, totalPages: 1 })
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
        setNotifications((current) => applyReadToQueue(current, payload.id))
      }
    })
  }, [refreshNotifications])

  const markAsRead = async (id: string) => {
    setNotifications((current) => applyReadToQueue(current, id))
    try {
      await markNotificationAsRead(id)
      setPageError("")
    } catch (error) {
      void refreshNotifications(false)
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