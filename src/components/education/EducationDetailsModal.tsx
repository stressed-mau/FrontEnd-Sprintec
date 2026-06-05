import { useState } from "react"
import { GraduationCap, X } from "lucide-react"

import { EducationCertificatePreviewModal } from "@/components/education/EducationCertificatePreviewModal"
import { EducationStatusBadge } from "@/components/education/EducationStatusBadge"
import { Button } from "@/components/ui/button"
import type { EducationItem } from "@/types/education"
import { formatEducationDate } from "@/utils/educationDateUtils"

export function EducationDetailsModal({ education, onClose }: { education: EducationItem | null; onClose: () => void }) {
  const [certificatePreviewUrl, setCertificatePreviewUrl] = useState<string | null>(null)
  if (!education) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-3 backdrop-blur-sm sm:items-center sm:px-4">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-[#6DACBF] bg-white p-6 shadow-2xl sm:rounded-3xl">
        <EducationDetailsHeader onClose={onClose} />
        <div className="space-y-6">
          <EducationSummary education={education} />
          <EducationDetailsGrid education={education} />
          <DetailItem label="Descripción" value={education.description || "No especificada"} />
          {education.certificate ? <DocumentButton onClick={() => setCertificatePreviewUrl(education.certificate)} /> : null}
        </div>
      </div>
      <EducationCertificatePreviewModal url={certificatePreviewUrl} onClose={() => setCertificatePreviewUrl(null)} />
    </div>
  )
}

function EducationDetailsHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold text-[#003A6C]">Detalle de Formación Académica</h2>
        <p className="mt-1 text-sm text-[#4B778D]">Información completa del registro seleccionado.</p>
      </div>
      <button type="button" onClick={onClose} className="rounded-full p-1 text-[#003A6C] transition hover:bg-[#EEF5F9]" aria-label="Cerrar detalle de formación académica">
        <X className="size-5" />
      </button>
    </div>
  )
}

function EducationSummary({ education }: { education: EducationItem }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-[#D9EAF4] text-[#003A6C]">
        <GraduationCap className="size-8" />
      </div>
      <div>
        <p className="text-xl font-semibold text-[#003A6C]">{education.company}</p>
        <p className="text-[#4B778D]">{education.position}</p>
        <div className="mt-3"><EducationStatusBadge education={education} /></div>
      </div>
    </div>
  )
}

function EducationDetailsGrid({ education }: { education: EducationItem }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <DetailItem label="Estado" value={education.current ? "Cursando" : "Finalizado"} />
      <DetailItem label="Fecha de emisión" value={education.endDate ? formatEducationDate(education.endDate) : "Actual"} />
      <DetailItem label="Área de estudio" value={education.fieldOfStudy || "No especificada"} />
    </div>
  )
}

function DocumentButton({ onClick }: { onClick: () => void }) {
  return (
    <Button type="button" variant="outline" onClick={onClick} className="border-[#A5D7E8] bg-[#EEF5F9] text-[#003A6C] hover:bg-[#D9EAF4]">
      Ver documento
    </Button>
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
