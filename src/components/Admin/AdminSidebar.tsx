import {
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

type NavItem = {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
};

const adminNavItems: NavItem[] = [
  { id: "usuarios", label: "Reporte de Usuarios", icon: Users, path: "/admin/usuarios" },
  { id: "certificados", label: "Reporte de Certificados", icon: BadgeCheck, path: "/admin/certificados" },
];

const normalizePath = (path: string) => {
  try {
    return decodeURIComponent(path).replace(/\/+$/, "");
  } catch {
    return path.replace(/\/+$/, "");
  }
};

const AdminSideBar = () => {
  const location = useLocation();
  const currentPath = normalizePath(location.pathname);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const renderSidebarContent = (isCollapsed = false) => (
    <div className="flex h-full flex-col">
      {/* Header del Sidebar - Estilo Panel Admin */}
      <div className={`mb-6 flex items-center border-b border-[#c2dbed] pb-4 ${isCollapsed ? "justify-center" : "justify-between"}`}>
        {isCollapsed ? (
          <button
            type="button"
            onClick={() => setIsDesktopCollapsed(false)}
            className="rounded-xl p-2 text-[#003A6C] transition hover:bg-[#77b6e6]/10"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        ) : (
          <>
            <div>
              <h2 className="text-xl font-bold leading-tight text-[#003A6C]">
                Panel Admin
              </h2>
              <p className="text-sm font-medium text-[#4982ad]">Administrador</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsDesktopCollapsed(true)}
                className="hidden rounded-xl p-2 text-[#003A6C] transition hover:bg-[#77b6e6]/10 lg:inline-flex"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button onClick={() => setIsMobileOpen(false)} className="p-1 text-[#003A6C] lg:hidden">
                <X className="h-6 w-6" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Navegación */}
      <nav className={`custom-scrollbar flex-1 space-y-2 overflow-y-auto overflow-x-hidden ${isCollapsed ? "" : "pr-2"}`}>
        {adminNavItems.map((item) => {
          const isActive = currentPath === normalizePath(item.path);

          return (
            <Link
              key={item.id}
              to={item.path}
              title={isCollapsed ? item.label : ""}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                isActive 
                  ? "bg-[#003A6C] text-white shadow-md" 
                  : "text-[#4982ad] hover:bg-[#77b6e6]/10"
              } ${isCollapsed ? "justify-center" : ""}`}
            >
              <item.icon className={`${isCollapsed ? "h-6 w-6" : "h-5 w-5"} shrink-0`} />
              {!isCollapsed && (
                <span className="min-w-0 truncate text-[15px] font-semibold">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Versión Mobile */}
      <section className="lg:hidden">
        {!isMobileOpen && (
          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            className="fixed left-0 top-[30%] z-40 flex items-center justify-center rounded-r-2xl bg-[#003A6C] p-3 text-white shadow-lg"
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
          {renderSidebarContent(false)}
        </aside>
      </section>

      {/* Versión Desktop */}
      <aside
        className={`sticky top-0 hidden min-h-screen shrink-0 border-r-2 border-[#6dacbf] bg-white p-6 transition-[width] duration-300 lg:block ${
          isDesktopCollapsed ? "w-20" : "w-72"
        }`}
      >
        {renderSidebarContent(isDesktopCollapsed)}
      </aside>
    </>
  );
};

export default AdminSideBar;
