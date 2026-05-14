import { useState, useRef, useEffect } from "react"
import { Bell, TrendingUp } from "lucide-react"
import { Link } from "react-router-dom"

interface Notification {
  id: string
  title: string
  description: string
  time: string
  read: boolean
  link: string
}

interface NotificationBellProps {
  initialNotifications?: Notification[]
}

export function NotificationBell({ initialNotifications = [] }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)

  // Mock temporal comentado para cuando no exista API en entorno local.
  // const mockNotifications: Notification[] = [
  //   {
  //     id: "1",
  //     title: "Reporte semanal disponible",
  //     description: "Semana del 28 de abril al 4 de mayo · Tendencia de Plantillas",
  //     time: "Hace 3 horas",
  //     read: false,
  //     link: "/tendencia-plantillas",
  //   },
  //   {
  //     id: "2",
  //     title: "Reporte semanal disponible",
  //     description: "Semana del 21 al 27 de abril · Tendencia de Plantillas",
  //     time: "Hace 1 semana",
  //     read: false,
  //     link: "/tendencia-plantillas",
  //   },
  // ]

  useEffect(() => {
    setNotifications(initialNotifications)
  }, [initialNotifications])

  const unreadCount = notifications.filter((notification) => !notification.read).length

  const markAllAsRead = () => {
    setNotifications((previous) => previous.map((notification) => ({ ...notification, read: true })))
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
                onClick={markAllAsRead}
                className="text-xs text-[#003A6C] transition-colors hover:underline"
              >
                Marcar todas como leídas
              </button>
            )}
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <Link
                  key={notification.id}
                  to={notification.link}
                  onClick={() => setIsOpen(false)}
                  className={`block border-b border-[#6DACBF]/10 px-3 py-3 transition-colors hover:bg-[#F7F0E1]/50 sm:px-4 sm:py-4 ${
                    !notification.read ? "bg-[#C2DBED]/10" : "bg-white"
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="shrink-0">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#003A6C]/10 text-[#003A6C]">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold leading-tight text-[#003A6C]">{notification.title}</p>
                      <p className="mt-1 text-xs leading-snug text-[#4982AD]">{notification.description}</p>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <span className="text-[10px] font-medium text-[#5B8FB9]">{notification.time}</span>
                        <span className="text-[10px] font-bold uppercase text-[#003A6C]">Ver reporte</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-6 text-center text-sm text-gray-400 sm:p-8">No tienes notificaciones</div>
            )}
          </div>

          <div className="border-t border-[#6DACBF]/20 bg-gray-50/50">
            <Link
              to="/notificaciones"
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