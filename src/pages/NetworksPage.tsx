import { useEffect, useMemo, useState } from "react"
import {
  BriefcaseBusiness,
  Check,
  CirclePlay,
  ExternalLink,
  FolderGit2,
  Link2,
  Loader2,
  MessageSquare,
  Unplug,
} from "lucide-react"

import Header from "@/components/HeaderUser"
import Sidebar from "@/components/Sidebar"
import { NetworkFormModal } from "@/components/networks/NetworkFormModal"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useNetworksManager } from "@/hooks/useNetworksManager"
import { getSocialConnectUrl } from "@/services/socialNetworksService"

type ProfessionalNetwork = {
  id: string
  name: string
  icon: typeof FolderGit2
  color: string
  lightColor: string
  textColor: string
  description: string
  matchKeys: string[]
}

const PROFESSIONAL_NETWORKS: ProfessionalNetwork[] = [
  {
    id: "github",
    name: "GitHub",
    icon: FolderGit2,
    color: "bg-gray-900 hover:bg-gray-800",
    lightColor: "bg-gray-100",
    textColor: "text-gray-900",
    description: "Conecta tu perfil de desarrollador",
    matchKeys: ["github"],
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: BriefcaseBusiness,
    color: "bg-[#0A66C2] hover:bg-[#004182]",
    lightColor: "bg-blue-100",
    textColor: "text-[#0A66C2]",
    description: "Muestra tu perfil profesional",
    matchKeys: ["linkedin"],
  },
  {
    id: "google",
    name: "YouTube",
    icon: CirclePlay,
    color: "bg-[#FF0000] hover:bg-[#CC0000]",
    lightColor: "bg-red-100",
    textColor: "text-[#FF0000]",
    description: "Comparte tu canal de YouTube",
    matchKeys: ["youtube", "google"],
  },
  {
    id: "reddit",
    name: "Reddit",
    icon: MessageSquare,
    color: "bg-[#FF4500] hover:bg-[#CC3700]",
    lightColor: "bg-orange-100",
    textColor: "text-[#FF4500]",
    description: "Vincula tu perfil de Reddit",
    matchKeys: ["reddit"],
  },
]

const NetworksPage = () => {
  const {
    networks,
    formData,
    errors,
    feedbackMessage,
    feedbackType,
    isModalOpen,
    isSuccessModalOpen,
    isEditing,
    successMessage,
    isLoading,
    openEditModal,
    closeModal,
    closeSuccessModal,
    updateField,
    handleBlur,
    handleSubmit,
    handleDelete,
    loadNetworks,
    showFeedback,
  } = useNetworksManager()
  const [connectingNetwork, setConnectingNetwork] = useState<string | null>(null)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const status = urlParams.get("social_status")
    const provider = urlParams.get("social_provider")
    const message = urlParams.get("social_message")

    if (!status || !provider) {
      return
    }

    const providerLabel =
      PROFESSIONAL_NETWORKS.find((network) => network.id === provider || network.matchKeys.includes(provider))?.name ??
      provider

    if (status === "success") {
      showFeedback(`Conexión exitosa con ${providerLabel}.`, "success")
      void loadNetworks()
    } else {
      showFeedback(
        message ? `Error conectando ${providerLabel}: ${message}` : `Error conectando ${providerLabel}.`,
        "error",
      )
    }

    const nextUrl = `${window.location.origin}${window.location.pathname}`
    window.history.replaceState({}, document.title, nextUrl)
  }, [loadNetworks, showFeedback])

  const connectedNetworks = useMemo(
    () =>
      PROFESSIONAL_NETWORKS.map((network) => ({
        ...network,
        connected: networks.some((item) =>
          network.matchKeys.some((key) => item.name.toLowerCase().includes(key)),
        ),
        data: networks.find((item) =>
          network.matchKeys.some((key) => item.name.toLowerCase().includes(key)),
        ),
        isConnecting: connectingNetwork === network.id,
      })),
    [connectingNetwork, networks],
  )

  function handleOAuthConnect(provider: string) {
    setConnectingNetwork(provider)
    window.location.href = getSocialConnectUrl(provider)
  }

  return (
    <div className="min-h-screen bg-[#F7F0E1]">
      <Header />

      <div className="flex flex-col lg:flex-row">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 md:p-10">
          <div className="mx-auto max-w-5xl space-y-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="mb-2 text-3xl font-bold text-[#111827]">Redes Profesionales</h1>
                <p className="text-sm text-gray-600 sm:text-base">
                  Conecta tus perfiles profesionales de forma segura mediante OAuth
                </p>
              </div>
            </div>

            <Card className="border-blue-200 bg-blue-50/50 py-0">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <Link2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1 font-semibold text-blue-900">Conexión segura mediante OAuth</h3>
                    <p className="text-sm leading-6 text-blue-700">
                      Al conectar tus redes sociales, serás redirigido a la plataforma oficial para autorizar el acceso.
                      Obtendremos automáticamente tu URL de perfil sin necesidad de que la copies manualmente.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {feedbackMessage ? (
              <div
                className={`rounded-2xl border px-4 py-3 text-sm ${
                  feedbackType === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {feedbackMessage}
              </div>
            ) : null}

            <div>
              <h2 className="mb-4 text-lg font-semibold text-[#111827]">Redes disponibles</h2>

              {isLoading ? (
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {PROFESSIONAL_NETWORKS.map((network) => (
                    <Card key={network.id} className="border-gray-200 bg-white py-0">
                      <CardContent className="px-3 pb-4 pt-4 sm:px-6 sm:pb-5 sm:pt-5">
                        <div className="flex animate-pulse flex-col gap-4">
                          <div className="flex items-start gap-3 sm:gap-4">
                            <div className="h-12 w-12 rounded-xl bg-gray-100 sm:h-14 sm:w-14" />
                            <div className="min-w-0 flex-1">
                              <div className="h-5 w-24 rounded bg-gray-100" />
                              <div className="mt-2 h-4 w-full rounded bg-gray-100" />
                            </div>
                          </div>
                          <div className="sm:pl-[4.5rem]">
                            <div className="h-9 rounded bg-gray-100 sm:h-10" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {connectedNetworks.map((network) => {
                    const Icon = network.icon
                    const isConnected = network.connected
                    const isConnecting = network.isConnecting
                    const networkData = network.data

                    return (
                      <Card
                        key={network.id}
                        className={`py-0 transition-all ${
                          isConnected
                            ? "border-green-500 bg-green-50/30"
                            : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                        }`}
                      >
                        <CardContent className="px-3 pb-4 pt-4 sm:px-6 sm:pb-5 sm:pt-5">
                          <div className="flex flex-col gap-4">
                            <div className="flex items-start gap-3 sm:gap-4">
                              <div
                                className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl sm:h-14 sm:w-14 ${network.lightColor}`}
                              >
                                <Icon className={`h-6 w-6 sm:h-7 sm:w-7 ${network.textColor}`} />
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                  <div className="min-w-0">
                                    <h3 className="text-base font-semibold leading-5 text-gray-900 sm:text-lg sm:leading-6">
                                      {network.name}
                                    </h3>
                                    <p className="mt-1 text-xs leading-5 text-gray-600 sm:text-sm">
                                      {network.description}
                                    </p>
                                  </div>

                                  {isConnected ? (
                                    <div className="inline-flex items-center gap-1.5 self-start rounded-full bg-green-100 px-2 py-1 text-green-700">
                                      <Check className="h-3.5 w-3.5" />
                                      <span className="text-xs font-medium">Conectado</span>
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </div>

                            <div className="pl-0 sm:pl-[4.5rem]">
                              {isConnected && networkData ? (
                                <div className="mb-3 rounded-lg border border-gray-200 bg-white p-3 text-left">
                                  <a
                                    href={networkData.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-1.5 text-sm text-gray-700 hover:text-blue-600"
                                  >
                                    <span className="truncate">{networkData.url}</span>
                                    <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                                  </a>
                                </div>
                              ) : null}

                              <div className="flex flex-col gap-2">
                                {isConnected && networkData ? (
                                  <>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => openEditModal(networkData)}
                                      className="h-9 w-full border-gray-200 px-3 text-xs hover:bg-gray-50 sm:h-10 sm:text-sm"
                                    >
                                      Editar URL
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleDelete(networkData.id)}
                                      className="h-9 w-full border-red-200 px-3 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 sm:h-10 sm:text-sm"
                                    >
                                      <Unplug className="mr-1.5 h-3.5 w-3.5" />
                                      Desconectar
                                    </Button>
                                  </>
                                ) : (
                                  <Button
                                    size="sm"
                                    onClick={() => handleOAuthConnect(network.id)}
                                    disabled={isConnecting}
                                    className={`h-9 w-full px-3 text-xs text-white sm:h-10 sm:text-sm ${network.color}`}
                                  >
                                    {isConnecting ? (
                                      <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Conectando...
                                      </>
                                    ) : (
                                      <>
                                        <Link2 className="mr-2 h-4 w-4" />
                                        Conectar con {network.name}
                                      </>
                                    )}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {isModalOpen ? (
        <NetworkFormModal
          formData={formData}
          errors={errors}
          isEditing={isEditing}
          onClose={closeModal}
          onFieldChange={updateField}
          onBlur={handleBlur}
          onSubmit={handleSubmit}
        />
      ) : null}

      {isSuccessModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#D9EAF4] text-[#003A6C]">
              <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#003A6C]">Éxito</h2>
            <p className="mt-2 text-sm text-[#4B778D]">{successMessage}</p>
            <Button onClick={closeSuccessModal} className="mt-6 h-11 w-full bg-[#003A6C] text-white hover:bg-[#1a4f7a]">
              Continuar
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default NetworksPage
