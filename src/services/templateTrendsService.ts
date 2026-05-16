import axios from "axios"

import { api } from "./api"

export interface TrendStats {
  template_name: string
  read_time: string
  interest_rate: string
  variation: string
  footerBadge: string
  footerColor: string
  isCurrent?: boolean
}

export interface TrendChartPoint {
  day: string
  moderna: number
  minimalista: number
  corporativa: number
}

export interface TemplateTrendsResponse {
  stats: TrendStats[]
  chartData: TrendChartPoint[]
}

function buildErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || "No se pudieron cargar las tendencias de plantillas."
  }

  return "No se pudieron cargar las tendencias de plantillas."
}

export async function getTemplateTrends(): Promise<TemplateTrendsResponse> {
  const response = await api.get("/trends/templates")
  const payload = response.data?.data ?? response.data
  const stats = Array.isArray(payload?.stats) ? payload.stats : Array.isArray(payload) ? payload : []
  const chartData = Array.isArray(payload?.chartData) ? payload.chartData : []

  return { stats, chartData }
}

export function normalizeTemplateTrendsError(error: unknown) {
  return new Error(buildErrorMessage(error))
}