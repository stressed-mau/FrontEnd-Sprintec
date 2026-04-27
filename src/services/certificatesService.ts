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

function unwrapCertificateList(data: unknown): CertificateDto[] {
  const unwrapped = unwrapPayload(data);

  if (Array.isArray(unwrapped)) {
    return unwrapped as CertificateDto[];
  }

  if (unwrapped && typeof unwrapped === 'object') {
    const record = unwrapped as Record<string, unknown>;

    if (Array.isArray(record.data)) {
      return record.data as CertificateDto[];
    }

    if (Array.isArray(record.certificates)) {
      return record.certificates as CertificateDto[];
    }

    if (Array.isArray(record.certificate)) {
      return record.certificate as CertificateDto[];
    }
  }

  return [];
}

export async function getCertificates(): Promise<Certificate[]> {
  try {
    const response = await api.get(CERTIFICATES_ENDPOINT, {
      timeout: CERTIFICATE_MUTATION_TIMEOUT_MS,
    });

    const dtos = unwrapCertificateList(response.data);
    return dtos.map(normalizeCertificate);
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
      headers: {
        'Content-Type': 'multipart/form-data',
      },
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
    if (payload.name) formData.append('name', payload.name);
    if (payload.issuer) formData.append('issuer', payload.issuer);
    if (payload.description) formData.append('description', payload.description);
    if (payload.date_issued) formData.append('date_issued', payload.date_issued);
    if (payload.date_expired) formData.append('date_expired', payload.date_expired);
    if (payload.credential_id) formData.append('credential_id', payload.credential_id);
    if (payload.credential_url) formData.append('credential_url', payload.credential_url);
    if (payload.file_bonus_url) formData.append('file_bonus_url', payload.file_bonus_url);

    const response = await api.put(`${CERTIFICATES_ENDPOINT}/${id}`, formData, {
      timeout: CERTIFICATE_MUTATION_TIMEOUT_MS,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
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
