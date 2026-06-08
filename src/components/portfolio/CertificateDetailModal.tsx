import { ExternalLink, FileText, X } from "lucide-react"
import { useState } from "react"

import { CertificateDocumentPreviewModal } from "@/components/certificates/CertificateDocumentPreview"
import type { ProjectModalTheme } from "@/types/projectModalTheme"
import { formatPublicPortfolioDate, getFirstText } from "@/utils/PublicPortfolioUtils"

type CertificateDetailModalProps = {
  certificate: unknown
  theme: ProjectModalTheme
  onClose: () => void
}

type CertificateRecord = Record<string, unknown>

function asRecord(value: unknown): CertificateRecord {
  return value && typeof value === "object" ? (value as CertificateRecord) : {}
}

export default function CertificateDetailModal({ certificate, theme, onClose }: CertificateDetailModalProps) {
  const [documentPreviewUrl, setDocumentPreviewUrl] = useState<string | null>(null)
  const record = asRecord(certificate)
  const title = getFirstText(record.name, record.title, record.label) || "Certificado"
  const issuer = getFirstText(record.issuer, record.institution, record.organization, record.company, record.sublabel)
  const description = getFirstText(record.description, record.descripcion)
  const issuedDate = formatPublicPortfolioDate(getFirstText(record.date_issued, record.issue_date, record.issued_at, record.emission_date))
  const expiredDate = formatPublicPortfolioDate(getFirstText(record.date_expired, record.expiration_date, record.expires_at))
  const credentialId = getFirstText(record.credential_id, record.certification_id)
  const credentialUrl = getFirstText(record.credential_url, record.verification_url)
  const documentUrl = getFirstText(record.file_bonus_url, record.file_url, record.document_url, record.certificate_url, record.file, record.document, record.attachment)

  const rows = [
    ["Emisor", issuer],
    ["Fecha de emision", issuedDate],
    ["Fecha de vencimiento", expiredDate || "Sin vencimiento"],
    ["ID de credencial", credentialId],
  ].filter(([, value]) => Boolean(value))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4" role="dialog" aria-modal="true">
      <div className={`max-h-[88vh] w-[min(100%,34rem)] overflow-y-auto rounded-2xl shadow-2xl ${theme.fontClass} ${theme.panel}`}>
        <div className={`sticky top-0 z-10 flex items-start justify-between gap-3 border-b px-4 py-4 sm:px-5 ${theme.header}`}>
          <div className="min-w-0">
            <p className={`text-xs font-bold uppercase tracking-[0.22em] ${theme.eyebrow}`}>Detalle de certificado</p>
            <h2 className={`mt-1 break-words text-xl font-bold leading-tight ${theme.title}`}>{title}</h2>
            {issuer ? <p className={`mt-1 text-sm font-semibold ${theme.role}`}>{issuer}</p> : null}
          </div>

          <button type="button" onClick={onClose} className={`shrink-0 rounded-full p-2 transition ${theme.closeButton}`} aria-label="Cerrar detalle de certificado">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-4 py-4 sm:px-5">
          {description ? (
            <section>
              <h3 className={`text-sm font-bold uppercase tracking-[0.16em] ${theme.sectionTitle}`}>Descripcion</h3>
              <p className={`mt-2 whitespace-pre-line text-sm leading-6 ${theme.text}`}>{description}</p>
            </section>
          ) : null}

          {rows.length ? (
            <dl className="grid gap-3 sm:grid-cols-[repeat(auto-fit,minmax(9rem,max-content))]">
              {rows.map(([label, value]) => (
                <div key={label} className={`min-w-0 max-w-full rounded-xl border px-3 py-2.5 ${theme.infoCard}`}>
                  <dt className={`text-xs font-bold uppercase tracking-[0.16em] ${theme.sectionTitle}`}>{label}</dt>
                  <dd className={`mt-1 break-words text-sm ${theme.text}`}>{value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          <div className="flex flex-wrap gap-3">
            {documentUrl ? (
              <button type="button" onClick={() => setDocumentPreviewUrl(documentUrl)} className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition ${theme.primaryLink}`}>
                <FileText className="h-4 w-4" />
                Ver documento
              </button>
            ) : null}

            {credentialUrl ? (
              <a href={credentialUrl} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition ${theme.secondaryLink}`}>
                <ExternalLink className="h-4 w-4" />
                Verificar
              </a>
            ) : null}
          </div>
        </div>
      </div>

      <CertificateDocumentPreviewModal url={documentPreviewUrl} onClose={() => setDocumentPreviewUrl(null)} />
    </div>
  )
}
