import { ImagePlus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { ExperienceFormErrors, ExperienceFormValues } from "@/hooks/useExperienceManager"

type ExperienceFormModalProps = {
  formData: ExperienceFormValues
  errors: ExperienceFormErrors
  isEditing: boolean
  isSaving: boolean
  canRemoveImage: boolean
  fileInputRef: React.RefObject<HTMLInputElement | null>
  onClose: () => void
  onFieldChange: (field: keyof ExperienceFormValues, value: string | boolean) => void
  onBlur: (field: keyof ExperienceFormValues) => void
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveImage: () => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

export function ExperienceFormModal({
  formData,
  errors,
  isEditing,
  isSaving,
  canRemoveImage,
  fileInputRef,
  onClose,
  onFieldChange,
  onBlur,
  onImageChange,
  onRemoveImage,
  onSubmit,
}: ExperienceFormModalProps) {
  const companyLabel = formData.type === "laboral" ? "Empresa" : "Institución"
  const positionLabel = formData.type === "laboral" ? "Cargo" : "Título"
  const isLaboralExperience = formData.type === "laboral"
  const isCurrentActive = formData.current

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
              {isEditing ? "Editar experiencia" : "Nueva experiencia"}
            </h2>
            <p id="descripcion-modal-experiencia" className="mt-1 text-sm text-[#4B778D]">
              {isEditing ? "Actualiza" : "Agrega"} tu experiencia laboral o académica.
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
          <div className="space-y-2">
            <Label id="experience-type-label" htmlFor="experience-type" className="text-[#003A6C]">
              Tipo de experiencia
            </Label>
            <select
              id="experience-type"
              value={formData.type}
              disabled={isSaving || isEditing}
              onChange={(event) => onFieldChange("type", event.target.value)}
              className="h-11 w-full rounded-md border border-[#A5D7E8] bg-white px-3 text-sm text-[#003A6C] outline-none focus:ring-2 focus:ring-[#A5D7E8]"
              aria-labelledby="experience-type-label"
            >
              <option value="laboral">Experiencia laboral</option>
              <option value="academica">Experiencia académica</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label id="experience-company-label" htmlFor="experience-company" className="text-[#003A6C]">
              {companyLabel} *
            </Label>
            <Input
              id="experience-company"
              maxLength={100}
              value={formData.company}
              disabled={isSaving}
              onBlur={() => onBlur("company")}
              onChange={(event) => onFieldChange("company", event.target.value)}
              className="h-11 border-[#A5D7E8] bg-white text-[#003A6C]"
              aria-invalid={Boolean(errors.company)}
              aria-labelledby="experience-company-label"
              aria-describedby={errors.company ? "experience-company-error" : undefined}
            />
            {errors.company ? <p id="experience-company-error" className="text-sm text-red-600">{errors.company}</p> : null}
          </div>

          {isLaboralExperience ? (
            <div className="space-y-2">
              <Label id="experience-email-label" htmlFor="experience-email" className="text-[#003A6C]">
                Correo electrónico *
              </Label>
              <Input
                id="experience-email"
                type="email"
                maxLength={60}
                value={formData.email}
                disabled={isSaving}
                onBlur={() => onBlur("email")}
                onChange={(event) => onFieldChange("email", event.target.value)}
                placeholder="Ej: contacto@empresa.com"
                className="h-11 border-[#A5D7E8] bg-white text-[#003A6C]"
                aria-invalid={Boolean(errors.email)}
                aria-labelledby="experience-email-label"
                aria-describedby={errors.email ? "experience-email-error" : undefined}
              />
              {errors.email ? <p id="experience-email-error" className="text-sm text-red-600">{errors.email}</p> : null}
            </div>
          ) : null}

          <div className="space-y-2">
            <Label id="experience-position-label" htmlFor="experience-position" className="text-[#003A6C]">
              {positionLabel} *
            </Label>
            <Input
              id="experience-position"
              maxLength={80}
              value={formData.position}
              disabled={isSaving}
              onBlur={() => onBlur("position")}
              onChange={(event) => onFieldChange("position", event.target.value)}
              className="h-11 border-[#A5D7E8] bg-white text-[#003A6C]"
              aria-invalid={Boolean(errors.position)}
              aria-labelledby="experience-position-label"
              aria-describedby={errors.position ? "experience-position-error" : undefined}
            />
            {errors.position ? <p id="experience-position-error" className="text-sm text-red-600">{errors.position}</p> : null}
          </div>

          <div className="space-y-2">
            <Label id="experience-description-label" htmlFor="experience-description" className="text-[#003A6C]">
              Descripción
            </Label>
            <Textarea
              id="experience-description"
              rows={3}
              maxLength={300}
              value={formData.description}
              disabled={isSaving}
              onBlur={() => onBlur("description")}
              onChange={(event) => onFieldChange("description", event.target.value)}
              className="resize-none border-[#A5D7E8] bg-white text-[#003A6C]"
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
                Fecha de inicio
              </Label>
              <Input
                id="experience-start-date"
                type="date"
                value={formData.startDate}
                disabled={isSaving}
                onBlur={() => onBlur("startDate")}
                onChange={(event) => onFieldChange("startDate", event.target.value)}
                className="h-11 border-[#A5D7E8] bg-white text-[#003A6C]"
                aria-invalid={Boolean(errors.startDate)}
                aria-labelledby="experience-start-date-label"
                aria-describedby={errors.startDate ? "experience-start-date-error" : undefined}
              />
              {errors.startDate ? <p id="experience-start-date-error" className="text-sm text-red-600">{errors.startDate}</p> : null}
            </div>

            <div className="space-y-2">
              <Label id="experience-end-date-label" htmlFor="experience-end-date" className="text-[#003A6C]">
                Fecha de fin
              </Label>
              <Input
                id="experience-end-date"
                type="date"
                value={formData.endDate}
                disabled={isCurrentActive || isSaving}
                onBlur={() => onBlur("endDate")}
                onChange={(event) => onFieldChange("endDate", event.target.value)}
                className="h-11 border-[#A5D7E8] bg-white text-[#003A6C]"
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
              disabled={isSaving}
              onChange={(event) => onFieldChange("current", event.target.checked)}
              className="size-4 rounded border-[#A5D7E8] text-[#003A6C] focus:ring-[#A5D7E8]"
            />
            <Label id="experience-current-label" htmlFor="experience-current" className="cursor-pointer text-[#003A6C]">
              Actualmente trabajo/estudio aquí
            </Label>
          </div>

          <div className="space-y-2">
            <Label id="experience-image-label" htmlFor="experience-image" className="text-[#003A6C]">
              Logo de la empresa o institución
            </Label>

            <input
              id="experience-image"
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,image/jpeg,image/png"
              disabled={isSaving}
              onChange={onImageChange}
              className="hidden"
            />

            <div className="flex flex-wrap items-center gap-2">
              <Button
                id="boton-subir-logo"
                type="button"
                variant="outline"
                disabled={isSaving}
                onClick={() => fileInputRef.current?.click()}
                className="h-10 border-[#A5D7E8] bg-white text-[#003A6C] hover:bg-[#EEF5F9]"
              >
                <ImagePlus className="mr-2 size-4" />
                {formData.image ? "Cambiar imagen" : "Subir imagen"}
              </Button>

              {canRemoveImage ? (
                <Button
                  id="boton-eliminar-logo"
                  type="button"
                  variant="outline"
                  disabled={isSaving}
                  onClick={onRemoveImage}
                  className="h-10 border-[#F2C6C6] bg-white text-[#B42318] hover:bg-[#FFF1F1]"
                >
                  <X className="mr-2 size-4" />
                  Eliminar
                </Button>
              ) : null}
            </div>

            {formData.image ? (
              <div className="mt-2 space-y-2">
                <img src={formData.image} alt="Vista previa" className="size-24 rounded-lg object-cover shadow-sm" />
                <p className="text-xs text-[#4B778D]">
                  Puedes mantener la imagen actual, subir otra o eliminarla.
                </p>
              </div>
            ) : null}

            {errors.image ? <p className="text-sm text-red-600">{errors.image}</p> : null}
            <p className="text-xs text-[#6B7E8E]">Formatos permitidos: JPG, JPEG y PNG. Tamaño máximo: 2 MB.</p>
          </div>

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
