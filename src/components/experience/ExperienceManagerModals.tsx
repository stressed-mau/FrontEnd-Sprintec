import ConfirmActionModal from "@/components/ConfirmActionModal"
import ConfirmationModal from "@/components/ConfirmationModal"
import { ExperienceFormModal } from "@/components/experience/ExperienceFormModal"
import type { useExperienceManager } from "@/hooks/useExperienceManager"

type ExperienceManager = ReturnType<typeof useExperienceManager>

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
      {manager.isModalOpen ? <ExperienceFormModalWrapper manager={manager} hideTypeField={hideTypeField} /> : null}
      {manager.isConfirmEditModalOpen ? <ConfirmEditModal manager={manager} /> : null}
      {manager.isDuplicateModalOpen ? <DuplicateModal manager={manager} /> : null}
      {manager.isSuccessModalOpen ? <SuccessModal manager={manager} onSuccessClose={onSuccessClose} /> : null}
    </>
  )
}

function ExperienceFormModalWrapper({ manager, hideTypeField }: { manager: ExperienceManager; hideTypeField?: boolean }) {
  return (
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
  )
}

function ConfirmEditModal({ manager }: { manager: ExperienceManager }) {
  return (
    <ConfirmActionModal
      isOpen={manager.isConfirmEditModalOpen}
      title="Confirmar cambios"
      message="¿Estás seguro de que deseas guardar los cambios realizados?"
      confirmText={manager.isSaving ? "Guardando..." : "Aceptar"}
      cancelText="Cancelar"
      onConfirm={() => void manager.confirmEditSave()}
      onCancel={manager.closeConfirmEditModal}
    />
  )
}

function DuplicateModal({ manager }: { manager: ExperienceManager }) {
  return (
    <ConfirmationModal
      isOpen={manager.isDuplicateModalOpen}
      title="Registro duplicado"
      message={manager.duplicateMessage}
      buttonText="Aceptar"
      onClose={manager.closeDuplicateModal}
    />
  )
}

function SuccessModal({ manager, onSuccessClose }: { manager: ExperienceManager; onSuccessClose?: () => void }) {
  return (
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
  )
}
