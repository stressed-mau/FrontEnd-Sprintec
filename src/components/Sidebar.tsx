import { Award, Briefcase, FolderGit2, Globe, User, Upload } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { id: "personal", label: "Datos personales", icon: User, path: "/personal" },
    { id: "red-profesional", label: "Red profesional", icon: Globe, path: "/red-profesional" },
    { id: "proyectos", label: "Proyectos", icon: FolderGit2, path: "/proyectos" },
    { id: "habilidades", label: "Habilidades", icon: Award, path: "/habilidades" },
    { id: "experiencia", label: "Experiencia", icon: Briefcase, path: "/experiencia" },
    { id: "publicar", label: "Publicar", icon: Upload, path: "/publicar" },
  ];

  return (
    <>
      {/* --- VISTA MÓVIL (LOS CUADRITOS) --- */}
      {/* Se muestra solo en pantallas pequeñas (block md:hidden) */}
      <div className="block lg:hidden w-full p-4">
        <section className="bg-white border-2 border-[#6dacbf] rounded-2xl p-6 shadow-sm">
          <h2 className="text-[#003A6C] font-bold text-xl mb-6">Gestionar portafolio</h2>
          <div className="grid grid-cols-2 gap-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center h-28 md:h-20 p-4 border rounded-2xl  transition-transform active:scale-95 ${
                  location.pathname === item.path
                    ? "bg-[#003A6C] text-white border-[#003A6C]"
                    : "bg-[#F7F0E1]/50 border-[#c2dbed]"
                }`}
              >
                <item.icon
                  className={`w-8 h-8 mb-3 ${
                    location.pathname === item.path
                      ? "text-white"
                      : "text-[#4982ad]"
                  }`}
                />
                                <span
                  className={`text-xs text-center font-semibold leading-tight ${
                    location.pathname === item.path
                      ? "text-white"
                      : "text-[#4982ad]"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* --- VISTA ESCRITORIO (BARRA LATERAL) --- */}
      {/* Se oculta en móvil y aparece en md (hidden md:block) */}
      <aside className="hidden lg:block w-64 bg-white border-r-2 border-[#6dacbf] min-h-[calc(100vh-64px)] p-6">
        <div className="mb-6 pb-4 -mx-6 px-6 border-b border-[#c2dbed]">
          <h2 className="text-[#003A6C] font-bold text-xl leading-tight">
            Gestionar <br /> Portafolio
          </h2>
          <p className="text-[#4982ad] text-sm">Google User</p>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${
                location.pathname === item.path 
                  ? "bg-[#003A6C] text-white" 
                  : "text-[#4982ad] hover:bg-[#77b6e6]/30"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-normal">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
