import type { Skill } from '@/services/skillsService';
import { TECHNICAL_LEVEL_PRIORITY } from '@/constants/skillConstants';

export function sortTechnicalSkills(skills: Skill[]): Skill[] {
  return [...skills]
    .filter((skill) => skill.type === 'tecnica')
    .sort((a, b) => {
      const aPriority =
        TECHNICAL_LEVEL_PRIORITY[a.level?.toLowerCase() ?? ''] ?? 0;

      const bPriority =
        TECHNICAL_LEVEL_PRIORITY[b.level?.toLowerCase() ?? ''] ?? 0;

      if (bPriority !== aPriority) {
        return aPriority - bPriority;
      }

      return a.name.localeCompare(b.name, 'es', {
        sensitivity: 'base',
      });
    });
}

export function sortSoftSkills(skills: Skill[]): Skill[] {
  return [...skills]
    .filter((skill) => skill.type === 'blanda')
    .sort((a, b) =>
      a.name.localeCompare(b.name, 'es', {
        sensitivity: 'base',
      })
    );
}

export function filterSkills(
  skills: Skill[],
  query: string
) {
  const search = query.trim().toLowerCase();

  if (!search) {
    return skills;
  }

  return skills.filter(
    (skill) =>
      skill.name.toLowerCase().includes(search) ||
      (skill.level ?? '').toLowerCase().includes(search) ||
      skill.type.toLowerCase().includes(search)
  );
}

export function filterTechnicalSkills(
  skills: Skill[],
  query: string
) {
  const search = query.trim().toLowerCase();

  if (!search) {
    return skills;
  }

  return skills.filter(
    (skill) =>
      skill.name.toLowerCase().includes(search) ||
      (skill.level ?? '').toLowerCase().includes(search)
  );
}

export function filterSoftSkills(
  skills: Skill[],
  query: string
) {
  const search = query.trim().toLowerCase();

  if (!search) {
    return skills;
  }

  return skills.filter((skill) =>
    skill.name.toLowerCase().includes(search)
  );
}
