import { api } from './api';
import {normalizeSkill} from '@/utils/skills/skillMapperUtils';
import { unwrapSkill, unwrapSkillList, parseResponseData } from '@/utils/skills/skillResponseUtils';
import {formatSkillApiError,} from '@/utils/skills/skillApiErrorUtils';

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
const SKILL_MUTATION_TIMEOUT_MS = 30_000;

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

export async function getSkills(): Promise<Skill[]> {
  try {
    const response = await api.get(SKILLS_ENDPOINT);

    if (
      response.data &&
      typeof response.data === 'object' &&
      (response.data as { success?: boolean }).success === false
    ) {
      const body = response.data as { message?: string };
      throw new Error(body.message || 'Error al obtener habilidades');
    }

    if (response.status === 204) {
      return [];
    }

    const unwrapped = unwrapSkillList(parseResponseData(response.data));

    console.log("DATOS CRUDOS DEL BACKEND:");
    console.log(unwrapped);

    const normalized = unwrapped.map(normalizeSkill);

    console.log("DATOS NORMALIZADOS:");
    console.log(normalized);

    return normalized;
  } catch (error) {
    throw formatSkillApiError(error);
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
    throw formatSkillApiError(error);
  }
}

export async function updateSkill(id: string, payload: SkillPayload): Promise<Skill> {
  try {
    const response = await api.put(`${SKILLS_ENDPOINT}/${id}`, toApiPayload(payload), {
      timeout: SKILL_MUTATION_TIMEOUT_MS,
    });
    return normalizeSkill(unwrapSkill(response.data));
  } catch (error) {
    throw formatSkillApiError(error);
  }
}

export async function removeSkill(id: string): Promise<void> {
  try {
    await api.delete(`${SKILLS_ENDPOINT}/${id}`, {
      timeout: SKILL_MUTATION_TIMEOUT_MS,
    });
  } catch (error) {
    throw formatSkillApiError(error);
  }
}
