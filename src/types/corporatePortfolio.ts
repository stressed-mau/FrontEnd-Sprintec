import type { ReactNode } from "react"

export type CorporateSectionId =
  | "corporate-intro"
  | "corporate-experience"
  | "corporate-certificates"
  | "corporate-education"
  | "corporate-projects"
  | "corporate-skills"

export type CorporatePortfolioLink = {
  id: string
  label: string
  url: string
  source?: unknown
}

export type CorporatePortfolioProfile = {
  fullname: string
  occupation: string
  image_url: string
  residence: string
  public_email: string
  phone: string
  biography: string
}

export type CorporatePortfolioSheet = {
  id: CorporateSectionId
  label: string
  content: ReactNode
}

export type CorporateTemplateSection = {
  id: CorporateSectionId
  label: string
}

export type CorporateExperienceItem = {
  id: string
  title: string
  organization: string
  period: string
  description: string
  image: string
}

export type CorporateEducationItem = {
  id: string
  title: string
  institution: string
  period: string
}

export type CorporateCertificateItem = {
  id: string
  title: string
  institution: string
  period: string
  source: Record<string, unknown>
}

export type CorporateSkillItem = {
  id: string
  name: string
  type: "tecnica" | "blanda"
  level: string
}

export type CorporateProjectItem = {
  id: string
  name: string
  role: string
  description: string
  image: string
  stack: string[]
}

export type CorporateTemplateData = {
  displayName: string
  displayRole: string
  displaySummary: string
  displayEmail: string
  displayLocation: string
  displayPhone: string
  displayProfileImage: string
  initials: string
  hasContactInfo: boolean
  socialLinks: CorporatePortfolioLink[]
  skills: CorporateSkillItem[]
  experience: CorporateExperienceItem[]
  education: CorporateEducationItem[]
  certificates: CorporateCertificateItem[]
  projects: CorporateProjectItem[]
  sections: CorporateTemplateSection[]
}

export type CorporatePortfolioProps = {
  profile?: CorporatePortfolioProfile | null
  portfolio?: {
    projects?: unknown[]
    skills?: unknown[]
    experiences?: unknown[]
    certificates?: unknown[]
    socialNetworks?: unknown[]
    educations?: unknown[]
  } | null
  onProjectClick?: (projectId?: string | number) => void
  onExperienceClick?: (experienceId?: string | number) => void
  onEducationClick?: (educationId?: string | number) => void
  onCertificateClick?: (certificateId?: string | number) => void
  onSocialClick?: (network: unknown) => void
}
