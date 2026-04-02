import { api } from './api';

export type SkillType = 'Habilidad técnica' | 'Habilidad blanda';

export interface SkillDto {
  id?: string | number;
  name?: string;
  type?: SkillType;
  level?: string | null;
  nombre?: string;
  tipo?: SkillType;
  nivel?: string | null;
}

export interface SkillPayload {
  name: string;
  type: SkillType;
  level?: string;
}

export interface Skill {
  id: string;
  name: string;
  type: SkillType;
  level?: string;
}

const SKILLS_ENDPOINT = '/skills';

function normalizeSkill(dto: SkillDto): Skill {
  return {
    id: String(dto.id ?? crypto.randomUUID()),
    name: dto.name ?? dto.nombre ?? '',
    type: dto.type ?? dto.tipo ?? 'Habilidad técnica',
    level: dto.level ?? dto.nivel ?? undefined,
  };
}

function unwrapSkillList(data: unknown): SkillDto[] {
  if (Array.isArray(data)) {
    return data as SkillDto[];
  }

  if (data && typeof data === 'object' && 'data' in data && Array.isArray((data as { data: unknown }).data)) {
    return (data as { data: SkillDto[] }).data;
  }

  return [];
}

function unwrapSkill(data: unknown): SkillDto {
  if (data && typeof data === 'object' && 'data' in data && (data as { data?: unknown }).data) {
    return (data as { data: SkillDto }).data;
  }

  return data as SkillDto;
}

export async function getSkills(): Promise<Skill[]> {
  const response = await api.get(SKILLS_ENDPOINT);
  return unwrapSkillList(response.data).map(normalizeSkill);
}

export async function createSkill(payload: SkillPayload): Promise<Skill> {
  const response = await api.post(SKILLS_ENDPOINT, payload);
  return normalizeSkill(unwrapSkill(response.data));
}

export async function updateSkill(id: string, payload: SkillPayload): Promise<Skill> {
  const response = await api.put(`${SKILLS_ENDPOINT}/${id}`, payload);
  return normalizeSkill(unwrapSkill(response.data));
}

export async function removeSkill(id: string): Promise<void> {
  await api.delete(`${SKILLS_ENDPOINT}/${id}`);
}
