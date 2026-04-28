import { FileUp, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { CertificateFormErrors, CertificateFormValues } from "@/hooks/useCertificatesManager"

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
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-3 backdrop-blur-sm sm:items-center sm:px-4">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-[#6DACBF] bg-[#C2DBED] shadow-2xl sm:rounded-3xl">
        <div className="flex items-start justify-between gap-4 border-b border-[#D7E6F2] px-5 py-5 sm:px-6">
          <div>
            <h2 className="text-2xl font-bold text-[#003A6C]">
              {isEditing ? "Editar certificado" : "Nuevo certificado"}
            </h2>
            <p className="mt-1 text-sm text-[#4B778D]">
              {isEditing ? "Actualiza" : "Agrega"} información sobre tu certificado.
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

        <form noValidate onSubmit={onSubmit} className="space-y-4 px-5 py-5 sm:px-6 sm:py-6">
          {errorMessage && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="certificate-name" className="text-[#003A6C]">
              Nombre del certificado <span aria-hidden="true">*</span>
            </Label>
            <Input
              id="certificate-name"
              maxLength={255}
              value={formData.name}
              disabled={isSaving}
              onChange={(e) => onFieldChange("name", e.target.value)}
              placeholder="Ej: AWS Solutions Architect"
              className="border-[#A5D7E8] bg-white focus:ring-[#A5D7E8]"
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
              maxLength={255}
              value={formData.issuer}
              disabled={isSaving}
              onChange={(e) => onFieldChange("issuer", e.target.value)}
              placeholder="Ej: Amazon Web Services"
              className="border-[#A5D7E8] bg-white focus:ring-[#A5D7E8]"
              aria-invalid={!!errors.issuer}
              aria-describedby={errors.issuer ? "certificate-issuer-error" : undefined}
            />
            {errors.issuer && (
              <p id="certificate-issuer-error" className="text-sm text-red-600">
                {errors.issuer}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="certificate-date-issued" className="text-[#003A6C]">
                Fecha de emisión <span aria-hidden="true">*</span>
              </Label>
              <Input
                id="certificate-date-issued"
                type="date"
                value={formData.date_issued}
                disabled={isSaving}
                onChange={(e) => onFieldChange("date_issued", e.target.value)}
                className="border-[#A5D7E8] bg-white focus:ring-[#A5D7E8]"
                aria-invalid={!!errors.date_issued}
                aria-describedby={errors.date_issued ? "certificate-date-issued-error" : undefined}
              />
              {errors.date_issued && (
                <p id="certificate-date-issued-error" className="text-sm text-red-600">
                  {errors.date_issued}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="certificate-date-expired" className="text-[#003A6C]">
                Fecha de vencimiento
              </Label>
              <Input
                id="certificate-date-expired"
                type="date"
                value={formData.date_expired}
                disabled={isSaving || formData.no_expiration}
                onChange={(e) => onFieldChange("date_expired", e.target.value)}
                className="border-[#A5D7E8] bg-white focus:ring-[#A5D7E8] disabled:opacity-50"
                aria-invalid={!!errors.date_expired}
                aria-describedby={errors.date_expired ? "certificate-date-expired-error" : undefined}
              />
              {errors.date_expired && (
                <p id="certificate-date-expired-error" className="text-sm text-red-600">
                  {errors.date_expired}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="no-expiration"
              checked={formData.no_expiration || false}
              onChange={(e) => onFieldChange("no_expiration", e.target.checked)}
              className="w-4 h-4 rounded border-[#A5D7E8]"
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
              value={formData.description}
              disabled={isSaving}
              onChange={(e) => onFieldChange("description", e.target.value)}
              placeholder="Describe las habilidades o conocimientos que acredita este certificado"
              className="border-[#A5D7E8] bg-white focus:ring-[#A5D7E8]"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="certificate-credential-id" className="text-[#003A6C]">
              ID de credencial
            </Label>
            <Input
              id="certificate-credential-id"
              maxLength={255}
              value={formData.credential_id}
              disabled={isSaving}
              onChange={(e) => onFieldChange("credential_id", e.target.value)}
              placeholder="Ej: AWS-12345-67890"
              className="border-[#A5D7E8] bg-white focus:ring-[#A5D7E8]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="certificate-credential-url" className="text-[#003A6C]">
              URL de credencial
            </Label>
            <Input
              id="certificate-credential-url"
              type="url"
              value={formData.credential_url}
              disabled={isSaving}
              onChange={(e) => onFieldChange("credential_url", e.target.value)}
              placeholder="Ej: https://verify.provider.com/certificate/12345"
              className="border-[#A5D7E8] bg-white focus:ring-[#A5D7E8]"
              aria-invalid={!!errors.credential_url}
              aria-describedby={errors.credential_url ? "certificate-credential-url-error" : undefined}
            />
            {errors.credential_url && (
              <p id="certificate-credential-url-error" className="text-sm text-red-600">
                {errors.credential_url}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-[#003A6C]">
              Archivo adicional
            </Label>
            <div className="rounded-lg border-2 border-dashed border-[#A5D7E8] bg-[#EEF5F9] p-4">
              {fileInput ? (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 truncate">
                    <p className="truncate text-sm font-medium text-[#003A6C]">{fileInput.name}</p>
                    <p className="text-xs text-[#4B778D]">
                      {(fileInput.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onRemoveFile}
                    disabled={isSaving}
                    className="border-[#A5D7E8] text-[#003A6C] hover:bg-white"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <FileUp className="mx-auto mb-2 size-6 text-[#003A6C]" />
                  <p className="text-sm text-[#4B778D]">
                    Haz clic o arrastra un archivo (PDF, JPG, JPEG)
                  </p>
                  <p className="text-xs text-[#6B7E8E]">Máximo 2MB</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg"
                    disabled={isSaving}
                    onChange={onFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isSaving}
                    className="mt-2 border-[#A5D7E8] text-[#003A6C] hover:bg-white"
                  >
                    Seleccionar archivo
                  </Button>
                </div>
              )}
            </div>
          </div>

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
              className="flex-1 h-11 border-[#A5D7E8] bg-white text-[#003A6C] hover:bg-[#EEF5F9] disabled:opacity-50"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
