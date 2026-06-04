import { ChevronLeft,ChevronRight, X} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { USER_GUIDE_OPEN_SIDEBAR_EVENT, USER_GUIDE_RESTORE_SIDEBAR_EVENT } from "@/components/UserGuide";
import { sidebarNavigation } from "@/routes/navigation/sidebar-navigation";


const normalizePath = (path: string) => {
  try {
    return decodeURIComponent(path).replace(/\/+$/, "");
  } catch {
    return path.replace(/\/+$/, "");
  }
};

const Sidebar = () => {
  const location = useLocation();
  const currentPath = normalizePath(location.pathname);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const guidePreviousSidebarStateRef = useRef<{ isDesktopCollapsed: boolean; isMobileOpen: boolean } | null>(null);
  const activeSectionId = useMemo(
    () =>
      sidebarNavigation.find((item) => {
        if (!item.children?.length) return false;

        const itemPath = normalizePath(item.path);
        const hasActiveChild = item.children.some((child) => {
          const childPath = normalizePath(child.path);
          return currentPath === childPath || currentPath.startsWith(`${childPath}/`);
        });

        return currentPath.startsWith(itemPath) || hasActiveChild;
      })?.id ?? null,
    [currentPath]
  );
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>(activeSectionId);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    setExpandedSectionId(activeSectionId);
  }, [activeSectionId]);

  useEffect(() => {
    if (location.pathname === "/explore") {
      setIsDesktopCollapsed(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    const openSidebarForGuide = () => {
      if (!guidePreviousSidebarStateRef.current) {
        guidePreviousSidebarStateRef.current = { isDesktopCollapsed, isMobileOpen };
      }
      setIsMobileOpen(true);
      setIsDesktopCollapsed(false);
    };

    const restoreSidebarAfterGuide = () => {
      const previousState = guidePreviousSidebarStateRef.current;

      if (!previousState) return;

      setIsMobileOpen(previousState.isMobileOpen);
      setIsDesktopCollapsed(previousState.isDesktopCollapsed);
      guidePreviousSidebarStateRef.current = null;
    };

    window.addEventListener(USER_GUIDE_OPEN_SIDEBAR_EVENT, openSidebarForGuide);
    window.addEventListener(USER_GUIDE_RESTORE_SIDEBAR_EVENT, restoreSidebarAfterGuide);

    return () => {
      window.removeEventListener(USER_GUIDE_OPEN_SIDEBAR_EVENT, openSidebarForGuide);
      window.removeEventListener(USER_GUIDE_RESTORE_SIDEBAR_EVENT, restoreSidebarAfterGuide);
    };
  }, [isDesktopCollapsed, isMobileOpen]);

  const toggleSection = (id: string) => {
    setExpandedSectionId((current) => (current === id ? null : id));
  };

  const renderSidebarContent = (isCollapsed = false) => (
    <div className="flex h-full flex-col">
      <div className={`mb-6 flex items-center border-b border-[#c2dbed] pb-4 ${isCollapsed ? "justify-center" : "justify-between"}`}>
        {isCollapsed ? (
          <button
            type="button"
            onClick={() => setIsDesktopCollapsed(false)}
            className="rounded-xl p-2 text-[#003A6C] transition hover:bg-[#77b6e6]/10"
            aria-label="Mostrar sidebar"
            title="Mostrar sidebar"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        ) : (
          <>
            <h2 className="text-xl font-bold leading-tight text-[#003A6C]">
              Gestionar <br /> Portafolio
            </h2>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsDesktopCollapsed(true)}
                className="hidden rounded-xl p-2 text-[#003A6C] transition hover:bg-[#77b6e6]/10 lg:inline-flex"
                aria-label="Ocultar sidebar"
                title="Ocultar sidebar"
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

      <nav className={`custom-scrollbar flex-1 space-y-1 overflow-y-auto overflow-x-hidden ${isCollapsed ? "" : "pr-2"}`}>
        {sidebarNavigation.map((item) => {
          const itemPath = normalizePath(item.path);
          const hasChildren = Boolean(item.children?.length);
          const hasActiveChild = Boolean(
            item.children?.some((child) => {
              const childPath = normalizePath(child.path);
              return currentPath === childPath || currentPath.startsWith(`${childPath}/`);
            })
          );
          const isParentActive = currentPath.startsWith(itemPath) || hasActiveChild;
          const isExpanded = expandedSectionId === item.id;

          if (isCollapsed) {
            return (
              <Link
                key={item.id}
                to={item.path}
                title={item.label}
                className={`flex w-full items-center justify-center rounded-xl px-3 py-3 transition-all ${
                  isParentActive ? "bg-[#003A6C] text-white" : "text-[#4982ad] hover:bg-[#77b6e6]/10"
                }`}
              >
                <item.icon className="h-5 w-5 shrink-0" />
              </Link>
            );
          }

          return (
            <div key={item.id} className="space-y-1">
              {hasChildren ? (
                <button
                  id={`guide-nav-${item.id}`}
                  onClick={() => toggleSection(item.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-3 transition-all ${
                    isParentActive ? "bg-[#003A6C] text-white" : "text-[#4982ad] hover:bg-[#77b6e6]/10"
                  }`}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <item.icon className="h-5 w-5 shrink-0" />
                    <span className="min-w-0 truncate text-left text-[15px] font-medium leading-5">{item.label}</span>
                  </div>
                  <ChevronRight className={`h-4 w-4 shrink-0 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                </button>
              ) : (
                <Link
                  id={`guide-nav-${item.id}`}
                  to={item.path}
                  className={`flex w-full items-center gap-2 rounded-xl px-3 py-3 transition-all ${
                    location.pathname === item.path ? "bg-[#003A6C] text-white" : "text-[#4982ad] hover:bg-[#77b6e6]/10"
                  }`}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span className="min-w-0 truncate text-[15px] font-medium">{item.label}</span>
                </Link>
              )}

              {hasChildren && isExpanded && (
                <div className="ml-4 mt-1 space-y-1 border-l-2 border-[#c2dbed] pl-2">
                  {item.children?.map((child) => {
                    const childPath = normalizePath(child.path);
                    const isChildActive = currentPath === childPath || currentPath.startsWith(`${childPath}/`);

                    return (
                      <Link
                        key={child.id}
                        to={child.path}
                        title={child.label}
                        className={`block min-w-0 truncate whitespace-nowrap rounded-xl px-3 py-2 text-sm transition-all ${
                          isChildActive
                            ? "bg-[#6dacbf] text-white shadow-sm"
                            : "text-[#4982ad] hover:bg-[#77b6e6]/10"
                        }`}
                      >
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      <section className="lg:hidden">
        {!isMobileOpen && (
          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            className="fixed left-0 top-[30%] z-40 flex items-center justify-center rounded-r-2xl border border-l-0 border-white/10 bg-[#003A6C] p-3 text-white shadow-lg"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}

        {isMobileOpen && (
          <div
            className="fixed inset-0 z-60 bg-black/30 backdrop-blur-[2px]"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        <aside
          className={`fixed left-0 top-0 z-70 h-full w-280px bg-white p-6 shadow-2xl transition-transform duration-300 ease-in-out ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {renderSidebarContent(false)}
        </aside>
      </section>

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

export default Sidebar;
