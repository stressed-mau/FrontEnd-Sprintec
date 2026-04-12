import React from 'react';
import type { PortfolioVisibilityData } from '@/services/portfolioVisibilityService';
import { MapPin, Mail, Phone, Heart, Globe, GraduationCap, Award } from 'lucide-react';

interface ModernTemplateProps {
  data: PortfolioVisibilityData;
  profile?: ModernTemplateProfile | null;
  isPreview?: boolean;
}

export interface ModernTemplateProfile {
  fullname: string;
  occupation: string;
  image_url: string;
  residence: string;
  public_email: string;
  phone: string;
  biography: string;
}

const ModernTemplate: React.FC<ModernTemplateProps> = ({ data, profile, isPreview = false }) => {
  const userProfile = profile ?? {
    fullname: '',
    occupation: '',
    image_url: '',
    residence: '',
    public_email: '',
    phone: '',
    biography: '',
  };

  const displayName = userProfile.fullname.trim() || 'Sin nombre disponible';
  const displayOccupation = userProfile.occupation.trim() || 'Sin ocupación disponible';
  const displayBiography = userProfile.biography.trim() || 'Sin biografía disponible';
  const displayResidence = userProfile.residence.trim() || 'Sin ubicación disponible';
  const displayEmail = userProfile.public_email.trim() || 'Sin correo público disponible';
  const displayPhone = userProfile.phone.trim() || 'Sin teléfono disponible';
  const userInitial = displayName.slice(0, 1).toUpperCase() || '?';

  const visibleProjects = data.projects.filter(p => p.checked);
  const visibleSkills = data.skills.filter(s => s.checked);
  const visibleExperience = data.experience.filter(e => e.checked);
  const visibleNetworks = data.networks.filter(n => n.checked);

  const workExperience = visibleExperience.filter((exp) => exp.sourceTable === 'work_experiences');
  const academicExperience = visibleExperience.filter((exp) => exp.sourceTable === 'educations');

  const highlightedSkills = visibleSkills.slice(0, 4);

  return (
    <div className={`w-full min-h-screen font-sans bg-[#fcecd4] ${isPreview ? 'scale-[0.8] origin-top-left border-8 border-[#173b61] rounded-[40px] shadow-2xl overflow-hidden' : ''} text-[#173b61]`}>
      
      {/* --- HEADER CON DEGRADADO --- */}
      <header className="relative pt-32 pb-20 px-10 text-center overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-[#173b61]/10 to-transparent opacity-50 -z-10"></div>
        
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center gap-3 mb-8">
            <Heart size={28} className="text-[#ee8e3b] fill-[#ee8e3b] animate-pulse" />
            <Award size={28} className="text-[#2f606b]" />
          </div>
          
          <h1 className="text-[90px] md:text-[140px] font-black leading-[0.85] tracking-tighter drop-shadow-sm">
            PORTA<br/>
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#173b61] to-[#ee8e3b]">FOLIO</span>
          </h1>
          
          <div className="mt-10 inline-block bg-[#173b61] px-6 py-2 rounded-full">
            <p className="text-sm md:text-lg font-bold tracking-[0.2em] text-[#fcecd4]">
              {displayOccupation.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Elemento Decorativo: Puntos */}
        <div className="absolute top-10 right-10 grid grid-cols-4 gap-2 opacity-20">
          {[...Array(12)].map((_, i) => <div key={i} className="w-2 h-2 bg-[#2f606b] rounded-full"></div>)}
        </div>
      </header>

      {/* --- PERFIL Y BIO --- */}
      <section className="py-20 px-6 md:px-20 bg-white/40 backdrop-blur-md border-y border-[#7d959e]/20">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="relative group">
            <div className="absolute -inset-4 bg-linear-to-tr from-[#ee8e3b] to-[#2f606b] rounded-full opacity-30 group-hover:opacity-50 transition-opacity blur-lg"></div>
            {userProfile.image_url ? (
              <img 
                src={userProfile.image_url} 
                alt={displayName} 
                className="relative w-64 h-64 rounded-full border-12 border-white shadow-2xl object-cover z-10" 
              />
            ) : (
              <div className="relative w-64 h-64 rounded-full border-12 border-white shadow-2xl bg-[#173b61] text-[#fcecd4] flex items-center justify-center text-6xl font-black z-10">
                {userInitial}
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <span className="text-[#ee8e3b] font-bold tracking-widest text-sm uppercase">Sobre mí</span>
            <h2 className="text-5xl font-black mt-2 mb-6 tracking-tight">{displayName}</h2>
            <p className="text-xl text-[#2f606b] leading-relaxed mb-8 italic">
              "{displayBiography}"
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: MapPin, text: displayResidence },
                { icon: Mail, text: displayEmail },
                { icon: Phone, text: displayPhone }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-white/60 rounded-xl shadow-sm border border-white/80">
                  <item.icon size={18} className="text-[#ee8e3b]" />
                  <span className="text-sm font-semibold">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- HABILIDADES --- */}
      <section className="py-24 px-6 md:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-20">
            {/* Soft Skills */}
            <div className="lg:w-1/3">
              <div className="sticky top-10">
                <div className="bg-[#173b61] text-[#fcecd4] p-8 rounded-[2rem] shadow-xl">
                  <h3 className="text-3xl font-black mb-8 border-b border-[#fcecd4]/20 pb-4">Habilidades</h3>
                  <div className="grid grid-cols-2 gap-6">
                    {highlightedSkills.length > 0 ? highlightedSkills.map((skill, i) => (
                      <div key={i} className="flex flex-col items-center text-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-[#2f606b] flex items-center justify-center text-[#ee8e3b] text-lg font-black">
                          {skill.label.slice(0, 1).toUpperCase()}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-tighter">{skill.label}</span>
                      </div>
                    )) : (
                      <p className="col-span-2 text-center text-xs text-[#fcecd4]/80">No hay habilidades visibles.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Skills */}
            <div className="flex-1">
              <h3 className="text-[100px] font-black leading-none text-[#173b61]/10 select-none">SKILLS</h3>
              <div className="-mt-10 space-y-4">
                {visibleSkills.length > 0 ? visibleSkills.map((skill) => (
                  <div key={skill.id} className="group flex items-center justify-between p-5 bg-white rounded-2xl shadow-sm border-l-8 border-[#ee8e3b] hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#fcecd4] flex items-center justify-center text-[#173b61] font-bold">✓</div>
                      <p className="text-xl font-bold">{skill.label}</p>
                    </div>
                    <span className="text-xs font-bold text-[#7d959e] uppercase tracking-widest">{skill.sublabel}</span>
                  </div>
                )) : (
                  <div className="p-5 bg-white rounded-2xl shadow-sm border-l-8 border-[#7d959e]/40">
                    <p className="text-[#2f606b]">No hay habilidades visibles para mostrar.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PROYECTOS (FEED STYLE) --- */}
      <section className="py-24 px-6 md:px-20 bg-[#173b61]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-6xl font-black text-[#fcecd4]">PROYECTOS</h2>
              <p className="text-[#ee8e3b] font-bold mt-2 uppercase tracking-[0.3em]">Muestra de trabajo</p>
            </div>
            <div className="px-6 py-2 bg-[#2f606b] rounded-full text-[#fcecd4] font-bold text-sm">
              SOCIAL MEDIA FEED
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleProjects.length > 0 ? visibleProjects.map((project) => (
              <div key={project.id} className="group relative aspect-square rounded-[2rem] overflow-hidden bg-[#2f606b]">
                <img src="https://via.placeholder.com/500" alt={project.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-linear-to-t from-[#173b61] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-8 flex flex-col justify-end">
                  <h4 className="text-[#fcecd4] text-2xl font-black">{project.label}</h4>
                  <p className="text-[#ee8e3b] font-bold text-sm mt-1">{project.sublabel}</p>
                </div>
              </div>
            )) : (
              <div className="col-span-full rounded-2xl border border-[#fcecd4]/30 bg-[#2f606b] p-8 text-center text-[#fcecd4]/90">
                No hay proyectos visibles para mostrar.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* --- EXPERIENCIA Y ACADEMIA --- */}
      <section className="py-24 px-6 md:px-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20">
          
          {/* Experiencia */}
          <div>
            <div className="flex items-center gap-4 mb-12">
              <div className="h-1 w-12 bg-[#ee8e3b]"></div>
              <h3 className="text-4xl font-black uppercase tracking-tighter">Experiencia</h3>
            </div>
            <div className="space-y-8">
              {workExperience.length > 0 ? workExperience.map((exp) => (
                <div key={exp.id} className="relative pl-10 border-l-2 border-[#7d959e]/30 pb-4">
                  <div className="absolute -left-2.25 top-0 w-4 h-4 rounded-full bg-[#ee8e3b] shadow-[0_0_10px_#ee8e3b]"></div>
                  <h4 className="text-2xl font-bold leading-tight">{exp.label}</h4>
                  <p className="text-[#2f606b] font-semibold mt-1">{exp.sublabel}</p>
                </div>
              )) : (
                <p className="text-[#2f606b]">No hay experiencia laboral visible.</p>
              )}
            </div>
          </div>

          {/* Academia y Redes */}
          <div className="space-y-16">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-[#7d959e]/10">
              <div className="flex items-center gap-3 mb-8">
                <GraduationCap className="text-[#ee8e3b]" size={32} />
                <h3 className="text-2xl font-black uppercase">Formación</h3>
              </div>
              <div className="space-y-8">
                {academicExperience.length > 0 ? academicExperience.map((acad) => (
                  <div key={acad.id} className="group">
                    <span className="text-[#ee8e3b] font-black text-lg">/ Formación</span>
                    <h4 className="text-xl font-bold group-hover:text-[#2f606b] transition-colors">{acad.label}</h4>
                    <p className="text-sm text-[#7d959e] font-medium">{acad.sublabel}</p>
                  </div>
                )) : (
                  <p className="text-[#2f606b]">No hay formación académica visible.</p>
                )}
              </div>
            </div>

            <div className="text-center bg-[#2f606b] p-10 rounded-[2.5rem]">
              <h3 className="text-[#fcecd4] text-xl font-black mb-8 uppercase tracking-widest">Conectemos</h3>
              <div className="flex justify-center gap-6">
                {visibleNetworks.length > 0 ? visibleNetworks.map((net) => (
                  <a key={net.id} href={net.sublabel || '#'} target="_blank" rel="noreferrer" className="w-14 h-14 bg-[#fcecd4] rounded-2xl flex items-center justify-center text-[#173b61] hover:bg-[#ee8e3b] hover:text-white transition-all transform hover:-translate-y-2 shadow-lg" title={net.label}>
                    <Globe size={24} />
                  </a>
                )) : (
                  <p className="text-[#fcecd4]/85">No hay redes visibles.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-10 text-center border-t border-[#7d959e]/10">
        <p className="text-[10px] font-black tracking-[0.5em] text-[#7d959e] uppercase">
          Portafolio Profesional • {displayName}
        </p>
      </footer>
    </div>
  );
};

export default ModernTemplate;