import type { Skill } from '@/services/skillsService';

type OpenModalParams = {
  skill?: Skill;
};

export function getModalState(
  params: OpenModalParams
) {
  const { skill } = params;

  if (!skill) {
    return {
      editingSkill: null,
      skillType: 'tecnica' as const,
      skillName: '',
      skillLevel: 'basico',
    };
  }

  return {
    editingSkill: skill,
    skillType: skill.type,
    skillName: skill.name,
    skillLevel: skill.level ?? 'basico',
  };
}