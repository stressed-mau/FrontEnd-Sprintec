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

interface BaseVisibilityDto {
  id?: number | string;
  is_public?: boolean;
}

interface SkillDto extends BaseVisibilityDto {
  name?: string;
  level_of_domain?: string;
}

interface ProjectDto extends BaseVisibilityDto {
  name?: string;
  title?: string;
  role?: string;
  description?: string;
}

interface WorkExperienceDto extends BaseVisibilityDto {
  company_name?: string;
  role?: string;
}

interface EducationDto extends BaseVisibilityDto {
  institution?: string;
  degree?: string;
  career?: string;
}

interface SocialNetworkDto extends BaseVisibilityDto {
  name?: string;
  platform?: string;
  url?: string;
  link?: string;
}

const USER_INFORMATION_ENDPOINT = '/visibility';

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

function asBoolean(value: unknown, fallback = true): boolean {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    return value === 1;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true' || normalized === '1') {
      return true;
    }

    if (normalized === 'false' || normalized === '0') {
      return false;
    }
  }

  return fallback;
}

function normalizeProjects(data: unknown): VisibilityItem[] {
  const list = unwrapList(data, 'projects');

  return list.map((item, index) => {
    const record = (item ?? {}) as ProjectDto;
    return {
      id: asId(record.id, index + 1),
      label: asString(record.name ?? record.title) || `Proyecto ${index + 1}`,
      sublabel: asString(record.role ?? record.description),
      checked: asBoolean(record.is_public),
    };
  });
}

function normalizeSkills(data: unknown): VisibilityItem[] {
  const list = unwrapList(data, 'skills');

  return list.map((item, index) => {
    const record = (item ?? {}) as SkillDto;
    return {
      id: asId(record.id, index + 1),
      label: asString(record.name) || `Habilidad ${index + 1}`,
      sublabel: asString(record.level_of_domain),
      checked: asBoolean(record.is_public),
    };
  });
}

function normalizeExperience(data: unknown): VisibilityItem[] {
  const workList = unwrapList(data, 'work_experiences');
  const educationList = unwrapList(data, 'educations');

  const workItems = workList.map((item, index) => {
    const record = (item ?? {}) as WorkExperienceDto;
    return {
      id: asId(record.id, index + 1),
      label: asString(record.role) || `Experiencia laboral ${index + 1}`,
      sublabel: asString(record.company_name),
      checked: asBoolean(record.is_public),
    };
  });

  const educationItems = educationList.map((item, index) => {
    const record = (item ?? {}) as EducationDto;
    return {
      id: asId(record.id, workItems.length + index + 1),
      label: asString(record.degree ?? record.career) || `Educación ${index + 1}`,
      sublabel: asString(record.institution),
      checked: asBoolean(record.is_public),
    };
  });

  return [...workItems, ...educationItems];
}

function normalizeNetworks(data: unknown): VisibilityItem[] {
  const list = unwrapList(data, 'social_networks');

  return list.map((item, index) => {
    const record = (item ?? {}) as SocialNetworkDto;
    return {
      id: asId(record.id, index + 1),
      label: asString(record.name ?? record.platform) || `Red ${index + 1}`,
      sublabel: asString(record.url ?? record.link),
      checked: asBoolean(record.is_public),
    };
  });
}

export type PortfolioVisibilityData = Record<SectionKey, VisibilityItem[]>;

export async function getPortfolioVisibilityData(): Promise<PortfolioVisibilityData> {
  try {
    const response = await api.get(USER_INFORMATION_ENDPOINT);
    const payload = unwrapPayload(response.data);

    return {
      projects: normalizeProjects(payload),
      skills: normalizeSkills(payload),
      experience: normalizeExperience(payload),
      networks: normalizeNetworks(payload),
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
  void section;
  void items;
  void itemId;

  return Promise.resolve();
}
