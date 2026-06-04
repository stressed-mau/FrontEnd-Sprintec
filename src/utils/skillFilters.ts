import type { Skill } from '@/services/skillsService';

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