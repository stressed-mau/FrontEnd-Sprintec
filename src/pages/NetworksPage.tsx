import { useEffect, useMemo, useRef, useState } from "react"
import {
  Check,
  ExternalLink,
  Link2,
  Loader2,
  Unplug,
} from "lucide-react"

import Header from "@/components/HeaderUser"
import Sidebar from "@/components/Sidebar"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useNetworksManager } from "@/hooks/useNetworksManager"
import { fetchOAuthUrl } from "@/services/socialNetworksService"

type ProfessionalNetwork = {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  lightColor: string
  textColor: string
  description: string
  matchKeys: string[]
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 2C6.477 2 2 6.59 2 12.253c0 4.53 2.865 8.374 6.839 9.73.5.094.682-.221.682-.49 0-.243-.009-.887-.014-1.741-2.782.617-3.369-1.37-3.369-1.37-.455-1.177-1.11-1.49-1.11-1.49-.908-.637.069-.625.069-.625 1.004.072 1.532 1.053 1.532 1.053.892 1.573 2.341 1.119 2.91.856.091-.662.349-1.119.635-1.376-2.221-.258-4.555-1.14-4.555-5.076 0-1.122.39-2.04 1.03-2.759-.103-.26-.447-1.302.098-2.714 0 0 .84-.276 2.75 1.054A9.303 9.303 0 0 1 12 6.856a9.27 9.27 0 0 1 2.504.344c1.909-1.33 2.747-1.054 2.747-1.054.547 1.412.203 2.454.1 2.714.64.719 1.028 1.637 1.028 2.759 0 3.946-2.337 4.815-4.566 5.068.359.318.678.947.678 1.909 0 1.379-.012 2.491-.012 2.83 0 .271.18.588.688.488A10.016 10.016 0 0 0 22 12.253C22 6.59 17.523 2 12 2Z" />
    </svg>
  )
}

function GitlabIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="m22.84 14.73-.93-2.86-1.85-5.67a.48.48 0 0 0-.91 0l-1.57 4.84H6.42L4.85 6.2a.48.48 0 0 0-.91 0L2.09 11.87l-.93 2.86a.97.97 0 0 0 .35 1.08l10.14 7.37a.6.6 0 0 0 .7 0l10.14-7.37a.97.97 0 0 0 .35-1.08Z" />
    </svg>
  )
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M23.498 6.186a2.989 2.989 0 0 0-2.103-2.116C19.538 3.556 12 3.556 12 3.556s-7.538 0-9.395.514A2.989 2.989 0 0 0 .502 6.186 31.23 31.23 0 0 0 0 12a31.23 31.23 0 0 0 .502 5.814 2.989 2.989 0 0 0 2.103 2.116c1.857.514 9.395.514 9.395.514s7.538 0 9.395-.514a2.989 2.989 0 0 0 2.103-2.116A31.23 31.23 0 0 0 24 12a31.23 31.23 0 0 0-.502-5.814ZM9.6 15.568V8.432L15.818 12 9.6 15.568Z" />
    </svg>
  )
}

const PROFESSIONAL_NETWORKS: ProfessionalNetwork[] = [
  {
    id: "github",
    name: "GitHub",
    icon: GithubIcon,
    color: "bg-gray-900 hover:bg-gray-800",
    lightColor: "bg-gray-100",
    textColor: "text-gray-900",
    description: "Conecta tu perfil de desarrollador",
    matchKeys: ["github"],
  },
  {
    id: "gitlab",
    name: "GitLab",
    icon: GitlabIcon,
    color: "bg-[#FC6D26] hover:bg-[#E24329]",
    lightColor: "bg-orange-100",
    textColor: "text-[#E24329]",
    description: "Conecta tu repositorio y perfil de desarrollo",
    matchKeys: ["gitlab"],
  },
  {
    id: "google",
    name: "YouTube",
    icon: YoutubeIcon,
    color: "bg-[#FF0000] hover:bg-[#CC0000]",
    lightColor: "bg-red-100",
    textColor: "text-[#FF0000]",
    description: "Comparte tu canal de YouTube",
    matchKeys: ["youtube", "google"],
  },
]

const NetworksPage = () => {
  const {
    networks,
    feedbackMessage,
    feedbackType,
    isSuccessModalOpen,
    successMessage,
    isLoading,
    closeSuccessModal,
    handleDelete,
    loadNetworks,
    showFeedback,
  } = useNetworksManager()

  const [connectingNetwork, setConnectingNetwork] = useState<string | null>(null)
  const oauthResultHandledRef = useRef(false)

  useEffect(() => {
    if (oauthResultHandledRef.current) {
      return
    }

    const urlParams = new URLSearchParams(window.location.search)
    const status = urlParams.get("social_status")
    const provider = urlParams.get("social_provider")
    const message = urlParams.get("social_message")

    if (!status) {
      return
    }

    oauthResultHandledRef.current = true
    window.history.replaceState({}, document.title, window.location.pathname)

    if (status === "success" && provider) {
      const timer = setTimeout(() => {
        const providerLabel =
          PROFESSIONAL_NETWORKS.find((network) => network.id === provider || network.matchKeys.includes(provider))
            ?.name ?? `${provider.charAt(0).toUpperCase()}${provider.slice(1)}`

        showFeedback(`Conexion exitosa con ${providerLabel}. Tu perfil esta ahora conectado.`, "success")
        void loadNetworks()
      }, 500)

      return () => clearTimeout(timer)
    }

    if (status === "error" && provider) {
      const providerLabel =
        PROFESSIONAL_NETWORKS.find((network) => network.id === provider || network.matchKeys.includes(provider))
          ?.name ?? `${provider.charAt(0).toUpperCase()}${provider.slice(1)}`

      const errorMessage = message ? `Error: ${message}` : `No se pudo conectar con ${providerLabel}`
      showFeedback(errorMessage, "error")
    }
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

  async function handleOAuthConnect(provider: string) {
    setConnectingNetwork(provider)

    try {
      const url = await fetchOAuthUrl(provider)
      window.location.href = url
    } catch (error) {
      setConnectingNetwork(null)
      const message = error instanceof Error ? error.message : "Error al conectar"
      showFeedback(message, "error")
    }
  }

  return (
    <div id="pagina-redes-profesionales" className="min-h-screen bg-[#F7F0E1]">
      <Header />

      <div className="flex flex-col lg:flex-row">
        <Sidebar />

        <main id="contenido-principal-redes-profesionales" className="flex-1 p-4 sm:p-6 md:p-10">
          <div id="contenedor-redes-profesionales" className="mx-auto max-w-5xl space-y-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 id="titulo-pagina-redes-profesionales" className="mb-2 text-3xl font-bold text-[#111827]">
                  Enlazar Redes Profesionales
                </h1>
                <p id="descripcion-pagina-redes-profesionales" className="text-sm text-gray-600 sm:text-base">
                  Enlaza tus perfiles profesionales de forma segura mediante OAuth
                </p>
              </div>
            </div>

            <Card id="tarjeta-informacion-oauth-redes" className="border-blue-200 bg-blue-50/50 py-0">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div
                    id="icono-informacion-oauth-redes"
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100"
                  >
                    <Link2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 id="titulo-informacion-oauth-redes" className="mb-1 font-semibold text-blue-900">
                      Conexion segura mediante OAuth
                    </h3>
                    <p id="descripcion-informacion-oauth-redes" className="text-sm leading-6 text-blue-700">
                      Al conectar tus redes sociales, serás redirigido a la plataforma oficial para autorizar el acceso.  
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {feedbackMessage ? (
              <div
                id="mensaje-retroalimentacion-redes-profesionales"
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
              <h2 id="titulo-lista-redes-profesionales" className="mb-4 text-lg font-semibold text-[#111827]">
                Redes disponibles
              </h2>

              {isLoading ? (
                <div id="skeleton-redes-profesionales" className="grid grid-cols-2 items-start gap-3 sm:gap-4">
                  {PROFESSIONAL_NETWORKS.map((network) => (
                    <Card key={network.id} id={`tarjeta-cargando-red-${network.id}`} className="border-gray-200 bg-white py-0">
                      <CardContent className="p-4 sm:p-5">
                        <div className="flex animate-pulse flex-col gap-3.5">
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
                <div id="grid-redes-profesionales" className="grid grid-cols-2 items-start gap-3 sm:gap-4">
                  {connectedNetworks.map((network) => {
                    const Icon = network.icon
                    const isConnected = network.connected
                    const isConnecting = network.isConnecting
                    const networkData = network.data

                    return (
                      <Card
                        key={network.id}
                        id={`tarjeta-red-${network.id}`}
                        className={`py-0 transition-all ${
                          isConnected
                            ? "border-green-500 bg-green-50/30"
                            : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                        }`}
                      >
                        <CardContent className="p-4 sm:p-5">
                          <div className="flex flex-col gap-3.5">
                            <div className="flex items-start gap-3 sm:gap-4">
                              <div
                                id={`icono-red-${network.id}`}
                                className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl sm:h-14 sm:w-14 ${network.lightColor}`}
                              >
                                <Icon className={`h-6 w-6 sm:h-7 sm:w-7 ${network.textColor}`} />
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                  <div className="min-w-0">
                                    <h3 id={`titulo-red-${network.id}`} className="text-base font-semibold leading-5 text-gray-900 sm:text-lg sm:leading-6">
                                      {network.name}
                                    </h3>
                                    <p id={`descripcion-red-${network.id}`} className="mt-1 text-xs leading-5 text-gray-600 sm:text-sm">
                                      {network.description}
                                    </p>
                                  </div>

                                  {isConnected ? (
                                    <div id={`estado-red-${network.id}`} className="inline-flex items-center gap-1.5 self-start rounded-full bg-green-100 px-2 py-1 text-green-700">
                                      <Check className="h-3.5 w-3.5" />
                                      <span className="text-xs font-medium">Conectado</span>
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </div>

                            <div className="pl-0 sm:pl-[4.5rem]">
                              {isConnected && networkData ? (
                                <div id={`contenedor-url-red-${network.id}`} className="mb-3 rounded-lg border border-gray-200 bg-white p-3 text-left">
                                  <a
                                    id={`enlace-red-${network.id}`}
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
                                  <Button
                                    id={`boton-desconectar-red-${network.id}`}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete(networkData.id)}
                                    className="h-9 w-full border-red-200 px-3 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 sm:h-10 sm:text-sm"
                                  >
                                    <Unplug className="mr-1.5 h-3.5 w-3.5" />
                                    Desconectar
                                  </Button>
                                ) : (
                                  <Button
                                    id={`boton-conectar-red-${network.id}`}
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

      <Footer />
      {isSuccessModalOpen ? (
        <div id="modal-exito-redes-profesionales" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div id="contenedor-modal-exito-redes-profesionales" className="relative w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl">
            <button
              id="boton-cerrar-modal-exito-redes-profesionales"
              type="button"
              onClick={closeSuccessModal}
              aria-label="Cerrar modal de éxito"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-[#4B778D] transition hover:bg-[#EEF5F9]"
            >
              X
            </button>
            <div id="icono-modal-exito-redes-profesionales" className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#D9EAF4] text-[#003A6C]">
              <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 id="titulo-modal-exito-redes-profesionales" className="text-xl font-bold text-[#003A6C]">
              Exito
            </h2>
            <p id="mensaje-modal-exito-redes-profesionales" className="mt-2 text-sm text-[#4B778D]">
              {successMessage}
            </p>
            <Button
              id="boton-aceptar-modal-exito-redes-profesionales"
              onClick={closeSuccessModal}
              className="mt-6 h-11 w-full bg-[#003A6C] text-white hover:bg-[#1a4f7a]"
            >
              Aceptar
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default NetworksPage
