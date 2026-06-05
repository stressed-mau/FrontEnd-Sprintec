import { SOFT_SKILL_NUMBERS_MESSAGE, SOFT_SKILL_SPECIAL_CHARS_MESSAGE,} from '@/constants/skillConstants';

export function containsOnlyLetters(value: string): boolean {
  const onlyLetters = /^[a-zA-ZÀ-ÿ\s]+$/;
  return onlyLetters.test(value.trim());
}

export function getSoftSkillValidationMessage(
  skillName: string
): string | null {
  const hasNumbers = /\d/.test(skillName);

  if (containsOnlyLetters(skillName)) {
    return null;
  }

  return hasNumbers
    ? SOFT_SKILL_NUMBERS_MESSAGE
    : SOFT_SKILL_SPECIAL_CHARS_MESSAGE;
}