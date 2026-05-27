import { X } from "lucide-react"
import { useEffect, useState } from "react"

import { API_BASE_URL } from "@/services/api"
import { getAuthToken } from "@/services/auth"

type CertificateDocumentPreviewModalProps = {
  url: string | null
  onClose: () => void
}

type CertificateInlineDocumentPreviewProps = {
  source: string
  mimeType?: string
  fileName?: string
}

export function CertificateInlineDocumentPreview({ source, mimeType = "", fileName = "" }: CertificateInlineDocumentPreviewProps) {
  const normalizedMimeType = mimeType.toLowerCase()
  const isPdf =
    normalizedMimeType === "application/pdf" ||
    /^data:application\/pdf/i.test(source) ||
    /\.pdf(?:[?#].*)?$/i.test(source) ||
    /\.pdf$/i.test(fileName)
  const isImage =
    normalizedMimeType.startsWith("image/") ||
    /^data:image\//i.test(source) ||
    /\.(?:jpe?g|png|webp|gif)(?:[?#].*)?$/i.test(source) ||
    /\.(?:jpe?g|png|webp|gif)$/i.test(fileName)

  if (isImage) {
    return (
      <img
        src={source}
        alt="Vista previa del archivo adicional"
        className="h-32 w-44 rounded-md border border-[#D7E6F2] bg-white object-contain"
      />
    )
  }

  if (isPdf) {
    return (
      <iframe
        src={source}
        title="Vista previa del archivo adicional"
        className="h-40 w-56 rounded-md border border-[#D7E6F2] bg-white"
      />
    )
  }

  return <span className="max-w-xs truncate text-sm text-gray-700">Documento seleccionado o ya adjunto.</span>
}

export function CertificateDocumentPreviewModal({ url, onClose }: CertificateDocumentPreviewModalProps) {
  const [previewUrl, setPreviewUrl] = useState("")
  const [contentType, setContentType] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const isImageUrl = Boolean(url && /\.(?:jpe?g|png|webp|gif)(?:[?#].*)?$/i.test(url))

  useEffect(() => {
    if (!url) {
      return
    }

    const sourceUrl = url
    let objectUrl = ""
    let isCancelled = false

    async function loadDocument() {
      setIsLoading(true)
      setErrorMessage("")
      setPreviewUrl("")
      setContentType("")

      if (sourceUrl.startsWith("data:")) {
        const dataContentType = sourceUrl.match(/^data:([^;,]+)/)?.[1] ?? ""
        setPreviewUrl(sourceUrl)
        setContentType(dataContentType)
        setIsLoading(false)
        return
      }

      if (isImageUrl && !shouldAttachAuthHeader(sourceUrl)) {
        setPreviewUrl(sourceUrl)
        setContentType("image/*")
        setIsLoading(false)
        return
      }

      try {
        const token = shouldAttachAuthHeader(sourceUrl) ? getAuthToken() : null
        const response = await fetch(sourceUrl, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          credentials: token ? "include" : "omit",
        })

        if (!response.ok) {
          const fallbackImageUrl = getCloudinaryPdfPageImageUrl(sourceUrl, 1)

          if (fallbackImageUrl) {
            setPreviewUrl(fallbackImageUrl)
            setContentType("image/*")
            setErrorMessage("")
            return
          }

          const cloudinaryError = response.headers.get("x-cld-error") ?? ""
          const isCloudinaryPdfBlocked =
            response.status === 401 &&
            sourceUrl.includes("res.cloudinary.com") &&
            /deny|acl/i.test(cloudinaryError)

          throw new Error(
            isCloudinaryPdfBlocked
              ? "Cloudinary está bloqueando la entrega pública de este PDF. No se pudo generar una vista previa alternativa."
              : "No se pudo cargar el documento.",
          )
        }

        const blob = await response.blob()

        if (isCancelled) {
          return
        }

        objectUrl = URL.createObjectURL(blob)
        setPreviewUrl(objectUrl)
        setContentType(blob.type || "")
      } catch (error) {
        if (!isCancelled) {
          setErrorMessage(error instanceof Error ? error.message : "No se pudo cargar el documento.")
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadDocument()

    return () => {
      isCancelled = true

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [isImageUrl, url])

  if (!url) {
    return null
  }

  const previewSource = previewUrl || url
  const isCloudinaryPdfImageFallback = Boolean(
    previewUrl &&
    url.includes("res.cloudinary.com") &&
    /\.pdf(?:[?#].*)?$/i.test(url) &&
    previewUrl === getCloudinaryPdfPageImageUrl(url, 1),
  )
  const isImage =
    contentType.startsWith("image/") ||
    /^data:image\//i.test(previewSource) ||
    /\.(?:jpe?g|png|webp|gif)(?:[?#].*)?$/i.test(previewSource) ||
    isImageUrl
  const isPdf = !isImage && (contentType.includes("pdf") || /\.pdf(?:[?#].*)?$/i.test(previewSource))

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center overflow-hidden bg-black/60 p-3 backdrop-blur-sm sm:p-4">
      <div className="flex h-[calc(100vh-1.5rem)] w-[calc(100vw-1.5rem)] max-w-5xl flex-col overflow-hidden rounded-3xl border border-[#6DACBF] bg-white shadow-2xl sm:h-[calc(100vh-2rem)] sm:w-[calc(100vw-2rem)]">
        <div className="flex items-center justify-between gap-4 border-b border-[#D7E6F2] px-5 py-4">
          <h3 className="text-lg font-semibold text-[#003A6C]">Vista previa del documento</h3>
          <button type="button" onClick={onClose} className="rounded-full p-1 text-[#003A6C] transition hover:bg-[#EEF5F9]" aria-label="Cerrar vista previa">
            <X className="size-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden bg-[#F7F0E1] p-3 sm:p-4">
          {isLoading ? (
            <div className="flex h-full items-center justify-center text-sm font-medium text-[#003A6C]">
              Cargando documento...
            </div>
          ) : errorMessage ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <p className="text-sm font-medium text-red-700">{errorMessage}</p>
              <a href={url} target="_blank" rel="noreferrer" className="rounded-lg border border-[#A5D7E8] bg-white px-4 py-2 text-sm font-medium text-[#003A6C] hover:bg-[#EEF5F9]">
                Abrir en otra pestaña
              </a>
            </div>
          ) : previewUrl && isPdf ? (
            <iframe src={`${previewUrl}#view=FitH&zoom=page-width`} title="Documento PDF" className="h-full min-h-0 w-full rounded-xl border border-[#A5D7E8] bg-white" />
          ) : previewUrl && isCloudinaryPdfImageFallback ? (
            <CloudinaryPdfPagesPreview pdfUrl={url} />
          ) : previewUrl && isImage ? (
            <div className="h-full min-h-0 w-full min-w-0 overflow-y-auto overflow-x-hidden rounded-xl border border-[#A5D7E8] bg-white p-3">
              <img src={previewUrl} alt="Archivo adicional del certificado" className="mx-auto block h-auto w-full max-w-full object-contain" />
            </div>
          ) : previewUrl ? (
            <div className="flex h-full items-center justify-center">
              <a href={previewUrl} target="_blank" rel="noreferrer" className="rounded-lg border border-[#A5D7E8] bg-white px-4 py-2 text-sm font-medium text-[#003A6C] hover:bg-[#EEF5F9]">
                Abrir documento
              </a>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <a href={url} target="_blank" rel="noreferrer" className="rounded-lg border border-[#A5D7E8] bg-white px-4 py-2 text-sm font-medium text-[#003A6C] hover:bg-[#EEF5F9]">
                Abrir documento
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CloudinaryPdfPagesPreview({ pdfUrl }: { pdfUrl: string }) {
  const maxPages = 30
  const [pages, setPages] = useState([1])
  const [failedPage, setFailedPage] = useState<number | null>(null)

  const visiblePages = failedPage == null ? pages : pages.filter((page) => page < failedPage)

  function handlePageLoad(page: number) {
    if (failedPage != null || page >= maxPages || page !== pages[pages.length - 1]) {
      return
    }

    setPages((current) => (current.includes(page + 1) ? current : [...current, page + 1]))
  }

  function handlePageError(page: number) {
    setFailedPage((current) => current ?? page)
  }

  return (
    <div className="h-full min-h-0 w-full min-w-0 overflow-y-auto overflow-x-hidden rounded-xl border border-[#A5D7E8] bg-white p-3">
      {visiblePages.length ? (
        <div className="mx-auto flex w-full max-w-full flex-col gap-4">
          {visiblePages.map((page) => (
            <img
              key={page}
              src={getCloudinaryPdfPageImageUrl(pdfUrl, page)}
              alt={`Archivo adicional del certificado pagina ${page}`}
              className="mx-auto block h-auto w-full max-w-full object-contain"
              onLoad={() => handlePageLoad(page)}
              onError={() => handlePageError(page)}
            />
          ))}
        </div>
      ) : (
        <div className="flex h-full items-center justify-center text-sm font-medium text-red-700">
          No se pudo generar la vista previa del PDF.
        </div>
      )}
    </div>
  )
}

function shouldAttachAuthHeader(url: string) {
  if (!/^(https?:)?\/\//i.test(url) && !url.startsWith("data:") && !url.startsWith("blob:")) {
    return true
  }

  try {
    const targetUrl = new URL(url, window.location.origin)
    const apiUrl = new URL(API_BASE_URL, window.location.origin)

    return targetUrl.origin === window.location.origin || targetUrl.origin === apiUrl.origin
  } catch {
    return false
  }
}

function getCloudinaryPdfPageImageUrl(url: string, page: number) {
  if (!url.includes("res.cloudinary.com") || !/\.pdf(?:[?#].*)?$/i.test(url)) {
    return ""
  }

  try {
    const parsedUrl = new URL(url)
    const uploadSegment = "/image/upload/"
    const uploadIndex = parsedUrl.pathname.indexOf(uploadSegment)

    if (uploadIndex === -1) {
      return ""
    }

    const beforeUpload = parsedUrl.pathname.slice(0, uploadIndex + uploadSegment.length)
    const afterUpload = parsedUrl.pathname.slice(uploadIndex + uploadSegment.length)
    const withoutExtension = afterUpload.replace(/\.pdf$/i, ".jpg")

    parsedUrl.pathname = `${beforeUpload}pg_${page}/${withoutExtension}`
    parsedUrl.search = ""
    parsedUrl.hash = ""

    return parsedUrl.toString()
  } catch {
    return ""
  }
}
