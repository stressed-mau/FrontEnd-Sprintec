import axios from "axios"

import { api } from "@/services/api"
import type {
  PortfolioAnalytics,
  PortfolioAnalyticsDto,
  PortfolioTrackingParams,
  PortfolioViewRecordResult,
  ProjectClickParams,
  ProjectLinkClickParams,
  SocialClickParams,
} from "@/types/portfolioAnalytics"
import {
  asString,
  normalizePortfolioAnalytics,
  normalizePortfolioViewResult,
} from "@/utils/portfolioAnalyticsUtils"

export type {
  AnalyticsBreakdownItem,
  PortfolioAnalytics,
  PortfolioViewRecordResult,
} from "@/types/portfolioAnalytics"

const publicApi = axios.create({
  baseURL: (api.defaults.baseURL ?? "/api").replace(/\/+$/, ""),
  timeout: 30_000,
  headers: { Accept: "application/json" },
})

export async function recordPortfolioView(slug: string): Promise<PortfolioViewRecordResult | null> {
  try {
    const response = await publicApi.post(`/p/${encodeURIComponent(slug)}/view`)
    const data = response.data?.data ?? response.data ?? {}
    const result = normalizePortfolioViewResult(data, slug)

    console.info("Vista de portafolio registrada:", result)
    return result
  } catch (error) {
    warnTrackingFailure("No se pudo registrar la vista del portafolio.", error)
    return null
  }
}

export async function startPortfolioTracking(params: PortfolioTrackingParams) {
  try {
    const response = await publicApi.post("/tracking/visit", {
      portfolio_slug: params.slug,
      template_type: String(params.template),
      visited_at: new Date().toISOString(),
    })

    return asString(response.data?.visit_id ?? response.data?.id ?? response.data?.data?.visit_id ?? response.data?.data?.id)
  } catch (error) {
    warnTrackingFailure("No se pudo iniciar el tracking avanzado del portafolio.", error)
    return ""
  }
}

export async function sendPortfolioTrackingPulse(visitId: string | number, secondsElapsed: number) {
  try {
    await publicApi.post("/tracking/pulse", { visit_id: visitId, seconds_elapsed: secondsElapsed })
  } catch (error) {
    warnTrackingFailure("Pulso de tracking fallido.", error)
  }
}

export async function recordProjectClick(params: ProjectClickParams) {
  try {
    await publicApi.post("/tracking/project-click", {
      visit_id: params.visitId,
      project_id: params.projectId,
      clicked_at: new Date().toISOString(),
    })
  } catch (error) {
    warnTrackingFailure("Click tracking fallido.", error)
  }
}

export async function recordProjectLinkClick(params: ProjectLinkClickParams) {
  try {
    await publicApi.post("/tracking/project-link-click", {
      visit_id: params.visitId,
      project_id: params.projectId,
      link_type: params.linkType,
      clicked_at: new Date().toISOString(),
    })
  } catch (error) {
    warnTrackingFailure("Click de enlace de proyecto no registrado.", error)
  }
}

export async function recordSocialClick(params: SocialClickParams) {
  try {
    await publicApi.post("/tracking/social-click", {
      visit_id: params.visitId,
      network_name: params.networkName.toLowerCase(),
      clicked_at: new Date().toISOString(),
    })
  } catch (error) {
    warnTrackingFailure("Click de red social no registrado.", error)
  }
}

export async function getPortfolioAnalytics(): Promise<PortfolioAnalytics> {
  try {
    const response = await api.get<PortfolioAnalyticsDto>("/user/portfolio/analytics")
    if (response.data.status !== "success" || !response.data.data) {
      throw new Error(response.data.message || "No se pudieron cargar las metricas del portafolio.")
    }

    return normalizePortfolioAnalytics(response.data.data)
  } catch (error) {
    throw formatAnalyticsError(error)
  }
}

function warnTrackingFailure(message: string, error: unknown) {
  if (axios.isAxiosError(error)) {
    console.warn(message, error.response?.data ?? error.message)
    return
  }

  console.warn(message)
}

function formatAnalyticsError(error: unknown) {
  if (!axios.isAxiosError(error)) return new Error("No se pudieron cargar las metricas del portafolio.")

  const responseData = error.response?.data as { message?: unknown } | undefined
  const message = typeof responseData?.message === "string" ? responseData.message : "No se pudieron cargar las metricas del portafolio."
  return new Error(message)
}
