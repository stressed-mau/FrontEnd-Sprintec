import Header from '../components/HeaderUser';
import Sidebar from '../components/Sidebar';
import { Footer } from '@/components/Footer';
import { getAuthSession } from "@/services/auth";
import { FolderGit2, Palette, Share2, Info } from "lucide-react";

const UserHome = () => {
  const session = getAuthSession();
  const displayName = session?.user?.username ;

  return (
    <div id="userhome-page" className="min-h-screen bg-[#F7F0E1] flex flex-col">
      <Header />

      <div className="flex flex-col md:flex-row flex-1">
        <Sidebar />

        <main id="userhome-main" className="flex-1 p-6 md:p-10">
          <div className="max-w-5xl mx-auto">
            
            <div className="text-center mb-12">
              <h1 className="text-[#003A6C] text-3xl md:text-5xl font-black mb-4">  ¡Bienvenido a PortfolioGen, {displayName}! </h1>
              <p className="text-gray-600 text-lg"> Tu espacio para crear, gestionar y compartir tu portafolio profesional con el mundo  </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              
              <div className="flex flex-row md:flex-col items-center text-left md:text-center rounded-2xl md:rounded-3xl border-2 border-[#C2DBED] bg-white p-4 md:p-8 shadow-sm gap-4 md:gap-0">
                <div className="flex size-12 md:size-16 shrink-0 items-center justify-center rounded-full bg-[#C2DBED]/30 text-[#003A6C] md:mb-4">
                <FolderGit2 className="size-6 md:size-8" />
                </div>
               <div>
                <h3 className="text-lg md:text-xl font-bold text-[#003A6C]">Crea tu portafolio</h3>
                <p className="mt-1 md:mt-2 text-xs md:text-sm text-gray-500"> Organiza tus proyectos y habilidades profesionalmente. </p>
                </div>
              </div>

  
              <div className="flex flex-row md:flex-col items-center text-left md:text-center rounded-2xl md:rounded-3xl border-2 border-[#C2DBED] bg-white p-4 md:p-8 shadow-sm gap-4 md:gap-0">
                <div className="flex size-12 md:size-16 shrink-0 items-center justify-center rounded-full bg-[#C2DBED]/30 text-[#003A6C] md:mb-4">
                  <Palette className="size-6 md:size-8" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-[#003A6C]">Personaliza tu estilo</h3>
                  <p className="mt-1 md:mt-2 text-xs md:text-sm text-gray-500"> Elige plantillas que reflejen tu identidad única. </p>
                </div>
              </div>

              <div className="flex flex-row md:flex-col items-center text-left md:text-center rounded-2xl md:rounded-3xl border-2 border-[#C2DBED] bg-white p-4 md:p-8 shadow-sm gap-4 md:gap-0">
                <div className="flex size-12 md:size-16 shrink-0 items-center justify-center rounded-full bg-[#C2DBED]/30 text-[#003A6C] md:mb-4">
                  <Share2 className="size-6 md:size-8" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-[#003A6C]">Comparte con el mundo</h3>
                  <p className="mt-1 md:mt-2 text-xs md:text-sm text-gray-500"> Publica tu talento y conecta con nuevas oportunidades. </p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl bg-[#EBF5FF] p-6 text-left border-l-8 border-[#003A6C] shadow-sm">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#003A6C] text-white">
                <Info size={20} />
              </div>
              <div>
                <h4 className="font-bold text-[#003A6C] text-lg">  Utiliza el menú lateral para comenzar a gestionar tu portafolio  </h4>
                <p className="mt-1 text-sm text-gray-600">  Accede a todas las secciones desde el menú de navegación para agregar proyectos, habilidades, experiencia y mucho más. Cuando estés listo, publica tu portafolio y compártelo con el mundo. </p>
              </div>
            </div>

          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default UserHome;