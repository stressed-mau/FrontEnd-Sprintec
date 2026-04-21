import { useState } from "react"
import { Link } from "react-router-dom"
import { House, Menu, X, Search } from "lucide-react"
import Logo from "@/assets/logo/LogoPG.png"
import { Button } from "@/components/ui/button"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#4982AD]/20 bg-[#003A6C] px-6 py-4 text-white shadow-md">
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4">
        
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
          <img src={Logo} alt="logo" className="size-8 rounded-md" />
          <span className="text-xl font-bold tracking-tight">PortfolioGen</span>
        </Link>

        <nav className="hidden md:flex justify-center gap-8">
          <Link to="/" className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-[#C2DBED]">
            <House className="h-4 w-4" /> Inicio
          </Link>
          <Link to="/explore" className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-[#C2DBED]">
            <Search className="h-4 w-4" /> Explorar portafolios
          </Link>
        </nav>

        <div className="flex items-center justify-end gap-3">
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" className="text-white hover:bg-[#4982AD] hover:text-white"> Iniciar sesión </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-[#C4A57C] font-bold text-[#003A6C] hover:bg-[#F7F0E1]"> Registrarse  </Button>
            </Link>
          </div>

          <button onClick={toggleMenu} className="flex md:hidden p-2 text-white">
            {isMenuOpen ? <X className="size-7" /> : <Menu className="size-7" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="absolute right-4 top-full z-50 mt-2 flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-4 rounded-xl border border-[#4982AD] bg-[#003A6C] p-6 shadow-2xl md:hidden">
          <Link to="/" onClick={toggleMenu} className="flex items-center justify-end gap-3 text-lg font-medium"><House className="size-5"/> Inicio</Link>
          <Link to="/explore" onClick={toggleMenu} className="flex items-center justify-end gap-3 text-lg font-medium"><Search className="size-5"/> Explorar</Link>
          <div className="h-px bg-[#4982AD] w-full my-2" />

          <div className="flex flex-col gap-4">
            <Link to="/login" onClick={toggleMenu}><Button variant="outline" className="w-full border-[#C2DBED] text-white bg-transparent py-6">Iniciar sesión</Button></Link>
            <Link to="/register" onClick={toggleMenu}><Button className="w-full bg-[#C4A57C] font-bold text-[#003A6C] py-6">Registrarse</Button></Link>
          </div>
        </div>
      )}
    </header>
  )
}