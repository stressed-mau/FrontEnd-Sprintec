import Header from "@/components/HeaderUser"
import Sidebar from "@/components/Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getAuthSession } from "@/services/auth"
import {
  Calendar,
  Download,
  ExternalLink,
  Eye,
  FolderGit2,
} from "lucide-react"

const emptyMonths = ["Ene", "Feb", "Mar", "Abr", "May", "Jun"]

const PortfolioViewsReportPage = () => {
  const session = getAuthSession()

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
                <p className="text-[#4B778D]">Estadisticas y metricas de tu portafolio profesional</p>
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
                <p className="text-sm font-medium text-[#4B778D]">Disponible cuando existan datos registrados</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="mb-1 text-sm text-blue-100">Vistas totales</p>
                      <p className="text-3xl font-bold">Sin datos</p>
                    </div>
                    <div className="rounded-lg bg-white/20 p-3">
                      <Eye className="h-6 w-6" />
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-blue-100">Pendiente de conexion con analiticas</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="mb-1 text-sm text-purple-100">Vistas este mes</p>
                      <p className="text-3xl font-bold">Sin datos</p>
                    </div>
                    <div className="rounded-lg bg-white/20 p-3">
                      <Calendar className="h-6 w-6" />
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-purple-100">Ultimos 30 dias sin registros</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white md:col-span-2 lg:col-span-1">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="mb-1 text-sm text-orange-100">Clics en enlaces</p>
                      <p className="text-3xl font-bold">Sin datos</p>
                    </div>
                    <div className="rounded-lg bg-white/20 p-3">
                      <ExternalLink className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-sm text-orange-100">
                    <span>Sin actividad registrada en redes</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Vistas por mes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {emptyMonths.map((month) => (
                    <div key={month} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-600">{month}</span>
                        <span className="font-bold text-gray-400">Sin datos</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div className="h-2 w-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600" />
                      </div>
                    </div>
                  ))}
                </div>
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
                    <p className="text-sm text-gray-600">No hay datos de visualizaciones registrados</p>
                    <p className="mt-1 text-xs text-gray-500">Cuando exista seguimiento de visitas, aqui se mostraran los proyectos mas vistos</p>
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
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b p-2">
                      <span className="text-sm font-medium">GitHub</span>
                      <span className="text-sm font-bold text-gray-400">Sin datos</span>
                    </div>
                    <div className="flex items-center justify-between border-b p-2">
                      <span className="text-sm font-medium">YouTube</span>
                      <span className="text-sm font-bold text-gray-400">Sin datos</span>
                    </div>
                    <div className="flex items-center justify-between p-2">
                      <span className="text-sm font-medium">GitLab</span>
                      <span className="text-sm font-bold text-gray-400">Sin datos</span>
                    </div>
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
