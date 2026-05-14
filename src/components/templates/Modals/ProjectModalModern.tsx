import React from 'react';
import { X, Globe, Code2, Calendar, Target } from "lucide-react";

interface Props {
  project: any;
  onClose: () => void;
}

const ProjectModalModern: React.FC<Props> = ({ project, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#173b61]/20 backdrop-blur-md animate-in zoom-in duration-300">
      <div className="bg-[#fcecd4] w-full max-w-3xl rounded-[2.5rem] border-8 border-[#173b61] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="p-6 flex justify-between items-center bg-white/50 border-b border-[#173b61]/10">
          <span className="text-[#ee8e3b] font-black uppercase tracking-widest text-sm">Detalle de Proyecto</span>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-[#173b61] text-[#fcecd4] flex items-center justify-center hover:scale-110 transition-transform">
            <X size={20} />
          </button>
        </div>
        <div className="p-10 overflow-y-auto text-[#173b61]">
          <h2 className="text-5xl font-black tracking-tighter mb-6 uppercase italic">{project.label || project.nombre}</h2>
          
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="bg-white/80 px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm border border-[#173b61]/5">
              <Target size={18} className="text-[#ee8e3b]" /> <span className="font-bold text-sm">{project.rol}</span>
            </div>
            <div className="bg-white/80 px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm border border-[#173b61]/5">
              <Calendar size={18} className="text-[#ee8e3b]" /> <span className="font-bold text-sm">{project.fechaInicio}</span>
            </div>
          </div>

          <p className="text-xl leading-relaxed mb-8 text-[#2f606b] italic font-medium">"{project.sublabel || project.descripcion}"</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-black uppercase text-xs tracking-widest opacity-50">Stack Tecnológico</h4>
              <div className="flex flex-wrap gap-2">
                {project.tecnologias?.map((tech: any) => (
                  <span key={tech.id} className="px-3 py-1 bg-[#173b61] text-[#fcecd4] rounded-lg text-xs font-bold">{tech.name}</span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 justify-center">
              {project.github && (
                <a href={project.github} target="_blank" className="flex items-center gap-3 font-bold hover:text-[#ee8e3b] transition-colors uppercase text-sm tracking-tighter"><Code2 size={20}/> Repositorio GitHub</a>
              )}
              {project.demo && (
                <a href={project.demo} target="_blank" className="flex items-center gap-3 font-bold hover:text-[#ee8e3b] transition-colors uppercase text-sm tracking-tighter"><Globe size={20}/> Ver Demo En Vivo</a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProjectModalModern;