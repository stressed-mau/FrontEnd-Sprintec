import { useEffect, useState } from "react"

import { CertificateInlineDocumentPreview } from "@/components/certificates/CertificateDocumentPreview"

type CertificateFilePreviewFieldProps = {
  fileInput: File | null
  isSaving?: boolean
  fileInputRef: React.RefObject<HTMLInputElement | null>
  error?: string
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveFile: () => void
}

function formatFileSize(size: number): string {
  return `${(size / 1024 / 1024).toFixed(2)} MB`
}

export function CertificateFilePreviewField({
  fileInput,
  isSaving,
  onRemoveFile,
}: CertificateFilePreviewFieldProps) {
  const [previewSource, setPreviewSource] = useState<string | null>(null)

  useEffect(() => {
    if (!fileInput) {
      setPreviewSource(null)
      return
    }

    const objectUrl = URL.createObjectURL(fileInput)
    setPreviewSource(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [fileInput])

  return (
    fileInput ? (
      <div className="flex w-full max-w-xl items-center gap-3 rounded-lg border border-[#D7E6F2] bg-[#EEF5F9] px-3 py-2 sm:w-fit">
        {previewSource ? (
          <CertificateInlineDocumentPreview
            source={previewSource}
            mimeType={fileInput.type}
            fileName={fileInput.name}
          />
        ) : null}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-[#003A6C]">{fileInput.name}</p>
          <p className="text-xs text-[#4B778D]">{formatFileSize(fileInput.size)}</p>
        </div>
        <button
          type="button"
          onClick={onRemoveFile}
          disabled={isSaving}
          className="inline-flex h-8 shrink-0 items-center rounded-full bg-red-600 px-3 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
          aria-label="Eliminar archivo adicional"
        >
          Quitar
        </button>
      </div>
    ) : null
  )
}
