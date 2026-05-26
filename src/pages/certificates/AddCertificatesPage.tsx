import { useRef } from "react"
import { useNavigate } from "react-router-dom"

import ConfirmationModal from "@/components/ConfirmationModal"
import { useCertificatesManager } from "@/hooks/useCertificatesManager"
import { CertificateFormCard } from "@/pages/certificates/CertificatePageParts"
import { ExperiencePageShell, FeedbackMessage } from "@/pages/experience/ExperiencePageParts"

export default function AddCertificatesPage() {
  const navigate = useNavigate()
  const manager = useCertificatesManager()
  const fileInputRef = useRef<HTMLInputElement>(null)

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
        onSubmit={manager.handleSubmit}
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
    </ExperiencePageShell>
  )
}
