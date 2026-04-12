import React from 'react';
import type { PortfolioVisibilityData } from '@/services/portfolioVisibilityService';
import { Briefcase, Code, MapPin, Mail, Phone, BookOpen, Heart, ThumbsUp, LayoutGrid, Globe } from 'lucide-react';

interface ModernTemplateProps {
  data: PortfolioVisibilityData;
  isPreview?: boolean;
    profile?: ModernTemplateProfile | null;
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

const emptyProfile: ModernTemplateProfile = {
    fullname: '',
    occupation: '',
    image_url: '',
    residence: '',
    public_email: '',
    phone: '',
    biography: '',
};

const ModernTemplate: React.FC<ModernTemplateProps> = ({ data, isPreview = false, profile }) => {
    const userProfile = profile ?? emptyProfile;

  const visibleProjects = data.projects.filter(p => p.checked);
    const visibleSkills = data.skills.filter(s => s.checked);
  const visibleExperience = data.experience.filter(e => e.checked);
    const visibleNetworks = data.networks.filter(n => n.checked);
    const workExperience = visibleExperience.filter((exp) => exp.sourceTable === 'work_experiences');
    const academicExperience = visibleExperience.filter((exp) => exp.sourceTable === 'educations');
    const highlightedSkills = visibleSkills.slice(0, 4);


  // --- COMPONENTE PRINCIPAL ---
  return (
    <div className={`w-full min-h-screen font-sans ${isPreview ? 'scale-[0.8] origin-top-left border-[6px] border-[#77B6E6] rounded-[30px] shadow-2xl overflow-hidden' : 'bg-white'} overflow-x-hidden text-[#003A6C]`}>
      
        {/* --- CABECERA (Imagen 0) --- */}
        <header className="relative border-b border-[#C9E1F0] px-5 py-14 text-center sm:px-8 sm:py-20 lg:px-10 lg:py-24">
            <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
                <div className="flex gap-1.5 items-center">
                    <Heart size={20} className="text-[#003A6C] fill-current"/>
                    <ThumbsUp size={24} className="text-[#003A6C] fill-current" />
                </div>
                
                {/* PORTAFOLIO - Letra Grande (Imagen 0) */}
                <h1 className="text-[58px] font-extrabold leading-none tracking-tighter text-[#003A6C] sm:text-[88px] lg:text-[120px]">
                    PORTA
                    <span className="-mt-4 block sm:-mt-6 lg:-mt-10">TA</span>
                    <span className="-mt-4 block sm:-mt-6 lg:-mt-10">FOLIO</span>
                </h1>
                
                {/* Ocupación (Imagen 0) */}
                <p className="mt-6 text-lg font-semibold text-[#003A6C] sm:text-xl md:text-2xl">
                    {(userProfile.occupation || 'Perfil profesional').toUpperCase()}
                </p>
                <div className="w-24 h-0.5 bg-[#003A6C] mt-2"></div>
            </div>
            
            {/* Adorno de puntos de Canva (Imagen 0) */}
            <div className="absolute right-4 top-10 hidden grid-cols-5 gap-2 opacity-30 md:grid">
                {[...Array(15)].map((_, i) => <div key={i} className="w-1 h-1 bg-[#003A6C] rounded-full"></div>)}
            </div>
        </header>


        {/* --- DATOS DE USUARIO Y BIOGRAFÍA (Imagen 0) --- */}
        <section className="border-b border-[#C9E1F0] px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
                {/* Foto y Nombre */}
                <div className="flex flex-col items-center gap-6 text-center">
                    <img src={userProfile.image_url || "https://via.placeholder.com/150"} alt={userProfile.fullname || 'Usuario'} className="h-36 w-36 rounded-full border-10 border-white object-cover shadow-xl sm:h-44 sm:w-44 md:h-48 md:w-48" />
                    <div>
                        <p className="text-xl text-[#003A6C]">Hola, mi nombre es</p>
                        <h2 className="text-3xl font-extrabold tracking-tight text-[#003A6C] sm:text-4xl md:text-5xl">{(userProfile.fullname || 'Usuario').toUpperCase()}</h2>
                    </div>
                </div>
                
                {/* Biografía y Contacto */}
                <div className="flex-1 space-y-8 bg-gray-50/50 p-8 rounded-2xl border border-[#C9E1F0]">
                    <div className="prose prose-blue text-[#003A6C] text-lg leading-relaxed">
                        <p>{userProfile.biography || 'Este perfil aun no tiene una biografia publicada.'}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-[#003A6C]">
                        <div className="flex items-center gap-3"><MapPin className="text-[#77B6E6]" />{userProfile.residence || 'Residencia no disponible'}</div>
                        <div className="flex items-center gap-3"><Mail className="text-[#77B6E6]" />{userProfile.public_email || 'Correo no disponible'}</div>
                        <div className="flex items-center gap-3"><Phone className="text-[#77B6E6]" />{userProfile.phone || 'Telefono no disponible'}</div>
                    </div>
                </div>
            </div>
        </section>


        {/* --- HABILIDADES (Imagen 0) --- */}
        {visibleSkills.length > 0 && (
            <section className="border-b border-[#C9E1F0] px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16">
                    {/* Habilidades Blandas (Estilo Imagen 0 top right) */}
                    <div className="md:w-1/3 flex flex-col items-center text-center">
                        <Code size={40} className="text-[#77B6E6] mb-8" />
                        <h3 className="text-3xl font-bold mb-10">Habilidades Destacadas</h3>
                        <div className="flex flex-wrap gap-x-12 gap-y-12 justify-center">
                            {highlightedSkills.map((skill, index) => {
                                return (
                                    <div key={index} className="flex flex-col items-center gap-3 w-120px">
                                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border border-[#C9E1F0] text-[#77B6E6] text-xl font-bold">{skill.label.slice(0, 1).toUpperCase()}</div>
                                        <p className="font-semibold text-sm">{skill.label.toUpperCase()}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    
                    {/* Habilidades Técnicas (Estilo Imagen 0 bottom with checks) */}
                    <div className="flex-1">
                        <h3 className="mb-4 ml-2.5 text-[56px] font-extrabold leading-none tracking-tighter text-[#003A6C] sm:text-[84px] lg:text-[120px]">HABI</h3>
                        <span className="block text-[56px] font-extrabold leading-none tracking-tighter text-[#003A6C] sm:text-[84px] lg:text-[120px]">LIDA</span>
                        <span className="-mt-2 block text-[56px] font-extrabold leading-none tracking-tighter text-[#003A6C] sm:-mt-4 sm:text-[84px] lg:-mt-10 lg:text-[120px]">DES</span>
                        <p className="-mt-2 text-2xl font-semibold text-[#003A6C] sm:-mt-4 sm:text-3xl">y aptitudes</p>

                        <div className="mt-16 bg-white p-8 rounded-2xl border-2 border-dashed border-[#C9E1F0] space-y-5">
                            {visibleSkills.map((skill) => (
                                <div key={skill.id} className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="w-6 h-6 rounded-full border-2 border-[#C9E1F0] text-[#77B6E6] flex items-center justify-center p-0.5">✓</div>
                                        <p className="text-xl font-medium text-[#003A6C]">{skill.label}</p>
                                    </div>
                                    <p className="text-gray-400 text-sm whitespace-nowrap">{skill.sublabel}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        )}


        {/* --- PROYECTOS: GALERÍA DE MOSAICO (Imagen 1 bottom) --- */}
        {visibleProjects.length > 0 && (
            <section className="border-b border-[#C9E1F0] px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-6">
                        {visibleProjects.map((project) => (
                            <div key={project.id} className="aspect-square bg-white rounded-2xl overflow-hidden border border-[#C9E1F0] shadow-sm hover:shadow-lg transition-shadow group relative">
                                <img src="https://via.placeholder.com/300" alt={project.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center text-white">
                                    <h4 className="font-bold text-lg">{project.label}</h4>
                                    <p className="text-xs opacity-90 mt-1">{project.sublabel}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Título de Proyectos (Estilo Canva) */}
                    <div className="md:w-1/3 text-center md:text-right">
                        <LayoutGrid size={40} className="text-[#77B6E6] mb-8" />
                        <h3 className="text-4xl font-extrabold text-[#003A6C] tracking-tighter leading-tight sm:text-5xl lg:text-6xl">MUESTRA<br/>DE PROYECTOS</h3>
                        <div className="mt-6 p-4 rounded-xl bg-[#77B6E6]/10 text-[#003A6C] font-semibold text-lg inline-block">SOCIAL MEDIA</div>
                    </div>
                </div>
            </section>
        )}


        {/* --- EXPERIENCIA Y REDES (Imagen 1 top) --- */}
        {(visibleExperience.length > 0 || visibleNetworks.length > 0) && (
            <section className="border-b border-[#C9E1F0] px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16">
                    
                    {/* Funciones / Experiencia Laboral (Imagen 1 top right) */}
                    <div className="flex-1">
                        <h3 className="text-5xl font-extrabold mb-12 tracking-tight">FUNCIONES <span className="text-[#77B6E6]">& Experiencia</span></h3>
                        <div className="space-y-6">
                            {workExperience.map((exp) => (
                                <div key={exp.id} className="flex gap-6 items-start p-6 bg-gray-50 rounded-xl border border-[#C9E1F0]">
                                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center border border-[#C9E1F0] text-[#77B6E6] shrink-0"><Briefcase size={22}/></div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-lg">{exp.label}</h4>
                                        <p className="text-sm text-gray-500 mt-1">{exp.sublabel}</p>
                                    </div>
                                </div>
                            ))}
                            {workExperience.length === 0 ? (
                                <p className="text-sm text-gray-500">No hay experiencia laboral visible.</p>
                            ) : null}
                        </div>
                    </div>

                    {/* Experiencia Académica y Redes (Imagen 1 left) */}
                    <div className="md:w-1/3 space-y-16">
                        {/* Académica */}
                        <div className="bg-white p-8 rounded-2xl border-2 border-dashed border-[#C9E1F0]">
                            <h3 className="text-3xl font-bold mb-10 flex items-center gap-4"><BookOpen className="text-[#77B6E6]" />Formación Académica</h3>
                            <div className="space-y-6">
                                {academicExperience.map((acad) => (
                                    <div key={acad.id}>
                                        <p className="font-bold text-lg text-[#77B6E6]">Formación</p>
                                        <h4 className="font-semibold text-[#003A6C] mt-1">{acad.label}</h4>
                                        <p className="text-sm text-gray-500">{acad.sublabel}</p>
                                    </div>
                                ))}
                                {academicExperience.length === 0 ? (
                                    <p className="text-sm text-gray-500">No hay formación académica visible.</p>
                                ) : null}
                            </div>
                        </div>

                        {/* Redes */}
                        <div className="text-center">
                            <h3 className="text-2xl font-bold mb-8 text-[#003A6C]">Redes Profesionales</h3>
                            <div className="flex gap-8 justify-center">
                                {visibleNetworks.map((net) => (
                                    <a href={net.sublabel || '#'} target="_blank" rel="noreferrer" key={net.id} className="w-16 h-16 rounded-full bg-[#77B6E6]/10 flex items-center justify-center border-2 border-[#77B6E6] text-[#77B6E6] hover:bg-[#77B6E6] hover:text-white transition-all transform hover:-translate-y-1" title={net.label}>
                                        <Globe size={28}/>
                                    </a>
                                ))}
                                {visibleNetworks.length === 0 ? (
                                    <p className="text-sm text-gray-500">No hay redes visibles.</p>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )}


    </div>
  );
};

export default ModernTemplate;