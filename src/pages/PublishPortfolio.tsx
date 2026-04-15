import { useEffect, useState } from 'react';
import Header from '../components/HeaderUser';
import Sidebar from '../components/Sidebar';
import { Palette, Upload, CheckCircle2, Copy} from "lucide-react";
import { usePortfolioVisibility } from '../hooks/usePortfolioVisibility';
import ModernTemplate, { type ModernTemplateProfile } from '../components/templates/ModernTemplate';
import { usePublishPortfolio } from '../hooks/usePublishPortfolio';
import MinimalistTemplate from '../components/templates/MinimalistTemplate';
import { usePortfolio } from '../hooks/usePortfolio';
import { CorporatePortfolioTemplate, type CorporatePortfolioData } from "@/components/portfolio/CorporatePortfolioTemplate";
import { getAuthSession } from '@/services/auth/auth-storage';
import { getUserInformation } from '@/services/PersonalDataService';
const CORPORATE_PREVIEW_DATA: CorporatePortfolioData = {
  fullName: "Tu Nombre",
  role: "Tu profesión",
  summary: "Descripción breve profesional",
  email: "correo@ejemplo.com",
  location: "Tu ubicación",
  socialLinks: [
    {
      id: "1",
      label: "LinkedIn",
      url: "https://linkedin.com",
    },
  ],
  skills: ["Skill 1", "Skill 2"],
  experience: [
    {
      id: "1",
      title: "Cargo",
      organization: "Empresa",
      period: "2023 - Actualidad",
      description: "Descripción breve",
    },
  ],
  education: [
    {
      id: "1",
      title: "Carrera",
      institution: "Universidad",
      period: "2018 - 2023",
    },
  ],
  projects: [
    {
      id: "1",
      name: "Proyecto",
      description: "Descripción del proyecto",
      stack: ["React", "Node"],
    },
  ],
};
const PublishPortfolio = () => {
  const {
    data, openSections, sectionsArray, isLoading, isSaving, pageError,
    toggleSection, handleItemCheck, handleBulkSelect, getVisibleCountText, reloadVisibilityData, } = usePortfolioVisibility();
  const { portfolio } = usePortfolio();
  const hasNoMainItems =
    data.projects.length === 0 &&
    data.skills.length === 0 &&
    data.experience.length === 0;
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);
  const [modernProfile, setModernProfile] = useState<ModernTemplateProfile | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const session = getAuthSession();
        if (!session?.user?.id) {
          setModernProfile(null);
          return;
        }

        const user = await getUserInformation(String(session.user.id));
        setModernProfile({
          fullname: String(user?.fullname ?? ''),
          occupation: String(user?.occupation ?? ''),
          image_url: String(user?.image_url ?? ''),
          residence: String(user?.nationality ?? ''),
          public_email: String(user?.public_email ?? ''),
          phone: String(user?.phone_number ?? ''),
          biography: String(user?.biography ?? ''),
        });
      } catch {
        setModernProfile(null);
      }
    };

    void loadProfile();
  }, []);

  const templates = [
    {
      id: 'Moderna',
      title: 'Moderna',
      description: 'Diseño vibrante con gradientes y animaciones',
      features: ['Gradientes dinámicos', 'Efectos glassmorphism', 'Animaciones suaves'],
      colorClass: 'from-blue-500 to-pink-500',
    },
    {
      id: 'Minimalista',
      title: 'Minimalista',
      description: 'Diseño limpio enfocado en contenido',
      features: ['Diseño limpio', 'Tipografía elegante', 'Máxima legibilidad'],
      colorClass: 'bg-gray-200',
    },
    {
      id: 'Corporativa',
      title: 'Corporativa',
      description: 'Diseño profesional y formal',
      features: ['Aspecto profesional', 'Estructura formal', 'Perfecto para empresas'],
      colorClass: 'from-blue-600 to-blue-900',
      previewEnabled: true,
    }
  ];

  const {
    isPublished,
    portfolioUrl,
    handlePublish,
    handleUnpublish,
    loading
  } = usePublishPortfolio();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const selected = templates.find(t => t.id === selectedTemplate);
  const templateNumber =
    selected?.id === "Moderna" ? 1 :
    selected?.id === "Minimalista" ? 2 :
    selected?.id === "Corporativa" ? 3 : null;
  const copyToClipboard = () => {
    navigator.clipboard.writeText(portfolioUrl);
    alert("¡Enlace copiado!");
  };
  const [showPreview, setShowPreview] = useState(false);
  return (
    <div id="publishportfolio-page" className="min-h-screen bg-[#F7F0E1]">
      <Header />

      <div className="flex flex-col md:flex-row">
        <Sidebar />

        <main id="publishportfolio-main" className="flex-1 p-4 md:p-10">
          <div className="max-w-5xl mx-auto">
            
            <div className="text-center md:text-left mb-8">
              <h1 className="text-[#003A6C] text-3xl md:text-4xl font-bold mb-2">Publicar Portafolio</h1>
              <p className="text-gray-600 text-sm md:text-base">Configura tu portafolio, elige una plantilla y publícalo</p>
            </div>


            <section className="bg-gray-100 rounded-2xl border border-[#C9E1F0] p-6 mb-8 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Palette className="text-purple-600 w-6 h-6 transform scale-x-[-1]" />
                <h2 className="text-[#003A6C] text-base font-semibold">Selecciona tu Plantilla</h2>
              </div>
              <p className="text-[#4982ad] text-base mb-6">Elige el diseño que mejor represente tu estilo profesional</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <div 
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`relative cursor-pointer bg-white rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      selectedTemplate === template.id ? 'border-purple-500 ring-2 ring-purple-100' : 'border-gray-100 hover:border-gray-200 shadow-sm'
                    }`}
                  >
                    {/* Visual de la tarjeta */}
                    <div className={`h-32 flex items-center justify-center bg-linear-to-br ${template.colorClass} relative`}>
                      <svg className="w-10 h-10 text-white opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                      
                      {selectedTemplate === template.id && (
                        <div className="absolute top-3 right-3 bg-white rounded-full p-1 shadow-md">
                          <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Contenido de la tarjeta */}
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-gray-800 mb-1">{template.title}</h3>
                      <p className="text-sm text-gray-500 mb-4 leading-relaxed">{template.description}</p>
                      
                      <ul className="space-y-2 mb-6">
                        {template.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-600">
                            <svg className="w-3.5 h-3.5 text-purple-500 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <button 
                        onClick={(e) => { e.stopPropagation(); // Evita seleccionar la plantilla
                        if (template.id === 'Moderna' || template.id === 'Minimalista' || template.id === 'Corporativa') {
                          setPreviewTemplate(template.id);
                          setShowPreview(true);
                        } }} disabled={template.id !== 'Moderna' && template.id !== 'Minimalista' && template.id !== 'Corporativa'} className={`w-full py-2.5 border rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${template.id === 'Moderna' || template.id === 'Minimalista' || template.id === 'Corporativa'? 'border-[#77B6E6] bg-[#C2DBED] text-[#003A6C] hover:bg-[#C4A57C]' : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {template.id === 'Moderna' || template.id === 'Minimalista' || template.id === 'Corporativa' ? 'Vista Previa' : 'Próximamente'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Banner de selección */}
              <div className="mt-6 p-4 bg-[#F8F2FF] rounded-xl border border-purple-300 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-base text-purple-900">Plantilla seleccionada: <span className="font-bold">{selectedTemplate}</span></p>
              </div>
            </section>

            
            {pageError && (
              <div className="mb-6 rounded-2xl border-2 border-red-400 bg-red-100 px-4 py-4 text-sm text-red-900 font-semibold shadow-md">
                <p className="font-bold mb-2">Error cargando visibilidad:</p>
                <p className="mb-3">{pageError}</p>
                <button
                  type="button"
                  onClick={() => void reloadVisibilityData()}
                  className="rounded-lg bg-red-700 px-3 py-1.5 text-white transition-colors hover:bg-red-800"
                >
                  Reintentar
                </button>
              </div>
            )}

            <section className="bg-white rounded-2xl border border-[#C9E1F0] p-6 shadow-sm" aria-labelledby="visibility-config-title">
              <h2 id="visibility-config-title" className="text-[#003A6C] text-xl font-bold mb-1">Configuración de Visibilidad</h2>
              <p className="text-gray-500 text-sm mb-6">Elige qué elementos específicos mostrar en tu portafolio</p>

              {(isLoading || isSaving) && (
                <div className="mb-4 rounded-lg bg-[#F1F7FC] px-4 py-2 text-sm text-[#003A6C]">
                  {isLoading ? 'Cargando datos...' : 'Guardando cambios de visibilidad...'}
                </div>
              )}

              <div className="space-y-6">
                {hasNoMainItems && !isLoading && (
                  <div className="rounded-xl border border-dashed border-[#C9E1F0] bg-[#F8FBFE] px-4 py-3 text-center text-sm text-gray-500">
                    No hay elementos para mostrar en este momento.
                  </div>
                )}
                {sectionsArray.map((sectionConfig) => {
                  const sectionKey = sectionConfig.key;
                  const isOpen = openSections[sectionKey];
                  const items = data[sectionKey];
                  const countText = getVisibleCountText(sectionKey);
                  const sectionEnabled = items.some(item => item.checked);

                  return (
                    <div key={sectionKey} className={`transition-all duration-300 ${!sectionEnabled ? 'opacity-60 grayscale-30' : 'opacity-100'}`}>

                      <div className="flex items-center justify-between p-4 border-b border-[#C9E1F0]">
                        <div className="flex items-center gap-3">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              checked={sectionEnabled}
                              disabled={isLoading || isSaving}
                              onChange={() => void handleBulkSelect(sectionKey, !sectionEnabled)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#003A6C]"></div>
                          </label>
                          <span className="text-[#003A6C] font-semibold">{sectionConfig.title}</span>
                          <span className="text-gray-400 text-sm ml-2">{countText}</span>
                        </div>
                        
                        <button 
                          type="button"
                          onClick={() => toggleSection(sectionKey)}
                          className="text-gray-400 p-1 hover:bg-gray-100 rounded-full transition-colors"
                          aria-label={isOpen ? "Cerrar sección" : "Abrir sección"}>
                          <svg className={`w-5 h-5 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>

                      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-250 opacity-100 pointer-events-auto' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                        <div className="p-4 bg-white border-t border-[#C9E1F0]">
                          
                          <div className="flex gap-2 mb-4">
                            <button 
                              disabled={isLoading || isSaving}
                              onClick={() => void handleBulkSelect(sectionKey, true)}
                              className="px-4 py-1.5 text-sm bg-[#C9E1F0] text-[#003A6C] hover:bg-[#C4A57C] rounded-md font-medium hover:bg-opacity-80 transition-colors" >
                              Seleccionar todos
                            </button>
                            <button 
                              disabled={isLoading || isSaving}
                              onClick={() => void handleBulkSelect(sectionKey, false)}
                              className="px-4 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md font-medium hover:bg-[#C4A57C] transition-colors" >
                              Deseleccionar todos
                            </button>
                          </div>

                          {/* Lista de Checkboxes Individuales */}
                          <div className="space-y-4 ml-2">
                            {items.length === 0 && (
                              <p className="text-sm text-gray-400">No hay elementos para mostrar en esta sección.</p>
                            )}
                            {items.map((item) => (
                              <div key={`${item.sourceTable ?? sectionKey}-${item.id}`} className="flex items-center gap-3">
                                <input 
                                  type="checkbox" 
                                  checked={item.checked} 
                                  disabled={isLoading || isSaving}
                                  onChange={() => void handleItemCheck(sectionKey, item.id, item.sourceTable)}
                                  className="w-5 h-5 text-[#003A6C] border-gray-300 rounded focus:ring-[#003A6C] focus:ring-2 cursor-pointer"
                                />
                                <div className="flex flex-col md:flex-row md:items-baseline md:gap-2">
                                  <span className="text-[#003A6C] font-medium">{item.label}</span>
                                  {item.sublabel && <span className="text-gray-400 text-sm">{item.sublabel}</span>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
      {/* --- SECCIÓN DE ACCIÓN FINAL --- */}
      {!isPublished ? (

        <div className="bg-white rounded-2xl border border-[#C9E1F0] p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 mt-8">
          <div className="flex items-center gap-4">
            <div className="bg-gray-100 p-4 rounded-full">
              <Upload className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <h3 className="text-[#003A6C] text-lg font-bold">Portafolio no publicado</h3>
              <p className="text-gray-500 text-sm">Tu portafolio no es visible públicamente</p>
            </div>
          </div>
          <button 
            // Deshabilitamos si no hay plantilla seleccionada O si está cargando
            disabled={!templateNumber || loading}
            onClick={() => {
              if (!templateNumber) {
                alert("Selecciona una plantilla");
                return;
              }
              handlePublish(templateNumber);
            }}
            className={`bg-[#003A6C] text-white px-5 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-[#002a4d] transition-all shadow-md active:scale-95 ${
              (loading || !templateNumber) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Upload className="w-5 h-5" />
            )}
            {loading ? "Publicando..." : "Publicar portafolio"}
          </button>
        </div>
      ) : (
        // VISTA PUBLICADO (Imagen 2)
        <div className="space-y-6">
          <div className="bg-[#E7F6EC] border border-[#34A853] rounded-2xl p-6 flex items-center justify-between shadow-sm mt-8">
            <div className="flex items-center gap-4">
              <div className="bg-[#34A853] p-2 rounded-full">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-[#003A6C] text-lg font-bold">Portafolio publicado</h3>
                <p className="text-gray-500 text-sm">Tu portafolio es visible para todos</p>
              </div>
            </div>
            <button 
              disabled={loading}
              onClick={() => {
                if (!templateNumber) return;
                handleUnpublish(templateNumber);
              }}
              className={`border border-[#4982ad] bg-[#C2DBED] text-[#003A6C] px-6 py-2 rounded-lg font-semibold text-sm transition-all ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#c4a57c]'
              }`}
            >
              {loading ? "Procesando..." : "Despublicar"}
            </button>
          </div>

          <div className="bg-[#F1F7FC] border border-[#C9E1F0] rounded-2xl p-8 text-center shadow-inner">
            <h4 className="text-[#003A6C] font-bold text-lg mb-2">Tu portafolio está en línea</h4>
            <p className="text-gray-500 text-sm mb-6">Comparte tu enlace para que otros vean tu trabajo</p>
            
            <div className="flex flex-col items-center text-center gap-4 max-w-3xl mx-auto">
              <div className="flex-1 bg-white border border-[#C9E1F0] rounded-xl px-4 py-3 text-blue-500 break-all text-sm font-medium w-full text-left">
                {portfolioUrl}
              </div>
              <button 
                onClick={copyToClipboard}
                className="bg-[#C2DBED] text-[#003A6C] text-sm px-6 py-1.5 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#b0cfeb] transition-all border border-[#77B6E6] w-full md:w-auto justify-center"
              >
                <Copy className="w-4 h-4" />
                Copiar enlace
              </button>
            </div>
          </div>
        </div>
      )}
      {showPreview && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-6xl h-[90vh] bg-white rounded-3xl overflow-hidden flex flex-col shadow-2xl">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
              <div>
                <h3 className="font-bold text-[#003A6C] text-lg">
                  Vista Previa: <span className="text-purple-600">{selectedTemplate || 'Moderna'}</span>
                </h3> <p className="text-xs text-gray-500">Así es como los visitantes verán tu portafolio</p>
              </div>
              <button 
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 font-bold transition-colors" >
                Cerrar
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto bg-gray-50">
              {previewTemplate === 'Moderna' ? (
                <ModernTemplate data={data} profile={modernProfile} />
              ) : previewTemplate === 'Minimalista' ? (
                <MinimalistTemplate 
                  portfolio={portfolio || { user: {}, projects: [], skills: [], experiences: [], socialNetworks: [] } as any} 
                  isPreview={true} 
                />
              ) : previewTemplate === 'Corporativa' ? (
                <CorporatePortfolioTemplate data={CORPORATE_PREVIEW_DATA} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  Selecciona una plantilla
                </div>
              )}
              </div>
          </div>
        </div>
      )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PublishPortfolio;
