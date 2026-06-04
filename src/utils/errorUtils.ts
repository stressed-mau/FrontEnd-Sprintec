export function normalizeErrorMessage(
  message: string
): string {
  return message
    .replace(/infoemacion/gi, 'información')
    .replace(/informacion/gi, 'información');
}