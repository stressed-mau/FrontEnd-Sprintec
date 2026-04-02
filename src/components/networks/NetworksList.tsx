import { Edit, ExternalLink, Globe, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { NetworkItem } from "@/hooks/useNetworksManager"

type NetworksListProps = {
  networks: NetworkItem[]
  onEdit: (network: NetworkItem) => void
  onDelete: (id: number) => void
}

export function NetworksList({ networks, onEdit, onDelete }: NetworksListProps) {
  if (networks.length === 0) {
    return (
      <Card className="rounded-3xl border-2 border-dashed border-[#6dacbf] bg-white py-0 shadow-sm">
        <CardContent className="px-6 py-14 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-[#D9EAF4] text-[#003A6C]">
            <Globe className="size-8" />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-[#003A6C]">No hay redes registradas.</h2>
          <p className="mx-auto mb-6 max-w-md text-sm text-[#4B778D]">
            Puedes añadir enlaces profesionales para mostrarlos en tu portafolio
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {networks.map((network) => (
        <Card key={network.id} className="rounded-3xl border border-[#A5D7E8] bg-white py-0 shadow-sm">
          <CardHeader className="px-5 pt-5 sm:px-6 sm:pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#D9EAF4] text-[#003A6C]">
                  <Globe className="size-5" />
                </div>

                <div className="min-w-0">
                  <CardTitle className="text-lg font-semibold text-[#003A6C]">{network.name}</CardTitle>
                  <a
                    href={network.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 flex items-center gap-2 break-all text-sm text-[#4982AD] hover:text-[#003A6C]"
                  >
                    <span>{network.url}</span>
                    <ExternalLink className="size-3 shrink-0" />
                  </a>
                </div>
              </div>

              <div className="flex gap-2 self-end sm:self-start">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(network)}
                  className="border-[#A5D7E8] bg-white text-[#003A6C] hover:bg-[#EEF5F9]"
                >
                  <Edit className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(network.id)}
                  className="border-[#F2C6C6] bg-white text-[#B42318] hover:bg-[#FFF1F1]"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
