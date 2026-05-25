import { useEffect, useRef } from "react"
//import type { Portfolio } from "@/types/portfolio"
import { usePortfolio } from "@/hooks/usePortfolio"
//import type { PortfolioVisibilityData } from "@/services/portfolioVisibilityService"
import { Mail, Globe, MapPin, Briefcase, Code } from "lucide-react"
import MinimalistTemplate from "@/components/templates/MinimalistTemplate"
import ModernTemplate from "@/components/templates/ModernTemplate"
import { CorporatePortfolioTemplate } from "@/components/portfolio/CorporatePortfolioTemplate"
import { useParams } from "react-router-dom"
import { api } from "@/services/api"
import {
  recordPortfolioView,
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

const PublicPortfolio = () => {
  const { slug } = useParams()
  const { portfolio, loading, visitId } = usePortfolio(slug) as { portfolio: any, loading: boolean, visitId: string | null };
  const recordedViewRef = useRef<string | null>(null)
  const trackingStartRef = useRef<number>(Date.now())

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
    if (!projectId) return;
    if (!visitId) return; // Si no hay visita registrada, ignoramos silenciosamente
    try {
      await api.post('/tracking/project-click', {
        visit_id: visitId,           // ID de la visita activa
        project_id: projectId,        // ID del proyecto clickeado
        clicked_at: new Date().toISOString(),
      });
    } catch (error) {
      console.warn('Click tracking fallido:', error);
    }
    // Continuar con la navegación normal independientemente del tracking
  };
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
      profile={profile} portfolio={visiblePortfolio} onProjectClick={handleProjectClick} />}

      {isMinimalist && <MinimalistTemplate 
      //data={visibilityData} 
      profile={profile} portfolio={visiblePortfolio} isPreview={false} onProjectClick={handleProjectClick} />}

      {isCorporate && <CorporatePortfolioTemplate 
      //data={visibilityData} 
      profile={profile} portfolio={visiblePortfolio} onProjectClick={handleProjectClick} />}

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
                      className="bg-gray-50 border-l-4 border-[#003A6C] p-4"
                      onClick={() => handleProjectClick(project.id)}
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
    </main>
  )
}

export default PublicPortfolio
