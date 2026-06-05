import { Calendar, ExternalLink, Eye } from "lucide-react"
import type { ReactNode } from "react"

import { Card, CardContent } from "@/components/ui/card"
import type { PortfolioAnalytics } from "@/types/portfolioAnalytics"

interface PortfolioViewsSummaryCardsProps {
  analytics: PortfolioAnalytics | null
  loading: boolean
}

export function PortfolioViewsSummaryCards({ analytics, loading }: PortfolioViewsSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 print:grid-cols-3 print:gap-3">
      <Card className="bg-gradient-to-br from-[#003A6C] to-[#4982AD] text-white">
        <CardContent className="pt-6">
          <SummaryContent label="Vistas totales" value={loading ? "..." : analytics?.totalViews ?? 0} icon={<Eye className="h-6 w-6" />} />
          <p className="mt-3 text-sm text-[#C2DBED]">Cantidad total de veces que se ha abierto tu portafolio publicado.</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-[#0E7D96] to-[#6DACBF] text-white">
        <CardContent className="pt-6">
          <SummaryContent label="Vistas este mes" value={loading ? "..." : analytics?.viewsThisMonth ?? 0} icon={<Calendar className="h-6 w-6" />} />
          <p className="mt-3 text-sm text-[#EAF4FA]">Visitas recibidas durante el mes actual.</p>
        </CardContent>
      </Card>

      <Card className="border-[#D6C7B0] bg-gradient-to-br from-[#F7F0E1] to-[#D6C7B0] text-[#003A6C] md:col-span-2 lg:col-span-1">
        <CardContent className="pt-6">
          <SummaryContent
            label="Clics en enlaces"
            value={loading ? "..." : analytics?.totalLinkClicks ?? 0}
            icon={<ExternalLink className="h-6 w-6 text-[#0E7D96]" />}
            labelClassName="text-[#0E7D96]"
            iconClassName="bg-[#C4A57C]/25"
          />
          <p className="mt-3 text-sm text-[#0E7D96]">Clicks registrados en enlaces de proyectos publicos, como repositorios, demos.</p>
        </CardContent>
      </Card>
    </div>
  )
}

function SummaryContent({
  label,
  value,
  icon,
  labelClassName = "text-[#C2DBED]",
  iconClassName = "bg-[#77B6E6]/25",
}: {
  label: string
  value: string | number
  icon: ReactNode
  labelClassName?: string
  iconClassName?: string
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className={`mb-1 text-sm ${labelClassName}`}>{label}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      <div className={`rounded-lg p-3 ${iconClassName}`}>{icon}</div>
    </div>
  )
}
