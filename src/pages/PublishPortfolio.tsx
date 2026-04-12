import { useEffect, useState } from "react"
import { CheckCircle2, Copy, Palette, Upload, X } from "lucide-react"

import Header from "../components/HeaderUser"
import Sidebar from "../components/Sidebar"
import {
  CorporatePortfolioTemplate,
  type CorporatePortfolioData,
} from "@/components/portfolio/CorporatePortfolioTemplate"
import ModernTemplate, { type ModernTemplateProfile } from "../components/templates/ModernTemplate"
import { usePortfolioVisibility } from "../hooks/usePortfolioVisibility"
import { usePublishPortfolio } from "../hooks/usePublishPortfolio"
import { getUserInformation } from "@/services/PersonalDataService"
import { getAuthSession } from "@/services/auth/auth-storage"

const CORPORATE_PREVIEW_DATA: CorporatePortfolioData = {
  fullName: "Maria Victoria Grageda Vallejos",
  role: "Ing. en Informatica",
  summary: "",
  email: "correo@ejemplo.com",
  location: "Tu ubicacion ira aqui",
  socialLinks: [
    {
      id: "network-1",
      label: "Red profesional",
      url: "https://ejemplo.com/perfil",
    },
  ],
  skills: ["Skill 1", "Skill 2", "Skill 3"],
  experience: [
    {
      id: "exp-1",
      title: "Cargo o experiencia",
      organization: "Empresa u organizacion",
      period: "2023 - Actualidad",
      description: "Describe aqui tu experiencia de forma breve y profesional.",
    },
  ],
  education: [
    {
      id: "edu-1",
      title: "Carrera o formacion",
      institution: "Institucion educativa",
      period: "2018 - 2023",
    },
  ],
  projects: [
    {
      id: "pro-1",
      name: "Proyecto destacado",
      description: "Explica aqui el impacto o la funcion principal de tu proyecto.",
      stack: ["Tecnologia 1", "Tecnologia 2"],
    },
  ],
}

const templates = [
  {
    id: "Moderna",
    title: "Moderna",
    description: "Diseno vibrante con gradientes y animaciones",
    features: ["Gradientes dinamicos", "Efectos glassmorphism", "Animaciones suaves"],
    colorClass: "from-blue-500 to-pink-500",
    previewEnabled: true,
  },
  {
    id: "Minimalista",
    title: "Minimalista",
    description: "Diseno limpio enfocado en contenido",
    features: ["Diseno limpio", "Tipografia elegante", "Maxima legibilidad"],
    colorClass: "from-gray-200 to-gray-300",
    previewEnabled: false,
  },
  {
    id: "Corporativa",
    title: "Corporativa",
    description: "Diseno profesional y formal",
    features: ["Aspecto profesional", "Estructura formal", "Perfecto para empresas"],
    colorClass: "from-blue-600 to-blue-900",
    previewEnabled: true,
  },
] as const

const TEMPLATE_IDS = {
  Moderna: 1,
  Minimalista: 2,
  Corporativa: 3,
} as const

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

  const {
    isPublished,
    portfolioUrl,
    loading: publishLoading,
    error: publishError,
    handlePublish,
    handleUnpublish,
  } = usePublishPortfolio()

  const visibleSections = sectionsArray.filter((sectionConfig) => data[sectionConfig.key].length > 0)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null)
  const [copiedLink, setCopiedLink] = useState(false)
  const [profileData, setProfileData] = useState<ModernTemplateProfile | null>(null)

  const selectedTemplateNumber =
    selectedTemplate != null
      ? TEMPLATE_IDS[selectedTemplate as keyof typeof TEMPLATE_IDS] ?? null
      : null

  function handlePreview(templateId: string) {
    setSelectedTemplate(templateId)
    setPreviewTemplate(templateId)
  }

  function closePreview() {
    setPreviewTemplate(null)
  }

  useEffect(() => {
    async function loadProfile() {
      const session = getAuthSession()

      if (!session?.user?.id) {
        return
      }

      try {
        const profile = await getUserInformation(session.user.id)

        setProfileData({
          fullname: profile?.fullname ?? "",
          occupation: profile?.occupation ?? "",
          image_url: profile?.image_url ?? "",
          residence: profile?.nationality ?? "",
          public_email: profile?.public_email ?? "",
          phone: profile?.phone_number ?? "",
          biography: profile?.biography ?? "",
        })
      } catch {
        setProfileData(null)
      }
    }

    void loadProfile()
  }, [])

  async function copyToClipboard() {
    if (!portfolioUrl) {
      return
    }

    try {
      await navigator.clipboard.writeText(portfolioUrl)
      setCopiedLink(true)
      window.setTimeout(() => setCopiedLink(false), 2000)
    } catch {
      setCopiedLink(false)
    }
  }

  async function handlePublishClick() {
    if (!selectedTemplateNumber) {
      return
    }

    await handlePublish(selectedTemplateNumber)
  }

  async function handleUnpublishClick() {
    if (!selectedTemplateNumber) {
      return
    }

    await handleUnpublish(selectedTemplateNumber)
  }

  function renderPreviewContent() {
    if (previewTemplate === "Moderna") {
      return <ModernTemplate data={data} profile={profileData} />
    }

    if (previewTemplate === "Corporativa") {
      return <CorporatePortfolioTemplate data={CORPORATE_PREVIEW_DATA} />
    }

    return (
      <div className="flex min-h-105 flex-col items-center justify-center gap-4 text-center text-gray-400">
        <Palette size={48} className="opacity-20" />
        <p>No hay vista previa disponible para esta plantilla.</p>
      </div>
    )
  }

  return (
    <div id="publishportfolio-page" className="min-h-screen bg-[#F7F0E1]">
      <Header />

      <div className="flex flex-col md:flex-row">
        <Sidebar />

        <main id="publishportfolio-main" className="flex-1 p-4 md:p-10">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 text-center md:text-left">
              <h1 className="mb-2 text-3xl font-bold text-[#003A6C] md:text-4xl">Publicar Portafolio</h1>
              <p className="text-sm text-gray-600 md:text-base">
                Configura tu portafolio, elige una plantilla y publicalo
              </p>
            </div>

            <section className="mb-8 rounded-2xl border border-[#C9E1F0] bg-gray-100 p-6 shadow-sm">
              <div className="mb-1 flex items-center gap-2">
                <Palette className="h-6 w-6 scale-x-[-1] text-purple-600" />
                <h2 className="text-base font-semibold text-[#003A6C]">Selecciona tu Plantilla</h2>
              </div>
              <p className="mb-6 text-base text-[#4982ad]">
                Elige el diseno que mejor represente tu estilo profesional
              </p>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`relative cursor-pointer overflow-hidden rounded-xl border-2 bg-white transition-all duration-300 ${
                      selectedTemplate === template.id
                        ? "border-purple-500 ring-2 ring-purple-100"
                        : "border-gray-100 shadow-sm hover:border-gray-200"
                    }`}
                  >
                    <div
                      className={`relative flex h-32 items-center justify-center bg-linear-to-br ${template.colorClass}`}
                    >
                      <svg
                        className="h-10 w-10 text-white opacity-40"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                        />
                      </svg>

                      {selectedTemplate === template.id ? (
                        <div className="absolute right-3 top-3 rounded-full bg-white p-1 shadow-md">
                          <svg className="h-5 w-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      ) : null}
                    </div>

                    <div className="p-4">
                      <h3 className="mb-1 text-lg font-bold text-gray-800">{template.title}</h3>
                      <p className="mb-4 text-sm leading-relaxed text-gray-500">{template.description}</p>

                      <ul className="mb-6 space-y-2">
                        {template.features.map((feature) => (
                          <li key={feature} className="flex items-center text-sm text-gray-600">
                            <svg
                              className="mr-2 h-3.5 w-3.5 shrink-0 text-purple-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                          if (template.previewEnabled) {
                            handlePreview(template.id)
                          }
                        }}
                        disabled={!template.previewEnabled}
                        className={`flex w-full items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-semibold transition-colors ${
                          template.previewEnabled
                            ? "border-[#77B6E6] bg-[#C2DBED] text-[#003A6C] hover:bg-[#C4A57C]"
                            : "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                        }`}
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        {template.previewEnabled ? "Vista Previa" : "Proximamente"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-2 rounded-xl border border-purple-300 bg-[#F8F2FF] p-4">
                <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-base text-purple-900">
                  Plantilla seleccionada: <span className="font-bold">{selectedTemplate ?? "Ninguna"}</span>
                </p>
              </div>
            </section>

            {pageError ? (
              <div className="mb-6 rounded-2xl border-2 border-red-400 bg-red-100 px-4 py-4 text-sm font-semibold text-red-900 shadow-md">
                <p className="mb-2 font-bold">Error cargando visibilidad:</p>
                <p className="mb-3">{pageError}</p>
                <button
                  type="button"
                  onClick={() => void reloadVisibilityData()}
                  className="rounded-lg bg-red-700 px-3 py-1.5 text-white transition-colors hover:bg-red-800"
                >
                  Reintentar
                </button>
              </div>
            ) : null}

            {publishError ? (
              <div className="mb-6 rounded-2xl border-2 border-red-400 bg-red-100 px-4 py-4 text-sm font-semibold text-red-900 shadow-md">
                <p className="mb-2 font-bold">Error publicando el portafolio:</p>
                <p>{publishError}</p>
              </div>
            ) : null}

            <section
              className="rounded-2xl border border-[#C9E1F0] bg-white p-6 shadow-sm"
              aria-labelledby="visibility-config-title"
            >
              <h2 id="visibility-config-title" className="mb-1 text-xl font-bold text-[#003A6C]">
                Configuracion de Visibilidad
              </h2>
              <p className="mb-6 text-sm text-gray-500">
                Elige que elementos especificos mostrar en tu portafolio
              </p>

              {isLoading || isSaving ? (
                <div className="mb-4 rounded-lg bg-[#F1F7FC] px-4 py-2 text-sm text-[#003A6C]">
                  {isLoading ? "Cargando datos..." : "Guardando cambios de visibilidad..."}
                </div>
              ) : null}

              <div className="space-y-6">
                {visibleSections.length === 0 && !isLoading ? (
                  <div className="rounded-xl border border-dashed border-[#C9E1F0] bg-[#F8FBFE] px-4 py-8 text-center text-sm text-gray-500">
                    No hay elementos para mostrar en este momento.
                  </div>
                ) : null}

                {visibleSections.map((sectionConfig) => {
                  const sectionKey = sectionConfig.key
                  const isOpen = openSections[sectionKey]
                  const items = data[sectionKey]
                  const countText = getVisibleCountText(sectionKey)
                  const sectionEnabled = items.some((item) => item.checked)

                  return (
                    <div key={sectionKey} className="overflow-hidden rounded-xl border border-[#C9E1F0] bg-white">
                      <div className="flex items-center justify-between border-b border-[#C9E1F0] p-4">
                        <div className="flex items-center gap-3">
                          <label className="relative inline-flex cursor-pointer items-center">
                            <input
                              type="checkbox"
                              className="peer sr-only"
                              checked={sectionEnabled}
                              disabled={isLoading || isSaving}
                              onChange={() => void handleBulkSelect(sectionKey, !sectionEnabled)}
                            />
                            <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#003A6C] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none" />
                          </label>
                          <span className="font-semibold text-[#003A6C]">{sectionConfig.title}</span>
                          <span className="ml-2 text-sm text-gray-400">{countText}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleSection(sectionKey)}
                          disabled={isLoading}
                          className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100"
                          aria-label={isOpen ? "Cerrar seccion" : "Abrir seccion"}
                        >
                          <svg
                            className={`h-5 w-5 transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>

                      <div
                        className={`transition-all duration-300 ease-in-out ${isOpen ? "max-h-250 opacity-100" : "max-h-0 opacity-0"}`}
                      >
                        <div className="border-t border-[#C9E1F0] bg-white p-4">
                          <div className="mb-4 flex gap-2">
                            <button
                              type="button"
                              disabled={isLoading || isSaving}
                              onClick={() => void handleBulkSelect(sectionKey, true)}
                              className="rounded-md bg-[#C9E1F0] px-4 py-1.5 text-sm font-medium text-[#003A6C] transition-colors hover:bg-[#C4A57C] hover:bg-opacity-80"
                            >
                              Seleccionar todos
                            </button>
                            <button
                              type="button"
                              disabled={isLoading || isSaving}
                              onClick={() => void handleBulkSelect(sectionKey, false)}
                              className="rounded-md bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-[#C4A57C]"
                            >
                              Deseleccionar todos
                            </button>
                          </div>

                          <div className="ml-2 space-y-4">
                            {items.map((item) => (
                              <div key={item.id} className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  checked={item.checked}
                                  disabled={isLoading || isSaving}
                                  onChange={() => void handleItemCheck(sectionKey, item.id)}
                                  className="h-5 w-5 cursor-pointer rounded border-gray-300 text-[#003A6C] focus:ring-2 focus:ring-[#003A6C]"
                                />
                                <div className="flex flex-col md:flex-row md:items-baseline md:gap-2">
                                  <span className="font-medium text-[#003A6C]">{item.label}</span>
                                  <span className="text-sm text-gray-400">{item.sublabel}</span>
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
              <section className="mt-8 flex flex-col items-center justify-between gap-6 rounded-2xl border border-[#C9E1F0] bg-white p-8 shadow-sm md:flex-row">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-gray-100 p-4">
                    <Upload className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#003A6C]">Portafolio no publicado</h3>
                    <p className="text-sm text-gray-500">Tu portafolio no es visible publicamente</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => void handlePublishClick()}
                  disabled={!selectedTemplateNumber || publishLoading}
                  className="flex items-center gap-2 rounded-lg bg-[#003A6C] px-5 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#002a4d] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Upload className="h-5 w-5" />
                  {publishLoading ? "Publicando..." : "Publicar portafolio"}
                </button>
              </section>
            ) : (
              <section className="mt-8 space-y-6">
                <div className="flex items-center justify-between rounded-2xl border border-[#34A853] bg-[#E7F6EC] p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-[#34A853] p-2">
                      <CheckCircle2 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#003A6C]">Portafolio publicado</h3>
                      <p className="text-sm text-gray-500">Tu portafolio es visible para todos</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => void handleUnpublishClick()}
                    disabled={!selectedTemplateNumber || publishLoading}
                    className="rounded-lg border border-[#4982ad] bg-[#C2DBED] px-6 py-2 text-sm font-semibold text-[#003A6C] transition-all hover:bg-[#c4a57c] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {publishLoading ? "Despublicando..." : "Despublicar"}
                  </button>
                </div>

                <div className="rounded-2xl border border-[#C9E1F0] bg-[#F1F7FC] p-8 text-center shadow-inner">
                  <h4 className="mb-2 text-lg font-bold text-[#003A6C]">Tu portafolio esta en linea</h4>
                  <p className="mb-6 text-sm text-gray-500">Comparte tu enlace para que otros vean tu trabajo</p>

                  <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
                    <div className="w-full break-all rounded-xl border border-[#C9E1F0] bg-white px-4 py-3 text-left text-sm font-medium text-blue-500">
                      {portfolioUrl}
                    </div>

                    <button
                      type="button"
                      onClick={() => void copyToClipboard()}
                      disabled={!portfolioUrl}
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#77B6E6] bg-[#C2DBED] px-6 py-1.5 text-sm font-semibold text-[#003A6C] transition-all hover:bg-[#b0cfeb] disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
                    >
                      <Copy className="h-4 w-4" />
                      {copiedLink ? "Enlace copiado" : "Copiar enlace"}
                    </button>
                  </div>
                </div>
              </section>
            )}
          </div>
        </main>
      </div>

      {previewTemplate ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-6 backdrop-blur-sm">
          <div className="relative flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-[2rem] bg-[#F7F0E1] shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-[#C9E1F0] bg-white px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-2xl font-bold text-[#003A6C]">Vista previa</h2>
                <p className="text-sm text-gray-600">
                  {previewTemplate === "Corporativa"
                    ? "Esta vista usa datos ficticios."
                    : `Asi es como los visitantes veran tu portafolio en ${previewTemplate}.`}
                </p>
              </div>

              <button
                type="button"
                onClick={closePreview}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C9E1F0] bg-white text-[#003A6C] shadow-sm transition hover:bg-[#EEF5F9]"
                aria-label="Cerrar vista previa"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6">{renderPreviewContent()}</div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default PublishPortfolio
