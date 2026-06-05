import { X } from "lucide-react"

import { EducationInlineForm } from "@/components/education/EducationInlineForm"
import type { useEducationManager } from "@/hooks/useEducationManager"

type EducationManager = ReturnType<typeof useEducationManager>

export function EducationFormModal({ manager }: { manager: EducationManager }) {
  return (
    <div id="fondo-modal-formacion" className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-3 backdrop-blur-sm sm:items-center sm:px-4">
      <div id="contenedor-modal-formacion" className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-[#6DACBF] bg-[#C2DBED] shadow-2xl sm:rounded-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-[#6DACBF]/40 px-5 py-5 sm:px-6">
          <div>
            <h2 id="titulo-modal-formacion" className="text-2xl font-bold text-[#003A6C]">Editar Formación Académica</h2>
            <p id="descripcion-modal-formacion" className="mt-1 text-sm text-[#4B778D]">Actualiza tu Formación Académica.</p>
          </div>
          <button type="button" onClick={manager.closeModal} className="rounded-full p-1 text-[#003A6C] transition hover:bg-[#EEF5F9]" aria-label="Cerrar formulario de formación académica">
            <X className="size-5" />
          </button>
        </div>
        <div className="px-5 py-5 sm:px-6 sm:py-6">
          <EducationInlineForm
            formData={manager.formData}
            errors={manager.errors}
            isSaving={manager.isSaving}
            canRemoveCertificate={manager.canRemoveCertificate}
            educationTitleOptions={manager.educationOptions.titles}
            educationFieldOptions={manager.educationOptions.fields}
            certificateInputRef={manager.certificateInputRef}
            canEditEndDate={manager.canEditEndDate}
            tone="modal"
            onFieldChange={manager.updateField}
            onBlur={manager.handleBlur}
            onCertificateChange={manager.handleCertificateChange}
            onRemoveCertificate={manager.removeCertificate}
            onSubmit={manager.handleSubmit}
            onCancel={manager.closeModal}
          />
        </div>
      </div>
    </div>
  )
}
