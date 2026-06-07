export type MinimalistTemplateProfile = {
  fullname?: string
  occupation?: string
  biography?: string
  image_url?: string
  public_email?: string
  nationality?: string
}

export type MinimalistTemplateProps = {
  profile?: MinimalistTemplateProfile | null
  portfolio?: MinimalistPortfolio | null
  isPreview?: boolean
  onProjectClick?: (projectId?: string | number) => void
  onExperienceClick?: (experienceId?: string | number) => void
  onEducationClick?: (educationId?: string | number) => void
  onCertificateClick?: (certificateId?: string | number) => void
  onSocialClick?: (network: unknown) => void
}

export type MinimalistPortfolio = {
  projects?: unknown[]
  skills?: unknown[]
  experiences?: unknown[]
  socialNetworks?: unknown[]
  educations?: unknown[]
  certificates?: unknown[]
}

export type MinimalistUser = {
  fullname: string
  occupation: string
  biography: string
  imageUrl: string
  publicEmail: string
  nationality: string
}

export type MinimalistSkill = {
  id: string
  label: string
  level: string
}

export type MinimalistProject = {
  id: string
  label: string
  role: string
  technologies: string[]
}

export type MinimalistExperience = {
  id: string
  key: string
  company: string
  position: string
  description: string
}

export type MinimalistEducation = {
  id: string
  title: string
  institution: string
}

export type MinimalistCertificate = {
  id: string
  name: string
  issuer: string
  source: Record<string, unknown>
}

export type MinimalistSocialNetwork = {
  id: string
  url: string
  source: Record<string, unknown>
}

export type MinimalistPageId =
  | "bio"
  | "skills"
  | "projects"
  | "experience"
  | "education"
  | "certificates"

export type MinimalistTemplateData = {
  user: MinimalistUser
  pageIds: MinimalistPageId[]
  skills: MinimalistSkill[]
  projects: MinimalistProject[]
  experiences: MinimalistExperience[]
  education: MinimalistEducation[]
  certificates: MinimalistCertificate[]
  networks: MinimalistSocialNetwork[]
}
