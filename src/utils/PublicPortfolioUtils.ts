import { getSocialNetworkKey } from "@/components/portfolio/SocialNetworkIcon"

type PublicPortfolioRecord = Record<string, unknown>

function asRecord(value: unknown): PublicPortfolioRecord {
  return value && typeof value === "object" ? (value as PublicPortfolioRecord) : {}
}

function getNamedValues(value: unknown): string[] {
  if (!Array.isArray(value)) return []

  return value
    .map((item) => (typeof item === "string" ? item : getFirstText(asRecord(item).name)))
    .filter(Boolean)
}

export const asBoolean = (value: unknown): boolean => {
  if (typeof value === "boolean") return value
  if (typeof value === "number") return value === 1
  if (typeof value === "string") return ["1", "true", "si", "sí", "yes"].includes(value.trim().toLowerCase())
  return true
}

export const getProjectTechnologies = (project: unknown): string[] => {
  const record = asRecord(project)
  const technologies = getNamedValues(record.technologies)
  if (technologies.length > 0) return technologies

  const languages = getNamedValues(record.languages)
  if (languages.length > 0) return languages

  return getNamedValues(record.tecnologias)
}

export const getNetworkName = (network: unknown): string => {
  return getSocialNetworkKey(network)
}

export const getProjectTitle = (project: unknown): string => {
  const record = asRecord(project)
  return getFirstText(record.nombre, record.name, record.title) || "Proyecto sin titulo"
}

export const getProjectRole = (project: unknown): string => {
  const record = asRecord(project)
  return getFirstText(record.project_rol, record.role, record.rol)
}

export const getProjectDescription = (project: unknown): string => {
  const record = asRecord(project)
  return getFirstText(record.descripcion, record.description, record.summary)
}

export const getProjectStartDate = (project: unknown): string => {
  const record = asRecord(project)
  return getFirstText(record.fechaInicio, record.start_date, record.startDate)
}

export const getProjectEndDate = (project: unknown): string => {
  const record = asRecord(project)
  return getFirstText(record.fechaFin, record.end_date, record.endDate)
}

export const getProjectImage = (project: unknown): string => {
  const record = asRecord(project)
  return getFirstText(record.image, record.image_url, record.photograph)
}

export const getProjectGithubUrl = (project: unknown): string => {
  const record = asRecord(project)
  return getFirstText(record.url_to_project, record.github, record.github_url, record.repository_url)
}

export const getProjectDemoUrl = (project: unknown): string => {
  const record = asRecord(project)
  return getFirstText(record.url_to_deploy, record.demo, record.demo_url, record.project_url, record.url)
}

export const isProjectCurrent = (project: unknown): boolean => {
  const record = asRecord(project)
  const value = record.is_current ?? record.current
  if (typeof value === "boolean") return value
  if (typeof value === "number") return value === 1
  if (typeof value === "string") return ["1", "true", "si", "sí", "yes"].includes(value.trim().toLowerCase())
  return false
}

export const sameProjectId = (project: unknown, projectId?: string | number) =>
  projectId != null && String(asRecord(project).id) === String(projectId)

export const sameRecordId = (record: unknown, recordId?: string | number) =>
  recordId != null && String(asRecord(record).id) === String(recordId)

export const getPortfolioRecipientId = (portfolio: unknown): string => {
  const record = asRecord(portfolio)
  const profile = asRecord(record.profile)
  const profileUser = asRecord(profile.user)
  const config = asRecord(record.config)
  const configUser = asRecord(config.user)
  const owner = asRecord(record.owner)
  const user = asRecord(record.user)
  const value =
    record.user_id ||
    record.userId ||
    record.owner_id ||
    profile.user_id ||
    profile.userId ||
    profileUser.id ||
    config.user_id ||
    config.userId ||
    config.owner_id ||
    configUser.id ||
    owner.id ||
    user.id

  return value == null ? "" : String(value).trim()
}

export const getFirstText = (...values: unknown[]): string => {
  const value = values.find((item) => typeof item === "string" && item.trim())
  return typeof value === "string" ? value.trim() : ""
}

export const getExperienceTitle = (experience: unknown): string => {
  const record = asRecord(experience)
  return getFirstText(record.position, record.role, record.job_title, record.title) || "Cargo no especificado"
}

export const getExperienceCompany = (experience: unknown): string => {
  const record = asRecord(experience)
  return getFirstText(record.company, record.company_name, record.institution, record.organization)
}

export const getEducationTitle = (education: unknown): string => {
  const record = asRecord(education)
  return getFirstText(record.title, record.degree, record.career, record.name) || "Formacion no especificada"
}

export const getEducationInstitution = (education: unknown): string => {
  const record = asRecord(education)
  return getFirstText(record.institution, record.institution_name, record.company, record.school)
}

export const getRecordDescription = (item: unknown): string => {
  const record = asRecord(item)
  return getFirstText(record.description, record.descripcion, record.summary, record.details)
}

export const getRecordStartDate = (item: unknown): string => {
  const record = asRecord(item)
  return getFirstText(record.start_date, record.startDate, record.fechaInicio)
}

export const getRecordEndDate = (item: unknown): string => {
  const record = asRecord(item)
  return getFirstText(record.end_date, record.endDate, record.fechaFin)
}

export const getEducationField = (education: unknown): string => {
  const record = asRecord(education)
  return getFirstText(record.field_to_study, record.fieldOfStudy, record.field, record.area)
}

export const isCurrentRecord = (item: unknown): boolean => {
  const record = asRecord(item)
  const value = record.currently_studying ?? record.is_current ?? record.current ?? record.currently_working
  if (typeof value === "boolean") return value
  if (typeof value === "number") return value === 1
  if (typeof value === "string") return ["1", "true", "si", "sÃ­", "yes"].includes(value.trim().toLowerCase())
  return false
}
export type ProjectModalTheme = {
  fontClass: string
  panel: string
  header: string
  eyebrow: string
  title: string
  role: string
  closeButton: string
  sectionTitle: string
  text: string
  infoCard: string
  iconText: string
  tag: string
  primaryLink: string
  secondaryLink: string
}

export const PROJECT_MODAL_THEMES: Record<
  "modern" | "minimalist" | "corporate" | "default",
  ProjectModalTheme
> = {
  modern: {
    fontClass: "font-sans",
    panel: "bg-[#173b61] text-[#fcecd4]",
    header: "border-[#ee8e3b]/35 bg-[#173b61]",
    eyebrow: "text-[#ee8e3b]",
    title: "text-[#fcecd4]",
    role: "text-[#ee8e3b]",
    closeButton: "text-[#fcecd4]/75 hover:bg-[#2f606b] hover:text-[#fcecd4]",
    sectionTitle: "text-[#ee8e3b]",
    text: "text-[#fcecd4]/82",
    infoCard: "border-[#ee8e3b]/25 bg-[#2f606b]/55",
    iconText: "text-[#fcecd4]",
    tag: "bg-[#fcecd4] text-[#173b61]",
    primaryLink: "bg-[#ee8e3b] text-[#173b61] hover:bg-[#f6a762]",
    secondaryLink: "border border-[#ee8e3b] text-[#fcecd4] hover:bg-[#ee8e3b]/15",
  },

  minimalist: {
    fontClass: "font-sans",
    panel: "bg-white text-zinc-900",
    header: "border-stone-200 bg-white",
    eyebrow: "text-stone-500",
    title: "text-zinc-900",
    role: "text-stone-500",
    closeButton: "text-stone-500 hover:bg-stone-100 hover:text-zinc-900",
    sectionTitle: "text-zinc-900",
    text: "text-stone-700",
    infoCard: "border-stone-200 bg-stone-50",
    iconText: "text-zinc-900",
    tag: "bg-white text-stone-700 ring-1 ring-stone-200",
    primaryLink: "bg-zinc-900 text-white hover:bg-zinc-700",
    secondaryLink: "border border-zinc-900 text-zinc-900 hover:bg-stone-100",
  },

  corporate: {
    fontClass: "font-sans",
    panel: "bg-[#FBF8F2] text-[#1F2933]",
    header: "border-[#D7C3A4] bg-[#FBF8F2]",
    eyebrow: "text-[#8C6E46]",
    title: "text-[#1F2933]",
    role: "text-[#8C6E46]",
    closeButton: "text-[#6F7782] hover:bg-[#F2E7D7] hover:text-[#1F2933]",
    sectionTitle: "text-[#8C6E46]",
    text: "text-[#3D4348]",
    infoCard: "border-[#D7C3A4] bg-[#F2E7D7]/70",
    iconText: "text-[#1F2933]",
    tag: "border border-black/10 bg-[#F2E7D7] text-[#3D4348]",
    primaryLink: "bg-[#1F2933] text-[#F4D8AE] hover:bg-[#2F3A45]",
    secondaryLink: "border border-[#8C6E46] text-[#8C6E46] hover:bg-[#F2E7D7]",
  },

  default: {
    fontClass: "font-serif",
    panel: "bg-white text-gray-900",
    header: "border-[#D9EAF4] bg-white",
    eyebrow: "text-[#4982AD]",
    title: "text-[#003A6C]",
    role: "text-[#8C6E46]",
    closeButton: "text-gray-500 hover:bg-[#EEF5F9] hover:text-[#003A6C]",
    sectionTitle: "text-[#003A6C]",
    text: "text-gray-700",
    infoCard: "border-[#D9EAF4] bg-[#F8FBFD]",
    iconText: "text-[#003A6C]",
    tag: "bg-[#D9EAF4] text-[#003A6C]",
    primaryLink: "bg-[#003A6C] text-white hover:bg-[#002A4D]",
    secondaryLink: "border border-[#003A6C] text-[#003A6C] hover:bg-[#EEF5F9]",
  },
}
