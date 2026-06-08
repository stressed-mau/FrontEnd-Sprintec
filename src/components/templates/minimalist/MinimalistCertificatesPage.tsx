import type { MinimalistCertificate } from "@/types/minimalistPortfolio"

type MinimalistCertificatesPageProps = {
  certificates: MinimalistCertificate[]
  onCertificateClick?: (certificateId?: string | number) => void
}

export function MinimalistCertificatesPage({ certificates, onCertificateClick }: MinimalistCertificatesPageProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h2 className="text-4xl font-black text-zinc-900 uppercase tracking-tighter">Certificados</h2>
      <div className="flex flex-wrap gap-4 pt-2">
        {certificates.map((certificate) => (
          <button
            key={certificate.id}
            type="button"
            onClick={() => onCertificateClick?.(certificate.id)}
            className="w-full rounded-xl border border-stone-100 bg-stone-50 p-3 text-left transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-zinc-900 md:w-64 md:max-w-full md:rounded-2xl md:p-4"
          >
            <h4 className="font-bold text-sm text-zinc-900 uppercase">{certificate.name}</h4>
            <p className="text-xs text-stone-400 italic">{certificate.issuer}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
