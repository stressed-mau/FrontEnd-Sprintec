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

export const SOFT_SKILL_NUMBERS_MESSAGE =
  'El Nombre de la habilidad contiene números. Solo se permiten letras.';

export const SOFT_SKILL_SPECIAL_CHARS_MESSAGE =
  'El Nombre de la habilidad contiene caracteres especiales. Solo se permiten letras.';

export const LEVEL_LABELS: Record<string, string> = {
  experto: 'Experto',
  avanzado: 'Avanzado',
  intermedio: 'Intermedio',
  basico: 'Básico',
};

export const LEVEL_COLORS: Record<string, string> = {
  experto: 'bg-purple-100 text-purple-700',
  avanzado: 'bg-pink-100 text-pink-600',
  intermedio: 'bg-blue-100 text-blue-600',
  basico: 'bg-gray-100 text-gray-600',
};