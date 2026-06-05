import type { MinimalistCertificate } from "@/types/minimalistPortfolio"

type MinimalistCertificatesPageProps = {
  certificates: MinimalistCertificate[]
}

export function MinimalistCertificatesPage({ certificates }: MinimalistCertificatesPageProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h2 className="text-4xl font-black text-zinc-900 uppercase tracking-tighter">Certificados</h2>
      <div className="flex flex-wrap gap-4 pt-2">
        {certificates.map((certificate) => (
          <div key={certificate.id} className="w-full bg-stone-50 border border-stone-100 rounded-xl p-3 hover:shadow-md transition-all md:w-64 md:max-w-full md:rounded-2xl md:p-4">
            <h4 className="font-bold text-sm text-zinc-900 uppercase">{certificate.name}</h4>
            <p className="text-xs text-stone-400 italic">{certificate.issuer}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
