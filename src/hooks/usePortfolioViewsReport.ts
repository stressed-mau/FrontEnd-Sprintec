import { useEffect, useRef, useState } from "react"
import { useReactToPrint } from "react-to-print"

import { usePortfolioAnalytics } from "@/hooks/usePortfolioAnalytics"
import { getAuthSession } from "@/services/auth"
import { getUserSocialNetworks } from "@/services/socialNetworksService"
import type { SocialNetwork } from "@/types/socialNetworks"
import {
  getMonthRows,
  getPrintLineChart,
  getSocialNetworkRows,
  getTopProjectRows,
} from "@/utils/portfolioViewsReportUtils"

const PORTFOLIO_VIEWS_PRINT_STYLE = `
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
`

export function usePortfolioViewsReport() {
  const session = getAuthSession()
  const { analytics, loading, error } = usePortfolioAnalytics()
  const [registeredNetworks, setRegisteredNetworks] = useState<SocialNetwork[]>([])
  const reportRef = useRef<HTMLDivElement>(null)
  const reportDate = new Date().toLocaleDateString()
  const monthRows = getMonthRows(analytics?.viewsByMonth ?? {})
  const maxMonthViews = Math.max(...monthRows.map((row) => row.views), 1)
  const reportPeriod = getReportPeriod(analytics?.period)
  const handleExportPDF = useReactToPrint({
    contentRef: reportRef,
    documentTitle: `Reporte-Visualizaciones-${reportDate}`,
    pageStyle: PORTFOLIO_VIEWS_PRINT_STYLE,
  })

  useEffect(() => {
    let isMounted = true

    getUserSocialNetworks()
      .then((networks) => {
        if (isMounted) setRegisteredNetworks(networks)
      })
      .catch(() => {
        if (isMounted) setRegisteredNetworks([])
      })

    return () => {
      isMounted = false
    }
  }, [])

  return {
    session,
    analytics,
    loading,
    reportRef,
    reportDate,
    reportPeriod,
    handleExportPDF,
    visibleError: getVisibleError(error),
    monthRows,
    hasMonthRows: Object.keys(analytics?.viewsByMonth ?? {}).length > 0,
    maxMonthViews,
    printMonthChart: getPrintLineChart(monthRows, maxMonthViews),
    topProjectRows: getTopProjectRows(analytics?.projectViews ?? []),
    socialNetworkRows: getSocialNetworkRows(analytics?.socialClicks ?? [], registeredNetworks),
  }
}

function getVisibleError(error: string) {
  return /no se pudieron cargar las metricas del portafolio/i.test(error) ? "" : error
}

function getReportPeriod(period?: { from?: string; to?: string }) {
  return period?.from && period?.to ? `${period.from} - ${period.to}` : "Reporte general"
}
