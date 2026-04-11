import React from 'react';
import type { PortfolioVisibilityData } from '@/services/portfolioVisibilityService';
import { ExternalLink, Code, User } from 'lucide-react';

interface ModernTemplateProps {
  data: PortfolioVisibilityData;
  isPreview?: boolean;
}

const ModernTemplate: React.FC<ModernTemplateProps> = ({ data, isPreview = false }) => {
  // Filtramos solo los items marcados como visibles
  const visibleProjects = data.projects.filter(p => p.checked);
  const visibleSkills = data.skills.filter(s => s.checked);
 // const visibleExperience = data.experience.filter(e => e.checked);

  return (
    <div className={`w-full min-h-screen bg-slate-50 font-sans ${isPreview ? 'scale-90 origin-top border-4 border-purple-400 rounded-3xl overflow-hidden shadow-2xl' : ''}`}>
      {/* Hero Section con Gradiente */}
      <header className="bg-linear-to-br from-blue-600 via-purple-600 to-pink-500 py-20 px-6 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <div className="w-32 h-32 bg-white/20 backdrop-blur-md rounded-full mx-auto mb-6 flex items-center justify-center border-2 border-white/50">
            <User size={64} />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 animate-fade-in">
            {visibleProjects[0]?.label || "Tu Nombre Aquí"}
          </h1>
          <p className="text-xl opacity-90">{visibleProjects[0]?.sublabel || "Tu Profesión"}</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto py-12 px-6 space-y-16">
        {/* Proyectos - Estilo Glassmorphism */}
        {visibleProjects.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-slate-800 mb-8 flex items-center gap-3">
              <Code className="text-purple-600" /> Proyectos Destacados
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {visibleProjects.map((project) => (
                <div key={project.id} className="group bg-white/70 backdrop-blur-sm border border-slate-200 p-6 rounded-2xl hover:shadow-xl transition-all hover:-translate-y-2">
                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-purple-600 transition-colors">{project.label}</h3>
                  <p className="text-slate-500 mt-2">{project.sublabel}</p>
                  <button className="mt-4 flex items-center gap-2 text-sm font-semibold text-blue-600">
                    Ver Proyecto <ExternalLink size={16} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Habilidades - Pills dinámicas */}
        {visibleSkills.length > 0 && (
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Skills & Tecnologías</h2>
            <div className="flex flex-wrap gap-3">
              {visibleSkills.map((skill) => (
                <span key={skill.id} className="px-4 py-2 bg-linear-to-r from-blue-100 to-purple-100 text-purple-700 rounded-full font-medium border border-purple-200">
                  {skill.label}
                </span>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default ModernTemplate;