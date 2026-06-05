import { X } from "lucide-react"

import { useCertificatePreview, getCloudinaryPdfPageImageUrl } from "@/hooks/useCertificatePreview"

export function CertificatePreviewModal({ url, onClose }: { url: string | null; onClose: () => void }) {
  const preview = useCertificatePreview(url)
  if (!url) return null

  const previewSource = preview.previewUrl || url
  const isFallback = isCloudinaryPdfImageFallback(url, preview.previewUrl)
  const isImage = isImagePreview(preview.contentType, previewSource, preview.isImageUrl, isFallback)
  const isPdf = !isImage && (preview.contentType.includes("pdf") || /\.pdf(?:[?#].*)?$/i.test(previewSource))

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center overflow-hidden bg-black/60 p-3 backdrop-blur-sm sm:p-4">
      <div className="flex h-[calc(100vh-1.5rem)] w-[calc(100vw-1.5rem)] max-w-5xl flex-col overflow-hidden rounded-3xl border border-[#6DACBF] bg-white shadow-2xl sm:h-[calc(100vh-2rem)] sm:w-[calc(100vw-2rem)]">
        <CertificatePreviewHeader onClose={onClose} />
        <CertificatePreviewBody url={url} previewUrl={preview.previewUrl} isLoading={preview.isLoading} errorMessage={preview.errorMessage} isPdf={isPdf} isImage={isImage} isFallback={isFallback} />
      </div>
    </div>
  )
}

function CertificatePreviewHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#D7E6F2] px-5 py-4">
      <h3 className="text-lg font-semibold text-[#003A6C]">Vista previa del certificado</h3>
      <button type="button" onClick={onClose} className="rounded-full p-1 text-[#003A6C] transition hover:bg-[#EEF5F9]" aria-label="Cerrar vista previa del certificado">
        <X className="size-5" />
      </button>
    </div>
  )
}

function CertificatePreviewBody(props: {
  url: string
  previewUrl: string
  isLoading: boolean
  errorMessage: string
  isPdf: boolean
  isImage: boolean
  isFallback: boolean
}) {
  return (
    <div className="min-h-0 flex-1 overflow-hidden bg-[#F7F0E1] p-3 sm:p-4">
      {props.isLoading ? <CenteredMessage message="Cargando documento..." /> : null}
      {!props.isLoading && props.errorMessage ? <CertificateError url={props.url} message={props.errorMessage} /> : null}
      {!props.isLoading && !props.errorMessage ? <CertificatePreviewContent {...props} /> : null}
    </div>
  )
}

function CertificatePreviewContent({ url, previewUrl, isPdf, isImage, isFallback }: { url: string; previewUrl: string; isPdf: boolean; isImage: boolean; isFallback: boolean }) {
  if (previewUrl && isPdf) return <iframe src={`${previewUrl}#view=FitH&zoom=page-width`} title="Certificado PDF" className="h-full min-h-0 w-full rounded-xl border border-[#A5D7E8] bg-white" />
  if (previewUrl && isFallback) return <CloudinaryPdfPagesPreview pdfUrl={url} />
  if (previewUrl && isImage) return <ImagePreview src={previewUrl} />
  if (previewUrl) return <OpenDocumentLink href={previewUrl} />
  return null
}

function CloudinaryPdfPagesPreview({ pdfUrl }: { pdfUrl: string }) {
  const pages = Array.from({ length: 30 }, (_, index) => index + 1)

  return (
    <div className="h-full min-h-0 w-full min-w-0 overflow-y-auto overflow-x-hidden rounded-xl border border-[#A5D7E8] bg-white p-3">
      <div className="mx-auto flex w-full max-w-full flex-col gap-4">
        {pages.map((page) => (
          <img key={page} src={getCloudinaryPdfPageImageUrl(pdfUrl, page)} alt={`Certificado pagina ${page}`} className="mx-auto block h-auto w-full max-w-full object-contain" />
        ))}
      </div>
    </div>
  )
}

function ImagePreview({ src }: { src: string }) {
  return (
    <div className="h-full min-h-0 w-full min-w-0 overflow-y-auto overflow-x-hidden rounded-xl border border-[#A5D7E8] bg-white p-3">
      <img src={src} alt="Certificado" className="mx-auto block h-auto w-full max-w-full object-contain" />
    </div>
  )
}

function CertificateError({ url, message }: { url: string; message: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
      <p className="text-sm font-medium text-red-700">{message}</p>
      <OpenDocumentLink href={url} label="Abrir en otra pestaña" />
    </div>
  )
}

function OpenDocumentLink({ href, label = "Abrir documento" }: { href: string; label?: string }) {
  return <a href={href} target="_blank" rel="noreferrer" className="rounded-lg border border-[#A5D7E8] bg-white px-4 py-2 text-sm font-medium text-[#003A6C] hover:bg-[#EEF5F9]">{label}</a>
}

function CenteredMessage({ message }: { message: string }) {
  return <div className="flex h-full items-center justify-center text-sm font-medium text-[#003A6C]">{message}</div>
}

function isCloudinaryPdfImageFallback(url: string, previewUrl: string) {
  return Boolean(previewUrl && url.includes("res.cloudinary.com") && /\.pdf(?:[?#].*)?$/i.test(url) && previewUrl === getCloudinaryPdfPageImageUrl(url, 1))
}

function isImagePreview(contentType: string, previewSource: string, isImageUrl: boolean, isFallback: boolean) {
  return contentType.startsWith("image/") || /^data:image\//i.test(previewSource) || /\.(?:jpe?g|png|webp|gif)(?:[?#].*)?$/i.test(previewSource) || isImageUrl || isFallback
}
