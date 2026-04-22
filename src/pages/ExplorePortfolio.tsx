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
  const [itemsPerPage, setItemsPerPage] = useState(12);

  useEffect(() => {
  const updateLimit = () => { setItemsPerPage(window.innerWidth < 640 ? 6 : 12); };
  updateLimit(); 
  window.addEventListener("resize", updateLimit);
  return () => window.removeEventListener("resize", updateLimit);
  }, []);

const { currentData, currentPage, totalPages, next, prev, goToPage } = usePagination({ 
  items: portfolios, 
  itemsPerPage 
  });

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
          {/* Grid Principal: 1 col en móvil, 2 en tablet, 3 en desktop */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {currentData.map((portfolio) => (
                <div key={portfolio.id} className="group mx-auto flex w-full max-w-md items-center gap-4 rounded-2xl bg-white p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:border-[#4982AD]/30"  >
                <div className="shrink-0">
                <img src={portfolio.profileImage} 
                    className="size-16 rounded-full object-cover ring-2 ring-[#FDF8F0] md:size-20" 
                    alt="Perfil" />
                </div>

             <div className="flex-1 min-w-0">
                <div className="flex flex-col">
                <h3 className="truncate text-base font-bold text-[#003A6C]">   {portfolio.fullName}  </h3>
                <p className="truncate text-[11px] font-semibold text-[#a08057] uppercase tracking-wider"> {portfolio.occupation} </p>
            </div>
        
        {/* Stats en una sola línea */}
             <div className="my-1 flex gap-2 text-[9px] font-bold text-gray-400">
                <span>{portfolio.projectsCount} PROYECTOS</span>
                <span>•</span>
                <span>{portfolio.skillsCount} SKILLS</span>
            </div>

        {/* Skills: Solo las primeras 2 para no romper el diseño horizontal */}
             <div className="flex flex-wrap gap-1 mt-1">
                {portfolio.topSkills.slice(0, 2).map(skill => (
                    <Badge key={skill} className="bg-[#fcecd4] text-[#173b61] text-[9px] px-1.5 py-0 border-none">
                    {skill}
                    </Badge> ))}
                {portfolio.topSkills.length > 2 && (
                <span className="text-[9px] text-gray-400 font-bold">+{portfolio.topSkills.length - 2}</span>)}
            </div>
        </div>

      {/* Botón de flecha a la derecha */}
        <Button size="icon"
              className="shrink-0 size-8 rounded-lg bg-[#003A6C] hover:bg-[#c4a57c] text-white transition-colors" >
             <ChevronRight className="size-4" />
        </Button>
        </div>))}
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