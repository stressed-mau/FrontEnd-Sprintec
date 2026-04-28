import { usePortfolioVisibility } from "../hooks/usePortfolioVisibility";
import { type VisibilityItem, type SectionKey } from "@/services/portfolioVisibilityService";
import Header from "../components/HeaderUser";
import Sidebar from "../components/Sidebar";
import { Footer } from "@/components/Footer";
import { ChevronDown, ChevronUp, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const PortfolioVisibilityPage = () => {
  const { data: visibilityData, isLoading, isSaving, handleItemCheck, toggleSection: handleToggleAllSection } = usePortfolioVisibility();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    projects: true,
    skills: true
  });

  const toggleExpand = (key: string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

 const getVisibleStats = (key: SectionKey) => {
  // Aseguramos que items sea un arreglo de VisibilityItem
  const items: VisibilityItem[] = visibilityData ? visibilityData[key] : [];
  const total = items.length;
  
  // Agregamos el tipo ': VisibilityItem' al parámetro 'i'
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
    <div className="min-h-screen bg-[#F7F0E1] flex flex-col">
      <Header />
      <div className="flex flex-col md:flex-row flex-1">
        <Sidebar />
        <main className="flex-1 p-4 md:p-10">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-[#003A6C] text-3xl font-bold">Configuración de Visibilidad</h1>
              <p className="text-gray-600">Controla qué elementos serán públicos en tu portafolio.</p>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003A6C]"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {sections.map(({ key, label }) => {
                  const items: VisibilityItem[] = visibilityData ? visibilityData[key] : [];
                  const allChecked = items.length > 0 && items.every((i: VisibilityItem) => i.checked);
                  const isExpanded = expandedSections[key];

                  return (
                    <div key={key} className="bg-white border border-[#C9E1F0] rounded-2xl overflow-hidden shadow-sm">
                      {/* Header de la Sección (Mockup Style) */}
                      <div className="p-4 flex items-center justify-between bg-white">
                        <div className="flex items-center gap-4">
                          {/* Toggle Principal */}
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer"
                              checked={allChecked}
                              disabled={isSaving || items.length === 0}
                              onChange={() => void handleToggleAllSection(key)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#003A6C]"></div>
                          </label>
                          
                          <div>
                            <span className="text-[#003A6C] font-bold block md:inline">{label}</span>
                            <span className="text-gray-400 text-xs md:ml-3">{getVisibleStats(key)}</span>
                          </div>
                        </div>

                        <button 
                          onClick={() => toggleExpand(key)}
                          className="text-gray-400 hover:text-[#003A6C] transition-colors"
                        >
                          {isExpanded ? <ChevronUp /> : <ChevronDown />}
                        </button>
                      </div>

                      {/* Lista de Items (Acordeón) */}
                      {isExpanded && items.length > 0 && (
                        <div className="px-14 pb-4 space-y-3 border-t border-gray-50 pt-4 bg-[#F8FAFC]">
                          {items.map((item: VisibilityItem) => (
                            <div key={`${item.sourceTable}-${item.id}`} className="flex items-center justify-between group">
                              <div className="flex items-center gap-3">
                                <input 
                                  type="checkbox"
                                  checked={item.checked}
                                  disabled={isSaving}
                                  onChange={() => void handleItemCheck(key, item.id, item.sourceTable)}
                                  className="w-4 h-4 text-[#003A6C] border-gray-300 rounded focus:ring-[#003A6C]"
                                />
                                <div>
                                  <p className="text-sm font-medium text-gray-700">{item.label}</p>
                                  {item.sublabel && <p className="text-xs text-gray-400">{item.sublabel}</p>}
                                </div>
                              </div>
                              {item.checked ? 
                                <Eye className="w-4 h-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" /> : 
                                <EyeOff className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                              }
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {isExpanded && items.length === 0 && (
                        <div className="px-14 pb-4 text-sm text-gray-400 italic">
                          No hay elementos registrados en esta sección.
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default PortfolioVisibilityPage;