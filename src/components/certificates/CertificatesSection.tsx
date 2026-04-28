import type { ReactNode } from "react"
import { BadgeCheck, Download } from "lucide-react"

import type { Certificate } from "@/hooks/useCertificatesManager"

type CertificatesSectionProps = {
  title: string
  emptyMessage: string
  icon: ReactNode
  items: Certificate[]
  onEdit: (certificate: Certificate) => void
}

export function CertificatesSection({
  title,
  emptyMessage,
  icon,
  items,
  onEdit,
}: CertificatesSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 text-[#003A6C]">
        {icon}
        <h2 className="text-xl font-bold sm:text-2xl">{title}</h2>
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-[#6dacbf] bg-white px-6 py-12 text-center shadow-sm sm:py-14">
          <p className="py-4 text-center text-sm text-[#4B778D] sm:text-base">{emptyMessage}</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-[#A5D7E8] bg-white shadow-sm">
          <div className="grid grid-cols-[minmax(0,2.2fr)_minmax(0,1.3fr)_minmax(0,1fr)_auto] gap-4 border-b border-[#6dacbf]/20 px-5 py-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4B778D]">Certificado</span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#4B778D]">Emisor</span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#4B778D]">Emisión</span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#4B778D] text-right">Detalles</span>
          </div>

          {items.map((certificate, idx) => (
            <div
              key={certificate.id}
              onClick={() => onEdit(certificate)}
              className={`grid cursor-pointer grid-cols-[minmax(0,2.4fr)_minmax(180px,1.3fr)_140px_auto] items-center gap-6 px-6 py-4 transition-colors hover:bg-[#EEF6FC] ${
                idx !== items.length - 1 ? "border-b border-[#6dacbf]/10" : ""
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="size-4 shrink-0 text-[#4B778D]" />
                  <span className="truncate font-semibold text-[#003A6C]">{certificate.name}</span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#6B7E8E]">
                  {certificate.credential_id && <span className="truncate">ID: {certificate.credential_id}</span>}
                  {certificate.credential_url && (
                    <a
                      href={certificate.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#003A6C] hover:underline"
                    >
                      Ver credencial
                    </a>
                  )}
                  {certificate.file_bonus_url && (
                    <a
                      href={certificate.file_bonus_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#003A6C] hover:underline"
                    >
                      <Download className="size-3" />
                      Archivo
                    </a>
                  )}
                </div>
              </div>

              <span className="truncate text-sm text-[#4B778D]">{certificate.issuer}</span>
              <span className="text-sm text-[#4B778D]">
                {new Date(certificate.date_issued).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>

              <div
                className="flex min-w-[120px] justify-end gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                {certificate.file_bonus_url && (
                  <a
                    href={certificate.file_bonus_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg border border-[#A5D7E8] px-3 py-1.5 text-xs font-semibold text-[#003A6C] hover:bg-[#EEF5F9]"
                  >
                    <Download className="size-3" />
                    Archivo
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}