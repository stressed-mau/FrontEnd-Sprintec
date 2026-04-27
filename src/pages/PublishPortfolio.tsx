import { useEffect } from "react"
import { Footer } from "@/components/Footer"
import Header from "../components/HeaderUser"
import Sidebar from "../components/Sidebar"
import { Upload, CheckCircle2, Copy } from "lucide-react"
import { usePortfolioVisibility } from "../hooks/usePortfolioVisibility"
import { usePublishPortfolio } from "../hooks/usePublishPortfolio"

const PublishPortfolio = () => {
  const {
    data,
    openSections,
    sectionsArray,
    isLoading,
    isSaving,
    pageError,
    toggleSection,
    handleItemCheck,
    handleBulkSelect,
    getVisibleCountText,
    reloadVisibilityData,
  } = usePortfolioVisibility()
  const hasNoMainItems =
    data.projects.length === 0 &&
    data.skills.length === 0 &&
    data.experience.length === 0 

  // Extraemos los datos del hook de publicación
  const {
    isPublished,
    portfolioUrl,
    handlePublish,
    handleUnpublish,
    loading,
    checkInitialStatus,
    selectedTemplate // ID numérico que viene de la DB
  } = usePublishPortfolio()

  useEffect(() => {
    const syncStatus = async () => {
      await checkInitialStatus();
    };
    void syncStatus();
  }, []);



  const copyToClipboard = () => {
    navigator.clipboard.writeText(portfolioUrl)
    alert("¡Enlace copiado!")
  }
  const templateNames: Record<number, string> = {
    1: "Moderna",
    2: "Minimalista",
    3: "Corporativa"
  };

  const currentTemplateName = selectedTemplate ? templateNames[selectedTemplate] : "Ninguna";

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
                Revisa tu configuración y publica tu portafolio
              </p>
            </div>
            <section className="bg-[#F7F0E1] rounded-2xl border-2 border-[#9EC9E2] overflow-hidden mb-8">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-[#0B3C6D] p-2.5 rounded-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-[#003A6C] text-lg font-semibold">Resumen de Publicación</h2>
                    <p className="text-[#4982ad] text-sm">Vista previa de tu portafolio</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-[#C9E1F0]/50">
                  <div className="bg-[#D1E4F3] rounded-xl p-4 flex items-center justify-between border border-[#A5C8E1]">
                    <div>
                      <p className="text-[#003A6C] text-sm font-normal tracking-wider mb-1">Plantilla seleccionada</p>
                      <p className="text-[#003A6C] font-bold text-sm">{currentTemplateName}</p>
                    </div>
                    {selectedTemplate && (
                      <div className="bg-[#78B6E1] p-1.5 rounded-full">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="mt-6">
                    <p className="text-[#003A6C] font-semibold">Contenido que se publicará</p>
                  </div>
                </div>
              </div>
            </section>
            {pageError && (
              <div className="mb-6 rounded-2xl border-2 border-red-400 bg-red-100 px-4 py-4 text-sm text-red-900 font-semibold shadow-md">
                <p className="font-bold mb-2">Error cargando visibilidad:</p>
                <p className="mb-3">{pageError}</p>
                <button
                  type="button"
                  onClick={() => void reloadVisibilityData()}
                  className="rounded-lg bg-red-700 px-3 py-1.5 text-white transition-colors hover:bg-red-800"
                >
                  Reintentar
                </button>
              </div>
            )}

            <section className="bg-white rounded-2xl border border-[#C9E1F0] p-6 shadow-sm" aria-labelledby="visibility-config-title">
              <h2 id="visibility-config-title" className="text-[#003A6C] text-xl font-bold mb-1">Configuración de Visibilidad</h2>
              <p className="text-gray-500 text-sm mb-6">Elige qué elementos específicos mostrar en tu portafolio</p>
              {(isLoading || isSaving) && (
                <div className="mb-4 rounded-lg bg-[#F1F7FC] px-4 py-2 text-sm text-[#003A6C]">
                  {isLoading ? "Cargando datos..." : "Guardando cambios de visibilidad..."}
                </div>
              )}

              <div className="space-y-6">
                {hasNoMainItems && !isLoading && (
                  <div className="rounded-xl border border-dashed border-[#C9E1F0] bg-[#F8FBFE] px-4 py-3 text-center text-sm text-gray-500">
                    No hay elementos para mostrar en este momento.
                  </div>
                )}

                {sectionsArray.map((sectionConfig) => {
                  
                  const sectionKey = sectionConfig.key
                  const isOpen = openSections[sectionKey]
                  const items = data[sectionKey]
                  const countText = getVisibleCountText(sectionKey)
                  const sectionEnabled = items.some((item) => item.checked)

                  return (
                    <div key={sectionKey} className="border border-[#C9E1F0] rounded-xl overflow-hidden bg-white">
                      <div className="flex items-center justify-between p-4 border-b border-[#C9E1F0]">
                        <div className="flex items-center gap-3">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={sectionEnabled}
                              disabled={isLoading || isSaving}
                              onChange={() => void handleBulkSelect(sectionKey, !sectionEnabled)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#003A6C]"></div>
                          </label>
                          <span className="text-[#003A6C] font-semibold">{sectionConfig.title}</span>
                          <span className="text-gray-400 text-sm ml-2">{countText}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleSection(sectionKey)}
                          className="text-gray-400 p-1 hover:bg-gray-100 rounded-full transition-colors"
                          aria-label={isOpen ? "Cerrar sección" : "Abrir sección"}
                        >
                          <svg className={`w-5 h-5 transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>

                      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-250 opacity-100 pointer-events-auto" : "max-h-0 opacity-0 pointer-events-none"}`}>
                        <div className="p-4 bg-white border-t border-[#C9E1F0]">
                          <div className="flex gap-2 mb-4">
                            <button
                              disabled={isLoading || isSaving}
                              onClick={() => void handleBulkSelect(sectionKey, true)}
                              className="px-4 py-1.5 text-sm bg-[#C9E1F0] text-[#003A6C] hover:bg-[#C4A57C] rounded-md font-medium hover:bg-opacity-80 transition-colors"
                            >
                              Seleccionar todos
                            </button>
                            <button
                              disabled={isLoading || isSaving}
                              onClick={() => void handleBulkSelect(sectionKey, false)}
                              className="px-4 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md font-medium hover:bg-[#C4A57C] transition-colors"
                            >
                              Deseleccionar todos
                            </button>
                          </div>

                          <div className="space-y-4 ml-2">
                            {items.length === 0 && (
                              <p className="text-sm text-gray-400">No hay elementos para mostrar en esta sección.</p>
                            )}
                            {items.map((item) => (
                              <div key={item.id} className="flex items-center gap-3">
                                <input 
                                  type="checkbox" 
                                  checked={item.checked} 
                                  disabled={isLoading || isSaving}
                                  onChange={() => void handleItemCheck(sectionKey, item.id)}
                                  className="w-5 h-5 text-[#003A6C] border-gray-300 rounded focus:ring-[#003A6C] focus:ring-2 cursor-pointer"
                                />
                                <div className="flex flex-col md:flex-row md:items-baseline md:gap-2">
                                  <span className="text-[#003A6C] font-medium">{item.label}</span>
                                  {item.sublabel && <span className="text-gray-400 text-sm">{item.sublabel}</span>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            {!isPublished ? (
              <div className="bg-white rounded-2xl border border-[#C9E1F0] p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 mt-8">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 p-4 rounded-full">
                    <Upload className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-[#003A6C] text-lg font-bold">Portafolio no publicado</h3>
                    <p className="text-gray-500 text-sm">Tu portafolio no es visible públicamente</p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <button
                    disabled={!selectedTemplate || loading}
                      onClick={() => {
                        if (!selectedTemplate) return;
                        void handlePublish(selectedTemplate);
                      }}
                      className={`bg-[#003A6C] text-white px-6 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all shadow-lg active:scale-95 ${
                        loading || !selectedTemplate
                          ? "opacity-40 cursor-not-allowed grayscale"
                          : "hover:bg-[#002a4d] hover:shadow-blue-900/20"
                      }`}
                  >
                    {loading ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <Upload className="w-5 h-5" />
                    )}
                    <span>{loading ? "Publicando..." : "Publicar portafolio"}</span>
                  </button>

                  {!selectedTemplate && !loading && (
                    <p className="text-xs text-blue-600 font-medium animate-pulse text-center">
                      * Ve a la pestaña "Plantillas" para elegir un diseño <br /> y activar la publicación
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-[#E7F6EC] border border-[#34A853] rounded-2xl p-6 flex items-center justify-between shadow-sm mt-8">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#34A853] p-2 rounded-full">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-[#003A6C] text-lg font-bold">Portafolio publicado</h3>
                      <p className="text-gray-500 text-sm">Tu portafolio es visible para todos</p>
                    </div>
                  </div>

                  <button
                    disabled={loading}
                      onClick={() => {
                        // CAMBIO: Usamos selectedTemplate
                        if (!selectedTemplate) return;
                        void handleUnpublish(selectedTemplate);
                      }}
                    className={`border border-[#4982ad] bg-[#C2DBED] text-[#003A6C] px-6 py-2 rounded-lg font-semibold text-sm transition-all ${
                      loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#c4a57c]"
                    }`}
                  >
                    {loading ? "Procesando..." : "Despublicar"}
                  </button>
                </div>

                <div className="bg-[#F1F7FC] border border-[#C9E1F0] rounded-2xl p-8 text-center shadow-inner">
                  <h4 className="text-[#003A6C] font-bold text-lg mb-2">Tu portafolio está en línea</h4>
                  <p className="text-gray-500 text-sm mb-6">Comparte tu enlace para que otros vean tu trabajo</p>

                  <div className="flex flex-col items-center text-center gap-4 max-w-3xl mx-auto">
                    <div className="flex-1 bg-white border border-[#C9E1F0] rounded-xl px-4 py-3 text-blue-500 break-all text-sm font-medium w-full text-left">
                      {portfolioUrl}
                    </div>
                    <button
                      onClick={copyToClipboard}
                      className="bg-[#C2DBED] text-[#003A6C] text-sm px-6 py-1.5 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#b0cfeb] transition-all border border-[#77B6E6] w-full md:w-auto justify-center"
                    >
                      <Copy className="w-4 h-4" />
                      Copiar enlace
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
