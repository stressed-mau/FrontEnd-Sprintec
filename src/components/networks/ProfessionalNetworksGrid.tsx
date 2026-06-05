import { Check, ExternalLink, Link2, Loader2, Unplug } from "lucide-react"

import { PROFESSIONAL_NETWORKS, type ConnectedProfessionalNetwork } from "@/components/networks/ProfessionalNetworksCatalog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type ProfessionalNetworksGridProps = {
  networks: ConnectedProfessionalNetwork[]
  isLoading: boolean
  onConnect: (provider: string) => void
  onDelete: (id: string) => void
}

export function ProfessionalNetworksGrid({ networks, isLoading, onConnect, onDelete }: ProfessionalNetworksGridProps) {
  return (
    <div>
      <h2 id="titulo-lista-redes-profesionales" className="mb-4 text-lg font-semibold text-[#111827]">
        Redes disponibles
      </h2>
      {isLoading ? <NetworkLoadingGrid /> : <NetworkCards networks={networks} onConnect={onConnect} onDelete={onDelete} />}
    </div>
  )
}

function NetworkLoadingGrid() {
  return (
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
              <div className="sm:pl-18">
                <div className="h-9 rounded bg-gray-100 sm:h-10" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function NetworkCards({ networks, onConnect, onDelete }: Omit<ProfessionalNetworksGridProps, "isLoading">) {
  return (
    <div id="grid-redes-profesionales" className="grid grid-cols-2 items-start gap-3 sm:gap-4">
      {networks.map((network) => <NetworkCard key={network.id} network={network} onConnect={onConnect} onDelete={onDelete} />)}
    </div>
  )
}

function NetworkCard({ network, onConnect, onDelete }: Omit<ProfessionalNetworksGridProps, "networks" | "isLoading"> & { network: ConnectedProfessionalNetwork }) {
  const Icon = network.icon

  return (
    <Card id={`tarjeta-red-${network.id}`} className={`py-0 transition-all ${network.connected ? "border-green-500 bg-green-50/30" : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"}`}>
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col gap-3.5">
          <div className="flex items-start gap-3 sm:gap-4">
            <div id={`icono-red-${network.id}`} className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl sm:h-14 sm:w-14 ${network.lightColor}`}>
              <Icon className={`h-6 w-6 sm:h-7 sm:w-7 ${network.textColor}`} />
            </div>
            <NetworkHeading network={network} />
          </div>
          <div className="pl-0 sm:pl-18">
            {network.connected && network.data ? <NetworkUrl network={network} /> : null}
            <NetworkAction network={network} onConnect={onConnect} onDelete={onDelete} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function NetworkHeading({ network }: { network: ConnectedProfessionalNetwork }) {
  return (
    <div className="min-w-0 flex-1">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 id={`titulo-red-${network.id}`} className="text-base font-semibold leading-5 text-gray-900 sm:text-lg sm:leading-6">{network.name}</h3>
          <p id={`descripcion-red-${network.id}`} className="mt-1 text-xs leading-5 text-gray-600 sm:text-sm">{network.description}</p>
        </div>
        {network.connected ? (
          <div id={`estado-red-${network.id}`} className="inline-flex items-center gap-1.5 self-start rounded-full bg-green-100 px-2 py-1 text-green-700">
            <Check className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">Conectado</span>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function NetworkUrl({ network }: { network: ConnectedProfessionalNetwork }) {
  if (!network.data) return null

  return (
    <div id={`contenedor-url-red-${network.id}`} className="mb-3 rounded-lg border border-gray-200 bg-white p-3 text-left">
      <a id={`enlace-red-${network.id}`} href={network.data.url} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-1.5 text-sm text-gray-700 hover:text-blue-600">
        <span className="truncate">{network.data.url}</span>
        <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
      </a>
    </div>
  )
}

function NetworkAction({ network, onConnect, onDelete }: Omit<ProfessionalNetworksGridProps, "networks" | "isLoading"> & { network: ConnectedProfessionalNetwork }) {
  if (network.connected && network.data) {
    return (
      <div className="flex flex-col gap-2">
        <Button id={`boton-desconectar-red-${network.id}`} variant="outline" size="sm" onClick={() => onDelete(network.data?.id ?? "")} className="h-9 w-full border-red-200 px-3 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 sm:h-10 sm:text-sm">
          <Unplug className="mr-1.5 h-3.5 w-3.5" />
          Desconectar
        </Button>
      </div>
    )
  }

  return (
    <Button id={`boton-conectar-red-${network.id}`} size="sm" onClick={() => onConnect(network.id)} disabled={network.isConnecting} className={`h-9 w-full px-3 text-xs text-white sm:h-10 sm:text-sm ${network.color}`}>
      {network.isConnecting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Conectando...</> : <><Link2 className="mr-2 h-4 w-4" />Conectar con {network.name}</>}
    </Button>
  )
}
