import axios from 'axios';
import { api } from './api';
import { getSkills } from './skillsService';

export type SectionKey = 'projects' | 'skills' | 'experience' | 'networks';

export interface VisibilityItem {
  id: number;
  label: string;
  sublabel: string;
  checked: boolean;
}

type UnknownRecord = Record<string, unknown>;

interface VisibilityPreferencePayload {
  section: SectionKey;
  visible_item_ids: string[];
}

const PROJECTS_ENDPOINT = '/projects';
const EXPERIENCE_ENDPOINT = '/experiences';
const NETWORKS_ENDPOINT = '/networks';
const VISIBILITY_ENDPOINT = '/portfolio/visibility';
const VISIBILITY_TIMEOUT_MS = 5000;

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

function normalizeProjects(data: unknown): VisibilityItem[] {
  const list = unwrapList(data, 'projects');

  return list.map((item, index) => {
    const record = (item ?? {}) as UnknownRecord;
    return {
      id: asId(record.id ?? record.project_id, index + 1),
      label: asString(record.name ?? record.nombre ?? record.title) || `Proyecto ${index + 1}`,
      sublabel: asString(record.role ?? record.rol ?? record.position),
      checked: true,
    };
  });
}

function normalizeExperience(data: unknown): VisibilityItem[] {
  const list = unwrapList(data, 'experiences');

  return list.map((item, index) => {
    const record = (item ?? {}) as UnknownRecord;
    const position = asString(record.position ?? record.cargo ?? record.title);
    const company = asString(record.company ?? record.empresa ?? record.institution);
    const type = asString(record.type ?? record.tipo);

    return {
      id: asId(record.id ?? record.experience_id, index + 1),
      label: position || `Experiencia ${index + 1}`,
      sublabel: [company, type].filter(Boolean).join(' - '),
      checked: true,
    };
  });
}

function normalizeNetworks(data: unknown): VisibilityItem[] {
  const list = unwrapList(data, 'networks');

  return list.map((item, index) => {
    const record = (item ?? {}) as UnknownRecord;
    return {
      id: asId(record.id ?? record.network_id, index + 1),
      label: asString(record.name ?? record.nombre ?? record.network_name) || `Red ${index + 1}`,
      sublabel: asString(record.url ?? record.enlace ?? record.link),
      checked: true,
    };
  });
}

function normalizeVisibilityPreference(data: unknown): Record<SectionKey, Set<string>> {
  const empty = {
    projects: new Set<string>(),
    skills: new Set<string>(),
    experience: new Set<string>(),
    networks: new Set<string>(),
  };

  const source = unwrapPayload(data);

  if (!source || typeof source !== 'object') {
    return empty;
  }

  const record = source as UnknownRecord;

  const candidates: Array<[SectionKey, unknown[]]> = [
    ['projects', (record.projects as unknown[]) ?? []],
    ['skills', (record.skills as unknown[]) ?? []],
    ['experience', (record.experience as unknown[]) ?? []],
    ['networks', (record.networks as unknown[]) ?? []],
  ];

  candidates.forEach(([section, list]) => {
    if (!Array.isArray(list)) {
      return;
    }

    list.forEach((value) => {
      const normalized = asString(value);
      if (normalized) {
        empty[section].add(normalized);
      }
    });
  });

  return empty;
}

function applyPreferences(
  items: VisibilityItem[],
  visibleIds: Set<string>,
): VisibilityItem[] {
  if (visibleIds.size === 0) {
    return items;
  }

  return items.map((item) => ({
    ...item,
    checked: visibleIds.has(String(item.id)),
  }));
}

export type PortfolioVisibilityData = Record<SectionKey, VisibilityItem[]>;

export async function getPortfolioVisibilityData(): Promise<PortfolioVisibilityData> {
  try {
    const [projectsResponse, skillsResponse, experienceResponse, networksResponse, visibilityResponse] = await Promise.all([
      api.get(PROJECTS_ENDPOINT),
      getSkills(),
      api.get(EXPERIENCE_ENDPOINT),
      api.get(NETWORKS_ENDPOINT),
      api.get(VISIBILITY_ENDPOINT).catch(() => ({ data: {} })),
    ]);

    const skills = skillsResponse.map((skill, index) => ({
      id: asId(skill.id, index + 1),
      label: skill.name,
      sublabel: skill.level ?? '',
      checked: true,
    }));

    const preferences = normalizeVisibilityPreference(visibilityResponse.data);

    return {
      projects: applyPreferences(normalizeProjects(projectsResponse.data), preferences.projects),
      skills: applyPreferences(skills, preferences.skills),
      experience: applyPreferences(normalizeExperience(experienceResponse.data), preferences.experience),
      networks: applyPreferences(normalizeNetworks(networksResponse.data), preferences.networks),
    };
  } catch (error) {
    throw formatError(error);
  }
}

export async function savePortfolioVisibilitySection(
  section: SectionKey,
  items: VisibilityItem[],
): Promise<void> {
  const payload: VisibilityPreferencePayload = {
    section,
    visible_item_ids: items.filter((item) => item.checked).map((item) => String(item.id)),
  };

  try {
    await api.put(VISIBILITY_ENDPOINT, payload, {
      timeout: VISIBILITY_TIMEOUT_MS,
    });
  } catch (error) {
    throw formatError(error);
  }
}
