import Header from "@/components/HeaderUser"
import Sidebar from "@/components/Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { usePortfolioAnalytics } from "@/hooks/usePortfolioAnalytics"
import { getAuthSession } from "@/services/auth"
import {
  AlertCircle,
  Calendar,
  Download,
  ExternalLink,
  Eye,
  FolderGit2,
} from "lucide-react"

const MONTH_LABELS: Record<string, string> = {
  January: "Ene",
  February: "Feb",
  March: "Mar",
  April: "Abr",
  May: "May",
  June: "Jun",
  July: "Jul",
  August: "Ago",
  September: "Sep",
  October: "Oct",
  November: "Nov",
  December: "Dic",
}

function formatMonthLabel(month: string) {
  return MONTH_LABELS[month] ?? month
}

function getMonthRows(viewsByMonth: Record<string, number>) {
  return Object.entries(viewsByMonth).map(([month, views]) => ({
    month: formatMonthLabel(month),
    views: Number(views ?? 0),
  }))
}

const PortfolioViewsReportPage = () => {
  const session = getAuthSession()
  const { analytics, loading, error } = usePortfolioAnalytics()
  const monthRows = getMonthRows(analytics?.viewsByMonth ?? {})
  const maxMonthViews = Math.max(...monthRows.map((row) => row.views), 1)

  if (!session?.user) return null

  return (
    <div className="min-h-screen bg-[#F7F0E1] font-sans">
      <Header />

      <div className="flex flex-col lg:flex-row">
        <Sidebar />

        <main className="flex-1 px-4 py-6 md:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="mb-2 text-3xl font-bold text-[#003A6C]">Visualizaciones</h1>
                <p className="text-[#4B778D]">Metricas reales registradas por el backend para tu portafolio publicado.</p>
              </div>

              <div className="flex flex-col items-start gap-2 sm:items-end">
                <Button
                  type="button"
                  disabled
                  className="bg-[#003A6C] text-white shadow-sm transition-colors hover:bg-[#4982AD]"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Exportar a PDF
                </Button>
                <p className="text-sm font-medium text-[#4B778D]">Backend aun no entrega datos para exportacion.</p>
              </div>
            </div>

            {error ? (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="flex items-start gap-3 pt-6 text-red-700">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  <p className="text-sm font-medium">{error}</p>
                </CardContent>
              </Card>
            ) : null}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="mb-1 text-sm text-blue-100">Vistas totales</p>
                      <p className="text-3xl font-bold">{loading ? "..." : analytics?.totalViews ?? 0}</p>
                    </div>
                    <div className="rounded-lg bg-white/20 p-3">
                      <Eye className="h-6 w-6" />
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-blue-100">Total registrado por visitas al portafolio publico</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="mb-1 text-sm text-purple-100">Vistas este mes</p>
                      <p className="text-3xl font-bold">{loading ? "..." : analytics?.viewsThisMonth ?? 0}</p>
                    </div>
                    <div className="rounded-lg bg-white/20 p-3">
                      <Calendar className="h-6 w-6" />
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-purple-100">Dato recibido desde /user/portfolio/analytics</p>
                </CardContent>
              </Card>

              <Card className="bg-white text-[#003A6C] md:col-span-2 lg:col-span-1">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="mb-1 text-sm text-[#4B778D]">Clics en enlaces</p>
                      <p className="text-3xl font-bold text-gray-400">No disponible</p>
                    </div>
                    <div className="rounded-lg bg-[#F1F5F9] p-3">
                      <ExternalLink className="h-6 w-6 text-gray-400" />
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-[#4B778D]">Backend todavia no envia esta metrica.</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Vistas por mes</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-sm font-medium text-[#4B778D]">Cargando metricas...</p>
                ) : monthRows.length ? (
                  <div className="space-y-4">
                    {monthRows.map((row) => (
                      <div key={row.month} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-gray-600">{row.month}</span>
                          <span className="font-bold text-[#003A6C]">{row.views}</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-gray-200">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                            style={{ width: `${Math.max((row.views / maxMonthViews) * 100, row.views > 0 ? 6 : 0)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <Eye className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                    <p className="text-sm text-gray-600">Aun no hay vistas registradas por mes.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FolderGit2 className="h-5 w-5 text-blue-600" />
                    Vistas de proyectos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="py-8 text-center">
                    <FolderGit2 className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                    <p className="text-sm text-gray-600">Backend todavia no entrega vistas por proyecto.</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ExternalLink className="h-5 w-5 text-purple-600" />
                    Clics en enlaces de redes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="py-8 text-center">
                    <ExternalLink className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                    <p className="text-sm text-gray-600">Backend todavia no entrega clics por red social.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default PortfolioViewsReportPage
