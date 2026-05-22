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
          console.error('ERROR COMPLETO:', err);

          // @ts-ignore
          console.log('RESPONSE ERROR:', err?.response);

          // @ts-ignore
          console.log('DATA ERROR:', err?.response?.data);

          setError('Error al obtener reportes');
      } finally {
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