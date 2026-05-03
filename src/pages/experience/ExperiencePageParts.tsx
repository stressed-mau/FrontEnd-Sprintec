import type { ReactNode } from "react"
import { Briefcase, GraduationCap, Search, X } from "lucide-react"

import ConfirmActionModal from "@/components/ConfirmActionModal"
import ConfirmationModal from "@/components/ConfirmationModal"
import { Footer } from "@/components/Footer"
import Header from "@/components/HeaderUser"
import Sidebar from "@/components/Sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ExperienceFormModal } from "@/components/experience/ExperienceFormModal"
import {
  formatExperienceDate,
  type ExperienceItem,
  type useExperienceManager,
} from "@/hooks/useExperienceManager"

type ExperienceManager = ReturnType<typeof useExperienceManager>

type ExperiencePageShellProps = {
  title: string
  description: string
  children: ReactNode
  compact?: boolean
}

type ExperienceSearchProps = {
  value: string
  onChange: (value: string) => void
}

type ExperienceTableProps = {
  experiences: ExperienceItem[]
  emptyMessage: string
  searchTerm?: string
  selectedIds?: Set<string>
  onSelect?: (id: string, checked: boolean) => void
  onSelectAll?: (checked: boolean) => void
  onRowClick?: (experience: ExperienceItem) => void
}

type ExperiencePaginationProps = {
  currentPage: number
  totalPages: number
  startIndex: number
  endIndex: number
  totalItems: number
  onPageChange: (page: number) => void
}

type ExperienceDetailsModalProps = {
  experience: ExperienceItem | null
  onClose: () => void
}

export function ExperiencePageShell({ title, description, children, compact = false }: ExperiencePageShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#F7F0E1]">
      <Header />
      <div className="flex flex-1 flex-col lg:flex-row">
        <Sidebar />
        <main className={compact ? "flex-1 p-3 sm:p-4 md:p-5" : "flex-1 p-4 sm:p-6 md:p-10"}>
          <div className={compact ? "mx-auto max-w-6xl space-y-3" : "mx-auto max-w-6xl space-y-6"}>
            <div className="text-center sm:text-left">
              <h1 className={compact ? "text-2xl font-bold text-[#003A6C] md:text-3xl" : "text-3xl font-bold text-[#003A6C] md:text-4xl"}>{title}</h1>
              <p className={compact ? "mt-1 text-sm text-[#4B778D]" : "mt-2 text-sm text-[#4B778D] md:text-base"}>{description}</p>
            </div>
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}

export function ExperienceSearch({ value, onChange }: ExperienceSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#4B778D]" />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Buscar por empresa, cargo, correo o tipo..."
        className="h-11 border-[#A5D7E8] bg-white pl-10 text-[#003A6C]"
      />
    </div>
  )
}

export function ExperienceStatusBadge({ experience }: { experience: ExperienceItem }) {
  return experience.current ? (
    <Badge className="bg-[#D9EAF4] text-[#003A6C]">Actual</Badge>
  ) : (
    <Badge className="bg-slate-100 text-slate-700">Finalizado</Badge>
  )
}

export function ExperienceTypeBadge({ type }: { type: ExperienceItem["type"] }) {
  return type === "academica" ? (
    <Badge className="bg-[#EEF5F9] text-[#003A6C]">
      <GraduationCap className="mr-1 size-3" />
      Academica
    </Badge>
  ) : (
    <Badge className="bg-[#EEF5F9] text-[#003A6C]">
      <Briefcase className="mr-1 size-3" />
      Laboral
    </Badge>
  )
}

export function ExperienceTable({
  experiences,
  emptyMessage,
  searchTerm = "",
  selectedIds,
  onSelect,
  onSelectAll,
  onRowClick,
}: ExperienceTableProps) {
  const selectable = Boolean(selectedIds && onSelect)
  const currentSelectedIds = selectedIds ?? new Set<string>()
  const canSelectAll = Boolean(onSelectAll)
  const allSelected = canSelectAll && experiences.length > 0 && experiences.every((experience) => currentSelectedIds.has(experience.id))

  return (
    <Card className="rounded-2xl border border-[#A5D7E8] bg-white py-0 shadow-sm">
      <CardContent className="p-0">
        {experiences.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-[#D9EAF4] text-[#003A6C]">
              {searchTerm ? <Search className="size-7" /> : <Briefcase className="size-7" />}
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
                          className="size-4 rounded border-[#A5D7E8]"
                          aria-label="Seleccionar todas las experiencias visibles"
                        />
                      ) : (
                        <span>Sel.</span>
                      )}
                    </th>
                  ) : null}
                  <th className="px-4 py-3 font-semibold">Empresa o institucion</th>
                  <th className="px-4 py-3 font-semibold">Cargo o titulo</th>
                  <th className="px-4 py-3 font-semibold">Detalle</th>
                  <th className="px-4 py-3 font-semibold">Periodo</th>
                  <th className="px-4 py-3 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9EAF4]">
                {experiences.map((experience) => (
                  <tr
                    key={experience.id}
                    onClick={() => onRowClick?.(experience)}
                    className={onRowClick ? "cursor-pointer transition hover:bg-[#EEF5F9]" : "transition hover:bg-[#F8FBFD]"}
                  >
                    {selectable ? (
                      <td className="px-4 py-4" onClick={(event) => event.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={currentSelectedIds.has(experience.id)}
                          onChange={(event) => onSelect?.(experience.id, event.target.checked)}
                          className="size-4 rounded border-[#A5D7E8]"
                          aria-label={`Seleccionar ${experience.company}`}
                        />
                      </td>
                    ) : null}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {experience.image ? (
                          <img src={experience.image} alt="" className="size-10 shrink-0 rounded-lg border border-[#D7E6F2] bg-white object-contain p-1" />
                        ) : (
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#D9EAF4] text-[#003A6C]">
                            {experience.type === "academica" ? <GraduationCap className="size-5" /> : <Briefcase className="size-5" />}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-[#003A6C]">{experience.company}</p>
                          {experience.email ? <p className="text-xs text-[#6B7E8E]">{experience.email}</p> : null}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-[#355468]">{experience.position}</td>
                    <td className="px-4 py-4 text-sm text-[#355468]">
                      {experience.type === "academica"
                        ? experience.fieldOfStudy || "-"
                        : experience.location || "-"}
                    </td>
                    <td className="px-4 py-4 text-sm text-[#355468]">
                      {formatExperienceDate(experience.startDate)} - {experience.current ? "Actual" : formatExperienceDate(experience.endDate)}
                    </td>
                    <td className="px-4 py-4">
                      <ExperienceStatusBadge experience={experience} />
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

export function ExperiencePagination({
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  totalItems,
  onPageChange,
}: ExperiencePaginationProps) {
  if (totalItems === 0 || totalPages <= 1) {
    return null
  }

  return (
    <div className="flex flex-col gap-3 text-sm text-[#355468] sm:flex-row sm:items-center sm:justify-between">
      <p>
        Mostrando {startIndex + 1} a {Math.min(endIndex, totalItems)} de {totalItems} resultados
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="border-[#A5D7E8] bg-white text-[#003A6C] hover:bg-[#EEF5F9]"
        >
          Anterior
        </Button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <Button
            key={page}
            type="button"
            variant={currentPage === page ? "default" : "outline"}
            onClick={() => onPageChange(page)}
            className={
              currentPage === page
                ? "bg-[#003A6C] text-white hover:bg-[#1a4f7a]"
                : "border-[#A5D7E8] bg-white text-[#003A6C] hover:bg-[#EEF5F9]"
            }
          >
            {page}
          </Button>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="border-[#A5D7E8] bg-white text-[#003A6C] hover:bg-[#EEF5F9]"
        >
          Siguiente
        </Button>
      </div>
    </div>
  )
}

export function ExperienceDetailsModal({ experience, onClose }: ExperienceDetailsModalProps) {
  if (!experience) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-3 backdrop-blur-sm sm:items-center sm:px-4">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-[#6DACBF] bg-white p-6 shadow-2xl sm:rounded-3xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#003A6C]">Detalle de experiencia</h2>
            <p className="mt-1 text-sm text-[#4B778D]">Informacion completa del registro seleccionado.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-[#003A6C] transition hover:bg-[#EEF5F9]"
            aria-label="Cerrar detalle de experiencia"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            {experience.image ? (
              <img src={experience.image} alt="" className="size-16 shrink-0 rounded-lg border border-[#D7E6F2] bg-white object-contain p-1 shadow-sm" />
            ) : (
              <div className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-[#D9EAF4] text-[#003A6C]">
                {experience.type === "academica" ? <GraduationCap className="size-8" /> : <Briefcase className="size-8" />}
              </div>
            )}
            <div>
              <p className="text-xl font-semibold text-[#003A6C]">{experience.company}</p>
              <p className="text-[#4B778D]">{experience.position}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <ExperienceTypeBadge type={experience.type} />
                <ExperienceStatusBadge experience={experience} />
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <DetailItem label="Inicio" value={formatExperienceDate(experience.startDate)} />
            <DetailItem label="Fin" value={experience.current ? "Actual" : formatExperienceDate(experience.endDate)} />
            <DetailItem label="Correo" value={experience.email || "No especificado"} />
            <DetailItem
              label={experience.type === "academica" ? "Campo de estudio" : "Ubicacion"}
              value={experience.type === "academica" ? experience.fieldOfStudy || "No especificado" : experience.location || "No especificada"}
            />
          </div>

          <DetailItem label="Descripcion" value={experience.description || "No especificada"} />

          {experience.certificate ? (
            <a
              href={experience.certificate}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-lg border border-[#A5D7E8] bg-[#EEF5F9] px-4 py-2 text-sm font-medium text-[#003A6C] hover:bg-[#D9EAF4]"
            >
              Ver certificado
            </a>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export function ExperienceManagerModals({
  manager,
  onSuccessClose,
  hideTypeField,
}: {
  manager: ExperienceManager
  onSuccessClose?: () => void
  hideTypeField?: boolean
}) {
  return (
    <>
      {manager.isModalOpen ? (
        <ExperienceFormModal
          formData={manager.formData}
          errors={manager.errors}
          isEditing={manager.isEditing}
          isSaving={manager.isSaving}
          canRemoveImage={manager.canRemoveImage}
          canRemoveCertificate={manager.canRemoveCertificate}
          originalEditingValues={manager.originalEditingValues}
          hideTypeField={hideTypeField}
          fileInputRef={manager.fileInputRef}
          certificateInputRef={manager.certificateInputRef}
          onClose={manager.closeModal}
          onFieldChange={manager.updateField}
          onBlur={manager.handleBlur}
          onImageChange={manager.handleImageChange}
          onCertificateChange={manager.handleCertificateChange}
          onRemoveImage={manager.removeImage}
          onRemoveCertificate={manager.removeCertificate}
          onSubmit={manager.handleSubmit}
        />
      ) : null}

      {manager.isConfirmEditModalOpen ? (
        <ConfirmActionModal
          isOpen={manager.isConfirmEditModalOpen}
          title="Confirmar cambios"
          message="Estas seguro de que deseas guardar los cambios realizados?"
          confirmText={manager.isSaving ? "Guardando..." : "Aceptar"}
          cancelText="Cancelar"
          onConfirm={() => void manager.confirmEditSave()}
          onCancel={manager.closeConfirmEditModal}
        />
      ) : null}

      {manager.isDuplicateModalOpen ? (
        <ConfirmationModal
          isOpen={manager.isDuplicateModalOpen}
          title="Registro duplicado"
          message={manager.duplicateMessage}
          buttonText="Aceptar"
          onClose={manager.closeDuplicateModal}
        />
      ) : null}

      {manager.isSuccessModalOpen ? (
        <ConfirmationModal
          isOpen={manager.isSuccessModalOpen}
          title="Exito"
          message={manager.successMessage}
          buttonText="Aceptar"
          onClose={() => {
            manager.closeSuccessModal()
            onSuccessClose?.()
          }}
        />
      ) : null}
    </>
  )
}

export function FeedbackMessage({ message, type }: { message: string; type: "success" | "error" | "" }) {
  if (!message) {
    return null
  }

  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-sm ${
        type === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      {message}
    </div>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-[#6B7E8E]">{label}</p>
      <p className="mt-1 text-sm leading-6 text-[#003A6C]">{value}</p>
    </div>
  )
}
