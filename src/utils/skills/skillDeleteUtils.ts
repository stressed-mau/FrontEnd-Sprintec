import type { Skill } from '@/services/skillsService';

export function removeSkillFromList(
  skills: Skill[],
  skillId: string
) {
  return skills.filter(
    (skill) => skill.id !== skillId
  );
}

export function removeSelectedSkillsFromList(
  skills: Skill[],
  selectedIds: Set<string>
) {
  return skills.filter(
    (skill) => !selectedIds.has(skill.id)
  );
}