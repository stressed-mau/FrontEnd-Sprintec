import { useEffect, useState, type ReactNode } from "react"
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
import { API_BASE_URL } from "@/services/api"
import { getAuthToken } from "@/services/auth"

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
      Formación Académica
    </Badge>
  ) : (
    <Badge className="bg-[#EEF5F9] text-[#003A6C]">
      <Briefcase className="mr-1 size-3" />
      Experiencia Laboral
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
                          className="size-4 rounded-none border-[#A5D7E8]"
                          aria-label="Seleccionar todas las experiencias visibles"
                        />
                      ) : (
                        <span>Sel.</span>
                      )}
                    </th>
                  ) : null}
                  <th className="px-4 py-3 font-semibold">Empresa o institución</th>
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
                          className="size-4 rounded-none border-[#A5D7E8]"
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
  const [certificatePreviewUrl, setCertificatePreviewUrl] = useState<string | null>(null)

  if (!experience) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-3 backdrop-blur-sm sm:items-center sm:px-4">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-[#6DACBF] bg-white p-6 shadow-2xl sm:rounded-3xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#003A6C]">
              Detalle de {experience.type === "academica" ? "Formación Académica" : "Experiencia Laboral"}
            </h2>
            <p className="mt-1 text-sm text-[#4B778D]">Información completa del registro seleccionado.</p>
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
              label={experience.type === "academica" ? "Campo de estudio" : "Ubicación"}
              value={experience.type === "academica" ? experience.fieldOfStudy || "No especificado" : experience.location || "No especificada"}
            />
          </div>

          <DetailItem label="Descripción" value={experience.description || "No especificada"} />

          {experience.certificate ? (
            <button
              type="button"
              onClick={() => setCertificatePreviewUrl(experience.certificate)}
              className="inline-flex rounded-lg border border-[#A5D7E8] bg-[#EEF5F9] px-4 py-2 text-sm font-medium text-[#003A6C] hover:bg-[#D9EAF4]"
            >
              Ver certificado
            </button>
          ) : null}
        </div>
      </div>
      <CertificatePreviewModal url={certificatePreviewUrl} onClose={() => setCertificatePreviewUrl(null)} />
    </div>
  )
}

function CertificatePreviewModal({ url, onClose }: { url: string | null; onClose: () => void }) {
  const [previewUrl, setPreviewUrl] = useState("")
  const [contentType, setContentType] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const isImageUrl = Boolean(url && /\.(?:jpe?g|png|webp|gif)(?:[?#].*)?$/i.test(url))

  useEffect(() => {
    if (!url) {
      return
    }

    const sourceUrl = url
    let objectUrl = ""
    let isCancelled = false

    async function loadCertificate() {
      setIsLoading(true)
      setErrorMessage("")
      setPreviewUrl("")
      setContentType("")

      if (sourceUrl.startsWith("data:")) {
        const dataContentType = sourceUrl.match(/^data:([^;,]+)/)?.[1] ?? ""
        setPreviewUrl(sourceUrl)
        setContentType(dataContentType)
        setIsLoading(false)
        return
      }

      if (isImageUrl && !shouldAttachAuthHeader(sourceUrl)) {
        setPreviewUrl(sourceUrl)
        setContentType("image/*")
        setIsLoading(false)
        return
      }

      try {
        const token = shouldAttachAuthHeader(sourceUrl) ? getAuthToken() : null
        const response = await fetch(sourceUrl, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          credentials: token ? "include" : "omit",
        })

        if (!response.ok) {
          const fallbackImageUrl = getCloudinaryPdfPageImageUrl(sourceUrl, 1)

          if (fallbackImageUrl) {
            setPreviewUrl(fallbackImageUrl)
            setContentType("image/*")
            setErrorMessage("")
            return
          }

          const cloudinaryError = response.headers.get("x-cld-error") ?? ""
          const isCloudinaryPdfBlocked =
            response.status === 401 &&
            sourceUrl.includes("res.cloudinary.com") &&
            /deny|acl/i.test(cloudinaryError)

          throw new Error(
            isCloudinaryPdfBlocked
              ? "Cloudinary está bloqueando la entrega pública de este PDF. No se pudo generar una vista previa alternativa."
              : "No se pudo cargar el documento.",
          )
        }

        const blob = await response.blob()

        if (isCancelled) {
          return
        }

        objectUrl = URL.createObjectURL(blob)
        setPreviewUrl(objectUrl)
        setContentType(blob.type || "")
      } catch (error) {
        if (!isCancelled) {
          setErrorMessage(error instanceof Error ? error.message : "No se pudo cargar el documento.")
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadCertificate()

    return () => {
      isCancelled = true

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [isImageUrl, url])

  if (!url) {
    return null
  }

  const previewSource = previewUrl || url
  const isCloudinaryPdfImageFallback = Boolean(
    previewUrl &&
    url.includes("res.cloudinary.com") &&
    /\.pdf(?:[?#].*)?$/i.test(url) &&
    previewUrl === getCloudinaryPdfPageImageUrl(url, 1),
  )
  const isImage =
    contentType.startsWith("image/") ||
    /^data:image\//i.test(previewSource) ||
    /\.(?:jpe?g|png|webp|gif)(?:[?#].*)?$/i.test(previewSource) ||
    isImageUrl
  const isPdf = !isImage && (contentType.includes("pdf") || /\.pdf(?:[?#].*)?$/i.test(previewSource))

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center overflow-hidden bg-black/60 p-3 backdrop-blur-sm sm:p-4">
      <div className="flex h-[calc(100vh-1.5rem)] w-[calc(100vw-1.5rem)] max-w-5xl flex-col overflow-hidden rounded-3xl border border-[#6DACBF] bg-white shadow-2xl sm:h-[calc(100vh-2rem)] sm:w-[calc(100vw-2rem)]">
        <div className="flex items-center justify-between gap-4 border-b border-[#D7E6F2] px-5 py-4">
          <h3 className="text-lg font-semibold text-[#003A6C]">Vista previa del certificado</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-[#003A6C] transition hover:bg-[#EEF5F9]"
            aria-label="Cerrar vista previa del certificado"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden bg-[#F7F0E1] p-3 sm:p-4">
          {isLoading ? (
            <div className="flex h-full items-center justify-center text-sm font-medium text-[#003A6C]">
              Cargando documento...
            </div>
          ) : errorMessage ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <p className="text-sm font-medium text-red-700">{errorMessage}</p>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-[#A5D7E8] bg-white px-4 py-2 text-sm font-medium text-[#003A6C] hover:bg-[#EEF5F9]"
              >
                Abrir en otra pestaña
              </a>
            </div>
          ) : previewUrl && isPdf ? (
            <iframe
              src={`${previewUrl}#view=FitH&zoom=page-width`}
              title="Certificado PDF"
              className="h-full min-h-0 w-full rounded-xl border border-[#A5D7E8] bg-white"
            />
          ) : previewUrl && isCloudinaryPdfImageFallback ? (
            <CloudinaryPdfPagesPreview pdfUrl={url} />
          ) : previewUrl && isImage ? (
            <div className="h-full min-h-0 w-full min-w-0 overflow-y-auto overflow-x-hidden rounded-xl border border-[#A5D7E8] bg-white p-3">
              <img src={previewUrl} alt="Certificado" className="mx-auto block h-auto w-full max-w-full object-contain" />
            </div>
          ) : previewUrl ? (
            <div className="flex h-full items-center justify-center">
              <a
                href={previewUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-[#A5D7E8] bg-white px-4 py-2 text-sm font-medium text-[#003A6C] hover:bg-[#EEF5F9]"
              >
                Abrir documento
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function CloudinaryPdfPagesPreview({ pdfUrl }: { pdfUrl: string }) {
  const maxPages = 30
  const [pages, setPages] = useState([1])
  const [failedPage, setFailedPage] = useState<number | null>(null)

  const visiblePages = failedPage == null ? pages : pages.filter((page) => page < failedPage)

  function handlePageLoad(page: number) {
    if (failedPage != null || page >= maxPages || page !== pages[pages.length - 1]) {
      return
    }

    setPages((current) => (current.includes(page + 1) ? current : [...current, page + 1]))
  }

  function handlePageError(page: number) {
    setFailedPage((current) => current ?? page)
  }

  return (
    <div className="h-full min-h-0 w-full min-w-0 overflow-y-auto overflow-x-hidden rounded-xl border border-[#A5D7E8] bg-white p-3">
      {visiblePages.length ? (
        <div className="mx-auto flex w-full max-w-full flex-col gap-4">
          {visiblePages.map((page) => (
            <img
              key={page}
              src={getCloudinaryPdfPageImageUrl(pdfUrl, page)}
              alt={`Certificado pagina ${page}`}
              className="mx-auto block h-auto w-full max-w-full object-contain"
              onLoad={() => handlePageLoad(page)}
              onError={() => handlePageError(page)}
            />
          ))}
        </div>
      ) : (
        <div className="flex h-full items-center justify-center text-sm font-medium text-red-700">
          No se pudo generar la vista previa del PDF.
        </div>
      )}
    </div>
  )
}

function shouldAttachAuthHeader(url: string) {
  if (!/^(https?:)?\/\//i.test(url) && !url.startsWith("data:") && !url.startsWith("blob:")) {
    return true
  }

  try {
    const targetUrl = new URL(url, window.location.origin)
    const apiUrl = new URL(API_BASE_URL, window.location.origin)

    return targetUrl.origin === window.location.origin || targetUrl.origin === apiUrl.origin
  } catch {
    return false
  }
}

function getCloudinaryPdfPageImageUrl(url: string, page: number) {
  if (!url.includes("res.cloudinary.com") || !/\.pdf(?:[?#].*)?$/i.test(url)) {
    return ""
  }

  try {
    const parsedUrl = new URL(url)
    const uploadSegment = "/image/upload/"
    const uploadIndex = parsedUrl.pathname.indexOf(uploadSegment)

    if (uploadIndex === -1) {
      return ""
    }

    const beforeUpload = parsedUrl.pathname.slice(0, uploadIndex + uploadSegment.length)
    const afterUpload = parsedUrl.pathname.slice(uploadIndex + uploadSegment.length)
    const withoutExtension = afterUpload.replace(/\.pdf$/i, ".jpg")

    parsedUrl.pathname = `${beforeUpload}pg_${page}/${withoutExtension}`
    parsedUrl.search = ""
    parsedUrl.hash = ""

    return parsedUrl.toString()
  } catch {
    return ""
  }
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
          canSave={manager.canSaveExperience}
          canRemoveImage={manager.canRemoveImage}
          canRemoveCertificate={manager.canRemoveCertificate}
          originalEditingValues={manager.originalEditingValues}
          workRoleOptions={manager.workOptions.roles}
          educationTitleOptions={manager.educationOptions.titles}
          educationFieldOptions={manager.educationOptions.fields}
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
          message="¿Estás seguro de que deseas guardar los cambios realizados?"
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
          title={manager.successTitle}
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
