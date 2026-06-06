import type { Skill, SkillType } from '@/services/skillsService';
import {formatSkillName, normalizeSkillName, isSimilarToOriginal,} from './skillUtils';
import { SOFT_SKILL_NUMBERS_MESSAGE, SOFT_SKILL_SPECIAL_CHARS_MESSAGE, REQUIRED_SKILL_NAME_MESSAGE, INVALID_SOFT_SKILL_EDIT_MESSAGE, DUPLICATE_SKILL_MESSAGE } from '@/constants/skillConstants';

export function validateSkillForm({
  skillName,
  skillType,
  editingSkill,
  skills,
}: {
  skillName: string;
  skillType: SkillType;
  editingSkill: Skill | null;
  skills: Skill[];
}): string | null {

  if (!skillName.trim()) {
    return REQUIRED_SKILL_NAME_MESSAGE;
  }

  if (skillType === 'blanda') {
    const onlyLetters = /^[a-zA-ZÀ-ÿ\s]+$/;

    if (!onlyLetters.test(skillName.trim())) {
      const hasNumbers = /\d/.test(skillName);

      return hasNumbers
        ? SOFT_SKILL_NUMBERS_MESSAGE
        : SOFT_SKILL_SPECIAL_CHARS_MESSAGE;
    }
  }

  if (
    editingSkill &&
    editingSkill.type === 'blanda' &&
    !isSimilarToOriginal(editingSkill.name, skillName.trim())
  ) {
    return INVALID_SOFT_SKILL_EDIT_MESSAGE;
  }

  const formattedName = formatSkillName(skillName);
  const normalizedName = normalizeSkillName(formattedName);

  const exists = skills.some(
    (skill) =>
      normalizeSkillName(skill.name) === normalizedName &&
      (!editingSkill || skill.id !== editingSkill.id)
  );

  if (exists) {
    return DUPLICATE_SKILL_MESSAGE;
  }

  return null;
}