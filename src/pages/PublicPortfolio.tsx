//import type { Portfolio } from "@/types/portfolio"
import { usePortfolio } from "@/hooks/usePortfolio"
//import type { PortfolioVisibilityData } from "@/services/portfolioVisibilityService"
import { Mail, Globe, MapPin, Briefcase, Code } from "lucide-react"
import MinimalistTemplate from "@/components/templates/MinimalistTemplate"
import ModernTemplate from "@/components/templates/ModernTemplate"
import { CorporatePortfolioTemplate } from "@/components/portfolio/CorporatePortfolioTemplate"
import { useParams } from "react-router-dom"

const PublicPortfolio = () => {
  const { slug } = useParams()
  const { portfolio, loading } = usePortfolio(slug) as { portfolio: any, loading: boolean };

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

  const template = portfolio.config?.template ?? portfolio.template;
  const isModern = template === 1
  const isMinimalist = template === 2
  const isCorporate = template === 3
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
      profile={profile} />}

      {isMinimalist && <MinimalistTemplate 
      //data={visibilityData} 
      profile={profile} isPreview={false} />}

      {isCorporate && <CorporatePortfolioTemplate 
      //data={visibilityData} 
      profile={profile} />}

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

              {portfolio.socialNetworks?.map((sn: any, index: number) => (
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
                  {portfolio.skills.length > 0 ? (
                    portfolio.skills.map((skill: any, index:number) => (
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
                  {portfolio.experiences.length > 0 ? (
                    portfolio.experiences.map((exp: any, index: number) => (
                      <div key={index} className="border-l-2 pl-4">
                        <p className="font-bold">{exp.position}</p>
                        <p className="text-[#003A6C] text-sm">{exp.company}</p>
                        {"startDate" in exp && (
                          <p className="text-xs text-gray-500 mt-1">
                            {exp.startDate} - {exp.current ? "Actualidad" : exp.endDate}
                          </p>
                        )}
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
                  {portfolio.projects.map((project: any, index: number) => (
                    <div key={index} className="bg-gray-50 border-l-4 border-[#003A6C] p-4">
                      <h4 className="font-bold text-sm uppercase">
                        {project.nombre || "Proyecto sin título"}
                      </h4>

                      <p className="text-sm text-gray-600 mt-1">
                        {project.descripcion || "Sin descripción disponible"}
                      </p>

                      {"tecnologias" in project && project.tecnologias?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {project.tecnologias.map((t: any) => (
                            <span key={t.id} className="text-xs bg-gray-200 px-2 py-1 rounded">
                              {t.name}
                            </span>
                          ))}
                        </div>
                      )}

                      {"rol" in project && (
                        <p className="text-xs text-gray-500 mt-2">Rol: {project.rol}</p>
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
