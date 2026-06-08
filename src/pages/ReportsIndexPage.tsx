import { FileText, LayoutGrid, List, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Footer } from "@/components/Footer";
import HeaderUser from "@/components/HeaderUser";
import Sidebar from "@/components/Sidebar";
import ReportCardGrid from "@/components/reports/ReportCardGrid";
import ReportRowList from "@/components/reports/ReportRowList";
import { getAuthSession } from "@/services/auth";
import { TEMPLATE_TRENDS_ROUTE } from "@/routes/route-paths";
import AdminSidebar from "../components/admin/AdminSidebar";
import { useReportsIndex } from "@/hooks/useReportsIndex";

const ReportsIndexPage = () => {
  const navigate = useNavigate();
  const session = getAuthSession();
  const roleId = session?.user?.role_id;
  const isAdmin = roleId === 2;
  const {reports,filteredReports,loading,error,search,setSearch, dateFrom,setDateFrom,dateTo,
    setDateTo,view,setView,hasFilters,clearFilters, } = useReportsIndex();

  function handleNavigate(globalIndex: number) {
    navigate(globalIndex === 0
      ? TEMPLATE_TRENDS_ROUTE
      : `${TEMPLATE_TRENDS_ROUTE}?offset=-${globalIndex}`);
  }

  return (
    <div className="min-h-screen bg-[#F7F0E1] flex flex-col">
      <HeaderUser />
      <div className="flex flex-col lg:flex-row flex-1">
        {isAdmin ? <AdminSidebar /> : <Sidebar />}
        <main className="flex-1 px-4 py-6 md:px-8 lg:px-10">
          <div className="mx-auto max-w-5xl">

            <div className="mb-6">
              <h1 className="text-[26px] font-semibold text-[#003A6C] tracking-tight">
                Historial de reportes
              </h1>
              <p className="text-sm text-[#4B778D] mt-1">
                Consulta el rendimiento global de las plantillas por semana
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                {error}
              </div>
            )}

            {!loading && (
              <div className="flex flex-wrap items-center gap-2.5 mb-4">
                {/* Buscador */}
                <div className="relative flex-1 min-w-50">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B778D]" />
                  <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Buscar por período (ej: mayo 2026)..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#C9E1F0] bg-white
                               text-[13.5px] text-[#003A6C] placeholder-[#8DAFC8]
                               focus:outline-none focus:border-[#003A6C] transition-colors"/>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#4B778D] whitespace-nowrap">Desde</span>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(event) => setDateFrom(event.target.value)}
                    className="px-2.5 py-2 rounded-xl border border-[#C9E1F0] bg-white
                               text-[12.5px] text-[#003A6C] focus:outline-none focus:border-[#003A6C] transition-colors"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#4B778D] whitespace-nowrap">Hasta</span>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(event) => setDateTo(event.target.value)}
                    className="px-2.5 py-2 rounded-xl border border-[#C9E1F0] bg-white
                               text-[12.5px] text-[#003A6C] focus:outline-none focus:border-[#003A6C] transition-colors"/>
                </div>

                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#C9E1F0]
                               bg-white text-[12.5px] text-[#4B778D] hover:border-[#4B778D]
                               hover:text-[#003A6C] transition-colors" >
                    <X className="w-3.5 h-3.5" /> Limpiar
                  </button>
                )}

                <div className="flex border border-[#C9E1F0] rounded-xl overflow-hidden bg-white ml-auto">
                  <button
                    onClick={() => setView("grid")}
                    title="Vista cuadrícula"
                    className={`p-2 transition-colors ${view === "grid"
                      ? "bg-[#003A6C] text-white"
                      : "text-[#8DAFC8] hover:bg-sky-50 hover:text-[#003A6C]"}`}>
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setView("list")}
                    title="Vista lista"
                    className={`p-2 transition-colors ${view === "list"
                      ? "bg-[#003A6C] text-white"
                      : "text-[#8DAFC8] hover:bg-sky-50 hover:text-[#003A6C]"}`}  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {!loading && reports.length > 0 && (
              <p className="text-[12.5px] text-[#4B778D] mb-4 flex items-center gap-2">
                {hasFilters
                  ? `${filteredReports.length} de ${reports.length} reportes`
                  : "Mostrando todos los reportes"}
                <span className="bg-[#E0F2FE] text-[#0369A1] text-[11.5px] font-semibold px-2 py-0.5 rounded-full">
                  {filteredReports.length}
                </span>
              </p>
            )}

            {loading && (
              <div className="rounded-2xl border border-[#C9E1F0] bg-white px-6 py-10 text-center text-sm text-[#4B778D]">
                Cargando historial de reportes...
              </div>
            )}

            {!loading && view === "grid" && filteredReports.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredReports.map((report) => {
                  const globalIndex = reports.findIndex(r => r.id === report.id)
                  return (
                    <ReportCardGrid
                      key={report.id}
                      report={report}
                      index={globalIndex}
                      onClick={() => handleNavigate(globalIndex)}/>
                  )})}
              </div>
            )}

              {!loading && view === "list" && filteredReports.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#C9E1F0] overflow-hidden">
                <div className="grid gap-4 px-5 py-2.5 border-b border-slate-100 text-[11px] font-semibold text-[#8DAFC8] uppercase tracking-wider"
                  style={{ gridTemplateColumns: "2fr 1fr 1fr 40px" }} >
                  <span>Período</span>
                  <span>Portafolios</span>
                  <span>Estado</span>
                  <span />
                </div>
                {filteredReports.map((report) => {
                  const globalIndex = reports.findIndex(r => r.id === report.id)
                  return (
                    <ReportRowList
                      key={report.id}
                      report={report}
                      index={globalIndex}
                      onClick={() => handleNavigate(globalIndex)}/>
                  )})}
              </div>
            )}

              {!loading && filteredReports.length === 0 && (
              <div className="rounded-2xl border border-dashed border-[#C9E1F0] bg-white px-6 py-14 text-center">
                <FileText className="w-9 h-9 text-[#C9E1F0] mx-auto mb-3" />
                <p className="text-[14.5px] font-medium text-[#4B778D]">
                  {hasFilters ? "Sin resultados para estos filtros" : "Aún no hay reportes generados"}
                </p>
                <p className="text-[13px] text-[#8DAFC8] mt-1">
                  {hasFilters ? "Prueba ajustando la búsqueda o el rango de fechas" : "Los reportes aparecerán aquí una vez generados"}
                </p>
                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 text-[13px] text-[#003A6C] underline underline-offset-2 hover:text-[#0E7D96]" >
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
