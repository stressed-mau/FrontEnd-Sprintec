import {
  Award,
  Briefcase,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  FolderGit2,
  Globe,
  GraduationCap,
  LayoutTemplate,
  Settings2,
  Upload,
  User,
} from "lucide-react"
import { useMemo, useState } from "react"
import { Link, useLocation } from "react-router-dom"

type NavChild = {
  id: string
  label: string
  path: string
}

type NavItem = {
  id: string
  label: string
  path: string
  icon: typeof Eye
  children?: NavChild[]
}

const navItems: NavItem[] = [
  { id: "portafolio", label: "Ver mi portafolio", icon: Eye, path: "/portafolio" },
  { id: "personal", label: "Datos personales", icon: User, path: "/personal" },
  { id: "red-profesional", label: "Red profesional", icon: Globe, path: "/red-profesional" },
  { id: "proyectos", label: "Proyectos", icon: FolderGit2, path: "/proyectos" },
<<<<<<< HEAD
  {
    id: "habilidades",
    label: "Habilidades",
    icon: Award,
    path: "/habilidades",
    children: [
      { id: "habilidades-ver", label: "Ver habilidades", path: "/habilidades/ver" },
      { id: "habilidades-agregar", label: "Añadir habilidad", path: "/habilidades/añadir" },
      { id: "habilidades-editar", label: "Editar habilidad", path: "/habilidades/editar" },
      { id: "habilidades-eliminar", label: "Eliminar habilidad", path: "/habilidades/eliminar" },
    ],
  },
  {
    id: "experiencia",
    label: "Experiencia",
    icon: Briefcase,
    path: "/experiencia",
    children: [
      { id: "experiencia-ver", label: "Ver experiencia", path: "/experiencia/ver" },
      { id: "experiencia-agregar", label: "Añadir experiencia", path: "/experiencia/agregar" },
      { id: "experiencia-editar", label: "Editar experiencia", path: "/experiencia/editar" },
      { id: "experiencia-eliminar", label: "Eliminar experiencia", path: "/experiencia/eliminar" },
    ],
  },
  {
    id: "formacion-academica",
    label: "Formación Académica",
    icon: GraduationCap,
    path: "/formacion-academica",
    children: [
      { id: "formacion-ver", label: "Ver formación", path: "/formacion-academica/ver" },
      { id: "formacion-agregar", label: "Añadir formación", path: "/formacion-academica/agregar" },
      { id: "formacion-editar", label: "Editar formación", path: "/formacion-academica/editar" },
      { id: "formacion-eliminar", label: "Eliminar formación", path: "/formacion-academica/eliminar" },
    ],
  },
=======
  { id: "habilidades", label: "Habilidades", icon: Award, path: "/habilidades" },
  { id: "formacion-academica", label: "Formación académica", icon: GraduationCap, path: "/formacion-academica" },
  { id: "experiencia", label: "Experiencia", icon: Briefcase, path: "/experiencia" },
  { id: "certificados", label: "Certificados", icon: Award, path: "/certificados" },
>>>>>>> brandon-2doSprint
  { id: "plantillas", label: "Plantillas", icon: LayoutTemplate, path: "/plantillas" },
  { id: "configuracion-visibilidad", label: "Configuración de visibilidad", icon: Settings2, path: "/configuracion-visibilidad" },
  { id: "publicar", label: "Publicar", icon: Upload, path: "/publicar" },
]

function getInitialExpandedSections(pathname: string) {
  return new Set(
    navItems
      .filter((item) => item.children?.length && (pathname === item.path || pathname.startsWith(`${item.path}/`)))
      .map((item) => item.id),
  )
}

const Sidebar = () => {
  const location = useLocation()
<<<<<<< HEAD
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(() => getInitialExpandedSections(location.pathname))
=======
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [skillsOpen, setSkillsOpen] = useState(location.pathname.includes('/habilidades'));
  const [certificatesOpen, setCertificatesOpen] = useState(location.pathname.includes('/certificados'));
>>>>>>> brandon-2doSprint

  function toggleSection(id: string) {
    setExpandedSections((current) => {
      const next = new Set(current)

      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }

      return next
    })
  }

  useEffect(() => {
    setCertificatesOpen(location.pathname.includes('/certificados'))
  }, [location.pathname])

  const sidebarContent = useMemo(
    () => (
      <>
        <div className="-mx-6 mb-6 border-b border-[#c2dbed] px-6 pb-4">
          <h2 className="text-xl font-bold leading-tight text-[#003A6C]">
            Gestionar <br /> Portafolio
          </h2>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
            const isExpanded = expandedSections.has(item.id) || isActive

            if (item.children?.length) {
              return (
                <div key={item.id} className="space-y-1">
                  <button
                    type="button"
                    onClick={() => toggleSection(item.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all ${
                      isActive ? "text-[#003A6C]" : "text-[#4982ad] hover:bg-[#77b6e6]/30"
                    }`}
                    aria-expanded={isExpanded}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    <span className="flex-1 font-medium leading-tight">{item.label}</span>
                    <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </button>

                  {isExpanded ? (
                    <div className="ml-9 flex flex-col gap-1 border-l-2 border-[#c2dbed] pl-2">
                      {item.children.map((child) => {
                        const isChildActive = location.pathname === child.path

                        return (
                          <Link
                            key={child.id}
                            to={child.path}
                            onClick={() => setIsMobileOpen(false)}
                            className={`rounded-lg px-3 py-2 text-sm transition ${
                              isChildActive
                                ? "bg-[#77b6e6]/30 font-semibold text-[#003A6C]"
                                : "text-[#4982ad] hover:text-[#003A6C]"
                            }`}
                          >
                            {child.label}
                          </Link>
                        )
                      })}
                    </div>
                  ) : null}
                </div>
              )
            }

          if (item.id === "certificados") {
            return (
              <div key={item.id} className="space-y-1">
                <button
                  onClick={() => setCertificatesOpen(!certificatesOpen)}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all ${
                    isActive || location.pathname.includes('/certificados')
                      ? "bg-[#003A6C] text-white"
                      : "text-[#4982ad] hover:bg-[#77b6e6]/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    <span className="font-normal">{item.label}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${certificatesOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Submenú de Certificados */}
                {certificatesOpen && (
                  <div className="ml-9 flex flex-col gap-1 border-l-2 border-[#c2dbed] pl-2 animate-in slide-in-from-top-1">
                    <Link to="/certificados/ver" className={`px-3 py-2 text-sm rounded-lg ${location.pathname === '/certificados/ver' ? 'bg-[#77b6e6]/30 text-[#003A6C] font-semibold' : 'text-[#4982ad] hover:text-[#003A6C]'}`}>Ver certificados</Link>
                    <Link to="/certificados/añadir" className={`px-3 py-2 text-sm rounded-lg ${location.pathname === '/certificados/añadir' ? 'bg-[#77b6e6]/30 text-[#003A6C] font-semibold' : 'text-[#4982ad] hover:text-[#003A6C]'}`}>Añadir certificado</Link>
                    <Link to="/certificados/editar" className={`px-3 py-2 text-sm rounded-lg ${location.pathname === '/certificados/editar' ? 'bg-[#77b6e6]/30 text-[#003A6C] font-semibold' : 'text-[#4982ad] hover:text-[#003A6C]'}`}>Editar certificado</Link>
                    <Link to="/certificados/eliminar" className={`px-3 py-2 text-sm rounded-lg ${location.pathname === '/certificados/eliminar' ? 'bg-[#77b6e6]/30 text-[#003A6C] font-semibold' : 'text-[#4982ad] hover:text-[#003A6C]'}`}>Eliminar certificado</Link>
                  </div>
                )}
              </div>
            );
          }

            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 transition-all ${
                  location.pathname === item.path
                    ? "bg-[#003A6C] text-white"
                    : "text-[#4982ad] hover:bg-[#77b6e6]/30"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-normal">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </>
    ),
<<<<<<< HEAD
    [expandedSections, location.pathname],
=======
    [location.pathname, skillsOpen, certificatesOpen],
>>>>>>> brandon-2doSprint
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
          className={`fixed left-0 top-26 z-40 h-[calc(100vh-104px)] w-64 overflow-y-auto border-r-2 border-[#6dacbf] bg-white p-6 transition-transform duration-300 ${
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

      <aside className="hidden min-h-[calc(100vh-64px)] w-64 overflow-y-auto border-r-2 border-[#6dacbf] bg-white p-6 lg:block">
        {sidebarContent}
      </aside>
    </>
  )
}

export default Sidebar
