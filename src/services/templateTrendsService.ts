import { api } from './api';

export interface TrendStats {
  template_name: string;
  read_time: string;
  interest_rate: string;
  variation: string;
  footerBadge: string;
  footerColor: string;
  isCurrent?: boolean;
}

export const getTemplateTrends = async () => {
  try {
    const response = await api.get('/trends/templates');
    return response.data; 
  } catch (error) {
    throw error;
  }
};