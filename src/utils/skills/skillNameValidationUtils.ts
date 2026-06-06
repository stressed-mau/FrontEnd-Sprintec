import { getSoftSkillValidationMessage } from './skillValidation';

export function getSkillNameErrorMessage(
  value: string,
  isSoftSkill: boolean
): string {
  if (!isSoftSkill) {
    return '';
  }

  return (
    getSoftSkillValidationMessage(value) ?? ''
  );
}