import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight} from "lucide-react";
import { Header} from "@/components/Header"; 
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePagination } from "@/hooks/usePagination";

interface PortfolioCard {
  id: string;
  fullName: string;
  occupation: string;
  profileImage: string;
  projectsCount: number;
  skillsCount: number;
  topSkills: string[];
}

export default function ExplorePortfolios() {
  const [portfolios, setPortfolios] = useState<PortfolioCard[]>([]);
  
  const {  currentData, currentPage, totalPages, next, prev, goToPage } = usePagination({ items: portfolios, itemsPerPage: 8 });

  useEffect(() => {
    // Simulación de carga de BD
    const dataFromDB: PortfolioCard[] = Array(20).fill(null).map((_, i) => ({
      id: `${i}`,
      fullName: i % 2 === 0 ? "María García" : "Carlos Martínez",
      occupation: i % 2 === 0 ? "Full Stack Developer" : "Mobile Developer",
      profileImage: `https://i.pravatar.cc/150?u=${i}`,
      projectsCount: 2,
      skillsCount: 3,
      topSkills: ["React", "Node.js", "Tailwind"]
    }));
    setPortfolios(dataFromDB);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#FDF8F0]">
      <Header />

      <main className="flex-1 px-4 py-8 md:px-8">
        <div className="mx-auto max-w-7xl">
        
          <section className="mb-12 text-center">
            <h1 className="text-3xl font-black text-[#003A6C] md:text-5xl"> Explorar Portafolios </h1>
            <div className="mx-auto mt-8 max-w-xl relative">
              {/* "Búsqueda"
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
              <input 
                type="text" 
                placeholder="Buscar talento..." 
                className="w-full rounded-2xl border border-gray-200 py-4 pl-12 pr-6 outline-none shadow-sm focus:ring-2 focus:ring-[#003A6C]/10 transition-all"
              />*/}
            </div>
          </section>

          {/* Grid Responsivo: Cards pequeñas en móvil */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {currentData.map((portfolio) => (
              <div 
                key={portfolio.id}
                className="group flex flex-col items-center rounded-[2rem] bg-white p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all"
              >
                <img 
                  src={portfolio.profileImage} 
                  className="mb-4 size-20 rounded-full object-cover ring-4 ring-[#FDF8F0] md:size-24" 
                  alt="Perfil"
                />
                <h3 className="text-lg font-bold text-[#003A6C] text-center">{portfolio.fullName}</h3>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{portfolio.occupation}</p>
                
                <div className="my-4 flex gap-3 text-[10px] font-bold text-gray-400">
                  <span>{portfolio.projectsCount} PROYECTOS</span>
                  <span>•</span>
                  <span>{portfolio.skillsCount} SKILLS</span>
                </div>

                <div className="flex flex-wrap justify-center gap-1.5">
                  {portfolio.topSkills.map(skill => (
                    <Badge key={skill} variant="secondary" className="bg-[#EBF5FF] text-[#003A6C] text-[10px] px-2 py-0">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <Button className="mt-6 w-full rounded-xl bg-[#003A6C] hover:bg-[#C4A57C] text-white font-bold transition-colors">
                  Ver Perfil
                </Button>
              </div>
            ))}
          </div>

          <nav className="mt-12 flex items-center justify-center gap-2 md:gap-4">
            <Button 
              variant="outline" 
              onClick={prev} 
              disabled={currentPage === 1}
              className="rounded-xl border-gray-200 px-2 md:px-4"
            >
              <ChevronLeft className="size-5" />
              <span className="hidden md:inline ml-1">Anterior</span>
            </Button>

            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                if (totalPages > 5 && Math.abs(currentPage - pageNum) > 1 && pageNum !== 1 && pageNum !== totalPages) {
                   if (pageNum === 2 || pageNum === totalPages - 1) return <span key={pageNum} className="px-1">...</span>;
                   return null;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`size-9 md:size-11 rounded-xl text-sm font-bold transition-all ${
                      currentPage === pageNum 
                      ? "bg-[#003A6C] text-white shadow-lg shadow-[#003A6C]/30" 
                      : "bg-white text-gray-500 hover:bg-gray-100"
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
              disabled={currentPage === totalPages}
              className="rounded-xl border-gray-200 px-2 md:px-4"
            >
              <span className="hidden md:inline mr-1">Siguiente</span>
              <ChevronRight className="size-5" />
            </Button>
          </nav>
        </div>
      </main>

      <Footer />
    </div>
  );
}