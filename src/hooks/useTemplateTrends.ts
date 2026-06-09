import { useEffect, useState } from "react"

import { getTemplateTrends, normalizeTemplateTrendsError, type TemplateTrendsReport, type TrendChartPoint, type TrendStats, type TemplateTrendsOptions } from "@/services/templateTrendsService"

export function useTemplateTrends(options: TemplateTrendsOptions = {}) {
  const { weekOffset = 0, reportId = null } = options;
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<TrendStats[]>([])
  const [chartData, setChartData] = useState<TrendChartPoint[]>([])
  const [report, setReport] = useState<TemplateTrendsReport | null>(null)
  const [pageError, setPageError] = useState("")

  useEffect(() => {
    let isMounted = true

    const loadTrends = async () => {
      setLoading(true)

      try {
        const result = await getTemplateTrends({ weekOffset, reportId })
        if (isMounted) {
          setStats(result.stats)
          setChartData(result.chartData)
          setReport(result.report)
          setPageError("")
        }
      } catch (error) {
        if (isMounted) {
          setStats([])
          setChartData([])
          setReport(null)
          setPageError(normalizeTemplateTrendsError(error).message)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    void loadTrends()

    return () => {
      isMounted = false
    }
  }, [weekOffset, reportId])

  return { loading, stats, chartData, report, pageError, setPageError }
}