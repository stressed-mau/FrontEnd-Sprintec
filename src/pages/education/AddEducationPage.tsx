import { useEffect, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"

import { EducationDuplicateRegistrationModal } from "@/components/education/EducationDuplicateRegistrationModal"
import { EducationFeedbackMessage } from "@/components/education/EducationFeedbackMessage"
import { EducationInlineForm } from "@/components/education/EducationInlineForm"
import { EducationManagerModals } from "@/components/education/EducationManagerModals"
import { EducationPageShell } from "@/components/education/EducationPageShell"
import { useEducationDuplicateGuard } from "@/hooks/useEducationDuplicateGuard"
import { useEducationManager } from "@/hooks/useEducationManager"

export default function AddEducationPage() {
  const navigate = useNavigate()
  const manager = useEducationManager()
  const duplicateGuard = useEducationDuplicateGuard({
    education: manager.education,
    formData: manager.formData,
    onBlur: manager.handleBlur,
  })

  useEffect(() => {
    manager.prepareCreateForm()
    // Prepare the inline form once for this page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!duplicateGuard.validateUniqueInstitution()) return
    await manager.handleSubmit(event)
  }

  return (
    <EducationPageShell title="Registrar Formación Académica" description="Registra una nueva Formación Académica en tu portafolio.">
      <EducationFeedbackMessage message={manager.feedbackMessage || manager.pageError} type={manager.feedbackType || "error"} />

      <EducationInlineForm
        formData={manager.formData}
        errors={manager.errors}
        isSaving={manager.isSaving}
        canRemoveCertificate={manager.canRemoveCertificate}
        educationTitleOptions={manager.educationOptions.titles}
        educationFieldOptions={manager.educationOptions.fields}
        certificateInputRef={manager.certificateInputRef}
        onFieldChange={manager.updateField}
        onBlur={manager.handleBlur}
        onCertificateChange={manager.handleCertificateChange}
        onRemoveCertificate={manager.removeCertificate}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/formacion-academica/ver")}
      />

      <EducationManagerModals manager={manager} onSuccessClose={() => navigate("/formacion-academica/ver")} />
      <EducationDuplicateRegistrationModal
        title="Formación duplicada"
        message={duplicateGuard.duplicateMessage}
        onClose={duplicateGuard.clearDuplicateMessage}
      />
    </EducationPageShell>
  )
}
