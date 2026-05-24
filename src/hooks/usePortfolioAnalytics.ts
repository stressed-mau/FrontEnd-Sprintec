import { useEffect, useState } from "react"

import { getPortfolioAnalytics, type PortfolioAnalytics } from "@/services/portfolioAnalyticsService"

type AnalyticsState = {
  analytics: PortfolioAnalytics | null
  loading: boolean
  error: string
}

export function usePortfolioAnalytics() {
  const [state, setState] = useState<AnalyticsState>({
    analytics: null,
    loading: true,
    error: "",
  })

  useEffect(() => {
    let isMounted = true

    async function loadAnalytics() {
      try {
        setState((current) => ({ ...current, loading: true, error: "" }))
        const analytics = await getPortfolioAnalytics()

        if (!isMounted) return

        setState({
          analytics,
          loading: false,
          error: "",
        })
      } catch (error) {
        if (!isMounted) return

        setState({
          analytics: null,
          loading: false,
          error: error instanceof Error ? error.message : "No se pudieron cargar las metricas del portafolio.",
        })
      }
    }

    loadAnalytics()

    return () => {
      isMounted = false
    }
  }, [])

  return state
}
