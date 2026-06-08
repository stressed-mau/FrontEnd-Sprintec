import { CorporateCertificatesSection } from "@/components/templates/corporate/CorporateCertificatesSection"
import { CorporateEducationSection } from "@/components/templates/corporate/CorporateEducationSection"
import { CorporateExperienceSection } from "@/components/templates/corporate/CorporateExperienceSection"
import { CorporateIntroSection } from "@/components/templates/corporate/CorporateIntroSection"
import { CorporateProjectsSection } from "@/components/templates/corporate/CorporateProjectsSection"
import { CorporateSkillsSection } from "@/components/templates/corporate/CorporateSkillsSection"
import type { CorporateSectionId, CorporateTemplateData } from "@/types/corporatePortfolio"

type CorporateSectionContentProps = {
  sectionId: CorporateSectionId
  data: CorporateTemplateData
  isActive?: boolean
  mode: "mobile" | "desktop"
  onProjectClick?: (projectId?: string | number) => void
  onExperienceClick?: (experienceId?: string | number) => void
  onEducationClick?: (educationId?: string | number) => void
  onCertificateClick?: (certificateId?: string | number) => void
  onSocialClick?: (network: unknown) => void
}

export function CorporateSectionContent(props: CorporateSectionContentProps) {
  if (props.sectionId === "corporate-intro") return <CorporateIntroSection {...props} />
  if (props.sectionId === "corporate-experience") return <CorporateExperienceSection {...props} experience={props.data.experience} />
  if (props.sectionId === "corporate-certificates") return <CorporateCertificatesSection mode={props.mode} certificates={props.data.certificates} onCertificateClick={props.onCertificateClick} />
  if (props.sectionId === "corporate-education") return <CorporateEducationSection {...props} education={props.data.education} />
  if (props.sectionId === "corporate-projects") return <CorporateProjectsSection {...props} projects={props.data.projects} />
  return <CorporateSkillsSection mode={props.mode} isActive={props.isActive} skills={props.data.skills} />
}
