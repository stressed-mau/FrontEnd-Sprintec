import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Eye, Search, SlidersHorizontal } from "lucide-react"; 
import { Header } from "@/components/Header"; 
import HeaderUser from "@/components/HeaderUser";
import Sidebar from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useExplorePortfolioFilters, type PortfolioCard } from "@/hooks/useExplorePortfolioFilters";
import { getLanguages, getWorkOptions } from "@/services/ProjectService";
import { isAuthenticated } from "@/services/auth";
import { getExplorePortfolios, type ExplorePortfoliosMeta } from "@/services/explorePortfoliosService";

type FilterDropdownProps = {
  value: string
  options: string[]
  placeholder?: string
  onChange: (value: string) => void
}

function FilterDropdown({ value, options, placeholder, onChange }: FilterDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!ref.current) return
      if (e.target instanceof Node && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }

    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [])

  const selectedLabel = value === 'all' ? placeholder ?? 'Todos' : value

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="h-8 w-full rounded-lg border border-[#6DACBF]/30 bg-[#FDF8F0] px-2 text-xs text-[#003A6C] flex items-center justify-between outline-none" >
        <span className="truncate">{selectedLabel}</span>
        <svg className={`ml-2 h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>
      </button>

      {open && (
        <ul className="absolute left-0 right-0 mt-1 z-50 max-h-48 overflow-auto rounded-md border border-[#E6EDF2] bg-white shadow-lg">
          <li
            key="all"
            onClick={() => { onChange('all'); setOpen(false) }}
            className={`cursor-pointer px-3 py-2 text-sm text-[#003A6C] hover:bg-[#F3F7F8] ${value === 'all' ? 'font-semibold' : ''}`}    >
            {placeholder ?? 'Todos'}
          </li>
          {options.map((opt) => (
            <li
              key={opt}
              onClick={() => { onChange(opt); setOpen(false) }}
              className={`cursor-pointer px-3 py-2 text-sm text-[#003A6C] hover:bg-[#F3F7F8] ${value === opt ? 'font-semibold' : ''}`}    >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

//function OccupationDropdown(props: Omit<FilterDropdownProps, 'placeholder'>) {
 // return <FilterDropdown {...props} placeholder="Todos" />}

function TechnologyDropdown(props: Omit<FilterDropdownProps, 'placeholder'>) {
  return <FilterDropdown {...props} placeholder="Todas" />}

function ProjectsDropdown(props: Omit<FilterDropdownProps, 'placeholder'>) {
  return <FilterDropdown {...props} placeholder="Cualquiera" />}

function SkillsDropdown(props: Omit<FilterDropdownProps, 'placeholder'>) {
  return <FilterDropdown {...props} placeholder="Cualquiera" />}

export default function ExplorePortfolios() {
  const navigate = useNavigate();
 // const occupationContainerRef = useRef<HTMLDivElement | null>(null)
  const technologyContainerRef = useRef<HTMLDivElement | null>(null)
  const [portfolios, setPortfolios] = useState<PortfolioCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState<ExplorePortfoliosMeta>({ currentPage: 1, perPage: 15, total: 0, totalPages: 1 });
  const isUserAuthenticated = isAuthenticated();
  const [serverOccupationOptions, setServerOccupationOptions] = useState<string[] | null>(null)
  const [serverTechnologyOptions, setServerTechnologyOptions] = useState<string[] | null>(null)
  const {    searchTerm, setSearchTerm, isFiltersOpen, setIsFiltersOpen, selectedOccupation,
    //setSelectedOccupation,
    selectedTechnology, setSelectedTechnology, minProjects, setMinProjects, minSkills,  setMinSkills,
    //occupationOptions,
    technologyOptions, hasActiveFilters, clearFilters,  } = useExplorePortfolioFilters(portfolios, serverOccupationOptions ?? undefined, serverTechnologyOptions ?? undefined)

  useEffect(() => {
    let mounted = true

    const loadOptions = async () => {
      try {
        const [langs, work] = await Promise.all([getLanguages(), getWorkOptions()])
        if (!mounted) return
        const techs = Array.isArray(langs) ? langs.map((t: any) => (typeof t.name === "string" ? t.name : String(t))) : []
        setServerTechnologyOptions(techs)
        setServerOccupationOptions(Array.isArray(work?.roles) ? work.roles : [])
      } catch (err) {
        console.error("Error cargando opciones de filtros:", err)
      }
    }

    loadOptions()

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true;

    const fetchPortfolios = async () => {
      setLoading(true)

      try {
        const result = await getExplorePortfolios({
          search: searchTerm,
          roles: selectedOccupation === "all" ? [] : [selectedOccupation],
          technologies: selectedTechnology === "all" ? [] : [selectedTechnology],
          minProjects: minProjects === "all" ? undefined : Number(minProjects),
          minSkills: minSkills === "all" ? undefined : Number(minSkills),
          page: currentPage,
        })

        if (!isMounted) return;

        setPortfolios(result.portfolios)
        setMeta(result.meta)
        setPageError("")
      } catch (error) {
        console.error("Error cargando portafolios:", error)
        if (!isMounted) return;
        setPortfolios([])
        setMeta({ currentPage: 1, perPage: 15, total: 0, totalPages: 1 })
        setPageError(error instanceof Error ? error.message : "No se pudieron cargar los portafolios.")
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    };

    fetchPortfolios();

    return () => {
      isMounted = false;
    };
  }, [searchTerm, selectedOccupation, selectedTechnology, minProjects, minSkills, currentPage]);

  const totalPages = useMemo(() => Math.max(1, meta.totalPages), [meta.totalPages])
  const currentData = portfolios
  const next = () => setCurrentPage((page) => Math.min(page + 1, totalPages))
  const prev = () => setCurrentPage((page) => Math.max(1, page - 1))
  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)))

  const handleSearchChange = (value: string) => {
    setCurrentPage(1)
    setSearchTerm(value)
  }

  //const handleOccupationChange = (value: string) => {
    //setCurrentPage(1)
    //setSelectedOccupation(value)
 // }

  const handleTechnologyChange = (value: string) => {
    setCurrentPage(1)
    setSelectedTechnology(value) }

  const handleProjectsChange = (value: string) => {
    setCurrentPage(1)
    setMinProjects(value) }

  const handleSkillsChange = (value: string) => {
    setCurrentPage(1)
    setMinSkills(value) }

  const handleClearFilters = () => {
    clearFilters()
    setCurrentPage(1) }

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
                  onChange={(event) => handleSearchChange(event.target.value)}
                  placeholder="Buscar por nombre, ocupación o habilidad"
                  className="h-11 w-full rounded-2xl border border-[#6DACBF]/40 bg-white pl-10 pr-3 text-sm text-[#003A6C] shadow-sm outline-none transition focus:border-[#4982AD] focus:ring-2 focus:ring-[#4982AD]/20 sm:h-12 sm:pl-12 sm:pr-4"   />
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFiltersOpen((current) => !current)}
                className={`h-11 shrink-0 rounded-2xl border-[#6DACBF]/40 bg-white px-3 text-[#003A6C] shadow-sm hover:bg-[#F7F0E1] sm:h-12 sm:px-4 ${hasActiveFilters ? "border-[#4982AD] bg-[#F7F0E1]" : ""}`}      >
                <SlidersHorizontal className="size-4" />
              </Button>
            </div>

            {isFiltersOpen && (
                <div className="mb-3 rounded-xl border border-[#6DACBF]/30 bg-white p-3 shadow-sm sm:p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <div> 
                      <h2 className="text-xs font-bold uppercase tracking-wide text-[#003A6C]">   Filtros  </h2>
                    </div>
                      <Button
                        type="button"
                        variant="ghost"
                        className="h-7 rounded-lg px-2 text-[11px] font-semibold text-[#003A6C] hover:bg-[#F7F0E1]"
                        onClick={handleClearFilters}    >
                         Limpiar
                      </Button>
                  </div>

                <div className="grid gap-2 md:grid-cols-3">
      {/* CARGO 
      <label className="space-y-1 relative">
        <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#5B8FB9]">
          Cargo
        </span>

        <div ref={occupationContainerRef} className="relative">
          <OccupationDropdown
            value={selectedOccupation}
            options={occupationOptions}
            onChange={(v) => handleOccupationChange(v)}
          />
        </div>
      </label>
      */}
      {/* TECNOLOGIAS *
      <label className="space-y-1 relative">
        <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#5B8FB9]">
          Tecnologías
        </span>

        <div ref={technologyContainerRef} className="relative">
          <TechnologyDropdown
            value={selectedTechnology}
            options={technologyOptions}
            onChange={(v) => handleTechnologyChange(v)}    />
        </div>
      </label>/}

       {/* HABILIDADES */}
      <label className="space-y-1 relative">
        <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#5B8FB9]">
          Habilidades
        </span>

        <div ref={technologyContainerRef} className="relative">
          <TechnologyDropdown
            value={selectedTechnology}
            options={technologyOptions}
            onChange={(v) => handleTechnologyChange(v)}    />
        </div>
      </label>

      {/* PROYECTOS */}
      <label className="space-y-1 relative">
  <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#5B8FB9]">
    Proyectos mínimos
  </span>

  <div className="relative">
    <ProjectsDropdown
      value={minProjects}
      options={[
        "1 o más",
        "3 o más",
        "5 o más",
        "10 o más",
      ]}
      onChange={(v) => handleProjectsChange(v)}
    />
  </div>
</label>
      {/* SKILLS */}
     <label className="space-y-1 relative">
  <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#5B8FB9]">
    Habilidades mínimas
  </span>

  <div className="relative">
    <SkillsDropdown
      value={minSkills}
      options={[
        "1 o más",
        "3 o más",
        "5 o más",
        "8 o más",
      ]}
      onChange={(v) => handleSkillsChange(v)}
    />
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
                No se encontraron portafolios con esos criterios.
              </div>
            ) : null}

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
                      <span>{portfolio.skillsCount} HABILIDADES</span>
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
                disabled={currentPage === 1 || loading}
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
                      disabled={loading}
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
                disabled={currentPage === totalPages || totalPages === 0 || loading}
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