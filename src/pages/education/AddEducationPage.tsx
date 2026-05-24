import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { EducationInlineForm } from "@/pages/education/EducationInlineForm"
import { ExperienceManagerModals, ExperiencePageShell, FeedbackMessage } from "@/pages/experience/ExperiencePageParts"
import { useExperienceManager } from "@/hooks/useExperienceManager"

export default function AddEducationPage() {
  const navigate = useNavigate()
  const manager = useExperienceManager()

  useEffect(() => {
    manager.prepareCreateForm("academica")
    // Prepare the inline form once for this page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ExperiencePageShell
      title="Registrar Formación Académica"
      description="Registra una nueva Formación Académica en tu portafolio."
    >
      <FeedbackMessage message={manager.feedbackMessage || manager.pageError} type={manager.feedbackType || "error"} />

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
        onSubmit={manager.handleSubmit}
        onCancel={() => navigate("/formacion-academica/ver")}
      />

      <ExperienceManagerModals manager={manager} hideTypeField onSuccessClose={() => navigate("/formacion-academica/ver")} />
    </ExperiencePageShell>
  )
}
