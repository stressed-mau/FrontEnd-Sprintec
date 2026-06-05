import { API_BASE_URL } from "@/services/api"
import { getAuthToken } from "@/services/auth"

export async function loadCertificatePreview(sourceUrl: string) {
  const fallbackImageUrl = getCloudinaryPdfPageImageUrl(sourceUrl, 1)
  const token = shouldAttachAuthHeader(sourceUrl) ? getAuthToken() : null
  const response = await fetch(sourceUrl, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    credentials: token ? "include" : "omit",
  })

  if (response.ok) return { blob: await response.blob(), fallbackImageUrl: "" }
  if (fallbackImageUrl) return { blob: null, fallbackImageUrl }

  throw new Error(getCertificatePreviewError(response, sourceUrl))
}

export function getCloudinaryPdfPageImageUrl(url: string, page: number) {
  if (!url.includes("res.cloudinary.com") || !/\.pdf(?:[?#].*)?$/i.test(url)) return ""

  try {
    const parsedUrl = new URL(url)
    const uploadSegment = "/image/upload/"
    const uploadIndex = parsedUrl.pathname.indexOf(uploadSegment)
    if (uploadIndex === -1) return ""

    const beforeUpload = parsedUrl.pathname.slice(0, uploadIndex + uploadSegment.length)
    const afterUpload = parsedUrl.pathname.slice(uploadIndex + uploadSegment.length).replace(/\.pdf$/i, ".jpg")
    parsedUrl.pathname = `${beforeUpload}pg_${page}/${afterUpload}`
    parsedUrl.search = ""
    parsedUrl.hash = ""
    return parsedUrl.toString()
  } catch {
    return ""
  }
}

export function shouldAttachAuthHeader(url: string) {
  if (!/^(https?:)?\/\//i.test(url) && !url.startsWith("data:") && !url.startsWith("blob:")) return true

  try {
    const targetUrl = new URL(url, window.location.origin)
    const apiUrl = new URL(API_BASE_URL, window.location.origin)
    return targetUrl.origin === window.location.origin || targetUrl.origin === apiUrl.origin
  } catch {
    return false
  }
}

function getCertificatePreviewError(response: Response, sourceUrl: string) {
  const cloudinaryError = response.headers.get("x-cld-error") ?? ""
  const isCloudinaryPdfBlocked = response.status === 401 && sourceUrl.includes("res.cloudinary.com") && /deny|acl/i.test(cloudinaryError)

  return isCloudinaryPdfBlocked
    ? "Cloudinary está bloqueando la entrega pública de este PDF. No se pudo generar una vista previa alternativa."
    : "No se pudo cargar el documento."
}
