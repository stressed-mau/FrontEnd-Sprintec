import Header from "@/components/HeaderUser"
import Sidebar from "@/components/Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { usePortfolioAnalytics } from "@/hooks/usePortfolioAnalytics"
import { getAuthSession } from "@/services/auth"
import { getUserSocialNetworks, type SocialNetwork } from "@/services/socialNetworksService"
import { useEffect, useRef, useState } from "react"
import { useReactToPrint } from "react-to-print"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import logo from "@/assets/logo/LogoPG.png"
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

const MONTH_KEYS = Object.keys(MONTH_LABELS)

function formatMonthLabel(month: string) {
  return MONTH_LABELS[month] ?? month
}

function getMonthRows(viewsByMonth: Record<string, number>, baseDate = new Date()) {
  return Array.from({ length: 5 }, (_, index) => {
    const date = new Date(baseDate.getFullYear(), baseDate.getMonth() - (4 - index), 1)
    const monthKey = MONTH_KEYS[date.getMonth()]

    return {
      month: formatMonthLabel(monthKey),
      views: Number(viewsByMonth[monthKey] ?? 0),
    }
  })
}

function getPrintLineChart(rows: Array<{ month: string; views: number }>, maxViews: number) {
  const width = 640
  const height = 220
  const padding = { top: 18, right: 28, bottom: 42, left: 42 }
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom
  const chartMax = Math.max(4, Math.ceil(maxViews / 4) * 4)

  const points = rows.map((row, index) => {
    const x = padding.left + (chartWidth / Math.max(rows.length - 1, 1)) * index
    const y = padding.top + chartHeight - (Math.min(row.views, chartMax) / chartMax) * chartHeight

    return { ...row, x, y }
  })

  const linePoints = points.map((point) => `${point.x},${point.y}`).join(" ")
  const ticks = Array.from({ length: 5 }, (_, index) => Math.round((chartMax / 4) * index))

  return { width, height, padding, chartWidth, chartHeight, points, linePoints, ticks, chartMax }
}

const PROFESSIONAL_NETWORKS = [
  { key: "github", label: "GitHub", matchKeys: ["github"] },
  { key: "gitlab", label: "GitLab", matchKeys: ["gitlab"] },
  { key: "youtube", label: "YouTube", matchKeys: ["youtube", "google"] },
]

function normalizeNetworkName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "")
}

function networkMatches(value: string, matchKeys: string[]) {
  const normalizedValue = normalizeNetworkName(value)
  return matchKeys.some((key) => normalizedValue.includes(normalizeNetworkName(key)))
}

function getSocialNetworkRows(
  socialClicks: Array<{ label: string; value: number }>,
  registeredNetworks: SocialNetwork[],
) {
  return PROFESSIONAL_NETWORKS.map((network) => {
    const registeredNetwork = registeredNetworks.find((item) =>
      networkMatches(`${item.name} ${item.url}`, network.matchKeys)
    )
    const clickData = socialClicks.find((item) => networkMatches(item.label, network.matchKeys))

    return {
      ...network,
      value: clickData?.value ?? 0,
      available: Boolean(registeredNetwork),
    }
  })
}

const PortfolioViewsReportPage = () => {
  const session = getAuthSession()
  const { analytics, loading, error } = usePortfolioAnalytics()
  const [registeredNetworks, setRegisteredNetworks] = useState<SocialNetwork[]>([])
  const reportRef = useRef<HTMLDivElement>(null)
  const viewsByMonth = analytics?.viewsByMonth ?? {}
  const monthRows = getMonthRows(viewsByMonth)
  const hasMonthRows = Object.keys(viewsByMonth).length > 0
  const maxMonthViews = Math.max(...monthRows.map((row) => row.views), 1)
  const printMonthChart = getPrintLineChart(monthRows, maxMonthViews)
  const topProjectRows = [...(analytics?.projectViews ?? [])].sort((a, b) => b.value - a.value).slice(0, 3)
  const socialNetworkRows = getSocialNetworkRows(analytics?.socialClicks ?? [], registeredNetworks)
  const reportDate = new Date().toLocaleDateString()
  const reportPeriod = analytics?.period?.from && analytics?.period?.to
    ? `${analytics.period.from} - ${analytics.period.to}`
    : "Reporte general"
  const handleExportPDF = useReactToPrint({
    contentRef: reportRef,
    documentTitle: `Reporte-Visualizaciones-${reportDate}`,
    pageStyle: `
      @page {
        size: letter;
        margin: 12mm;
      }

      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .portfolio-views-month-chart,
        .portfolio-views-month-chart .recharts-responsive-container,
        .portfolio-views-month-chart .recharts-wrapper,
        .portfolio-views-month-chart .recharts-surface {
          width: 100% !important;
          max-width: 100% !important;
        }

        .portfolio-views-month-chart {
          width: 640px !important;
          max-width: 92% !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }

        .portfolio-views-month-chart .recharts-wrapper {
          left: 0 !important;
        }
      }
    `,
  })

  useEffect(() => {
    let isMounted = true

    getUserSocialNetworks()
      .then((networks) => {
        if (isMounted) {
          setRegisteredNetworks(networks)
        }
      })
      .catch(() => {
        if (isMounted) {
          setRegisteredNetworks([])
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  if (!session?.user) return null

  return (
    <div className="min-h-screen bg-[#F7F0E1] font-sans">
      <Header />

      <div className="flex flex-col lg:flex-row">
        <Sidebar />

        <main className="flex-1 px-4 py-6 md:px-8 lg:px-10">
          <div ref={reportRef} className="mx-auto max-w-7xl space-y-6 print:max-w-full print:px-2 print:pt-6 print:scale-[0.92] print:origin-top">
            <div className="hidden print:flex items-center justify-between mb-4 border-b border-gray-300 pb-3">
              <div className="w-1/3 flex justify-start">
                <img src={logo} alt="Logo" className="w-12 h-12 object-contain" />
              </div>
              <div className="w-1/3 text-center">
                <h1 className="text-2xl font-bold text-[#003A6C] leading-tight">Reporte de Visualizaciones</h1>
                <p className="text-sm text-gray-500">{reportPeriod}</p>
              </div>
              <div className="w-1/3 flex justify-end">
                <div className="text-right">
                  <p className="text-sm font-semibold text-[#003A6C]">{reportDate}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="mb-2 text-3xl font-bold text-[#003A6C]">Visualizaciones</h1>
                <p className="text-[#4B778D]">Consulta el rendimiento de tu portafolio publicado y revisa cuantas personas lo han visitado.</p>
              </div>

              <div className="flex flex-col items-start gap-2 sm:items-end">
                <div className="print:hidden">
                  <Button
                    type="button"
                    onClick={handleExportPDF}
                    disabled={loading}
                    className="bg-[#003A6C] text-white shadow-sm transition-colors hover:bg-[#4982AD]"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Generar PDF
                  </Button>
                </div>
                <p className="print:hidden text-sm font-medium text-[#4B778D]">
                  {loading ? "Cargando reporte..." : "Descarga una copia del reporte actual."}
                </p>
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

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 print:grid-cols-3 print:gap-3">
              <Card className="bg-gradient-to-br from-[#003A6C] to-[#4982AD] text-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="mb-1 text-sm text-[#C2DBED]">Vistas totales</p>
                      <p className="text-3xl font-bold">{loading ? "..." : analytics?.totalViews ?? 0}</p>
                    </div>
                    <div className="rounded-lg bg-[#77B6E6]/25 p-3">
                      <Eye className="h-6 w-6" />
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-[#C2DBED]">Cantidad total de veces que se ha abierto tu portafolio publicado.</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-[#0E7D96] to-[#6DACBF] text-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="mb-1 text-sm text-[#EAF4FA]">Vistas este mes</p>
                      <p className="text-3xl font-bold">{loading ? "..." : analytics?.viewsThisMonth ?? 0}</p>
                    </div>
                    <div className="rounded-lg bg-[#C2DBED]/30 p-3">
                      <Calendar className="h-6 w-6" />
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-[#EAF4FA]">Visitas recibidas durante el mes actual.</p>
                </CardContent>
              </Card>

              <Card className="border-[#D6C7B0] bg-gradient-to-br from-[#F7F0E1] to-[#D6C7B0] text-[#003A6C] md:col-span-2 lg:col-span-1">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="mb-1 text-sm text-[#0E7D96]">Clics en enlaces</p>
                      <p className="text-3xl font-bold">{loading ? "..." : analytics?.totalLinkClicks ?? 0}</p>
                    </div>
                    <div className="rounded-lg bg-[#C4A57C]/25 p-3">
                      <ExternalLink className="h-6 w-6 text-[#0E7D96]" />
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-[#0E7D96]">Clicks registrados en enlaces de proyectos publicos, como repositorios, demos.</p>
                </CardContent>
              </Card>
            </div>

            <Card className="print:break-inside-avoid print:overflow-hidden">
              <CardHeader>
                <CardTitle>Vistas por mes</CardTitle>
              </CardHeader>
              <CardContent className="print:px-2">
                {loading ? (
                  <p className="text-sm font-medium text-[#4B778D]">Cargando metricas...</p>
                ) : hasMonthRows ? (
                  <div>
                    <p className="mb-6 text-sm text-[#4B778D]">Visualizaciones por mes (ultimos 5 meses)</p>
                    <div className="portfolio-views-month-chart h-64 w-full min-w-0 max-w-full overflow-hidden print:hidden">
                      <ResponsiveContainer width="100%" height="100%" debounce={0}>
                        <LineChart
                          data={monthRows}
                          margin={{
                            top: 10,
                            right: 20,
                            left: 10,
                            bottom: 10,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                          <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            interval={0}
                            minTickGap={20}
                            tickMargin={8}
                            padding={{ left: 20, right: 20 }}
                            tick={{
                              fill: "#4B778D",
                              fontSize: 11,
                            }}
                          />
                          <YAxis
                            width={35}
                            axisLine={false}
                            tickLine={false}
                            allowDecimals={false}
                            domain={[0, maxMonthViews]}
                            tick={{
                              fill: "#4B778D",
                              fontSize: 12,
                            }}
                          />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="views"
                            name="Vistas"
                            stroke="#0E7D96"
                            strokeWidth={3}
                            isAnimationActive={false}
                            dot={{ r: 6, fill: "#0E7D96", strokeWidth: 2, stroke: "#fff" }}
                            activeDot={{ r: 8, fill: "#003A6C" }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="hidden print:block print:w-full print:overflow-hidden">
                      <svg
                        viewBox={`0 0 ${printMonthChart.width} ${printMonthChart.height}`}
                        className="mx-auto h-auto w-[640px] max-w-full"
                        role="img"
                        aria-label="Grafica de vistas por mes de los ultimos 5 meses"
                      >
                        {printMonthChart.ticks.map((tick) => {
                          const y =
                            printMonthChart.padding.top +
                            printMonthChart.chartHeight -
                            (tick / printMonthChart.chartMax) * printMonthChart.chartHeight

                          return (
                            <g key={tick}>
                              <line
                                x1={printMonthChart.padding.left}
                                x2={printMonthChart.padding.left + printMonthChart.chartWidth}
                                y1={y}
                                y2={y}
                                stroke="#E2E8F0"
                                strokeDasharray="3 3"
                              />
                              <text x={printMonthChart.padding.left - 12} y={y + 4} textAnchor="end" fontSize="11" fill="#4B778D">
                                {tick}
                              </text>
                            </g>
                          )
                        })}

                        <polyline
                          points={printMonthChart.linePoints}
                          fill="none"
                          stroke="#0E7D96"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        {printMonthChart.points.map((point) => (
                          <g key={point.month}>
                            <circle cx={point.x} cy={point.y} r="5" fill="#0E7D96" stroke="#FFFFFF" strokeWidth="2" />
                            <text x={point.x} y={printMonthChart.height - 16} textAnchor="middle" fontSize="11" fill="#4B778D">
                              {point.month}
                            </text>
                          </g>
                        ))}
                      </svg>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <Eye className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                    <p className="text-sm text-gray-600">Aun no hay vistas registradas por mes.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2 print:gap-3">
              <Card className="print:break-inside-avoid">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FolderGit2 className="h-5 w-5 text-blue-600" />
                    Top 3 proyectos más vistos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {topProjectRows.length ? (
                    <div className="space-y-3">
                      {topProjectRows.map((project) => (
                        <div key={project.id} className="flex flex-col gap-2 rounded-lg border border-[#D9EAF4] bg-[#F8FBFD] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                          <span className="min-w-0 break-words text-sm font-semibold text-[#003A6C]">{project.label}</span>
                          <span className="w-fit rounded-full bg-[#D9EAF4] px-3 py-1 text-sm font-bold text-[#003A6C] sm:shrink-0">{project.value}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <FolderGit2 className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                      <p className="text-sm text-gray-600">Aún no hay información detallada sobre las vistas de cada proyecto.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="print:break-inside-avoid">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ExternalLink className="h-5 w-5 text-purple-600" />
                    Clics en enlaces de redes profesionales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {socialNetworkRows.map((network) => (
                      <div key={network.key} className="flex items-center justify-between gap-4 rounded-lg border border-[#D9EAF4] bg-[#F8FBFD] px-4 py-3">
                        <span className="text-sm font-semibold text-[#003A6C]">{network.label}</span>
                        {network.available ? (
                          <span className="rounded-full bg-[#D9EAF4] px-3 py-1 text-sm font-bold text-[#003A6C]">{network.value}</span>
                        ) : (
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">No disponible</span>
                        )}
                      </div>
                    ))}
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
