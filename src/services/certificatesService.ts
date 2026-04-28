import { api } from './api';
import axios from 'axios';

export interface CertificateDto {
  id?: string | number;
  name?: string;
  issuer?: string;
  description?: string | null;
  date_issued?: string;
  date_expired?: string | null;
  credential_id?: string | null;
  credential_url?: string | null;
  file_bonus_url?: string | null;
  file_bonus_public_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CertificatePayload {
  name: string;
  issuer: string;
  description?: string;
  date_issued: string;
  date_expired?: string;
  credential_id?: string;
  credential_url?: string;
  file_bonus_url?: File | null;
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  description?: string;
  date_issued: string;
  date_expired?: string;
  credential_id?: string;
  credential_url?: string;
  file_bonus_url?: string;
}

const CERTIFICATES_ENDPOINT = '/certificate';
const CERTIFICATE_MUTATION_TIMEOUT_MS = 30_000;

function formatError(error: unknown): Error {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') {
      return new Error('La solicitud tardó más de 30 segundos. Intenta nuevamente.');
    }

    if (error.code === 'ERR_NETWORK') {
      return new Error('No se pudo conectar con el backend. Verifica que la API esté disponible.');
    }

    const backendMessage =
      (error.response?.data as { message?: string } | undefined)?.message ??
      error.message;

    return new Error(backendMessage || 'Error inesperado al consumir certificates API.');
  }

  return new Error('Error inesperado al consumir certificates API.');
}

function normalizeCertificate(dto: CertificateDto): Certificate {
  return {
    id: String(dto.id ?? crypto.randomUUID()),
    name: dto.name ?? '',
    issuer: dto.issuer ?? '',
    description: dto.description ?? undefined,
    date_issued: dto.date_issued ?? '',
    date_expired: dto.date_expired ?? undefined,
    credential_id: dto.credential_id ?? undefined,
    credential_url: dto.credential_url ?? undefined,
    file_bonus_url: dto.file_bonus_url ?? undefined,
  };
}

function unwrapPayload(data: unknown): unknown {
  if (!data || typeof data !== 'object') {
    return data;
  }

  const record = data as Record<string, unknown>;

  if (Array.isArray(record.data) || Array.isArray(record.certificates)) {
    return record;
  }

  if ('data' in record && record.data && typeof record.data === 'object') {
    return unwrapPayload(record.data);
  }

  if ('certificate' in record && record.certificate && typeof record.certificate === 'object') {
    return unwrapPayload(record.certificate);
  }

  return data;
}

function unwrapCertificateData(data: unknown): CertificateDto | CertificateDto[] | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const record = data as Record<string, unknown>;

  // Si tiene propiedad 'data', extraela
  if ('data' in record && record.data) {
    const dataValue = record.data;
    
    // Si data es un arreglo, devuélvelo
    if (Array.isArray(dataValue)) {
      return dataValue as CertificateDto[];
    }
    
    // Si data es un objeto, devuélvelo
    if (typeof dataValue === 'object') {
      return dataValue as CertificateDto;
    }
  }

  // Si el mismo objeto tiene estructura de certificado
  if ('id' in record || 'name' in record || 'issuer' in record) {
    return record as CertificateDto;
  }

  // Si es un arreglo directo
  if (Array.isArray(data)) {
    return data as CertificateDto[];
  }

  return null;
}

export async function getCertificates(): Promise<Certificate[]> {
  try {
    const response = await api.get(CERTIFICATES_ENDPOINT, {
      timeout: CERTIFICATE_MUTATION_TIMEOUT_MS,
    });

    const certificateData = unwrapCertificateData(response.data);
    
    if (!certificateData) {
      return [];
    }

    // Si es un arreglo, mapéalo a Certificate[]
    if (Array.isArray(certificateData)) {
      return certificateData.map(normalizeCertificate);
    }

    // Si es un objeto singular, conviértelo a arreglo
    return [normalizeCertificate(certificateData)];
  } catch (error) {
    throw formatError(error);
  }
}

export async function createCertificate(payload: CertificatePayload): Promise<Certificate> {
  try {
    const formData = new FormData();
    formData.append('name', payload.name);
    formData.append('issuer', payload.issuer);
    if (payload.description) formData.append('description', payload.description);
    formData.append('date_issued', payload.date_issued);
    if (payload.date_expired) formData.append('date_expired', payload.date_expired);
    if (payload.credential_id) formData.append('credential_id', payload.credential_id);
    if (payload.credential_url) formData.append('credential_url', payload.credential_url);
    if (payload.file_bonus_url) formData.append('file_bonus_url', payload.file_bonus_url);

    const response = await api.post(CERTIFICATES_ENDPOINT, formData, {
      timeout: CERTIFICATE_MUTATION_TIMEOUT_MS,
    });

    const dto = unwrapPayload(response.data) as CertificateDto;
    return normalizeCertificate(dto);
  } catch (error) {
    throw formatError(error);
  }
}

export async function updateCertificate(id: string | number, payload: Partial<CertificatePayload>): Promise<Certificate> {
  try {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    if (payload.name) formData.append('name', payload.name);
    if (payload.issuer) formData.append('issuer', payload.issuer);
    if (payload.description !== undefined) formData.append('description', payload.description);
    if (payload.date_issued) formData.append('date_issued', payload.date_issued);
    if (payload.date_expired !== undefined) formData.append('date_expired', payload.date_expired);
    if (payload.credential_id !== undefined) formData.append('credential_id', payload.credential_id);
    if (payload.credential_url !== undefined) formData.append('credential_url', payload.credential_url);
    if (payload.file_bonus_url) formData.append('file_bonus_url', payload.file_bonus_url);

    const response = await api.post(`${CERTIFICATES_ENDPOINT}/${id}`, formData, {
      timeout: CERTIFICATE_MUTATION_TIMEOUT_MS,
    });

    const dto = unwrapPayload(response.data) as CertificateDto;
    return normalizeCertificate(dto);
  } catch (error) {
    throw formatError(error);
  }
}

export async function removeCertificate(id: string | number): Promise<void> {
  try {
    await api.delete(`${CERTIFICATES_ENDPOINT}/${id}`, {
      timeout: CERTIFICATE_MUTATION_TIMEOUT_MS,
    });
  } catch (error) {
    throw formatError(error);
  }
}
