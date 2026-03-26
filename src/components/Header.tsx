import { Button } from "@/components/ui/button"
import Logo from "@/assets/logo/LogoPG.png"
import { House } from "lucide-react"

export function Header() {
  return (
    <header className="w-full bg-[#003A6C] px-6 py-4 flex items-center justify-between text-white shadow-md">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src={Logo} alt="logo" className="size-8 rounded-md"/>
        <span className="text-xl font-bold tracking-tight">PortfolioGen</span>
      </div>

      {/* Navegación y Acciones */}
      <nav className="flex justify-center items-center gap-96">
        <a href="#" className="flex items-center gap-2 text-sm font-medium hover:text-[#C2DBED] transition-colors">
             <House className="w-4 h-4" />
          Inicio
        </a>
        <div className="flex items-center gap-3 ml-4">
          <Button variant="ghost" className="text-white hover:bg-[#4982AD] hover:text-[#003A6C]">
            Iniciar sesión
          </Button>
          <Button className="bg-[#C4A57C] text-[#003A6C] hover:bg-[#F7F0E1] font-semibold">
            Registrarse
          </Button>
        </div>
      </nav>
    </header>
  )
}