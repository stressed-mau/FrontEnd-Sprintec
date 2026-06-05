import { X } from "lucide-react"

export function CertificatePreviewModal({ url, onClose }: { url: string | null; onClose: () => void }) {
  if (!url) return null

  const isImage = /^data:image\//i.test(url) || /\.(?:jpe?g|png|webp|gif)(?:[?#].*)?$/i.test(url)
  const isPdf = /^data:application\/pdf/i.test(url) || /\.pdf(?:[?#].*)?$/i.test(url)

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center overflow-hidden bg-black/60 p-3 backdrop-blur-sm sm:p-4">
      <div className="flex h-[calc(100vh-1.5rem)] w-[calc(100vw-1.5rem)] max-w-5xl flex-col overflow-hidden rounded-3xl border border-[#6DACBF] bg-white shadow-2xl sm:h-[calc(100vh-2rem)] sm:w-[calc(100vw-2rem)]">
        <div className="flex items-center justify-between gap-4 border-b border-[#D7E6F2] px-5 py-4">
          <h3 className="text-lg font-semibold text-[#003A6C]">Vista previa del certificado</h3>
          <button type="button" onClick={onClose} className="rounded-full p-1 text-[#003A6C] transition hover:bg-[#EEF5F9]" aria-label="Cerrar vista previa del certificado">
            <X className="size-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden bg-[#F7F0E1] p-3 sm:p-4">
          {isPdf ? <iframe src={`${url}#view=FitH&zoom=page-width`} title="Documento PDF" className="h-full min-h-0 w-full rounded-xl border border-[#A5D7E8] bg-white" /> : null}
          {isImage ? <ImagePreview src={url} /> : null}
          {!isPdf && !isImage ? <OpenDocumentLink href={url} /> : null}
        </div>
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

function OpenDocumentLink({ href }: { href: string }) {
  return (
    <div className="flex h-full items-center justify-center">
      <a href={href} target="_blank" rel="noreferrer" className="rounded-lg border border-[#A5D7E8] bg-white px-4 py-2 text-sm font-medium text-[#003A6C] hover:bg-[#EEF5F9]">
        Abrir documento
      </a>
    </div>
  )
}
