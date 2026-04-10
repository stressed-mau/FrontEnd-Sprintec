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
    feedbackMessage,
    feedbackType,
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
    </div>
  )
}

export default ExperiencePage
