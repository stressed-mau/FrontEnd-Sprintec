import { useEffect, useRef, useState } from "react"
//import type { Portfolio } from "@/types/portfolio"
import { usePortfolio } from "@/hooks/usePortfolio"
//import type { PortfolioVisibilityData } from "@/services/portfolioVisibilityService"
import { Calendar, Code, ExternalLink, GitBranch, Globe, Mail, MapPin, Briefcase, X } from "lucide-react"
import MinimalistTemplate from "@/components/templates/MinimalistTemplate"
import ModernTemplate from "@/components/templates/ModernTemplate"
import { CorporatePortfolioTemplate } from "@/components/portfolio/CorporatePortfolioTemplate"
import { useParams } from "react-router-dom"
import {
  recordPortfolioView,
  recordProjectClick,
  recordSocialClick,
  sendPortfolioTrackingPulse,
} from "@/services/portfolioAnalyticsService"

const asBoolean = (value: unknown): boolean => {
  if (typeof value === "boolean") return value
  if (typeof value === "number") return value === 1
  if (typeof value === "string") return ["1", "true", "si", "sí", "yes"].includes(value.trim().toLowerCase())
  return true
}

const getProjectTechnologies = (project: any): string[] => (
  project.technologies ??
  project.languages?.map((technology: any) => technology.name ?? technology) ??
  project.tecnologias?.map((technology: any) => technology.name ?? technology) ??
  []
).filter(Boolean)

const getNetworkName = (network: any): string => {
  const rawName = String(network?.name ?? network?.platform ?? network?.label ?? network?.social_network ?? "")
  return rawName.trim().toLowerCase().replace(/[^a-z0-9]/g, "")
}

const getProjectTitle = (project: any): string =>
  project?.nombre || project?.name || project?.title || "Proyecto sin titulo"

const getProjectRole = (project: any): string =>
  project?.project_rol || project?.role || project?.rol || "Rol no especificado"

const getProjectDescription = (project: any): string =>
  project?.descripcion || project?.description || project?.summary || "Sin descripcion registrada."

const getProjectStartDate = (project: any): string =>
  project?.fechaInicio || project?.start_date || project?.startDate || ""

const getProjectEndDate = (project: any): string =>
  project?.fechaFin || project?.end_date || project?.endDate || ""

const getProjectImage = (project: any): string =>
  project?.image || project?.image_url || project?.photograph || ""

const getProjectGithubUrl = (project: any): string =>
  project?.github || project?.github_url || project?.repository_url || ""

const getProjectDemoUrl = (project: any): string =>
  project?.demo || project?.demo_url || project?.project_url || project?.url || ""

const isProjectCurrent = (project: any): boolean => {
  const value = project?.is_current ?? project?.current
  if (typeof value === "boolean") return value
  if (typeof value === "number") return value === 1
  if (typeof value === "string") return ["1", "true", "si", "sí", "yes"].includes(value.trim().toLowerCase())
  return false
}

const sameProjectId = (project: any, projectId?: string | number) =>
  projectId != null && String(project?.id) === String(projectId)

type ProjectModalTheme = {
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

const PROJECT_MODAL_THEMES: Record<"modern" | "minimalist" | "corporate" | "default", ProjectModalTheme> = {
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

const PublicPortfolio = () => {
  const { slug } = useParams()
  const { portfolio, loading, visitId } = usePortfolio(slug) as { portfolio: any, loading: boolean, visitId: string | null };
  const recordedViewRef = useRef<string | null>(null)
  const trackingStartRef = useRef<number>(Date.now())
  const [selectedProject, setSelectedProject] = useState<any | null>(null)

  useEffect(() => {
    if (!visitId) return;
    trackingStartRef.current = Date.now()

    // Enviar pulso de permanencia cada 30 segundos
    const pulseInterval = setInterval(async () => {
      const secondsElapsed = Math.max(1, Math.round((Date.now() - trackingStartRef.current) / 1000))
      await sendPortfolioTrackingPulse(visitId, secondsElapsed)
    }, 30000);

    // Limpiar el intervalo cuando el usuario cambia de página
    return () => clearInterval(pulseInterval);
  }, [visitId]);

  useEffect(() => {
    const publicSlug = portfolio?.config?.slug ?? slug

    if (loading || !publicSlug || recordedViewRef.current === String(publicSlug)) {
      return
    }

    recordedViewRef.current = String(publicSlug)
    recordPortfolioView(String(publicSlug))
  }, [loading, portfolio, slug])

  const handleProjectClick = async (projectId?: string | number) => {
    if (!projectId) return

    const clickedProject = (portfolio?.projects ?? []).find((project: any) => sameProjectId(project, projectId))

    if (clickedProject) {
      setSelectedProject(clickedProject)
    }

    if (!visitId) return
    await recordProjectClick({ visitId, projectId })
  };

  const handleSocialClick = async (network: any) => {
    const networkName = getNetworkName(network)
    if (!networkName || !visitId) return
    await recordSocialClick({ visitId, networkName })
  }
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-[#003A6C]">
        <div className="animate-pulse">Cargando portafolio...</div>
      </div>
    )
  }

  if (portfolio && portfolio.config?.is_public === false) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500 text-lg font-medium">
          Este portafolio no está disponible.
        </p>
      </div>
    )
  }
  if (!portfolio) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">Este portafolio no está disponible.</p>
      </div>
    )
  }

  const template = portfolio.config?.template ?? portfolio.template;
  const isModern = template === 1
  const isMinimalist = template === 2
  const isCorporate = template === 3
  const modalTheme = isModern
    ? PROJECT_MODAL_THEMES.modern
    : isMinimalist
      ? PROJECT_MODAL_THEMES.minimalist
      : isCorporate
        ? PROJECT_MODAL_THEMES.corporate
        : PROJECT_MODAL_THEMES.default
  const visiblePortfolio = {
    ...portfolio,
    projects: (portfolio.projects ?? []).filter((item: any) => asBoolean(item.is_public)),
    skills: (portfolio.skills ?? []).filter((item: any) => asBoolean(item.is_public)),
    experiences: (portfolio.experiences ?? []).filter((item: any) => item.type !== "academica" && asBoolean(item.is_public)),
    educations: (portfolio.educations ?? []).filter((item: any) => asBoolean(item.is_public)),
    certificates: (portfolio.certificates ?? []).filter((item: any) => asBoolean(item.is_public)),
    socialNetworks: (portfolio.socialNetworks ?? []).filter((item: any) => asBoolean(item.is_public)),
  }
  //const visibilityData = mapToVisibilityData(portfolio)
  const profile = {
    fullname: portfolio.profile?.name || portfolio.user?.fullname || "",
    occupation: portfolio.profile?.occupation || portfolio.user?.occupation || "",
    image_url: portfolio.profile?.image || portfolio.user?.image_url || "",
    residence: portfolio.profile?.nacionality || portfolio.user?.nationality || "",
    public_email: portfolio.profile?.email || portfolio.user?.public_email || "",
    phone: portfolio.profile?.phone || "",
    biography: portfolio.profile?.bio || portfolio.user?.biography || "",
  };

  return (
    <main className="flex-1 p-4 md:p-10">
      {isModern && <ModernTemplate 
      //data={visibilityData} 
      profile={profile} portfolio={visiblePortfolio} onProjectClick={handleProjectClick} onSocialClick={handleSocialClick} />}

      {isMinimalist && <MinimalistTemplate 
      //data={visibilityData} 
      profile={profile} portfolio={visiblePortfolio} isPreview={false} onProjectClick={handleProjectClick} onSocialClick={handleSocialClick} />}

      {isCorporate && <CorporatePortfolioTemplate 
      //data={visibilityData} 
      profile={profile} portfolio={visiblePortfolio} onProjectClick={handleProjectClick} onSocialClick={handleSocialClick} />}

      {!isModern && !isMinimalist && !isCorporate && (
        <div className="max-w-6xl mx-auto bg-white shadow-lg border-t-8 border-[#003A6C] p-8 md:p-10">
          <header className="text-center border-b pb-6 mb-8">
            <div className="flex justify-center mb-4">
              {portfolio.user.image_url ? (
                <img
                  src={portfolio.user.image_url}
                  alt={portfolio.user.fullname}
                  className="w-28 h-28 rounded-full object-cover border-4 border-[#003A6C]"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                  Sin foto
                </div>
              )}
            </div>

            <h1 className="text-4xl font-serif font-bold uppercase">{portfolio.user.fullname}</h1>

            <p className="text-[#003A6C] mt-2 font-medium">
              {portfolio.user.occupation || "Profesión no especificada"}
            </p>

            <div className="flex flex-wrap justify-center gap-6 mt-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Mail size={16} /> {portfolio.user.public_email}
              </span>

              <span className="flex items-center gap-1">
                <MapPin size={16} /> {portfolio.user.nationality}
              </span>

              {visiblePortfolio.socialNetworks?.map((sn: any, index: number) => (
                <span key={index} className="flex items-center gap-1">
                  <Globe size={16} /> {sn.name}
                </span>
              ))}
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <aside className="space-y-8">
              <div>
                <h3 className="font-bold uppercase border-b pb-2">Sobre mí</h3>
                <p className="text-sm text-gray-600 mt-3">{portfolio.user.biography}</p>
              </div>

              <div>
                <h3 className="font-bold uppercase border-b pb-2">Habilidades</h3>

                <div className="mt-3 flex flex-col gap-2">
                  {visiblePortfolio.skills.length > 0 ? (
                    visiblePortfolio.skills.map((skill: any, index:number) => (
                      <div key={index} className="text-sm text-gray-700 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-[#003A6C] rounded-full" />
                        <span className="font-medium">{skill.name}</span>
                        {"level" in skill && skill.level && (
                          <span className="text-xs text-gray-400">({skill.level})</span>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 italic">No hay habilidades registradas</p>
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
                  {visiblePortfolio.experiences.length > 0 ? (
                    visiblePortfolio.experiences.map((exp: any, index: number) => (
                      <div key={index} className="border-l-2 pl-4">
                        <p className="font-bold">{exp.company || exp.company_name || "Empresa no especificada"}</p>
                        <p className="text-[#003A6C] text-sm">{exp.position || exp.role || "Cargo no especificado"}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 italic">Sin experiencia registrada</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="flex items-center gap-2 text-xl font-bold uppercase">
                  <Code size={18} /> Proyectos
                </h3>

                <div className="mt-6 grid gap-4">
                  {visiblePortfolio.projects.map((project: any, index: number) => (
                    <div 
                      key={index} 
                      role="button"
                      tabIndex={0}
                      className="cursor-pointer bg-gray-50 border-l-4 border-[#003A6C] p-4 transition hover:bg-[#EEF5F9] focus:outline-none focus:ring-2 focus:ring-[#003A6C]"
                      onClick={() => handleProjectClick(project.id)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault()
                          void handleProjectClick(project.id)
                        }
                      }}
                    >
                      <h4 className="font-bold text-sm uppercase">
                        {project.name || project.title || project.nombre || "Proyecto sin titulo"}
                      </h4>

                      <p className="text-sm text-gray-600 mt-1">
                        {project.project_rol || project.role || project.rol || "Rol no especificado"}
                      </p>

                      {getProjectTechnologies(project).length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {getProjectTechnologies(project).map((technology) => (
                            <span key={technology} className="text-xs bg-gray-200 px-2 py-1 rounded">
                              {technology}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      )}

      {selectedProject ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true">
          <div className={`max-h-[92vh] w-full overflow-y-auto rounded-t-2xl shadow-2xl sm:max-h-[90vh] sm:max-w-3xl sm:rounded-2xl ${modalTheme.panel}`}>
            <div className={`sticky top-0 z-10 flex items-start justify-between gap-3 border-b px-4 py-4 sm:gap-4 sm:px-6 sm:py-5 ${modalTheme.header}`}>
              <div className="min-w-0">
                <p className={`text-xs font-bold uppercase tracking-[0.24em] ${modalTheme.eyebrow}`}>Detalle de proyecto</p>
                <h2 className={`mt-1 break-words text-xl font-bold leading-tight sm:text-2xl ${modalTheme.title}`}>{getProjectTitle(selectedProject)}</h2>
                <p className={`mt-1 text-sm font-semibold ${modalTheme.role}`}>{getProjectRole(selectedProject)}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className={`shrink-0 rounded-full p-2 transition ${modalTheme.closeButton}`}
                aria-label="Cerrar detalle de proyecto"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {getProjectImage(selectedProject) ? (
              <img
                src={getProjectImage(selectedProject)}
                alt={getProjectTitle(selectedProject)}
                className="h-44 w-full object-cover sm:h-64"
              />
            ) : null}

            <div className="space-y-5 px-4 py-5 sm:space-y-6 sm:px-6 sm:py-6">
              <section>
                <h3 className={`text-sm font-bold uppercase tracking-[0.16em] ${modalTheme.sectionTitle}`}>Descripcion</h3>
                <p className={`mt-2 whitespace-pre-line text-sm leading-6 ${modalTheme.text}`}>{getProjectDescription(selectedProject)}</p>
              </section>

              <div className="grid gap-4 md:grid-cols-2">
                <div className={`min-w-0 rounded-xl border p-4 ${modalTheme.infoCard}`}>
                  <div className={`flex items-center gap-2 text-sm font-bold ${modalTheme.iconText}`}>
                    <Calendar className="h-4 w-4" />
                    Fechas
                  </div>
                  <p className={`mt-2 text-sm ${modalTheme.text}`}>
                    {getProjectStartDate(selectedProject) || "Inicio no registrado"}
                    {" - "}
                    {isProjectCurrent(selectedProject) ? "En curso" : getProjectEndDate(selectedProject) || "Fin no registrado"}
                  </p>
                </div>

                <div className={`min-w-0 rounded-xl border p-4 ${modalTheme.infoCard}`}>
                  <div className={`flex items-center gap-2 text-sm font-bold ${modalTheme.iconText}`}>
                    <Code className="h-4 w-4" />
                    Tecnologias
                  </div>
                  {getProjectTechnologies(selectedProject).length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {getProjectTechnologies(selectedProject).map((technology) => (
                        <span key={technology} className={`rounded-full px-3 py-1 text-xs font-semibold ${modalTheme.tag}`}>
                          {technology}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className={`mt-2 text-sm ${modalTheme.text}`}>No hay tecnologias registradas.</p>
                  )}
                </div>
              </div>

              {(getProjectGithubUrl(selectedProject) || getProjectDemoUrl(selectedProject)) ? (
                <div className="grid gap-3 sm:flex sm:flex-wrap">
                  {getProjectGithubUrl(selectedProject) ? (
                    <a
                      href={getProjectGithubUrl(selectedProject)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition sm:w-auto ${modalTheme.primaryLink}`}
                    >
                      <GitBranch className="h-4 w-4" />
                      Repositorio
                    </a>
                  ) : null}

                  {getProjectDemoUrl(selectedProject) ? (
                    <a
                      href={getProjectDemoUrl(selectedProject)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition sm:w-auto ${modalTheme.secondaryLink}`}
                    >
                      <ExternalLink className="h-4 w-4" />
                      Demo
                    </a>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </main>
  )
}

export default PublicPortfolio
