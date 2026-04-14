import { Briefcase, GraduationCap, Plus } from "lucide-react"

import Header from "@/components/HeaderUser"
import Sidebar from "@/components/Sidebar"
import { Footer } from "@/components/Footer"
import { ExperienceFormModal } from "@/components/experience/ExperienceFormModal"
import { ExperienceSection } from "@/components/experience/ExperienceSection"
import { Button } from "@/components/ui/button"
import { useExperienceManager } from "@/hooks/useExperienceManager"

const ExperiencePage = () => {
  const {
    formData,
    errors,
    isModalOpen,
    isEditing,
    isConfirmEditModalOpen,
    feedbackMessage,
    feedbackType,
    isDuplicateModalOpen,
    isSuccessModalOpen,
    duplicateMessage,
    successMessage,
    pageError,
    isLoading,
    isSaving,
    canRemoveImage,
    laboralExperiences,
    academicExperiences,
    fileInputRef,
    openCreateModal,
    openEditModal,
    closeModal,
    closeConfirmEditModal,
    closeDuplicateModal,
    closeSuccessModal,
    confirmEditSave,
    updateField,
    handleBlur,
    handleImageChange,
    removeImage,
    handleSubmit,
    handleDelete,
  } = useExperienceManager()

  return (
    <div id="pagina-experiencia" className="min-h-screen bg-[#F7F0E1]">
      <Header />

      <div className="flex flex-col lg:flex-row">
        <Sidebar />

        <main id="contenido-principal-experiencia" className="flex-1 p-4 sm:p-6 md:p-10">
          <div className="mx-auto max-w-5xl">
            <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
              <div className="text-center sm:text-left">
                <h1 id="titulo-pagina-experiencia" className="mb-2 text-3xl font-bold text-[#003A6C] md:text-4xl">
                  Mi Experiencia
                </h1>
                <p id="descripcion-pagina-experiencia" className="text-sm text-[#4B778D] md:text-base">
                  Gestiona tu experiencia laboral y académica
                </p>
              </div>

              <Button
                id="boton-agregar-experiencia"
                type="button"
                onClick={openCreateModal}
                disabled={isLoading}
                className="h-11 bg-[#003A6C] px-5 text-white hover:bg-[#1a4f7a]"
              >
                <Plus className="mr-2 size-4" />
                Agregar experiencia
              </Button>
            </div>

            {feedbackMessage ? (
              <div
                id="mensaje-retroalimentacion-experiencia"
                className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
                  feedbackType === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {feedbackMessage}
              </div>
            ) : null}

            {pageError ? (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {pageError}
              </div>
            ) : null}

            <div className="space-y-8">
              {isLoading ? (
                <div className="rounded-3xl border border-[#A5D7E8] bg-white px-6 py-10 text-center text-sm text-[#4B778D] shadow-sm">
                  Cargando experiencias...
                </div>
              ) : (
                <>
                  <ExperienceSection
                    title="Experiencia laboral"
                    emptyMessage="No hay experiencia laboral registrada."
                    icon={<Briefcase className="size-5" />}
                    items={laboralExperiences}
                    onEdit={openEditModal}
                    onDelete={handleDelete}
                  />

                  <ExperienceSection
                    title="Experiencia académica"
                    emptyMessage="No hay experiencia académica registrada."
                    icon={<GraduationCap className="size-5" />}
                    items={academicExperiences}
                    onEdit={openEditModal}
                    onDelete={handleDelete}
                  />
                </>
              )}
            </div>
          </div>
        </main>
      </div>

      <Footer />

      {isModalOpen ? (
        <ExperienceFormModal
          formData={formData}
          errors={errors}
          isEditing={isEditing}
          isSaving={isSaving}
          canRemoveImage={canRemoveImage}
          fileInputRef={fileInputRef}
          onClose={closeModal}
          onFieldChange={updateField}
          onBlur={handleBlur}
          onImageChange={handleImageChange}
          onRemoveImage={removeImage}
          onSubmit={handleSubmit}
        />
      ) : null}

      {isSuccessModalOpen ? (
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
      ) : null}

      {isConfirmEditModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl">
            <button
              type="button"
              onClick={closeConfirmEditModal}
              aria-label="Cerrar confirmación de guardado"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-[#4B778D] transition hover:bg-[#EEF5F9]"
            >
              X
            </button>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#D9EAF4] text-[#003A6C]">
              <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-3-3v6m9 0A9 9 0 113 12a9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#003A6C]">Confirmar cambios</h2>
            <p className="mt-2 text-sm text-[#4B778D]">
              ¿Estás seguro de que deseas guardar los cambios realizados?
            </p>
            <div className="mt-6 flex gap-3">
              <Button onClick={confirmEditSave} disabled={isSaving} className="h-11 flex-1 bg-[#003A6C] text-white hover:bg-[#1a4f7a]">
                Aceptar
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={closeConfirmEditModal}
                disabled={isSaving}
                className="h-11 flex-1 border-[#A5D7E8] bg-white text-[#003A6C] hover:bg-[#EEF5F9]"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {isDuplicateModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl">
            <button
              type="button"
              onClick={closeDuplicateModal}
              aria-label="Cerrar modal de duplicado"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-[#4B778D] transition hover:bg-[#EEF5F9]"
            >
              X
            </button>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FDEBEC] text-[#B42318]">
              <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M10.29 3.86l-7.17 12.42A2 2 0 004.85 19h14.3a2 2 0 001.73-3.02L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#003A6C]">Registro duplicado</h2>
            <p className="mt-2 text-sm text-[#4B778D]">{duplicateMessage}</p>
            <Button onClick={closeDuplicateModal} className="mt-6 h-11 w-full bg-[#003A6C] text-white hover:bg-[#1a4f7a]">
              Aceptar
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default ExperiencePage
