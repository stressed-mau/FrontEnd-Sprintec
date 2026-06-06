import type { TrackingReportData } from "@/services/templateTrendsService";

export function normalizeReportPayload(
  payload: unknown,
): TrackingReportData | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const candidate = payload as Partial<TrackingReportData>;

  if (!candidate.templates_data || !candidate.daily_visits) {
    return null;
  }

  return candidate as TrackingReportData;
}