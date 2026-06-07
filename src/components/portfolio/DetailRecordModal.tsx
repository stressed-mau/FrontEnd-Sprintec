import { X } from "lucide-react"
import {
  getExperienceTitle,
  getExperienceCompany,
  getEducationTitle,
  getEducationInstitution,
  getRecordDescription,
  getRecordStartDate,
  getRecordEndDate,
  getEducationField,
  isCurrentRecord,
} from "@/utils/PublicPortfolioUtils"

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

  const title = isEducation
    ? getEducationTitle(record)
    : getExperienceTitle(record)

  const subtitle = isEducation
    ? getEducationInstitution(record)
    : getExperienceCompany(record)

  const description = getRecordDescription(record)
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
        className={`max-h-[88vh] w-[min(100%,38rem)] overflow-y-auto rounded-2xl shadow-2xl ${theme.fontClass} ${theme.panel}`}
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
            <dl className="grid gap-3 sm:grid-cols-2">
              {rows.map(([label, value]) => (
                <div key={label} className={`min-w-0 rounded-xl border p-4 ${theme.infoCard}`}>
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
        </div>
      </div>
    </div>
  )
}
export default DetailRecordModal;
