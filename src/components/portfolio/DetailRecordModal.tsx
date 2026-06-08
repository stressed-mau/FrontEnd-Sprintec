import { FileText, X } from "lucide-react"
import { useState } from "react"
import { CertificateDocumentPreviewModal } from "@/components/certificates/CertificateDocumentPreview"
import {
  getExperienceTitle,
  getExperienceCompany,
  getEducationTitle,
  getEducationInstitution,
  getRecordDescription,
  getRecordDocument,
  getRecordImage,
  getRecordStartDate,
  getRecordEndDate,
  getEducationField,
  isCurrentRecord,
} from "@/utils/publicPortfolioUtils"

import type { ProjectModalTheme } from "@/types/projectModalTheme"

type DetailRecordModalProps = {
  kind: "experience" | "education"
  record: unknown
  theme: ProjectModalTheme
  onClose: () => void
}

function DetailRecordModal({
  kind,
  record,
  theme,
  onClose,
}: DetailRecordModalProps) {
  const isEducation = kind === "education"
  const [documentPreviewUrl, setDocumentPreviewUrl] = useState<string | null>(null)

  const title = isEducation
    ? getEducationTitle(record)
    : getExperienceTitle(record)

  const subtitle = isEducation
    ? getEducationInstitution(record)
    : getExperienceCompany(record)

  const description = getRecordDescription(record)
  const image = getRecordImage(record)
  const documentUrl = isEducation ? getRecordDocument(record) : ""
  const panelWidthClassName = image ? "w-[min(100%,38rem)]" : "w-[min(100%,32rem)]"
  const startDate = getRecordStartDate(record)
  const endDate = getRecordEndDate(record)

  const dateText = [
    startDate,
    isCurrentRecord(record) ? "En curso" : endDate,
  ]
    .filter(Boolean)
    .join(" - ")

  const rows = [
    ["Institucion", isEducation ? subtitle : ""],
    ["Empresa", isEducation ? "" : subtitle],
    ["Campo de estudio", isEducation ? getEducationField(record) : ""],
    ["Fechas", dateText],
  ].filter(([, value]) => Boolean(value))

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`max-h-[88vh] ${panelWidthClassName} overflow-y-auto rounded-2xl shadow-2xl ${theme.fontClass} ${theme.panel}`}
      >
        <div
          className={`sticky top-0 z-10 flex items-start justify-between gap-3 border-b px-4 py-4 sm:px-5 ${theme.header}`}
        >
          <div className="min-w-0">
            <p
              className={`text-xs font-bold uppercase tracking-[0.22em] ${theme.eyebrow}`}
            >
              {isEducation
                ? "Detalle de formacion"
                : "Detalle de experiencia"}
            </p>

            <h2
              className={`mt-1 break-words text-xl font-bold leading-tight ${theme.title}`}
            >
              {title}
            </h2>

            {subtitle && (
              <p className={`mt-1 text-sm font-semibold ${theme.role}`}>
                {subtitle}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`shrink-0 rounded-full p-2 transition ${theme.closeButton}`}
            aria-label={
              isEducation
                ? "Cerrar detalle de formacion"
                : "Cerrar detalle de experiencia"
            }
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className={`grid ${image ? "md:grid-cols-[12rem_1fr]" : ""}`}>
          {image ? <RecordImage image={image} title={title} /> : null}

          <div className="space-y-4 px-4 py-4 sm:px-5">
            {description && (
              <section>
                <h3
                  className={`text-sm font-bold uppercase tracking-[0.16em] ${theme.sectionTitle}`}
                >
                  Descripcion
                </h3>

                <p
                  className={`mt-2 whitespace-pre-line text-sm leading-6 ${theme.text}`}
                >
                  {description}
                </p>
              </section>
            )}

            {rows.length > 0 && (
              <dl className="grid gap-3 sm:grid-cols-[repeat(auto-fit,minmax(9rem,max-content))]">
                {rows.map(([label, value]) => (
                  <div key={label} className={`min-w-0 max-w-full rounded-xl border px-3 py-2.5 ${theme.infoCard}`}>
                    <dt
                      className={`text-xs font-bold uppercase tracking-[0.16em] ${theme.sectionTitle}`}
                    >
                      {label}
                    </dt>

                    <dd
                      className={`mt-1 break-words text-sm ${theme.text}`}
                    >
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            {documentUrl ? (
              <section>
                <h3
                  className={`text-sm font-bold uppercase tracking-[0.16em] ${theme.sectionTitle}`}
                >
                  Documento
                </h3>

                <button
                  type="button"
                  onClick={() => setDocumentPreviewUrl(documentUrl)}
                  className={`mt-2 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition ${theme.primaryLink}`}
                >
                  <FileText className="h-4 w-4" />
                  Ver documento
                </button>
              </section>
            ) : null}
          </div>
        </div>
      </div>
      <CertificateDocumentPreviewModal
        url={documentPreviewUrl}
        onClose={() => setDocumentPreviewUrl(null)}
      />
    </div>
  )
}

function RecordImage({ image, title }: { image: string; title: string }) {
  return (
    <div className="flex h-32 items-center justify-center overflow-hidden border-b border-black/10 px-4 py-4 sm:h-40 sm:px-5 md:h-44 md:border-b-0 md:border-r">
      <img src={image} alt={title} className="max-h-full max-w-full rounded-xl object-contain" />
    </div>
  )
}

export default DetailRecordModal;
