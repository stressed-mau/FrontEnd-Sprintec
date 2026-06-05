import { getSocialNetworkDisplayName, SocialNetworkIcon } from "@/components/portfolio/SocialNetworkIcon"
import type { ModernSocialNetwork } from "@/types/modernPortfolio"

type ModernNetworksSectionProps = {
  networks: ModernSocialNetwork[]
  onSocialClick?: (network: unknown) => void
}

export function ModernNetworksSection({ networks, onSocialClick }: ModernNetworksSectionProps) {
  if (!networks.length) return null

  return (
    <div className="text-center bg-[#2f606b] p-6 rounded-[1.75rem] md:p-10 md:rounded-[2.5rem]">
      <h3 className="text-[#fcecd4] text-xl font-black mb-8 uppercase tracking-widest">Conectemos</h3>
      <div className="flex justify-center gap-6">
        {networks.map((network) => (
          <a
            key={network.key}
            href={network.url}
            target="_blank"
            rel="noreferrer"
            onClick={() => onSocialClick?.(network.source)}
            className="w-14 h-14 bg-[#fcecd4] rounded-2xl flex items-center justify-center text-[#173b61] hover:bg-[#ee8e3b] hover:text-white transition-all transform hover:-translate-y-2 shadow-lg"
            title={getSocialNetworkDisplayName(network.source)}
          >
            <SocialNetworkIcon network={network.source} className="h-6 w-6" />
          </a>
        ))}
      </div>
    </div>
  )
}
