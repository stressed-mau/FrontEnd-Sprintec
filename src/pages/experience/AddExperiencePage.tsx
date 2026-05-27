import { useEffect, useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"

import { ExperienceInlineForm } from "@/pages/experience/ExperienceInlineForm"
import { DuplicateRegistrationModal, ExperienceManagerModals, ExperiencePageShell, FeedbackMessage } from "@/pages/experience/ExperiencePageParts"
import { useExperienceManager } from "@/hooks/useExperienceManager"

function normalizeDuplicateText(value: string) {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase("es-BO")
}

export default function AddExperiencePage() {
  const navigate = useNavigate()
  const manager = useExperienceManager()
  const [duplicateMessage, setDuplicateMessage] = useState("")

  useEffect(() => {
    manager.prepareCreateForm("laboral")
    // Prepare the inline form once for this page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setDuplicateMessage("")

    const position = normalizeDuplicateText(manager.formData.position)
    const hasDuplicateExperience = Boolean(position) && manager.laboralExperiences.some((experience) =>
      normalizeDuplicateText(experience.position) === position
    )

    if (hasDuplicateExperience) {
      manager.handleBlur("position")
      setDuplicateMessage("Ya existe una experiencia laboral registrada con ese cargo. Ingresa un cargo diferente.")
      return
    }

    await manager.handleSubmit(event)
  }

  return (
    <ExperiencePageShell
      title="Registrar Experiencia Laboral"
      description="Registra una nueva Experiencia Laboral en tu portafolio."
      compact
    >
      <FeedbackMessage message={manager.feedbackMessage || manager.pageError} type={manager.feedbackType || "error"} />

      <ExperienceInlineForm
        mode="experience"
        formData={manager.formData}
        errors={manager.errors}
        isSaving={manager.isSaving}
        canRemoveImage={manager.canRemoveImage}
        canRemoveCertificate={manager.canRemoveCertificate}
        workRoleOptions={manager.workOptions.roles}
        fileInputRef={manager.fileInputRef}
        certificateInputRef={manager.certificateInputRef}
        onFieldChange={manager.updateField}
        onBlur={manager.handleBlur}
        onImageChange={manager.handleImageChange}
        onCertificateChange={manager.handleCertificateChange}
        onRemoveImage={manager.removeImage}
        onRemoveCertificate={manager.removeCertificate}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/experiencia/ver")}
      />

      <ExperienceManagerModals manager={manager} hideTypeField onSuccessClose={() => navigate("/experiencia/ver")} />
      <DuplicateRegistrationModal
        title="Experiencia duplicada"
        message={duplicateMessage}
        onClose={() => setDuplicateMessage("")}
      />
    </ExperiencePageShell>
  )
}
