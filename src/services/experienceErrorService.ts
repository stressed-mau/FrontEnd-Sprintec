import axios from "axios"

export function formatExperienceError(error: unknown): Error {
  if (!axios.isAxiosError(error)) return new Error("Error inesperado al consumir experiences API.")

  if (error.code === "ECONNABORTED") return new Error("La solicitud tardó demasiado. Intenta nuevamente.")
  if (error.code === "ERR_NETWORK") return new Error("No se pudo conectar con el backend")

  const backendMessage = (error.response?.data as { message?: string } | undefined)?.message ?? error.message
  return new Error(backendMessage || "Error inesperado al consumir experiences API.")
}
