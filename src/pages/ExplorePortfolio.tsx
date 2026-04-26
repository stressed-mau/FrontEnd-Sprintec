import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react"; 
import { Header } from "@/components/Header"; 
import HeaderUser from "@/components/HeaderUser";
import Sidebar from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePagination } from "@/hooks/usePagination";
import { isAuthenticated } from "@/services/auth";
import {getExplorePortfolios, getPortfolioApiDetailUrl, type ExplorePortfolioCard} from "@/services/explorePortfoliosService";

export default function ExplorePortfolios() {
  const [portfolios, setPortfolios] = useState<ExplorePortfolioCard[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const isUserAuthenticated = isAuthenticated();

  useEffect(() => {
    const updateLimit = () => { 
      setItemsPerPage(window.innerWidth < 640 ? 5 : 12); 
    };
    updateLimit(); 
    window.addEventListener("resize", updateLimit);
    return () => window.removeEventListener("resize", updateLimit);
  }, []);

  // Extraemos goToPage para que los botones numéricos funcionen
  const { currentData, currentPage, totalPages, next, prev, goToPage } = usePagination({ 
    items: portfolios, 
    itemsPerPage 
  });

  useEffect(() => {
    let isMounted = true;

    const fetchPortfolios = async () => {
      try {
        if (!isMounted) return;

        const remotePortfolios = await getExplorePortfolios();
        setPortfolios(remotePortfolios);
      } catch (error) {
        console.error("Error cargando portafolios:", error);
        if (!isMounted) return;

        setPortfolios([]);
      }
    };

    void fetchPortfolios();

    return () => {
      isMounted = false;
    };
  }, []);

  // Mock temporal de referencia sin Backend
  // const mockData = Array(20).fill(null).map((_, i) => ({
  //   id: `${i}`,
  //   fullName: i % 2 === 0 ? "María García" : "Carlos Martínez",
  //   occupation: i % 2 === 0 ? "Full Stack Developer" : "Mobile Developer",
  //   profileImage: `https://i.pravatar.cc/150?u=${i}`,
  //   projectsCount: 5,
  //   skillsCount: 10,
  //   topSkills: ["React", "Node.js", "Tailwind"]
  // });

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

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {currentData.map((portfolio) => (
                <div 
                  key={portfolio.id} 
                  className="group mx-auto flex w-full max-w-md items-center gap-4 rounded-2xl bg-white p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:border-[#4982AD]/30"  >
                  <div className="shrink-0">
                    <img 
                      src={portfolio.profileImage} 
                      className="size-16 rounded-full object-cover ring-2 ring-[#FDF8F0] md:size-18" 
                      alt="Perfil" />
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

                  <Button asChild className="shrink-0 h-8 px-3 rounded-lg bg-[#003A6C] hover:bg-[#c4a57c] text-white transition-colors flex items-center gap-2 text-xs font-bold">
                    <a href={getPortfolioApiDetailUrl(portfolio.id)}>
                      Ver <Eye className="size-4" />
                    </a>
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
                disabled={currentPage === totalPages}
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