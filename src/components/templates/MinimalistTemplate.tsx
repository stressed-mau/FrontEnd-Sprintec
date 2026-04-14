import React, { useState } from "react";
import type { Portfolio } from "@/types/portfolio";
import { ArrowLeft, ArrowRight, Layers3, Globe, Code2, Link } from "lucide-react";

interface MinimalistTemplateProps {
  portfolio: Portfolio;
  isPreview?: boolean;
}

const MinimalistTemplate: React.FC<MinimalistTemplateProps> = ({
  portfolio,
  isPreview = false,
}) => {
  const [page, setPage] = useState(0);

  // 1. Definimos los Mocks PRIMERO
  const mockUser = {
    fullname: "JUAN PÉREZ",
    occupation: "FULL STACK DEVELOPER",
    biography: "Desarrollador enfocado en crear interfaces limpias, intuitivas y minimalistas. Mi pasión es la arquitectura de software escalable.",
    image_url: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=600" 
  };

  const mockSkills = [
    { id: "1", name: "React", level: "Experto" },
    { id: "2", name: "Node.js", level: "Avanzado" },
    { id: "3", name: "PostgreSQL", level: "Intermedio" },
    { id: "4", name: "TypeScript", level: "Avanzado" },
    { id: "5", name: "Tailwind CSS", level: "Experto" },
  ];
  const mockProjects = [
    { 
      id: "1", 
      nombre: "E-Commerce Zen", 
      descripcion: "Plataforma de ventas minimalista construida con Next.js y Stripe.",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800"
    },
    { 
      id: "2", 
      nombre: "Task Flow", 
      descripcion: "Gestor de tareas con enfoque en productividad y diseño limpio.",
      image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=800"
    }
  ];

  const mockExperiences = [
    { 
      id: "1", 
      position: "Senior Frontend Developer", 
      company: "Studio Minimal", 
      dates: "2022 - Presente" 
    },
    { 
      id: "2", 
      position: "Web UI Designer", 
      company: "Digital Agency", 
      dates: "2020 - 2022" 
    }
  ];

  // 2. Protección de seguridad: Si no hay datos y no es preview, mostramos carga
  if (!portfolio && !isPreview) {
    return <div className="p-10 text-center">Cargando datos del portafolio...</div>;
  }

  // 3. Asignación de datos con encadenamiento opcional (?.) para evitar errores de null
  const user = isPreview ? mockUser : portfolio?.user;
  const skills = isPreview || !portfolio?.skills?.length ? mockSkills : portfolio.skills;
  const projects = isPreview || !portfolio?.projects?.length ? mockProjects : portfolio.projects;
  const experiences = isPreview || !portfolio?.experiences?.length ? mockExperiences : portfolio.experiences;
  const pages = ["datos personales", "habilidades", "proyectos", "experiencias"];

  const nextPage = () => setPage((p) => (p + 1) % pages.length);
  const prevPage = () => setPage((p) => (p - 1 + pages.length) % pages.length);

  const getSocialIcon = (name: string) => {
    const lname = name.toLowerCase();
    if (lname.includes('linkedin')) return <Globe size={18} strokeWidth={1.2} />;
    if (lname.includes('github')) return <Code2 size={18} strokeWidth={1.2} />;
    return <Link size={18} strokeWidth={1.2} />;
  };

  return (
    <div className="w-full min-h-screen bg-[#F9F9F8] flex items-center justify-center p-4 md:p-10 font-sans text-zinc-900">
      
      {/* Tarjeta Principal - Estética Arena/Piedra */}
      <div className="w-full max-w-6xl aspect-16/10 bg-white flex flex-col md:flex-row overflow-hidden rounded-2xl border border-stone-200 shadow-sm relative">
        
        {/* LADO IZQUIERDO: Visual (Grayscale Profundo) */}
        <div className="w-full md:w-[42%] bg-stone-50 relative overflow-hidden flex items-center justify-center p-12 border-r border-stone-200">
          <div className="w-full h-full rounded-2xl overflow-hidden shadow-sm bg-stone-100">
            <img 
              src={user.image_url} 
              className="w-full h-full object-cover grayscale contrast-125 opacity-90 transition-all duration-500 hover:opacity-100"
              alt={user.fullname}
            />
          </div>
          <div className="absolute top-8 left-8 bg-zinc-900 text-stone-100 px-4 py-1.5 rounded-full shadow-md">
            <h2 className="text-[10px] tracking-[0.3em] font-bold uppercase italic">Portfolio v2.0</h2>
          </div>
        </div>

        {/* LADO DERECHO: Contenido Dinámico */}
        <div className="w-full md:w-[58%] p-8 md:p-16 flex flex-col bg-white">
          
          <div className="animate-in fade-in slide-in-from-right-3 duration-500 grow">
            
            {/* PÁGINA 0: DATOS PERSONALES */}
            {page === 0 && (
              <div className="space-y-6 mt-4">
                <p className="text-stone-400 font-bold text-xs tracking-widest uppercase">/ Perfil Profesional</p>
                <h1 className="text-6xl md:text-7xl font-light text-zinc-950 uppercase leading-none">
                  {user.fullname.split(' ')[0]} <br/>
                  <span className="font-bold text-stone-800">
                    {user.fullname.split(' ')[1] || ""}
                  </span>
                </h1>
                <div className="space-y-3 pt-6 border-t border-stone-100 max-w-lg">
                  <p className="text-stone-600 font-medium text-lg tracking-tight italic">{user.occupation}</p>
                  <p className="text-stone-500 text-sm leading-relaxed">
                    {user.biography}
                  </p>
                </div>
              </div>
            )}

            {/* PÁGINA 1: HABILIDADES (Badges Arena/Zinc) */}
            {page === 1 && (
              <div className="space-y-10 mt-4">
                <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
                  <Layers3 size={24} className="text-zinc-800" />
                  <h2 className="text-4xl font-black text-zinc-900 uppercase tracking-tighter">Habilidades</h2>
                </div>
                
                <div className="flex flex-wrap gap-2 pt-2 max-w-2xl">
                  {skills.map((skill: any, i: number) => (
                    <div 
                      key={skill.id || i} 
                      className="flex items-center gap-2 bg-stone-50 text-zinc-800 px-4 py-2 rounded-full border border-stone-200 shadow-sm transition-all hover:bg-stone-100 hover:border-stone-300"
                    >
                      <span className="text-[13px] font-bold uppercase tracking-tight">{skill.name}</span>
                      {skill.level && (
                        <>
                          <span className="text-stone-300">|</span>
                          <span className="text-[10px] font-medium text-stone-500 uppercase italic">
                            {skill.level}
                          </span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PÁGINA 2: PROYECTOS (Minimalismo Gris) */}
            {page === 2 && (
              <div className="space-y-10 mt-4">
                <p className="text-stone-400 font-bold text-xs tracking-widest uppercase">/ Portfolio</p>
                <h2 className="text-4xl font-black text-zinc-900 uppercase tracking-tighter">Proyectos</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {projects.slice(0, 2).map((p: any, i: number) => (
                    <div key={p.id || i} className="bg-stone-50/50 border border-stone-100 rounded-2xl p-4 transition-all hover:bg-white hover:shadow-xl hover:shadow-stone-200/50 group">
                      <div className="w-full h-28 rounded-lg overflow-hidden bg-stone-100 mb-3">
                        <img src={p.image} className="w-full h-full object-cover grayscale opacity-70 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700" alt={p.nombre} />
                      </div>
                      <h3 className="font-bold text-sm text-zinc-900 uppercase mb-1">{p.nombre}</h3>
                      <p className="text-xs text-stone-400 leading-relaxed line-clamp-2 italic">{p.descripcion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PÁGINA 3: EXPERIENCIAS (Fechas Grandes en Stone) */}
            {page === 3 && (
              <div className="space-y-10 mt-4">
                <p className="text-stone-400 font-bold text-xs tracking-widest uppercase">/ Historial</p>
                <h2 className="text-4xl font-black text-zinc-900 uppercase tracking-tighter">Experiencias</h2>
                
                <div className="space-y-6 pt-2">
                  {experiences.slice(0, 3).map((exp: any, i: number) => (
                    <div key={exp.id || i} className="flex gap-4 items-start group">
                      <div className="w-1.5 h-1.5 rounded-full bg-stone-300 mt-2 group-hover:bg-zinc-800 transition-colors"></div>
                      <div>
                        <span className="text-sm font-medium text-stone-500 tracking-tight block mb-1">
                          {exp.dates || `${exp.startDate} - ${exp.current ? 'Presente' : exp.endDate}`}
                        </span>
                        <h3 className="text-lg font-bold text-zinc-900 uppercase tracking-tight leading-tight">{exp.position}</h3>
                        <p className="text-xs text-stone-400 font-medium uppercase tracking-wider">{exp.company}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* NAVEGACIÓN - Estilo Zinc Profundo */}
          <div className="flex items-center justify-between mt-auto pt-6 border-t border-stone-100">
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
              {portfolio.socialNetworks?.map((sn: any) => (
                <a key={sn.id} href={sn.url} target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 transition-colors">
                  {getSocialIcon(sn.name)}
                </a>
              ))}
            </div>
            
            <div className="text-[10px] font-bold text-stone-200 uppercase tracking-[0.2em]">
              {page + 1} / {pages.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinimalistTemplate;