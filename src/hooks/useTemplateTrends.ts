import { useState, useEffect } from 'react';
import { getTemplateTrends, type TrendStats } from '@/services/templateTrendsService';

export const useTemplateTrends = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<TrendStats[]>([]);
  const [pageError, setPageError] = useState('');

  const loadTrends = async () => {
    setLoading(true);
    try {
      const data = await getTemplateTrends();
      setStats(data.stats || []);
    } catch (error) {
      setPageError('No se pudo cargar la información de tendencias.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadTrends();
  }, []);

  return { loading, stats, pageError, setPageError };
};