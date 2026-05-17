import { Check, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Footer } from '@/components/Footer'
import Header from '@/components/HeaderUser'
import Sidebar from '@/components/Sidebar'
import { useNotifications } from '@/hooks/useNotifications'

export function NotificationsPage() {
  const { notifications, unreadCount, loading, pageError, markAsRead, markAllAsRead } = useNotifications()

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
              </div>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="text-sm text-[#003A6C] hover:text-[#4982AD] transition-colors flex items-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  Marcar todas como leídas
                </button>
              )}
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
                    className={`p-4 hover:bg-[#F7F0E1] transition-colors ${!notification.read ? "bg-[#C2DBED]/20" : ""}`}
                  >
                    <div className="flex gap-4">
                      <div className="shrink-0 mt-1">
                        <div className="w-10 h-10 rounded-full bg-[#003A6C]/10 flex items-center justify-center">
                          <TrendingUp className="h-5 w-5 text-[#003A6C]" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-semibold text-[#003A6C]">{notification.title}</h3>
                          {!notification.read && <span className="shrink-0 w-2 h-2 bg-[#003A6C] rounded-full mt-2"></span>}
                        </div>
                        <p className="text-sm text-[#4982AD] mb-2">{notification.description}</p>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs text-[#5B8FB9]">{notification.time}</span>
                          <div className="flex items-center gap-3">
                            {!notification.read && (
                              <button type="button" onClick={() => markAsRead(notification.id)} className="text-xs text-[#003A6C] hover:underline">
                                Marcar como leída
                              </button>
                            )}
                            <Link to={notification.link} className="text-sm text-[#003A6C] hover:underline font-medium">
                              Ver reporte
                            </Link>
                          </div>
                        </div>
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