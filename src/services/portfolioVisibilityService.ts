import axios from 'axios';
import { api } from './api';
import { getAuthSession } from '@/services/auth/auth-storage';

export type SectionKey = 'projects' | 'skills' | 'experience' | 'networks';

type VisibilityTable = 'skills' | 'projects' | 'educations' | 'social_networks' | 'work_experiences';

export interface VisibilityItem {
  id: number;
  label: string;
  sublabel: string;
  checked: boolean;
  sourceTable?: VisibilityTable;
}

type UnknownRecord = Record<string, unknown>;

interface BaseVisibilityDto {
  id?: number | string;
  is_public?: boolean;
}

interface SkillDto extends BaseVisibilityDto {
  name?: string;
  level_of_domain?: string;
  type?: string;
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
      return new Error('No se pudo conectar con el backend configurado. Verifica que la API desplegada est\xe9 disponible.');
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
    return value === 1;  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true' || normalized === '1') {
      return true; }

    if (normalized === 'false' || normalized === '0') {
      return false; }
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
      sourceTable: 'projects',
    } as VisibilityItem;
  });
}

function normalizeSkills(data: unknown): VisibilityItem[] {
  const list = unwrapList(data, 'skills');

  return list.map((item, index) => {
    const record = (item ?? {}) as SkillDto;
    const normalizedType = asString(record.type).toLowerCase().trim();
    const isSoftSkill = normalizedType === 'blanda';
    return {
      id: asId(record.id, index + 1),
      label: asString(record.name) || `Habilidad ${index + 1}`,
      sublabel: isSoftSkill ? '' : asString(record.level_of_domain),
      checked: asBoolean(record.is_public),
      sourceTable: 'skills',
    } as VisibilityItem;
  });
}

function normalizeExperience(data: unknown): VisibilityItem[] {
  const workList = unwrapList(data, 'work_experiences');
  const educationList = unwrapList(data, 'educations');

  const workItems = workList.map((item, index) => {
    const record = (item ?? {}) as WorkExperienceDto;
    const role = asString(record.role) || `Cargo ${index + 1}`;
    const institution = asString(record.company_name) || `Institución ${index + 1}`;
    return {
      id: asId(record.id, index + 1),
      label: role,
      sublabel: `Experiencia Laboral - ${institution}`,
      checked: asBoolean(record.is_public),
      sourceTable: 'work_experiences',
    } as VisibilityItem;
  });

  const educationItems = educationList.map((item, index) => {
    const record = (item ?? {}) as EducationDto;
    const role = asString(record.degree ?? record.career) || `Cargo ${index + 1}`;
    const institution = asString(record.institution) || `Institución ${index + 1}`;
    return {
      id: asId(record.id, index + 1),
      label: role,
      sublabel: `Educación - ${institution}`,
      checked: asBoolean(record.is_public),
      sourceTable: 'educations',
    } as VisibilityItem;
  });

  return [...workItems, ...educationItems];
}

function normalizeNetworks(data: unknown): VisibilityItem[] {
  const list = unwrapList(data, 'social_networks');

  return list.map((item, index) => {
    const record = (item ?? {}) as SocialNetworkDto;
    // Preserve DB id identity and avoid collisions with persisted positive ids if backend id is missing.
    const realId = asId(record.id, -(index + 1));
    return {
      id: realId,
      label: asString(record.name ?? record.platform) || `Red ${index + 1}`,
      sublabel: asString(record.url ?? record.link),
      checked: asBoolean(record.is_public),
      sourceTable: 'social_networks',
    } as VisibilityItem;
  });
}

export type PortfolioVisibilityData = Record<SectionKey, VisibilityItem[]>;

export async function getPortfolioVisibilityData(): Promise<PortfolioVisibilityData> {
  try {
    const session = getAuthSession();

    if (!session?.user?.id) {
      throw new Error('No se pudo obtener el id del usuario autenticado.');
    }

    const response = await api.get(`${USER_INFORMATION_ENDPOINT}/${session.user.id}`);
    const payload = unwrapPayload(response.data);

    const baseData: PortfolioVisibilityData = {
      projects: [],
      skills: [],
      experience: [],
      networks: [],
    };

    return {
      ...baseData,
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
  sourceTable?: VisibilityTable,
): Promise<void> {
  const session = getAuthSession();

  if (!session?.user?.id) {
    throw new Error('Usuario no autenticado.');
  }

 const targetItems = itemId != null 
    ? items.filter((item) => item.id === itemId && item.sourceTable === sourceTable) 
    : items;

  try {
    await Promise.all(
      targetItems.map((item) =>
        api.put(
          `${USER_INFORMATION_ENDPOINT}/${item.id}?table=${item.sourceTable ?? section}`,
          { id: item.id,
            is_public: item.checked,
          },
        ),
      ),
    );
  } catch (error) {
    throw formatError(error);
  }
}
