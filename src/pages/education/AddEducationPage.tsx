import { useEffect, useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"

import { EducationInlineForm } from "@/pages/education/EducationInlineForm"
import { DuplicateRegistrationModal, ExperienceManagerModals, ExperiencePageShell, FeedbackMessage } from "@/pages/experience/ExperiencePageParts"
import { useExperienceManager } from "@/hooks/useExperienceManager"

function normalizeDuplicateText(value: string) {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase("es-BO")
}

export default function AddEducationPage() {
  const navigate = useNavigate()
  const manager = useExperienceManager()
  const [duplicateMessage, setDuplicateMessage] = useState("")

  useEffect(() => {
    manager.prepareCreateForm("academica")
    // Prepare the inline form once for this page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setDuplicateMessage("")

    const institution = normalizeDuplicateText(manager.formData.company)
    const hasDuplicateEducation = Boolean(institution) && manager.academicExperiences.some((education) =>
      normalizeDuplicateText(education.company) === institution
    )

    if (hasDuplicateEducation) {
      manager.handleBlur("company")
      setDuplicateMessage("Ya existe una formación académica registrada con esa institución. Ingresa una institución diferente.")
      return
    }

    await manager.handleSubmit(event)
  }

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
        onSubmit={handleSubmit}
        onCancel={() => navigate("/formacion-academica/ver")}
      />

      <ExperienceManagerModals manager={manager} hideTypeField onSuccessClose={() => navigate("/formacion-academica/ver")} />
      <DuplicateRegistrationModal
        title="Formación duplicada"
        message={duplicateMessage}
        onClose={() => setDuplicateMessage("")}
      />
    </ExperiencePageShell>
  )
}
