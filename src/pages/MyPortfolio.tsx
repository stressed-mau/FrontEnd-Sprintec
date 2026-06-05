import Header from "../components/HeaderUser"
import Sidebar from "../components/Sidebar"
import type { Portfolio } from "@/types/portfolio"
import { usePortfolio } from "@/hooks/usePortfolio"
import type { PortfolioVisibilityData } from "@/services/portfolioVisibilityService"
import { Mail, MapPin, Briefcase, Code, GraduationCap, Award, X, ExternalLink } from "lucide-react"
import MinimalistTemplate from "@/components/templates/MinimalistTemplate"
import ModernTemplate from "@/components/templates/ModernTemplate"
import { CorporatePortfolioTemplate } from "@/components/templates/corporate/CorporatePortfolioTemplate"
import { getSocialNetworkDisplayName, SocialNetworkIcon } from "@/components/portfolio/SocialNetworkIcon"
import { useUserPersonalData } from "@/hooks/useUserPersonalData"
import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"

type PortfolioDetailType = "project" | "experience" | "education"
type PortfolioDetailTheme = "modern" | "minimalist" | "corporate" | "default"
type SelectedPortfolioDetail = {
  type: PortfolioDetailType
  item: any
} | null

const asBoolean = (value: any): boolean => {
  if (typeof value === "boolean") return value
  if (typeof value === "number") return value === 1
  if (typeof value === "string") return value === "1" || value === "true"
  return true
}
const mapToVisibilityData = (portfolio: Portfolio): PortfolioVisibilityData => ({
  projects: portfolio.projects.map((p, index) => ({
    id: Number(p.id ?? index),
    label: p.nombre ?? "",
    sublabel: (p as any).project_rol ?? (p as any).role ?? (p as any).rol ?? "",
    checked: asBoolean(p.is_public),
    sourceTable: "projects",
  })),
  skills: portfolio.skills.map((s, index) => ({
    id: Number(s.id ?? index),
    label: s.name ?? "",
    sublabel: s.level ?? "",
    checked: asBoolean(s.is_public),
    sourceTable: "skills",
  })),
  experience: portfolio.experiences
  .filter(e => e.type !== "academica")
  .map((e: any, index) => ({
    id: Number(e.id ?? index),
    label: e.rol ?? e.position ?? "",
    sublabel: e.company_name ?? e.company ?? "",
    checked: asBoolean(e.is_public),
    sourceTable: "work_experiences",
  })),

  education: portfolio.educations?.map((e: any, index) => ({
    id: Number(e.id ?? index),
    label: e.title || "Sin título",
    sublabel: e.institution || "Sin institución",
    checked: asBoolean(e.is_public),
    sourceTable: "educations",
  })) ?? [],
  certificates: (portfolio as any).certificates?.map((cert: any, index: number) => ({
    id: index,
    label: cert.name ?? "",
    sublabel: cert.issuer ?? "",
    checked: asBoolean(cert.is_public),
    sourceTable: "certificates",
    date: cert.date_issued,
    url: cert.credential_url,
  })) ?? [],
  networks: portfolio.socialNetworks.map((n, index) => ({
    id: Number(n.id ?? index),
    label: getSocialNetworkDisplayName(n),
    sublabel: n.url ?? "",
    checked: asBoolean(n.is_public),
    sourceTable: "social_networks",
  })),

})

function asText(value: unknown): string {
  if (typeof value === "string") return value.trim()
  if (typeof value === "number") return String(value)
  return ""
}

function getFirstText(...values: unknown[]) {
  for (const value of values) {
    const text = asText(value)
    if (text) return text
  }

  return ""
}

function getProjectTitle(project: any) {
  return getFirstText(project?.nombre, project?.name, project?.title) || "Proyecto sin titulo"
}

function getProjectRole(project: any) {
  return getFirstText(project?.project_rol, project?.role, project?.rol)
}

function getProjectTechnologies(project: any): string[] {
  const source = project?.technologies?.length
    ? project.technologies
    : project?.tecnologias?.length
      ? project.tecnologias
      : project?.languages ?? []

  return Array.isArray(source)
    ? source
        .map((technology: any) => getFirstText(technology?.name, technology?.nombre, technology?.title, technology))
        .filter(Boolean)
    : []
}

function getProjectImage(project: any) {
  return getFirstText(project?.image, project?.image_url, project?.photograph)
}

function getExperienceCompany(experience: any) {
  return getFirstText(experience?.company, experience?.company_name) || "Empresa no especificada"
}

function getExperiencePosition(experience: any) {
  return getFirstText(experience?.position, experience?.role, experience?.rol) || "Cargo no especificado"
}

function getEducationTitle(education: any) {
  return getFirstText(education?.title, education?.position, education?.degree, education?.name, education?.label) || "Formacion sin titulo"
}

function getEducationInstitution(education: any) {
  return getFirstText(education?.institution, education?.company, education?.company_name, education?.institution_name, education?.organization, education?.sublabel) || "Sin institucion"
}

function getEducationField(education: any) {
  return getFirstText(education?.field_to_study, education?.fieldOfStudy, education?.field_of_study, education?.field)
}

function getDateText(value: unknown) {
  const text = asText(value)
  return text ? text.slice(0, 10) : ""
}

function getCurrentText(value: unknown, trueLabel: string, falseLabel: string) {
  if (typeof value === "boolean") return value ? trueLabel : falseLabel
  if (typeof value === "number") return value === 1 ? trueLabel : falseLabel
  if (typeof value === "string" && value.trim()) {
    return ["1", "true", "si", "sí", "yes"].includes(value.trim().toLowerCase()) ? trueLabel : falseLabel
  }

  return ""
}

const DETAIL_MODAL_THEMES: Record<PortfolioDetailTheme, {
  overlay: string
  panel: string
  header: string
  eyebrow: string
  title: string
  subtitle: string
  closeButton: string
  body: string
  label: string
  value: string
  tag: string
  divider: string
  link: string
}> = {
  modern: {
    overlay: "bg-[#173b61]/72",
    panel: "bg-[#fcecd4] text-[#173b61] ring-1 ring-[#ee8e3b]/35",
    header: "border-[#ee8e3b]/35 bg-[#173b61] text-[#fcecd4]",
    eyebrow: "text-[#ee8e3b]",
    title: "text-[#fcecd4]",
    subtitle: "text-[#fcecd4]/78",
    closeButton: "text-[#fcecd4]/80 hover:bg-[#2f606b] hover:text-[#fcecd4]",
    body: "bg-[#fcecd4]",
    label: "text-[#2f606b]",
    value: "text-[#173b61]",
    tag: "bg-[#173b61] text-[#fcecd4]",
    divider: "border-[#ee8e3b]/30",
    link: "border-[#ee8e3b] bg-[#ee8e3b] text-[#173b61] hover:bg-[#f6a762]",
  },
  minimalist: {
    overlay: "bg-zinc-950/62",
    panel: "bg-white text-zinc-900 ring-1 ring-stone-200",
    header: "border-stone-200 bg-white",
    eyebrow: "text-stone-500",
    title: "text-zinc-900",
    subtitle: "text-stone-500",
    closeButton: "text-stone-500 hover:bg-stone-100 hover:text-zinc-900",
    body: "bg-white",
    label: "text-stone-500",
    value: "text-zinc-900",
    tag: "bg-stone-100 text-zinc-800 ring-1 ring-stone-200",
    divider: "border-stone-200",
    link: "border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-700",
  },
  corporate: {
    overlay: "bg-[#111111]/72",
    panel: "bg-[#FBF8F2] text-[#1F2933] ring-1 ring-[#D7C3A4]",
    header: "border-[#D7C3A4] bg-[#1F2933] text-[#F4D8AE]",
    eyebrow: "text-[#D6A96B]",
    title: "text-[#F4D8AE]",
    subtitle: "text-[#D7C3A4]",
    closeButton: "text-[#F4D8AE]/80 hover:bg-[#2F3A45] hover:text-[#F4D8AE]",
    body: "bg-[#FBF8F2]",
    label: "text-[#8C6E46]",
    value: "text-[#1F2933]",
    tag: "border border-black/10 bg-[#F2E7D7] text-[#3D4348]",
    divider: "border-[#D7C3A4]",
    link: "border-[#1F2933] bg-[#1F2933] text-[#F4D8AE] hover:bg-[#2F3A45]",
  },
  default: {
    overlay: "bg-black/55",
    panel: "bg-white text-[#003A6C] ring-1 ring-[#D9EAF4]",
    header: "border-[#D9EAF4] bg-white",
    eyebrow: "text-[#4982AD]",
    title: "text-[#003A6C]",
    subtitle: "text-[#4B778D]",
    closeButton: "text-[#003A6C] hover:bg-[#EEF5F9]",
    body: "bg-white",
    label: "text-[#6B7E8E]",
    value: "text-[#003A6C]",
    tag: "bg-[#EEF5F9] text-[#003A6C]",
    divider: "border-[#D9EAF4]",
    link: "border-[#A5D7E8] bg-[#EEF5F9] text-[#003A6C] hover:bg-[#D9EAF4]",
  },
}

function PortfolioRecordModal({
  selected,
  theme,
  onClose,
}: {
  selected: SelectedPortfolioDetail
  theme: PortfolioDetailTheme
  onClose: () => void
}) {
  if (!selected) return null

  const modalTheme = DETAIL_MODAL_THEMES[theme]
  const { type, item } = selected
  const isProject = type === "project"
  const isExperience = type === "experience"
  const title = isProject
    ? getProjectTitle(item)
    : isExperience
      ? getExperiencePosition(item)
      : getEducationTitle(item)
  const subtitle = isProject
    ? getProjectRole(item)
    : isExperience
      ? getExperienceCompany(item)
      : getEducationInstitution(item)
  const heading = isProject ? "Detalle de proyecto" : isExperience ? "Detalle de experiencia" : "Detalle de formacion academica"
  const image = isProject ? getProjectImage(item) : getFirstText(item?.image, item?.logo, item?.logo_url)
  const certificate = getFirstText(
    item?.certificate,
    item?.certificate_url,
    item?.certification_url,
    item?.certificate_file_url,
    item?.document_url,
    item?.file_url,
  )
  const projectRepository = getFirstText(item?.url_to_project, item?.github, item?.github_url, item?.repository_url)
  const projectDemo = getFirstText(item?.url_to_deploy, item?.demo, item?.demo_url, item?.project_url, item?.url)
  const technologies = isProject ? getProjectTechnologies(item) : []
  const rows = isProject
    ? [
        ["Nombre", getProjectTitle(item)],
        ["Rol", getProjectRole(item)],
        ["Descripcion", getFirstText(item?.descripcion, item?.description, item?.summary)],
        ["Fecha de inicio", getDateText(item?.fechaInicio ?? item?.start_date ?? item?.startDate ?? item?.initial_date)],
        ["Fecha de fin", getCurrentText(item?.is_current ?? item?.current, "En curso", "") || getDateText(item?.fechaFin ?? item?.end_date ?? item?.endDate ?? item?.final_date)],
      ]
    : isExperience
      ? [
          ["Empresa", getExperienceCompany(item)],
          ["Cargo", getExperiencePosition(item)],
          ["Correo", getFirstText(item?.email, item?.company_email)],
          ["Ubicacion", getFirstText(item?.location, item?.ubicacion)],
          ["Descripcion", getFirstText(item?.description, item?.descripcion)],
          ["Fecha de inicio", getDateText(item?.startDate ?? item?.start_date ?? item?.initial_date)],
          ["Fecha de fin", getCurrentText(item?.current ?? item?.is_current, "Actual", "") || getDateText(item?.endDate ?? item?.end_date ?? item?.final_date)],
        ]
      : [
          ["Institucion", getEducationInstitution(item)],
          ["Nivel de formacion", getEducationTitle(item)],
          ["Area de estudio", getEducationField(item)],
          ["Descripcion", getFirstText(item?.description, item?.descripcion)],
          ["Fecha de emision", getCurrentText(item?.currently_studying ?? item?.current ?? item?.is_current, "Cursando actualmente", "") || getDateText(item?.endDate ?? item?.end_date ?? item?.final_date)],
        ]
  const visibleRows = rows.filter(([, value]) => Boolean(value))

  return (
    <div className={`fixed inset-0 z-[160] flex items-center justify-center p-4 backdrop-blur-sm ${modalTheme.overlay}`}>
      <div className={`max-h-[86dvh] w-[min(100%,28rem)] overflow-y-auto rounded-xl shadow-2xl ${modalTheme.panel}`}>
        <div className={`sticky top-0 z-10 flex items-start justify-between gap-3 border-b px-4 py-3 sm:px-4 ${modalTheme.header}`}>
          <div className="min-w-0">
            <p className={`text-xs font-bold uppercase tracking-[0.18em] ${modalTheme.eyebrow}`}>{heading}</p>
            <h2 className={`mt-1 break-words text-lg font-bold leading-tight sm:text-xl ${modalTheme.title}`}>{title}</h2>
            {subtitle ? <p className={`mt-1 break-words text-sm font-semibold ${modalTheme.subtitle}`}>{subtitle}</p> : null}
          </div>
          <button type="button" onClick={onClose} className={`shrink-0 rounded-full p-2 transition ${modalTheme.closeButton}`} aria-label="Cerrar detalle">
            <X className="h-5 w-5" />
          </button>
        </div>

        {image ? <img src={image} alt={title} className="h-32 w-full object-cover sm:h-40" /> : null}

        <div className={`space-y-4 px-4 py-4 ${modalTheme.body}`}>
          <div className="grid grid-cols-1 gap-y-3">
            {visibleRows.map(([label, value]) => (
              <div key={label}>
                <p className={`text-xs font-bold uppercase tracking-[0.14em] ${modalTheme.label}`}>{label}</p>
                <p className={`mt-1 whitespace-pre-line break-words text-sm leading-5 ${modalTheme.value}`}>{value}</p>
              </div>
            ))}
          </div>

          {technologies.length ? (
            <div>
              <p className={`text-xs font-bold uppercase tracking-[0.14em] ${modalTheme.label}`}>Tecnologias</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {technologies.map((technology) => (
                  <span key={technology} className={`rounded-full px-2.5 py-1 text-xs font-semibold ${modalTheme.tag}`}>
                    {technology}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {(projectRepository || projectDemo || certificate) ? (
            <div className={`grid gap-2 border-t pt-3 sm:flex sm:flex-wrap ${modalTheme.divider}`}>
              {projectRepository ? <DetailLink href={projectRepository} label="Repositorio" className={modalTheme.link} /> : null}
              {projectDemo ? <DetailLink href={projectDemo} label="Demo" className={modalTheme.link} /> : null}
              {certificate ? <DetailLink href={certificate} label="Documento" className={modalTheme.link} /> : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function DetailLink({ href, label, className }: { href: string; label: string; className: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={`inline-flex w-full items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-bold transition sm:w-auto ${className}`}>
      <ExternalLink className="h-4 w-4" />
      {label}
    </a>
  )
}

const MyPortfolio = () => {

  const { slug } = useParams()
  const { portfolio, loading } = usePortfolio(slug)
  const { form, phoneNumber, countryCode } = useUserPersonalData()
  const [visibilityData, setVisibilityData] = useState<PortfolioVisibilityData | null>(null)
  const [selectedDetail, setSelectedDetail] = useState<SelectedPortfolioDetail>(null)
  useEffect(() => {
    if (portfolio) {
      setVisibilityData(mapToVisibilityData(portfolio))
    }
  }, [portfolio])
    if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-[#003A6C]">
        <div className="animate-pulse">Cargando portafolio...</div>
      </div>
    )
  }

  if (!portfolio) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">El portafolio no está disponible.</p>
      </div>
    )
  }
  console.log("EDUCATIONS RAW:", portfolio.educations);
  console.log("Experiences RAW:", portfolio.experiences);

  if (!visibilityData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Cargando datos...</p>
      </div>
    )
  }
  const templateValue = ('template' in portfolio) 
  ? (portfolio as any).template 
  : portfolio.config?.template;
  const template = Number(templateValue) || 0;
  
  const isModern = template === 1;
  const isMinimalist = template === 2;
  const isCorporate = template === 3;
  const detailModalTheme: PortfolioDetailTheme = isModern
    ? "modern"
    : isMinimalist
      ? "minimalist"
      : isCorporate
        ? "corporate"
        : "default"
  
  const profile = {
    fullname: form.fullName || "",
    occupation: form.occupation || "",
    image_url: form.image || "",
    residence: form.location || "",
    public_email: form.email || "",
    phone: phoneNumber ? `+${countryCode} ${phoneNumber}` : "",
    biography: form.bio || "",
  }
  const visibleSkills = visibilityData.skills.filter(s => s.checked)
  const visibleExperience = portfolio.experiences.filter((item: any) => item.type !== "academica" && asBoolean(item.is_public))
  const visibleProjects = portfolio.projects.filter((item: any) => asBoolean(item.is_public))
  const visibleEducation = visibilityData.education
    .filter(e => e.checked)
    .map((item) => {
      const source = portfolio.educations?.find((education: any) => String(education.id) === String(item.id)) as any

      return {
        ...item,
        label: source?.title || source?.position || source?.degree || source?.name || source?.label || item.label,
        sublabel:
          source?.institution ||
          source?.company ||
          source?.company_name ||
          source?.institution_name ||
          source?.organization ||
          source?.sublabel ||
          item.sublabel,
      }
    })
  const visibleCertificates = visibilityData.certificates.filter(c => c.checked)
  const visibleNetworks = visibilityData.networks.filter(n => n.checked)
  const visiblePortfolio = {
    ...portfolio,
    projects: portfolio.projects.filter((item: any) => asBoolean(item.is_public)),
    skills: portfolio.skills.filter((item: any) => asBoolean(item.is_public)),
    experiences: portfolio.experiences.filter((item: any) => item.type !== "academica" && asBoolean(item.is_public)),
    educations: portfolio.educations?.filter((item: any) => asBoolean(item.is_public)) ?? [],
    certificates: (portfolio as any).certificates?.filter((item: any) => asBoolean(item.is_public)) ?? [],
    socialNetworks: portfolio.socialNetworks.filter((item: any) => asBoolean(item.is_public)),
  }
  const openProjectDetail = (projectId?: string | number) => {
    const project = visiblePortfolio.projects.find((item: any) => String(item.id) === String(projectId))
    if (project) setSelectedDetail({ type: "project", item: project })
  }
  const openExperienceDetail = (experienceId?: string | number) => {
    const experience = visiblePortfolio.experiences.find((item: any) => String(item.id) === String(experienceId))
    if (experience) setSelectedDetail({ type: "experience", item: experience })
  }
  const openEducationDetail = (educationId?: string | number) => {
    const education = visiblePortfolio.educations.find((item: any) => String(item.id) === String(educationId))
    if (education) setSelectedDetail({ type: "education", item: education })
  }
  console.log("PROFILE FINAL MYPORTFOLIO:", profile)
  return (
    <div className="min-h-screen bg-[#F7F0E1]">
      <Header />

      <div className="flex flex-col md:flex-row">
        <Sidebar />

        <main className="flex-1 p-4 md:p-10">
          {isModern && <ModernTemplate 
          //data={visibilityData} 
          profile={profile}
          portfolio={visiblePortfolio}
          onProjectClick={openProjectDetail}
          onExperienceClick={openExperienceDetail}
          onEducationClick={openEducationDetail}
          />}

          {isMinimalist && <MinimalistTemplate 
            //data={visibilityData}           
            profile={profile} 
            portfolio={visiblePortfolio}
            isPreview={true} 
            onProjectClick={openProjectDetail}
            onExperienceClick={openExperienceDetail}
            onEducationClick={openEducationDetail}
          />}

          {isCorporate && <CorporatePortfolioTemplate 
          //data={visibilityData} 
          profile={profile}
          portfolio={visiblePortfolio}
          onProjectClick={openProjectDetail}
          onExperienceClick={openExperienceDetail}
          onEducationClick={openEducationDetail}
          />}

          {!isModern && !isMinimalist && !isCorporate && (
            <div className="max-w-6xl mx-auto bg-white shadow-lg border-t-8 border-[#003A6C] p-8 md:p-10">
              <header className="text-center border-b pb-6 mb-8">
                <div className="flex justify-center mb-4">
                  {profile.image_url ? (
                    <img
                      src={profile.image_url}
                      alt={profile.fullname}
                      className="w-28 h-28 rounded-full object-cover border-4 border-[#003A6C]"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                      Sin foto
                    </div>
                  )}
                </div>

                <h1 className="text-4xl font-serif font-bold uppercase">{profile.fullname}</h1>

                <p className="text-[#003A6C] mt-2 font-medium">
                  {profile.occupation || "Profesión no especificada"}
                </p>

                <div className="flex flex-wrap justify-center gap-6 mt-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Mail size={16} /> {profile.public_email}
                  </span>

                  <span className="flex items-center gap-1">
                    <MapPin size={16} /> {profile.residence}
                  </span>

                  {visibleNetworks.map((net) => (
                    <span key={net.id} className="flex items-center gap-1">
                      <SocialNetworkIcon network={net} className="h-4 w-4" /> {getSocialNetworkDisplayName(net)}
                    </span>
                  ))}
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <aside className="space-y-8">
                  <div>
                    <h3 className="font-bold uppercase border-b pb-2">Sobre mí</h3>
                    <p className="text-sm text-gray-600 mt-3">{profile.biography}</p>
                  </div>

                  <div>
                    <h3 className="font-bold uppercase border-b pb-2">Habilidades</h3>
                    <div className="mt-3 flex flex-col gap-2">
                      {visibleSkills.length > 0 ? (
                       visibleSkills.map((skill) =>(
                            <div key={skill.id} className="text-sm text-gray-700 flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-[#003A6C] rounded-full" />
                              <span className="font-medium">{skill.label}</span>
                              {skill.sublabel && (
                                <span className="text-xs text-gray-400">({skill.sublabel})</span>
                              )}
                            </div>
                          ))
                      ) : (
                        <p className="text-xs text-gray-400 italic">No hay habilidades visibles</p>
                      )}
                    </div>
                  </div>
                </aside>

                <section className="md:col-span-2 space-y-10">
                  <div>
                    <h3 className="flex items-center gap-2 text-xl font-bold uppercase">
                      <Briefcase size={18} /> Experiencia
                    </h3>

                    <div className="mt-6 space-y-6">
                      {visibleExperience.length > 0 ? (
                        visibleExperience.map((exp: any) => (
                          <div
                            key={exp.id}
                            role="button"
                            tabIndex={0}
                            onClick={() => openExperienceDetail(exp.id)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault()
                                openExperienceDetail(exp.id)
                              }
                            }}
                            className="cursor-pointer border-l-2 pl-4 transition hover:border-[#003A6C] focus:outline-none focus:ring-2 focus:ring-[#003A6C]"
                          >
                            <p className="font-bold">{exp.company || exp.company_name || "Empresa no especificada"}</p>
                            <p className="text-[#003A6C] text-sm">{exp.position || exp.role || exp.rol || "Rol no especificado"}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-400 italic">Sin experiencia visible</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="flex items-center gap-2 text-xl font-bold uppercase">
                      <Code size={18} /> Proyectos
                    </h3>

                    <div className="mt-6 grid gap-4">
                      {visibleProjects.length > 0 ? (
                        visibleProjects.map((project: any) => {
                          const technologies =
                            project.technologies ??
                            project.tecnologias?.map((technology: any) => technology.name ?? technology) ??
                            []

                          return (
                          <div
                            key={project.id}
                            role="button"
                            tabIndex={0}
                            onClick={() => openProjectDetail(project.id)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault()
                                openProjectDetail(project.id)
                              }
                            }}
                            className="cursor-pointer bg-gray-50 border-l-4 border-[#003A6C] p-4 transition hover:bg-[#EEF5F9] focus:outline-none focus:ring-2 focus:ring-[#003A6C]"
                          >
                            <h4 className="font-bold text-sm uppercase">
                              {project.nombre || project.name || project.title || "Proyecto sin titulo"}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {project.project_rol || project.role || project.rol || "Rol no especificado"}
                            </p>
                            {technologies.length ? (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {technologies.map((technology: string) => (
                                    <span key={technology} className="rounded-full bg-[#EEF5F9] px-2.5 py-1 text-xs font-semibold text-[#003A6C]">
                                      {technology}
                                    </span>
                                  ))}
                              </div>
                            ) : null}
                          </div>
                          )
                        })
                      ) : (
                        <p className="text-sm text-gray-400 italic">Sin proyectos visibles</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="flex items-center gap-2 text-xl font-bold uppercase">
                      <GraduationCap size={18} /> Formacion academica
                    </h3>

                    <div className="mt-6 grid gap-4">
                      {visibleEducation.length > 0 ? (
                        visibleEducation.map((education) => (
                          <div
                            key={education.id}
                            role="button"
                            tabIndex={0}
                            onClick={() => openEducationDetail(education.id)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault()
                                openEducationDetail(education.id)
                              }
                            }}
                            className="cursor-pointer bg-gray-50 border-l-4 border-[#6DACBF] p-4 transition hover:bg-[#EEF5F9] focus:outline-none focus:ring-2 focus:ring-[#003A6C]"
                          >
                            <h4 className="font-bold text-sm uppercase">
                              {education.label || "Formacion sin titulo"}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {education.sublabel || "Sin institucion"}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-400 italic">Sin formacion academica visible</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="flex items-center gap-2 text-xl font-bold uppercase">
                      <Award size={18} /> Certificados
                    </h3>

                    <div className="mt-6 grid gap-4">
                      {visibleCertificates.length > 0 ? (
                        visibleCertificates.map((certificate) => (
                          <div key={certificate.id} className="bg-gray-50 border-l-4 border-[#C4A57C] p-4">
                            <h4 className="font-bold text-sm uppercase">
                              {certificate.label || "Certificado sin titulo"}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {certificate.sublabel || "Sin institucion"}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-400 italic">Sin certificados visibles</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold uppercase">Redes</h3>

                    <div className="mt-3 flex flex-col gap-2">
                      {visibleNetworks.length > 0 ? (
                        visibleNetworks.map((net) => (
                          <a
                            key={net.id}
                            href={net.sublabel}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-blue-600 text-sm"
                          >
                            <SocialNetworkIcon network={net} className="h-4 w-4" />
                            {getSocialNetworkDisplayName(net)}
                          </a>
                        ))
                      ) : (
                        <p className="text-sm text-gray-400 italic">Sin redes visibles</p>
                      )}
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )}
        </main>
      </div>
      <PortfolioRecordModal selected={selectedDetail} theme={detailModalTheme} onClose={() => setSelectedDetail(null)} />
    </div>
  )
}
export default MyPortfolio
