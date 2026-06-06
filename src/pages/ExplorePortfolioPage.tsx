import { ChevronLeft, ChevronRight, Search, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import HeaderUser from "@/components/HeaderUser";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useExplorePortfolios } from "@/hooks/useExplorePortfolios";
import { isAuthenticated, getAuthSession } from "@/services/auth";
import Sidebar from "@/components/Sidebar";
import AdminSidebar from "../components/Admin/AdminSidebar";
import { getInitials } from "@/utils/explore/stringUtils";
import FilterDropdown from "@/components/explore/FilterDropdown";

export default function ExplorePortfolioPage() {
  const navigate = useNavigate();
  const isUserAuthenticated = isAuthenticated();
  const session = getAuthSession();
  const isAdmin = session?.user?.role_id === 2;
  const { searchTerm, isFiltersOpen,setIsFiltersOpen,selectedOccupation,minProjects, minSkills,hasActiveFilters,
    handleSearchChange, handleOccupationChange, handleProjectsChange, handleSkillsChange, handleClearFilters,
    currentData, currentPage,totalPages,goToPage,next,prev, loading, pageError, } = useExplorePortfolios();

  return (
    <div className="flex min-h-screen flex-col bg-[#FDF8F0]">
      {isUserAuthenticated ? <HeaderUser /> : <Header />}

      <div className="flex flex-1">
        {isUserAuthenticated && (isAdmin ? <AdminSidebar /> : <Sidebar />)}

        <main className="flex-1 px-4 py-4 md:px-8 md:py-6">
          <div className="mx-auto max-w-7xl">
            <section className="mb-4 text-center">
              <h1 className="text-2xl font-black text-[#003A6C] md:text-3xl">Explorar Portafolios</h1>
              <p className="text-sm text-gray-500">Descubre los portafolios de desarrolladores</p>
            </section>

            <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 sm:mb-5 sm:flex sm:flex-row sm:items-center sm:justify-between sm:gap-3">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#5B8FB9] sm:left-4 sm:size-5" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => handleSearchChange(event.target.value)}
                  placeholder="Buscar por nombre, ocupación o habilidades..."
                  className="h-11 w-full rounded-2xl border border-[#6DACBF]/40 bg-white pl-10 pr-3 text-sm text-[#003A6C] shadow-sm outline-none transition focus:border-[#4982AD] focus:ring-2 focus:ring-[#4982AD]/20 sm:h-12 sm:pl-12 sm:pr-4"
                />
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFiltersOpen((current) => !current)}
                className={`h-11 shrink-0 rounded-2xl border-[#6DACBF]/40 bg-white px-3 text-[#003A6C] shadow-sm hover:bg-[#F7F0E1] sm:h-12 sm:px-4 ${hasActiveFilters ? "border-[#4982AD] bg-[#F7F0E1]" : ""}`}    >
                <SlidersHorizontal className="size-4" />
              </Button>
            </div>

            {isFiltersOpen && (
              <div className="mb-3 rounded-xl border border-[#6DACBF]/30 bg-white p-3 shadow-sm sm:p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-wide text-[#003A6C]">Filtros</h2>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-7 rounded-lg px-2 text-[11px] font-semibold text-[#003A6C] hover:bg-[#F7F0E1]"
                    onClick={handleClearFilters}  >
                    Limpiar
                  </Button>
                </div>

                <div className="grid gap-2 md:grid-cols-3">
                  <label className="relative space-y-1">
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#5B8FB9]">
                      Ocupación
                    </span>

                    <div className="relative">
                      <input
                        type="search"
                        value={selectedOccupation === "all" ? "" : selectedOccupation}
                        onChange={(event) => handleOccupationChange(event.target.value)}
                        placeholder="Buscar por ocupación"
                        className="h-8 w-full rounded-lg border border-[#6DACBF]/30 bg-[#FDF8F0] px-2 text-xs text-[#003A6C] shadow-sm outline-none transition focus:border-[#4982AD] focus:ring-2 focus:ring-[#4982AD]/20"  />
                    </div>
                  </label>

                  <label className="relative space-y-1">
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#5B8FB9]">
                      Proyectos mínimos
                    </span>

                    <div className="relative">
                      <FilterDropdown
                        value={minProjects}
                        options={[ "1 o más", "3 o más", "5 o más", "10 o más",]}
                        placeholder="Cualquiera"
                        onChange={handleProjectsChange}   />
                    </div>
                  </label>

                  <label className="relative space-y-1">
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#5B8FB9]">
                      Habilidades mínimas
                    </span>

                    <div className="relative">
                      <FilterDropdown
                        value={minSkills}
                        options={[ "1 o más", "3 o más", "5 o más",  "8 o más", ]}
                        placeholder="Cualquiera"
                        onChange={handleSkillsChange}    />
                    </div>
                  </label>
                </div>
              </div>
            )}

            {pageError ? (
              <div className="mb-4 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                {pageError}
              </div>
            ) : null}

            {loading ? (
              <div className="rounded-2xl border border-[#6DACBF]/30 bg-white p-8 text-center text-sm text-[#5B8FB9] shadow-sm">
                Cargando portafolios...
              </div>
            ) : null}

            {!loading && currentData.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#6DACBF]/30 bg-white p-8 text-center text-sm text-[#5B8FB9] shadow-sm">
                No hay portafolios disponibles en este momento.
              </div>
            ) : null}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {currentData.map((portfolio) => (
                <div
                  key={portfolio.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/p/${portfolio.slug}`, { state: { fromExplore: true } })}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      navigate(`/p/${portfolio.slug}`, { state: { fromExplore: true } });
                    }
                  }}
                  className="group flex w-full items-center gap-4 rounded-xl border border-gray-100 bg-white p-2 shadow-sm transition-all hover:border-[#4982AD]/30 hover:shadow-md" >
                  <div className="shrink-0">
                    {portfolio.profileImage ? (
                      <img
                        src={portfolio.profileImage}
                        className="size-16 rounded-full object-cover ring-2 ring-[#FDF8F0] md:size-18"
                        alt="Perfil" />
                    ) : (
                      <div className="size-16 md:size-18 flex items-center justify-center rounded-full bg-[#003A6C] text-lg font-bold text-white">
                        {getInitials(portfolio.fullName || portfolio.username)}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col">
                      <h3 className="truncate text-base font-bold text-[#003A6C]">
                        {portfolio.fullName || "Sin nombre"}
                      </h3>
                      <p className="truncate text-xs font-normal text-gray-400">@{portfolio.username}</p>
                      <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-[#a08057]">
                        {portfolio.occupation}
                      </p>
                    </div>

                    <div className="my-1 flex gap-2 text-[9px] font-bold text-gray-400">
                      <span>{portfolio.projectsCount} PROYECTOS</span>
                      <span>•</span>
                      <span>{portfolio.skillsCount} HABILIDADES</span>
                    </div>

                    <div className="mt-1 flex flex-wrap gap-1">
                      {portfolio.topSkills.slice(0, 2).map((skill) => (
                        <Badge key={skill} className="border-none bg-[#fcecd4] px-1.5 py-0 text-[9px] text-[#173b61] shadow-none">
                          {skill}
                        </Badge>
                      ))}
                      {portfolio.topSkills.length > 2 && (
                        <span className="text-[9px] font-bold text-gray-400">+{portfolio.topSkills.length - 2}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <nav className="mt-6 flex items-center justify-center gap-2 md:gap-4">
              <Button
                variant="outline"
                onClick={prev}
                disabled={currentPage === 1 || loading}
                className="rounded-xl border-gray-200 bg-white px-2 md:px-4"
              >
                <ChevronLeft className="size-5" />
                <span className="ml-1 hidden md:inline">Anterior</span>
              </Button>

              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  if (totalPages > 5 && Math.abs(currentPage - pageNumber) > 1 && pageNumber !== 1 && pageNumber !== totalPages) {
                    if (pageNumber === 2 || pageNumber === totalPages - 1) {
                      return <span key={pageNumber} className="px-1 text-gray-400">...</span>;
                    } return null;
                  }
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => goToPage(pageNumber)}
                      disabled={loading}
                      className={`size-9 rounded-xl text-sm font-bold transition-all md:size-11 ${
                        currentPage === pageNumber
                          ? "bg-[#003A6C] text-white shadow-lg shadow-[#003A6C]/30"
                          : "border border-gray-100 bg-white text-gray-500 hover:bg-gray-100"
                      }`} >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                onClick={next}
                disabled={currentPage === totalPages || totalPages === 0 || loading}
                className="rounded-xl border-gray-200 bg-white px-2 md:px-4" >
                <span className="mr-1 hidden md:inline">Siguiente</span>
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