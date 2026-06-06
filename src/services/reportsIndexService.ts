import axios from "axios";

import { api } from "@/services/api";
import type { ReportItem } from "@/types/report";

type ReportsIndexPayload =
  | ReportItem[]
  | {
      reports?: ReportItem[];
      data?: ReportItem[];
    }
  | null
  | undefined;

type ReportsIndexResponseDto = {
  data?: ReportsIndexPayload;
};

const REPORTS_INDEX_ENDPOINT = "/tracking/global-reports";

function formatError(error: unknown): Error {
  if (axios.isAxiosError(error)) {
    const backendMessage =
      (error.response?.data as { message?: string } | undefined)?.message ??
      error.message;

    return new Error(backendMessage || "No se pudo cargar el historial.");
  }

  return new Error("No se pudo cargar el historial.");
}

function extractReports(payload: ReportsIndexPayload): ReportItem[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && Array.isArray(payload.reports)) {
    return payload.reports;
  }

  if (payload && Array.isArray(payload.data)) {
    return payload.data;
  }

  return [];
}

export async function getReportsIndexService(): Promise<ReportItem[]> {
  try {
    const response = await api.get<ReportsIndexResponseDto>(REPORTS_INDEX_ENDPOINT);
    return extractReports(response.data?.data);
  } catch (error) {
    throw formatError(error);
  }
}