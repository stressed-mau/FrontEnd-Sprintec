import { api } from "@/services/api"

const IMAGE_UPLOAD_TIMEOUT_MS = 180_000

export async function uploadImage(file: File) {
  const formData = new FormData()
  formData.append("image", file, file.name)

  const response = await api.post("/images", formData, {
    timeout: IMAGE_UPLOAD_TIMEOUT_MS,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  const body = isRecord(response.data) ? response.data : undefined
  if (body?.success === false) {
    throw new Error(getImageErrorMessage(body))
  }

  const imageId = extractImageIdFromResponse(response.data)
  if (imageId == null) {
    throw new Error("La respuesta de imagenes no incluye el id. Revisa el formato del API.")
  }

  return imageId
}

function getImageErrorMessage(body: Record<string, unknown>) {
  return typeof body.message === "string" && body.message.trim() ? body.message : "Error al subir imagen"
}

function extractImageIdFromResponse(body: unknown): number | null {
  if (!isRecord(body)) return null

  const direct = getFiniteNumber(body.id) ?? getFiniteNumber(body.image_id)
  if (direct != null) return direct

  if (!isRecord(body.data)) return null
  return getFiniteNumber(body.data.id) ?? getFiniteNumber(body.data.image_id)
}

function getFiniteNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value))
}
