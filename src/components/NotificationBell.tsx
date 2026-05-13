import { useState, useRef, useEffect } from 'react';
import { Bell, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom'; 

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  link: string;
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // Para cerrar al hacer clic fuera

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Reporte semanal disponible',
      description: 'Semana del 28 de abril al 4 de mayo · Tendencia de Plantillas',
      time: 'Hace 3 horas',
      read: false,
      link: '/tendencia-plantillas'
    },
    {
      id: '2',
      title: 'Reporte semanal disponible',
      description: 'Semana del 21 al 27 de abril · Tendencia de Plantillas',
      time: 'Hace 1 semana',
      read: false,
      link: '/tendencia-plantillas'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-[#4982AD] rounded-lg transition-colors flex items-center justify-center" >
        <Bell className="h-5 w-5 text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-[#EF4444] text-white text-[10px] flex items-center justify-center rounded-full border-2 border-[#003A6C] font-bold">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-85 md:w-90 bg-white border border-[#6DACBF] shadow-xl rounded-2xl overflow-hidden z-100 animate-in fade-in zoom-in duration-200">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#6DACBF]/30">
            <h3 className="font-semibold text-[#003A6C]">Notificaciones</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-[#003A6C] hover:underline transition-colors"              >
                Marcar todas como leídas
              </button>
            )}
          </div>

          <div className="max-h-100 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <Link
                  key={notification.id}
                  to={notification.link}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-4 border-b border-[#6DACBF]/10 hover:bg-[#F7F0E1]/50 transition-colors ${
                    !notification.read ? 'bg-[#C2DBED]/10' : 'bg-white'
                  }`}                >
                  <div className="flex gap-3">
                    <div className="shrink-0">
                      <div className="w-9 h-9 rounded-xl bg-[#003A6C]/10 flex items-center justify-center text-[#003A6C]">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-[#003A6C] leading-tight">{notification.title}</p>
                      <p className="text-xs text-[#4982AD] mt-1 leading-snug">{notification.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px] text-[#5B8FB9] font-medium">{notification.time}</span>
                        <span className="text-[10px] font-bold text-[#003A6C] uppercase">Ver reporte</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center text-gray-400 text-sm">No tienes notificaciones</div>
            )}
          </div>

          <div className="bg-gray-50/50 border-t border-[#6DACBF]/20">
            <Link
              to="/notificaciones"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 text-center text-sm font-bold text-[#003A6C] hover:bg-[#F7F0E1] transition-colors"     >
              Ver todas las notificaciones
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}