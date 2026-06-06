export function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function normalizeSkillName(value: string): string {
  return normalizeText(value)
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, ' ');
}

export function formatSkillName(value: string): string {
  return value
    .trim()
    .split(' ')
    .filter(Boolean)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase()
    )
    .join(' ');
}

export function levenshtein(a: string, b: string): number {
  const matrix = Array.from(
    { length: b.length + 1 },
    () => Array(a.length + 1).fill(0)
  );

  for (let i = 0; i <= b.length; i++) {
    matrix[i][0] = i;
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] =
          Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
      }
    }
  }

  return matrix[b.length][a.length];
}

export function isSimilarToOriginal(
  currentName: string,
  originalName: string
): boolean {
  const normalizedCurrent =
    normalizeSkillName(currentName);

  const normalizedOriginal =
    normalizeSkillName(originalName);

  const distance = levenshtein(
    normalizedCurrent,
    normalizedOriginal
  );

  return distance <= 1;
}