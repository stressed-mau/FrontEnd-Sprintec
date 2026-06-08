import type { CorporateCertificateItem } from "@/types/corporatePortfolio"

type CorporateCertificatesSectionProps = {
  certificates: CorporateCertificateItem[]
  mode: "mobile" | "desktop"
  onCertificateClick?: (certificateId?: string | number) => void
}

export function CorporateCertificatesSection({ certificates, mode, onCertificateClick }: CorporateCertificatesSectionProps) {
  const isDesktop = mode === "desktop"
  if (!certificates.length && isDesktop) return null

  return (
    <section className={isDesktop ? "mt-6 lg:mt-8" : ""}>
      <h3 className={isDesktop ? "text-3xl font-black text-white" : "text-3xl font-bold"}>Certificados</h3>
      {certificates.length ? (
        <div className="mt-6 flex flex-wrap gap-4">
          {certificates.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onCertificateClick?.(item.id)}
              className={getCardClassName(isDesktop)}
            >
              <p className={isDesktop ? "text-lg font-bold text-white" : "text-lg font-bold"}>{item.title}</p>
              <p className={isDesktop ? "text-sm text-white/70" : "text-sm text-gray-500"}>{item.institution}</p>
            </button>
          ))}
        </div>
      ) : (
        <p className="mt-6 text-sm text-gray-500">No hay certificados registrados.</p>
      )}
    </section>
  )
}

function getCardClassName(isDesktop: boolean) {
  if (isDesktop) return "w-full rounded-[1.2rem] border border-white/10 bg-white/5 p-4 text-left transition hover:border-[#D6A96B]/60 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#D6A96B] sm:w-72 sm:max-w-full"
  return "w-full rounded-[1.35rem] border border-black/10 bg-white p-4 text-left transition hover:bg-[#F7F0E1] focus:outline-none focus:ring-2 focus:ring-[#8C6E46] sm:w-72 sm:max-w-full sm:rounded-[1.6rem] sm:p-5"
}
