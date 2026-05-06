import { BadgeCheck, Plus } from "lucide-react"
import { useRef } from "react"

import Header from "@/components/HeaderUser"
import Sidebar from "@/components/Sidebar"
import { Footer } from "@/components/Footer"
import { CertificateFormModal } from "@/components/certificates/CertificateFormModal"
import { CertificatesSection } from "@/components/certificates/CertificatesSection"
import { Button } from "@/components/ui/button"
import { useCertificatesManager } from "@/hooks/useCertificatesManager"

export default function CertificatesPage() {
  const {
    certificates,
    formData,
    errors,
    isModalOpen,
    isEditing,
    errorMessage,
    successMessage,
    showSuccessModal,
    pageError,
    isLoading,
    isSaving,
    isDeleting,
    showConfirmDelete,
    certificateToDelete,
    fileInput,
    openCreateModal,
    openEditModal,
    closeModal,
    closeSuccessModal,
    updateField,
    handleFileChange,
    removeFile,
    handleSubmit,
    cancelDelete,
    confirmDelete,
  } = useCertificatesManager()

  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F0E1]">
      <Header />
      <div className="flex flex-1 flex-col lg:flex-row">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 md:p-10">
          <div className="mx-auto max-w-5xl">
            <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
              <div className="text-center sm:text-left">
                <h1 className="mb-2 text-3xl font-bold text-[#003A6C] md:text-4xl">
                  Mis Certificados
                </h1>
                <p className="text-sm text-[#4B778D] md:text-base">
                  Gestiona tus certificaciones y credenciales profesionales
                </p>
              </div>

              <Button
                type="button"
                onClick={openCreateModal}
                disabled={isLoading}
                className="h-11 bg-[#003A6C] px-5 text-white hover:bg-[#1a4f7a] disabled:opacity-50"
              >
                <Plus className="mr-2 size-4" />
                Registrar certificado
              </Button>
            </div>

            {pageError && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {pageError}
              </div>
            )}

            <div className="space-y-8">
              {isLoading ? (
                <div className="rounded-3xl border border-[#A5D7E8] bg-white px-6 py-10 text-center text-sm text-[#4B778D] shadow-sm">
                  Cargando certificados...
                </div>
              ) : (
                <CertificatesSection
                  title="Certificados"
                  emptyMessage="No hay certificados registrados. ¡Registra uno para mostrar tus credenciales!"
                  icon={<BadgeCheck className="size-5" />}
                  items={certificates}
                  onEdit={openEditModal}
                />
              )}
            </div>
          </div>
        </main>
      </div>
      <Footer />

      {isModalOpen && (
        <CertificateFormModal
          formData={formData}
          errors={errors}
          isEditing={isEditing}
          isSaving={isSaving}
          fileInput={fileInput}
          errorMessage={errorMessage}
          fileInputRef={fileInputRef}
          onClose={closeModal}
          onFieldChange={updateField}
          onFileChange={handleFileChange}
          onRemoveFile={removeFile}
          onSubmit={handleSubmit}
        />
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl">
            <button
              type="button"
              onClick={closeSuccessModal}
              aria-label="Cerrar modal de éxito"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-[#4B778D] transition hover:bg-[#EEF5F9]"
            >
              X
            </button>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#D9EAF4] text-[#003A6C]">
              <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#003A6C]">Éxito</h2>
            <p className="mt-2 text-sm text-[#4B778D]">{successMessage}</p>
            <Button onClick={closeSuccessModal} className="mt-6 h-11 w-full bg-[#003A6C] text-white hover:bg-[#1a4f7a]">
              Aceptar
            </Button>
          </div>
        </div>
      )}

      {showConfirmDelete && certificateToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl">
            <button
              type="button"
              onClick={cancelDelete}
              aria-label="Cerrar confirmación de eliminación"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-[#4B778D] transition hover:bg-[#EEF5F9]"
            >
              X
            </button>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4v2m0 4v2m7.93-11a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#003A6C]">Confirmar eliminación</h2>
            <p className="mt-2 text-sm text-[#4B778D]">
              ¿Estás seguro de que deseas eliminar el certificado "{certificateToDelete.name}"? Esta acción no se puede deshacer.
            </p>
            <div className="mt-6 flex gap-3">
              <Button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="h-11 flex-1 bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? "Eliminando..." : "Eliminar"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={cancelDelete}
                disabled={isDeleting}
                className="h-11 flex-1 border-[#A5D7E8] bg-white text-[#003A6C] hover:bg-[#EEF5F9] disabled:opacity-50"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
