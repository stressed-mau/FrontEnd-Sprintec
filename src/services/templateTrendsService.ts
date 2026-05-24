import axios from "axios"

import { api } from "./api"

export interface TrendStats {
  template_name: string
  template_key: string
  retention: number
  avg_time: number
  variation: number
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

export interface TrackingReportTemplateMetrics {
  retention: number
  avg_time: number
  variation: number
}

export interface TrackingReportData {
  id: number
  period_start: string
  period_end: string
  total_portfolios: number
  templates_data: Record<string, TrackingReportTemplateMetrics>
  daily_visits: Record<string, Record<string, number>>
}

export interface TemplateTrendsReport {
  id: number
  periodStart: string
  periodEnd: string
  totalPortfolios: number
  periodLabel: string
}

export interface TemplateTrendsResponse {
  report: TemplateTrendsReport
  stats: TrendStats[]
  chartData: TrendChartPoint[]
}

const DAY_KEYS_ES = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
const DAY_KEYS_EN = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

const TEMPLATE_COLORS = ["bg-[#003A6C]", "bg-[#4D88B3]", "bg-[#0E7D96]"]

function capitalizeLabel(value: string) {
  return value
    .replace(/[_-]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ")
}

function formatPeriodLabel(start: string, end: string) {
  const startDate = new Date(`${start}T00:00:00`)
  const endDate = new Date(`${end}T00:00:00`)

  const formatter = new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })

  return `${formatter.format(startDate)} - ${formatter.format(endDate)}`
}

function buildTrendFooterBadge(variation: number, isTopTemplate: boolean) {
  if (isTopTemplate) {
    return "LIDERA LA SEMANA"
  }

  if (variation > 0) {
    return "VARIACIÓN POSITIVA"
  }

  if (variation < 0) {
    return "VARIACIÓN NEGATIVA"
  }

  return "VARIACIÓN ESTABLE"
}

function normalizeReportPayload(payload: unknown): TrackingReportData | null {
  if (!payload || typeof payload !== "object") {
    return null
  }

  const candidate = payload as Partial<TrackingReportData>
  // Validación más flexible: solo exigimos que existan los objetos principales para que la gráfica no se rompa
  if (!candidate.templates_data || !candidate.daily_visits) {
    return null
  }

  return candidate as TrackingReportData
}

function buildErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || "No se pudo cargar el reporte de plantillas."
  }

  return "No se pudo cargar el reporte de plantillas."
}

export async function getTemplateTrends(weekOffset = 0): Promise<TemplateTrendsResponse> {
  let payload: TrackingReportData | null = null;

  try {
    if (weekOffset === 0) {
      const response = await api.get("/tracking/global-reports/latest")
      payload = normalizeReportPayload(response.data?.data ?? response.data)
    } else {
      const response = await api.get("/tracking/global-reports")
      const arrayData = response.data?.data ?? response.data;
      if (Array.isArray(arrayData)) {
        const targetIndex = Math.abs(weekOffset);
        if (arrayData[targetIndex]) {
          payload = normalizeReportPayload(arrayData[targetIndex]);
        }
      }
    }
  } catch (error) {
    throw error;
  }

  if (!payload) {
    return {
      report: {
        id: 0,
        periodStart: "",
        periodEnd: "",
        totalPortfolios: 0,
        periodLabel: "",
      },
      stats: [],
      chartData: [],
    }
  }

  const stats = Object.entries(payload.templates_data ?? {})
    .map(([templateKey, metrics]) => ({
      template_name: capitalizeLabel(templateKey),
      template_key: templateKey,
      retention: Number(metrics?.retention ?? 0),
      avg_time: Number(metrics?.avg_time ?? 0),
      variation: Number(metrics?.variation ?? 0),
      footerBadge: "",
      footerColor: "",
      isCurrent: false,
    }))
    .sort((left, right) => right.retention - left.retention)
    .map((item, index) => ({
      ...item,
      footerBadge: buildTrendFooterBadge(item.variation, index === 0),
      footerColor: TEMPLATE_COLORS[index % TEMPLATE_COLORS.length],
      isCurrent: index === 0,
    }))

  const chartData = DAY_KEYS_EN.map((dayEn, index) => {
    return {
      day: DAY_KEYS_ES[index], // Mostrar el día en español en la gráfica
      moderna: Number(payload?.daily_visits?.moderna?.[dayEn] ?? 0),
      minimalista: Number(payload?.daily_visits?.minimalista?.[dayEn] ?? 0),
      corporativa: Number(payload?.daily_visits?.corporativa?.[dayEn] ?? 0),
    };
  })

  return {
    report: {
      id: payload.id,
      periodStart: payload.period_start,
      periodEnd: payload.period_end,
      totalPortfolios: payload.total_portfolios,
      periodLabel: formatPeriodLabel(payload.period_start, payload.period_end),
    },
    stats,
    chartData,
  }
}

export function normalizeTemplateTrendsError(error: unknown) {
  return new Error(buildErrorMessage(error))
}

export function formatTemplateVariation(value: number) {
  const sign = value > 0 ? "+" : ""
  return `${sign}${value}%`
}

export function formatTemplateTime(value: number) {
  return `${value} s`
}