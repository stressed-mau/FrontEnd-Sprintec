import Header from '../components/HeaderUser';
import Sidebar from '../components/Sidebar';
import { Footer } from '@/components/Footer';
import { getAuthSession } from "@/services/auth";
import { AlertTriangle, FolderGit2, Palette, Share2, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserPersonalData } from "@/hooks/useUserPersonalData";
import { REGISTER_PROFILE_ROUTE } from "@/routes/route-paths";

const UserHome = () => {
  const session = getAuthSession();
  const displayName = session?.user?.username ;
  const { loading, hasPersonalData } = useUserPersonalData();

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

            {!loading && !hasPersonalData ? (
              <div className="mb-8 flex flex-col gap-4 rounded-2xl border-2 border-[#F97316] bg-gradient-to-r from-[#FFF1E6] via-[#FFE4E6] to-[#FEF3C7] p-5 shadow-lg shadow-orange-900/10 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#DC2626] text-white shadow-md">
                    <AlertTriangle className="size-6" />
                  </div>
                  <div>
                  <h2 className="text-lg font-black text-[#B91C1C]">Completa tus datos personales</h2>
                  <p className="mt-1 text-sm font-medium leading-6 text-[#7C2D12]">
                    Es muy importante finalizar el llenado de tus datos personales. Este registro solo se puede realizar una sola vez.
                  </p>
                  </div>
                </div>
                <Link
                  to={REGISTER_PROFILE_ROUTE}
                  className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-[#EA580C] px-5 text-sm font-bold text-white shadow-md transition-colors hover:bg-[#C2410C]"
                >
                  Registrar datos personales
                </Link>
              </div>
            ) : null}

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
                <p className="mt-1 text-sm text-gray-600">  Accede a todas las secciones desde el menú de navegación para registrar proyectos, habilidades, experiencia y mucho más. Cuando estés listo, publica tu portafolio y compártelo con el mundo. </p>
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
