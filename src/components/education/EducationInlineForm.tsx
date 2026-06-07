import { type ChangeEvent, type FormEvent, type RefObject, useState } from "react"
import { Eye, Upload, X } from "lucide-react"

import { CertificateDocumentPreviewModal } from "@/components/certificates/CertificateDocumentPreview"
import { EducationDocumentPreview } from "@/components/education/EducationDocumentPreview"
import { EducationFieldError } from "@/components/education/EducationFieldError"
import { SearchableSelect } from "@/components/education/SearchableSelect"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { EducationFormErrors, EducationFormValues } from "@/types/education"

const DEGREE_OPTIONS = ["Bachillerato", "Tecnico Superior", "Tecnico Profesional", "Licenciatura", "Ingenieria", "Grado", "Maestria", "Master", "Doctorado", "Posgrado", "Diplomado", "Certificacion Profesional"]

const FIELD_OPTIONS = [
  "Ingenieria de Software",
  "Ciencias de la Computacion",
  "Ingenieria Informatica",
  "Desarrollo de Software",
  "Sistemas de Informacion",
  "Inteligencia Artificial",
  "Ciencia de Datos",
  "Ciberseguridad",
  "Redes y Telecomunicaciones",
  "Ingenieria de Sistemas",
  "Administracion de Empresas",
  "Marketing",
  "Finanzas",
  "Economia",
  "Contabilidad",
  "Recursos Humanos",
  "Diseno Grafico",
  "Diseno Industrial",
  "Arquitectura",
  "Ingenieria Civil",
  "Ingenieria Mecanica",
  "Ingenieria Electrica",
  "Ingenieria Electronica",
  "Medicina",
  "Enfermeria",
  "Psicologia",
  "Derecho",
  "Educacion",
  "Comunicacion Social",
  "Periodismo",
  "Otro",
]

type EducationInlineFormProps = {
  formData: EducationFormValues
  errors: EducationFormErrors
  isSaving: boolean
  canRemoveCertificate: boolean
  educationTitleOptions?: string[]
  educationFieldOptions?: string[]
  certificateInputRef: RefObject<HTMLInputElement | null>
  canEditEndDate?: boolean
  isEditing?: boolean
  tone?: "page" | "modal"
  onFieldChange: (field: keyof EducationFormValues, value: string | boolean) => void
  onBlur: (field: keyof EducationFormValues) => void
  onCertificateChange: (event: ChangeEvent<HTMLInputElement>) => void
  onRemoveCertificate: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onCancel: () => void
}

export function EducationInlineForm({
  formData,
  errors,
  isSaving,
  canRemoveCertificate,
  educationTitleOptions = [],
  educationFieldOptions = [],
  certificateInputRef,
  canEditEndDate = true,
  isEditing = false,
  tone = "page",
  onFieldChange,
  onBlur,
  onCertificateChange,
  onRemoveCertificate,
  onSubmit,
  onCancel,
}: EducationInlineFormProps) {
  const degreeOptions = educationTitleOptions.length ? educationTitleOptions : DEGREE_OPTIONS
  const fieldOptions = educationFieldOptions.length ? educationFieldOptions : FIELD_OPTIONS
  const isModalTone = tone === "modal"
  const inputClassName = getInputClassName(isModalTone)
  const formClassName = isModalTone ? "space-y-6 rounded-2xl bg-[#C2DBED]" : "space-y-5 rounded-2xl border border-[#A5D7E8] bg-white p-5 shadow-sm sm:p-6"
  const fileButtonClassName = "inline-flex cursor-pointer items-center rounded-lg bg-[#C2DBED] px-4 py-2 text-sm font-medium text-[#003A6C] transition hover:bg-[#A5D7E8] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
  const isEndDateDisabled = isSaving || !canEditEndDate
  const isCurrentDisabled = isSaving || tone === "modal" || Boolean(formData.endDate)
  const shouldShowCertificateField = !isEditing || Boolean(formData.certificate)

  return (
    <form onSubmit={onSubmit} className={formClassName} noValidate>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <EducationFieldError label="Institucion academica" id="education-institution" error={errors.company} required>
          <Input id="education-institution" maxLength={100} value={formData.company} disabled={isSaving} onBlur={() => onBlur("company")} onChange={(event) => onFieldChange("company", event.target.value)} placeholder="Ej: Universidad Mayor de San Andres" aria-invalid={Boolean(errors.company)} className={inputClassName(Boolean(errors.company))} />
        </EducationFieldError>

        <EducationFieldError label="Nivel de formacion" id="education-title" error={errors.position} required>
          <SearchableSelect options={degreeOptions} placeholder="Busca y selecciona un nivel de formacion" id="education-title" value={formData.position} disabled={isSaving} onBlur={() => onBlur("position")} onChange={(event) => onFieldChange("position", event.target.value)} aria-invalid={Boolean(errors.position)} className={`h-10 w-full rounded-md border bg-white px-3 text-sm outline-none transition ${getSelectFocusClassName(Boolean(errors.position), isModalTone)}`} />
        </EducationFieldError>
      </div>

      <EducationFieldError label="Area de estudio" id="education-field" error={errors.fieldOfStudy} required>
        <SearchableSelect options={fieldOptions} placeholder="Busca y selecciona un area de estudio" id="education-field" value={formData.fieldOfStudy} disabled={isSaving} onBlur={() => onBlur("fieldOfStudy")} onChange={(event) => onFieldChange("fieldOfStudy", event.target.value)} aria-invalid={Boolean(errors.fieldOfStudy)} className={`h-10 w-full rounded-md border bg-white px-3 text-sm outline-none transition ${getSelectFocusClassName(Boolean(errors.fieldOfStudy), isModalTone)}`} />
      </EducationFieldError>

      <div className="space-y-2">
        <Label htmlFor="education-description" className="text-sm font-medium text-gray-700">Descripcion</Label>
        <Textarea id="education-description" value={formData.description} disabled={isSaving} rows={4} maxLength={300} onBlur={() => onBlur("description")} onChange={(event) => onFieldChange("description", event.target.value)} placeholder="Describe tu formacion academica, logros o especializaciones..." aria-invalid={Boolean(errors.description)} className={`resize-none ${inputClassName(Boolean(errors.description))}`} />
        {errors.description ? <p className="text-sm text-red-600">{errors.description}</p> : null}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <EducationFieldError label="Fecha de emision" id="education-end-date" error={errors.endDate}>
          <Input id="education-end-date" type="date" value={formData.endDate} disabled={isEndDateDisabled} onBlur={() => onBlur("endDate")} onChange={(event) => onFieldChange("endDate", event.target.value)} aria-invalid={Boolean(errors.endDate)} className={inputClassName(Boolean(errors.endDate))} />
        </EducationFieldError>
      </div>

      <div className="flex items-center gap-2">
        <input id="education-current" name="education-current" type="checkbox" checked={formData.current} disabled={isCurrentDisabled} onChange={(event) => onFieldChange("current", event.target.checked)} className="h-4 w-4 rounded border-gray-300 text-[#003A6C] focus:ring-[#003A6C]" />
        <Label htmlFor="education-current" className="text-sm font-medium text-gray-700">Cursando actualmente</Label>
      </div>

      {shouldShowCertificateField ? (
        <div className="space-y-2">
          <Label htmlFor="education-document" className="text-sm font-medium text-gray-700">Documento de formacion</Label>
          <div className="space-y-3">
            {formData.certificate ? <EducationCertificatePreview source={formData.certificate} canRemove={!isEditing && canRemoveCertificate} isSaving={isSaving} onRemove={onRemoveCertificate} /> : null}
            {!isEditing ? (
              <label className={`${fileButtonClassName} ${isSaving ? "pointer-events-none cursor-not-allowed bg-gray-300 text-gray-500" : ""}`}>
                <Upload className="mr-2 size-4" />
                Seleccionar archivo
                <input id="education-document" ref={certificateInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" disabled={isSaving} onChange={onCertificateChange} aria-invalid={Boolean(errors.certificate)} className="hidden" />
              </label>
            ) : null}
            {!isEditing ? <p className="text-xs text-gray-500">Formatos: JPG, JPEG, PNG y PDF. Tamano maximo: 2 MB.</p> : null}
            {errors.certificate ? <p className="text-sm text-red-600">{errors.certificate}</p> : null}
          </div>
        </div>
      ) : null}

      <div className="flex justify-center gap-3 pt-2">
        <Button type="submit" disabled={isSaving} className="h-10 bg-[#003A6C] text-white hover:bg-[#1a4f7a]">{isSaving ? "Guardando..." : "Registrar"}</Button>
        <Button type="button" variant="outline" disabled={isSaving} onClick={onCancel} className={getCancelButtonClassName(isModalTone)}>Cancelar</Button>
      </div>
    </form>
  )
}

function EducationCertificatePreview({ source, canRemove, isSaving, onRemove }: { source: string; canRemove: boolean; isSaving: boolean; onRemove: () => void }) {
  const [documentPreviewUrl, setDocumentPreviewUrl] = useState<string | null>(null)

  return (
    <>
      <div className="flex w-full max-w-sm items-center gap-3 rounded-lg border border-[#D7E6F2] bg-[#EEF5F9] px-3 py-2 sm:w-fit">
        <EducationDocumentPreview source={source} />
        <div className="flex min-w-0 flex-col gap-2">
          <span className="text-xs font-medium text-[#003A6C]">Documento adjunto</span>
          <button type="button" onClick={() => setDocumentPreviewUrl(source)} className="inline-flex h-8 shrink-0 items-center rounded-full border border-[#A5D7E8] bg-white px-3 text-xs font-semibold text-[#003A6C] transition hover:bg-[#EEF5F9]">
            <Eye className="mr-1 h-3 w-3" />
            Ver
          </button>
        </div>
        {canRemove ? (
          <button type="button" onClick={onRemove} disabled={isSaving} className="inline-flex h-8 shrink-0 items-center rounded-full bg-red-600 px-3 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-50" aria-label="Eliminar documento">
            <X className="mr-1 h-3 w-3" />
            Quitar
          </button>
        ) : null}
      </div>
      <CertificateDocumentPreviewModal url={documentPreviewUrl} onClose={() => setDocumentPreviewUrl(null)} />
    </>
  )
}

function getInputClassName(isModalTone: boolean) {
  return (hasError?: boolean) =>
    hasError
      ? "border-red-500 bg-white focus-visible:border-red-500 focus-visible:ring-red-200"
      : isModalTone
        ? "border-gray-300 bg-white focus-visible:border-blue-500 focus-visible:ring-blue-500/30"
        : "border-[#A5D7E8] bg-white focus-visible:border-[#003A6C] focus-visible:ring-[#A5D7E8]"
}

function getSelectFocusClassName(hasError: boolean, isModalTone: boolean) {
  if (hasError) return "border-red-500 ring-3 ring-red-100 focus:border-red-500 focus:ring-red-200 disabled:opacity-50"
  return isModalTone ? "border-gray-300 focus:border-blue-500 focus:ring-3 focus:ring-blue-500/30 disabled:opacity-50" : "border-[#A5D7E8] focus:border-[#003A6C] focus:ring-3 focus:ring-[#A5D7E8] disabled:opacity-50"
}

function getCancelButtonClassName(isModalTone: boolean) {
  return isModalTone ? "h-10 border-[#A5D7E8] bg-white text-[#003A6C] hover:bg-[#EEF5F9]" : "h-10 border-gray-300 bg-[#F7F0E1] hover:bg-[#F7F0E1]/80"
}
