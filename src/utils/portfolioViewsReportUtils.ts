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
const MONTH_ALIASES = [
  ["january", "jan", "enero", "ene"],
  ["february", "feb", "febrero"],
  ["march", "mar", "marzo"],
  ["april", "apr", "abril", "abr"],
  ["may", "mayo"],
  ["june", "jun", "junio"],
  ["july", "jul", "julio"],
  ["august", "aug", "agosto", "ago"],
  ["september", "sep", "sept", "septiembre", "setiembre"],
  ["october", "oct", "octubre"],
  ["november", "nov", "noviembre"],
  ["december", "dec", "dic", "diciembre"],
]

export function getMonthRows(viewsByMonth: Record<string, number>, baseDate = new Date()): MonthViewRow[] {
  return Array.from({ length: 5 }, (_, index) => {
    const date = new Date(baseDate.getFullYear(), baseDate.getMonth() - (4 - index), 1)
    const monthKey = MONTH_KEYS[date.getMonth()]

    return { month: MONTH_LABELS[monthKey] ?? monthKey, views: getViewsForMonth(viewsByMonth, date) }
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

function getViewsForMonth(viewsByMonth: Record<string, number>, date: Date) {
  return Object.entries(viewsByMonth).reduce((total, [key, value]) => {
    const entryDate = parseMonthKey(key)
    if (!entryDate || entryDate.month !== date.getMonth()) return total
    if (entryDate.year != null && entryDate.year !== date.getFullYear()) return total

    return total + asFiniteNumber(value)
  }, 0)
}

function parseMonthKey(key: string) {
  const normalizedKey = normalizeMonthKey(key)
  const isoMatch = normalizedKey.match(/\b(\d{4})[\s-](\d{1,2})\b/)
  if (isoMatch) return getMonthMatch(Number(isoMatch[2]) - 1, Number(isoMatch[1]))

  const numericMonthYearMatch = normalizedKey.match(/\b(\d{1,2})[\s-]+(\d{4})\b|\b(\d{4})[\s-]+(\d{1,2})\b/)
  if (numericMonthYearMatch) {
    const monthToken = numericMonthYearMatch[1] ?? numericMonthYearMatch[4]
    const yearToken = numericMonthYearMatch[2] ?? numericMonthYearMatch[3]

    return getMonthMatch(Number(monthToken) - 1, Number(yearToken))
  }

  const monthYearMatch = normalizedKey.match(/\b([a-z]+)[\s-]+(\d{4})\b|\b(\d{4})[\s-]+([a-z]+)\b/)
  if (monthYearMatch) {
    const monthToken = monthYearMatch[1] ?? monthYearMatch[4]
    const yearToken = monthYearMatch[2] ?? monthYearMatch[3]
    const month = getMonthIndex(monthToken)

    return month == null ? null : getMonthMatch(month, Number(yearToken))
  }

  if (/^\d{1,2}$/.test(normalizedKey)) return getMonthMatch(Number(normalizedKey) - 1)

  const month = getMonthIndex(normalizedKey)
  return month == null ? null : getMonthMatch(month)
}

function getMonthIndex(value: string) {
  const normalizedValue = normalizeMonthKey(value)
  const index = MONTH_ALIASES.findIndex((aliases) => aliases.includes(normalizedValue))

  return index >= 0 ? index : null
}

function getMonthMatch(month: number, year?: number) {
  if (month < 0 || month > 11 || !Number.isFinite(month)) return null
  return { month, year: Number.isFinite(year) ? year : undefined }
}

function normalizeMonthKey(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[_./]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function asFiniteNumber(value: unknown) {
  const numericValue = Number(value ?? 0)
  return Number.isFinite(numericValue) ? numericValue : 0
}

function networkMatches(value: string, matchKeys: string[]) {
  const normalizedValue = normalizeNetworkName(value)
  return matchKeys.some((key) => normalizedValue.includes(normalizeNetworkName(key)))
}

function normalizeNetworkName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "")
}
