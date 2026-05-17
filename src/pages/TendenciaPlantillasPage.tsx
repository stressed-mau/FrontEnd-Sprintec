import { ChevronLeft, ChevronRight, Clock, Crown, MousePointer2, TrendingDown, TrendingUp, Users, Download } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import Header from "@/components/HeaderUser"
import Sidebar from "@/components/Sidebar"
import { Footer } from "@/components/Footer"
import { useTemplateTrends } from "@/hooks/useTemplateTrends"
import type { TrendChartPoint, TrendStats } from "@/services/templateTrendsService"
import { Button } from "@/components/ui/button"
import { useCurrentWeekRange } from "@/hooks/useCurrentWeekRange"

const TendenciaPlantillasPage = () => {
  const { loading, stats, chartData, pageError } = useTemplateTrends()
  const fallbackStats: TrendStats[] = []
  const fallbackChartData: TrendChartPoint[] = []
  const currentWeekRange = useCurrentWeekRange()

  const visibleStats = stats.length > 0 ? stats : fallbackStats
  const visibleChartData = chartData.length > 0 ? chartData : fallbackChartData
  const leadStat = visibleStats[0]

  return (
    <div className="min-h-screen bg-[#F7F0E1] flex flex-col">
      <Header />

      <div className="flex flex-col lg:flex-row flex-1">
        <Sidebar />

        <main className="flex-1 px-4 py-6 md:px-8 lg:px-10">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-4">
             <div>
                <h1 className="mb-2 text-3xl font-bold text-[#003A6C]"> Tendencia de Plantillas </h1>
                <p className="text-[#4B778D]"> Descubre qué plantilla prefieren los reclutadores esta semana </p>
             </div>

         <div className="flex flex-col items-start gap-3 md:items-end">
          <div className="flex flex-col items-start gap-2 sm:items-end">
          <Button
            type="button"
            disabled
            className="bg-[#003A6C] text-white shadow-sm transition-colors hover:bg-[#4982AD]" >
           <Download className="mr-2 h-4 w-4" />
             Exportar a PDF
          </Button>
          <p className="text-sm font-medium text-[#4B778D]">  Disponible cuando existan datos registrados </p>
        </div>

    <div className="flex flex-wrap items-center justify-center bg-white border border-[#0E7D96]/20 rounded-xl px-3 sm:px-4 py-2 gap-2 sm:gap-4 shadow-sm">
      <button
        className="text-[#003A6C] hover:bg-gray-100 p-1 rounded-lg transition-colors"
        type="button"      >
        <ChevronLeft size={20} />
      </button>

      <span className="text-sm font-bold text-[#003A6C]">    {currentWeekRange}   </span>

      <button
        className="text-[#003A6C] hover:bg-gray-100 p-1 rounded-lg transition-colors"
        type="button"   >
        <ChevronRight size={20} />
      </button>
    </div>
  </div>
</div>

            <div className="mb-5 p-2 bg-[#E0F2FE] border border-[#7DD3FC] rounded-2xl w-fit">
              <span className="text-[#0369A1] font-bold text-sm italic">
                Tu plantilla actual: {leadStat?.template_name ?? "Pendiente de API"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <KPICard label="Plantilla líder" value={leadStat?.template_name ?? "Pendiente"} change={leadStat?.variation ?? "Sin dato"} icon={<Crown size={18} />} isNegative={Boolean(leadStat?.variation?.startsWith("-"))} />
              <KPICard label="Tiempo de lectura" value={leadStat?.read_time ?? "Pendiente"} change={leadStat?.variation ?? "Sin dato"} icon={<Clock size={18} />} />
              <KPICard label="Tasa interés" value={leadStat?.interest_rate ?? "Pendiente"} change={leadStat?.variation ?? "Sin dato"} icon={<MousePointer2 size={18} />} isNegative={Boolean(leadStat?.variation?.startsWith("-"))} />
              <KPICard label="Registros API" value={String(visibleStats.length)} change={visibleStats.length > 0 ? "Disponible" : "Sin dato"} icon={<Users size={18} />} />
            </div>

            <h2 className="mb-2 text-2xl font-semibold text-[#003A6C]">Comparativa de plantillas ésta semana</h2>

            {pageError ? (
              <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                {pageError}
              </div>
            ) : null}

            {loading ? (
              <div className="mb-12 rounded-2xl border border-[#C9E1F0] bg-white px-6 py-10 text-center text-sm text-[#4B778D] shadow-sm">
                Cargando tendencias de plantillas...
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                  {visibleStats.length > 0 ? (
                    visibleStats.map((item, idx) => <TrendCard key={idx} {...item} />)
                  ) : (
                    <div className="sm:col-span-2 xl:col-span-3 rounded-2xl border border-dashed border-[#C9E1F0] bg-white px-6 py-10 text-center text-sm text-[#4B778D] shadow-sm">
                      Aún no hay datos de plantillas para mostrar.
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-3xl border border-[#C9E1F0] p-8 shadow-sm">
                  <h3 className="mb-2 text-2xl font-semibold text-[#003A6C]">Evolución semanal de visitas</h3>

                  <div className="h-80 sm:h-105 lg:h-112.5 rounded-2xl bg-[#F5F5F5] p-3 sm:p-6 overflow-x-auto">
                    {visibleChartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={visibleChartData} barGap={8}>
                          <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#B7D4EA" />
                          <XAxis dataKey="day" tick={{ fill: "#3B73A5", fontSize: 16, fontWeight: 500 }} axisLine={{ stroke: "#6FA3C8" }} tickLine={false} />
                          <YAxis tick={{ fill: "#3B73A5", fontSize: 14 }} axisLine={{ stroke: "#6FA3C8" }} tickLine={false} />
                          <Tooltip
                            cursor={{ fill: "rgba(120,120,120,0.18)" }}
                            contentStyle={{ borderRadius: "16px", border: "1px solid #78B4D4", backgroundColor: "#FFFFFF", padding: "16px" }}
                            labelStyle={{ color: "#003A6C", fontWeight: 700, fontSize: "18px", marginBottom: "10px" }}
                          />
                          <Legend wrapperStyle={{ paddingTop: "24px", fontSize: "18px" }} />
                          <Bar dataKey="moderna" name="Moderna" fill="#003A6C" radius={[6, 6, 0, 0]} />
                          <Bar dataKey="minimalista" name="Minimalista" fill="#4D88B3" radius={[6, 6, 0, 0]} />
                          <Bar dataKey="corporativa" name="Corporativa" fill="#A8D0E3" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-[#4B778D]">La gráfica se mostrará cuando la API devuelva la serie semanal.</div>
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

const KPICard = ({ label, value, change, icon, isNegative }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
    <div className="flex items-center gap-2 text-gray-400 mb-3">
      {icon}
      <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
    </div>

    <div className="flex justify-between items-end">
      <span className="text-2xl font-bold text-[#003A6C]">{value}</span>
      <span className={`flex items-center gap-1 text-xs font-bold ${isNegative ? "text-red-500" : "text-green-500"}`}>
        {isNegative ? <TrendingDown className="w-4 h-4 mr-1" /> : <TrendingUp className="w-4 h-4 mr-1" />}
        {change}
      </span>
    </div>
  </div>
)

const TrendCard = ({ template_name, read_time, interest_rate, variation, footerBadge, footerColor, isCurrent }: TrendStats) => (
  <div className="bg-white rounded-[2rem] border border-[#C9E1F0] overflow-hidden flex flex-col shadow-sm">
    <div className="p-5 sm:p-8 flex-1">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-[#003A6C]">{template_name}</h3>

        {isCurrent ? <span className="bg-slate-900 text-white text-[10px] px-2 py-1 rounded-lg font-bold">TU PLANTILLA</span> : null}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between text-sm border-b pb-2">
          <span className="text-gray-400">Tiempo lectura</span>
          <span className="font-bold text-[#003A6C]">{read_time}</span>
        </div>

        <div className="flex justify-between text-sm border-b pb-2">
          <span className="text-gray-400">Tasa interés</span>
          <span className="font-bold text-[#003A6C]">{interest_rate}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Variación</span>
          <span className="font-bold text-green-500">{variation}</span>
        </div>
      </div>
    </div>

    <div className={`${footerColor} py-3 text-center text-white text-sm font-bold uppercase tracking-widest`}>{footerBadge}</div>
  </div>
)

export default TendenciaPlantillasPage