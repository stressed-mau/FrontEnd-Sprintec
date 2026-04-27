import { useEffect, useState } from "react"
import { Footer } from "@/components/Footer"
import Header from "../components/HeaderUser"
import Sidebar from "../components/Sidebar"
import { Palette } from "lucide-react"
import { usePublishPortfolio } from "../hooks/usePublishPortfolio"
import { usePortfolioVisibility } from "../hooks/usePortfolioVisibility"
import { getAuthSession } from "@/services/auth/auth-storage"
import { getUserInformation } from "@/services/PersonalDataService"

// Componentes de Plantillas y Assets [cite: 1-4]
import ModernTemplate, { type ModernTemplateProfile } from "../components/templates/ModernTemplate"
import MinimalistTemplate from "../components/templates/MinimalistTemplate"
import { CorporatePortfolioTemplate } from "@/components/portfolio/CorporatePortfolioTemplate"
import PortadaModern from "@/assets/images/PortadaModern1.png"
import PortadaMin from "@/assets/images/PortadaMin.png"
import PortadaCorp from "@/assets/images/PortadaCorp.png"

const PortfolioTemplatesPage = () => {
  // Lógica de visibilidad para la vista previa [cite: 1-2]
  const { data } = usePortfolioVisibility()
  
  // Lógica de publicación para persistir la plantilla seleccionada [cite: 4, 105-106]
  const {
    handlePublish,
    checkInitialStatus,
    selectedTemplate: selectedIdFromHook,
    isPublished
  } = usePublishPortfolio()

  // Estados locales para la UI 
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [modernProfile, setModernProfile] = useState<ModernTemplateProfile | null>(null)

  // Definición de plantillas (incluyendo el dbId para el servidor) [cite: 9-13]
  const templates = [
    {
      id: "Moderna",
      dbId: 1,
      title: "Moderna",
      description: "Diseño vibrante con gradientes y animaciones",
      features: ["Gradientes dinámicos", "Efectos glassmorphism", "Animaciones suaves"],
      coverImage: PortadaModern,
    },
    {
      id: "Minimalista",
      dbId: 2,
      title: "Minimalista",
      description: "Diseño limpio enfocado en contenido",
      features: ["Diseño limpio", "Tipografía elegante", "Máxima legibilidad"],
      coverImage: PortadaMin,
    },
    {
      id: "Corporativa",
      dbId: 3,
      title: "Corporativa",
      description: "Diseño profesional y formal",
      features: ["Aspecto profesional", "Estructura formal", "Perfecto para empresas"],
      coverImage: PortadaCorp,
    },
  ]

  // Carga de perfil y estado inicial [cite: 5-8]
  useEffect(() => {
    const loadInitialData = async () => {
      await checkInitialStatus()
      try {
        const session = getAuthSession()
        if (session?.user?.id) {
          const user = await getUserInformation(String(session.user.id))
          setModernProfile({
            fullname: String(user?.fullname ?? ""),
            occupation: String(user?.occupation ?? ""),
            image_url: String(user?.image_url ?? ""),
            residence: String(user?.nationality ?? ""),
            public_email: String(user?.public_email ?? ""),
            phone: String(user?.phone_number ?? ""),
            biography: String(user?.biography ?? ""),
          })
        }
      } catch (error) {
        console.error("Error cargando perfil:", error)
      }
    }
    void loadInitialData()
  }, [])

  // Sincronizar selección visual con datos del servidor [cite: 8-9]
  useEffect(() => {
    if (selectedIdFromHook) {
      const templateMap: Record<number, string> = { 1: "Moderna", 2: "Minimalista", 3: "Corporativa" }
      setSelectedTemplate(templateMap[selectedIdFromHook])
    }
  }, [selectedIdFromHook])

  // Manejador de selección para guardar en DB si ya está publicado
  const handleSelectTemplate = async (templateId: string, dbId: number) => {
    setSelectedTemplate(templateId)
    if (isPublished) {
      // Si el portafolio ya es público, actualizamos la plantilla en el servidor inmediatamente [cite: 107-108]
      await handlePublish(dbId)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F0E1] flex flex-col">
      <Header />
      <div className="flex flex-col md:flex-row flex-1">
        <Sidebar />
        <main className="flex-1 p-4 md:p-10">
          <div className="max-w-5xl mx-auto">
            
            <div className="text-center md:text-left mb-8">
              <h1 className="text-[#003A6C] text-3xl md:text-4xl font-bold mb-2">Plantillas de Portafolio</h1>
              <p className="text-gray-600 text-sm md:text-base">Gestiona el diseño visual de tu portafolio público</p>
            </div>

            {/* BLOQUE SOLICITADO: Interfaz y Lógica Original [cite: 15-39] */}
            <section className="bg-gray-100 rounded-2xl border border-[#C9E1F0] p-6 mb-8 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Palette className="text-purple-600 w-6 h-6 transform scale-x-[-1]" />
                <h2 className="text-[#003A6C] text-base font-semibold">Selecciona tu Plantilla</h2>
              </div>
              <p className="text-[#4982ad] text-base mb-6">
                Elige el diseño que mejor represente tu estilo profesional
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => handleSelectTemplate(template.id, template.dbId)}
                    className={`relative cursor-pointer bg-white rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      selectedTemplate === template.id
                        ? "border-purple-500 ring-2 ring-purple-100"
                        : "border-gray-100 hover:border-gray-200 shadow-sm"
                    }`}
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={template.coverImage}
                        alt={`Vista previa de la plantilla ${template.title}`}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/10" />

                      {selectedTemplate === template.id && (
                        <div className="absolute top-3 right-3 bg-white rounded-full p-1 shadow-md">
                          <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold text-lg text-gray-800 mb-1">{template.title}</h3>
                      <p className="text-sm text-gray-500 mb-4 leading-relaxed">{template.description}</p>

                      <ul className="space-y-2 mb-6">
                        {template.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-600">
                            <svg className="w-3.5 h-3.5 text-purple-500 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (template.id === "Moderna" || template.id === "Minimalista" || template.id === "Corporativa") {
                            setPreviewTemplate(template.id)
                            setShowPreview(true)
                          }
                        }}
                        disabled={template.id !== "Moderna" && template.id !== "Minimalista" && template.id !== "Corporativa"}
                        className={`w-full py-2.5 border rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                          template.id === "Moderna" || template.id === "Minimalista" || template.id === "Corporativa"
                            ? "border-[#77B6E6] bg-[#C2DBED] text-[#003A6C] hover:bg-[#C4A57C]"
                            : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {template.id === "Moderna" || template.id === "Minimalista" || template.id === "Corporativa"
                          ? "Vista Previa"
                          : "Próximamente"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-[#F8F2FF] rounded-xl border border-purple-300 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-base text-purple-900">
                  Plantilla seleccionada: <span className="font-bold">{selectedTemplate || "Ninguna"}</span>
                </p>
              </div>
            </section>
            {/* FIN BLOQUE SOLICITADO */}

          </div>
        </main>
      </div>

      {/* Modal de Vista Previa [cite: 93-103] */}
      {showPreview && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-6xl h-[90vh] bg-white rounded-3xl overflow-hidden flex flex-col shadow-2xl">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
              <div>
                <h3 className="font-bold text-[#003A6C] text-lg">
                  Vista Previa: <span className="text-purple-600">{previewTemplate || "Moderna"}</span>
                </h3>
                <p className="text-xs text-gray-500">Así es como los visitantes verán tu portafolio</p>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 font-bold transition-colors"
              >
                Cerrar
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-gray-50">
              {previewTemplate === "Moderna" ? (
                <ModernTemplate data={data} profile={modernProfile} />
              ) : previewTemplate === "Minimalista" ? (
                <MinimalistTemplate
                  data={data}           
                  profile={modernProfile} 
                  isPreview={true}
                />
              ) : previewTemplate === "Corporativa" ? (
                <CorporatePortfolioTemplate data={data} profile={modernProfile} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  Selecciona una plantilla
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  )
}

export default PortfolioTemplatesPage
