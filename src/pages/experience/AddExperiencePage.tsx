import { useEffect, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"

import { ExperienceManagerModals } from "@/components/experience/ExperienceManagerModals"
import { ExperiencePageShell } from "@/components/experience/ExperiencePageShell"
import { FeedbackMessage } from "@/components/experience/FeedbackMessage"
import { ExperienceInlineForm } from "@/pages/experience/ExperienceInlineForm"
import { useExperienceManager } from "@/hooks/useExperienceManager"

export default function AddExperiencePage() {
  const navigate = useNavigate()
  const manager = useExperienceManager()

  useEffect(() => {
    manager.prepareCreateForm("laboral")
    // Prepare the inline form once for this page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await manager.handleSubmit(event)
  }

  return (
    <ExperiencePageShell title="Registrar Experiencia Laboral" description="Registra una nueva Experiencia Laboral en tu portafolio." compact>
      <FeedbackMessage message={manager.feedbackMessage || manager.pageError} type={manager.feedbackType || "error"} />
      <ExperienceInlineForm mode="experience" formData={manager.formData} errors={manager.errors} isSaving={manager.isSaving} canRemoveImage={manager.canRemoveImage} canRemoveCertificate={manager.canRemoveCertificate} workRoleOptions={manager.workOptions.roles} fileInputRef={manager.fileInputRef} certificateInputRef={manager.certificateInputRef} onFieldChange={manager.updateField} onBlur={manager.handleBlur} onImageChange={manager.handleImageChange} onCertificateChange={manager.handleCertificateChange} onRemoveImage={manager.removeImage} onRemoveCertificate={manager.removeCertificate} onSubmit={handleSubmit} onCancel={() => navigate("/experiencia/ver")} />
      <ExperienceManagerModals manager={manager} hideTypeField onSuccessClose={() => navigate("/experiencia/ver")} />
    </ExperiencePageShell>
  )
}
