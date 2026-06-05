export const TECHNICAL_LEVEL_PRIORITY: Record<string, number> = {
  basico: 1,
  intermedio: 2,
  avanzado: 3,
  experto: 4,
};

export const DUPLICATE_SKILL_MESSAGE =
  'Ya existe una habilidad registrada con ese nombre. Ingresa un nombre diferente.';

export const NO_CHANGES_MESSAGE =
  'No hay cambios para guardar.';

export const INVALID_SOFT_SKILL_EDIT_MESSAGE =
  'No se puede cambiar el nombre de la habilidad, solo se permiten correcciones.';
  
export const REQUIRED_SKILL_NAME_MESSAGE =
  'El campo Nombre de la habilidad es obligatorio.';

export const SKILLS_ENDPOINT = '/skills';

export const SKILL_MUTATION_TIMEOUT_MS = 30000;