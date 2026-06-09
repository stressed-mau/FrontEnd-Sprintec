import { Check, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { NotificationItem } from '@/services/notificationsService'
import { Footer } from '@/components/Footer'
import Header from '@/components/HeaderUser'
import Sidebar from '@/components/Sidebar'
import { useNotifications } from '@/hooks/useNotifications'
import { MESSAGES_ROUTE } from '@/routes/route-paths'
import { AlertCircle } from 'lucide-react'
import { navigateFromNotification } from '@/utils/notifications/notificationNavigation'

export function NotificationsPage() {
  const navigate = useNavigate()
  const { notifications, unreadCount, loading, pageError, markAsRead, markAllAsRead, page, setPage, meta } = useNotifications()
  const hasPreviousPage = page > 1
  const hasNextPage = page < meta.totalPages

  const handleNotificationClick = async (notification: NotificationItem) => {
    if (!notification.read) {
      await markAsRead(notification.id)
    }
    navigateFromNotification(notification, navigate)
  }

  return (
    <div className="min-h-screen bg-[#F7F0E1] flex flex-col">
      <Header />
      <div className="flex flex-col lg:flex-row flex-1">
        <Sidebar />
        <main className="flex-1 px-4 py-6 md:px-8 lg:px-10">
          <div className="mx-auto max-w-5xl space-y-6">
            <div className="flex flex-col gap-3 p-2 md:flex-row md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-[#003A6C]">Notificaciones</h1>
                {unreadCount > 0 && (
                  <p className="text-sm text-[#5B8FB9] mt-1">
                    Tienes {unreadCount} notificación{unreadCount !== 1 ? "es" : ""} sin leer
                  </p>
                )}
                <p className="text-xs text-[#5B8FB9] mt-1">
                   {meta.total} notificaciones
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-xl border border-[#6DACBF]/30 bg-white px-3 py-2 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setPage(page - 1)}
                    disabled={!hasPreviousPage || loading}
                    className="rounded-lg p-1 text-[#003A6C] transition-colors hover:bg-[#F7F0E1] disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Página anterior"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="min-w-24 text-center text-xs font-semibold text-[#003A6C]">{meta.currentPage}</span>
                  <button
                    type="button"
                    onClick={() => setPage(page + 1)}
                    disabled={!hasNextPage || loading}
                    className="rounded-lg p-1 text-[#003A6C] transition-colors hover:bg-[#F7F0E1] disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Página siguiente"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={() => void markAllAsRead()}
                    className="text-sm text-[#003A6C] hover:text-[#4982AD] transition-colors flex items-center gap-2"
                  >
                    <Check className="h-4 w-4" />
                    Marcar todas como leídas
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-[#6DACBF] shadow-sm divide-y divide-[#6DACBF]/30">
              {loading ? (
                <div className="p-8 text-center text-sm text-[#5B8FB9]">Cargando notificaciones...</div>
              ) : pageError ? (
                <div className="p-8 text-center text-sm text-[#5B8FB9]">{pageError}</div>
              ) : notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => void handleNotificationClick(notification)}
                    className={`p-4 hover:bg-[#F7F0E1] transition-colors cursor-pointer ${
                      notification.dataType === 'certificate_rejected'
                        ? (notification.read ? 'bg-red-50/50' : 'bg-red-100/50')
                        : (!notification.read ? 'bg-[#C2DBED]/20' : '')
                    }`}
                  >
                    <div className="flex gap-4">
                      <div className="shrink-0 mt-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          notification.dataType === 'certificate_rejected' ? 'bg-red-100' : 'bg-[#003A6C]/10'
                        }`}>
                          {notification.dataType === 'certificate_rejected' ? (
                            <AlertCircle className="h-5 w-5 text-red-600" />
                          ) : (
                            <TrendingUp className="h-5 w-5 text-[#003A6C]" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-semibold text-[#003A6C]">{notification.title}</h3>
                          {!notification.read && <span className="shrink-0 w-2 h-2 bg-[#003A6C] rounded-full mt-2"></span>}
                        </div>
                        <p className="text-sm text-[#4982AD] mb-2">{notification.description}</p>
                        {notification.dataType === 'certificate_rejected' && notification.data?.reason && (
                          <p className="text-xs text-red-600/90 mb-2 font-medium bg-red-100/50 p-2 rounded inline-block">
                            {notification.data.reason}
                          </p>
                        )}
                        <span className="text-xs text-[#5B8FB9] block">{notification.time}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-sm text-[#5B8FB9]">No tienes notificaciones</div>
              )}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}
