import { GraduationCap, Search, X } from "lucide-react"
import { useEffect, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatExperienceDate, type ExperienceItem } from "@/hooks/useExperienceManager"
import { API_BASE_URL } from "@/services/api"
import { getAuthToken } from "@/services/auth"

type EducationTableProps = {
  education: ExperienceItem[]
  emptyMessage: string
  searchTerm?: string
  selectedIds?: Set<string>
  onSelect?: (id: string, checked: boolean) => void
  onRowClick?: (education: ExperienceItem) => void
}

type EducationDetailsModalProps = {
  education: ExperienceItem | null
  onClose: () => void
}

export function EducationStatusBadge({ education }: { education: ExperienceItem }) {
  return education.current ? (
    <Badge className="bg-[#D9EAF4] text-[#003A6C]">Cursando</Badge>
  ) : (
    <Badge className="bg-slate-100 text-slate-700">Finalizado</Badge>
  )
}

export function EducationTable({
  education,
  emptyMessage,
  searchTerm = "",
  selectedIds,
  onSelect,
  onRowClick,
}: EducationTableProps) {
  const selectable = Boolean(selectedIds && onSelect)
  const currentSelectedIds = selectedIds ?? new Set<string>()

  return (
    <Card className="rounded-2xl border border-[#A5D7E8] bg-white py-0 shadow-sm">
      <CardContent className="p-0">
        {education.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-[#D9EAF4] text-[#003A6C]">
              {searchTerm ? <Search className="size-7" /> : <GraduationCap className="size-7" />}
            </div>
            <p className="font-medium text-[#003A6C]">{emptyMessage}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse">
              <thead className="bg-[#EEF5F9] text-left text-xs uppercase text-[#003A6C]">
                <tr>
                  {selectable ? <th className="w-12 px-4 py-3 font-semibold">Sel.</th> : null}
                  <th className="px-4 py-3 font-semibold">Institucion academica</th>
                  <th className="px-4 py-3 font-semibold">Nivel de formacion</th>
                  <th className="px-4 py-3 font-semibold">Area de estudio</th>
                  <th className="px-4 py-3 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9EAF4]">
                {education.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => onRowClick?.(item)}
                    className={onRowClick ? "cursor-pointer transition hover:bg-[#EEF5F9]" : "transition hover:bg-[#F8FBFD]"}
                  >
                    {selectable ? (
                      <td className="px-4 py-4" onClick={(event) => event.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={currentSelectedIds.has(item.id)}
                          onChange={(event) => onSelect?.(item.id, event.target.checked)}
                          className="size-4 rounded-none border-[#A5D7E8]"
                          aria-label={`Seleccionar ${item.company}`}
                        />
                      </td>
                    ) : null}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#D9EAF4] text-[#003A6C]">
                          <GraduationCap className="size-5" />
                        </div>
                        <p className="font-medium text-[#003A6C]">{item.company}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-[#355468]">{item.position}</td>
                    <td className="px-4 py-4 text-sm text-[#355468]">{item.fieldOfStudy || "-"}</td>
                    <td className="px-4 py-4">
                      <EducationStatusBadge education={item} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function EducationDetailsModal({ education, onClose }: EducationDetailsModalProps) {
  const [certificatePreviewUrl, setCertificatePreviewUrl] = useState<string | null>(null)

  if (!education) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-3 backdrop-blur-sm sm:items-center sm:px-4">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-[#6DACBF] bg-white p-6 shadow-2xl sm:rounded-3xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#003A6C]">Detalle de Formacion Academica</h2>
            <p className="mt-1 text-sm text-[#4B778D]">Informacion completa del registro seleccionado.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-1 text-[#003A6C] transition hover:bg-[#EEF5F9]" aria-label="Cerrar detalle de formacion academica">
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-[#D9EAF4] text-[#003A6C]">
              <GraduationCap className="size-8" />
            </div>
            <div>
              <p className="text-xl font-semibold text-[#003A6C]">{education.company}</p>
              <p className="text-[#4B778D]">{education.position}</p>
              <div className="mt-3">
                <EducationStatusBadge education={education} />
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <DetailItem label="Estado" value={education.current ? "Cursando" : "Finalizado"} />
            {!education.current && education.startDate ? (
              <DetailItem label="Fecha de emision" value={formatExperienceDate(education.startDate)} />
            ) : null}
            <DetailItem label="Area de estudio" value={education.fieldOfStudy || "No especificada"} />
          </div>

          <DetailItem label="Descripcion" value={education.description || "No especificada"} />

          {education.certificate ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setCertificatePreviewUrl(education.certificate)}
              className="border-[#A5D7E8] bg-[#EEF5F9] text-[#003A6C] hover:bg-[#D9EAF4]"
            >
              Ver documento
            </Button>
          ) : null}
        </div>
      </div>
      <EducationCertificatePreview url={certificatePreviewUrl} onClose={() => setCertificatePreviewUrl(null)} />
    </div>
  )
}

function EducationCertificatePreview({ url, onClose }: { url: string | null; onClose: () => void }) {
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
              <img src={previewUrl} alt="Documento de formacion" className="mx-auto block h-auto w-full max-w-full object-contain" />
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
              alt={`Documento de formacion pagina ${page}`}
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

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-[#6B7E8E]">{label}</p>
      <p className="mt-1 text-sm leading-6 text-[#003A6C]">{value}</p>
    </div>
  )
}
