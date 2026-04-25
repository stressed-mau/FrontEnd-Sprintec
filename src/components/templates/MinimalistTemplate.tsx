import React, { useState, useMemo } from "react";
import type { PortfolioVisibilityData } from '@/services/portfolioVisibilityService';
import { ArrowLeft, ArrowRight, Layers3, Globe, Code2, Link, Mail, Phone, MapPin } from "lucide-react";

interface MinimalistTemplateProps {
  data: PortfolioVisibilityData;
  profile?: any | null;
  isPreview?: boolean;
}

const MinimalistTemplate: React.FC<MinimalistTemplateProps> = ({
  data,
  profile,
  isPreview = false,
}) => {
  const [page, setPage] = useState(0);

  // 1. Perfil del Usuario (Real o Mock)
  const user = profile || {
    fullname: "NOMBRE DE USUARIO",
    occupation: "PROFESIÓN / ROL",
    biography: "Biografía no disponible. Configura tu perfil para mostrar tu información aquí.",
    image_url: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=600"
  };

  // 2. Lógica de Filtrado por Visibilidad
  const visibleProjects = useMemo(() => data.projects.filter(p => p.checked), [data.projects]);
  const visibleSkills = useMemo(() => data.skills.filter(s => s.checked), [data.skills]);
  const visibleExperience = useMemo(() => data.experience.filter(e => e.checked), [data.experience]);
  const visibleNetworks = useMemo(() => data.networks.filter(n => n.checked), [data.networks]);

  // Si es Vista Previa o no hay datos visibles, podríamos mostrar mocks (opcional)
  const projects = isPreview && visibleProjects.length === 0 ? [] : visibleProjects;
  const skills = isPreview && visibleSkills.length === 0 ? [] : visibleSkills;
  const experiences = isPreview && visibleExperience.length === 0 ? [] : visibleExperience;

  // Navegación
  const totalPages = 4;
  const nextPage = () => setPage((prev) => (prev + 1) % totalPages);
  const prevPage = () => setPage((prev) => (prev - 1 + totalPages) % totalPages);

  const getSocialIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("github")) return <Code2 size={18} />;
    if (n.includes("linkedin")) return <Link size={18} />;
    return <Globe size={18} />;
  };

  return (
    <article className="w-full max-w-4xl mx-auto min-h-[500px] bg-white text-zinc-900 font-sans shadow-2xl flex flex-col md:flex-row overflow-hidden border border-stone-100">
      
      {/* LATERAL IZQUIERDO - Identidad Fija */}
      <div className="w-full md:w-1/3 bg-stone-50 p-8 flex flex-col items-center text-center border-r border-stone-100">
        <div className="mb-8 flex flex-col items-center"> 
          <div className="w-24 h-24 rounded-full overflow-hidden mb-6 border-2 border-white shadow-sm">
            <img 
              src={user.image_url || "https://via.placeholder.com/150"} 
              alt={user.fullname} 
              className="w-full h-full object-cover grayscale"
            />
          </div>
          <h1 className="text-2xl font-black leading-tight tracking-tighter uppercase mb-2">
            {user.fullname}
          </h1>
          <p className="text-[10px] font-bold tracking-[0.2em] text-stone-400 uppercase">
            {user.occupation}
          </p>
        </div>

        <div className="mt-auto space-y-4">
          <div className="flex items-center gap-3 text-stone-500">
            <Mail size={14} />
            <span className="text-xs font-medium">{user.public_email || 'Email no disponible'}</span>
          </div>
          <div className="flex items-center gap-3 text-stone-500">
            <MapPin size={14} />
            <span className="text-xs font-medium">{user.residence || 'Ubicación no disponible'}</span>
          </div>
        </div>
      </div>

      {/* ÁREA DE CONTENIDO VARIABLE */}
      <div className="flex-1 p-10 flex flex-col bg-white ">
        
        <div className="flex-1">
          {/* PÁGINA 0: BIOGRAFÍA */}
          {page === 0 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h2 className="text-5xl font-black text-zinc-900 tracking-tighter uppercase leading-[0.9]">Biografía</h2>
              <div className="h-1 w-12 bg-zinc-900 my-6"></div>
              <p className="text-stone-500 text-lg leading-relaxed font-light italic">
                {user.biography && user.biography.trim() !== "" 
                  ? `"${user.biography}"`
                  : "No hay biografía registrada."}
              </p>
            </div>
          )}

          {/* PÁGINA 1: SKILLS (Filtrado) */}
          {page === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h2 className="text-4xl font-black text-zinc-900 uppercase tracking-tighter">Habilidades</h2>
              
              <div className="grid grid-cols-2 gap-y-6 pt-4">
                {skills.length > 0 ? skills.map((skill: any) => (
                  <div key={skill.id} className="group">
                    <p className="text-[10px] font-bold text-stone-300 uppercase tracking-widest group-hover:text-zinc-900 transition-colors">
                      {skill.sublabel || "Skill"}
                    </p>
                    <p className="text-base font-bold text-zinc-800">{skill.label}</p>
                  </div>
                )) : (
                  <p className="text-sm text-stone-400 italic">No hay habilidades marcadas como visibles.</p>
                )}
              </div>
            </div>
          )}

          {/* PÁGINA 2: PROYECTOS (Filtrado) */}
          {page === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h2 className="text-4xl font-black text-zinc-900 uppercase tracking-tighter">Proyectos</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 overflow-y-auto max-h-[350px] pr-2">
                {projects.length > 0 ? projects.map((p: any) => (
                  <div key={p.id} className="bg-stone-50/50 border border-stone-100 rounded-2xl p-4 transition-all hover:bg-white hover:shadow-xl hover:shadow-stone-200/50 group">
                    <h3 className="font-bold text-sm text-zinc-900 uppercase mb-1">{p.label}</h3>
                    <p className="text-[10px] text-stone-400 leading-relaxed line-clamp-2 italic">{p.sublabel}</p>
                  </div>
                )) : (
                  <p className="text-sm text-stone-400 italic">No hay proyectos marcados como visibles.</p>
                )}
              </div>
            </div>
          )}

          {/* PÁGINA 3: EXPERIENCIA (Filtrado) */}
          {page === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h2 className="text-4xl font-black text-zinc-900 uppercase tracking-tighter">Experiencias</h2>
              
              <div className="space-y-6 pt-2">
                {experiences.length > 0 ? experiences.map((exp: any) => (
                  <div key={exp.id} className="flex gap-6 items-start">
                    <div className="text-[10px] font-black text-stone-300 pt-1 uppercase tracking-tighter w-16">
                      {exp.extraInfo || "Actual"}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-zinc-900 uppercase">{exp.label}</h4>
                      <p className="text-xs text-stone-400 italic">{exp.sublabel}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-stone-400 italic">No hay experiencia marcada como visible.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* NAVEGACIÓN Y REDES (Filtradas) */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-stone-100 sticky bottom-0 bg-white">
          <div className="flex gap-2">
            <button 
              onClick={prevPage} 
              className="p-2 border border-stone-200 rounded-full hover:bg-stone-50 text-zinc-400 hover:text-zinc-900 transition-all"
            >
              <ArrowLeft size={16} strokeWidth={1.5}/>
            </button>
            <button 
              onClick={nextPage} 
              className="p-2 bg-zinc-900 rounded-full hover:bg-zinc-800 text-stone-50 transition-all shadow-md"
            >
              <ArrowRight size={16} strokeWidth={1.5}/>
            </button>
          </div>
          
          <div className="flex gap-4 text-stone-300">
            {visibleNetworks.map((sn: any) => (
              <a 
                key={sn.id} 
                href={sn.url || "#"} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-zinc-900 transition-colors"
                title={sn.label}
              >
                {getSocialIcon(sn.label)}
              </a>
            ))}
          </div>
          
          <div className="text-[10px] font-bold text-stone-200 uppercase tracking-[0.3em]">
            0{page + 1}
          </div>
        </div>
      </div>
    </article>
  );
};

export default MinimalistTemplate;