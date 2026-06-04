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
    ? 'El Nombre de la habilidad contiene números. Solo se permiten letras.'
    : 'El Nombre de la habilidad contiene caracteres especiales. Solo se permiten letras.';
}