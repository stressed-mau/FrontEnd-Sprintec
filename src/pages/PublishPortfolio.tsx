import React, { useState } from 'react';
import Header from '../components/HeaderUser';
import Sidebar from '../components/Sidebar';
import { Palette } from "lucide-react";
import { usePortfolioVisibility } from '../hooks/usePortfolioVisibility';

const PublishPortfolio = () => {
  const {
    data,
    openSections,
    sectionsArray,
    isLoading,
    isSaving,
    pageError,
    toggleSection,
    handleItemCheck,
    handleBulkSelect,
    getVisibleCountText,
    reloadVisibilityData,
  } = usePortfolioVisibility();

  
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

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
    }
  ];

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
                    <div className={`h-32 flex items-center justify-center bg-gradient-to-br ${template.colorClass} relative`}>
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

                      <button className="w-full py-2.5 border border-[#77B6E6] bg-[#C2DBED] rounded-lg text-sm font-semibold text-[#003A6C] hover:bg-[#C4A57C] transition-colors flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Vista Previa
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
                {sectionsArray.map((sectionConfig) => {
                  const sectionKey = sectionConfig.key;
                  const isOpen = openSections[sectionKey];
                  const items = data[sectionKey];
                  const countText = getVisibleCountText(sectionKey);
                  const sectionEnabled = items.some(item => item.checked);

                  return (
                    <div key={sectionKey} className="border border-[#C9E1F0] rounded-xl overflow-hidden bg-white">
                      
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
                          onClick={() => toggleSection(sectionKey)}
                          disabled={isLoading}
                          className="text-gray-400 p-1 hover:bg-gray-100 rounded-full transition-colors"
                          aria-label={isOpen ? "Cerrar sección" : "Abrir sección"}>
                          <svg className={`w-5 h-5 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>

                      <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-250 opacity-100' : 'max-h-0 opacity-0'}`}>
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
                            {items.map((item) => (
                              <div key={item.id} className="flex items-center gap-3">
                                <input 
                                  type="checkbox" 
                                  checked={item.checked} 
                                  disabled={isLoading || isSaving}
                                  onChange={() => void handleItemCheck(sectionKey, item.id)}
                                  className="w-5 h-5 text-[#003A6C] border-gray-300 rounded focus:ring-[#003A6C] focus:ring-2 cursor-pointer"
                                />
                                <div className="flex flex-col md:flex-row md:items-baseline md:gap-2">
                                  <span className="text-[#003A6C] font-medium">{item.label}</span>
                                  <span className="text-gray-400 text-sm">{item.sublabel}</span>
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default PublishPortfolio;