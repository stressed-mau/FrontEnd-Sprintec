import { useMemo, useState, type ChangeEvent, type FormEvent, type ReactNode, type RefObject } from "react"
import { Upload, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { ExperienceFormErrors, ExperienceFormValues } from "@/hooks/useExperienceManager"

const DEGREE_OPTIONS = [
  "Bachillerato",
  "Tecnico Superior",
  "Tecnico Profesional",
  "Licenciatura",
  "Ingenieria",
  "Grado",
  "Maestria",
  "Master",
  "Doctorado",
  "Posgrado",
  "Diplomado",
  "Certificacion Profesional",
]

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
  formData: ExperienceFormValues
  errors: ExperienceFormErrors
  isSaving: boolean
  canRemoveCertificate: boolean
  educationTitleOptions?: string[]
  educationFieldOptions?: string[]
  certificateInputRef: RefObject<HTMLInputElement | null>
  onFieldChange: (field: keyof ExperienceFormValues, value: string | boolean) => void
  onBlur: (field: keyof ExperienceFormValues) => void
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
  onFieldChange,
  onBlur,
  onCertificateChange,
  onRemoveCertificate,
  onSubmit,
  onCancel,
}: EducationInlineFormProps) {
  const degreeOptions = educationTitleOptions.length ? educationTitleOptions : DEGREE_OPTIONS
  const fieldOptions = educationFieldOptions.length ? educationFieldOptions : FIELD_OPTIONS
  const fileButtonClassName =
    "inline-flex cursor-pointer items-center rounded-lg bg-[#C2DBED] px-4 py-2 text-sm font-medium text-[#003A6C] transition hover:bg-[#A5D7E8] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border border-[#A5D7E8] bg-white p-5 shadow-sm sm:p-6" noValidate>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FieldError label="Institucion academica" id="education-institution" error={errors.company} required>
          <Input
            id="education-institution"
            maxLength={100}
            value={formData.company}
            disabled={isSaving}
            onBlur={() => onBlur("company")}
            onChange={(event) => onFieldChange("company", event.target.value)}
            placeholder="Ej: Universidad Mayor de San Andres"
            aria-invalid={Boolean(errors.company)}
            className="h-10 border-gray-300 bg-white focus-visible:border-blue-500 focus-visible:ring-blue-500/30"
          />
        </FieldError>

        <FieldError label="Nivel de formacion" id="education-title" error={errors.position} required>
          <SearchableSelect
            options={degreeOptions}
            placeholder="Busca y selecciona un nivel de formacion"
            id="education-title"
            value={formData.position}
            disabled={isSaving}
            onBlur={() => onBlur("position")}
            onChange={(event) => onFieldChange("position", event.target.value)}
            aria-invalid={Boolean(errors.position)}
            className={`h-10 w-full rounded-md border bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-3 focus:ring-blue-500/30 disabled:opacity-50 ${
              errors.position ? "border-red-500 ring-3 ring-red-100" : "border-gray-300"
            }`}
          />
        </FieldError>
      </div>

      <FieldError label="Area de estudio" id="education-field" error={errors.fieldOfStudy} required>
        <SearchableSelect
          options={fieldOptions}
          placeholder="Busca y selecciona un area de estudio"
          id="education-field"
          value={formData.fieldOfStudy}
          disabled={isSaving}
          onBlur={() => onBlur("fieldOfStudy")}
          onChange={(event) => onFieldChange("fieldOfStudy", event.target.value)}
          aria-invalid={Boolean(errors.fieldOfStudy)}
          className={`h-10 w-full rounded-md border bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-3 focus:ring-blue-500/30 disabled:opacity-50 ${
            errors.fieldOfStudy ? "border-red-500 ring-3 ring-red-100" : "border-gray-300"
          }`}
        />
      </FieldError>

      <div className="space-y-2">
        <Label htmlFor="education-description" className="text-sm font-medium text-gray-700">
          Descripcion
        </Label>
        <Textarea
          id="education-description"
          value={formData.description}
          disabled={isSaving}
          rows={4}
          maxLength={300}
          onBlur={() => onBlur("description")}
          onChange={(event) => onFieldChange("description", event.target.value)}
          placeholder="Describe tu formacion academica, logros o especializaciones..."
          aria-invalid={Boolean(errors.description)}
          className="resize-none border-gray-300 bg-white focus-visible:border-blue-500 focus-visible:ring-blue-500/30"
        />
        {errors.description ? <p className="text-sm text-red-600">{errors.description}</p> : null}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FieldError label="Fecha de emision" id="education-end-date" error={errors.endDate}>
          <Input
            id="education-end-date"
            type="date"
            value={formData.endDate}
            disabled={isSaving || formData.current}
            onBlur={() => onBlur("endDate")}
            onChange={(event) => onFieldChange("endDate", event.target.value)}
            aria-invalid={Boolean(errors.endDate)}
            className="h-10 border-gray-300 bg-white focus-visible:border-blue-500 focus-visible:ring-blue-500/30"
          />
        </FieldError>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="education-current"
          type="checkbox"
          checked={formData.current}
          disabled={isSaving || Boolean(formData.endDate)}
          onChange={(event) => onFieldChange("current", event.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-[#003A6C] focus:ring-[#003A6C]"
        />
        <Label htmlFor="education-current" className="text-sm font-medium text-gray-700">
          Cursando actualmente
        </Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="education-document" className="text-sm font-medium text-gray-700">
          Documento de formacion
        </Label>
        <div className="space-y-3">
          {formData.certificate ? (
            <div className="flex w-full max-w-xl items-center gap-3 rounded-lg border border-[#D7E6F2] bg-[#EEF5F9] px-3 py-2 sm:w-fit">
              <DocumentPreview source={formData.certificate} />
              {canRemoveCertificate ? (
                <button
                  type="button"
                  onClick={onRemoveCertificate}
                  disabled={isSaving}
                  className="inline-flex h-8 shrink-0 items-center rounded-full bg-red-600 px-3 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                  aria-label="Eliminar documento"
                >
                  <X className="mr-1 h-3 w-3" />
                  Quitar
                </button>
              ) : null}
            </div>
          ) : null}
          <label className={`${fileButtonClassName} ${isSaving ? "pointer-events-none cursor-not-allowed bg-gray-300 text-gray-500" : ""}`}>
            <Upload className="mr-2 size-4" />
            Seleccionar archivo
            <input
              id="education-document"
              ref={certificateInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
              disabled={isSaving}
              onChange={onCertificateChange}
              aria-invalid={Boolean(errors.certificate)}
              className="hidden"
            />
          </label>
          <p className="text-xs text-gray-500">Formatos: JPG, JPEG, PNG y PDF. Tamano maximo: 5 MB.</p>
          {errors.certificate ? <p className="text-sm text-red-600">{errors.certificate}</p> : null}
        </div>
      </div>

      <div className="flex justify-center gap-3 pt-2">
        <Button type="submit" disabled={isSaving} className="h-10 bg-[#003A6C] text-white hover:bg-[#1a4f7a]">
          {isSaving ? "Guardando..." : "Registrar"}
        </Button>
        <Button type="button" variant="outline" disabled={isSaving} onClick={onCancel} className="h-10 border-gray-300 bg-[#F7F0E1] hover:bg-[#F7F0E1]/80">
          Cancelar
        </Button>
      </div>
    </form>
  )
}

function FieldError({
  label,
  id,
  error,
  required,
  children,
}: {
  label: string
  id: string
  error?: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label} {required ? <span aria-hidden="true">*</span> : null}
      </Label>
      {children}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  )
}

function DocumentPreview({ source }: { source: string }) {
  const isPdf = /^data:application\/pdf/i.test(source) || /\.pdf(?:[?#].*)?$/i.test(source)
  const isImage = /^data:image\//i.test(source) || /\.(?:jpe?g|png|webp|gif)(?:[?#].*)?$/i.test(source)

  if (isImage) {
    return (
      <img
        src={source}
        alt="Vista previa del documento de formacion"
        className="h-32 w-44 rounded-md border border-[#D7E6F2] bg-white object-contain"
      />
    )
  }

  if (isPdf) {
    return (
      <iframe
        src={source}
        title="Vista previa del documento de formacion"
        className="h-40 w-56 rounded-md border border-[#D7E6F2] bg-white"
      />
    )
  }

  return <span className="max-w-xs truncate text-sm text-gray-700">Documento seleccionado o ya adjunto.</span>
}

function SearchableSelect({
  id,
  value,
  disabled,
  onBlur,
  onChange,
  className,
  options,
  placeholder,
  ...rest
}: {
  id: string
  value: string
  disabled?: boolean
  onBlur?: () => void
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  className?: string
  options: string[]
  placeholder: string
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "onBlur" | "value" | "disabled" | "className">) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const filteredOptions = useMemo(() => {
    const query = value.trim().toLowerCase()
    return query ? options.filter((option) => option.toLowerCase().includes(query)) : options
  }, [options, value])

  function selectOption(option: string) {
    onChange({ target: { value: option } } as ChangeEvent<HTMLInputElement>)
    setIsOpen(false)
    setActiveIndex(0)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      setIsOpen(true)
    }

    if (!filteredOptions.length) {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
      return
    }

    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActiveIndex((current) => (current + 1) % filteredOptions.length)
      return
    }

    if (event.key === "ArrowUp") {
      event.preventDefault()
      setActiveIndex((current) => (current - 1 + filteredOptions.length) % filteredOptions.length)
      return
    }

    if (event.key === "Enter" && isOpen) {
      event.preventDefault()
      selectOption(filteredOptions[activeIndex] ?? filteredOptions[0])
      return
    }

    if (event.key === "Escape") {
      setIsOpen(false)
    }
  }

  return (
    <div className="relative">
      <Input
        id={id}
        value={value}
        disabled={disabled}
        onFocus={() => setIsOpen(true)}
        onBlur={() => {
          window.setTimeout(() => setIsOpen(false), 120)
          onBlur?.()
        }}
        onKeyDown={handleKeyDown}
        onChange={(event) => {
          onChange(event)
          setIsOpen(true)
          setActiveIndex(0)
        }}
        placeholder={placeholder}
        className={className}
        {...rest}
      />
      {isOpen ? (
        <div className="absolute z-30 mt-1 max-h-44 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-xl">
          {filteredOptions.length ? (
            filteredOptions.map((option, index) => (
              <button
                key={option}
                type="button"
                onMouseDown={(event) => {
                  event.preventDefault()
                  selectOption(option)
                }}
                onMouseEnter={() => setActiveIndex(index)}
                className={`block w-full px-3 py-2 text-left text-sm text-[#003A6C] transition-colors ${
                  index === activeIndex ? "bg-blue-50" : "hover:bg-blue-50"
                }`}
              >
                {option}
              </button>
            ))
          ) : (
            <p className="px-3 py-2 text-xs text-gray-400">No se encontro una opcion</p>
          )}
        </div>
      ) : null}
    </div>
  )
}
