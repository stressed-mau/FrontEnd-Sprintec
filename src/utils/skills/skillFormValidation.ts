import type { Skill, SkillType } from '@/services/skillsService';
import {
  formatSkillName,
  normalizeSkillName,
  isSimilarToOriginal,
} from './skillUtils';

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
    return 'El campo Nombre de la habilidad es obligatorio.';
  }

  if (skillType === 'blanda') {
    const onlyLetters = /^[a-zA-ZÀ-ÿ\s]+$/;

    if (!onlyLetters.test(skillName.trim())) {
      const hasNumbers = /\d/.test(skillName);

      return hasNumbers
        ? 'El Nombre de la habilidad contiene números. Solo se permiten letras.'
        : 'El Nombre de la habilidad contiene caracteres especiales. Solo se permiten letras.';
    }
  }

  if (
    editingSkill &&
    editingSkill.type === 'blanda' &&
    !isSimilarToOriginal(editingSkill.name, skillName.trim())
  ) {
    return 'No se puede cambiar el nombre de la habilidad, solo se permiten correcciones.';
  }

  const formattedName = formatSkillName(skillName);
  const normalizedName = normalizeSkillName(formattedName);

  const exists = skills.some(
    (skill) =>
      normalizeSkillName(skill.name) === normalizedName &&
      (!editingSkill || skill.id !== editingSkill.id)
  );

  if (exists) {
    return 'Ya existe una habilidad registrada con ese nombre. Ingresa un nombre diferente.';
  }

  return null;
}