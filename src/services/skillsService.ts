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

function mapApiTypeToUi(type?: SkillDto['type']): SkillType {
  if (type === 'tecnica') {
    return 'tecnica';
  }

  if (type === 'blanda') {
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
    if (error.code === 'ERR_NETWORK') {
      return new Error('No se pudo conectar con el backend en http://localhost:8000. Verifica que Laravel este levantado.');
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

function unwrapSkillList(data: unknown): SkillDto[] {
  if (Array.isArray(data)) {
    return data as SkillDto[];
  }

  if (data && typeof data === 'object') {
    if ('data' in data && Array.isArray((data as { data: unknown }).data)) {
      return (data as { data: SkillDto[] }).data;
    }

    if ('skills' in data && Array.isArray((data as { skills: unknown }).skills)) {
      return (data as { skills: SkillDto[] }).skills;
    }
  }

  return [];
}

function unwrapSkill(data: unknown): SkillDto {
  if (data && typeof data === 'object') {
    if ('data' in data && (data as { data?: unknown }).data) {
      return (data as { data: SkillDto }).data;
    }

    if ('skill' in data && (data as { skill?: unknown }).skill) {
      return (data as { skill: SkillDto }).skill;
    }
  }

  return data as SkillDto;
}

export async function getSkills(): Promise<Skill[]> {
  try {
    console.log('[getSkills] Iniciando GET a', SKILLS_ENDPOINT);
    const response = await api.get(SKILLS_ENDPOINT);
    console.log('[getSkills] Respuesta recibida:', response.data);
    const unwrapped = unwrapSkillList(response.data);
    console.log('[getSkills] Skills después de unwrap:', unwrapped);
    return unwrapped.map(normalizeSkill);
  } catch (error) {
    console.error('[getSkills] Error en GET:', error);
    throw formatError(error);
  }
}

export async function createSkill(payload: SkillPayload): Promise<Skill> {
  try {
    const apiPayload = toApiPayload(payload);
    console.log('[createSkill] Enviando POST con payload:', apiPayload);
    const response = await api.post(SKILLS_ENDPOINT, apiPayload);
    console.log('[createSkill] Respuesta recibida:', response.data);
    return normalizeSkill(unwrapSkill(response.data));
  } catch (error) {
    console.error('[createSkill] Error en POST:', error);
    throw formatError(error);
  }
}

export async function updateSkill(id: string, payload: SkillPayload): Promise<Skill> {
  try {
    const response = await api.put(`${SKILLS_ENDPOINT}/${id}`, toApiPayload(payload));
    return normalizeSkill(unwrapSkill(response.data));
  } catch (error) {
    throw formatError(error);
  }
}

export async function removeSkill(id: string): Promise<void> {
  try {
    await api.delete(`${SKILLS_ENDPOINT}/${id}`);
  } catch (error) {
    throw formatError(error);
  }
}
