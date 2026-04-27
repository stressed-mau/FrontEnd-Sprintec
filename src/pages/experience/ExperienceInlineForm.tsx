import type { ChangeEvent, FormEvent, ReactNode, RefObject } from "react"
import { Award, Plus, Upload, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
  "Lider Tecnico",
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
  "Soporte Tecnico",
  "CTO",
  "Director de Tecnologia",
  "VP de Ingenieria",
  "Otro",
]

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

type ExperienceInlineFormProps = {
  mode: "experience" | "education"
  formData: ExperienceFormValues
  errors: ExperienceFormErrors
  isSaving: boolean
  canRemoveImage: boolean
  canRemoveCertificate: boolean
  fileInputRef: RefObject<HTMLInputElement | null>
  certificateInputRef: RefObject<HTMLInputElement | null>
  onFieldChange: (field: keyof ExperienceFormValues, value: string | boolean) => void
  onBlur: (field: keyof ExperienceFormValues) => void
  onImageChange: (event: ChangeEvent<HTMLInputElement>) => void
  onCertificateChange: (event: ChangeEvent<HTMLInputElement>) => void
  onRemoveImage: () => void
  onRemoveCertificate: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onCancel: () => void
}

export function ExperienceInlineForm({
  mode,
  formData,
  errors,
  isSaving,
  canRemoveImage,
  canRemoveCertificate,
  fileInputRef,
  certificateInputRef,
  onFieldChange,
  onBlur,
  onImageChange,
  onCertificateChange,
  onRemoveImage,
  onRemoveCertificate,
  onSubmit,
  onCancel,
}: ExperienceInlineFormProps) {
  const isEducation = mode === "education"
  const companyLabel = isEducation ? "Institucion" : "Empresa"
  const positionLabel = isEducation ? "Titulo" : "Cargo"
  const currentLabel = isEducation ? "Cursando actualmente" : "Trabajo actual"
  const submitLabel = isEducation ? "Agregar formacion" : "Agregar experiencia"
  const descriptionPlaceholder = isEducation
    ? "Describe tu experiencia academica, logros, especializaciones..."
    : "Describe tus responsabilidades y logros..."

  return (
    <Card className="overflow-hidden rounded-xl border border-gray-200 bg-white py-0 shadow-sm">
      <CardContent className="p-6">
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FieldError label={companyLabel} id="company" error={errors.company} required>
              <Input
                id="company"
                value={formData.company}
                disabled={isSaving}
                onBlur={() => onBlur("company")}
                onChange={(event) => onFieldChange("company", event.target.value)}
                placeholder={isEducation ? "Ej: Universidad Mayor de San Andres" : "Ej: Google, Microsoft, Startup XYZ"}
                aria-invalid={Boolean(errors.company)}
                className="h-10 border-gray-300 bg-white focus-visible:border-blue-500 focus-visible:ring-blue-500/30"
              />
            </FieldError>

            <FieldError label={positionLabel} id="position" error={errors.position} required>
              <select
                id="position"
                value={formData.position}
                disabled={isSaving}
                onBlur={() => onBlur("position")}
                onChange={(event) => onFieldChange("position", event.target.value)}
                aria-invalid={Boolean(errors.position)}
                className={`h-10 w-full rounded-md border bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-3 focus:ring-blue-500/30 disabled:opacity-50 ${
                  errors.position ? "border-red-500 ring-3 ring-red-100" : "border-gray-300"
                }`}
              >
                <option value="">{isEducation ? "Selecciona un titulo" : "Selecciona un cargo"}</option>
                {(isEducation ? DEGREE_OPTIONS : POSITION_OPTIONS).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </FieldError>
          </div>

          {isEducation ? (
            <FieldError label="Campo de estudio" id="field" error={errors.fieldOfStudy} required>
              <select
                id="field"
                value={formData.fieldOfStudy}
                disabled={isSaving}
                onBlur={() => onBlur("fieldOfStudy")}
                onChange={(event) => onFieldChange("fieldOfStudy", event.target.value)}
                aria-invalid={Boolean(errors.fieldOfStudy)}
                className={`h-10 w-full rounded-md border bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-3 focus:ring-blue-500/30 disabled:opacity-50 ${
                  errors.fieldOfStudy ? "border-red-500 ring-3 ring-red-100" : "border-gray-300"
                }`}
              >
                <option value="">Selecciona un campo de estudio</option>
                {FIELD_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </FieldError>
          ) : null}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {!isEducation ? (
              <div className="space-y-2">
                <Label htmlFor="logo" className="text-sm font-medium text-gray-700">
                  Logo de la empresa
                </Label>
                <div className="space-y-3">
                  {formData.image ? (
                    <div className="relative mx-auto h-24 w-24">
                      <img
                        src={formData.image}
                        alt="Vista previa"
                        className="h-24 w-24 rounded-lg border border-gray-300 bg-white object-contain p-2"
                      />
                      {canRemoveImage ? (
                        <button
                          type="button"
                          onClick={onRemoveImage}
                          disabled={isSaving}
                          className="absolute right-0 top-0 rounded-full bg-red-600 p-1 text-white transition hover:bg-red-700 disabled:opacity-50"
                          aria-label="Eliminar imagen"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      ) : null}
                    </div>
                  ) : (
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                      <Upload className="h-8 w-8 text-gray-400" />
                    </div>
                  )}

                  <Input
                    id="logo"
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                    disabled={isSaving}
                    onChange={onImageChange}
                    aria-invalid={Boolean(errors.image)}
                    className="border-gray-300 bg-white focus-visible:border-blue-500 focus-visible:ring-blue-500/30"
                  />
                  <p className="text-xs text-gray-500">JPG, PNG, JPEG (max. 2MB)</p>
                  {errors.image ? <p className="text-sm text-red-600">{errors.image}</p> : null}
                </div>
              </div>
            ) : null}

            <div className={`space-y-2 ${isEducation ? "md:col-span-3" : "md:col-span-2"}`}>
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Descripcion
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                disabled={isSaving}
                rows={4}
                maxLength={300}
                onBlur={() => onBlur("description")}
                onChange={(event) => onFieldChange("description", event.target.value)}
                placeholder={descriptionPlaceholder}
                aria-invalid={Boolean(errors.description)}
                className="resize-none border-gray-300 bg-white focus-visible:border-blue-500 focus-visible:ring-blue-500/30"
              />
              {errors.description ? <p className="text-sm text-red-600">{errors.description}</p> : null}
            </div>
          </div>

          {!isEducation ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FieldError label="Ubicacion" id="location" error={errors.location}>
                <Input
                  id="location"
                  value={formData.location}
                  disabled={isSaving}
                  onBlur={() => onBlur("location")}
                  onChange={(event) => onFieldChange("location", event.target.value)}
                  placeholder="Ej: Madrid, Espana / Remoto"
                  aria-invalid={Boolean(errors.location)}
                  className="h-10 border-gray-300 bg-white focus-visible:border-blue-500 focus-visible:ring-blue-500/30"
                />
              </FieldError>

              <FieldError label="Correo electronico de la empresa" id="email" error={errors.email}>
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled={isSaving}
                onBlur={() => onBlur("email")}
                onChange={(event) => onFieldChange("email", event.target.value)}
                placeholder="Ej: contacto@empresa.com"
                aria-invalid={Boolean(errors.email)}
                className="h-10 border-gray-300 bg-white focus-visible:border-blue-500 focus-visible:ring-blue-500/30"
              />
              </FieldError>
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FieldError label="Fecha de inicio" id="startDate" error={errors.startDate} required>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                disabled={isSaving}
                onBlur={() => onBlur("startDate")}
                onChange={(event) => onFieldChange("startDate", event.target.value)}
                aria-invalid={Boolean(errors.startDate)}
                className="h-10 border-gray-300 bg-white focus-visible:border-blue-500 focus-visible:ring-blue-500/30"
              />
            </FieldError>

            <FieldError label="Fecha de finalizacion" id="endDate" error={errors.endDate}>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                disabled={formData.current || isSaving}
                onBlur={() => onBlur("endDate")}
                onChange={(event) => onFieldChange("endDate", event.target.value)}
                aria-invalid={Boolean(errors.endDate)}
                className="h-10 border-gray-300 bg-white focus-visible:border-blue-500 focus-visible:ring-blue-500/30"
              />
            </FieldError>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="current"
              type="checkbox"
              checked={formData.current}
              disabled={isSaving}
              onChange={(event) => onFieldChange("current", event.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-[#003A6C] focus:ring-[#003A6C]"
            />
            <Label htmlFor="current" className="text-sm font-medium text-gray-700">
              {currentLabel}
            </Label>
          </div>

          {isEducation ? (
            <div className="space-y-2">
              <Label htmlFor="document" className="text-sm font-medium text-gray-700">
                Documento de formacion
              </Label>
              <div className="space-y-3">
                {formData.certificate ? (
                  <div className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                    <span className="truncate text-sm text-gray-700">
                      {formData.certificate.includes("application/pdf") ? "Certificado PDF seleccionado" : "Certificado seleccionado"}
                    </span>
                    {canRemoveCertificate ? (
                      <button
                        type="button"
                        onClick={onRemoveCertificate}
                        disabled={isSaving}
                        className="rounded-full bg-red-600 p-1 text-white transition hover:bg-red-700 disabled:opacity-50"
                        aria-label="Eliminar certificado"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    ) : null}
                  </div>
                ) : null}
                <Input
                  id="document"
                  ref={certificateInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                  disabled={isSaving}
                  onChange={onCertificateChange}
                  aria-invalid={Boolean(errors.certificate)}
                  className="border-gray-300 bg-white focus-visible:border-blue-500 focus-visible:ring-blue-500/30"
                />
                <p className="text-xs text-gray-500">Formatos: JPG, PNG, PDF. Tamano maximo: 5MB</p>
                {errors.certificate ? <p className="text-sm text-red-600">{errors.certificate}</p> : null}
              </div>
            </div>
          ) : null}

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isSaving} className="h-10 bg-[#003A6C] text-white hover:bg-[#1a4f7a]">
              {isEducation ? <Award className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
              {isSaving ? "Guardando..." : submitLabel}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isSaving}
              onClick={onCancel}
              className="h-10 border-gray-300 bg-white hover:bg-gray-50"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
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
