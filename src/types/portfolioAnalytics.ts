export interface PortfolioAnalyticsDto {
  status?: string
  data?: PortfolioAnalyticsDataDto
  message?: string
}

export interface PortfolioAnalyticsDataDto {
  portfolio_id?: number
  slug?: string
  total_views?: number
  views_this_month?: number
  views_by_month?: Record<string, number>
  period?: PortfolioAnalyticsPeriod
  total_visits?: number
  average_time_seconds?: number
  interest_rate?: number
  top_template?: string | null
  templates?: AnalyticsBreakdownDto
  top_projects?: AnalyticsBreakdownDto
  project_views?: AnalyticsBreakdownDto
  project_link_clicks?: AnalyticsBreakdownDto
  social_clicks?: AnalyticsBreakdownDto
  total_link_clicks?: number
  link_clicks?: number
}

export interface PortfolioAnalyticsPeriod {
  from?: string
  to?: string
}

export type AnalyticsBreakdownDto = Array<Record<string, unknown>> | Record<string, unknown>

export interface PortfolioViewRecordResult {
  portfolioId?: number
  slug?: string
  counted: boolean
}

export interface AnalyticsBreakdownItem {
  id: string
  label: string
  value: number
  secondary?: string
}

export interface PortfolioAnalytics {
  portfolioId?: number
  slug?: string
  totalViews: number
  viewsThisMonth: number
  viewsByMonth: Record<string, number>
  period?: PortfolioAnalyticsPeriod
  totalVisits: number
  averageTimeSeconds: number
  interestRate: number
  topTemplate: string | null
  templates: AnalyticsBreakdownItem[]
  projectViews: AnalyticsBreakdownItem[]
  socialClicks: AnalyticsBreakdownItem[]
  totalLinkClicks: number
}

export interface PortfolioTrackingParams {
  slug: string
  template: string | number
}

export interface ProjectClickParams {
  visitId: string | number
  projectId: string | number
}

export interface ProjectLinkClickParams extends ProjectClickParams {
  linkType: "repository" | "demo"
}

export interface SocialClickParams {
  visitId: string | number
  networkName: string
}
