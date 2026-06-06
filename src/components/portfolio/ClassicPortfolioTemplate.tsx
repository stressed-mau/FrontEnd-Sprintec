import { Mail, MapPin, Briefcase, Code, GraduationCap, Award } from "lucide-react";
import { SocialNetworkIcon, getSocialNetworkDisplayName } from "@/components/portfolio/SocialNetworkIcon";
interface Skill {
  id: string | number;
  label: string;
  sublabel?: string;
}
interface Experience {
  id: string | number;
  company?: string;
  company_name?: string;
  position?: string;
  role?: string;
  rol?: string;
}
interface Technology {
  name?: string;
}
interface Project {
  id: string | number;
  nombre?: string;
  name?: string;
  title?: string;
  project_rol?: string;
  role?: string;
  rol?: string;
  technologies?: string[];
  tecnologias?: (string | Technology)[];
}
interface Education {
  id: string | number;
  label?: string;
  sublabel?: string;
}
interface Certificate {
  id: string | number;
  label?: string;
  sublabel?: string;
}
interface Network {
  id: string | number;
  label?: string;
  sublabel?: string;
}
type ClassicPortfolioTemplateProps = {
  profile: {
    fullname: string;
    occupation: string;
    image_url: string;
    residence: string;
    public_email: string;
    biography: string;
  };
  visibleSkills: Skill[];
  visibleExperience: Experience[];
  visibleProjects: Project[];
  visibleEducation: Education[];
  visibleCertificates: Certificate[];
  visibleNetworks: Network[];
  onProjectClick: (id?: string | number) => void;
  onExperienceClick: (id?: string | number) => void;
  onEducationClick: (id?: string | number) => void;
};
function ClassicPortfolioTemplate({
  profile,
  visibleSkills,
  visibleExperience,
  visibleProjects,
  visibleEducation,
  visibleCertificates,
  visibleNetworks,
  onProjectClick,
  onExperienceClick,
  onEducationClick,
}: ClassicPortfolioTemplateProps) {
    return (
        <div className="max-w-6xl mx-auto bg-white shadow-lg border-t-8 border-[#003A6C] p-8 md:p-10">
            <header className="text-center border-b pb-6 mb-8">
                <div className="flex justify-center mb-4">
                    {profile.image_url ? (
                    <img
                        src={profile.image_url}
                        alt={profile.fullname}
                        className="w-28 h-28 rounded-full object-cover border-4 border-[#003A6C]"/>
                    ) : (
                    <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm"> Sin foto </div>
                    )}
                </div>
                <h1 className="text-4xl font-serif font-bold uppercase">{profile.fullname}</h1>
                <p className="text-[#003A6C] mt-2 font-medium"> {profile.occupation || "Profesión no especificada"}</p>
                <div className="flex flex-wrap justify-center gap-6 mt-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1"> <Mail size={16} /> {profile.public_email} </span>
                    <span className="flex items-center gap-1"> <MapPin size={16} /> {profile.residence} </span>
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
                    <h3 className="flex items-center gap-2 text-xl font-bold uppercase"> <Briefcase size={18} /> Experiencia </h3>
                    <div className="mt-6 space-y-6">
                        {visibleExperience.length > 0 ? (visibleExperience.map((exp) => (
                            <div key={exp.id} role="button" tabIndex={0} onClick={() => onExperienceClick(exp.id)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault()
                                onExperienceClick(exp.id)
                                }
                            }}
                            className="cursor-pointer border-l-2 pl-4 transition hover:border-[#003A6C] focus:outline-none focus:ring-2 focus:ring-[#003A6C]">
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
                    <h3 className="flex items-center gap-2 text-xl font-bold uppercase"> <Code size={18} /> Proyectos</h3>
                    <div className="mt-6 grid gap-4">
                        {visibleProjects.length > 0 ? (
                        visibleProjects.map((project) => {
                            const technologies =
                            project.technologies ??
                            project.tecnologias?.map((technology) =>  typeof technology === 'string'? technology: technology.name ?? '' ) ?? []
                            return ( <div key={project.id} role="button" tabIndex={0} onClick={() => onProjectClick(project.id)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault()
                                onProjectClick(project.id)
                                }
                            }}
                            className="cursor-pointer bg-gray-50 border-l-4 border-[#003A6C] p-4 transition hover:bg-[#EEF5F9] focus:outline-none focus:ring-2 focus:ring-[#003A6C]" >
                            <h4 className="font-bold text-sm uppercase">
                                {project.nombre || project.name || project.title || "Proyecto sin titulo"}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                                {project.project_rol || project.role || project.rol || "Rol no especificado"}
                            </p>
                            {technologies.length ? (
                                <div className="mt-3 flex flex-wrap gap-2">
                                {technologies.map((technology: string) => (
                                    <span key={technology} className="rounded-full bg-[#EEF5F9] px-2.5 py-1 text-xs font-semibold text-[#003A6C]"> {technology} </span>
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
                    <h3 className="flex items-center gap-2 text-xl font-bold uppercase"> <GraduationCap size={18} /> Formacion academica </h3>
                    <div className="mt-6 grid gap-4">
                        {visibleEducation.length > 0 ? ( visibleEducation.map((education) => (
                            <div
                            key={education.id}
                            role="button"
                            tabIndex={0}
                            onClick={() => onEducationClick(education.id)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault()
                                onEducationClick(education.id)
                                }
                            }}
                            className="cursor-pointer bg-gray-50 border-l-4 border-[#6DACBF] p-4 transition hover:bg-[#EEF5F9] focus:outline-none focus:ring-2 focus:ring-[#003A6C]" >
                            <h4 className="font-bold text-sm uppercase"> {education.label || "Formacion sin titulo"} </h4>
                            <p className="text-sm text-gray-600 mt-1"> {education.sublabel || "Sin institucion"} </p>
                            </div>
                        ))
                        ) : (
                        <p className="text-sm text-gray-400 italic">Sin formacion academica visible</p>
                        )}
                    </div>
                    </div>
                    <div>
                    <h3 className="flex items-center gap-2 text-xl font-bold uppercase"> <Award size={18} /> Certificados </h3>
                    <div className="mt-6 grid gap-4">
                        {visibleCertificates.length > 0 ? (
                        visibleCertificates.map((certificate) => (
                            <div key={certificate.id} className="bg-gray-50 border-l-4 border-[#C4A57C] p-4">
                            <h4 className="font-bold text-sm uppercase"> {certificate.label || "Certificado sin titulo"} </h4>
                            <p className="text-sm text-gray-600 mt-1"> {certificate.sublabel || "Sin institucion"} </p>
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
                            className="inline-flex items-center gap-2 text-blue-600 text-sm">
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
    );
}
export default ClassicPortfolioTemplate;