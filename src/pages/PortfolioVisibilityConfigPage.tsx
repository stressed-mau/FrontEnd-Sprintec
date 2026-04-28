import Header from "@/components/HeaderUser"
import Sidebar from "@/components/Sidebar"
import { Footer } from "@/components/Footer"
import { usePortfolioVisibility } from "../hooks/usePortfolioVisibility"
import { type VisibilityItem } from "@/services/portfolioVisibilityService"

const PortfolioVisibilityConfigPage = () => {
  // Trasladamos el hook y sus funciones
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

  return (
    <div className="min-h-screen bg-[#F7F0E1] flex flex-col">
      <Header />

      <div className="flex flex-1 flex-col lg:flex-row">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 md:p-10">
          <div className="mx-auto max-w-5xl">
            {/* Cabecera de la sección */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#003A6C] md:text-4xl">Configuración de visibilidad</h1>
              <p className="mt-2 text-sm text-[#4B778D] md:text-base">
                Elige qué elementos específicos mostrar u ocultar en tu portafolio público.
              </p>
            </div>

            {/* Manejo de Errores */}
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

            {/* Estado de Carga */}
            {(isLoading || isSaving) && (
              <div className="mb-4 rounded-lg bg-[#F1F7FC] px-4 py-2 text-sm text-[#003A6C] animate-pulse">
                {isLoading ? "Cargando datos..." : "Guardando cambios..."}
              </div>
            )}

            {/* Bloque Principal de Configuración */}
            <section className="bg-white rounded-2xl border border-[#C9E1F0] p-6 shadow-sm">
              <div className="space-y-6">
                {hasNoMainItems && !isLoading && (
                  <div className="rounded-xl border border-dashed border-[#C9E1F0] bg-[#F8FBFE] px-4 py-3 text-center text-sm text-gray-500">
                    No hay elementos (proyectos, habilidades o experiencia) para configurar.
                  </div>
                )}

                {sectionsArray.map((sectionConfig) => {
                  const sectionKey = sectionConfig.key
                  const isOpen = openSections[sectionKey]
                  const items = data[sectionKey]
                  const countText = getVisibleCountText(sectionKey)
                  const sectionEnabled = items.some((item: VisibilityItem) => item.checked)

                  return (
                    <div key={sectionKey} className="border border-[#C9E1F0] rounded-xl overflow-hidden bg-white shadow-sm">
                      {/* Header de cada sección (Acordeón) */}
                      <div className="flex items-center justify-between p-4 border-b border-[#C9E1F0] bg-gray-50/50">
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
                        >
                          <svg className={`w-5 h-5 transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>

                      {/* Contenido Desplegable */}
                      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-250 opacity-100" : "max-h-0 opacity-0"}`}>
                        <div className="p-4 bg-white border-t border-[#C9E1F0]">
                          <div className="flex gap-2 mb-4">
                            <button
                              disabled={isLoading || isSaving}
                              onClick={() => void handleBulkSelect(sectionKey, true)}
                              className="px-4 py-1.5 text-sm bg-[#C9E1F0] text-[#003A6C] hover:bg-[#A5D7E8] rounded-md font-medium transition-colors"
                            >
                              Seleccionar todos
                            </button>
                            <button
                              disabled={isLoading || isSaving}
                              onClick={() => void handleBulkSelect(sectionKey, false)}
                              className="px-4 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md font-medium hover:bg-gray-200 transition-colors"
                            >
                              Deseleccionar todos
                            </button>
                          </div>

                          <div className="space-y-4 ml-2">
                            {items.length === 0 && (
                              <p className="text-sm text-gray-400 italic">No hay elementos registrados en esta sección.</p>
                            )}
                            {items.map((item: VisibilityItem) => (
                              <div key={item.id} className="flex items-center gap-3 group">
                                <input 
                                  type="checkbox" 
                                  checked={item.checked} 
                                  disabled={isLoading || isSaving}
                                  onChange={() => void handleItemCheck(sectionKey, item.id)}
                                  className="w-5 h-5 text-[#003A6C] border-gray-300 rounded focus:ring-[#003A6C] cursor-pointer"
                                />
                                <div className="flex flex-col md:flex-row md:items-baseline md:gap-2">
                                  <span className="text-[#003A6C] font-medium group-hover:text-blue-700">{item.label}</span>
                                  {item.sublabel && <span className="text-gray-400 text-xs">{item.sublabel}</span>}
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
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}

export default PortfolioVisibilityConfigPage