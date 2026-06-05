import { ExternalLink, FolderGit2 } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { AnalyticsBreakdownItem } from "@/types/portfolioAnalytics"
import type { ProfessionalNetworkReportRow } from "@/utils/portfolioViewsReportUtils"

interface PortfolioViewsDetailsGridProps {
  topProjectRows: AnalyticsBreakdownItem[]
  socialNetworkRows: ProfessionalNetworkReportRow[]
}

export function PortfolioViewsDetailsGrid({ topProjectRows, socialNetworkRows }: PortfolioViewsDetailsGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 print:gap-3">
      <TopProjectsCard topProjectRows={topProjectRows} />
      <SocialNetworkClicksCard socialNetworkRows={socialNetworkRows} />
    </div>
  )
}

function TopProjectsCard({ topProjectRows }: { topProjectRows: AnalyticsBreakdownItem[] }) {
  return (
    <Card className="print:break-inside-avoid">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderGit2 className="h-5 w-5 text-blue-600" />
          Top 3 proyectos más vistos
        </CardTitle>
      </CardHeader>
      <CardContent>
        {topProjectRows.length ? <TopProjectList topProjectRows={topProjectRows} /> : <EmptyTopProjects />}
      </CardContent>
    </Card>
  )
}

function TopProjectList({ topProjectRows }: { topProjectRows: AnalyticsBreakdownItem[] }) {
  return (
    <div className="space-y-3">
      {topProjectRows.map((project) => (
        <div key={project.id} className="flex flex-col gap-2 rounded-lg border border-[#D9EAF4] bg-[#F8FBFD] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <span className="min-w-0 break-words text-sm font-semibold text-[#003A6C]">{project.label}</span>
          <span className="w-fit rounded-full bg-[#D9EAF4] px-3 py-1 text-sm font-bold text-[#003A6C] sm:shrink-0">{project.value}</span>
        </div>
      ))}
    </div>
  )
}

function EmptyTopProjects() {
  return (
    <div className="py-8 text-center">
      <FolderGit2 className="mx-auto mb-3 h-12 w-12 text-gray-300" />
      <p className="text-sm text-gray-600">Aún no hay información detallada sobre las vistas de cada proyecto.</p>
    </div>
  )
}

function SocialNetworkClicksCard({ socialNetworkRows }: { socialNetworkRows: ProfessionalNetworkReportRow[] }) {
  return (
    <Card className="print:break-inside-avoid">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ExternalLink className="h-5 w-5 text-purple-600" />
          Clics en enlaces de redes profesionales
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {socialNetworkRows.map((network) => <SocialNetworkRow key={network.key} network={network} />)}
        </div>
      </CardContent>
    </Card>
  )
}

function SocialNetworkRow({ network }: { network: ProfessionalNetworkReportRow }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-[#D9EAF4] bg-[#F8FBFD] px-4 py-3">
      <span className="text-sm font-semibold text-[#003A6C]">{network.label}</span>
      {network.available ? (
        <span className="rounded-full bg-[#D9EAF4] px-3 py-1 text-sm font-bold text-[#003A6C]">{network.value}</span>
      ) : (
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">No disponible</span>
      )}
    </div>
  )
}
