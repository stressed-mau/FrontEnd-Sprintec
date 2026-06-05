import { MinimalistBioPage } from "@/components/templates/minimalist/MinimalistBioPage"
import { MinimalistCertificatesPage } from "@/components/templates/minimalist/MinimalistCertificatesPage"
import { MinimalistEducationPage } from "@/components/templates/minimalist/MinimalistEducationPage"
import { MinimalistExperiencePage } from "@/components/templates/minimalist/MinimalistExperiencePage"
import { MinimalistProjectsPage } from "@/components/templates/minimalist/MinimalistProjectsPage"
import { MinimalistSkillsPage } from "@/components/templates/minimalist/MinimalistSkillsPage"
import type { MinimalistPageId, MinimalistTemplateData } from "@/types/minimalistPortfolio"

type MinimalistContentPageProps = {
  currentPageId: MinimalistPageId
  data: MinimalistTemplateData
  onProjectClick?: (projectId?: string | number) => void
  onExperienceClick?: (experienceId?: string | number) => void
  onEducationClick?: (educationId?: string | number) => void
}

export function MinimalistContentPage(props: MinimalistContentPageProps) {
  if (props.currentPageId === "bio") return <MinimalistBioPage user={props.data.user} />
  if (props.currentPageId === "skills") return <MinimalistSkillsPage skills={props.data.skills} />
  if (props.currentPageId === "projects") return <MinimalistProjectsPage projects={props.data.projects} onProjectClick={props.onProjectClick} />
  if (props.currentPageId === "experience") return <MinimalistExperiencePage experiences={props.data.experiences} onExperienceClick={props.onExperienceClick} />
  if (props.currentPageId === "education") return <MinimalistEducationPage education={props.data.education} onEducationClick={props.onEducationClick} />
  return <MinimalistCertificatesPage certificates={props.data.certificates} />
}
