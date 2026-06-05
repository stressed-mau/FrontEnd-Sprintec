import { useState } from "react"
import { Briefcase, X } from "lucide-react"

import { ExperienceCertificatePreviewModal } from "@/components/experience/ExperienceCertificatePreviewModal"
import { ExperienceStatusBadge } from "@/components/experience/ExperienceStatusBadge"
import { Button } from "@/components/ui/button"
import { formatExperienceDate } from "@/hooks/useExperienceManager"
import type { ExperienceItem } from "@/types/experience"

export function ExperienceDetailsModal({ experience, onClose }: { experience: ExperienceItem | null; onClose: () => void }) {
  const [certificatePreviewUrl, setCertificatePreviewUrl] = useState<string | null>(null)
  if (!experience) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-3 backdrop-blur-sm sm:items-center sm:px-4">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-[#6DACBF] bg-white p-6 shadow-2xl sm:rounded-3xl">
        <ExperienceDetailsHeader onClose={onClose} />
        <div className="space-y-6">
          <ExperienceSummary experience={experience} />
          <ExperienceDetailsGrid experience={experience} />
          <DetailItem label="Descripción" value={experience.description || "No especificada"} />
          {experience.certificate ? <DocumentButton onClick={() => setCertificatePreviewUrl(experience.certificate)} /> : null}
        </div>
      </div>
      <ExperienceCertificatePreviewModal url={certificatePreviewUrl} onClose={() => setCertificatePreviewUrl(null)} />
    </div>
  )
}

function ExperienceDetailsHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold text-[#003A6C]">Detalle de Experiencia Laboral</h2>
        <p className="mt-1 text-sm text-[#4B778D]">Información completa del registro seleccionado.</p>
      </div>
      <button type="button" onClick={onClose} className="rounded-full p-1 text-[#003A6C] transition hover:bg-[#EEF5F9]" aria-label="Cerrar detalle de experiencia">
        <X className="size-5" />
      </button>
    </div>
  )
}

function ExperienceSummary({ experience }: { experience: ExperienceItem }) {
  return (
    <div className="flex items-start gap-4">
      {experience.image ? (
        <img src={experience.image} alt="" className="size-16 shrink-0 rounded-lg border border-[#D7E6F2] bg-white object-contain p-1 shadow-sm" />
      ) : (
        <div className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-[#D9EAF4] text-[#003A6C]">
          <Briefcase className="size-8" />
        </div>
      )}
      <div>
        <p className="text-xl font-semibold text-[#003A6C]">{experience.company}</p>
        <p className="text-[#4B778D]">{experience.position}</p>
        <div className="mt-3"><ExperienceStatusBadge experience={experience} /></div>
      </div>
    </div>
  )
}

function ExperienceDetailsGrid({ experience }: { experience: ExperienceItem }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <DetailItem label="Inicio" value={formatExperienceDate(experience.startDate)} />
      <DetailItem label="Fin" value={experience.current ? "Actual" : formatExperienceDate(experience.endDate)} />
      <DetailItem label="Correo" value={experience.email || "No especificado"} />
      <DetailItem label="Ubicación" value={experience.location || "No especificada"} />
    </div>
  )
}

function DocumentButton({ onClick }: { onClick: () => void }) {
  return (
    <Button type="button" variant="outline" onClick={onClick} className="border-[#A5D7E8] bg-[#EEF5F9] text-[#003A6C] hover:bg-[#D9EAF4]">
      Ver certificado
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
