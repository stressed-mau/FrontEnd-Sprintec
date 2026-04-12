import { api } from './api';
import axios from 'axios';

export type SkillType = 'tecnica' | 'blanda';
type ApiSkillType = 'tecnica' | 'blanda';

export interface SkillDto {
  id?: string | number;
  name?: string;
  type?: SkillType | ApiSkillType;
  level?: string | null;
  level_of_domain?: string | null;
  nombre?: string;
  tipo?: SkillType | ApiSkillType;
  nivel?: string | null;
}

export interface SkillPayload {
  name: string;
  type: SkillType;
  level?: string;
}

interface ApiSkillPayload {
  name: string;
  level_of_domain?: string;
  type: ApiSkillType;
}

export interface Skill {
  id: string;
  name: string;
  type: SkillType;
  level?: string;
}

const SKILLS_ENDPOINT = '/skills';
const SKILL_MUTATION_TIMEOUT_MS = 5000;

function mapApiTypeToUi(type?: SkillDto['type']): SkillType {
  const normalizedType = typeof type === 'string'
    ? type
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
    : '';

  if (normalizedType === 'tecnica') {
    return 'tecnica';
  }

  if (normalizedType === 'blanda') {
    return 'blanda';
  }

  return 'tecnica';
}

function mapUiTypeToApi(type: SkillType): ApiSkillType {
  return type === 'tecnica' ? 'tecnica' : 'blanda';
}

function toApiPayload(payload: SkillPayload): ApiSkillPayload {
  return {
    name: payload.name,
    level_of_domain: payload.level ? payload.level.toLowerCase() : undefined,
    type: mapUiTypeToApi(payload.type),
  };
}

function capitalizeLevel(level?: string | null): string | undefined {
  if (!level) {
    return undefined;
  }

  // Normaliza para que coincida con los value de los option del modal
  const normalizedLevel = level
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const levelMap: Record<string, string> = {
    basico: 'basico',
    intermedio: 'intermedio',
    avanzado: 'avanzado',
    experto: 'experto',
  };

  return levelMap[normalizedLevel] ?? normalizedLevel;
}

function formatError(error: unknown): Error {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') {
      return new Error('La solicitud tardó más de 5 segundos. Intenta nuevamente.');
    }

    if (error.code === 'ERR_NETWORK') {
      return new Error('No se pudo conectar con el backend configurado. Verifica que la API desplegada est\xe9 disponible.');
    }

    const backendMessage =
      (error.response?.data as { message?: string } | undefined)?.message ??
      error.message;

    return new Error(backendMessage || 'Error inesperado al consumir skills API.');
  }

  return new Error('Error inesperado al consumir skills API.');
}

function normalizeSkill(dto: SkillDto): Skill {
  return {
    id: String(dto.id ?? crypto.randomUUID()),
    name: dto.name ?? dto.nombre ?? '',
    type: mapApiTypeToUi(dto.type ?? dto.tipo),
    level: capitalizeLevel(dto.level_of_domain ?? dto.level ?? dto.nivel),
  };
}

function unwrapPayload(data: unknown): unknown {
  if (!data || typeof data !== 'object') {
    return data;
  }

  const record = data as Record<string, unknown>;

  if (Array.isArray(record.data) || Array.isArray(record.skills)) {
    return record;
  }

  if ('data' in record && record.data && typeof record.data === 'object') {
    return unwrapPayload(record.data);
  }

  if ('skill' in record && record.skill && typeof record.skill === 'object') {
    return unwrapPayload(record.skill);
  }

  return data;
}

function unwrapSkillList(data: unknown): SkillDto[] {
  const unwrapped = unwrapPayload(data);

  if (Array.isArray(unwrapped)) {
    return unwrapped as SkillDto[];
  }

  if (unwrapped && typeof unwrapped === 'object') {
    if ('data' in unwrapped && Array.isArray((unwrapped as { data: unknown }).data)) {
      return (unwrapped as { data: SkillDto[] }).data;
    }

    if ('skills' in unwrapped && Array.isArray((unwrapped as { skills: unknown }).skills)) {
      return (unwrapped as { skills: SkillDto[] }).skills;
    }
  }

  return [];
}

function unwrapSkill(data: unknown): SkillDto {
  const unwrapped = unwrapPayload(data);

  if (unwrapped && typeof unwrapped === 'object') {
    if ('data' in unwrapped && (unwrapped as { data?: unknown }).data) {
      return (unwrapped as { data: SkillDto }).data;
    }

    if ('skill' in unwrapped && (unwrapped as { skill?: unknown }).skill) {
      return (unwrapped as { skill: SkillDto }).skill;
    }
  }

  return unwrapped as SkillDto;
}

function parseResponseData(data: unknown): unknown {
  if (data == null || data === '') {
    return [];
  }

  if (typeof data !== 'string') {
    return data;
  }

  try {
    return JSON.parse(data);
  } catch {
    return data;
  }
}

export async function getSkills(): Promise<Skill[]> {
  try {
    const response = await api.get(SKILLS_ENDPOINT, {
      responseType: 'text',
      transformResponse: (value) => value,
    });

    if (response.status === 204) {
      return [];
    }

    const unwrapped = unwrapSkillList(parseResponseData(response.data));
    return unwrapped.map(normalizeSkill);
  } catch (error) {
    throw formatError(error);
  }
}

export async function createSkill(payload: SkillPayload): Promise<Skill> {
  try {
    const apiPayload = toApiPayload(payload);
    const response = await api.post(SKILLS_ENDPOINT, apiPayload, {
      timeout: SKILL_MUTATION_TIMEOUT_MS,
    });
    return normalizeSkill(unwrapSkill(response.data));
  } catch (error) {
    throw formatError(error);
  }
}

export async function updateSkill(id: string, payload: SkillPayload): Promise<Skill> {
  try {
    const response = await api.put(`${SKILLS_ENDPOINT}/${id}`, toApiPayload(payload), {
      timeout: SKILL_MUTATION_TIMEOUT_MS,
    });
    return normalizeSkill(unwrapSkill(response.data));
  } catch (error) {
    throw formatError(error);
  }
}

export async function removeSkill(id: string): Promise<void> {
  try {
    await api.delete(`${SKILLS_ENDPOINT}/${id}`, {
      timeout: SKILL_MUTATION_TIMEOUT_MS,
    });
  } catch (error) {
    throw formatError(error);
  }
}
