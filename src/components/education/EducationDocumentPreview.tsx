import { FileImage, FileText } from "lucide-react"

export function EducationDocumentPreview({ source }: { source: string }) {
  const isPdf = /^data:application\/pdf/i.test(source) || /\.pdf(?:[?#].*)?$/i.test(source)
  const isImage = /^data:image\//i.test(source) || /\.(?:jpe?g|png|webp|gif)(?:[?#].*)?$/i.test(source)

  if (isImage) {
    return (
      <img
        src={source}
        alt="Vista previa del documento de formacion"
        className="h-16 w-20 rounded-md border border-[#D7E6F2] bg-white object-contain"
      />
    )
  }

  return (
    <div className="flex h-16 w-20 items-center justify-center rounded-md border border-[#D7E6F2] bg-white text-[#003A6C]">
      {isPdf ? <FileText className="size-7" /> : <FileImage className="size-7" />}
    </div>
  )
}
