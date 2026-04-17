import { Link, useLocation } from "react-router-dom"

import Logo from "@/assets/logo/LogoPG.png"
import { Card, CardContent } from "@/components/ui/card"

export function Footer() {
  const location = useLocation()

  const isDashboard = location.pathname.startsWith("/dashboard") || location.pathname.startsWith("/user")
  const isAdmin = location.pathname.startsWith("/admin")

  const aboutPath = isDashboard ? "/dashboard/about" : isAdmin ? "/admin/about" : "/about"
  const contactPath = isDashboard ? "/dashboard/contact" : isAdmin ? "/admin/contact" : "/contact"

  return (
    <footer
      id="pie-sitio"
      className="mt-auto border-t border-white/10 bg-[linear-gradient(135deg,#003A6C_0%,#4982AD_100%)] text-white"
    >
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-4">
        <div className="grid gap-2 sm:gap-2.5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)] lg:gap-3">
          <Card className="border-white/15 bg-white/8 shadow-xl backdrop-blur-sm">
            <CardContent className="p-2.5 sm:p-3">
              <div className="flex items-center gap-2">
                <img
                  src={Logo}
                  alt="PortfolioGen"
                  className="size-7 rounded-lg border border-white/15 bg-white/90 p-1 sm:size-8"
                />
                <div>
                  <p className="text-sm font-semibold tracking-tight text-white">PortfolioGen</p>
                  <p className="text-xs text-[#C2DBED]">Portafolios digitales para software</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-1.5 rounded-2xl border border-white/10 bg-white/5 p-2.5 sm:p-3">
            <h3 id="pie-enlaces-titulo" className="text-xs font-semibold uppercase tracking-[0.24em] text-white">
              Más
            </h3>
            <nav aria-labelledby="pie-enlaces-titulo" className="space-y-1 text-xs sm:text-sm">
              <Link to={aboutPath} className="block text-[#EAF4FB] transition hover:text-white">
                Sobre la plataforma
              </Link>
              <Link to={contactPath} className="block text-[#EAF4FB] transition hover:text-white">
                Contacto
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-2.5 border-t border-white/10 pt-2.5 text-center text-xs text-[#C2DBED] sm:mt-3 sm:pt-3">
          <p className="text-balance text-center">
            &copy; {new Date().getFullYear()} <span className="font-semibold text-white">Sprintec Software Solution SRL</span>.
            {" "}Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
