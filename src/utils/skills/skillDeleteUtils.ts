import type { Skill } from '@/services/skillsService';
import { removeSkill } from '@/services/skillsService';

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

export function getDeleteSuccessMessage(
  count: number
): string {
  return count > 1
    ? 'Habilidades eliminadas correctamente.'
    : 'Habilidad eliminada correctamente.';
}

export async function deleteSkill(
  skillId: string
): Promise<void> {
  await removeSkill(skillId);
}

export async function deleteSelectedSkills(
  selectedIds: Set<string>
): Promise<void> {
  await Promise.all(
    Array.from(selectedIds).map((id) =>
      removeSkill(id)));
}