import { Link, useLocation } from "react-router-dom"
import { Mail, Phone } from "lucide-react"

import Logo from "@/assets/logo/LogoPG.png"
import { Card, CardContent } from "@/components/ui/card"

export function Footer() {
  const location = useLocation()

  const isDashboard = location.pathname.startsWith("/dashboard")
  const isAdmin = location.pathname.startsWith("/admin")

  const aboutPath = isDashboard ? "/dashboard/about" : isAdmin ? "/admin/about" : "/about"
  const contactPath = isDashboard ? "/dashboard/contact" : isAdmin ? "/admin/contact" : "/contact"

  return (
    <footer
      id="pie-sitio"
      className="mt-auto border-t border-white/10 bg-[linear-gradient(135deg,#003A6C_0%,#4982AD_100%)] text-white"
    >
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.8fr)_minmax(0,1fr)] lg:gap-6">
          <Card className="border-white/15 bg-white/8 shadow-xl backdrop-blur-sm">
            <CardContent className="space-y-4 p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <img
                  src={Logo}
                  alt="PortfolioGen"
                  className="size-10 rounded-xl border border-white/15 bg-white/90 p-1 sm:size-11"
                />
                <div>
                  <p className="text-lg font-semibold tracking-tight text-white">PortfolioGen</p>
                  <p className="text-sm text-[#C2DBED]">Portafolios digitales para software</p>
                </div>
              </div>
              <p className="max-w-md text-sm leading-6 text-[#E3EEF7]">
                Sistema web para crear, gestionar y compartir experiencia profesional, proyectos y habilidades
                en un solo lugar.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
            <h3 id="pie-enlaces-titulo" className="text-sm font-semibold uppercase tracking-[0.24em] text-[#003A6C]">
              Mas
            </h3>
            <nav aria-labelledby="pie-enlaces-titulo" className="space-y-3 text-sm">
              <Link to={aboutPath} className="block text-[#EAF4FB] transition hover:text-white">
                Sobre la plataforma
              </Link>
              <Link to={contactPath} className="block text-[#EAF4FB] transition hover:text-white">
                Contacto
              </Link>
            </nav>
          </div>

          <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
            <h3 id="pie-empresa-titulo" className="text-sm font-semibold uppercase tracking-[0.24em] text-[#C2DBED]">
              Empresa
            </h3>
            <div aria-labelledby="pie-empresa-titulo" className="space-y-4 text-sm text-[#EAF4FB]">
              <p className="font-semibold text-white">Sprintec Software Solution SRL</p>
              <a
                href="mailto:sprintecsoftwaresolution@gmail.com"
                aria-label="Enviar correo a sprintecsoftwaresolution@gmail.com"
                className="flex items-start gap-3 transition hover:text-white"
              >
                <Mail className="mt-0.5 size-4 shrink-0 text-[#77B6E6]" />
                <span className="break-all">sprintecsoftwaresolution@gmail.com</span>
              </a>
              <div className="flex items-start gap-3" aria-label="Teléfono de contacto (+591) 71491159">
                <Phone className="mt-0.5 size-4 shrink-0 text-[#77B6E6]" />
                <span>(+591) 71491159</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-white/10 pt-5 text-center text-sm text-[#C2DBED] sm:mt-8 sm:gap-3 sm:pt-6 md:flex-row md:items-center md:justify-between md:text-left">
          <p className="text-balance">
            &copy; {new Date().getFullYear()} <span className="font-semibold text-white">Sprintec Software Solution SRL</span>.
            {" "}Todos los derechos reservados.
          </p>
          <p className="text-[#9FD0F4]">Desarrollado para impulsar tu carrera profesional</p>
        </div>
      </div>
    </footer>
  )
}
