import { CorporateHeroSection } from "@/components/templates/corporate/CorporateHeroSection"
import { CorporateSectionContent } from "@/components/templates/corporate/CorporateSectionContent"
import type { CorporateSectionId, CorporateTemplateData } from "@/types/corporatePortfolio"

type CorporateDesktopLayoutProps = {
  data: CorporateTemplateData
  activeSectionId: string | null
  onProjectClick?: (projectId?: string | number) => void
  onExperienceClick?: (experienceId?: string | number) => void
  onEducationClick?: (educationId?: string | number) => void
  onSocialClick?: (network: unknown) => void
}

export function CorporateDesktopLayout(props: CorporateDesktopLayoutProps) {
  const hasDetails = hasDetailSections(props.data)

  return (
    <div className="hidden lg:block">
      <CorporateHeroSection displayName={props.data.displayName} displayRole={props.data.displayRole} initials={props.data.initials} />
      <CorporateSectionContent {...props} mode="desktop" sectionId="corporate-intro" isActive={props.activeSectionId === "corporate-intro"} />
      {hasDetails ? <CorporateDetailsGrid {...props} /> : null}
    </div>
  )
}

function CorporateDetailsGrid(props: CorporateDesktopLayoutProps) {
  return (
    <section className="grid border-t border-white/10 lg:grid-cols-[0.88fr_1.12fr]">
      <div className="bg-[#141414] px-8 py-10">
        <DesktopSection props={props} sectionId="corporate-education" />
        <CorporateSectionContent {...props} mode="desktop" sectionId="corporate-certificates" />
        <DesktopSection props={props} sectionId="corporate-experience" />
      </div>
      <div className="px-8 py-10 transition-colors duration-300 bg-[#EFE8DE] text-[#111111]">
        <DesktopSection props={props} sectionId="corporate-skills" />
        <DesktopSection props={props} sectionId="corporate-projects" />
      </div>
    </section>
  )
}

function DesktopSection({ props, sectionId }: { props: CorporateDesktopLayoutProps; sectionId: CorporateSectionId }) {
  return (
    <CorporateSectionContent
      {...props}
      mode="desktop"
      sectionId={sectionId}
      isActive={props.activeSectionId === sectionId}
    />
  )
}

function hasDetailSections(data: CorporateTemplateData) {
  return Boolean(data.education.length || data.certificates.length || data.skills.length || data.experience.length || data.projects.length)
}
