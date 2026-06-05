const DATE_PATTERN = /^(\d{2})\/(\d{2})\/(\d{4})$/
const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

export function normalizeExperienceFormDate(value: string) {
  const trimmedValue = value.trim()
  const isoDateMatch = trimmedValue.match(/^(\d{4}-\d{2}-\d{2})/)
  const slashDateMatch = trimmedValue.match(DATE_PATTERN)

  if (!trimmedValue) return ""
  if (isoDateMatch) return isoDateMatch[1]
  if (slashDateMatch) return `${slashDateMatch[3]}-${slashDateMatch[2]}-${slashDateMatch[1]}`
  return trimmedValue
}

export function parseExperienceDate(value: string) {
  const trimmedValue = value.trim()
  const matches = ISO_DATE_PATTERN.exec(trimmedValue) ?? DATE_PATTERN.exec(trimmedValue)

  if (!matches) return null

  const isIso = matches[1].length === 4
  const year = Number(isIso ? matches[1] : matches[3])
  const month = Number(matches[2])
  const day = Number(isIso ? matches[3] : matches[1])
  const parsedDate = new Date(year, month - 1, day)

  if (!isSameDate(parsedDate, year, month, day)) return null

  parsedDate.setHours(0, 0, 0, 0)
  return parsedDate
}

export function isIsoExperienceDate(value: string) {
  return ISO_DATE_PATTERN.test(value.trim())
}

export function isFutureExperienceDate(value: string) {
  const parsedDate = parseExperienceDate(value)
  if (!parsedDate) return false

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return parsedDate.getTime() > today.getTime()
}

export function formatExperienceDate(value: string) {
  const parsedDate = parseExperienceDate(value)
  if (!parsedDate) return value

  return parsedDate.toLocaleDateString("es-BO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

function isSameDate(date: Date, year: number, month: number, day: number) {
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
}
