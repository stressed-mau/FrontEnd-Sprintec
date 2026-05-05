import { BadgeCheck, CalendarDays, FileText, Link2, ShieldCheck, X } from "lucide-react"

import type { Certificate } from "@/hooks/useCertificatesManager"

type CertificateDetailsModalProps = {
  certificate: Certificate | null
  onClose: () => void
}

function formatCertificateDate(date: string | undefined): string {
  if (!date) return "No especificada"
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) return date

  const parsedDate = new Date(date)
  if (!Number.isNaN(parsedDate.getTime())) {
    return parsedDate.toLocaleDateString("es-ES")
  }

  return date
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-[#D7E6F2] pb-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#4B778D]">{label}</p>
      <p className="mt-1 text-sm leading-6 text-[#003A6C]">{value}</p>
    </div>
  )
}

export function CertificateDetailsModal({ certificate, onClose }: CertificateDetailsModalProps) {
  if (!certificate) return null

  const hasExpiration = Boolean(certificate.date_expired)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-3 backdrop-blur-sm sm:items-center sm:px-4">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-[#6DACBF] bg-white p-6 shadow-2xl sm:rounded-3xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#003A6C]">Detalle del certificado</h2>
            <p className="mt-1 text-sm text-[#4B778D]">Informacion completa del certificado seleccionado.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-[#003A6C] transition hover:bg-[#EEF5F9]"
            aria-label="Cerrar detalle de certificado"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-4 border-b border-[#D7E6F2] pb-6">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-[#D9EAF4] text-[#003A6C]">
              <BadgeCheck className="size-8" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xl font-semibold text-[#003A6C]">{certificate.name}</p>
              <p className="mt-1 text-[#4B778D]">{certificate.issuer}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#EEF5F9] px-3 py-1 text-xs font-medium text-[#355468]">
                  <ShieldCheck className="size-3.5 text-[#0E7D96]" />
                  Certificacion registrada
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#EEF5F9] px-3 py-1 text-xs font-medium text-[#355468]">
                  <CalendarDays className="size-3.5 text-[#0E7D96]" />
                  {hasExpiration ? "Con vencimiento" : "Sin vencimiento"}
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            <DetailItem label="Fecha de emision" value={formatCertificateDate(certificate.date_issued)} />
            <DetailItem label="Fecha de vencimiento" value={hasExpiration ? formatCertificateDate(certificate.date_expired) : "No especificada"} />
            <DetailItem label="ID de credencial" value={certificate.credential_id || "No especificado"} />
            <DetailItem label="URL de verificacion" value={certificate.credential_url || "No especificada"} />
          </div>

          <div className="border-b border-[#D7E6F2] pb-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#4B778D]">Descripcion</p>
            <p className="mt-2 text-sm leading-7 text-[#355468]">{certificate.description || "No especificada"}</p>
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            {certificate.credential_url ? (
              <a
                href={certificate.credential_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-[#A5D7E8] bg-[#EEF5F9] px-4 py-2.5 text-sm font-medium text-[#003A6C] transition hover:bg-[#D9EAF4]"
              >
                <Link2 className="size-4" />
                Ver verificacion
              </a>
            ) : null}

            {certificate.file_bonus_url ? (
              <a
                href={certificate.file_bonus_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-[#A5D7E8] bg-[#EEF5F9] px-4 py-2.5 text-sm font-medium text-[#003A6C] transition hover:bg-[#D9EAF4]"
              >
                <FileText className="size-4" />
                Archivo adicional
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
