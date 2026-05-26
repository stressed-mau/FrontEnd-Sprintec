import { BadgeCheck, CalendarDays, Link2, Search } from "lucide-react"
import type { ChangeEvent, FormEvent, ReactNode, RefObject } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CertificateDateInput } from "@/components/certificates/CertificateDateInput"
import { CertificateFilePreviewField } from "@/components/certificates/CertificateFilePreviewField"
import type { Certificate, CertificateFormErrors, CertificateFormValues } from "@/hooks/useCertificatesManager"

function formatCertificateDate(date: string) {
  return new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

type CertificatesSearchProps = {
  value: string
  onChange: (value: string) => void
}

type CertificatesTableProps = {
  certificates: Certificate[]
  emptyMessage: string
  searchTerm?: string
  selectedIds?: Set<string>
  onSelect?: (id: string, checked: boolean) => void
  onSelectAll?: (checked: boolean) => void
  onRowClick?: (certificate: Certificate) => void
}

type CertificateFormCardProps = {
  formData: CertificateFormValues
  errors: CertificateFormErrors
  isSaving: boolean
  fileInput: File | null
  fileInputRef: RefObject<HTMLInputElement | null>
  onFieldChange: (field: keyof CertificateFormValues, value: string | boolean) => void
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void
  onRemoveFile: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onCancel: () => void
}

export function CertificatesSearch({ value, onChange }: CertificatesSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#4B778D]" />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Buscar por nombre, emisor o ID de credencial..."
        className="h-11 border-[#A5D7E8] bg-white pl-10 text-[#003A6C]"
      />
    </div>
  )
}

export function CertificatesTable({
  certificates,
  emptyMessage,
  searchTerm = "",
  selectedIds,
  onSelect,
  onSelectAll,
  onRowClick,
}: CertificatesTableProps) {
  const selectable = Boolean(selectedIds && onSelect)
  const currentSelectedIds = selectedIds ?? new Set<string>()
  const canSelectAll = Boolean(onSelectAll)
  const allSelected =
    canSelectAll && certificates.length > 0 && certificates.every((certificate) => currentSelectedIds.has(certificate.id))

  return (
    <Card className="rounded-2xl border border-[#A5D7E8] bg-white py-0 shadow-sm">
      <CardContent className="p-0">
        {certificates.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-[#D9EAF4] text-[#003A6C]">
              {searchTerm ? <Search className="size-7" /> : <BadgeCheck className="size-7" />}
            </div>
            <p className="font-medium text-[#003A6C]">{emptyMessage}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse">
              <thead className="bg-[#EEF5F9] text-left text-xs uppercase text-[#003A6C]">
                <tr>
                  {selectable ? (
                    <th className="w-12 px-4 py-3">
                      {canSelectAll ? (
                        <input
                          type="checkbox"
                          checked={allSelected}
                          onChange={(event) => onSelectAll?.(event.target.checked)}
                          className="size-4 rounded-none border-[#A5D7E8]"
                          aria-label="Seleccionar todos los certificados visibles"
                        />
                      ) : (
                        <span>Sel.</span>
                      )}
                    </th>
                  ) : null}
                  <th className="px-4 py-3 font-semibold">Certificado</th>
                  <th className="px-4 py-3 font-semibold">Emisor</th>
                  <th className="px-4 py-3 font-semibold">Emisión</th>
                  <th className="px-4 py-3 font-semibold">Vigencia</th>
                  <th className="px-4 py-3 font-semibold">Verificación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9EAF4]">
                {certificates.map((certificate) => (
                  <tr
                    key={certificate.id}
                    onClick={() => onRowClick?.(certificate)}
                    className={onRowClick ? "cursor-pointer transition hover:bg-[#EEF5F9]" : "transition hover:bg-[#F8FBFD]"}
                  >
                    {selectable ? (
                      <td className="px-4 py-4" onClick={(event) => event.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={currentSelectedIds.has(certificate.id)}
                          onChange={(event) => onSelect?.(certificate.id, event.target.checked)}
                          className="size-4 rounded-none border-[#A5D7E8]"
                          aria-label={`Seleccionar ${certificate.name}`}
                        />
                      </td>
                    ) : null}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#D9EAF4] text-[#003A6C]">
                          <BadgeCheck className="size-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-[#003A6C]">{certificate.name}</p>
                          <p className="truncate text-xs text-[#6B7E8E]">
                            {certificate.credential_id ? `ID: ${certificate.credential_id}` : "Sin ID de credencial"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-[#355468]">{certificate.issuer}</td>
                    <td className="px-4 py-4 text-sm text-[#355468]">{formatCertificateDate(certificate.date_issued)}</td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-2 rounded-full bg-[#EEF5F9] px-3 py-1 text-xs font-medium text-[#355468]">
                        <CalendarDays className="size-3.5 text-[#0E7D96]" />
                        {certificate.date_expired ? formatCertificateDate(certificate.date_expired) : "Sin vencimiento"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-[#355468]">
                      {certificate.credential_url ? (
                        <a
                          href={certificate.credential_url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(event) => event.stopPropagation()}
                          className="inline-flex items-center gap-2 font-medium text-[#003A6C] hover:underline"
                        >
                          <Link2 className="size-4" />
                          Ver enlace
                        </a>
                      ) : (
                        "No registrada"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function CertificateFormCard({
  formData,
  errors,
  isSaving,
  fileInput,
  fileInputRef,
  onFieldChange,
  onFileChange,
  onRemoveFile,
  onSubmit,
  onCancel,
}: CertificateFormCardProps) {
  const today = new Date().toISOString().split("T")[0]
  const fileButtonClassName =
    "inline-flex cursor-pointer items-center rounded-lg bg-[#C2DBED] px-4 py-2 text-sm font-medium text-[#003A6C] transition hover:bg-[#A5D7E8] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"

  return (
    <Card className="rounded-2xl border border-[#A5D7E8] bg-white shadow-sm">
      <CardContent className="p-5 sm:p-6">
        <form noValidate onSubmit={onSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FieldError label="Nombre del certificado" id="certificate-name" error={errors.name} required>
              <Input
                id="certificate-name"
                maxLength={100}
                value={formData.name}
                disabled={isSaving}
                onChange={(e) => onFieldChange("name", e.target.value)}
                placeholder="Ej: AWS Solutions Architect"
                className="h-10 border-gray-300 bg-white focus-visible:border-blue-500 focus-visible:ring-blue-500/30"
              />
            </FieldError>

            <FieldError label="Emisor" id="certificate-issuer" error={errors.issuer} required>
              <Input
                id="certificate-issuer"
                maxLength={100}
                value={formData.issuer}
                disabled={isSaving}
                onChange={(e) => onFieldChange("issuer", e.target.value)}
                placeholder="Ej: Amazon Web Services"
                className="h-10 border-gray-300 bg-white focus-visible:border-blue-500 focus-visible:ring-blue-500/30"
              />
            </FieldError>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

            <div className="space-y-3">
              <CertificateDateInput
                id="certificate-date-expired"
                label="Fecha de vencimiento"
                value={formData.date_expired ?? ""}
                min={today}
                disabled={isSaving || formData.no_expiration}
                error={errors.date_expired}
                onChange={(value) => onFieldChange("date_expired", value)}
              />

              <label
                htmlFor="no-expiration"
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#D7E6F2] bg-[#F8FBFD] px-3 py-2 text-sm text-[#355468]"
              >
                <input
                  type="checkbox"
                  id="no-expiration"
                  checked={formData.no_expiration || false}
                  onChange={(e) => onFieldChange("no_expiration", e.target.checked)}
                  className="h-4 w-4 rounded border-[#0E7D96]/20 text-[#003A6C]"
                />
                Este certificado no tiene fecha de vencimiento
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="certificate-description" className="text-sm font-medium text-gray-700">
              Descripción
            </Label>
            <Textarea
              id="certificate-description"
              maxLength={300}
              value={formData.description}
              disabled={isSaving}
              onChange={(e) => onFieldChange("description", e.target.value)}
              placeholder="Describe las habilidades o conocimientos que acredita este certificado"
              className="min-h-[112px] resize-none border-gray-300 bg-white focus-visible:border-blue-500 focus-visible:ring-blue-500/30"
              rows={4}
            />
            {errors.description ? <p className="text-sm text-red-600">{errors.description}</p> : null}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FieldError label="ID de credencial" id="certificate-credential-id" error={errors.credential_id}>
              <Input
                id="certificate-credential-id"
                maxLength={50}
                value={formData.credential_id}
                disabled={isSaving}
                onChange={(e) => onFieldChange("credential_id", e.target.value)}
                placeholder="Ej: AWS1234567890"
                className="h-10 border-gray-300 bg-white focus-visible:border-blue-500 focus-visible:ring-blue-500/30"
              />
            </FieldError>

            <FieldError label="URL de verificación" id="certificate-credential-url" error={errors.credential_url}>
              <Input
                id="certificate-credential-url"
                type="url"
                maxLength={200}
                value={formData.credential_url}
                disabled={isSaving}
                onChange={(e) => onFieldChange("credential_url", e.target.value)}
                placeholder="Ej: https://verify.provider.com/certificate/12345"
                className="h-10 border-gray-300 bg-white focus-visible:border-blue-500 focus-visible:ring-blue-500/30"
              />
            </FieldError>
          </div>

          <div className="space-y-2">
            <Label htmlFor="certificate-document" className="text-sm font-medium text-gray-700">
              Documento del certificado
            </Label>
            <div className="space-y-3">
              {(fileInput || formData.file_bonus_url) ? (
                <div className="rounded-lg border border-[#D7E6F2] bg-[#EEF5F9] p-3">
                  <CertificateFilePreviewField
                    fileInput={fileInput}
                    isSaving={isSaving}
                    fileInputRef={fileInputRef}
                    error={errors.file_bonus_url}
                    onFileChange={onFileChange}
                    onRemoveFile={onRemoveFile}
                  />
                </div>
              ) : null}
              <label className={`${fileButtonClassName} ${isSaving ? "pointer-events-none" : ""}`}>
                Seleccionar archivo
                <input
                  id="certificate-document"
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                  disabled={isSaving}
                  onChange={onFileChange}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-500">Formatos: JPG, JPEG, PNG y PDF. Tamano maximo: 2 MB.</p>
              {errors.file_bonus_url ? <p className="text-sm text-red-600">{errors.file_bonus_url}</p> : null}
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <Button type="submit" disabled={isSaving} className="h-10 bg-[#003A6C] text-white hover:bg-[#1a4f7a]">
              {isSaving ? "Guardando..." : "Registrar"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSaving}
              className="h-10 border-gray-300 bg-[#F7F0E1] hover:bg-[#F7F0E1]/80"
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
        {label}
        {required ? " *" : null}
      </Label>
      {children}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  )
}
