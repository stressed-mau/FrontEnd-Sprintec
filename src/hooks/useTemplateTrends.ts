import { useEffect, useState } from "react"

import { getTemplateTrends, normalizeTemplateTrendsError, type TrendChartPoint, type TrendStats } from "@/services/templateTrendsService"

export function useTemplateTrends() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<TrendStats[]>([])
  const [chartData, setChartData] = useState<TrendChartPoint[]>([])
  const [pageError, setPageError] = useState("")

  useEffect(() => {
    let isMounted = true

    const loadTrends = async () => {
      setLoading(true)

      try {
        const result = await getTemplateTrends()
        if (isMounted) {
          setStats(result.stats)
          setChartData(result.chartData)
          setPageError("")
        }
      } catch (error) {
        if (isMounted) {
          setStats([])
          setChartData([])
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
  }, [])

  return { loading, stats, chartData, pageError, setPageError }
}