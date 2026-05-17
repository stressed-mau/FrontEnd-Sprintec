import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Eye, Search, SlidersHorizontal } from "lucide-react"; 
import { Header } from "@/components/Header"; 
import HeaderUser from "@/components/HeaderUser";
import Sidebar from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePagination } from "@/hooks/usePagination";
import { useExplorePortfolioFilters, type PortfolioCard } from "@/hooks/useExplorePortfolioFilters";
import { isAuthenticated } from "@/services/auth";
import { getExplorePortfolios } from "@/services/explorePortfoliosService";

export default function ExplorePortfolios() {
  const navigate = useNavigate();
  const [portfolios, setPortfolios] = useState<PortfolioCard[]>([]);
  const [itemsPerPage] = useState(12);
  const isUserAuthenticated = isAuthenticated();

  useEffect(() => {
  let isMounted = true;

  const fetchPortfolios = async () => {
    try {
      const data = await getExplorePortfolios();
      if (!isMounted) return;
      setPortfolios(data);
    } catch (error) {
      console.error("Error cargando portafolios:", error);
      if (!isMounted) return;
      setPortfolios([]);
    }
  };

  fetchPortfolios();

  return () => {
    isMounted = false;
  };
}, []);

  const {   searchTerm, setSearchTerm,  isFiltersOpen,  setIsFiltersOpen, selectedOccupation,  setSelectedOccupation,
           minProjects, setMinProjects, minSkills,  setMinSkills,  occupationOptions,  filteredPortfolios,  hasActiveFilters, clearFilters,  } = useExplorePortfolioFilters(portfolios)

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedOccupation, minProjects, minSkills]);

  const { currentData, currentPage, totalPages, next, prev, goToPage, setCurrentPage } = usePagination({ 
    items: filteredPortfolios, 
    itemsPerPage 
  });

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0].toUpperCase())
    .join("");
}
  return (
    <div className="flex min-h-screen flex-col bg-[#FDF8F0]">
      {isUserAuthenticated ? <HeaderUser /> : <Header />}

      <div className="flex flex-1">
        {isUserAuthenticated && <Sidebar />}

        <main className="flex-1 px-4 py-4 md:px-8 md:py-6">
          <div className="mx-auto max-w-7xl">
            
            <section className="mb-4 text-center">
              <h1 className="text-2xl font-black text-[#003A6C] md:text-3xl"> Explorar Portafolios </h1>
              <p className="text-sm text-gray-500">Descubre los portafolios de desarrolladores</p>
            </section>

            <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 sm:mb-5 sm:flex sm:flex-row sm:items-center sm:justify-between sm:gap-3">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#5B8FB9] sm:left-4 sm:size-5" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Buscar por nombre, cargo o habilidad"
                  className="h-11 w-full rounded-2xl border border-[#6DACBF]/40 bg-white pl-10 pr-3 text-sm text-[#003A6C] shadow-sm outline-none transition focus:border-[#4982AD] focus:ring-2 focus:ring-[#4982AD]/20 sm:h-12 sm:pl-12 sm:pr-4"
                />
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFiltersOpen((current) => !current)}
                className={`h-11 shrink-0 rounded-2xl border-[#6DACBF]/40 bg-white px-3 text-[#003A6C] shadow-sm hover:bg-[#F7F0E1] sm:h-12 sm:px-4 ${hasActiveFilters ? "border-[#4982AD] bg-[#F7F0E1]" : ""}`}
              >
                <SlidersHorizontal className="size-4" />
                      </Button>
            </div>

            {isFiltersOpen && (
              <div className="mb-4 rounded-2xl border border-[#6DACBF]/40 bg-white p-3 shadow-sm sm:mb-5 sm:rounded-3xl sm:p-4 md:p-5">
                <div className="mb-3 flex items-center justify-between gap-3 sm:mb-4">
                  <div>
                    <h2 className="text-sm font-bold text-[#003A6C]">Filtros</h2>
                    <p className="text-[11px] text-[#5B8FB9] sm:text-xs">Ajusta el listado por cargo y volumen de contenido.</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-8 rounded-xl px-3 text-xs font-semibold text-[#003A6C] hover:bg-[#F7F0E1] sm:h-9"
                    onClick={clearFilters}
                  >
                    Limpiar
                  </Button>
                </div>

                <div className="grid gap-2 sm:gap-3 md:grid-cols-3">
                  <label className="space-y-2">
                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#5B8FB9] sm:text-xs">Cargo</span>
                    <select
                      value={selectedOccupation}
                      onChange={(event) => setSelectedOccupation(event.target.value)}
                      className="h-10 w-full rounded-2xl border border-[#6DACBF]/40 bg-[#FDF8F0] px-3 text-sm text-[#003A6C] outline-none transition focus:border-[#4982AD] focus:ring-2 focus:ring-[#4982AD]/20 sm:h-11 sm:px-4"
                    >
                      <option value="all">Todos</option>
                      {occupationOptions.map((occupation) => (
                        <option key={occupation} value={occupation}>
                          {occupation}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-2">
                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#5B8FB9] sm:text-xs">Proyectos mínimos</span>
                    <select
                      value={minProjects}
                      onChange={(event) => setMinProjects(event.target.value)}
                      className="h-10 w-full rounded-2xl border border-[#6DACBF]/40 bg-[#FDF8F0] px-3 text-sm text-[#003A6C] outline-none transition focus:border-[#4982AD] focus:ring-2 focus:ring-[#4982AD]/20 sm:h-11 sm:px-4"
                    >
                      <option value="all">Cualquiera</option>
                      <option value="1">1 o más</option>
                      <option value="3">3 o más</option>
                      <option value="5">5 o más</option>
                      <option value="10">10 o más</option>
                    </select>
                  </label>

                  <label className="space-y-2">
                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#5B8FB9] sm:text-xs">Skills mínimas</span>
                    <select
                      value={minSkills}
                      onChange={(event) => setMinSkills(event.target.value)}
                      className="h-10 w-full rounded-2xl border border-[#6DACBF]/40 bg-[#FDF8F0] px-3 text-sm text-[#003A6C] outline-none transition focus:border-[#4982AD] focus:ring-2 focus:ring-[#4982AD]/20 sm:h-11 sm:px-4"
                    >
                      <option value="all">Cualquiera</option>
                      <option value="1">1 o más</option>
                      <option value="3">3 o más</option>
                      <option value="5">5 o más</option>
                      <option value="8">8 o más</option>
                    </select>
                  </label>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {currentData.map((portfolio) => (
                <div 
                  key={portfolio.id} 
                  className="group mx-auto flex w-full max-w-md items-center gap-4 rounded-2xl bg-white p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:border-[#4982AD]/30"  >
                  <div className="shrink-0">
                    {portfolio.profileImage ? (
                      <img 
                        src={portfolio.profileImage}
                        className="size-16 rounded-full object-cover ring-2 ring-[#FDF8F0] md:size-18"
                        alt="Perfil"
                      />
                    ) : (
                      <div className="size-16 md:size-18 rounded-full bg-[#003A6C] text-white flex items-center justify-center font-bold text-lg">
                        {getInitials(portfolio.fullName)}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col">
                      <h3 className="truncate text-base font-bold text-[#003A6C]"> {portfolio.fullName} </h3>
                      <p className="truncate text-[11px] font-semibold text-[#a08057] uppercase tracking-wider"> {portfolio.occupation} </p>
                    </div>
                
                    <div className="my-1 flex gap-2 text-[9px] font-bold text-gray-400">
                      <span>{portfolio.projectsCount} PROYECTOS</span>
                      <span>•</span>
                      <span>{portfolio.skillsCount} SKILLS</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-1">
                      {portfolio.topSkills.slice(0, 2).map(skill => (
                        <Badge key={skill} className="bg-[#fcecd4] text-[#173b61] text-[9px] px-1.5 py-0 border-none shadow-none">
                          {skill}
                        </Badge> 
                      ))}
                      {portfolio.topSkills.length > 2 && (
                        <span className="text-[9px] text-gray-400 font-bold">+{portfolio.topSkills.length - 2}</span>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={() => navigate(`/p/${portfolio.slug}`)}
                    className="shrink-0 h-8 px-3 rounded-lg bg-[#003A6C] hover:bg-[#c4a57c] text-white flex items-center gap-2 text-xs font-bold"
                  >
                    Ver <Eye className="size-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Paginación */}
            <nav className="mt-6 flex items-center justify-center gap-2 md:gap-4">
              <Button 
                variant="outline" 
                onClick={prev} 
                disabled={currentPage === 1}
                className="rounded-xl border-gray-200 px-2 md:px-4 bg-white" >
                <ChevronLeft className="size-5" />
                <span className="hidden md:inline ml-1">Anterior</span>
              </Button>

              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  if (totalPages > 5 && Math.abs(currentPage - pageNum) > 1 && pageNum !== 1 && pageNum !== totalPages) {
                    if (pageNum === 2 || pageNum === totalPages - 1) return <span key={pageNum} className="px-1 text-gray-400">...</span>;
                    return null;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={`size-9 md:size-11 rounded-xl text-sm font-bold transition-all ${
                        currentPage === pageNum 
                        ? "bg-[#003A6C] text-white shadow-lg shadow-[#003A6C]/30" 
                        : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <Button 
                variant="outline" 
                onClick={next} 
                disabled={currentPage === totalPages || totalPages === 0}
                className="rounded-xl border-gray-200 px-2 md:px-4 bg-white" >
                <span className="hidden md:inline mr-1">Siguiente</span>
                <ChevronRight className="size-5" />
              </Button>
            </nav>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}