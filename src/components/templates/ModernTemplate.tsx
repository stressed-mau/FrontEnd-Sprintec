import React from 'react';
import type { PortfolioVisibilityData } from '@/services/portfolioVisibilityService';
import {   Briefcase, Code, MapPin, Mail, Phone, BookOpen, Heart, ThumbsUp, PenTool, LayoutGrid, Globe 
} from 'lucide-react';

interface ModernTemplateProps {
  data: PortfolioVisibilityData;
  isPreview?: boolean;
}

// Interfaz para la Foto de Perfil (traída del backend)
interface UserInformation {
  fullname: string;
  occupation: string;
  image_url: string;
  residence: string;
  public_email: string;
  phone: string;
  biography: string;
}

const ModernTemplate: React.FC<ModernTemplateProps> = ({ data, isPreview = false }) => {
  // --- 1. DATOS DE USUARIO (Simulación de backend completo) ---
  // Esto debe venir del endpoint USER_INFORMATION_ENDPOINT más rico.
  const userProfile: UserInformation = {
    fullname: "MARGREIRIS BRICEÑO",
    occupation: "COMMUNITY MANAGER & ASISTENTE ADMINISTRATIVO",
    image_url: "https://via.placeholder.com/150", // Reemplazar por image_url real
    residence: "Caracas, Venezuela",
    public_email: "esenciadigital508@gmail.com",
    phone: "+58 412-1234567",
    biography: "Soy abogado de profesión y técnica en asistencia gerencial. Me desempeño como freelance, Community Manager, Gestora de redes sociales y diseño gráfico. Realizo las estrategias de contenido...",
  };

  // --- 2. FILTRADO DE DATOS VISIBLES (del hook) ---
  const visibleProjects = data.projects.filter(p => p.checked);
  // Asumimos que "skills" y "experience" también se filtran aquí igual.
  const visibleSkills = data.skills.filter(s => s.checked); 
  const visibleExperience = data.experience.filter(e => e.checked);

  // --- 3. DATOS SIMULADOS PARA SECCIONES QUE AÚN NO ESTÁN EN TU DATA INTERFACE ---
  // Necesitarás adaptar tu backend y servicio para traer estos datos correctamente estructurados.
  
  // Habilidades Blandas (Simuladas en base a la imagen 0)
  const softSkills = [
    { label: "Liderazgo", icon: ThumbsUp },
    { label: "Profesionalismo", icon: Briefcase },
    { label: "Creatividad", icon: LayoutGrid },
    { label: "Oratoria y Comunicación", icon: PenTool },
  ];

  // Experiencia Académica (Simulada)
  const academicExperience = [
    { label: "Técnico Superior en Gerencia", sublabel: "Instituto Universitario", year: "2018" },
    { label: "Abogado", sublabel: "Universidad Central", year: "2015" },
  ];

  // Redes Profesionales (Simuladas - Imagen 1)
  const professionalNetworks = [
    { label: "Linkedin", icon: Globe},
    { label: "Instagram", icon: Globe},
    { label: "Twitter", icon: Globe},
  ];


  // --- COMPONENTE PRINCIPAL ---
  return (
    <div className={`w-full min-h-screen font-sans ${isPreview ? 'scale-[0.8] origin-top-left border-[6px] border-[#77B6E6] rounded-[30px] shadow-2xl overflow-hidden' : 'bg-white'} overflow-x-hidden text-[#003A6C]`}>
      
        {/* --- CABECERA (Imagen 0) --- */}
        <header className="py-24 px-10 text-center relative border-b border-[#C9E1F0]">
            <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
                <div className="flex gap-1.5 items-center">
                    <Heart size={20} className="text-[#003A6C] fill-current"/>
                    <ThumbsUp size={24} className="text-[#003A6C] fill-current" />
                </div>
                
                {/* PORTAFOLIO - Letra Grande (Imagen 0) */}
                <h1 className="text-[120px] font-extrabold leading-none tracking-tighter text-[#003A6C]">
                    PORTA
                    <span className="block -mt-10">TA</span>
                    <span className="block -mt-10">FOLIO</span>
                </h1>
                
                {/* Ocupación (Imagen 0) */}
                <p className="text-2xl font-semibold mt-6 text-[#003A6C]">
                    {userProfile.occupation.toUpperCase()}
                </p>
                <div className="w-24 h-0.5 bg-[#003A6C] mt-2"></div>
            </div>
            
            {/* Adorno de puntos de Canva (Imagen 0) */}
            <div className="absolute top-20 right-20 grid grid-cols-5 gap-2 opacity-30">
                {[...Array(15)].map((_, i) => <div key={i} className="w-1 h-1 bg-[#003A6C] rounded-full"></div>)}
            </div>
        </header>


        {/* --- DATOS DE USUARIO Y BIOGRAFÍA (Imagen 0) --- */}
        <section className="py-16 px-10 border-b border-[#C9E1F0]">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
                {/* Foto y Nombre */}
                <div className="flex flex-col items-center gap-6 text-center">
                    <img src={userProfile.image_url} alt={userProfile.fullname} className="w-48 h-48 rounded-full border-10px border-white shadow-xl object-cover" />
                    <div>
                        <p className="text-xl text-[#003A6C]">Hola, mi nombre es</p>
                        <h2 className="text-5xl font-extrabold text-[#003A6C] tracking-tight">{userProfile.fullname.toUpperCase()}</h2>
                    </div>
                </div>
                
                {/* Biografía y Contacto */}
                <div className="flex-1 space-y-8 bg-gray-50/50 p-8 rounded-2xl border border-[#C9E1F0]">
                    <div className="prose prose-blue text-[#003A6C] text-lg leading-relaxed">
                        <p>{userProfile.biography}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-[#003A6C]">
                        <div className="flex items-center gap-3"><MapPin className="text-[#77B6E6]" />{userProfile.residence}</div>
                        <div className="flex items-center gap-3"><Mail className="text-[#77B6E6]" />{userProfile.public_email}</div>
                        <div className="flex items-center gap-3"><Phone className="text-[#77B6E6]" />{userProfile.phone}</div>
                    </div>
                </div>
            </div>
        </section>


        {/* --- HABILIDADES (Imagen 0) --- */}
        {(visibleSkills.length > 0 || softSkills.length > 0) && (
            <section className="py-16 px-10 border-b border-[#C9E1F0]">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16">
                    {/* Habilidades Blandas (Estilo Imagen 0 top right) */}
                    <div className="md:w-1/3 flex flex-col items-center text-center">
                        <Code size={40} className="text-[#77B6E6] mb-8" />
                        <h3 className="text-3xl font-bold mb-10">Habilidades Blandas</h3>
                        <div className="flex flex-wrap gap-x-12 gap-y-12 justify-center">
                            {softSkills.map((skill, index) => {
                                const Icon = skill.icon;
                                return (
                                    <div key={index} className="flex flex-col items-center gap-3 w-120px">
                                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border border-[#C9E1F0] text-[#77B6E6]"><Icon size={24}/></div>
                                        <p className="font-semibold text-sm">{skill.label.toUpperCase()}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    
                    {/* Habilidades Técnicas (Estilo Imagen 0 bottom with checks) */}
                    <div className="flex-1">
                        <h3 className="text-[120px] font-extrabold leading-none tracking-tighter text-[#003A6C] ml-2.5 mb-10">HABI</h3>
                        <span className="block text-[120px] font-extrabold leading-none tracking-tighter text-[#003A6C]">LIDA</span>
                        <span className="block text-[120px] font-extrabold leading-none tracking-tighter text-[#003A6C] -mt-10">DES</span>
                        <p className="text-3xl font-semibold -mt-8 text-[#003A6C]">y aptitudes</p>

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
            <section className="py-20 px-10 border-b border-[#C9E1F0]">
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
                        <h3 className="text-6xl font-extrabold text-[#003A6C] tracking-tighter leading-tight">MUESTRA<br/>DE PROYECTOS</h3>
                        <div className="mt-6 p-4 rounded-xl bg-[#77B6E6]/10 text-[#003A6C] font-semibold text-lg inline-block">SOCIAL MEDIA</div>
                    </div>
                </div>
            </section>
        )}


        {/* --- EXPERIENCIA Y REDES (Imagen 1 top) --- */}
        {(visibleExperience.length > 0 || academicExperience.length > 0) && (
            <section className="py-20 px-10 border-b border-[#C9E1F0]">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16">
                    
                    {/* Funciones / Experiencia Laboral (Imagen 1 top right) */}
                    <div className="flex-1">
                        <h3 className="text-5xl font-extrabold mb-12 tracking-tight">FUNCIONES <span className="text-[#77B6E6]">& Experiencia</span></h3>
                        <div className="space-y-6">
                            {visibleExperience.map((exp) => (
                                <div key={exp.id} className="flex gap-6 items-start p-6 bg-gray-50 rounded-xl border border-[#C9E1F0]">
                                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center border border-[#C9E1F0] text-[#77B6E6] shrink-0"><Briefcase size={22}/></div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-lg">{exp.label}</h4>
                                        <p className="text-sm text-gray-500 mt-1">{exp.sublabel}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Experiencia Académica y Redes (Imagen 1 left) */}
                    <div className="md:w-1/3 space-y-16">
                        {/* Académica */}
                        <div className="bg-white p-8 rounded-2xl border-2 border-dashed border-[#C9E1F0]">
                            <h3 className="text-3xl font-bold mb-10 flex items-center gap-4"><BookOpen className="text-[#77B6E6]" />Formación Académica</h3>
                            <div className="space-y-6">
                                {academicExperience.map((acad, index) => (
                                    <div key={index}>
                                        <p className="font-bold text-lg text-[#77B6E6]">{acad.year}</p>
                                        <h4 className="font-semibold text-[#003A6C] mt-1">{acad.label}</h4>
                                        <p className="text-sm text-gray-500">{acad.sublabel}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Redes */}
                        <div className="text-center">
                            <h3 className="text-2xl font-bold mb-8 text-[#003A6C]">Redes Profesionales</h3>
                            <div className="flex gap-8 justify-center">
                                {professionalNetworks.map((net, index) => {
                                    const Icon = net.icon;
                                    return (
                                        <a href="#" key={index} className="w-16 h-16 rounded-full bg-[#77B6E6]/10 flex items-center justify-center border-2 border-[#77B6E6] text-[#77B6E6] hover:bg-[#77B6E6] hover:text-white transition-all transform hover:-translate-y-1">
                                            <Icon size={28}/>
                                        )</a>
                                    );
                                })}
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