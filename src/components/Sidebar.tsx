import { Award, Briefcase, ChevronDown, ChevronLeft, ChevronRight, Eye, FolderGit2, Globe, LayoutTemplate, Settings2, Upload, User, GraduationCap, X, Home, Search } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Link, useLocation } from "react-router-dom"

const Sidebar = () => {
  const location = useLocation()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  
  // Usamos el ID del item directamente para saber cuál está abierto
  const [openMenuId, setOpenMenuId] = useState<string | null>("personal");
 
  useEffect(() => {
    setIsMobileOpen(false)
  }, [location.pathname])

  const navItems = [
    { id: "portafolio", label: "Ver Portafolio", icon: Eye, path: "/portafolio" },
    { 
      id: "personal", 
      label: "Datos personales", 
      icon: User, 
      hasSubmenu: true,
      subItems: [
        { label: "Ver datos personales", path: "/personal/ver" },
        { label: "Editar datos personales", path: "/personal/editar" }
      ]
    },
    { id: "proyectos", label: "Proyectos", icon: FolderGit2, path: "/proyectos", hasSubmenu: true, subItems: [] },
    { id: "habilidades", label: "Habilidades", icon: Award, path: "/habilidades", hasSubmenu: true, subItems: [] },
    { id: "experiencia", label: "Experiencia", icon: Briefcase, path: "/experiencia", hasSubmenu: true, subItems: [] },
    { id: "formacion-academica", label: "Formación académica", icon: GraduationCap, path: "/formacion-academica", hasSubmenu: true, subItems: [] },
    { id: "certificados", label: "Certificados", icon: Award, path: "/certificados", hasSubmenu: true, subItems: [] },
    { id: "redes", label: "Redes", icon: Globe, path: "/redes" },
    { id: "plantillas", label: "Plantillas", icon: LayoutTemplate, path: "/plantillas" },
    { id: "configuracion-visibilidad", label: "Configuración de Visibilidad", icon: Settings2, path: "/configuracion-visibilidad" },
    { id: "publicar", label: "Publicar", icon: Upload, path: "/publicar" },
  ]

  const sidebarContent = useMemo(() => (
    <div className="flex flex-col h-full">
      {/* Cabecera del Sidebar */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#c2dbed]">
        <h2 className="text-[#003A6C] font-bold text-xl leading-tight">
          Gestionar <br /> portafolio
        </h2>
        <button onClick={() => setIsMobileOpen(false)} className="lg:hidden text-[#003A6C] p-1">
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="space-y-1 overflow-y-auto flex-1 pr-2 custom-scrollbar">
        {navItems.map((item) => {
          const isSubItemActive = item.subItems?.some(sub => location.pathname === sub.path);
          const isActive = (item.path && location.pathname.startsWith(item.path)) || isSubItemActive;
          const isOpen = openMenuId === item.id

          return (
            <div key={item.id} className="space-y-1">
              {item.hasSubmenu ? (
                <button
                  onClick={() => setOpenMenuId(isOpen ? null : item.id)}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all flex-nowrap whitespace-nowrap ${
                    isActive ? "bg-[#003A6C] text-white" : "text-[#4982ad] hover:bg-[#77b6e6]/10"
                  }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium text-[15px] truncate">{item.label}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                </button>
              ) : (
                // Los items sin submenú siguen usando Link normalmente
                <Link
                  to={item.path || "#"}
                  className={`w-full flex items-center gap-2 px-3 py-3 rounded-xl transition-all whitespace-nowrap ${
                    isActive ? "bg-[#003A6C] text-white" : "text-[#4982ad] hover:bg-[#77b6e6]/10"
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium text-[15px]">{item.label}</span>
                </Link>
              )}
                    {item.hasSubmenu && isOpen && (
                <div className="ml-4 space-y-1 mt-1">
                  {item.subItems?.map((subItem) => (
                    <Link
                      key={subItem.path}
                      to={subItem.path}
                      className={`block px-4 py-2.5 text-sm rounded-xl transition-all whitespace-nowrap ${
                        location.pathname === subItem.path 
                          ? "bg-[#6dacbf] text-white shadow-sm" 
                          : "text-[#4982ad] hover:bg-[#77b6e6]/10"
                      }`}
                    >
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </div>
  ), [location.pathname, openMenuId])

  return (
    <>
      {/* Botón flotante lateral (Imagen 1) */}
      <section className="lg:hidden">
        {!isMobileOpen && (
          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            className="fixed left-0 top-[30%] z-40 bg-[#003A6C] text-white p-3 rounded-r-2xl shadow-lg flex items-center justify-center border border-l-0 border-white/10"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}

        {/* Fondo oscuro cuando el menú está abierto */}
        {isMobileOpen && (
          <div 
            className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-[2px]"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* Sidebar Móvil (Imagen 2) */}
        <aside
          className={`fixed left-0 top-0 z-[70] h-full w-[280px] bg-white p-6 shadow-2xl transition-transform duration-300 ease-in-out ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {sidebarContent}
        </aside>
      </section>

      {/* Sidebar Escritorio */}
      <aside className="hidden lg:block w-64 bg-white border-r-2 border-[#6dacbf] min-h-screen p-6 sticky top-0">
        {sidebarContent}
      </aside>
    </>
  )
}

export default Sidebar