import { useNavigate } from "react-router-dom";
import { Footer } from "@/components/Footer";
import Header from "@/components/HeaderUser";
import Sidebar from "@/components/Sidebar";

export default function PublishedPortfolioWarning() {
  const navigate = useNavigate();

  return (
      <div className="min-h-screen bg-[#F7F0E1] flex flex-col">
        <Header />

        <div className="flex flex-col md:flex-row flex-1">
          <Sidebar />

          <main className="flex-1 p-4 md:p-10">
            <div className="mx-auto max-w-6xl space-y-6">

              <div className="mb-8">
                <h1 className="text-[#003A6C] text-3xl md:text-4xl font-bold mb-2">
                  Configuración de Visibilidad
                </h1>

                <p className="text-sm text-[#4B778D] md:text-base">
                  Elige qué elementos específicos mostrar en tu portafolio
                </p>
              </div>

              <div className="mx-auto max-w-3xl rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">

                <h2 className="text-2xl font-bold text-[#003A6C]">
                  Configuración bloqueada
                </h2>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  No puedes modificar la visibilidad mientras el portafolio
                  esté publicado. Primero debes despublicar el portafolio desde la sección
                  de publicación.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => navigate("/publicar")}
                    className="px-5 py-2.5 rounded-xl bg-[#003A6C] text-white font-bold hover:bg-[#002a4d] transition" >
                    Despublicar portafolio
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>

        <Footer />
      </div>
  );
}