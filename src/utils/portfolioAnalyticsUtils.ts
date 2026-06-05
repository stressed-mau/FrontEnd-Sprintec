import type {
  AnalyticsBreakdownItem,
  PortfolioAnalytics,
  PortfolioAnalyticsDataDto,
  PortfolioViewRecordResult,
} from "@/types/portfolioAnalytics"

const DELETED_PROJECT_LABELS = [
  "unknown project",
  "unknown_project",
  "proyecto desconocido",
  "proyecto eliminado",
  "deleted project",
  "deleted_project",
]

export function normalizePortfolioViewResult(data: Record<string, unknown>, slug: string): PortfolioViewRecordResult {
  return {
    portfolioId: asNumber(data.portfolio_id ?? data.portfolioId) || undefined,
    slug: asString(data.slug) || slug,
    counted: Boolean(data.counted),
  }
}

export function normalizePortfolioAnalytics(data: PortfolioAnalyticsDataDto): PortfolioAnalytics {
  const projectViews = normalizeProjectBreakdown(hasBreakdownItems(data.project_views) ? data.project_views : data.top_projects)
  const socialClicks = normalizeBreakdown(data.social_clicks)
  const projectLinkClicks = normalizeBreakdown(data.project_link_clicks)

  return {
    portfolioId: data.portfolio_id,
    slug: data.slug,
    totalViews: asNumber(data.total_views),
    viewsThisMonth: asNumber(data.views_this_month),
    viewsByMonth: data.views_by_month ?? {},
    period: data.period,
    totalVisits: asNumber(data.total_visits),
    averageTimeSeconds: asNumber(data.average_time_seconds),
    interestRate: asNumber(data.interest_rate),
    topTemplate: data.top_template ?? null,
    templates: normalizeBreakdown(data.templates),
    projectViews,
    socialClicks,
    totalLinkClicks: getProjectLinkClickTotal(data, projectLinkClicks),
  }
}

export function asString(value: unknown): string {
  if (typeof value === "string") return value.trim()
  if (typeof value === "number") return String(value)
  return ""
}

function asNumber(value: unknown): number {
  const numberValue = Number(value ?? 0)
  return Number.isFinite(numberValue) ? numberValue : 0
}

function normalizeBreakdown(value: unknown): AnalyticsBreakdownItem[] {
  if (Array.isArray(value)) return value.filter(isRecord).map(normalizeBreakdownItem)
  if (isRecord(value)) return normalizeBreakdownRecord(value)
  return []
}

function normalizeProjectBreakdown(value: unknown): AnalyticsBreakdownItem[] {
  const items = Array.isArray(value) ? value.filter(isRecord).map(normalizeBreakdownItem) : normalizeBreakdown(value)

  return items
    .filter((item) => Boolean(item.label))
    .filter((item) => !DELETED_PROJECT_LABELS.includes(item.label.trim().toLowerCase()))
}

function normalizeBreakdownItem(item: Record<string, unknown>, index: number): AnalyticsBreakdownItem {
  const secondaryValue = item.avg_time ?? item.average_time_seconds
  const project = isRecord(item.project) ? item.project : {}
  const label = asString(
    item.title ??
    item.name ??
    item.nombre ??
    item.label ??
    item.project_name ??
    item.projectName ??
    project.name ??
    project.title ??
    project.nombre ??
    item.network_name ??
    item.networkName ??
    item.social_network ??
    item.socialNetwork ??
    item.type ??
    item.platform,
  )

  return {
    id: asString(item.project_id ?? item.id ?? item.type ?? item.social_network_id ?? item.network_name ?? index),
    label: label || `Item ${index + 1}`,
    value: asNumber(item.clicks ?? item.views ?? item.visits ?? item.count ?? item.total),
    secondary: secondaryValue != null ? `${asNumber(secondaryValue)} s promedio` : undefined,
  }
}

function normalizeBreakdownRecord(value: Record<string, unknown>): AnalyticsBreakdownItem[] {
  return Object.entries(value).map(([key, itemValue]) => ({
    id: key,
    label: key,
    value: asNumber(itemValue),
  }))
}

function getProjectLinkClickTotal(data: PortfolioAnalyticsDataDto, projectLinkClicks: AnalyticsBreakdownItem[]) {
  if (projectLinkClicks.length) return sumBreakdownValues(projectLinkClicks)
  return asNumber(data.total_link_clicks ?? data.link_clicks)
}

function sumBreakdownValues(...groups: AnalyticsBreakdownItem[][]) {
  return groups.flat().reduce((total, item) => total + item.value, 0)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object"
}

function hasBreakdownItems(value: unknown) {
  if (Array.isArray(value)) return value.length > 0
  return isRecord(value) && Object.keys(value).length > 0
}
