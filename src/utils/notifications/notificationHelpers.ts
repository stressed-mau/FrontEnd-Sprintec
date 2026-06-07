export function getFirstValue(...values: unknown[]) {
  return values.find((value) => value !== undefined && value !== null && String(value).trim() !== "")
}

export function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value) return null

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value)
      return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : null
    } catch {
      return null
    }
  }

  return typeof value === "object" ? (value as Record<string, unknown>) : null
}