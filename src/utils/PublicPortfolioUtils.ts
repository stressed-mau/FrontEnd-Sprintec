import { getSocialNetworkKey } from "@/components/portfolio/SocialNetworkIcon"
export const asBoolean = (value: unknown): boolean => {
  if (typeof value === "boolean") return value
  if (typeof value === "number") return value === 1
  if (typeof value === "string") return ["1", "true", "si", "sí", "yes"].includes(value.trim().toLowerCase())
  return true
}

export const getProjectTechnologies = (project: any): string[] => (
  project.technologies ??
  project.languages?.map((technology: any) => technology.name ?? technology) ??
  project.tecnologias?.map((technology: any) => technology.name ?? technology) ??
  []
).filter(Boolean)

export const getNetworkName = (network: any): string => {
  return getSocialNetworkKey(network)
}

export const getProjectTitle = (project: any): string =>
  project?.nombre || project?.name || project?.title || "Proyecto sin titulo"

export const getProjectRole = (project: any): string =>
  project?.project_rol || project?.role || project?.rol || ""

export const getProjectDescription = (project: any): string =>
  project?.descripcion || project?.description || project?.summary || ""

export const getProjectStartDate = (project: any): string =>
  project?.fechaInicio || project?.start_date || project?.startDate || ""

export const getProjectEndDate = (project: any): string =>
  project?.fechaFin || project?.end_date || project?.endDate || ""

export const getProjectImage = (project: any): string =>
  project?.image || project?.image_url || project?.photograph || ""

export const getProjectGithubUrl = (project: any): string =>
  project?.url_to_project || project?.github || project?.github_url || project?.repository_url || ""

export const getProjectDemoUrl = (project: any): string =>
  project?.url_to_deploy || project?.demo || project?.demo_url || project?.project_url || project?.url || ""

export const isProjectCurrent = (project: any): boolean => {
  const value = project?.is_current ?? project?.current
  if (typeof value === "boolean") return value
  if (typeof value === "number") return value === 1
  if (typeof value === "string") return ["1", "true", "si", "sí", "yes"].includes(value.trim().toLowerCase())
  return false
}

export const sameProjectId = (project: any, projectId?: string | number) =>
  projectId != null && String(project?.id) === String(projectId)

export const sameRecordId = (record: any, recordId?: string | number) =>
  recordId != null && String(record?.id) === String(recordId)

export const getPortfolioRecipientId = (portfolio: any): string => {
  const value =
    portfolio?.user_id ||
    portfolio?.userId ||
    portfolio?.owner_id ||
    portfolio?.profile?.user_id ||
    portfolio?.profile?.userId ||
    portfolio?.profile?.user?.id ||
    portfolio?.config?.user_id ||
    portfolio?.config?.userId ||
    portfolio?.config?.owner_id ||
    portfolio?.config?.user?.id ||
    portfolio?.owner?.id ||
    portfolio?.user?.id

  return value == null ? "" : String(value).trim()
}

export const getFirstText = (...values: unknown[]): string => {
  const value = values.find((item) => typeof item === "string" && item.trim())
  return typeof value === "string" ? value.trim() : ""
}

export const getExperienceTitle = (experience: any): string =>
  getFirstText(experience?.position, experience?.role, experience?.job_title, experience?.title) || "Cargo no especificado"

export const getExperienceCompany = (experience: any): string =>
  getFirstText(experience?.company, experience?.company_name, experience?.institution, experience?.organization)

export const getEducationTitle = (education: any): string =>
  getFirstText(education?.title, education?.degree, education?.career, education?.name) || "Formacion no especificada"

export const getEducationInstitution = (education: any): string =>
  getFirstText(education?.institution, education?.institution_name, education?.company, education?.school)

export const getRecordDescription = (record: any): string =>
  getFirstText(record?.description, record?.descripcion, record?.summary, record?.details)

export const getRecordStartDate = (record: any): string =>
  getFirstText(record?.start_date, record?.startDate, record?.fechaInicio)

export const getRecordEndDate = (record: any): string =>
  getFirstText(record?.end_date, record?.endDate, record?.fechaFin)

export const getEducationField = (education: any): string =>
  getFirstText(education?.field_to_study, education?.fieldOfStudy, education?.field, education?.area)

export const isCurrentRecord = (record: any): boolean => {
  const value = record?.currently_studying ?? record?.is_current ?? record?.current ?? record?.currently_working
  if (typeof value === "boolean") return value
  if (typeof value === "number") return value === 1
  if (typeof value === "string") return ["1", "true", "si", "sÃ­", "yes"].includes(value.trim().toLowerCase())
  return false
}
export type ProjectModalTheme = {
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