import { FileText, ImagePlus, X } from "lucide-react"
import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { ExperienceFormErrors, ExperienceFormValues } from "@/hooks/useExperienceManager"

const POSITION_OPTIONS = [
  "Desarrollador Frontend",
  "Desarrollador Backend",
  "Desarrollador Full Stack",
  "Desarrollador Mobile",
  "Ingeniero de Software",
  "Arquitecto de Software",
  "Tech Lead",
  "Líder Técnico",
  "Gerente de Proyecto",
  "Product Manager",
  "Scrum Master",
  "DevOps Engineer",
  "Data Scientist",
  "Data Analyst",
  "Ingeniero de Datos",
  "Ingeniero de Machine Learning",
  "QA Engineer",
  "QA Tester",
  "Disenador UI/UX",
  "Disenador de Producto",
  "Analista de Sistemas",
  "Consultor IT",
  "Administrador de Sistemas",
  "Administrador de Redes",
  "Especialista en Ciberseguridad",
  "Soporte Técnico",
  "CTO",
  "Director de Tecnología",
  "VP de Ingeniería",
  "Otro",
]

const DEGREE_OPTIONS = [
  "Bachillerato",
  "Técnico Superior",
  "Técnico Profesional",
  "Licenciatura",
  "Ingeniería",
  "Grado",
  "Maestria",
  "Master",
  "Doctorado",
  "Posgrado",
  "Diplomado",
  "Certificacion Profesional",
]

const FIELD_OPTIONS = [
  "Ingeniería de Software",
  "Ciencias de la Computación",
  "Ingeniería Informática",
  "Desarrollo de Software",
  "Sistemas de Información",
  "Inteligencia Artificial",
  "Ciencia de Datos",
  "Ciberseguridad",
  "Redes y Telecomunicaciones",
  "Ingeniería de Sistemas",
  "Administracion de Empresas",
  "Marketing",
  "Finanzas",
  "Economia",
  "Contabilidad",
  "Recursos Humanos",
  "Diseno Grafico",
  "Diseno Industrial",
  "Arquitectura",
  "Ingeniería Civil",
  "Ingeniería Mecánica",
  "Ingeniería Eléctrica",
  "Ingeniería Electrónica",
  "Medicina",
  "Enfermeria",
  "Psicologia",
  "Derecho",
  "Educacion",
  "Comunicacion Social",
  "Periodismo",
  "Otro",
]

type ExperienceFormModalProps = {
  formData: ExperienceFormValues
  errors: ExperienceFormErrors
  isEditing: boolean
  isSaving: boolean
  canRemoveImage: boolean
  canRemoveCertificate: boolean
  originalEditingValues?: ExperienceFormValues | null
  workRoleOptions?: string[]
  educationTitleOptions?: string[]
  educationFieldOptions?: string[]
  hideTypeField?: boolean
  fileInputRef: React.RefObject<HTMLInputElement | null>
  certificateInputRef: React.RefObject<HTMLInputElement | null>
  onClose: () => void
  onFieldChange: (field: keyof ExperienceFormValues, value: string | boolean) => void
  onBlur: (field: keyof ExperienceFormValues) => void
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onCertificateChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveImage: () => void
  onRemoveCertificate: () => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

export function ExperienceFormModal({
  formData,
  errors,
  isEditing,
  isSaving,
  canRemoveImage,
  canRemoveCertificate,
  originalEditingValues,
  workRoleOptions = [],
  educationTitleOptions = [],
  educationFieldOptions = [],
  hideTypeField = false,
  fileInputRef,
  certificateInputRef,
  onClose,
  onFieldChange,
  onBlur,
  onImageChange,
  onCertificateChange,
  onRemoveImage,
  onRemoveCertificate,
  onSubmit,
}: ExperienceFormModalProps) {
  const companyLabel = formData.type === "laboral" ? "Empresa" : "Institución académica"
  const positionLabel = formData.type === "laboral" ? "Cargo" : "Nivel de formación"
  const isLaboralExperience = formData.type === "laboral"
  const isLaboralUpdate = isEditing && isLaboralExperience
  const isAcademicUpdate = isEditing && !isLaboralExperience
  const isLimitedUpdate = isLaboralUpdate || isAcademicUpdate
  const isLaboralUpdateWithEndDate = isLaboralUpdate && !originalEditingValues?.current
  const isCurrentActive = formData.current
  const disabledControlClassName =
    "disabled:cursor-not-allowed disabled:border-[#D7E6F2] disabled:bg-[#EEF5F9] disabled:text-[#7F97AB] disabled:opacity-100"
  const disabledButtonClassName = "disabled:cursor-not-allowed disabled:border-[#D7E6F2] disabled:bg-[#EEF5F9] disabled:text-[#7F97AB] disabled:opacity-100"
  const editingTitle = isLaboralExperience ? "Editar Experiencia Laboral" : "Editar Formación Académica"
  const createTitle = isLaboralExperience ? "Nueva Experiencia Laboral" : "Nueva Formación Académica"
  const degreeOptions = educationTitleOptions.length ? educationTitleOptions : DEGREE_OPTIONS
  const fieldOptions = educationFieldOptions.length ? educationFieldOptions : FIELD_OPTIONS
  const roleOptions = workRoleOptions.length ? workRoleOptions : POSITION_OPTIONS
  const positionOptions = isLaboralExperience ? roleOptions : degreeOptions
  const resolvedPositionOptions =
    formData.position && !positionOptions.includes(formData.position)
      ? [formData.position, ...positionOptions]
      : positionOptions
  const resolvedFieldOptions =
    formData.fieldOfStudy && !fieldOptions.includes(formData.fieldOfStudy)
      ? [formData.fieldOfStudy, ...fieldOptions]
      : fieldOptions
  const wasEmptyOriginally = (field: keyof ExperienceFormValues) => {
    if (!isEditing || !originalEditingValues) {
      return false
    }

    const originalValue = originalEditingValues[field]
    return typeof originalValue === "string" && !originalValue.trim()
  }
  const isLocationDisabled = isSaving || isLaboralUpdateWithEndDate || wasEmptyOriginally("location")
  const isDescriptionDisabled = isSaving || isLaboralUpdateWithEndDate || (isLaboralExperience && wasEmptyOriginally("description"))
  const isEndDateDisabled = isSaving || isLaboralUpdateWithEndDate
  const isCurrentDisabled = isSaving || isEditing
  const isImageDisabled = isSaving || isLaboralUpdate || wasEmptyOriginally("image")
  const isCertificateDisabled = isSaving || isAcademicUpdate || wasEmptyOriginally("certificate")
  const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60_000).toISOString().slice(0, 10)

  return (
    <div
      id="fondo-modal-experiencia"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-3 backdrop-blur-sm sm:items-center sm:px-4"
    >
      <div
        id="contenedor-modal-experiencia"
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-[#6DACBF] bg-[#C2DBED] shadow-2xl sm:rounded-3xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#D7E6F2] px-5 py-5 sm:px-6">
          <div>
            <h2 id="titulo-modal-experiencia" className="text-2xl font-bold text-[#003A6C]">
              {isEditing ? editingTitle : createTitle}
            </h2>
            <p id="descripcion-modal-experiencia" className="mt-1 text-sm text-[#4B778D]">
              {isEditing ? "Actualiza" : "Agrega"} tu {isLaboralExperience ? "Experiencia Laboral" : "Formación Académica"}.
            </p>
          </div>

          <button
            id="boton-cerrar-modal-experiencia"
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-[#003A6C] transition hover:bg-[#EEF5F9]"
            aria-label="Cerrar formulario de experiencia"
          >
            <X className="size-5" />
          </button>
        </div>

        <form id="formulario-experiencia" noValidate onSubmit={onSubmit} className="space-y-4 px-5 py-5 sm:px-6 sm:py-6">
          {!isEditing && !hideTypeField ? (
            <div className="space-y-2">
              <Label id="experience-type-label" htmlFor="experience-type" className="text-[#003A6C]">
                Tipo de experiencia <span aria-hidden="true">*</span>
              </Label>
              <select
                id="experience-type"
                value={formData.type}
                disabled={isSaving}
                onChange={(event) => onFieldChange("type", event.target.value)}
                className={`h-11 w-full rounded-md border border-[#A5D7E8] bg-white px-3 text-sm text-[#003A6C] outline-none focus:ring-2 focus:ring-[#A5D7E8] ${disabledControlClassName}`}
                aria-labelledby="experience-type-label"
              >
                <option value="laboral">Experiencia Laboral</option>
                <option value="academica">Formación Académica</option>
              </select>
            </div>
          ) : null}

          <div className="space-y-2">
            <Label id="experience-company-label" htmlFor="experience-company" className="text-[#003A6C]">
              {companyLabel} <span aria-hidden="true">*</span>
            </Label>
            <Input
              id="experience-company"
              maxLength={100}
              value={formData.company}
              disabled={isSaving || isLimitedUpdate}
              onBlur={() => onBlur("company")}
              onChange={(event) => onFieldChange("company", event.target.value)}
              className={`h-11 border-[#A5D7E8] bg-white text-[#003A6C] ${disabledControlClassName}`}
              aria-invalid={Boolean(errors.company)}
              aria-labelledby="experience-company-label"
              aria-describedby={errors.company ? "experience-company-error" : undefined}
            />
            {errors.company ? <p id="experience-company-error" className="text-sm text-red-600">{errors.company}</p> : null}
          </div>

          {isLaboralExperience ? (
            <div className="space-y-2">
              <Label id="experience-email-label" htmlFor="experience-email" className="text-[#003A6C]">
                Correo electrónico de la empresa <span aria-hidden="true">*</span>
              </Label>
              <Input
                id="experience-email"
                type="email"
                maxLength={60}
                value={formData.email}
                disabled={isSaving || isLaboralUpdate}
                onBlur={() => onBlur("email")}
                onChange={(event) => onFieldChange("email", event.target.value)}
                placeholder="Ej: contacto@empresa.com"
                className={`h-11 border-[#A5D7E8] bg-white text-[#003A6C] ${disabledControlClassName}`}
                aria-invalid={Boolean(errors.email)}
                aria-labelledby="experience-email-label"
                aria-describedby={errors.email ? "experience-email-error" : undefined}
              />
              {errors.email ? <p id="experience-email-error" className="text-sm text-red-600">{errors.email}</p> : null}
            </div>
          ) : null}

          {isLaboralExperience ? (
            <div className="space-y-2">
              <Label id="experience-location-label" htmlFor="experience-location" className="text-[#003A6C]">
                Ubicación
              </Label>
              <Input
                id="experience-location"
                maxLength={100}
                value={formData.location}
                disabled={isLocationDisabled}
                onBlur={() => onBlur("location")}
                onChange={(event) => onFieldChange("location", event.target.value)}
                placeholder="Ej: La Paz, Bolivia / Remoto"
                className={`h-11 border-[#A5D7E8] bg-white text-[#003A6C] ${disabledControlClassName}`}
                aria-invalid={Boolean(errors.location)}
                aria-labelledby="experience-location-label"
                aria-describedby={errors.location ? "experience-location-error" : undefined}
              />
              {errors.location ? <p id="experience-location-error" className="text-sm text-red-600">{errors.location}</p> : null}
            </div>
          ) : null}

          <div className="space-y-2">
            <Label id="experience-position-label" htmlFor="experience-position" className="text-[#003A6C]">
              {positionLabel} <span aria-hidden="true">*</span>
            </Label>
            <SearchableSelect
              isSearchable
              options={resolvedPositionOptions}
              placeholder={isLaboralExperience ? "Busca y selecciona un cargo" : "Busca y selecciona un nivel de formación"}
              id="experience-position"
              value={formData.position}
              disabled={isSaving || isLimitedUpdate}
              onBlur={() => onBlur("position")}
              onChange={(event) => onFieldChange("position", event.target.value)}
              className={`h-11 w-full rounded-md border border-[#A5D7E8] bg-white px-3 text-sm text-[#003A6C] outline-none focus:ring-2 focus:ring-[#A5D7E8] ${disabledControlClassName}`}
              aria-invalid={Boolean(errors.position)}
              aria-labelledby="experience-position-label"
              aria-describedby={errors.position ? "experience-position-error" : undefined}
            >
              <option value="">{isLaboralExperience ? "Selecciona un cargo" : "Selecciona un nivel de formación"}</option>
              {resolvedPositionOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </SearchableSelect>
            {errors.position ? <p id="experience-position-error" className="text-sm text-red-600">{errors.position}</p> : null}
          </div>

          {!isLaboralExperience ? (
            <div className="space-y-2">
              <Label id="experience-field-label" htmlFor="experience-field" className="text-[#003A6C]">
                Área de estudio <span aria-hidden="true">*</span>
              </Label>
              <SearchableSelect
                isSearchable
                options={resolvedFieldOptions}
                placeholder="Busca y selecciona un área de estudio"
                id="experience-field"
                value={formData.fieldOfStudy}
                disabled={isSaving || isAcademicUpdate || wasEmptyOriginally("fieldOfStudy")}
                onBlur={() => onBlur("fieldOfStudy")}
                onChange={(event) => onFieldChange("fieldOfStudy", event.target.value)}
                className={`h-11 w-full rounded-md border border-[#A5D7E8] bg-white px-3 text-sm text-[#003A6C] outline-none focus:ring-2 focus:ring-[#A5D7E8] ${disabledControlClassName}`}
                aria-invalid={Boolean(errors.fieldOfStudy)}
                aria-labelledby="experience-field-label"
                aria-describedby={errors.fieldOfStudy ? "experience-field-error" : undefined}
              >
                <option value="">Selecciona un área de estudio</option>
                {resolvedFieldOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </SearchableSelect>
              {errors.fieldOfStudy ? <p id="experience-field-error" className="text-sm text-red-600">{errors.fieldOfStudy}</p> : null}
            </div>
          ) : null}

          <div className="space-y-2">
            <Label id="experience-description-label" htmlFor="experience-description" className="text-[#003A6C]">
              Descripción
            </Label>
            <Textarea
              id="experience-description"
              rows={3}
              maxLength={300}
              value={formData.description}
              disabled={isDescriptionDisabled}
              onBlur={() => onBlur("description")}
              onChange={(event) => onFieldChange("description", event.target.value)}
              className={`resize-none border-[#A5D7E8] bg-white text-[#003A6C] ${disabledControlClassName}`}
              aria-invalid={Boolean(errors.description)}
              aria-labelledby="experience-description-label"
              aria-describedby={errors.description ? "experience-description-error" : undefined}
            />
            {errors.description ? (
              <p id="experience-description-error" className="text-sm text-red-600">{errors.description}</p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label id="experience-start-date-label" htmlFor="experience-start-date" className="text-[#003A6C]">
                Fecha de inicio <span aria-hidden="true">*</span>
              </Label>
              <Input
                id="experience-start-date"
                type="date"
                value={formData.startDate}
                disabled={isSaving || isLimitedUpdate}
                max={today}
                onBlur={() => onBlur("startDate")}
                onChange={(event) => onFieldChange("startDate", event.target.value)}
                className={`h-11 border-[#A5D7E8] bg-white text-[#003A6C] ${disabledControlClassName}`}
                aria-invalid={Boolean(errors.startDate)}
                aria-labelledby="experience-start-date-label"
                aria-describedby={errors.startDate ? "experience-start-date-error" : undefined}
              />
              {errors.startDate ? <p id="experience-start-date-error" className="text-sm text-red-600">{errors.startDate}</p> : null}
            </div>

            <div className="space-y-2">
              <Label id="experience-end-date-label" htmlFor="experience-end-date" className="text-[#003A6C]">
                Fecha de finalización {!isCurrentActive ? <span aria-hidden="true">*</span> : null}
              </Label>
              <Input
                id="experience-end-date"
                type="date"
                value={formData.endDate}
                disabled={isEndDateDisabled}
                max={today}
                onBlur={() => onBlur("endDate")}
                onChange={(event) => onFieldChange("endDate", event.target.value)}
                className={`h-11 border-[#A5D7E8] bg-white text-[#003A6C] ${disabledControlClassName}`}
                aria-invalid={Boolean(errors.endDate)}
                aria-labelledby="experience-end-date-label"
                aria-describedby={errors.endDate ? "experience-end-date-error" : undefined}
              />
              {errors.endDate ? <p id="experience-end-date-error" className="text-sm text-red-600">{errors.endDate}</p> : null}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="experience-current"
              type="checkbox"
              checked={formData.current}
              disabled={isCurrentDisabled}
              onChange={(event) => onFieldChange("current", event.target.checked)}
              className={`size-4 rounded border-[#A5D7E8] text-[#003A6C] focus:ring-[#A5D7E8] ${disabledControlClassName}`}
            />
            <Label id="experience-current-label" htmlFor="experience-current" className="cursor-pointer text-[#003A6C]">
              {isLaboralExperience ? "Trabajo actual" : "Actualmente estudio aquí"}
            </Label>
          </div>

          {isLaboralExperience && !isEditing ? (
            <div className="space-y-2">
              <Label id="experience-image-label" htmlFor="experience-image" className="text-[#003A6C]">
                Logo de la empresa
              </Label>

              <input
                id="experience-image"
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                disabled={isImageDisabled}
                onChange={onImageChange}
                className="hidden"
              />

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  id="boton-subir-logo"
                  type="button"
                  variant="outline"
                  disabled={isImageDisabled}
                  onClick={() => fileInputRef.current?.click()}
                  className={`h-10 border-[#A5D7E8] bg-[#C2DBED] text-[#003A6C] hover:bg-[#A5D7E8] ${disabledButtonClassName}`}
                >
                  <ImagePlus className="mr-2 size-4" />
                  {formData.image ? "Cambiar imagen" : "Subir imagen"}
                </Button>

              </div>

              {formData.image ? (
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <img src={formData.image} alt="Vista previa" className="size-20 rounded-lg object-cover shadow-sm" />
                  {canRemoveImage ? (
                    <Button
                      id="boton-eliminar-logo"
                      type="button"
                      variant="outline"
                      disabled={isImageDisabled}
                      onClick={onRemoveImage}
                      className="h-10 border-[#F2C6C6] bg-white text-[#B42318] hover:bg-[#FFF1F1]"
                    >
                      <X className="mr-2 size-4" />
                      Eliminar
                    </Button>
                  ) : null}
                </div>
              ) : null}

              {errors.image ? <p className="text-sm text-red-600">{errors.image}</p> : null}
              <p className="text-xs text-[#6B7E8E]">Formatos permitidos: JPG, JPEG y PNG. Tamaño máximo: 2 MB.</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Label id="experience-certificate-label" htmlFor="experience-certificate" className="text-[#003A6C]">
                Documento de formación
              </Label>

              <input
                id="experience-certificate"
                ref={certificateInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
                disabled={isCertificateDisabled}
                onChange={onCertificateChange}
                className="hidden"
              />

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  id="boton-subir-certificado"
                  type="button"
                  variant="outline"
                  disabled={isCertificateDisabled}
                  onClick={() => certificateInputRef.current?.click()}
                  className={`h-10 border-[#A5D7E8] bg-[#C2DBED] text-[#003A6C] hover:bg-[#A5D7E8] ${disabledButtonClassName}`}
                >
                  <FileText className="mr-2 size-4" />
                  {formData.certificate ? "Cambiar documento" : "Subir documento"}
                </Button>

              </div>

              {formData.certificate ? (
                <div className="flex w-fit max-w-full flex-wrap items-center gap-3 rounded-lg border border-[#D7E6F2] bg-[#EEF5F9] px-3 py-2">
                  <span className="max-w-xs truncate text-xs text-[#4B778D]">Documento seleccionado o ya adjunto.</span>
                  {canRemoveCertificate ? (
                    <Button
                      id="boton-eliminar-certificado"
                      type="button"
                      variant="outline"
                      disabled={isCertificateDisabled}
                      onClick={onRemoveCertificate}
                      className="h-9 border-[#F2C6C6] bg-white text-[#B42318] hover:bg-[#FFF1F1]"
                    >
                      <X className="mr-2 size-4" />
                      Eliminar
                    </Button>
                  ) : null}
                </div>
              ) : null}

              {errors.certificate ? <p className="text-sm text-red-600">{errors.certificate}</p> : null}
              <p className="text-xs text-[#6B7E8E]">Formatos permitidos: JPG, JPEG, PNG y PDF. Tamaño máximo: 2 MB.</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button id="boton-guardar-experiencia" type="submit" disabled={isSaving} className="h-11 bg-[#003A6C] text-white hover:bg-[#1a4f7a]">
              {isSaving ? "Guardando..." : "Guardar"}
            </Button>
            <Button
              id="boton-cancelar-experiencia"
              type="button"
              variant="outline"
              disabled={isSaving}
              onClick={onClose}
              className="h-11 border-[#A5D7E8] bg-white text-[#003A6C] hover:bg-[#EEF5F9]"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
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
  isSearchable,
  children,
  ...rest
}: {
  id: string
  value: string
  disabled?: boolean
  onBlur?: () => void
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  className?: string
  options: string[]
  placeholder: string
  isSearchable: boolean
  children?: React.ReactNode
} & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange" | "onBlur" | "value" | "disabled" | "className">) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const filteredOptions = useMemo(() => {
    const query = value.trim().toLowerCase()

    if (!query) {
      return options
    }

    return options.filter((option) => option.toLowerCase().includes(query))
  }, [options, value])

  if (!isSearchable) {
    return (
      <select
        id={id}
        value={value}
        disabled={disabled}
        onBlur={onBlur}
        onChange={onChange}
        className={className}
        {...rest}
      >
        {children}
      </select>
    )
  }

  function selectOption(option: string) {
    onChange({ target: { value: option } } as React.ChangeEvent<HTMLInputElement>)
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
        aria-invalid={rest["aria-invalid"]}
        aria-labelledby={rest["aria-labelledby"]}
        aria-describedby={rest["aria-describedby"]}
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
            <p className="px-3 py-2 text-xs text-gray-400">No se encontrá una opción</p>
          )}
        </div>
      ) : null}
    </div>
  )
}
