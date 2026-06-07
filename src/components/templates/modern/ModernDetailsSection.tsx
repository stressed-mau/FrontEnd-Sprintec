import { ModernCertificatesSection } from "@/components/templates/modern/ModernCertificatesSection"
import { ModernEducationSection } from "@/components/templates/modern/ModernEducationSection"
import { ModernExperienceSection } from "@/components/templates/modern/ModernExperienceSection"
import { ModernNetworksSection } from "@/components/templates/modern/ModernNetworksSection"
import type { ModernTemplateData } from "@/types/modernPortfolio"

type ModernDetailsSectionProps = {
  data: ModernTemplateData
  onExperienceClick?: (experienceId?: string | number) => void
  onEducationClick?: (educationId?: string | number) => void
  onCertificateClick?: (certificateId?: string | number) => void
  onSocialClick?: (network: unknown) => void
}

export function ModernDetailsSection(props: ModernDetailsSectionProps) {
  if (!hasDetails(props.data)) return null

  return (
    <section className="py-24 px-6 md:px-20">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20">
        <ModernExperienceSection experience={props.data.workExperience} onExperienceClick={props.onExperienceClick} />
        <div className="space-y-16">
          <ModernEducationSection education={props.data.academicExperience} onEducationClick={props.onEducationClick} />
          <ModernCertificatesSection certificates={props.data.certificates} onCertificateClick={props.onCertificateClick} />
          <ModernNetworksSection networks={props.data.socialNetworks} onSocialClick={props.onSocialClick} />
        </div>
      </div>
    </section>
  )
}

function hasDetails(data: ModernTemplateData) {
  return Boolean(data.workExperience.length || data.academicExperience.length || data.certificates.length || data.socialNetworks.length)
}
