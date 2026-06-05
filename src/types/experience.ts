export type ExperienceType = "laboral" | "academica"

export interface ExperienceItem {
  id: string
  type: ExperienceType
  company: string
  email: string
  position: string
  location: string
  fieldOfStudy: string
  description: string
  startDate: string
  endDate: string
  current: boolean
  image: string
  certificate: string
}

export interface ExperiencePayload {
  type: ExperienceType
  company: string
  email: string
  position: string
  location: string
  fieldOfStudy: string
  description: string
  startDate: string
  endDate: string
  current: boolean
  logoFile?: File | null
  certificateFile?: File | null
  removeLogo?: boolean
  removeCertificate?: boolean
}
