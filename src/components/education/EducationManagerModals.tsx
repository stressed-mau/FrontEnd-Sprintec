import ConfirmActionModal from "@/components/modals/ConfirmActionModal"
import ConfirmationModal from "@/components/modals/ConfirmationModal"
import { EducationFormModal } from "@/components/education/EducationFormModal"
import type { useEducationManager } from "@/hooks/useEducationManager"

type EducationManager = ReturnType<typeof useEducationManager>

export function EducationManagerModals({ manager, onSuccessClose }: { manager: EducationManager; onSuccessClose?: () => void }) {
  return (
    <>
      {manager.isModalOpen ? <EducationFormModal manager={manager} /> : null}

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
