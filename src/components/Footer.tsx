import { Link, useLocation } from "react-router-dom"

import Logo from "@/assets/logo/LogoPG.png"

export function Footer() {
  const location = useLocation()

  const isDashboard = location.pathname.startsWith("/dashboard") || location.pathname.startsWith("/user")
  const isAdmin = location.pathname.startsWith("/admin")

  const aboutPath = isDashboard ? "/dashboard/about" : isAdmin ? "/admin/about" : "/about"
  const contactPath = isDashboard ? "/dashboard/contact" : isAdmin ? "/admin/contact" : "/contact"

  return (
    <footer
      id="pie-sitio"
      className="mt-auto bg-[linear-gradient(135deg,#003A6C_0%,#4982AD_100%)] text-white"
    >
      <div className="mx-auto w-full max-w-5xl px-5 py-5 sm:px-6 sm:py-6 lg:px-8">
        <div className="grid grid-cols-2 items-start gap-4 text-left sm:gap-6">
          <div className="min-w-0">
            <div className="mb-2.5 flex items-center gap-2 sm:gap-3">
              <img src={Logo} alt="PortfolioGen Logo" className="size-8 rounded-lg bg-white/90 p-1" />
              <h3 className="text-base font-bold text-white">PortfolioGen</h3>
            </div>
            <p className="max-w-md text-xs leading-5 text-[#C2DBED] sm:text-sm sm:leading-6">
              Sistema web generador de portafolios digitales de proyectos de software.
              Crea, gestiona y comparte tu experiencia profesional.
            </p>
          </div>

          <div className="min-w-0 justify-self-end text-right sm:text-left">
            <h3 id="pie-enlaces-titulo" className="mb-2.5 text-base font-bold text-white">
              Más
            </h3>
            <ul aria-labelledby="pie-enlaces-titulo" className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to={aboutPath} className="text-[#C2DBED] transition-colors hover:text-white">
                  Sobre la plataforma
                </Link>
              </li>
              <li>
                <Link to={contactPath} className="text-[#C2DBED] transition-colors hover:text-white">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-5 border-t border-[#4982AD] pt-4 text-center text-xs leading-5 text-[#C2DBED] sm:text-sm">
          <p>
            &copy; {new Date().getFullYear()}{" "}
            <span className="font-semibold text-white">Sprintec Software Solution SRL</span>. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
