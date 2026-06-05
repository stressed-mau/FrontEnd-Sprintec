import type {
  SkillPayload,
  SkillType,
} from '@/services/skillsService';

type ApiSkillType = 'tecnica' | 'blanda';

export interface ApiSkillPayload {
  name: string;
  level_of_domain?: string;
  type: ApiSkillType;
}

export function mapUiTypeToApi(
  type: SkillType
): ApiSkillType {
  return type === 'tecnica'
    ? 'tecnica'
    : 'blanda';
}

export function toApiPayload(
  payload: SkillPayload
): ApiSkillPayload {
  return {
    name: payload.name,
    level_of_domain: payload.level
      ? payload.level.toLowerCase()
      : undefined,
    type: mapUiTypeToApi(payload.type),
  };
}