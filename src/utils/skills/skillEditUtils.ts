import type { Skill, SkillType } from '@/services/skillsService';
import { normalizeSkillName } from './skillUtils';

type Params = {
  editingSkill: Skill;
  formattedName: string;
  skillType: SkillType;
  skillLevel: string;
};

export function hasSkillChanges({
  editingSkill,
  formattedName,
  skillType,
  skillLevel,
}: Params): boolean {
  const sameName =
    normalizeSkillName(editingSkill.name) ===
    normalizeSkillName(formattedName);

  const sameType =
    editingSkill.type === skillType;

  const sameLevel =
    (editingSkill.level ?? '').toLowerCase() ===
    skillLevel.toLowerCase();

  return !(
    sameName &&
    sameType &&
    (skillType === 'blanda' || sameLevel)
  );
}
