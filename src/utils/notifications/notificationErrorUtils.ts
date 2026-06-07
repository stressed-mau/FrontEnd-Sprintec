import axios from "axios"
export function buildErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || "No se pudieron cargar las notificaciones."
  }

  return "No se pudieron cargar las notificaciones."
}
