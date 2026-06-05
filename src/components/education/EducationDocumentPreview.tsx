export function EducationDocumentPreview({ source }: { source: string }) {
  const isPdf = /^data:application\/pdf/i.test(source) || /\.pdf(?:[?#].*)?$/i.test(source)
  const isImage = /^data:image\//i.test(source) || /\.(?:jpe?g|png|webp|gif)(?:[?#].*)?$/i.test(source)

  if (isImage) {
    return <img src={source} alt="Vista previa del documento de formación" className="h-32 w-44 rounded-md border border-[#D7E6F2] bg-white object-contain" />
  }

  if (isPdf) {
    return <iframe src={source} title="Vista previa del documento de formación" className="h-40 w-56 rounded-md border border-[#D7E6F2] bg-white" />
  }

  return <span className="max-w-xs truncate text-sm text-gray-700">Documento seleccionado o ya adjunto.</span>
}
