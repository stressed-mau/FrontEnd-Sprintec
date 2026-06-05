import type { AnalyticsBreakdownItem } from "@/types/portfolioAnalytics"
import type { SocialNetwork } from "@/types/socialNetworks"

export interface MonthViewRow {
  month: string
  views: number
}

export interface ProfessionalNetworkReportRow {
  key: string
  label: string
  value: number
  available: boolean
}

const MONTH_LABELS: Record<string, string> = {
  January: "Ene",
  February: "Feb",
  March: "Mar",
  April: "Abr",
  May: "May",
  June: "Jun",
  July: "Jul",
  August: "Ago",
  September: "Sep",
  October: "Oct",
  November: "Nov",
  December: "Dic",
}

const PROFESSIONAL_NETWORKS = [
  { key: "github", label: "GitHub", matchKeys: ["github"] },
  { key: "gitlab", label: "GitLab", matchKeys: ["gitlab"] },
  { key: "youtube", label: "YouTube", matchKeys: ["youtube", "google"] },
]

const MONTH_KEYS = Object.keys(MONTH_LABELS)

export function getMonthRows(viewsByMonth: Record<string, number>, baseDate = new Date()): MonthViewRow[] {
  return Array.from({ length: 5 }, (_, index) => {
    const date = new Date(baseDate.getFullYear(), baseDate.getMonth() - (4 - index), 1)
    const monthKey = MONTH_KEYS[date.getMonth()]

    return { month: MONTH_LABELS[monthKey] ?? monthKey, views: Number(viewsByMonth[monthKey] ?? 0) }
  })
}

export function getPrintLineChart(rows: MonthViewRow[], maxViews: number) {
  const dimensions = getPrintChartDimensions()
  const chartMax = Math.max(4, Math.ceil(maxViews / 4) * 4)
  const points = getPrintChartPoints(rows, dimensions, chartMax)

  return {
    ...dimensions,
    points,
    linePoints: points.map((point) => `${point.x},${point.y}`).join(" "),
    ticks: Array.from({ length: 5 }, (_, index) => Math.round((chartMax / 4) * index)),
    chartMax,
  }
}

export function getTopProjectRows(projectViews: AnalyticsBreakdownItem[]) {
  return [...projectViews].sort((a, b) => b.value - a.value).slice(0, 3)
}

export function getSocialNetworkRows(
  socialClicks: AnalyticsBreakdownItem[],
  registeredNetworks: SocialNetwork[],
): ProfessionalNetworkReportRow[] {
  return PROFESSIONAL_NETWORKS.map((network) => {
    const registeredNetwork = registeredNetworks.find((item) => networkMatches(`${item.name} ${item.url}`, network.matchKeys))
    const clickData = socialClicks.find((item) => networkMatches(item.label, network.matchKeys))

    return { key: network.key, label: network.label, value: clickData?.value ?? 0, available: Boolean(registeredNetwork) }
  })
}

function getPrintChartDimensions() {
  const width = 640
  const height = 220
  const padding = { top: 18, right: 28, bottom: 42, left: 42 }

  return { width, height, padding, chartWidth: width - padding.left - padding.right, chartHeight: height - padding.top - padding.bottom }
}

function getPrintChartPoints(rows: MonthViewRow[], dimensions: ReturnType<typeof getPrintChartDimensions>, chartMax: number) {
  return rows.map((row, index) => {
    const x = dimensions.padding.left + (dimensions.chartWidth / Math.max(rows.length - 1, 1)) * index
    const y = dimensions.padding.top + dimensions.chartHeight - (Math.min(row.views, chartMax) / chartMax) * dimensions.chartHeight

    return { ...row, x, y }
  })
}

function networkMatches(value: string, matchKeys: string[]) {
  const normalizedValue = normalizeNetworkName(value)
  return matchKeys.some((key) => normalizedValue.includes(normalizeNetworkName(key)))
}

function normalizeNetworkName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "")
}
