import { useState } from 'react';
import { Home, User, LogOut } from 'lucide-react';
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isDashboard = location.pathname === "/dashboard";

  return (
    <header id="header" className="min-h-16 h-auto bg-[#003A6C] border-b border-[#4982ad] flex flex-wrap md:flex-nowrap items-center justify-between px-4 md:px-8 sticky top-0 z-50 py-3 md:py-0">

      {/* 1. LOGO - flex-1 en desktop para empujar al centro */}
      <div id="header-logo" className="flex items-center gap-2 md:flex-1 order-1">
        <img id="logo-imagen" src={logo} alt="Logo" className="w-10 h-10 md:w-16 md:h-16 object-contain" />
        <h1 id="logo-titulo" className="text-white font-bold text-lg md:text-xl tracking-tight">
          PortfolioGen
        </h1>
      </div>

      {/* 2. NAV - En desktop se queda al centro, en móvil salta abajo */}
      <nav id="header-nav" className="w-full md:w-auto order-3 md:order-2 flex justify-start md:justify-center mt-3 md:mt-0">
        <button
          id="btn-go-dashboard" 
          onClick={() => navigate("/dashboard")}
          className={`flex items-center gap-2 font-medium transition-colors px-3 py-1.5 rounded-lg ${
            isDashboard 
              ? "bg-[#77b6e6] text-[#003A6C] md:bg-transparent md:text-[#77b6e6]" 
              : "text-[#c2dbed] hover:text-[#77b6e6]"
          }`}
        >
          <Home size={18} />
          <span>Inicio</span>
        </button>
      </nav>

      {/* 3. USER - flex-1 y justify-end en desktop para pegarlo a la derecha */}
      <div id="user-menu-container" className="relative order-2 md:order-3 md:flex-1 flex justify-end">
        <button 
          id="btn-user-menu"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center gap-2 border border-[#4982ad] rounded-lg px-3 md:px-4 py-1.5 bg-white hover:bg-[#F7F0E1] transition-all"
        >
          <User className="w-5 h-5 text-[#003A6C]" />
          <span className="hidden md:inline text-[#003A6C] font-medium text-sm">
            Google User
          </span>
        </button>

        {/* DROPDOWN MENU */}
        {isMenuOpen && (
          <>
            <div id="menu-overlay" className="fixed inset-0 z-[-1]" onClick={() => setIsMenuOpen(false)}></div>
            <div id="dropdown-menu" className="absolute right-0 mt-2 w-56 md:w-60 bg-white border border-[#4982ad] rounded-xl shadow-lg overflow-hidden animate-in fade-in zoom-in duration-200">
              <div id="user-info" className="p-4 border-b border-[#0E7D96] text-left">
                <p id="user-name" className="text-sm font-normal text-gray-800">Google User</p>
                <p id="user-email" className="text-xs text-[#0E7D96] truncate">googleuser@example.com</p>
                <p id="user-role" className="text-xs text-[#0E7D96] mt-1">Desarrollador</p>
              </div>
              <div id="menu-options" className="py-2 px-3">
                <button onClick={() => navigate("/perfil")} className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-[#C4A57C] transition-colors rounded-md">
                  <User size={16} className="text-gray-500" />
                  Mi perfil
                </button>
              </div>
              <div id="menu-logout" className="border-t border-[#0E7D96] py-2 px-3">
                <button className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-500 hover:bg-[#C4A57C] transition-colors rounded-md">
                  <LogOut size={16} />
                  Cerrar sesión
                </button>
              </div>
            </div>
          </>
        )}
      </div>

    </header>
  );
};

export default Header;