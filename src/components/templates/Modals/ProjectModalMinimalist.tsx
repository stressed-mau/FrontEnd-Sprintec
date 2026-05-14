import React from 'react';
import { X, Code2, ExternalLink, Calendar, User } from "lucide-react";
//import type { ProjectItem } from "@/services/ProjectService";

interface Props {
  project: any;
  onClose: () => void;
}

const ProjectModalMinimalist: React.FC<Props> = ({ project, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl overflow-hidden border border-stone-200 shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex justify-end p-4 border-b border-stone-100">
          <button onClick={onClose} className="text-stone-400 hover:text-black transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-10 overflow-y-auto">
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-4 text-zinc-900">{project.label || project.nombre}</h2>
          <div className="h-1 w-12 bg-zinc-900 mb-8"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-stone-500 italic">
                <User size={16} /> <span className="text-sm uppercase font-bold tracking-widest">{project.rol}</span>
              </div>
              <div className="flex items-center gap-3 text-stone-400 italic">
                <Calendar size={16} /> <span className="text-sm">{project.fechaInicio} — {project.is_current ? 'Presente' : project.fechaFin}</span>
              </div>
            </div>
            <div className="flex gap-4">
              {project.github && (
                <a href={project.github} target="_blank" className="p-3 border border-stone-200 rounded-full hover:bg-stone-50 transition-all"><Code2 size={18}/></a>
              )}
              {project.demo && (
                <a href={project.demo} target="_blank" className="p-3 bg-zinc-900 text-white rounded-full hover:bg-zinc-800 transition-all"><ExternalLink size={18}/></a>
              )}
            </div>
          </div>

          <p className="text-stone-500 text-lg leading-relaxed font-light mb-8 italic">"{project.sublabel || project.descripcion}"</p>
          
          {project.tecnologias && (
            <div className="flex flex-wrap gap-2">
              {project.tecnologias.map((tech: any) => (
                <span key={tech.id} className="text-[10px] font-bold uppercase tracking-widest bg-stone-100 px-3 py-1 rounded-full text-stone-500">
                  {tech.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ProjectModalMinimalist;