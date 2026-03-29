import { Link } from "react-router-dom"
import { House, Menu, Search } from "lucide-react"
import Logo from "@/assets/logo/LogoPG.png"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[#003A6C] px-6 py-4 text-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
          <img src={Logo} alt="logo" className="size-8 rounded-md" />
          <span className="text-xl font-bold tracking-tight">PortfolioGen</span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-[#C2DBED]">
              <House className="h-4 w-4" />
              Inicio
            </Link>
            <Link to="/explorar" className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-[#C2DBED]">
              <Search className="h-4 w-4" />
              Explorar portafolios
            </Link>
          </div>

          <div className="flex items-center gap-3 border-l border-[#4982AD] pl-6">
            <Button asChild variant="ghost" className="text-white hover:bg-[#4982AD] hover:text-white">
              <Link to="/login">Iniciar sesión</Link>
            </Button>
            <Button asChild className="bg-[#C4A57C] font-bold text-[#003A6C] hover:bg-[#F7F0E1]">
              <Link to="/register">Registrarse</Link>
            </Button>
          </div>
        </nav>

        {/* MOBILE NAV (Hamburguesa) */}
        <div className="flex md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-[#4982AD]">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#003A6C] text-white border-[#4982AD]">
              <SheetTitle className="text-white border-b border-[#4982AD] pb-4">Menú</SheetTitle>
              <div className="mt-8 flex flex-col gap-6">
                <Link to="/" className="flex items-center gap-3 text-lg font-medium hover:text-[#C2DBED]">
                  <House className="h-5 w-5" /> Inicio
                </Link>
                <Link to="/explorar" className="flex items-center gap-3 text-lg font-medium hover:text-[#C2DBED]">
                  <Search className="h-5 w-5" /> Explorar
                </Link>
                
                <hr className="border-[#4982AD] my-2" />
                
                <div className="flex flex-col gap-4">
                  <Button asChild variant="outline" className="border-[#C2DBED] text-white hover:bg-[#4982AD] bg-transparent">
                    <Link to="/login">Iniciar sesión</Link>
                  </Button>
                  <Button asChild className="bg-[#C4A57C] font-bold text-[#003A6C] hover:bg-[#F7F0E1]">
                    <Link to="/register">Registrarse</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}