import { useEffect, useState } from "react";

import {
  getUserReports,
  type ResponseData,
} from "@/services/userReportsService";

export const useUserReports = (
  range: "day" | "week" | "month" | "year"
) => {

  const [data, setData] = useState<ResponseData | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await getUserReports(range);
        setData(response);
      } catch (err) {
        console.error(err);
        setError("Error al obtener reportes");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();

  }, [range]);

  return {
    data,
    loading,
    error,
  };
};