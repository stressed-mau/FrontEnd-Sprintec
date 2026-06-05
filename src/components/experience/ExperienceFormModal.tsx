import { useState } from "react"
import { X } from "lucide-react"

import { ExperienceAttachmentFields } from "@/components/experience/ExperienceAttachmentFields"
import { ExperienceFormActions } from "@/components/experience/ExperienceFormActions"
import { ExperienceFormFields } from "@/components/experience/ExperienceFormFields"
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
  "Diseñador UI/UX",
  "Diseñador de Producto",
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

function getTodayInputValue() {
  return new Date(Date.now() - new Date().getTimezoneOffset() * 60_000).toISOString().slice(0, 10)
}

type ExperienceFormModalProps = {
  formData: ExperienceFormValues
  errors: ExperienceFormErrors
  isEditing: boolean
  isSaving: boolean
  canSave?: boolean
  canRemoveImage: boolean
  canRemoveCertificate?: boolean
  originalEditingValues?: ExperienceFormValues | null
  workRoleOptions?: string[]
  educationTitleOptions?: string[]
  educationFieldOptions?: string[]
  hideTypeField?: boolean
  fileInputRef: React.RefObject<HTMLInputElement | null>
  certificateInputRef?: React.RefObject<HTMLInputElement | null>
  onClose: () => void
  onFieldChange: (field: keyof ExperienceFormValues, value: string | boolean) => void
  onBlur: (field: keyof ExperienceFormValues) => void
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onCertificateChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveImage: () => void
  onRemoveCertificate?: () => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

export function ExperienceFormModal({
  formData,
  errors,
  isEditing,
  isSaving,
  canSave = true,
  canRemoveImage,
  workRoleOptions = [],
  fileInputRef,
  onClose,
  onFieldChange,
  onBlur,
  onImageChange,
  onRemoveImage,
  onSubmit,
}: ExperienceFormModalProps) {
  const [today] = useState(getTodayInputValue)
  const roleOptions = resolveOptions(formData.position, workRoleOptions.length ? workRoleOptions : POSITION_OPTIONS)

  return (
    <div id="fondo-modal-experiencia" className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-3 backdrop-blur-sm sm:items-center sm:px-4">
      <div id="contenedor-modal-experiencia" className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-[#6DACBF] bg-[#C2DBED] shadow-2xl sm:rounded-3xl">
        <ExperienceModalHeader isEditing={isEditing} onClose={onClose} />
        <form id="formulario-experiencia" noValidate onSubmit={onSubmit} className="space-y-4 px-5 py-5 sm:px-6 sm:py-6">
          <ExperienceFormFields formData={formData} errors={errors} isSaving={isSaving} isEditing={isEditing} roleOptions={roleOptions} today={today} onFieldChange={onFieldChange} onBlur={onBlur} />
          <ExperienceAttachmentFields preview={formData.image} error={errors.image} isSaving={isSaving} isEditing={isEditing} canRemoveImage={canRemoveImage} fileInputRef={fileInputRef} onImageChange={onImageChange} onRemoveImage={onRemoveImage} />
          <ExperienceFormActions isSaving={isSaving} canSave={canSave} onCancel={onClose} />
        </form>
      </div>
    </div>
  )
}

function ExperienceModalHeader({ isEditing, onClose }: { isEditing: boolean; onClose: () => void }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#D7E6F2] px-5 py-5 sm:px-6">
      <div>
        <h2 id="titulo-modal-experiencia" className="text-2xl font-bold text-[#003A6C]">
          {isEditing ? "Editar Experiencia Laboral" : "Nueva Experiencia Laboral"}
        </h2>
        <p id="descripcion-modal-experiencia" className="mt-1 text-sm text-[#4B778D]">
          {isEditing ? "Actualiza" : "Registra"} tu Experiencia Laboral.
        </p>
      </div>
      <button id="boton-cerrar-modal-experiencia" type="button" onClick={onClose} className="rounded-full p-1 text-[#003A6C] transition hover:bg-[#EEF5F9]" aria-label="Cerrar formulario de experiencia">
        <X className="size-5" />
      </button>
    </div>
  )
}

function resolveOptions(currentValue: string, options: string[]) {
  return currentValue && !options.includes(currentValue) ? [currentValue, ...options] : options
}
