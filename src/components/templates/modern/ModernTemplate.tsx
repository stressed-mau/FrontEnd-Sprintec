import { ModernDetailsSection } from "@/components/templates/modern/ModernDetailsSection"
import { ModernFooter } from "@/components/templates/modern/ModernFooter"
import { ModernHeader } from "@/components/templates/modern/ModernHeader"
import { ModernProfileSection } from "@/components/templates/modern/ModernProfileSection"
import { ModernProjectsSection } from "@/components/templates/modern/ModernProjectsSection"
import { ModernSkillsSection } from "@/components/templates/modern/ModernSkillsSection"
import { useModernTemplateData } from "@/hooks/useModernTemplateData"
import type { ModernTemplateProfile, ModernTemplateProps } from "@/types/modernPortfolio"

export default function ModernTemplate({
  profile,
  portfolio,
  isPreview = false,
  onProjectClick,
  onExperienceClick,
  onEducationClick,
  onCertificateClick,
  onSocialClick,
}: ModernTemplateProps) {
  const data = useModernTemplateData(profile, portfolio)
  const previewClassName = isPreview ? "scale-[0.8] origin-top-left border-8 border-[#173b61] rounded-[40px] shadow-2xl overflow-hidden" : ""

  return (
    <div className={`w-full min-h-screen font-sans bg-[#fcecd4] ${previewClassName} text-[#173b61]`}>
      <ModernHeader displayOccupation={data.displayOccupation} />
      <ModernProfileSection data={data} />
      <ModernSkillsSection technicalSkills={data.technicalSkills} softSkills={data.softSkills} />
      <ModernProjectsSection projects={data.projects} onProjectClick={onProjectClick} />
      <ModernDetailsSection
        data={data}
        onExperienceClick={onExperienceClick}
        onEducationClick={onEducationClick}
        onCertificateClick={onCertificateClick}
        onSocialClick={onSocialClick}
      />
      <ModernFooter displayName={data.displayName} />
    </div>
  )
}

export type { ModernTemplateProfile }
