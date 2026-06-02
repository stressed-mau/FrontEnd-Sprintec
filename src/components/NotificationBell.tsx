import { useEffect, useRef, useState } from "react"
import { Bell, MessageCircle, TrendingUp } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

import { MESSAGES_ROUTE, NOTIFICATIONS_ROUTE } from "@/routes/route-paths"
import { useNotifications } from "@/hooks/useNotifications"
import type { NotificationItem } from "@/services/notificationsService"

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { notifications, unreadCount, markAllAsRead, markAsRead } = useNotifications({ pollIntervalMs: 5000 })

  const visibleNotifications = notifications.slice(0, 3)

  const handleNotificationClick = async (notification: NotificationItem) => {
    if (!notification.read) {
      await markAsRead(notification.id)
    }

    setIsOpen(false)

    if (!notification.data) {
      navigate(notification.link || '/notificaciones')
      return
    }

    const data = notification.data

    switch (notification.dataType) {
      case 'weekly_global_report':
        navigate('/tendencia-plantillas')
        break
      case 'new_message':
        navigate(data.message_id ? `${MESSAGES_ROUTE}/${data.message_id}` : MESSAGES_ROUTE)
        break
      case 'portfolio_view':
        navigate('/visualizaciones')
        break
      default:
        navigate(notification.link || '/notificaciones')
        break
    }
  }

  const handleMarkAllAsRead = async () => {
    await markAllAsRead()
    setIsOpen(false)
    navigate(NOTIFICATIONS_ROUTE)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        id="btn-notifications"
        onClick={() => setIsOpen((current) => !current)}
        aria-label="Abrir notificaciones"
        className="relative flex items-center justify-center rounded-lg p-2 transition-colors hover:bg-[#4982AD]"
      >
        <Bell className="h-5 w-5 text-white" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#003A6C] bg-[#EF4444] text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
       <div className="fixed inset-x-4 top-20 z-100 mt-2 max-w-none overflow-hidden rounded-2xl border border-[#6DACBF] bg-white shadow-xl animate-in fade-in zoom-in duration-200 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:w-80 md:w-96">
          
          <div className="flex items-center justify-between border-b border-[#6DACBF]/30 px-4 py-3">
            <h3 className="text-sm font-semibold text-[#003A6C] sm:text-base">Notificaciones</h3>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => void handleMarkAllAsRead()}
                className="text-xs text-[#003A6C] transition-colors hover:underline"
              >
                Marcar como leídas
              </button>
            )}
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {visibleNotifications.length > 0 ? (
              visibleNotifications.map((notification) => {
                const isMessage = notification.dataType === "new_message"

                return (
                  <div
                    key={notification.id}
                    onClick={() => void handleNotificationClick(notification)}
                    className={`block border-b border-[#6DACBF]/10 px-3 py-3 transition-colors sm:px-4 sm:py-4 cursor-pointer ${
                      !notification.read ? "bg-[#C4A57C] hover:bg-[#B89468]" : "bg-white hover:bg-[#F7F0E1]/50"
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="shrink-0">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${isMessage ? "bg-[#003A6C]/10 text-[#003A6C]" : "bg-[#003A6C]/10 text-[#003A6C]"}`}>
                          {isMessage ? <MessageCircle className="h-5 w-5" /> : <TrendingUp className="h-5 w-5" />}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold leading-tight text-[#003A6C]">{notification.title}</p>
                        <p className="mt-1 text-xs leading-snug text-[#4982AD]">{notification.description}</p>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <span className="text-[10px] font-medium text-[#5B8FB9]">{notification.time}</span>
                          <span className="text-[10px] font-bold uppercase text-[#003A6C]">
                            {notification.dataType === 'weekly_global_report' ? 'Ver reporte' : 'Ver detalles'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="p-6 text-center text-sm text-gray-400 sm:p-8">No tienes notificaciones</div>
            )}
          </div>

          <div className="border-t border-[#6DACBF]/20 bg-gray-50/50">
            <Link
              to={NOTIFICATIONS_ROUTE}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 text-center text-sm font-bold text-[#003A6C] transition-colors hover:bg-[#F7F0E1]"
            >
              Ver todas las notificaciones
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
