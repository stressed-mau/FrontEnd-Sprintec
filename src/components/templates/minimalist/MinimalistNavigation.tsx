import { ArrowLeft, ArrowRight } from "lucide-react"
import { getSocialNetworkDisplayName, SocialNetworkIcon } from "@/components/portfolio/SocialNetworkIcon"
import type { MinimalistSocialNetwork } from "@/types/minimalistPortfolio"

type MinimalistNavigationProps = {
  page: number
  networks: MinimalistSocialNetwork[]
  onNextPage: () => void
  onPreviousPage: () => void
  onSocialClick?: (network: unknown) => void
}

export function MinimalistNavigation({ page, networks, onNextPage, onPreviousPage, onSocialClick }: MinimalistNavigationProps) {
  return (
    <div className="flex items-center justify-between mt-10 pt-6 border-t border-stone-100 sticky bottom-0 bg-white">
      <div className="flex gap-2">
        <button onClick={onPreviousPage} className="p-2 border border-stone-200 rounded-full hover:bg-stone-50 text-zinc-400 hover:text-zinc-900 transition-all">
          <ArrowLeft size={16} strokeWidth={1.5} />
        </button>
        <button onClick={onNextPage} className="p-2 bg-zinc-900 rounded-full hover:bg-zinc-800 text-stone-50 transition-all shadow-md">
          <ArrowRight size={16} strokeWidth={1.5} />
        </button>
      </div>
      <MinimalistNetworks networks={networks} onSocialClick={onSocialClick} />
      <div className="text-[10px] font-bold text-stone-200 uppercase tracking-[0.3em]">0{page + 1}</div>
    </div>
  )
}

function MinimalistNetworks({ networks, onSocialClick }: {
  networks: MinimalistSocialNetwork[]
  onSocialClick?: (network: unknown) => void
}) {
  return (
    <div className="flex gap-4 text-stone-300">
      {networks.map((network) => (
        <a
          key={network.id}
          href={network.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onSocialClick?.(network.source)}
          className="hover:text-zinc-900 transition-colors"
          title={getSocialNetworkDisplayName(network.source)}
        >
          <SocialNetworkIcon network={network.source} className="h-[18px] w-[18px]" />
        </a>
      ))}
    </div>
  )
}
