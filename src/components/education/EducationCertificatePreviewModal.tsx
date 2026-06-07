import { CertificateDocumentPreviewModal } from "@/components/certificates/CertificateDocumentPreview"

export function EducationCertificatePreviewModal({
  url,
  onClose,
}: {
  url: string | null
  onClose: () => void
}) {
  return <CertificateDocumentPreviewModal url={url} onClose={onClose} />
}
