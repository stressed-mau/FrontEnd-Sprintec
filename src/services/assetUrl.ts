import { API_BASE_URL } from "@/services/api"

function asString(value: unknown): string {
  if (typeof value === "string") {
    return value.trim()
  }

  if (typeof value === "number") {
    return String(value)
  }

  return ""
}

export function toAbsoluteAssetUrl(value: unknown): string {
  const rawValue = asString(value)

  if (!rawValue) {
    return ""
  }

  if (/^(https?:|data:|blob:)/i.test(rawValue)) {
    return rawValue
  }

  try {
    const backendRootUrl = API_BASE_URL.replace(/\/api\/?$/, "/")
    return new URL(rawValue.replace(/^\/+/, ""), backendRootUrl).toString()
  } catch {
    return rawValue
  }
}
