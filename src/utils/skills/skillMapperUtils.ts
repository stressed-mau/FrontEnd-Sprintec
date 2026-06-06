import type { Skill, SkillDto, SkillType,} from '@/services/skillsService';

export function mapApiTypeToUi(
  type?: SkillDto['type']
): SkillType {
  const normalizedType =
    typeof type === 'string'
      ? type
          .toLowerCase()
          .trim()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
      : '';

  if (
    normalizedType === 'tecnica' ||
    normalizedType === 'tecnico' ||
    normalizedType === 'technical'
  ) {
    return 'tecnica';
  }

  if (
    normalizedType === 'blanda' ||
    normalizedType === 'blando' ||
    normalizedType === 'soft' ||
    normalizedType === 'softskill' ||
    normalizedType === 'softskills'
  ) {
    return 'blanda';
  }

  return 'blanda';
}

export function capitalizeLevel(
  level?: string | null
): string | undefined {
  if (!level) {
    return undefined;
  }

  const normalizedLevel = level
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const levelMap: Record<string, string> = {
    basico: 'basico',
    intermedio: 'intermedio',
    avanzado: 'avanzado',
    experto: 'experto',
  };

  return (
    levelMap[normalizedLevel] ??
    normalizedLevel
  );
}

export function normalizeSkill(
  dto: SkillDto
): Skill {
  return {
    id: String(dto.id ?? crypto.randomUUID()),
    name: dto.name ?? dto.nombre ?? '',
    type: mapApiTypeToUi(
      dto.type ?? dto.tipo
    ),
    level: capitalizeLevel(
      dto.level_of_domain ??
      dto.level ??
      dto.nivel
    ),
  };
}