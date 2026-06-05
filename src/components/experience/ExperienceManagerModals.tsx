import ConfirmActionModal from "@/components/ConfirmActionModal"
import ConfirmationModal from "@/components/ConfirmationModal"
import { DuplicateRegistrationModal } from "@/components/experience/DuplicateRegistrationModal"
import { ExperienceFormModal } from "@/components/experience/ExperienceFormModal"
import type { useExperienceManager } from "@/hooks/useExperienceManager"

type ExperienceManager = ReturnType<typeof useExperienceManager>

export function ExperienceManagerModals({ manager, onSuccessClose, hideTypeField }: { manager: ExperienceManager; onSuccessClose?: () => void; hideTypeField?: boolean }) {
  void hideTypeField

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
          workRoleOptions={manager.workOptions.roles}
          fileInputRef={manager.fileInputRef}
          onClose={manager.closeModal}
          onFieldChange={manager.updateField}
          onBlur={manager.handleBlur}
          onImageChange={manager.handleImageChange}
          onRemoveImage={manager.removeImage}
          onSubmit={manager.handleSubmit}
        />
      ) : null}

      {manager.isConfirmEditModalOpen ? (
        <ConfirmActionModal isOpen={manager.isConfirmEditModalOpen} title="Confirmar cambios" message="¿Estás seguro de que deseas guardar los cambios realizados?" confirmText={manager.isSaving ? "Guardando..." : "Aceptar"} cancelText="Cancelar" onConfirm={() => void manager.confirmEditSave()} onCancel={manager.closeConfirmEditModal} />
      ) : null}

      {manager.isDuplicateModalOpen ? (
        <DuplicateRegistrationModal title="Experiencia duplicada" message={manager.duplicateMessage} onClose={manager.closeDuplicateModal} />
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
