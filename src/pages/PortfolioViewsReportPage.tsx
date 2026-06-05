import Header from "@/components/HeaderUser"
import Sidebar from "@/components/Sidebar"
import { PortfolioViewsDetailsGrid } from "@/components/portfolioViews/PortfolioViewsDetailsGrid"
import { PortfolioViewsErrorCard } from "@/components/portfolioViews/PortfolioViewsErrorCard"
import { PortfolioViewsMonthChartCard } from "@/components/portfolioViews/PortfolioViewsMonthChartCard"
import { PortfolioViewsPrintHeader } from "@/components/portfolioViews/PortfolioViewsPrintHeader"
import { PortfolioViewsReportHeader } from "@/components/portfolioViews/PortfolioViewsReportHeader"
import { PortfolioViewsSummaryCards } from "@/components/portfolioViews/PortfolioViewsSummaryCards"
import { usePortfolioViewsReport } from "@/hooks/usePortfolioViewsReport"

const PortfolioViewsReportPage = () => {
  const {
    analytics,
    handleExportPDF,
    hasMonthRows,
    loading,
    maxMonthViews,
    monthRows,
    printMonthChart,
    reportDate,
    reportPeriod,
    reportRef,
    session,
    socialNetworkRows,
    topProjectRows,
    visibleError,
  } = usePortfolioViewsReport()

  if (!session?.user) return null

  return (
    <div className="min-h-screen bg-[#F7F0E1] font-sans">
      <Header />
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <main className="flex-1 px-4 py-6 md:px-8 lg:px-10">
          <div ref={reportRef} className="mx-auto max-w-7xl space-y-6 print:max-w-full print:px-2 print:pt-6 print:scale-[0.92] print:origin-top">
            <PortfolioViewsPrintHeader reportDate={reportDate} reportPeriod={reportPeriod} />
            <PortfolioViewsReportHeader loading={loading} onExportPDF={handleExportPDF} />
            <PortfolioViewsErrorCard message={visibleError} />
            <PortfolioViewsSummaryCards analytics={analytics} loading={loading} />
            <PortfolioViewsMonthChartCard
              loading={loading}
              hasMonthRows={hasMonthRows}
              monthRows={monthRows}
              maxMonthViews={maxMonthViews}
              printMonthChart={printMonthChart}
            />
            <PortfolioViewsDetailsGrid topProjectRows={topProjectRows} socialNetworkRows={socialNetworkRows} />
          </div>
        </main>
      </div>
    </div>
  )
}

export default PortfolioViewsReportPage
