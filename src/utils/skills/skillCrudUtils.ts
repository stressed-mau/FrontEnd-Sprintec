import {  createSkill,  updateSkill, type SkillPayload , type Skill} from '@/services/skillsService';

export function addSkillToList(
  skills: Skill[],
  newSkill: Skill
) {
  return [...skills, newSkill];
}

export function updateSkillInList(
  skills: Skill[],
  updatedSkill: Skill
) {
  return skills.map((skill) =>
    skill.id === updatedSkill.id
      ? updatedSkill
      : skill
  );
}

export async function saveSkill(
  editingSkill: Skill | null,
  payload: SkillPayload
) {
  if (editingSkill) {
    const updated = await updateSkill(
      editingSkill.id,
      payload
    );

    return {
      skill: updated,
      successMessage:
        'La habilidad se ha actualizado correctamente.',
      isEditing: true,
    };
  }

  const created = await createSkill(payload);

  return {
    skill: created,
    successMessage:
      'La habilidad se ha registrado correctamente.',
    isEditing: false,
  };
}