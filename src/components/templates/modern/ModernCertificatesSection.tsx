import { Award } from "lucide-react"
import type { ModernCertificate } from "@/types/modernPortfolio"

type ModernCertificatesSectionProps = {
  certificates: ModernCertificate[]
  onCertificateClick?: (certificateId?: string | number) => void
}

export function ModernCertificatesSection({ certificates, onCertificateClick }: ModernCertificatesSectionProps) {
  if (!certificates.length) return null

  return (
    <div className="bg-white p-6 rounded-[1.75rem] shadow-xl border border-[#7d959e]/10 md:p-10 md:rounded-[2.5rem]">
      <div className="flex items-center gap-3 mb-8">
        <Award className="text-[#ee8e3b]" size={32} />
        <h3 className="text-2xl font-black uppercase">Certificaciones</h3>
      </div>
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        {certificates.map((certificate) => <CertificateCard key={`cert-${certificate.id}`} certificate={certificate} onCertificateClick={onCertificateClick} />)}
      </div>
    </div>
  )
}

function CertificateCard({ certificate, onCertificateClick }: { certificate: ModernCertificate; onCertificateClick?: (certificateId?: string | number) => void }) {
  return (
    <button
      type="button"
      onClick={() => onCertificateClick?.(certificate.id)}
      className="flex w-full items-start gap-4 rounded-2xl bg-[#fcecd4]/30 p-4 text-left transition hover:bg-[#fcecd4]/55 focus:outline-none focus:ring-2 focus:ring-[#ee8e3b]"
    >
      <div className="mt-1">
        <Award size={20} className="text-[#2f606b]" />
      </div>
      <div>
        <h4 className="font-bold text-[#173b61]">{certificate.name}</h4>
        <p className="text-sm text-[#7d959e]">{certificate.issuer}</p>
      </div>
    </button>
  )
}
