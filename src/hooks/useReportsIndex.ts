import { useEffect, useMemo, useState } from "react";

import { getReportsIndexService } from "@/services/reportsIndexService";
import type { ReportItem } from "@/types/report";
import { getPeriodSearchText } from "@/utils/reports/reportUtils";

type ReportsViewMode = "grid" | "list";

export function useReportsIndex() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [view, setView] = useState<ReportsViewMode>("grid");

  useEffect(() => {
    let isMounted = true;

    const loadReports = async () => {
      try {
        setLoading(true);
        const result = await getReportsIndexService();

        if (!isMounted) return;

        setReports(result);
        setError("");
      } catch (loadError) {
        if (!isMounted) return;

        setError(
          loadError instanceof Error
            ? loadError.message
            : "No se pudo cargar el historial.",
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadReports();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredReports = useMemo(() => {
    const query = search.trim().toLowerCase();

    return reports.filter((report, index) => {
      if (query) {
        const haystack = getPeriodSearchText(
          report.period_start,
          report.period_end,
          index,
        );

        if (!haystack.includes(query)) {
          return false;
        }
      }

      if (dateFrom && report.period_end < dateFrom) {
        return false;
      }

      if (dateTo && report.period_start > dateTo) {
        return false;
      }

      return true;
    });
  }, [reports, search, dateFrom, dateTo]);

  const hasFilters =
    search.trim().length > 0 || dateFrom.length > 0 || dateTo.length > 0;

  const clearFilters = () => {
    setSearch("");
    setDateFrom("");
    setDateTo("");
  };

  return {
    reports,
    filteredReports,
    loading,
    error,
    search,
    setSearch,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    view,
    setView,
    hasFilters,
    clearFilters,
  };
}