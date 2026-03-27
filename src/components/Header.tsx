import Logo from "@/assets/logo/LogoPG.png"
import { Button } from "@/components/ui/button"
import { House } from "lucide-react"
import { Link } from "react-router-dom"

export function Header() {
  return (
    <header className="flex w-full items-center justify-between bg-[#003A6C] px-6 py-4 text-white shadow-md">
      <Link to="/" className="flex items-center gap-2">
        <img src={Logo} alt="logo" className="size-8 rounded-md" />
        <span className="text-xl font-bold tracking-tight">PortfolioGen</span>
      </Link>

      <nav className="flex items-center justify-center gap-96">
        <Link to="/" className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-[#C2DBED]">
          <House className="h-4 w-4" />
          Inicio
        </Link>
        <div className="ml-4 flex items-center gap-3">
          <Button asChild variant="ghost" className="text-white hover:bg-[#4982AD] hover:text-[#003A6C]">
            <Link to="/login">Iniciar sesión</Link>
          </Button>
          <Button className="bg-[#C4A57C] font-semibold text-[#003A6C] hover:bg-[#F7F0E1]">
            <Link to="/register">Registrarse</Link>
          </Button>
        </div>
      </nav>
    </header>
  )
}
