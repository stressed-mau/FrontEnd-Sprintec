import type { ComponentType } from "react"

import { GithubIcon, GitlabIcon, YoutubeIcon } from "@/components/networks/ProfessionalNetworkIcons"
import type { SocialNetwork } from "@/types/socialNetworks"

export type ProfessionalNetwork = {
  id: string
  name: string
  icon: ComponentType<{ className?: string }>
  color: string
  lightColor: string
  textColor: string
  description: string
  matchKeys: string[]
}

export type ConnectedProfessionalNetwork = ProfessionalNetwork & {
  connected: boolean
  data?: SocialNetwork
  isConnecting: boolean
}

export const PROFESSIONAL_NETWORKS: ProfessionalNetwork[] = [
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

export function getProfessionalNetworkLabel(provider: string) {
  const network = PROFESSIONAL_NETWORKS.find((item) => item.id === provider || item.matchKeys.includes(provider))
  return network?.name ?? `${provider.charAt(0).toUpperCase()}${provider.slice(1)}`
}

export function buildConnectedProfessionalNetworks(networks: SocialNetwork[], connectingNetwork: string | null) {
  return PROFESSIONAL_NETWORKS.map((network) => {
    const data = networks.find((item) => network.matchKeys.some((key) => item.name.toLowerCase().includes(key)))

    return {
      ...network,
      connected: Boolean(data),
      data,
      isConnecting: connectingNetwork === network.id,
    }
  })
}
