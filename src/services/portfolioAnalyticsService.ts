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
    portfolio_id?: number
    slug?: string
    total_views?: number
    views_this_month?: number
    views_by_month?: Record<string, number>
    period?: {
      from?: string
      to?: string
    }
    total_visits?: number
    average_time_seconds?: number
    interest_rate?: number
    top_template?: string | null
    templates?: Array<Record<string, unknown>>
    top_projects?: Array<Record<string, unknown>>
    project_views?: Array<Record<string, unknown>>
    project_link_clicks?: Array<Record<string, unknown>>
    social_clicks?: Array<Record<string, unknown>>
    total_link_clicks?: number
    link_clicks?: number
  }
  message?: string
}

export type PortfolioViewRecordResult = {
  portfolioId?: number
  slug?: string
  counted: boolean
}

export type AnalyticsBreakdownItem = {
  id: string
  label: string
  value: number
  secondary?: string
}

export type PortfolioAnalytics = {
  portfolioId?: number
  slug?: string
  totalViews: number
  viewsThisMonth: number
  viewsByMonth: Record<string, number>
  period?: {
    from?: string
    to?: string
  }
  totalVisits: number
  averageTimeSeconds: number
  interestRate: number
  topTemplate: string | null
  templates: AnalyticsBreakdownItem[]
  projectViews: AnalyticsBreakdownItem[]
  socialClicks: AnalyticsBreakdownItem[]
  totalLinkClicks: number
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

function asString(value: unknown): string {
  if (typeof value === "string") return value.trim()
  if (typeof value === "number") return String(value)
  return ""
}

function asNumber(value: unknown): number {
  const numberValue = Number(value ?? 0)
  return Number.isFinite(numberValue) ? numberValue : 0
}

function normalizeBreakdownItem(item: Record<string, unknown>, index: number): AnalyticsBreakdownItem {
  const id = asString(item.project_id ?? item.id ?? item.type ?? item.social_network_id ?? index)
  const label = asString(item.title ?? item.name ?? item.label ?? item.type ?? item.platform) || `Item ${index + 1}`
  const value = asNumber(item.clicks ?? item.views ?? item.visits ?? item.count ?? item.total)
  const secondaryValue = item.avg_time ?? item.average_time_seconds

  return {
    id,
    label,
    value,
    secondary: secondaryValue != null ? `${asNumber(secondaryValue)} s promedio` : undefined,
  }
}

function normalizeBreakdown(value: unknown): AnalyticsBreakdownItem[] {
  if (!Array.isArray(value)) return []

  return value
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
    .map(normalizeBreakdownItem)
}

export async function recordPortfolioView(slug: string): Promise<PortfolioViewRecordResult | null> {
  try {
    const response = await publicApi.post(`/p/${encodeURIComponent(slug)}/view`)
    const data = response.data?.data ?? response.data ?? {}
    const result = {
      portfolioId: Number(data.portfolio_id ?? data.portfolioId ?? 0) || undefined,
      slug: asString(data.slug) || slug,
      counted: Boolean(data.counted),
    }

    console.info("Vista de portafolio registrada:", result)
    return result
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.warn("No se pudo registrar la vista del portafolio.", error.response?.data ?? error.message)
      return null
    }

    console.warn("No se pudo registrar la vista del portafolio.")
    return null
  }
}

export async function startPortfolioTracking(params: { slug: string; template: string | number }) {
  try {
    const response = await publicApi.post("/tracking/visit", {
      portfolio_slug: params.slug,
      template_type: String(params.template),
      visited_at: new Date().toISOString(),
    })

    return asString(response.data?.visit_id ?? response.data?.id ?? response.data?.data?.visit_id ?? response.data?.data?.id)
  } catch (error) {
    console.warn("No se pudo iniciar el tracking avanzado del portafolio.", axios.isAxiosError(error) ? error.response?.data ?? error.message : error)
    return ""
  }
}

export async function sendPortfolioTrackingPulse(visitId: string | number, secondsElapsed: number) {
  try {
    await publicApi.post("/tracking/pulse", {
      visit_id: visitId,
      seconds_elapsed: secondsElapsed,
    })
  } catch (error) {
    console.warn("Pulso de tracking fallido.", axios.isAxiosError(error) ? error.response?.data ?? error.message : error)
  }
}

export async function recordProjectClick(params: { visitId: string | number; projectId: string | number }) {
  try {
    await publicApi.post("/tracking/project-click", {
      visit_id: params.visitId,
      project_id: params.projectId,
      clicked_at: new Date().toISOString(),
    })
  } catch (error) {
    console.warn("Click tracking fallido.", axios.isAxiosError(error) ? error.response?.data ?? error.message : error)
  }
}

export async function recordProjectLinkClick(params: {
  visitId: string | number
  projectId: string | number
  linkType: "github" | "demo"
  url: string
}) {
  try {
    await publicApi.post("/tracking/project-link-click", {
      visit_id: params.visitId,
      project_id: params.projectId,
      link_type: params.linkType,
      url: params.url,
      clicked_at: new Date().toISOString(),
    })
  } catch (error) {
    console.warn("Click de enlace de proyecto no registrado.", axios.isAxiosError(error) ? error.response?.data ?? error.message : error)
  }
}

export async function recordSocialClick(params: { visitId: string | number; networkName: string }) {
  try {
    await publicApi.post("/tracking/social-click", {
      visit_id: params.visitId,
      network_name: params.networkName.toLowerCase(),
      clicked_at: new Date().toISOString(),
    })
  } catch (error) {
    console.warn("Click de red social no registrado.", axios.isAxiosError(error) ? error.response?.data ?? error.message : error)
  }
}

export async function getPortfolioAnalytics(): Promise<PortfolioAnalytics> {
  try {
    const response = await api.get<PortfolioAnalyticsDto>("/user/portfolio/analytics")

    if (response.data.status !== "success" || !response.data.data) {
      throw new Error(response.data.message || "No se pudieron cargar las metricas del portafolio.")
    }

    const data = response.data.data
    const projectViews = normalizeBreakdown(data.project_views?.length ? data.project_views : data.top_projects)
    const socialClicks = normalizeBreakdown(data.social_clicks)
    const projectLinkClicks = normalizeBreakdown(data.project_link_clicks)

    const totalTrackedLinkClicks = [...projectLinkClicks, ...socialClicks].reduce((total, item) => total + item.value, 0)

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
      totalLinkClicks: asNumber(data.total_link_clicks ?? data.link_clicks) || totalTrackedLinkClicks,
    }
  } catch (error) {
    throw formatAnalyticsError(error)
  }
}
