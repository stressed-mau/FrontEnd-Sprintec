import { Award, Briefcase, FolderGit2, Globe, Upload, User } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"

import { getAuthSession } from "@/services/auth"

const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const user = getAuthSession()?.user

  const navItems = [
    { id: "personal", label: "Datos personales", icon: User, path: "/personal" },
    { id: "red-profesional", label: "Red profesional", icon: Globe, path: "/red-profesional" },
    { id: "proyectos", label: "Proyectos", icon: FolderGit2, path: "/proyectos" },
    { id: "habilidades", label: "Habilidades", icon: Award, path: "/habilidades" },
    { id: "experiencia", label: "Experiencia", icon: Briefcase, path: "/experiencia" },
    { id: "publicar", label: "Publicar", icon: Upload, path: "/publicar" },
  ]

  return (
    <>
      <div className="block w-full p-4 lg:hidden">
        <section className="rounded-2xl border-2 border-[#6dacbf] bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-[#003A6C]">Gestionar portafolio</h2>
          <div className="grid grid-cols-2 gap-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`flex h-28 flex-col items-center justify-center rounded-2xl border p-4 transition-transform active:scale-95 md:h-20 ${
                  location.pathname === item.path
                    ? "border-[#003A6C] bg-[#003A6C] text-white"
                    : "border-[#c2dbed] bg-[#F7F0E1]/50"
                }`}
              >
                <item.icon
                  className={`mb-3 h-8 w-8 ${location.pathname === item.path ? "text-white" : "text-[#4982ad]"}`}
                />
                <span
                  className={`text-center text-xs font-semibold leading-tight ${
                    location.pathname === item.path ? "text-white" : "text-[#4982ad]"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>

      <aside className="hidden min-h-[calc(100vh-64px)] w-64 border-r-2 border-[#6dacbf] bg-white p-6 lg:block">
        <div className="-mx-6 mb-6 border-b border-[#c2dbed] px-6 pb-4">
          <h2 className="text-xl font-bold leading-tight text-[#003A6C]">
            Gestionar <br /> Portafolio
          </h2>
          <p className="text-sm text-[#4982ad]">{user?.username || "Usuario"}</p>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 transition-all ${
                location.pathname === item.path ? "bg-[#003A6C] text-white" : "text-[#4982ad] hover:bg-[#77b6e6]/30"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-normal">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
