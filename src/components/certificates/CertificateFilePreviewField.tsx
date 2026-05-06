import { FileImage, FileText, FileUp } from "lucide-react"
import { useEffect, useState } from "react"

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
  fileInputRef,
  error,
  onFileChange,
  onRemoveFile,
}: CertificateFilePreviewFieldProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const isPdf = fileInput?.type === "application/pdf"
  const isImage = Boolean(fileInput?.type.startsWith("image/"))

  useEffect(() => {
    if (!fileInput || !isImage) {
      setPreviewUrl(null)
      return
    }

    const objectUrl = URL.createObjectURL(fileInput)
    setPreviewUrl(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [fileInput, isImage])

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-[#003A6C]">Archivo Adicional</label>
      <div className="rounded-xl border-2 border-dashed border-[#0E7D96]/20 bg-[#F8FAFC] p-3">
        {fileInput ? (
          <div className="flex min-h-[84px] items-center gap-3 overflow-hidden">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#0E7D96]/15 bg-white">
              {isImage && previewUrl ? (
                <img src={previewUrl} alt="Vista previa del archivo" className="h-full w-full object-cover" />
              ) : isPdf ? (
                <div className="flex flex-col items-center gap-1 text-red-500">
                  <FileText className="size-7" />
                  <span className="text-[10px] font-bold">PDF</span>
                </div>
              ) : (
                <FileImage className="size-7 text-[#4B778D]" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[#003A6C]">{fileInput.name}</p>
              <p className="text-xs text-[#4B778D]">{formatFileSize(fileInput.size)}</p>
            </div>

            <button
              type="button"
              onClick={onRemoveFile}
              disabled={isSaving}
              className="shrink-0 rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-50"
            >
              Remover
            </button>
          </div>
        ) : (
          <div className="text-center">
            <FileUp className="mx-auto mb-1.5 size-5 text-[#003A6C]" />
            <p className="text-sm text-[#4B778D]">
              Haz clic o arrastra un archivo PDF, JPG, JPEG o PNG
            </p>
            <p className="text-xs text-[#6B7E8E]">Máximo 2MB</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSaving}
              className="mt-2 inline-block rounded-lg bg-[#C2DBED] px-4 py-1.5 text-sm font-medium text-[#003A6C] hover:bg-[#b0cfeb] disabled:opacity-50"
            >
              Seleccionar archivo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              disabled={isSaving}
              onChange={onFileChange}
              className="hidden"
            />
          </div>
        )}
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  )
}
