import Header from '../components/HeaderUser';
import Sidebar from '../components/Sidebar';
import { usePortfolioVisibility } from '../hooks/usePortfolioVisibility';

const PublishPortfolio = () => {
  const {
    data,
    openSections,
    sectionsArray,
    toggleSection,
    handleItemCheck,
    handleBulkSelect,
    getVisibleCountText,
  } = usePortfolioVisibility();

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
     
            <section className="bg-white rounded-2xl border border-[#C9E1F0] p-6 shadow-sm" aria-labelledby="visibility-config-title">
              <h2 id="visibility-config-title" className="text-[#003A6C] text-xl font-bold mb-1">Configuración de Visibilidad</h2>
              <p className="text-gray-500 text-sm mb-6">Elige qué elementos específicos mostrar en tu portafolio</p>

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
                              onChange={() => handleBulkSelect(sectionKey, !sectionEnabled)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#003A6C]"></div>
                          </label>
                          <span className="text-[#003A6C] font-semibold">{sectionConfig.title}</span>
                          <span className="text-gray-400 text-sm ml-2">{countText}</span>
                        </div>
                        
                        <button 
                          onClick={() => toggleSection(sectionKey)}
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
                              onClick={() => handleBulkSelect(sectionKey, true)}
                              className="px-4 py-1.5 text-sm bg-[#C9E1F0] text-[#003A6C] hover:bg-[#C4A57C] rounded-md font-medium hover:bg-opacity-80 transition-colors" >
                              Seleccionar todos
                            </button>
                            <button 
                              onClick={() => handleBulkSelect(sectionKey, false)}
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
                                  onChange={() => handleItemCheck(sectionKey, item.id)}
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