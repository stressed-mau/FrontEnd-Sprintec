import axios from "axios"

import { api } from "@/services/api"

const publicApi = axios.create({
  baseURL: (api.defaults.baseURL ?? "/api").replace(/\/+$/, ""),
  timeout: 30_000,
  headers: {
    Accept: "application/json",
  },
})

type PortfolioAnalyticsDto = {
  status?: string
  data?: {
    total_views?: number
    views_this_month?: number
    views_by_month?: Record<string, number>
  }
  message?: string
}

export type PortfolioAnalytics = {
  totalViews: number
  viewsThisMonth: number
  viewsByMonth: Record<string, number>
}

function formatAnalyticsError(error: unknown) {
  if (axios.isAxiosError(error)) {
    const message =
      typeof error.response?.data?.message === "string"
        ? error.response.data.message
        : "No se pudieron cargar las metricas del portafolio."

    return new Error(message)
  }

  return new Error("No se pudieron cargar las metricas del portafolio.")
}

export async function recordPortfolioView(portfolioId: string | number) {
  try {
    await publicApi.post(`/portfolios/${portfolioId}/view`, null)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.warn("No se pudo registrar la vista del portafolio.", error.response?.data ?? error.message)
      return
    }

    console.warn("No se pudo registrar la vista del portafolio.")
  }
}

export async function getPortfolioAnalytics(): Promise<PortfolioAnalytics> {
  try {
    const response = await api.get<PortfolioAnalyticsDto>("/user/portfolio/analytics")

    if (response.data.status !== "success" || !response.data.data) {
      throw new Error(response.data.message || "No se pudieron cargar las metricas del portafolio.")
    }

    return {
      totalViews: Number(response.data.data.total_views ?? 0),
      viewsThisMonth: Number(response.data.data.views_this_month ?? 0),
      viewsByMonth: response.data.data.views_by_month ?? {},
    }
  } catch (error) {
    throw formatAnalyticsError(error)
  }
}
