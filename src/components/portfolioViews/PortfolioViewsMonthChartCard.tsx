import { Eye } from "lucide-react"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { MonthViewRow } from "@/utils/portfolioViewsReportUtils"

interface PortfolioViewsMonthChartCardProps {
  loading: boolean
  hasMonthRows: boolean
  monthRows: MonthViewRow[]
  maxMonthViews: number
  printMonthChart: ReturnType<typeof import("@/utils/portfolioViewsReportUtils").getPrintLineChart>
}

export function PortfolioViewsMonthChartCard(props: PortfolioViewsMonthChartCardProps) {
  return (
    <Card className="print:break-inside-avoid print:overflow-hidden">
      <CardHeader>
        <CardTitle>Vistas por mes</CardTitle>
      </CardHeader>
      <CardContent className="print:px-2">
        <MonthChartContent {...props} />
      </CardContent>
    </Card>
  )
}

function MonthChartContent({ loading, hasMonthRows, monthRows, maxMonthViews, printMonthChart }: PortfolioViewsMonthChartCardProps) {
  if (loading) return <p className="text-sm font-medium text-[#4B778D]">Cargando metricas...</p>
  if (!hasMonthRows) return <EmptyMonthChart />

  return (
    <div>
      <p className="mb-6 text-sm text-[#4B778D]">Visualizaciones por mes (ultimos 5 meses)</p>
      <ResponsiveMonthChart monthRows={monthRows} maxMonthViews={maxMonthViews} />
      <PrintMonthChart printMonthChart={printMonthChart} />
    </div>
  )
}

function ResponsiveMonthChart({ monthRows, maxMonthViews }: { monthRows: MonthViewRow[]; maxMonthViews: number }) {
  return (
    <div className="portfolio-views-month-chart h-64 w-full min-w-0 max-w-full overflow-hidden print:hidden">
      <ResponsiveContainer width="100%" height="100%" debounce={0}>
        <LineChart data={monthRows} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis dataKey="month" axisLine={false} tickLine={false} interval={0} minTickGap={20} tickMargin={8} padding={{ left: 20, right: 20 }} tick={{ fill: "#4B778D", fontSize: 11 }} />
          <YAxis width={35} axisLine={false} tickLine={false} allowDecimals={false} domain={[0, maxMonthViews]} tick={{ fill: "#4B778D", fontSize: 12 }} />
          <Tooltip />
          <Line type="monotone" dataKey="views" name="Vistas" stroke="#0E7D96" strokeWidth={3} isAnimationActive={false} dot={{ r: 6, fill: "#0E7D96", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 8, fill: "#003A6C" }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function PrintMonthChart({ printMonthChart }: Pick<PortfolioViewsMonthChartCardProps, "printMonthChart">) {
  return (
    <div className="hidden print:block print:w-full print:overflow-hidden">
      <svg viewBox={`0 0 ${printMonthChart.width} ${printMonthChart.height}`} className="mx-auto h-auto w-[640px] max-w-full" role="img" aria-label="Grafica de vistas por mes de los ultimos 5 meses">
        {printMonthChart.ticks.map((tick) => <PrintChartTick key={tick} tick={tick} printMonthChart={printMonthChart} />)}
        <polyline points={printMonthChart.linePoints} fill="none" stroke="#0E7D96" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {printMonthChart.points.map((point) => (
          <g key={point.month}>
            <circle cx={point.x} cy={point.y} r="5" fill="#0E7D96" stroke="#FFFFFF" strokeWidth="2" />
            <text x={point.x} y={printMonthChart.height - 16} textAnchor="middle" fontSize="11" fill="#4B778D">{point.month}</text>
          </g>
        ))}
      </svg>
    </div>
  )
}

function PrintChartTick({ tick, printMonthChart }: { tick: number; printMonthChart: PortfolioViewsMonthChartCardProps["printMonthChart"] }) {
  const y = printMonthChart.padding.top + printMonthChart.chartHeight - (tick / printMonthChart.chartMax) * printMonthChart.chartHeight

  return (
    <g>
      <line x1={printMonthChart.padding.left} x2={printMonthChart.padding.left + printMonthChart.chartWidth} y1={y} y2={y} stroke="#E2E8F0" strokeDasharray="3 3" />
      <text x={printMonthChart.padding.left - 12} y={y + 4} textAnchor="end" fontSize="11" fill="#4B778D">{tick}</text>
    </g>
  )
}

function EmptyMonthChart() {
  return (
    <div className="py-8 text-center">
      <Eye className="mx-auto mb-3 h-12 w-12 text-gray-300" />
      <p className="text-sm text-gray-600">Aun no hay vistas registradas por mes.</p>
    </div>
  )
}
