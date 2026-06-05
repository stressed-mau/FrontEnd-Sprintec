import { SocialNetworkIcon } from "@/components/portfolio/SocialNetworkIcon"
import type { CorporatePortfolioLink } from "@/types/corporatePortfolio"

type CorporateSocialLinksProps = {
  links: CorporatePortfolioLink[]
  className?: string
  linkClassName: string
  onSocialClick?: (network: unknown) => void
}

export function CorporateSocialLinks({ links, className, linkClassName, onSocialClick }: CorporateSocialLinksProps) {
  if (!links.length) return null

  return (
    <div className={className}>
      {links.map((link) => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noreferrer"
          onClick={() => onSocialClick?.(link.source ?? link)}
          className={linkClassName}
        >
          <SocialNetworkIcon network={link.source ?? link} className="h-3.5 w-3.5" />
          {link.label}
        </a>
      ))}
    </div>
  )
}
