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
  fileInputRef,
  onClose,
  onFieldChange,
  onBlur,
  onImageChange,
  onRemoveImage,
  onSubmit,
}: ExperienceFormModalProps) {
  return (
    <div
      id="fondo-modal-experiencia"
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#003A6C]/45 px-3 sm:items-center sm:px-4"
    >
      <div
        id="contenedor-modal-experiencia"
        className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl border border-[#A5D7E8] bg-white shadow-2xl sm:rounded-3xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#D7E6F2] px-5 py-5 sm:px-6">
          <div>
            <h2 id="titulo-modal-experiencia" className="text-2xl font-bold text-[#003A6C]">
              {isEditing ? "Editar experiencia" : "Nueva experiencia"}
            </h2>
            <p id="descripcion-modal-experiencia" className="mt-1 text-sm text-[#4B778D]">
              Completa los campos para registrar una experiencia laboral o académica.
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

        <form id="formulario-experiencia" noValidate onSubmit={onSubmit} className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label id="experience-type-label" htmlFor="experience-type" className="text-[#003A6C]">
                Tipo de experiencia
              </Label>
              <select
                id="experience-type"
                value={formData.type}
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
                Empresa o institución
              </Label>
              <Input
                id="experience-company"
                maxLength={100}
                value={formData.company}
                onBlur={() => onBlur("company")}
                onChange={(event) => onFieldChange("company", event.target.value)}
                placeholder="Ej: Empresa ABC o Universidad XYZ"
                className="h-11 border-[#A5D7E8] bg-white text-[#003A6C] placeholder:text-[#7B98AF]"
                aria-invalid={Boolean(errors.company)}
                aria-labelledby="experience-company-label"
                aria-describedby={errors.company ? "experience-company-error" : "experience-company-help"}
              />
              {errors.company ? (
                <p id="experience-company-error" className="text-sm text-red-600">{errors.company}</p>
              ) : (
                <p id="experience-company-help" className="text-xs text-[#6B7E8E]">Máximo 100 caracteres.</p>
              )}
            </div>

            <div className="space-y-2">
              <Label id="experience-position-label" htmlFor="experience-position" className="text-[#003A6C]">
                Cargo
              </Label>
              <Input
                id="experience-position"
                maxLength={80}
                value={formData.position}
                onBlur={() => onBlur("position")}
                onChange={(event) => onFieldChange("position", event.target.value)}
                placeholder="Ej: Analista, docente, investigador"
                className="h-11 border-[#A5D7E8] bg-white text-[#003A6C] placeholder:text-[#7B98AF]"
                aria-invalid={Boolean(errors.position)}
                aria-labelledby="experience-position-label"
                aria-describedby={errors.position ? "experience-position-error" : "experience-position-help"}
              />
              {errors.position ? (
                <p id="experience-position-error" className="text-sm text-red-600">{errors.position}</p>
              ) : (
                <p id="experience-position-help" className="text-xs text-[#6B7E8E]">Máximo 80 caracteres.</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label id="experience-description-label" htmlFor="experience-description" className="text-[#003A6C]">
                Descripción
              </Label>
              <Textarea
                id="experience-description"
                rows={4}
                maxLength={300}
                value={formData.description}
                onBlur={() => onBlur("description")}
                onChange={(event) => onFieldChange("description", event.target.value)}
                placeholder="Describe brevemente tus funciones, logros o actividades."
                className="resize-none border-[#A5D7E8] bg-white text-[#003A6C] placeholder:text-[#7B98AF]"
                aria-invalid={Boolean(errors.description)}
                aria-labelledby="experience-description-label"
                aria-describedby={errors.description ? "experience-description-error" : "experience-description-help"}
              />
              {errors.description ? (
                <p id="experience-description-error" className="text-sm text-red-600">{errors.description}</p>
              ) : (
                <p id="experience-description-help" className="text-xs text-[#6B7E8E]">Opcional. Máximo 300 caracteres.</p>
              )}
            </div>

            <div className="space-y-2">
              <Label id="experience-start-date-label" htmlFor="experience-start-date" className="text-[#003A6C]">
                Fecha de inicio
              </Label>
              <Input
                id="experience-start-date"
                inputMode="numeric"
                value={formData.startDate}
                onBlur={() => onBlur("startDate")}
                onChange={(event) => onFieldChange("startDate", event.target.value)}
                placeholder="dd/mm/aaaa"
                className="h-11 border-[#A5D7E8] bg-white text-[#003A6C] placeholder:text-[#7B98AF]"
                aria-invalid={Boolean(errors.startDate)}
                aria-labelledby="experience-start-date-label"
                aria-describedby={errors.startDate ? "experience-start-date-error" : "experience-start-date-help"}
              />
              {errors.startDate ? (
                <p id="experience-start-date-error" className="text-sm text-red-600">{errors.startDate}</p>
              ) : (
                <p id="experience-start-date-help" className="text-xs text-[#6B7E8E]">Usa el formato dd/mm/aaaa.</p>
              )}
            </div>

            <div className="space-y-2">
              <Label id="experience-end-date-label" htmlFor="experience-end-date" className="text-[#003A6C]">
                Fecha de fin
              </Label>
              <Input
                id="experience-end-date"
                inputMode="numeric"
                value={formData.endDate}
                disabled={formData.current}
                onBlur={() => onBlur("endDate")}
                onChange={(event) => onFieldChange("endDate", event.target.value)}
                placeholder="dd/mm/aaaa"
                className="h-11 border-[#A5D7E8] bg-white text-[#003A6C] placeholder:text-[#7B98AF]"
                aria-invalid={Boolean(errors.endDate)}
                aria-labelledby="experience-end-date-label"
                aria-describedby={errors.endDate ? "experience-end-date-error" : "experience-end-date-help"}
              />
              {errors.endDate ? (
                <p id="experience-end-date-error" className="text-sm text-red-600">{errors.endDate}</p>
              ) : (
                <p id="experience-end-date-help" className="text-xs text-[#6B7E8E]">
                  {formData.current
                    ? "Este campo no es obligatorio si actualmente trabajas o estudias aquí."
                    : "Usa el formato dd/mm/aaaa."}
                </p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <div className="flex items-start gap-3 rounded-2xl border border-[#D7E6F2] bg-[#F8FBFD] px-4 py-3">
                <input
                  id="experience-current"
                  type="checkbox"
                  checked={formData.current}
                  onChange={(event) => onFieldChange("current", event.target.checked)}
                  className="mt-1 size-4 rounded border-[#A5D7E8] text-[#003A6C] focus:ring-[#A5D7E8]"
                />
                <div>
                  <Label id="experience-current-label" htmlFor="experience-current" className="cursor-pointer text-[#003A6C]">
                    Actualmente trabajo/estudio aquí
                  </Label>
                  <p className="mt-1 text-xs text-[#6B7E8E]">
                    Si activas esta opción, la fecha de fin deja de ser obligatoria.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label id="experience-image-label" htmlFor="experience-image" className="text-[#003A6C]">
                Logo de la empresa o institución
              </Label>

              <input
                id="experience-image"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onImageChange}
                className="hidden"
              />

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  id="boton-subir-logo"
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-11 border-[#A5D7E8] bg-white text-[#003A6C] hover:bg-[#EEF5F9]"
                >
                  <ImagePlus className="mr-2 size-4" />
                  Subir logo
                </Button>

                {formData.image ? (
                  <Button
                    id="boton-eliminar-logo"
                    type="button"
                    variant="outline"
                    onClick={onRemoveImage}
                    className="h-11 border-[#F2C6C6] bg-white text-[#B42318] hover:bg-[#FFF1F1]"
                  >
                    <X className="mr-2 size-4" />
                    Quitar imagen
                  </Button>
                ) : null}
              </div>

              {formData.image ? (
                <div className="rounded-2xl border border-[#D7E6F2] bg-[#F8FBFD] p-4">
                  <img src={formData.image} alt="Vista previa del logo" className="size-24 rounded-2xl object-cover" />
                </div>
              ) : (
                <p id="experience-image-help" className="text-xs text-[#6B7E8E]">Este campo es opcional.</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Button id="boton-guardar-experiencia" type="submit" className="h-11 flex-1 bg-[#003A6C] text-white hover:bg-[#1a4f7a]">
              Guardar
            </Button>
            <Button
              id="boton-cancelar-experiencia"
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-11 flex-1 border-[#A5D7E8] bg-white text-[#003A6C] hover:bg-[#EEF5F9]"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
