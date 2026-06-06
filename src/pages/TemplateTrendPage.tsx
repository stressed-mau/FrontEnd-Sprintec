import { ChevronLeft, ChevronRight, Clock, Crown, MousePointer2, TrendingDown, TrendingUp, Users, Download } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import Header from "@/components/HeaderUser"
import Sidebar from "@/components/Sidebar"
import { Footer } from "@/components/Footer"
import { useTemplateTrends } from "@/hooks/useTemplateTrends"
import type { TrendStats } from "@/services/templateTrendsService";
import { formatTemplateTime,formatTemplateVariation,} from "@/utils/reports/templateTrendUtils";import { Button } from "@/components/ui/button"
import { useCurrentWeekRange } from "@/hooks/useCurrentWeekRange"
import { useEffect, useRef, useState } from "react"
import { useReactToPrint } from "react-to-print"
import { useSearchParams } from "react-router-dom"
import logo from "@/assets/logo/LogoPG.png"

const TendenciaPlantillasPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  
  const [weekOffset, setWeekOffset] = useState(() => {
    return parseInt(searchParams.get("offset") || "0", 10)
  })

  useEffect(() => {
    setSearchParams({ offset: weekOffset.toString() }, { replace: true })
  }, [weekOffset, setSearchParams])

  const { loading, stats, chartData, report, pageError } = useTemplateTrends(weekOffset)
  const reportRef = useRef<HTMLDivElement>(null)
  const currentWeekRange = useCurrentWeekRange(weekOffset)
  const reportPeriod = report?.periodLabel ?? currentWeekRange
  const totalPortfolios = report?.totalPortfolios ?? 0
  const canGoNext = weekOffset < 0
  const handleExportPDF = useReactToPrint({
    contentRef: reportRef,
    documentTitle: `Reporte-Plantillas-${reportPeriod}`,
  })

  const visibleStats = stats
  const visibleChartData = chartData
  const leadStat = visibleStats[0]
  const leadVariation = leadStat?.variation ?? 0

  return (
    <div className="min-h-screen bg-[#F7F0E1] flex flex-col">
      <Header />

      <div className="flex flex-col lg:flex-row flex-1">
        <Sidebar />

        <main className="flex-1 px-4 py-6 md:px-8 lg:px-10">
          {/* Se optimizó el escalado para ocupar el espacio ideal de la página impresa y expandirse al 100% de ancho */}
          <div ref={reportRef} className="mx-auto max-w-6xl print:max-w-full print:w-full print:px-8 print:pt-6 print:scale-[0.96] print:origin-top transition-all" >

            {/* Encabezado de impresión */}
            <div className="hidden print:flex items-center justify-between mb-6 border-b border-gray-300 pb-3">
              <div className="w-1/3 flex justify-start">
                <img src={logo} alt="Logo" className="w-12 h-12 object-contain" />
              </div>
              <div className="w-1/3 text-center">
                <h1 className="text-2xl font-bold text-[#003A6C] leading-tight">Reporte Semanal de Plantillas</h1>
              </div>
              <div className="w-1/3 flex justify-end">
                <div className="text-right">
                  <p className="text-sm font-semibold text-[#003A6C]">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-4">
              <div className="text-left mobile-centered-text">
                <h1 className="mb-2 text-3xl font-bold text-[#003A6C]">Tendencia de Plantillas</h1>
                <p className="text-sm sm:text-base text-[#4B778D]">Resumen global del rendimiento de las plantillas en la plataforma</p>
              </div>

              <div className="flex flex-col items-end gap-3 md:items-end w-full md:w-auto">
                <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                  <div className="print:hidden">
                    <Button
                      type="button"
                      onClick={handleExportPDF}
                      className="bg-[#003A6C] text-white shadow-sm transition-colors hover:bg-[#4982AD]" >
                      <Download className="mr-2 h-4 w-4" />
                      Generar PDF
                    </Button>
                  </div>
                </div>

                <div className="print:hidden flex flex-wrap items-center justify-center bg-white border border-[#0E7D96]/20 rounded-xl px-3 sm:px-4 py-2 gap-2 sm:gap-4 shadow-sm mx-auto md:mr-0">
                  <button
                    className="rounded-lg p-1 text-[#003A6C] transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                    type="button"
                    onClick={() => setWeekOffset((current) => current - 1)}
                    aria-label="Ver semana anterior"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="text-sm font-bold text-[#003A6C]">{reportPeriod}</span>
                  <button
                    className="rounded-lg p-1 text-[#003A6C] transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                    type="button"
                    onClick={() => setWeekOffset((current) => Math.min(current + 1, 0))}
                    disabled={!canGoNext}
                    aria-label="Volver a la semana actual"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-6 p-2 bg-[#E0F2FE] border border-[#7DD3FC] rounded-2xl w-fit mx-auto md:mx-0 print:mb-6">
              <span className="text-[#0369A1] font-bold text-sm italic">Periodo actual: {reportPeriod}</span>
            </div>

            {/* KPIs: print:gap-4 mantiene la estructura impecable en el PDF sin encimarse */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-1 sm:gap-3 mb-6 justify-items-center md:justify-items-stretch print:grid-cols-4 print:gap-4 print:mb-8">
              <KPICard label="Plantilla líder" value={leadStat?.template_name ?? "Pendiente"} change={formatTemplateVariation(leadVariation)} helper="Mayor retención" icon={<Crown size={16} />} isNegative={leadVariation < 0} />
              <KPICard label="Retención" value={leadStat ? `${leadStat.retention}%` : "Pendiente"} change={leadStat ? formatTemplateVariation(leadStat.variation) : "Sin dato"} helper="Promedio líder" icon={<MousePointer2 size={16} />} isNegative={leadVariation < 0} />
              <KPICard label="Tiempo prom." value={leadStat ? formatTemplateTime(leadStat.avg_time) : "Pendiente"} change="Semana actual" helper="Tiempo medio" icon={<Clock size={16} />} />
              <KPICard label="Portafolios" value={String(totalPortfolios)} change={report ? "Reportado" : "Sin dato"} helper="Analizados" icon={<Users size={16} />} />
            </div>

            <h2 className="mb-3 text-xl font-semibold text-[#003A6C] print:mb-4">Comparativa de plantillas esta semana</h2>

            {pageError ? (
              <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                {pageError}
              </div>
            ) : null}

            {loading ? (
              <div className="mb-12 rounded-2xl border border-[#C9E1F0] bg-white px-6 py-10 text-center text-sm text-[#4B778D] shadow-sm">
                Cargando reporte de plantillas...
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-2 md:gap-4 mb-8 print:grid-cols-3 print:gap-4 print:mb-8">
                  {visibleStats.length > 0 ? (
                    visibleStats.map((item, idx) => <TrendCard key={idx} {...item} />)
                  ) : (
                    <div className="col-span-3 rounded-2xl border border-dashed border-[#C9E1F0] bg-white px-6 py-10 text-center text-sm text-[#4B778D] shadow-sm">
                      Aún no hay datos de plantillas para mostrar en este periodo.
                    </div>
                  )}
                </div>

                {/* Gráfico ampliado para la hoja impresa */}
                <div className="bg-white rounded-3xl border border-[#C9E1F0] p-4 md:p-6 shadow-sm print:p-6 print:break-inside-avoid">
                  <h3 className="mb-3 text-xl font-semibold text-[#003A6C] print:mb-4">Evolución semanal de visitas</h3>

                  <div className="h-64 sm:h-80 lg:h-80 rounded-2xl bg-[#F5F5F5] p-3 sm:p-6 overflow-x-auto print:overflow-visible print:h-64 print:w-full">
                    {visibleChartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={visibleChartData} barGap={6}>
                          <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#B7D4EA" />
                          <XAxis dataKey="day" tick={{ fill: "#3B73A5", fontSize: 12, fontWeight: 500 }} axisLine={{ stroke: "#6FA3C8" }} tickLine={false} />
                          <YAxis tick={{ fill: "#3B73A5", fontSize: 11 }} axisLine={{ stroke: "#6FA3C8" }} tickLine={false} />
                          <Tooltip
                            cursor={{ fill: "rgba(120,120,120,0.18)" }}
                            contentStyle={{ borderRadius: "12px", border: "1px solid #78B4D4", backgroundColor: "#FFFFFF", padding: "10px" }}
                            labelStyle={{ color: "#003A6C", fontWeight: 700, fontSize: "14px", marginBottom: "5px" }}
                          />
                          <Legend wrapperStyle={{ paddingTop: "12px", fontSize: "14px" }} />
                          <Bar dataKey="moderna" name="Moderna" fill="#003A6C" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="minimalista" name="Minimalista" fill="#4D88B3" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="corporativa" name="Corporativa" fill="#A8D0E3" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-[#4B778D]">La gráfica se mostrará cuando la API devuelva las visitas diarias.</div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}

{/* KPICard: Se eliminaron las restricciones de ancho máximo durante la impresión para mitigar cortes de texto */}
const KPICard = ({ label, value, change, helper, icon, isNegative }: any) => (
  <div className="bg-white p-3 sm:p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between w-full max-w-37.5 md:max-w-none print:max-w-none print:p-4">
    <div className="flex items-center gap-1.5 text-gray-400 mb-2 print:mb-1">
      {icon}
      <span className="text-[10px] sm:text-xs print:text-xs font-bold uppercase tracking-wider truncate">{label}</span>
    </div>

    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-1">
      <div className="min-w-0 flex-1">
        <span className="text-base sm:text-2xl md:text-xl lg:text-2xl print:text-xl font-semibold text-[#003A6C] block truncate">{value}</span>
        {helper ? <p className="text-[10px] sm:text-xs print:text-[11px] font-medium text-gray-400 truncate">{helper}</p> : null}
      </div>
      {change ? (
        <span className={`flex items-center text-[10px] sm:text-xs print:text-xs font-bold shrink-0 ${isNegative ? "text-red-500" : "text-green-500"}`}>
          {isNegative ? <TrendingDown className="w-3 h-3 mr-0.5" /> : <TrendingUp className="w-3 h-3 mr-0.5" />}
          <span className="truncate">{change}</span>
        </span>
      ) : null}
    </div>
  </div>
)

{/* TrendCard */}
const TrendCard = ({ template_name, retention, avg_time, variation, footerBadge, footerColor, isCurrent }: TrendStats) => (
  <div className="bg-white rounded-2xl border border-[#C9E1F0] overflow-hidden flex flex-col shadow-sm justify-between">
    <div className="p-3 sm:p-5 flex-1 print:p-4">
      <div className="flex justify-between items-center mb-3 sm:mb-4 gap-1">
        <h3 className="text-xs sm:text-xl print:text-base font-bold text-[#003A6C] truncate">{template_name}</h3>
        {isCurrent ? <span className="bg-slate-900 text-white text-[8px] sm:text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0">LÍDER</span> : null}
      </div>

      <div className="space-y-1.5 text-[11px] sm:text-sm print:text-xs">
        <div className="flex justify-between border-b pb-1">
          <span className="text-gray-400 truncate mr-1">Retención</span>
          <span className="font-bold text-[#003A6C] shrink-0">{retention}%</span>
        </div>

        <div className="flex justify-between border-b pb-1">
          <span className="text-gray-400 truncate mr-1">Tiempo promedio de lectura</span>
          <span className="font-bold text-[#003A6C] shrink-0">{formatTemplateTime(avg_time)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400 truncate mr-1">Variación Semanal</span>
          <span className={`font-bold shrink-0 ${variation < 0 ? "text-red-500" : "text-green-500"}`}>{formatTemplateVariation(variation)}</span>
        </div>
      </div>
    </div>

    <div className={`${footerColor} py-2 text-center text-white text-[9px] sm:text-xs font-bold uppercase tracking-wider truncate`}>{footerBadge}</div>
  </div>
)

export default TendenciaPlantillasPage