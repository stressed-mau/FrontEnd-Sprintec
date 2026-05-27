import { useRef, useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"

import ConfirmationModal from "@/components/ConfirmationModal"
import { useCertificatesManager } from "@/hooks/useCertificatesManager"
import { CertificateFormCard } from "@/pages/certificates/CertificatePageParts"
import { DuplicateRegistrationModal, ExperiencePageShell, FeedbackMessage } from "@/pages/experience/ExperiencePageParts"

function normalizeDuplicateText(value: string) {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase("es-BO")
}

export default function AddCertificatesPage() {
  const navigate = useNavigate()
  const manager = useCertificatesManager()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [duplicateMessage, setDuplicateMessage] = useState("")

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setDuplicateMessage("")

    const certificateName = normalizeDuplicateText(manager.formData.name)
    const issuer = normalizeDuplicateText(manager.formData.issuer)
    const hasDuplicateCertificate =
      Boolean(certificateName) &&
      Boolean(issuer) &&
      manager.certificates.some((certificate) =>
        normalizeDuplicateText(certificate.name) === certificateName &&
        normalizeDuplicateText(certificate.issuer) === issuer,
      )

    if (hasDuplicateCertificate) {
      manager.updateField("name", manager.formData.name)
      manager.updateField("issuer", manager.formData.issuer)
      setDuplicateMessage("Ya existe un certificado registrado con el mismo nombre y emisor. Ingresa un certificado diferente.")
      return
    }

    await manager.handleSubmit(event)
  }

  return (
    <ExperiencePageShell
      title="Registrar Certificado"
      description="Registra un nuevo certificado o credencial en tu portafolio."
    >
      <FeedbackMessage message={manager.errorMessage || manager.pageError} type="error" />

      <CertificateFormCard
        formData={manager.formData}
        errors={manager.errors}
        isSaving={manager.isSaving}
        fileInput={manager.fileInput}
        fileInputRef={fileInputRef}
        onFieldChange={manager.updateField}
        onFileChange={manager.handleFileChange}
        onRemoveFile={manager.removeFile}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/certificados/ver")}
      />

      <ConfirmationModal
        isOpen={manager.showSuccessModal}
        onClose={() => {
          manager.closeSuccessModal()
          navigate("/certificados/ver")
        }}
        title="Exito"
        message={manager.successMessage}
        buttonText="Aceptar"
      />
      <DuplicateRegistrationModal
        title="Certificado duplicado"
        message={duplicateMessage}
        onClose={() => setDuplicateMessage("")}
      />
    </ExperiencePageShell>
  )
}
