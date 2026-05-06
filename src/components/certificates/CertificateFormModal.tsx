import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { CertificateFormErrors, CertificateFormValues } from "@/hooks/useCertificatesManager"
import { CertificateDateInput } from "@/components/certificates/CertificateDateInput"
import { CertificateFilePreviewField } from "@/components/certificates/CertificateFilePreviewField"

type CertificateFormModalProps = {
  formData: CertificateFormValues
  errors: CertificateFormErrors
  isEditing: boolean
  isSaving: boolean
  fileInput: File | null
  errorMessage: string
  fileInputRef: React.RefObject<HTMLInputElement | null>
  onClose: () => void
  onFieldChange: (field: keyof CertificateFormValues, value: string | boolean) => void
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveFile: () => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

export function CertificateFormModal({
  formData,
  errors,
  isEditing,
  isSaving,
  fileInput,
  errorMessage,
  fileInputRef,
  onClose,
  onFieldChange,
  onFileChange,
  onRemoveFile,
  onSubmit,
}: CertificateFormModalProps) {
  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-3 backdrop-blur-sm sm:items-center sm:px-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-t-3xl border border-[#A5D7E8] bg-white shadow-2xl sm:rounded-3xl">
        <div className="flex items-start justify-between gap-4 border-b border-[#D7E6F2] px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-2xl font-bold text-[#003A6C]">
              {isEditing ? "Editar certificado" : "Nuevo certificado"}
            </h2>
            <p className="mt-1 text-sm text-[#4B778D]">
              {isEditing ? "Actualiza" : "Registra"} información sobre tu certificado.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-full p-1 text-[#003A6C] transition hover:bg-[#EEF5F9] disabled:opacity-50"
            aria-label="Cerrar formulario de certificado"
          >
            <X className="size-5" />
          </button>
        </div>

        <form noValidate onSubmit={onSubmit} className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
          {errorMessage && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="certificate-name" className="text-[#003A6C]">
                Nombre del certificado <span aria-hidden="true">*</span>
              </Label>
              <Input
                id="certificate-name"
                maxLength={100}
                value={formData.name}
                disabled={isSaving}
                onChange={(e) => onFieldChange("name", e.target.value)}
                placeholder="Ej: AWS Solutions Architect"
                className="border-[#0E7D96]/20 bg-white placeholder:text-[#0E7D96]/40 focus:ring-[#0E7D96]/40"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "certificate-name-error" : undefined}
              />
              {errors.name && (
                <p id="certificate-name-error" className="text-sm text-red-600">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="certificate-issuer" className="text-[#003A6C]">
                Emisor <span aria-hidden="true">*</span>
              </Label>
              <Input
                id="certificate-issuer"
                maxLength={100}
                value={formData.issuer}
                disabled={isSaving}
                onChange={(e) => onFieldChange("issuer", e.target.value)}
                placeholder="Ej: Amazon Web Services"
                className="border-[#0E7D96]/20 bg-white placeholder:text-[#0E7D96]/40 focus:ring-[#0E7D96]/40"
                aria-invalid={!!errors.issuer}
                aria-describedby={errors.issuer ? "certificate-issuer-error" : undefined}
              />
              {errors.issuer && (
                <p id="certificate-issuer-error" className="text-sm text-red-600">
                  {errors.issuer}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <CertificateDateInput
              id="certificate-date-issued"
              label="Fecha de emisión"
              required
              value={formData.date_issued}
              max={today}
              disabled={isSaving}
              error={errors.date_issued}
              onChange={(value) => onFieldChange("date_issued", value)}
            />

            <CertificateDateInput
              id="certificate-date-expired"
              label="Fecha de vencimiento"
              value={formData.date_expired ?? ""}
              min={today}
              disabled={isSaving || formData.no_expiration}
              error={errors.date_expired}
              onChange={(value) => onFieldChange("date_expired", value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="no-expiration"
              checked={formData.no_expiration || false}
              onChange={(e) => onFieldChange("no_expiration", e.target.checked)}
              className="h-4 w-4 rounded border-[#0E7D96]/20"
            />
            <label htmlFor="no-expiration" className="text-[#003A6C] font-medium text-sm">
              Este certificado no tiene fecha de vencimiento
            </label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="certificate-description" className="text-[#003A6C]">
              Descripción
            </Label>
            <Textarea
              id="certificate-description"
              maxLength={300}
              value={formData.description}
              disabled={isSaving}
              onChange={(e) => onFieldChange("description", e.target.value)}
              placeholder="Describe las habilidades o conocimientos que acredita este certificado"
              className="min-h-[112px] w-full border-[#0E7D96]/20 bg-white placeholder:text-[#0E7D96]/40 focus:ring-[#0E7D96]/40"
              rows={4}
            />
            {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="certificate-credential-id" className="text-[#003A6C]">
                ID de credencial
              </Label>
              <Input
                id="certificate-credential-id"
                maxLength={50}
                value={formData.credential_id}
                disabled={isSaving}
                onChange={(e) => onFieldChange("credential_id", e.target.value)}
                placeholder="Ej: AWS1234567890"
                className="border-[#0E7D96]/20 bg-white placeholder:text-[#0E7D96]/40 focus:ring-[#0E7D96]/40"
              />
              {errors.credential_id && <p className="text-sm text-red-600">{errors.credential_id}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="certificate-credential-url" className="text-[#003A6C]">
                URL de verificación
              </Label>
              <Input
                id="certificate-credential-url"
                type="url"
                maxLength={200}
                value={formData.credential_url}
                disabled={isSaving}
                onChange={(e) => onFieldChange("credential_url", e.target.value)}
                placeholder="Ej: https://verify.provider.com/certificate/12345"
                className="border-[#0E7D96]/20 bg-white placeholder:text-[#0E7D96]/40 focus:ring-[#0E7D96]/40"
                aria-invalid={!!errors.credential_url}
                aria-describedby={errors.credential_url ? "certificate-credential-url-error" : undefined}
              />
              {errors.credential_url && (
                <p id="certificate-credential-url-error" className="text-sm text-red-600">
                  {errors.credential_url}
                </p>
              )}
            </div>
          </div>

          <CertificateFilePreviewField
            fileInput={fileInput}
            isSaving={isSaving}
            fileInputRef={fileInputRef}
            error={errors.file_bonus_url}
            onFileChange={onFileChange}
            onRemoveFile={onRemoveFile}
          />

          <div className="flex gap-3 border-t border-[#D7E6F2] pt-5">
            <Button
              type="submit"
              disabled={isSaving}
              className="flex-1 h-11 bg-[#003A6C] text-white hover:bg-[#1a4f7a] disabled:opacity-50"
            >
              {isSaving ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 h-11 border-[#0E7D96]/20 bg-white text-[#003A6C] hover:bg-[#EEF5F9] disabled:opacity-50"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
