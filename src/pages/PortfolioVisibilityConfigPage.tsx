import { usePortfolioVisibility } from "../hooks/usePortfolioVisibility";
import { type VisibilityItem, type SectionKey } from "@/services/portfolioVisibilityService";
import Header from "../components/HeaderUser";
import Sidebar from "../components/Sidebar";
import { Footer } from "@/components/Footer";
import { ChevronDown, ChevronUp, Settings } from "lucide-react";
import { useState } from "react";

const PortfolioVisibilityPage = () => {
  const { 
    data: visibilityData, 
    isLoading, 
    isSaving, 
    handleItemCheck, 
    handleBulkSelect 
  } = usePortfolioVisibility();
  
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleExpand = (key: string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getVisibleStats = (key: SectionKey) => {
    const items: VisibilityItem[] = visibilityData ? visibilityData[key] : [];
    const total = items.length;
    const visible = items.filter((i: VisibilityItem) => i.checked).length;
    return `${visible} de ${total} visibles`;
  };

  const sections = [
    { key: 'projects', label: 'Proyectos' },
    { key: 'skills', label: 'Habilidades' },
    { key: 'experience', label: 'Experiencia Laboral' },
    { key: 'education', label: 'Formación Académica' },
    { key: 'certificates', label: 'Certificados' },
    { key: 'networks', label: 'Redes profesionales' },
  ] as const;

  return (
    <div className="min-h-screen bg-[#F7F0E1] flex flex-col font-sans">
      <Header />
      <div className="flex flex-col md:flex-row flex-1">
        <Sidebar />
        <main className="flex-1 p-4 md:p-10">
          <div className="mx-auto max-w-6xl space-y-6">
            
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#003A6C] md:text-4xl mb-2">
                Configuración de Visibilidad
              </h1>
              <p className="text-sm text-[#4B778D] md:text-base">
                Elige qué elementos específicos mostrar en tu portafolio
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
              
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Settings className="w-5 h-5 text-[#003A6C]" />
                </div>
                <div>
                  <h2 className="text-[#003A6C] font-semibold text-lg">
                    Configuración de Visibilidad
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Elige qué elementos específicos mostrar en tu portafolio
                  </p>
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#003A6C]"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {sections.map(({ key, label }) => {
                    const items: VisibilityItem[] = visibilityData ? visibilityData[key] : [];
                    const isExpanded = expandedSections[key];
                    const hasItems = items.length > 0;
                    const allChecked = hasItems && items.every(i => i.checked);
                    const sectionEnabled = hasItems && items.some(i => i.checked);

                    return (
                      
                      <div className={`border border-[#C9E1F0] rounded-xl overflow-hidden transition-all
                         ${!sectionEnabled ? "opacity-50" : "opacity-100"}`}>
                        
                        {/* HEADER */}
                        <div className="p-4 flex items-center justify-between bg-white">
                          <div className="flex items-center gap-4">
                            
                            
                            {/* SWITCH */}
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="sr-only peer"
                                checked={sectionEnabled}
                                disabled={isSaving || !hasItems}
                                onChange={() => handleBulkSelect(key, !allChecked)}/>
                              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#003A6C]"></div>
                            </label>

                            <div className="flex items-center gap-3">
                              <span className="text-[#003A6C] font-semibold">{label}</span>
                              <span className="text-gray-400 text-sm font-medium">
                                {getVisibleStats(key)}
                              </span>
                            </div>
                          </div>

                          {/* EXPAND */}
                          <button 
                            onClick={() => toggleExpand(key)}
                            className="p-1 rounded-full hover:bg-gray-100 text-[#003A6C] transition-colors"
                          >
                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </button>
                        </div>

                        {/* CONTENIDO */}
                        {isExpanded && (
                          <div className="border-t border-[#C9E1F0] bg-[#F8FBFE] px-6 py-5">
                            {items.length > 0 ? (
                              <>
                                
                                {/* BOTONES */}
                                <div className="flex gap-3 mb-6">
                                  <button 
                                    onClick={() => handleBulkSelect(key, true)}
                                    disabled={isSaving || allChecked}
                                    className="px-4 py-2 bg-[#D1B983] text-[#003A6C] text-sm font-medium rounded-lg 
                                               hover:bg-[#c4ab75] active:bg-[#b89f68] transition-colors shadow-sm"
                                  >
                                    Seleccionar todos
                                  </button>

                                  <button 
                                    onClick={() => handleBulkSelect(key, false)}
                                    disabled={isSaving || !allChecked}
                                    className="px-4 py-2 bg-[#C9E1F0] text-[#003A6C] text-sm font-medium rounded-lg 
                                               hover:bg-[#b8d6e8] active:bg-[#a5cde3] transition-colors shadow-sm"
                                  >
                                    Deseleccionar todos
                                  </button>
                                </div>

                                {/* ITEMS */}
                                <div className="space-y-4">
                                  {items.map((item: VisibilityItem) => (
                                    <div key={`${item.sourceTable}-${item.id}`} className="flex items-center gap-4">
                                      <input 
                                        type="checkbox"
                                        checked={item.checked}
                                        disabled={isSaving}
                                        onChange={() => handleItemCheck(key, item.id, item.sourceTable)}
                                        className="w-4 h-4 text-[#003A6C] border-[#A5D7E8] rounded focus:ring-[#003A6C] cursor-pointer"
                                      />

                                      <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-[#003A6C]">
                                          {item.label}
                                        </span>

                                        {item.sublabel && (
                                          <span className="text-xs text-gray-400 font-medium">
                                            {item.sublabel}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </>
                            ) : (
                              <p className="text-sm text-gray-400 italic">
                                No hay elementos para mostrar en esta sección.
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default PortfolioVisibilityPage;