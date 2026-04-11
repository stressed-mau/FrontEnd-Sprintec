import axios from 'axios';
import { api } from './api';

export type SectionKey = 'projects' | 'skills' | 'experience' | 'networks';

export interface VisibilityItem {
  id: number;
  label: string;
  sublabel: string;
  checked: boolean;
}

type UnknownRecord = Record<string, unknown>;

interface UserInformationDto {
  id: number;
  fullname: string;
  occupation: string;
  image_url: string;
}

const USER_INFORMATION_ENDPOINT = '/visibility';
const VISIBILITY_MUTATION_TIMEOUT_MS = 5000;

const EMPTY_VISIBILITY_DATA: PortfolioVisibilityData = {
  projects: [],
  skills: [],
  experience: [],
  networks: [],
};

function formatError(error: unknown): Error {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') {
      return new Error('La solicitud tardó demasiado. Intenta nuevamente.');
    }

    if (error.code === 'ERR_NETWORK') {
      return new Error('No se pudo conectar con el backend en http://localhost:8000. Verifica que Laravel este levantado.');
    }

    const backendMessage =
      (error.response?.data as { message?: string } | undefined)?.message ??
      error.message;

    return new Error(backendMessage || 'Error inesperado al consumir portfolio visibility API.');
  }

  return new Error('Error inesperado al consumir portfolio visibility API.');
}

function unwrapPayload(data: unknown): unknown {
  if (!data || typeof data !== 'object') {
    return data;
  }

  const record = data as UnknownRecord;

  if ('data' in record && record.data && typeof record.data === 'object') {
    return unwrapPayload(record.data);
  }

  return data;
}

function unwrapList(data: unknown, collectionKey?: string): unknown[] {
  const unwrapped = unwrapPayload(data);

  if (Array.isArray(unwrapped)) {
    return unwrapped;
  }

  if (!unwrapped || typeof unwrapped !== 'object') {
    return [];
  }

  const record = unwrapped as UnknownRecord;

  if (collectionKey && Array.isArray(record[collectionKey])) {
    return record[collectionKey] as unknown[];
  }

  if (Array.isArray(record.data)) {
    return record.data;
  }

  return [];
}

function unwrapUserInformationList(data: unknown): UserInformationDto[] {
  const unwrapped = unwrapPayload(data);

  if (Array.isArray(unwrapped)) {
    return unwrapped as UserInformationDto[];
  }

  if (unwrapped && typeof unwrapped === 'object') {
    const record = unwrapped as UnknownRecord;

    if ('data' in record && Array.isArray(record.data)) {
      return record.data as UserInformationDto[];
    }
  }

  return [];
}

function asString(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number') {
    return String(value);
  }

  return '';
}

function asId(value: unknown, fallback: number): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (!Number.isNaN(parsed) && Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

function normalizeProjects(data: unknown): VisibilityItem[] {
  const list = unwrapUserInformationList(data);

  return list.map((item, index) => {
    const record = (item ?? {}) as UserInformationDto;
    return {
      id: asId(record.id, index + 1),
      label: asString(record.fullname) || `Usuario ${index + 1}`,
      sublabel: asString(record.occupation),
      checked: true,
    };
  });
}

export type PortfolioVisibilityData = Record<SectionKey, VisibilityItem[]>;

export async function getPortfolioVisibilityData(): Promise<PortfolioVisibilityData> {
  try {
    const response = await api.get(USER_INFORMATION_ENDPOINT);
    const users = unwrapList(response.data, 'data');

    return {
      projects: normalizeProjects(users),
      skills: EMPTY_VISIBILITY_DATA.skills,
      experience: EMPTY_VISIBILITY_DATA.experience,
      networks: EMPTY_VISIBILITY_DATA.networks,
    };
  } catch (error) {
    throw formatError(error);
  }
}

export async function savePortfolioVisibilitySection(
  section: SectionKey,
  items: VisibilityItem[],
  itemId?: number,
): Promise<void> {
  const targetItems = itemId != null ? items.filter((item) => item.id === itemId) : items;

  try {
    await Promise.all(
      targetItems.map((item) =>
        api.put(
          `${USER_INFORMATION_ENDPOINT}/${item.id}`,
          {
            section,
            checked: item.checked,
          },
          {
            timeout: VISIBILITY_MUTATION_TIMEOUT_MS,
          },
        ),
      ),
    );
  } catch (error) {
    throw formatError(error);
  }

  return Promise.resolve();
}
