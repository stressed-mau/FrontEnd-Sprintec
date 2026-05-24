import { GraduationCap, Search, X } from "lucide-react"
import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatExperienceDate, type ExperienceItem } from "@/hooks/useExperienceManager"

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
  if (!url) {
    return null
  }

  const isImage = /^data:image\//i.test(url) || /\.(?:jpe?g|png|webp|gif)(?:[?#].*)?$/i.test(url)
  const isPdf = /^data:application\/pdf/i.test(url) || /\.pdf(?:[?#].*)?$/i.test(url)

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
          {isImage ? (
            <div className="h-full overflow-auto rounded-xl border border-[#A5D7E8] bg-white p-3">
              <img src={url} alt="Documento de formacion" className="mx-auto block h-auto w-full max-w-full object-contain" />
            </div>
          ) : isPdf ? (
            <iframe src={`${url}#view=FitH&zoom=page-width`} title="Documento PDF" className="h-full min-h-0 w-full rounded-xl border border-[#A5D7E8] bg-white" />
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

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-[#6B7E8E]">{label}</p>
      <p className="mt-1 text-sm leading-6 text-[#003A6C]">{value}</p>
    </div>
  )
}
