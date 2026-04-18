import { Award, Briefcase, ChevronLeft, ChevronRight, Eye, FolderGit2, Globe, LayoutTemplate, Settings2, Upload, User, GraduationCap } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Link, useLocation } from "react-router-dom"

type NavItem = {
  id: string
  label: string
  path: string
  icon: typeof Eye
}

const navItems: NavItem[] = [
  { id: "portafolio", label: "Ver mi portafolio", icon: Eye, path: "/portafolio" },
  { id: "personal", label: "Datos personales", icon: User, path: "/personal" },
  { id: "red-profesional", label: "Red profesional", icon: Globe, path: "/red-profesional" },
  { id: "proyectos", label: "Proyectos", icon: FolderGit2, path: "/proyectos" },
  { id: "habilidades", label: "Habilidades", icon: Award, path: "/habilidades" },
  { id: "formacion-academica", label: "Formación académica", icon: GraduationCap, path: "/formacion-academica" },
  { id: "experiencia", label: "Experiencia", icon: Briefcase, path: "/experiencia" },
  { id: "plantillas", label: "Plantillas", icon: LayoutTemplate, path: "/plantillas" },
  { id: "configuracion-visibilidad", label: "Configuración de visibilidad", icon: Settings2, path: "/configuracion-visibilidad" },
  { id: "publicar", label: "Publicar", icon: Upload, path: "/publicar" },
]

const Sidebar = () => {
  const location = useLocation()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    setIsMobileOpen(false)
  }, [location.pathname])

  const sidebarContent = useMemo(
    () => (
      <>
        <div className="mb-6 pb-4 -mx-6 px-6 border-b border-[#c2dbed]">
          <h2 className="text-[#003A6C] font-bold text-xl leading-tight">
            Gestionar <br /> Portafolio
          </h2>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path

            return (
              <Link
                key={item.id}
                to={item.path}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${
                  isActive
                    ? "bg-[#003A6C] text-white"
                    : "text-[#4982ad] hover:bg-[#77b6e6]/30"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-normal">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </>
    ),
    [location.pathname],
  )

  return (
    <>
      <section className="lg:hidden">
        <button
          type="button"
          onClick={() => setIsMobileOpen((current) => !current)}
          aria-label={isMobileOpen ? "Cerrar menú lateral" : "Abrir menú lateral"}
          className="fixed left-0 top-28 z-40 flex items-center justify-center rounded-r-2xl border border-l-0 border-[#003A6C] bg-[#003A6C] px-2 py-4 text-white shadow-sm"
        >
          {isMobileOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </button>

        {isMobileOpen ? (
          <button
            type="button"
            aria-label="Cerrar menú lateral"
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-x-0 bottom-0 top-26 z-30 bg-black/20"
          />
        ) : null}

        <aside
          className={`fixed left-0 top-26 z-40 h-[calc(100vh-104px)] w-64 border-r-2 border-[#6dacbf] bg-white p-6 transition-transform duration-300 ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Ocultar menú lateral"
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-[#003A6C] bg-[#003A6C] text-white shadow-sm"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          {sidebarContent}
        </aside>
      </section>

      <aside className="hidden lg:block w-64 bg-white border-r-2 border-[#6dacbf] min-h-[calc(100vh-64px)] p-6">
        {sidebarContent}
      </aside>
    </>
  )
}

export default Sidebar
