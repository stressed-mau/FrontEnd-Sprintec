import Header from "../components/HeaderUser"
import Sidebar from "../components/Sidebar"
import type { Portfolio } from "@/types/portfolio"
import { usePortfolio } from "@/hooks/usePortfolio"
import type { PortfolioVisibilityData } from "@/services/portfolioVisibilityService"
import { Mail, Globe, MapPin, Briefcase, Code } from "lucide-react"
import MinimalistTemplate from "@/components/templates/MinimalistTemplate"
import ModernTemplate from "@/components/templates/ModernTemplate"
import { CorporatePortfolioTemplate } from "@/components/portfolio/CorporatePortfolioTemplate"
import { useUserPersonalData } from "@/hooks/useUserPersonalData"
import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
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
    sublabel: p.descripcion ?? "",
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
    checked: true,
    sourceTable: "educations",
  })) ?? [],
  certificates: (portfolio as any).certificates?.map((cert: any, index: number) => ({
    id: index,
    label: cert.name ?? "",
    sublabel: cert.issuer ?? "",
    checked: true,
    sourceTable: "certificates",
    date: cert.date_issued,
    url: cert.credential_url,
  })) ?? [],
  networks: portfolio.socialNetworks.map((n, index) => ({
    id: Number(n.id ?? index),
    label: n.name ?? "",
    sublabel: n.url ?? "",
    checked: asBoolean(n.is_public),
    sourceTable: "social_networks",
  })),

})
const MyPortfolio = () => {

  const { slug } = useParams()
  const { portfolio, loading } = usePortfolio(slug)
  const { form, phoneNumber, countryCode } = useUserPersonalData()
  const [visibilityData, setVisibilityData] = useState<PortfolioVisibilityData | null>(null)
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
  const visibleExperience = visibilityData.experience.filter(e => e.checked)
  const visibleProjects = visibilityData.projects.filter(p => p.checked)
  //const visibleEducation = visibilityData.education.filter(e => e.checked)
  //const visibleCertificates = visibilityData.certificates.filter(c => c.checked)
  const visibleNetworks = visibilityData.networks.filter(n => n.checked)
  console.log("PROFILE FINAL MYPORTFOLIO:", profile)
  return (
    <div className="min-h-screen bg-[#F7F0E1]">
      <Header />

      <div className="flex flex-col md:flex-row">
        <Sidebar />

        <main className="flex-1 p-4 md:p-10">
          {isModern && <ModernTemplate 
          //data={visibilityData} 
          profile={profile} />}

          {isMinimalist && <MinimalistTemplate 
            //data={visibilityData}           
            profile={profile} 
            isPreview={true} 
          />}

          {isCorporate && <CorporatePortfolioTemplate 
          //data={visibilityData} 
          profile={profile} />}

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
                      <Globe size={16} /> {net.label}
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
                        visibleExperience.map((exp) => (
                          <div key={exp.id} className="border-l-2 pl-4">
                            <p className="font-bold">{exp.label}</p>
                            <p className="text-[#003A6C] text-sm">{exp.sublabel}</p>
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
                        visibleProjects.map((project) => (
                          <div key={project.id} className="bg-gray-50 border-l-4 border-[#003A6C] p-4">
                            <h4 className="font-bold text-sm uppercase">
                              {project.label || "Proyecto sin título"}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {project.sublabel || "Sin descripción"}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-400 italic">Sin proyectos visibles</p>
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
                            className="text-blue-600 text-sm"
                          >
                            {net.label}
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
    </div>
  )
}
export default MyPortfolio
