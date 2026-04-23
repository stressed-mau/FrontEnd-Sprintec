import { useMemo, useState } from "react"
import { Home, LogOut, User, Search} from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"

import logo from "@/assets/logo.png"
import { useLogout } from "@/hooks/useLogout"
import { USER_HOME_ROUTE } from "@/routes/route-paths"
import { getAuthSession } from "@/services/auth"

const ROLE_LABELS: Record<number, string> = {
  1: "Administrador",
  2: "Usuario",
}

const HeaderUser = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const logout = useLogout()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const session = getAuthSession()
  const user = session?.user
  const displayName = user?.username || "Usuario"
  const displayEmail = user?.email || "Sin correo"
  const displayRole = user?.role_id ? ROLE_LABELS[user.role_id] || `Rol ${user.role_id}` : "Usuario"
  const isDashboard = useMemo(
    () => location.pathname === USER_HOME_ROUTE || location.pathname === "/dashboard",
    [location.pathname],
  )

  const isExplore = useMemo(
    () => location.pathname === "/explore",
    [location.pathname],
  )

  function navigateTo(path: string) {
    setIsMenuOpen(false)
    navigate(path)
  }

  return (
    <header className="sticky top-0 z-50 flex min-h-16 h-auto flex-wrap items-center justify-between border-b border-[#4982ad] bg-[#003A6C] px-4 py-3 md:flex-nowrap md:px-8 md:py-0">
      <div className="order-1 flex items-center gap-2 md:flex-1">
        <img src={logo} alt="Logo" className="h-10 w-10 object-contain md:h-16 md:w-16" />
        <h1 className="text-lg font-bold tracking-tight text-white md:text-xl">PortfolioGen</h1>
      </div>

      <nav className="order-3 mt-3 flex w-full justify-start gap-4 md:order-2 md:mt-0 md:w-auto md:justify-center md:gap-6">
        <button
          id="btn-go-dashboard"
          onClick={() => navigateTo(USER_HOME_ROUTE)}
          className={`flex items-center gap-2 rounded-lg px-3 py-1.5 font-medium transition-colors ${
            isDashboard
              ? "bg-[#77b6e6] text-[#003A6C] md:bg-transparent md:text-[#77b6e6]"
              : "text-[#c2dbed] hover:text-[#77b6e6]"
          }`}
        >
          <Home size={18} />
          <span>Inicio</span>
        </button>

        <button
          id="btn-go-explore"
          onClick={() => navigateTo("/explore")}
          className={`flex items-center gap-2 rounded-lg px-3 py-1.5 font-medium transition-colors ${
            isExplore
              ? "bg-[#77b6e6] text-[#003A6C] md:bg-transparent md:text-[#77b6e6]"
              : "text-[#c2dbed] hover:text-[#77b6e6]"
          }`}
        >
          <Search size={18} />
          <span>Explorar portafolios</span>
        </button>
      </nav>

      <div className="relative order-2 flex justify-end md:order-3 md:flex-1">
        <button
          id="btn-user-menu"
          onClick={() => setIsMenuOpen((current) => !current)}
          className="flex items-center gap-2 rounded-lg border border-[#4982ad] bg-white px-3 py-1.5 transition-all hover:bg-[#F7F0E1] md:px-4"
        >
          <User className="h-5 w-5 text-[#003A6C]" />
          <span className="hidden text-sm font-medium text-[#003A6C] md:inline">{displayName}</span>
        </button>

        {isMenuOpen ? (
          <>
            <div className="fixed inset-0 z-[-1]" onClick={() => setIsMenuOpen(false)} />
            <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-[#4982ad] bg-white shadow-lg animate-in fade-in zoom-in duration-200 md:w-60">
              <div className="border-b border-[#0E7D96] p-4 text-left">
                <p className="text-sm font-normal text-gray-800">{displayName}</p>
                <p className="truncate text-xs text-[#0E7D96]">{displayEmail}</p>
                <p className="mt-1 text-xs text-[#0E7D96]">{displayRole}</p>
              </div>
              <div className="px-3 py-2">
                <button
                  onClick={() => navigateTo("/perfil")}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-[#C4A57C]" >
                  <User size={16} className="text-gray-500" />  Mi perfil
                </button>
              </div>
              <div className="border-t border-[#0E7D96] px-3 py-2">
                <button
                  onClick={logout}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-red-500 transition-colors hover:bg-[#C4A57C]"   >
                  <LogOut size={16} />  Cerrar sesión
                </button>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </header>
  )
}

export default HeaderUser
