import type { SkillType } from '@/services/skillsService';

export function buildSkillPayload(
  name: string,
  type: SkillType,
  level: string
) {
  return {
    name,
    type,
    level:
      type === 'tecnica'
        ? level.toLowerCase()
        : undefined,
  };
}