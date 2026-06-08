export type ModernTemplateProfile = {
  fullname: string
  occupation: string
  image_url: string
  residence: string
  public_email: string
  phone: string
  biography: string
}

export type ModernTemplateProps = {
  profile?: ModernTemplateProfile | null
  portfolio?: ModernPortfolio | null
  isPreview?: boolean
  onProjectClick?: (projectId?: string | number) => void
  onExperienceClick?: (experienceId?: string | number) => void
  onEducationClick?: (educationId?: string | number) => void
  onCertificateClick?: (certificateId?: string | number) => void
  onSocialClick?: (network: unknown) => void
}

export type ModernPortfolio = {
  projects?: unknown[]
  skills?: unknown[]
  socialNetworks?: unknown[]
  experiences?: unknown[]
  educations?: unknown[]
  certificates?: unknown[]
}

export type ModernSkill = {
  id: string
  key: string
  name: string
  sublabel: string
  type: "tecnica" | "blanda"
  level: string
}

export type ModernProject = {
  id: string
  key: string
  name: string
  role: string
  image: string
  technologies: string[]
}

export type ModernExperience = {
  id: string
  key: string
  company: string
  position: string
  image: string
}

export type ModernEducation = {
  id: string
  key: string
  title: string
  institution: string
}

export type ModernCertificate = {
  id: string
  name: string
  issuer: string
  source: Record<string, unknown>
}

export type ModernSocialNetwork = {
  id: string
  key: string
  url: string
  source: Record<string, unknown>
}

export type ModernTemplateData = {
  displayName: string
  displayOccupation: string
  displayBiography: string
  displayResidence: string
  displayEmail: string
  displayPhone: string
  userInitial: string
  imageUrl: string
  skills: ModernSkill[]
  highlightedSkills: ModernSkill[]
  projects: ModernProject[]
  workExperience: ModernExperience[]
  academicExperience: ModernEducation[]
  certificates: ModernCertificate[]
  socialNetworks: ModernSocialNetwork[]
}
