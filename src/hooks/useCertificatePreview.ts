import { useEffect, useState } from "react"

import { getCloudinaryPdfPageImageUrl, loadCertificatePreview, shouldAttachAuthHeader } from "@/services/experienceCertificatePreviewService"

export function useCertificatePreview(url: string | null) {
  const [previewUrl, setPreviewUrl] = useState("")
  const [contentType, setContentType] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const isImageUrl = Boolean(url && /\.(?:jpe?g|png|webp|gif)(?:[?#].*)?$/i.test(url))

  function updateState(state: Partial<CertificatePreviewState>) {
    if (state.isLoading !== undefined) setIsLoading(state.isLoading)
    if (state.errorMessage !== undefined) setErrorMessage(state.errorMessage)
    if (state.previewUrl !== undefined) setPreviewUrl(state.previewUrl)
    if (state.contentType !== undefined) setContentType(state.contentType)
  }

  useEffect(() => {
    if (!url) return

    let objectUrl = ""
    let isCancelled = false
    void loadPreview(url, isImageUrl, {
      onObjectUrl: (nextObjectUrl) => {
        objectUrl = nextObjectUrl
      },
      update: (state) => {
        if (!isCancelled) updateState(state)
      },
    })

    return () => {
      isCancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [isImageUrl, url])

  return {
    contentType,
    errorMessage,
    isImageUrl,
    isLoading,
    previewUrl,
  }
}

interface CertificatePreviewState {
  previewUrl: string
  contentType: string
  isLoading: boolean
  errorMessage: string
}

async function loadPreview(
  sourceUrl: string,
  isImageUrl: boolean,
  handlers: { onObjectUrl: (url: string) => void; update: (state: Partial<CertificatePreviewState>) => void },
) {
  handlers.update({ isLoading: true, errorMessage: "", previewUrl: "", contentType: "" })

  if (sourceUrl.startsWith("data:")) return loadDataUrlPreview(sourceUrl, handlers.update)
  if (isImageUrl && !shouldAttachAuthHeader(sourceUrl)) return loadPublicImagePreview(sourceUrl, handlers.update)

  try {
    const preview = await loadCertificatePreview(sourceUrl)
    if (preview.fallbackImageUrl) return loadPublicImagePreview(preview.fallbackImageUrl, handlers.update)
    if (!preview.blob) return

    const objectUrl = URL.createObjectURL(preview.blob)
    handlers.onObjectUrl(objectUrl)
    handlers.update({ previewUrl: objectUrl, contentType: preview.blob.type || "", isLoading: false })
  } catch (error) {
    handlers.update({ errorMessage: error instanceof Error ? error.message : "No se pudo cargar el documento.", isLoading: false })
  }
}

function loadDataUrlPreview(sourceUrl: string, update: (state: Partial<CertificatePreviewState>) => void) {
  update({ previewUrl: sourceUrl, contentType: sourceUrl.match(/^data:([^;,]+)/)?.[1] ?? "", isLoading: false })
}

function loadPublicImagePreview(sourceUrl: string, update: (state: Partial<CertificatePreviewState>) => void) {
  update({ previewUrl: sourceUrl, contentType: "image/*", isLoading: false })
}

export { getCloudinaryPdfPageImageUrl }
