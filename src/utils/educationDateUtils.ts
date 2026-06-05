const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

export function formatEducationDate(value: string) {
  const parsedDate = parseEducationDate(value)
  if (!parsedDate) return value

  return parsedDate.toLocaleDateString("es-BO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

function parseEducationDate(value: string) {
  const matches = ISO_DATE_PATTERN.exec(value.trim())
  if (!matches) return null

  const year = Number(matches[1])
  const month = Number(matches[2])
  const day = Number(matches[3])
  const parsedDate = new Date(year, month - 1, day)

  const isSameDate =
    parsedDate.getFullYear() === year &&
    parsedDate.getMonth() === month - 1 &&
    parsedDate.getDate() === day

  if (!isSameDate) return null

  parsedDate.setHours(0, 0, 0, 0)
  return parsedDate
}
