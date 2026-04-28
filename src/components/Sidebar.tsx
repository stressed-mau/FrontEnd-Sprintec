import {
  Award,
  Briefcase,
  ChevronRight,
  Eye,
  FolderGit2,
  Globe,
  GraduationCap,
  LayoutTemplate,
  Settings2,
  Upload,
  User,
  X
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

type NavChild = {
  id: string;
  label: string;
  path: string;
};

type NavItem = {
  id: string;
  label: string;
  path: string;
  icon: any;
  children?: NavChild[];
};

const navItems: NavItem[] = [
  { id: "portafolio", label: "Ver mi portafolio", icon: Eye, path: "/portafolio" },
  { 
    id: "personal", 
    label: "Datos personales", 
    icon: User, 
    path: "/personal",
    children: [
      { id: "personal-ver", label: "Ver datos personales", path: "/personal/ver" },
      { id: "personal-editar", label: "Editar datos personales", path: "/personal/editar" }
    ]
  },
  { id: "red-profesional", label: "Red profesional", icon: Globe, path: "/red-profesional" },
  {
    id: "proyectos",
    label: "Proyectos",
    icon: FolderGit2,
    path: "/proyectos",
    children: [
      { id: "proyectos-ver", label: "Ver proyectos", path: "/proyectos/ver" },
      { id: "proyectos-agregar", label: "Añadir proyecto", path: "/proyectos/añadir" },
      { id: "proyectos-editar", label: "Editar proyecto", path: "/proyectos/editar" },
      { id: "proyectos-eliminar", label: "Eliminar proyecto", path: "/proyectos/eliminar" },
    ],
  },
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
  {
    id: "certificados",
    label: "Certificados",
    icon: Award,
    path: "/certificados",
    children: [
      { id: "certificados-ver", label: "Ver certificados", path: "/certificados/ver" },
      { id: "certificados-agregar", label: "Añadir certificado", path: "/certificados/añadir" },
      { id: "certificados-editar", label: "Editar certificado", path: "/certificados/editar" },
      { id: "certificados-eliminar", label: "Eliminar certificado", path: "/certificados/eliminar" },
    ],
  },
  { id: "plantillas", label: "Plantillas", icon: LayoutTemplate, path: "/plantillas" },
  { id: "configuracion-visibilidad", label: "Configuración de visibilidad", icon: Settings2, path: "/configuracion-visibilidad" },
  { id: "publicar", label: "Publicar", icon: Upload, path: "/publicar" },
];

const Sidebar = () => {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  // Estado para controlar qué sección está expandida
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["personal"]));

  // Cerrar menú móvil al navegar
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const toggleSection = (id: string) => {
    setExpandedSections((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const sidebarContent = useMemo(() => (
    <div className="flex flex-col h-full">
      {/* Cabecera */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#c2dbed]">
        <h2 className="text-[#003A6C] font-bold text-xl leading-tight">
          Gestionar <br /> Portafolio
        </h2>
        <button onClick={() => setIsMobileOpen(false)} className="lg:hidden text-[#003A6C] p-1">
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="space-y-1 overflow-y-auto flex-1 pr-2 custom-scrollbar">
        {navItems.map((item) => {
          const isParentActive = location.pathname.startsWith(item.path);
          const hasChildren = item.children && item.children.length > 0;
          const isExpanded = expandedSections.has(item.id);

          return (
            <div key={item.id} className="space-y-1">
              {hasChildren ? (
                <button
                  onClick={() => toggleSection(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all ${
                    isParentActive ? "bg-[#003A6C] text-white" : "text-[#4982ad] hover:bg-[#77b6e6]/10"
                  }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium text-[15px] truncate">{item.label}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                </button>
              ) : (
                <Link
                  to={item.path}
                  className={`w-full flex items-center gap-2 px-3 py-3 rounded-xl transition-all ${
                    location.pathname === item.path ? "bg-[#003A6C] text-white" : "text-[#4982ad] hover:bg-[#77b6e6]/10"
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium text-[15px]">{item.label}</span>
                </Link>
              )}

              {/* Submenú Renderizado */}
              {hasChildren && isExpanded && (
                <div className="ml-4 space-y-1 mt-1 border-l-2 border-[#c2dbed] pl-2">
                  {item.children?.map((child) => (
                    <Link
                      key={child.id}
                      to={child.path}
                      className={`block px-4 py-2 text-sm rounded-xl transition-all ${
                        location.pathname === child.path 
                          ? "bg-[#6dacbf] text-white shadow-sm" 
                          : "text-[#4982ad] hover:bg-[#77b6e6]/10"
                      }`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  ), [location.pathname, expandedSections]);

  return (
    <>
      {/* Mobile Trigger */}
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

        {isMobileOpen && (
          <div 
            className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-[2px]"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        <aside
          className={`fixed left-0 top-0 z-[70] h-full w-[280px] bg-white p-6 shadow-2xl transition-transform duration-300 ease-in-out ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {sidebarContent}
        </aside>
      </section>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-white border-r-2 border-[#6dacbf] min-h-screen p-6 sticky top-0">
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
