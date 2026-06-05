import type { SkillDto } from '@/services/skillsService';

export function unwrapPayload(data: unknown): unknown {
  if (!data || typeof data !== 'object') {
    return data;
  }

  const record = data as Record<string, unknown>;

  if (Array.isArray(record.data) || Array.isArray(record.skills)) {
    return record;
  }
  if ('data' in record && record.data && typeof record.data === 'object') {
    return unwrapPayload(record.data);
  }
  if ('skill' in record && record.skill && typeof record.skill === 'object') {
    return unwrapPayload(record.skill);
  }
  return data;
}

export function looksLikeSkillDtoArray(value: unknown): value is SkillDto[] {
  if (!Array.isArray(value)) {
    return false;
  }
  if (value.length === 0) {
    return true;
  }
  return value.every((item) => {
    if (!item || typeof item !== 'object') {
      return false;
    }

    const record = item as Record<string, unknown>;
    return (
      'id' in record ||
      'name' in record ||
      'nombre' in record ||
      'type' in record ||
      'tipo' in record ||
      'level' in record ||
      'nivel' in record ||
      'level_of_domain' in record
    );
  });
}

export function findSkillArray(value: unknown, seen = new WeakSet<object>()): SkillDto[] | null {
  const unwrapped = unwrapPayload(value);
  console.log('Skills recibidas del backend:', unwrapped);

  if (looksLikeSkillDtoArray(unwrapped)) {
    return unwrapped;
  }
  if (!unwrapped || typeof unwrapped !== 'object') {
    return null;
  }

  const record = unwrapped as Record<string, unknown>;
  if (seen.has(record)) {
    return null;
  }
  seen.add(record);
  const preferredKeys = ['data', 'skills', 'items', 'results','records','tecnicas','blandas'];
  for (const key of preferredKeys) {
    const candidate = record[key];
    const found = findSkillArray(candidate, seen);
    if (found) {
      return found;
    }
  }

  for (const candidate of Object.values(record)) {
    const found = findSkillArray(candidate, seen);
    if (found) {
      return found;
    }
  }
  return null;
}

export function parseResponseData(data: unknown): unknown {
  if (data == null || data === '') {
    return [];
  }
  if (typeof data !== 'string') {
    return data;
  }
  try {
    return JSON.parse(data);
  } catch {
    return data;
  }
}

export function unwrapSkillList(data: unknown): SkillDto[] {
  const parsed = parseResponseData(data);
  if (
    parsed &&
    typeof parsed === 'object' &&
    'data' in parsed
  ) {
    const payload = (parsed as any).data;
    if (
      payload &&
      typeof payload === 'object' &&
      ('tecnicas' in payload || 'blandas' in payload)
    ) {
      const tecnicas = Array.isArray(payload.tecnicas)
        ? payload.tecnicas
        : [];
      const blandas = Array.isArray(payload.blandas)
        ? payload.blandas
        : [];
      return [...tecnicas, ...blandas];
    }
  }
  return findSkillArray(parsed) ?? [];
}

export function unwrapSkill(data: unknown): SkillDto {
  const unwrapped = unwrapPayload(data);
  if (unwrapped && typeof unwrapped === 'object') {
    if ('data' in unwrapped && (unwrapped as { data?: unknown }).data) {
      return (unwrapped as { data: SkillDto }).data;
    }
    if ('skill' in unwrapped && (unwrapped as { skill?: unknown }).skill) {
      return (unwrapped as { skill: SkillDto }).skill;
    }
  }
  return unwrapped as SkillDto;
}