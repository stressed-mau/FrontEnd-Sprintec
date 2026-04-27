import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { ExperienceInlineForm } from "@/pages/experience/ExperienceInlineForm"
import { ExperienceManagerModals, ExperiencePageShell, FeedbackMessage } from "@/pages/experience/ExperiencePageParts"
import { useExperienceManager } from "@/hooks/useExperienceManager"

export default function AddExperiencePage() {
  const navigate = useNavigate()
  const manager = useExperienceManager()

  useEffect(() => {
    manager.prepareCreateForm("laboral")
    // Prepare the inline form once for this page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ExperiencePageShell
      title="Añadir Experiencia Profesional"
      description="Agrega una nueva experiencia laboral a tu portafolio."
    >
      <FeedbackMessage message={manager.feedbackMessage || manager.pageError} type={manager.feedbackType || "error"} />

      <ExperienceInlineForm
        mode="experience"
        formData={manager.formData}
        errors={manager.errors}
        isSaving={manager.isSaving}
        canRemoveImage={manager.canRemoveImage}
        canRemoveCertificate={manager.canRemoveCertificate}
        fileInputRef={manager.fileInputRef}
        certificateInputRef={manager.certificateInputRef}
        onFieldChange={manager.updateField}
        onBlur={manager.handleBlur}
        onImageChange={manager.handleImageChange}
        onCertificateChange={manager.handleCertificateChange}
        onRemoveImage={manager.removeImage}
        onRemoveCertificate={manager.removeCertificate}
        onSubmit={manager.handleSubmit}
        onCancel={() => navigate("/experiencia/ver")}
      />

      <ExperienceManagerModals manager={manager} hideTypeField onSuccessClose={() => navigate("/experiencia/ver")} />
    </ExperiencePageShell>
  )
}
