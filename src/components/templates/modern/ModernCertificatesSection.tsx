import { Award } from "lucide-react"
import type { ModernCertificate } from "@/types/modernPortfolio"

type ModernCertificatesSectionProps = {
  certificates: ModernCertificate[]
}

export function ModernCertificatesSection({ certificates }: ModernCertificatesSectionProps) {
  if (!certificates.length) return null

  return (
    <div className="bg-white p-6 rounded-[1.75rem] shadow-xl border border-[#7d959e]/10 md:p-10 md:rounded-[2.5rem]">
      <div className="flex items-center gap-3 mb-8">
        <Award className="text-[#ee8e3b]" size={32} />
        <h3 className="text-2xl font-black uppercase">Certificaciones</h3>
      </div>
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        {certificates.map((certificate) => <CertificateCard key={`cert-${certificate.id}`} certificate={certificate} />)}
      </div>
    </div>
  )
}

function CertificateCard({ certificate }: { certificate: ModernCertificate }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#fcecd4]/30">
      <div className="mt-1">
        <Award size={20} className="text-[#2f606b]" />
      </div>
      <div>
        <h4 className="font-bold text-[#173b61]">{certificate.name}</h4>
        <p className="text-sm text-[#7d959e]">{certificate.issuer}</p>
      </div>
    </div>
  )
}
