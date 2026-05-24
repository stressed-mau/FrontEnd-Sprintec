import { api } from '@/services/api';

export interface IssuerData {
  name: string;
  cantidad: number;
}

export interface PieChartData {
  name: string;
  value: number;
}

export interface Stats {
  totalCertificados: number;
  conLink: number;
  conArchivo: number;
  conAmbos: number;
}

export interface CertificateReportsData {
  stats: Stats;
  issuers: IssuerData[];
  formatDist: PieChartData[];
  expirationDist: PieChartData[];
}

interface ApiResponse {
  success: boolean;
  data: CertificateReportsData;
}

export const getCertificateReports = async () => {
  const response = await api.get<ApiResponse>(
    '/admin/report/certificates'
  );

  console.log('RESPONSE COMPLETO:', response);

  console.log('JSON DEL BACKEND:', response.data);

  console.log('DATA REAL:', response.data.data);

  return response.data.data;
};