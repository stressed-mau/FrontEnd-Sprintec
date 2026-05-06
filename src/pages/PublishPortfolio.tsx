import { useEffect } from "react"
import { Footer } from "@/components/Footer"
import Header from "../components/HeaderUser"
import Sidebar from "../components/Sidebar"
import { Upload, CheckCircle2, Copy } from "lucide-react"
import { usePublishPortfolio } from "../hooks/usePublishPortfolio"

const PublishPortfolio = () => {
  // Ahora solo usamos el hook de publicación
  const {
    isPublished,
    portfolioUrl,
    handlePublish,
    handleUnpublish,
    loading,
    checkInitialStatus,
    selectedTemplate 
  } = usePublishPortfolio()

  useEffect(() => {
    console.log("SE EJECUTA useEffect");
    const syncStatus = async () => {
      console.log("LLAMANDO checkInitialStatus");
      await checkInitialStatus();
    };
    void syncStatus();
  }, []);
  const publicUrl = portfolioUrl ? portfolioUrl.replace('/api', '') : "";
  const copyToClipboard = () => {
    navigator.clipboard.writeText(portfolioUrl)
    alert("¡Enlace copiado!")
  }

  const templateNames: Record<number, string> = {
    1: "Moderna",
    2: "Minimalista",
    3: "Corporativa"
  };

  const currentTemplateName = selectedTemplate ? templateNames[selectedTemplate] : "Ninguna seleccionada";

  return (
    <div id="publishportfolio-page" className="min-h-screen bg-[#F7F0E1] flex flex-col">
      <Header />

      <div className="flex flex-col md:flex-row flex-1">
        <Sidebar />

        <main id="publishportfolio-main" className="flex-1 p-4 md:p-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center md:text-left mb-8">
              <h1 className="text-[#003A6C] text-3xl md:text-4xl font-bold mb-2">Publicar Portafolio</h1>
              <p className="text-gray-600 text-sm md:text-base">
                Finaliza la configuración y lanza tu portafolio al mundo.
              </p>
            </div>

            {/* Sección de Resumen de Plantilla */}
            <section className="bg-white rounded-3xl border-2 border-[#9EC9E2] overflow-hidden mb-8 shadow-sm">
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-[#0B3C6D] p-3 rounded-xl">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-[#003A6C] text-xl font-bold">Resumen de Publicación</h2>
                    <p className="text-[#4982ad] text-sm">Verifica los detalles antes de publicar</p>
                  </div>
                </div>

                <div className="bg-[#F1F7FC] rounded-2xl p-6 border border-[#C9E1F0]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#003A6C] text-xs font-bold uppercase tracking-wider mb-1 opacity-70">Plantilla Actual</p>
                      <p className="text-[#003A6C] font-extrabold text-lg">{currentTemplateName}</p>
                    </div>
                    <div className={`p-2 rounded-full ${selectedTemplate ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                  </div>
                  
                  {!selectedTemplate && (
                    <p className="mt-4 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100">
                      No has seleccionado una plantilla. Ve a la sección de <strong>Plantillas</strong> para elegir una.
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Estado de Publicación */}
            {!isPublished ? (
              <div className="bg-white rounded-[2rem] border border-[#C9E1F0] p-10 shadow-sm flex flex-col items-center text-center space-y-6">
                <div className="bg-gray-50 p-6 rounded-full border-2 border-dashed border-gray-200">
                  <Upload className="w-10 h-10 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-[#003A6C] text-2xl font-bold">¿Listo para despegar?</h3>
                  <p className="text-gray-500 max-w-md mx-auto mt-2">
                    Una vez publicado, tu portafolio será accesible mediante un enlace único que podrás compartir con reclutadores.
                  </p>
                </div>

                <button
                  disabled={!selectedTemplate || loading}
                  onClick={() => {
                    if (!selectedTemplate) return;
                    void handlePublish(selectedTemplate);
                  }}
                  className={`group relative flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-white transition-all shadow-xl active:scale-95 ${
                    loading || !selectedTemplate
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#003A6C] hover:bg-[#002a4d] hover:-translate-y-1"
                  }`}
                >
                  {loading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Upload className="w-5 h-5 group-hover:bounce" />
                  )}
                  <span>{loading ? "Publicando..." : "Publicar Portafolio Ahora"}</span>
                </button>
              </div>
            ) : (
              /* Sección cuando ya está publicado */
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="bg-[#E7F6EC] border border-[#34A853] rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                  <div className="flex items-center gap-5">
                    <div className="bg-[#34A853] p-3 rounded-2xl shadow-lg shadow-green-200">
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-center md:text-left">
                      <h3 className="text-[#003A6C] text-xl font-bold">¡Tu portafolio está en vivo!</h3>
                      <p className="text-green-700 font-medium">Estado: Público y Activo</p>
                    </div>
                  </div>

                  <button
                    disabled={loading}
                    onClick={() => {
                      if (!selectedTemplate) return;
                      void handleUnpublish(selectedTemplate);
                    }}
                    className="bg-white text-red-500 border-2 border-red-100 px-6 py-3 rounded-xl font-bold hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    {loading ? "Procesando..." : "Despublicar"}
                  </button>
                </div>

                <div className="bg-white border border-[#C9E1F0] rounded-[2rem] p-10 text-center shadow-sm">
                  <h4 className="text-[#003A6C] font-bold text-xl mb-4">Comparte tu éxito</h4>
                  <div className="flex flex-col md:flex-row items-center gap-4 max-w-2xl mx-auto bg-[#F8FAFC] p-4 rounded-2xl border border-gray-100">
                    <div className="flex-1 text-blue-600 truncate font-mono text-sm px-2 w-full text-center md:text-left">
                      {portfolioUrl}
                    </div>
                    <button
                      onClick={copyToClipboard}
                      className="bg-[#C2DBED] text-[#003A6C] px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#b0cfeb] transition-all whitespace-nowrap w-full md:w-auto justify-center"
                    >
                      <Copy className="w-5 h-5" />
                      Copiar Enlace
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default PublishPortfolio