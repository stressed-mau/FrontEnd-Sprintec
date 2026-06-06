import { useEffect, useState } from 'react';
import {
  getCertificateReports,
  type CertificateReportsData,
} from '@/services/certificateReportService';
export const useCertificateReports = () => {
  const [data, setData] = useState<CertificateReportsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const reports = await getCertificateReports();
        setData(reports);
      } catch (err) {
          setError('Error al obtener reportes');
      } finally {
        setError(null);
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return {
    data,
    loading,
    error,
  };
};