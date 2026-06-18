import { useState } from "react"
import { CorporateDesktopLayout } from "@/components/templates/corporate/CorporateDesktopLayout"
import { CorporateHeader } from "@/components/templates/corporate/CorporateHeader"
import { CorporateMobileLayout } from "@/components/templates/corporate/CorporateMobileLayout"
import { useCorporatePortfolioData } from "@/hooks/useCorporatePortfolioData"
import type { CorporatePortfolioLink, CorporatePortfolioProps, CorporatePortfolioProfile } from "@/types/corporatePortfolio"

export function CorporatePortfolioTemplate(props: CorporatePortfolioProps) {
  const data = useCorporatePortfolioData(props.profile, props.portfolio)
  const [activeSectionId, setActiveSectionId] = useState<string | null>(data.sections[0]?.id ?? null)

  return (
    <article className="overflow-hidden rounded-[2rem] border border-[#26221D] bg-[#111111] font-sans text-white shadow-[0_28px_90px_rgba(0,0,0,0.35)]">
      <CorporateHeader displayEmail={data.displayEmail} displayLocation={data.displayLocation} displayPhone={data.displayPhone} />
      <CorporateMobileLayout
        data={data}
        activeSectionId={activeSectionId}
        onActiveSectionChange={setActiveSectionId}
        onProjectClick={props.onProjectClick}
        onExperienceClick={props.onExperienceClick}
        onEducationClick={props.onEducationClick}
        onCertificateClick={props.onCertificateClick}
        onSocialClick={props.onSocialClick}
      />
      <CorporateDesktopLayout
        data={data}
        activeSectionId={activeSectionId}
        onProjectClick={props.onProjectClick}
        onExperienceClick={props.onExperienceClick}
        onEducationClick={props.onEducationClick}
        onCertificateClick={props.onCertificateClick}
        onSocialClick={props.onSocialClick}
      />
    </article>
  )
}

export type { CorporatePortfolioLink, CorporatePortfolioProfile }
