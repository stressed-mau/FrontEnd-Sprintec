import { X, Briefcase, Calendar, Code2, ExternalLink } from "lucide-react";
import type { ProjectItem } from "@/services/ProjectService"; // [cite: 191, 274]

const formatDate = (date?: string) => {
  if (!date) return "No especificado"; 
  try {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
    }); 
  } catch {
    return date;
  }
};

const ProjectModalCorporate = ({
  project,
  onClose,
}: {
  project: ProjectItem; // Usamos el tipo formal 
  onClose: () => void;
}) => {
  // Ahora usamos 'tecnologias' que viene del servicio 
  const technologies = project.tecnologias || []; 

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111111]/70 p-4 backdrop-blur-sm">
      <div className="max-h-[95vh] w-full max-w-4xl overflow-hidden rounded-[2rem] border border-[#D6A96B]/25 bg-[#EFE8DE] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[linear-gradient(180deg,#1F1F1F_0%,#171717_100%)] px-8 py-6 text-white">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#D6A96B]">Proyecto</p>
            <h3 className="mt-2 text-2xl font-black tracking-[-0.04em]">Detalles del Proyecto</h3>
          </div>
          <button onClick={onClose} className="rounded-full border border-white/10 bg-white/5 p-2 transition hover:border-[#D6A96B] hover:bg-[#D6A96B]/10 hover:text-[#F4D8AE]">
            <X size={22} />
          </button>
        </div>

        {/* BODY */}
        <div className="max-h-[calc(95vh-96px)] overflow-y-auto p-8">
          {/* IMAGE - Usamos la propiedad image normalizada [cite: 335] */}
          {project.image && (
            <div className="mb-8 overflow-hidden rounded-[1.8rem] border border-black/10 bg-black/5">
              <img src={project.image} alt={project.nombre} className="h-[320px] w-full object-cover" />
            </div>
          )}

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#8C6E46]">Nombre del Proyecto</p>
            <h2 className="mt-2 text-4xl font-black tracking-[-0.05em] text-[#111111]">
              {project.nombre || "Proyecto sin nombre"}
            </h2>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.5rem] border border-black/10 bg-white/55 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-2 text-[#8C6E46]"><Briefcase size={16} /><p className="text-xs font-bold uppercase tracking-[0.2em]">Rol</p></div>
              <p className="mt-4 text-sm font-semibold text-[#3D4348]">{project.rol || "No especificado"}</p>
            </div>

            <div className="rounded-[1.5rem] border border-black/10 bg-white/55 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-2 text-[#8C6E46]"><Calendar size={16} /><p className="text-xs font-bold uppercase tracking-[0.2em]">Inicio</p></div>
              <p className="mt-4 text-sm font-semibold text-[#3D4348]">{formatDate(project.fechaInicio)}</p>
            </div>

            <div className="rounded-[1.5rem] border border-black/10 bg-white/55 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-2 text-[#8C6E46]"><Calendar size={16} /><p className="text-xs font-bold uppercase tracking-[0.2em]">Finalización</p></div>
              <p className="mt-4 text-sm font-semibold text-[#3D4348]">
                {project.is_current ? "Proyecto en curso" : formatDate(project.fechaFin)}
              </p>
            </div>
          </div>

          <div className="mt-10">
            <h4 className="text-xs font-bold uppercase tracking-[0.28em] text-[#8C6E46]">Descripción del Proyecto</h4>
            <div className="mt-4 rounded-[1.8rem] border border-black/10 bg-white/45 p-6">
              <p className="text-sm leading-8 text-[#4B545D]">{project.descripcion || "No hay descripción disponible."}</p>
            </div>
          </div>

          {/* TECHNOLOGIES - Iteramos sobre el array de objetos [cite: 179] */}
          <div className="mt-10">
            <h4 className="text-xs font-bold uppercase tracking-[0.28em] text-[#8C6E46]">Tecnologías Aplicadas</h4>
            {technologies.length ? (
              <div className="mt-5 flex flex-wrap gap-3">
                {technologies.map((tech) => (
                  <span key={tech.id} className="rounded-full border border-black/10 bg-[#F2E7D7] px-4 py-2 text-xs font-semibold text-[#3D4348]">
                    {tech.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-[#5E6670]">No hay tecnologías registradas.</p>
            )}
          </div>

          {/* LINKS - Usamos github y demo normalizados [cite: 334, 335] */}
          {(project.github || project.demo) && (
            <div className="mt-10">
              <h4 className="text-xs font-bold uppercase tracking-[0.28em] text-[#8C6E46]">Enlaces del Proyecto</h4>
              <div className="mt-5 flex flex-wrap gap-4">
                {project.github && (
                  <a href={project.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-full border border-black/10 bg-[#111111] px-5 py-3 text-sm font-semibold text-white transition hover:text-[#F4D8AE]">
                    <Code2 size={16} /> Ver GitHub
                  </a>
                )}
                {project.demo && (
                  <a href={project.demo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-full border border-[#8C6E46]/25 bg-[#F2E7D7] px-5 py-3 text-sm font-semibold text-[#3D4348] transition hover:bg-[#E8D5B7]">
                    <ExternalLink size={16} /> Ver Demo
                  </a>
                )}
              </div>
            </div>
          )}

          <div className="mt-12 flex justify-end border-t border-black/10 pt-6">
            <button onClick={onClose} className="rounded-full border border-black/10 bg-[#111111] px-6 py-3 text-sm font-semibold text-white transition hover:text-[#F4D8AE]">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProjectModalCorporate;