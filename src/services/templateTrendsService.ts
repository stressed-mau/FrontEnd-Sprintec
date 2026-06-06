import axios from "axios";
import { api } from "./api";
import { DAY_KEYS_ES, DAY_KEYS_EN,TEMPLATE_COLORS,capitalizeLabel,formatPeriodLabel, buildTrendFooterBadge,} from "@/utils/reports/templateTrendUtils";
import { normalizeReportPayload } from "@/services/mappers/templateTrendMapper";
export interface TrendStats {
  template_name: string;
  template_key: string;
  retention: number;
  avg_time: number;
  variation: number;
  footerBadge: string;
  footerColor: string;
  isCurrent?: boolean;
}

export interface TrendChartPoint {
  day: string;
  moderna: number;
  minimalista: number;
  corporativa: number;
}

export interface TrackingReportTemplateMetrics {
  retention: number;
  avg_time: number;
  variation: number;
}

export interface TrackingReportData {
  id: number;
  period_start: string;
  period_end: string;
  total_portfolios: number;
  templates_data: Record<string, TrackingReportTemplateMetrics>;
  daily_visits: Record<string, Record<string, number>>;
}

export interface TemplateTrendsReport {
  id: number;
  periodStart: string;
  periodEnd: string;
  totalPortfolios: number;
  periodLabel: string;
}

export interface TemplateTrendsResponse {
  report: TemplateTrendsReport;
  stats: TrendStats[];
  chartData: TrendChartPoint[];
}

function buildErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || "No se pudo cargar el reporte de plantillas.";
  }
  return "No se pudo cargar el reporte de plantillas.";
}

export async function getTemplateTrends(weekOffset = 0): Promise<TemplateTrendsResponse> {
  let payload: TrackingReportData | null = null;
  try {
    if (weekOffset === 0) {
      const response = await api.get("/tracking/global-reports/latest");
      payload = normalizeReportPayload(response.data?.data ?? response.data);
    } else {
      const response = await api.get("/tracking/global-reports");
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
    };
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
    }));

  const chartData = DAY_KEYS_EN.map((dayEn, index) => {
    return {
      day: DAY_KEYS_ES[index], // Mostrar el día en español en la gráfica
      moderna: Number(payload?.daily_visits?.moderna?.[dayEn] ?? 0),
      minimalista: Number(payload?.daily_visits?.minimalista?.[dayEn] ?? 0),
      corporativa: Number(payload?.daily_visits?.corporativa?.[dayEn] ?? 0),
    };
  });

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
  };
}

export function normalizeTemplateTrendsError(error: unknown) {
  return new Error(buildErrorMessage(error));
}
