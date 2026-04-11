import {
  BriefcaseBusiness,
  Edit,
  ExternalLink,
  FolderGit2,
  Globe,
  MessageSquare,
  Trash2,
  CirclePlay,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { NetworkItem } from "@/hooks/useNetworksManager"

type NetworksListProps = {
  networks: NetworkItem[]
  onEdit: (network: NetworkItem) => void
  onDelete: (id: string) => void
}

type NetworkVisual = {
  icon: typeof Globe
  badge: string
  iconClassName: string
  surfaceClassName: string
  buttonClassName: string
}

function getNetworkVisual(name: string, url: string): NetworkVisual {
  const normalizedValue = `${name} ${url}`.toLowerCase()

  if (normalizedValue.includes("github")) {
    return {
      icon: FolderGit2,
      badge: "Código",
      iconClassName: "text-slate-900",
      surfaceClassName: "bg-slate-100",
      buttonClassName: "border-slate-200 text-slate-700 hover:bg-slate-50",
    }
  }

  if (normalizedValue.includes("linkedin")) {
    return {
      icon: BriefcaseBusiness,
      badge: "Profesional",
      iconClassName: "text-[#0A66C2]",
      surfaceClassName: "bg-[#E8F1FB]",
      buttonClassName: "border-[#B8D5F3] text-[#0A66C2] hover:bg-[#F2F8FE]",
    }
  }

  if (normalizedValue.includes("youtube")) {
    return {
      icon: CirclePlay,
      badge: "Contenido",
      iconClassName: "text-[#FF0000]",
      surfaceClassName: "bg-[#FDECEC]",
      buttonClassName: "border-[#F6C3C3] text-[#D92D20] hover:bg-[#FFF5F5]",
    }
  }

  if (normalizedValue.includes("reddit")) {
    return {
      icon: MessageSquare,
      badge: "Comunidad",
      iconClassName: "text-[#FF4500]",
      surfaceClassName: "bg-[#FFF1EA]",
      buttonClassName: "border-[#FFD0BD] text-[#C2410C] hover:bg-[#FFF7F2]",
    }
  }

  return {
    icon: Globe,
    badge: "Enlace",
    iconClassName: "text-[#003A6C]",
    surfaceClassName: "bg-[#D9EAF4]",
    buttonClassName: "border-[#A5D7E8] text-[#003A6C] hover:bg-[#EEF5F9]",
  }
}

export function NetworksList({ networks, onEdit, onDelete }: NetworksListProps) {
  if (networks.length === 0) {
    return (
      <Card className="overflow-hidden rounded-[2rem] border border-[#B8D4E3] bg-white/95 py-0 shadow-[0_20px_60px_rgba(0,58,108,0.08)]">
        <CardContent className="px-6 py-14 text-center sm:px-10">
          <div className="mx-auto mb-5 flex size-20 items-center justify-center rounded-[1.75rem] bg-[radial-gradient(circle_at_top,#d7ecff,white_70%)] text-[#003A6C] shadow-sm">
            <Globe className="size-9" />
          </div>
          <h2 className="mb-2 text-2xl font-semibold text-[#003A6C]">Aún no conectaste ninguna red</h2>
          <p className="mx-auto max-w-xl text-sm leading-6 text-[#4B778D] sm:text-base">
            Agrega enlaces profesionales para que tu portafolio se vea más completo y tus visitantes puedan validar tu
            presencia digital en segundos.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {networks.map((network) => {
        const visual = getNetworkVisual(network.name, network.url)
        const Icon = visual.icon

        return (
          <Card
            key={network.id}
            className="overflow-hidden rounded-[2rem] border border-[#D2E3EC] bg-white py-0 shadow-[0_18px_45px_rgba(0,58,108,0.08)] transition-transform duration-200 hover:-translate-y-1"
          >
            <CardHeader className="border-b border-[#EEF5F9] px-5 py-5 sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-4">
                  <div
                    className={`flex size-14 shrink-0 items-center justify-center rounded-[1.25rem] ${visual.surfaceClassName}`}
                  >
                    <Icon className={`size-7 ${visual.iconClassName}`} />
                  </div>

                  <div className="min-w-0">
                    <span className="inline-flex rounded-full bg-[#F3F8FB] px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-[#4B778D]">
                      {visual.badge}
                    </span>
                    <CardTitle className="mt-3 text-xl font-semibold text-[#003A6C]">{network.name}</CardTitle>
                  </div>
                </div>

                <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                  Visible
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 px-5 py-5 sm:px-6 sm:py-6">
              <a
                href={network.url}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-2 rounded-2xl border border-[#E4EEF4] bg-[#FBFDFE] px-4 py-3 text-sm text-[#4B778D] transition hover:border-[#B8D4E3] hover:text-[#003A6C]"
              >
                <span className="min-w-0 flex-1 truncate">{network.url}</span>
                <ExternalLink className="size-4 shrink-0 opacity-60 transition group-hover:opacity-100" />
              </a>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onEdit(network)}
                  className={`flex-1 rounded-xl bg-white ${visual.buttonClassName}`}
                >
                  <Edit className="mr-2 size-4" />
                  Editar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onDelete(network.id)}
                  className="rounded-xl border-[#F2C6C6] bg-white text-[#B42318] hover:bg-[#FFF1F1]"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
