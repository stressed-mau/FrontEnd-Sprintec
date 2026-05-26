import { useCallback, useEffect, useState } from "react"

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

  const loadAnalytics = useCallback(async (silent = false) => {
      try {
        setState((current) => ({ ...current, loading: silent ? current.loading : true, error: "" }))
        const analytics = await getPortfolioAnalytics()

        setState({
          analytics,
          loading: false,
          error: "",
        })
      } catch (error) {
        setState((current) => ({
          analytics: silent ? current.analytics : null,
          loading: false,
          error: error instanceof Error ? error.message : "No se pudieron cargar las metricas del portafolio.",
        }))
      }
  }, [])

  useEffect(() => {
    loadAnalytics()
  }, [loadAnalytics])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      loadAnalytics(true)
    }, 20000)

    function handleFocus() {
      loadAnalytics(true)
    }

    window.addEventListener("focus", handleFocus)

    return () => {
      window.clearInterval(intervalId)
      window.removeEventListener("focus", handleFocus)
    }
  }, [loadAnalytics])

  return { ...state, refresh: () => loadAnalytics(false) }
}
