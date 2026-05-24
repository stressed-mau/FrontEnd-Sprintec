import { useEffect, useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronRight, FileText, Briefcase, Search, LayoutGrid, List, X } from "lucide-react"
import Header from "@/components/HeaderUser"
import Sidebar from "@/components/Sidebar"
import { Footer } from "@/components/Footer"
import { api } from "@/services/api"
import { TEMPLATE_TRENDS_ROUTE } from "@/routes/route-paths"

// ─── Utils ────────────────────────────────────────────────────────────────────

function formatPeriodLabel(start: string, end: string) {
  const fmt = new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short", year: "numeric" })
  return `${fmt.format(new Date(`${start}T00:00:00`))} – ${fmt.format(new Date(`${end}T00:00:00`))}`
}

function getPeriodSearchText(start: string, end: string, index: number) {
  const s = new Date(`${start}T00:00:00`)
  const e = new Date(`${end}T00:00:00`)
  const months = ["enero","febrero","marzo","abril","mayo","junio",
                  "julio","agosto","septiembre","octubre","noviembre","diciembre"]
  return [start, end, months[s.getMonth()], months[e.getMonth()],
          s.getFullYear(), e.getFullYear(), index === 0 ? "actual" : `hace ${index}`
  ].join(" ").toLowerCase()
}

function getBadge(index: number) {
  if (index === 0) return { label: "Actual",        className: "bg-emerald-50 text-emerald-700" }
  if (index === 1) return { label: "Hace 1 sem.",   className: "bg-slate-100 text-slate-500" }
  return             { label: `Hace ${index} sem.`, className: "bg-slate-100 text-slate-500" }
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface ReportItem {
  id: number
  period_start: string
  period_end: string
  total_portfolios: number
  created_at: string
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ReportCardGrid({ report, index, onClick }: {
  report: ReportItem; index: number; onClick: () => void
}) {
  const badge = getBadge(index)
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-start bg-white rounded-2xl p-5 border border-[#C9E1F0]
                 hover:border-[#003A6C] hover:shadow-md transition-all text-left w-full"
    >
      <div className="w-full flex justify-between items-start mb-4">
        <div className="bg-[#E0F2FE] p-2.5 rounded-xl">
          <FileText className="text-[#0369A1] w-5 h-5" />
        </div>
        <span className={`text-[10.5px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${badge.className}`}>
          {badge.label}
        </span>
      </div>
      <h3 className="text-[15px] font-semibold text-[#003A6C] mb-2 leading-snug">
        {formatPeriodLabel(report.period_start, report.period_end)}
      </h3>
      <div className="flex items-center gap-1.5 text-[12.5px] text-[#4B778D] mb-5">
        <Briefcase className="w-3.5 h-3.5" />
        <span>{report.total_portfolios} portafolios analizados</span>
      </div>
      <div className="w-full mt-auto flex items-center justify-between text-[#003A6C]
                      font-semibold text-[12.5px] border-t border-slate-100 pt-3.5
                      group-hover:text-[#0E7D96] transition-colors">
        <span>Ver reporte detallado</span>
        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
      </div>
    </button>
  )
}

function ReportRowList({ report, index, onClick }: {
  report: ReportItem; index: number; onClick: () => void
}) {
  const badge = getBadge(index)
  return (
    <button
      onClick={onClick}
      className="group w-full grid items-center gap-4 px-5 py-3.5 border-b border-slate-100
                 last:border-none hover:bg-sky-50/50 transition-colors text-left"
      style={{ gridTemplateColumns: "2fr 1fr 1fr 40px" }}
    >
      <div className="flex items-center gap-3">
        <div className="bg-[#E0F2FE] p-2 rounded-lg flex-shrink-0">
          <FileText className="text-[#0369A1] w-4 h-4" />
        </div>
        <span className="text-[13.5px] font-semibold text-[#003A6C]">
          {formatPeriodLabel(report.period_start, report.period_end)}
        </span>
      </div>
      <span className="text-[13px] text-[#4B778D] flex items-center gap-1.5">
        <Briefcase className="w-3.5 h-3.5" />
        {report.total_portfolios}
      </span>
      <span className={`text-[10.5px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider w-fit ${badge.className}`}>
        {badge.label}
      </span>
      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#003A6C] group-hover:translate-x-0.5 transition-all" />
    </button>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const ReportsIndexPage = () => {
  const navigate = useNavigate()
  const [reports, setReports]   = useState<ReportItem[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState("")
  const [search, setSearch]     = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo]     = useState("")
  const [view, setView]         = useState<"grid" | "list">("grid")

  useEffect(() => {
    let mounted = true
    api.get("/tracking/global-reports")
      .then(res => {
        if (!mounted) return
        const data = res.data?.data ?? res.data
        setReports(Array.isArray(data) ? data : [])
      })
      .catch(err => {
        if (mounted) setError(err.response?.data?.message || err.message || "No se pudo cargar el historial.")
      })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  const filtered = useMemo(() => {
    return reports.filter((r, i) => {
      if (search) {
        const hay = getPeriodSearchText(r.period_start, r.period_end, i)
        if (!hay.includes(search.toLowerCase())) return false
      }
      if (dateFrom && r.period_end < dateFrom) return false
      if (dateTo   && r.period_start > dateTo)  return false
      return true
    })
  }, [reports, search, dateFrom, dateTo])

  const hasFilters = search || dateFrom || dateTo

  function handleNavigate(globalIndex: number) {
    navigate(globalIndex === 0
      ? TEMPLATE_TRENDS_ROUTE
      : `${TEMPLATE_TRENDS_ROUTE}?offset=-${globalIndex}`)
  }

  return (
    <div className="min-h-screen bg-[#F7F0E1] flex flex-col">
      <Header />
      <div className="flex flex-col lg:flex-row flex-1">
        <Sidebar />
        <main className="flex-1 px-4 py-6 md:px-8 lg:px-10">
          <div className="mx-auto max-w-5xl">

            {/* Cabecera */}
            <div className="mb-6">
              <h1 className="text-[26px] font-semibold text-[#003A6C] tracking-tight">
                Historial de reportes
              </h1>
              <p className="text-sm text-[#4B778D] mt-1">
                Consulta el rendimiento global de las plantillas por semana
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                {error}
              </div>
            )}

            {/* Toolbar */}
            {!loading && (
              <div className="flex flex-wrap items-center gap-2.5 mb-4">
                {/* Buscador */}
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B778D]" />
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Buscar por período (ej: mayo 2026)..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#C9E1F0] bg-white
                               text-[13.5px] text-[#003A6C] placeholder-[#8DAFC8]
                               focus:outline-none focus:border-[#003A6C] transition-colors"
                  />
                </div>

                {/* Filtro desde */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#4B778D] whitespace-nowrap">Desde</span>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={e => setDateFrom(e.target.value)}
                    className="px-2.5 py-2 rounded-xl border border-[#C9E1F0] bg-white
                               text-[12.5px] text-[#003A6C] focus:outline-none focus:border-[#003A6C] transition-colors"
                  />
                </div>

                {/* Filtro hasta */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#4B778D] whitespace-nowrap">Hasta</span>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={e => setDateTo(e.target.value)}
                    className="px-2.5 py-2 rounded-xl border border-[#C9E1F0] bg-white
                               text-[12.5px] text-[#003A6C] focus:outline-none focus:border-[#003A6C] transition-colors"
                  />
                </div>

                {/* Limpiar filtros */}
                {hasFilters && (
                  <button
                    onClick={() => { setSearch(""); setDateFrom(""); setDateTo("") }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#C9E1F0]
                               bg-white text-[12.5px] text-[#4B778D] hover:border-[#4B778D]
                               hover:text-[#003A6C] transition-colors"
                  >
                    <X className="w-3.5 h-3.5" /> Limpiar
                  </button>
                )}

                {/* Toggle vista */}
                <div className="flex border border-[#C9E1F0] rounded-xl overflow-hidden bg-white ml-auto">
                  <button
                    onClick={() => setView("grid")}
                    title="Vista cuadrícula"
                    className={`p-2 transition-colors ${view === "grid"
                      ? "bg-[#003A6C] text-white"
                      : "text-[#8DAFC8] hover:bg-sky-50 hover:text-[#003A6C]"}`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setView("list")}
                    title="Vista lista"
                    className={`p-2 transition-colors ${view === "list"
                      ? "bg-[#003A6C] text-white"
                      : "text-[#8DAFC8] hover:bg-sky-50 hover:text-[#003A6C]"}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Meta */}
            {!loading && reports.length > 0 && (
              <p className="text-[12.5px] text-[#4B778D] mb-4 flex items-center gap-2">
                {hasFilters
                  ? `${filtered.length} de ${reports.length} reportes`
                  : "Mostrando todos los reportes"}
                <span className="bg-[#E0F2FE] text-[#0369A1] text-[11.5px] font-semibold px-2 py-0.5 rounded-full">
                  {filtered.length}
                </span>
              </p>
            )}

            {/* Loading */}
            {loading && (
              <div className="rounded-2xl border border-[#C9E1F0] bg-white px-6 py-10
                              text-center text-sm text-[#4B778D]">
                Cargando historial de reportes...
              </div>
            )}

            {/* Grid view */}
            {!loading && view === "grid" && filtered.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((report) => {
                  const globalIndex = reports.findIndex(r => r.id === report.id)
                  return (
                    <ReportCardGrid
                      key={report.id}
                      report={report}
                      index={globalIndex}
                      onClick={() => handleNavigate(globalIndex)}
                    />
                  )
                })}
              </div>
            )}

            {/* List view */}
            {!loading && view === "list" && filtered.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#C9E1F0] overflow-hidden">
                {/* Cabecera de tabla */}
                <div
                  className="grid gap-4 px-5 py-2.5 border-b border-slate-100
                             text-[11px] font-semibold text-[#8DAFC8] uppercase tracking-wider"
                  style={{ gridTemplateColumns: "2fr 1fr 1fr 40px" }}
                >
                  <span>Período</span>
                  <span>Portafolios</span>
                  <span>Estado</span>
                  <span />
                </div>
                {filtered.map((report) => {
                  const globalIndex = reports.findIndex(r => r.id === report.id)
                  return (
                    <ReportRowList
                      key={report.id}
                      report={report}
                      index={globalIndex}
                      onClick={() => handleNavigate(globalIndex)}
                    />
                  )
                })}
              </div>
            )}

            {/* Empty state */}
            {!loading && filtered.length === 0 && (
              <div className="rounded-2xl border border-dashed border-[#C9E1F0] bg-white
                              px-6 py-14 text-center">
                <FileText className="w-9 h-9 text-[#C9E1F0] mx-auto mb-3" />
                <p className="text-[14.5px] font-medium text-[#4B778D]">
                  {hasFilters ? "Sin resultados para estos filtros" : "Aún no hay reportes generados"}
                </p>
                <p className="text-[13px] text-[#8DAFC8] mt-1">
                  {hasFilters ? "Prueba ajustando la búsqueda o el rango de fechas" : "Los reportes aparecerán aquí una vez generados"}
                </p>
                {hasFilters && (
                  <button
                    onClick={() => { setSearch(""); setDateFrom(""); setDateTo("") }}
                    className="mt-4 text-[13px] text-[#003A6C] underline underline-offset-2 hover:text-[#0E7D96]"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
            )}

          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default ReportsIndexPage