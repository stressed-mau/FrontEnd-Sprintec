// components/CreateProyect.tsx
import Header from '../components/HeaderUser';
import Sidebar from '../components/Sidebar';
import ProjectCard from '../components/ProjectCard';
import { Plus } from 'lucide-react';
import { useCreateProyect } from "../hooks/useCreateProyect";
import { useEffect, useState, useRef  } from 'react';
import { createLanguage, getLanguages, getProjects } from "@/services/ProjectService";
const CreateProyect = () => {
  const {
    projects,
    isModalOpen,
    editingIndex,
    errors,
    success,
    setSuccess, 
    preview,
    setPreview,
    handleDelete,
    handleEdit,
    handleSubmit,
    handleChange,
    openModal,
    closeModal
  } = useCreateProyect();
  const [isCurrent, setIsCurrent] = useState(false);
  const [techSearch, setTechSearch] = useState("");
  const [techList, setTechList] = useState<{ id: number; name: string }[]>([]);

  const [selectedTechs, setSelectedTechs] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (editingIndex !== null) {
      const project = projects[editingIndex];

      setSelectedTechs(project.tecnologias || []);
      setIsCurrent(project.is_current || false);
    }
  },  [editingIndex, projects]);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
    useEffect(() => {
    const fetchTechs = async () => {
      try {
        const data = await getLanguages();
        setTechList(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTechs();
  }, []);
  

  return (
    <div className="min-h-screen bg-[#F7F0E1]">
      <Header />
      <div className="flex flex-col md:flex-row">
        <Sidebar />

        <main className="flex-1 p-4 md:p-10">
          <div className="max-w-6xl mx-auto">
            {/* Header de la sección */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
              <div className="text-center md:text-left">
                <h1 className="text-[#003A6C] text-3xl md:text-4xl font-bold mb-2">Mis Proyectos</h1>
                <p className="text-gray-600 text-sm md:text-base">Gestiona los proyectos de tu portafolio</p>
              </div>
              <button 
                id="btn-add-project"
                onClick={() => openModal()}
                className="bg-[#003A6C] text-white text-sm px-3 py-1.5 rounded-lg flex items-center gap-2 hover:bg-[#002d54] transition-all font-normal"
              >
                <Plus size={20} /> Agregar proyecto
              </button>
            </div>

            {/* Estado Vacío vs Listado */}
            {projects.length === 0 ? (
              <div className="border-2 border-dashed border-blue-300 rounded-2xl p-20 flex flex-col items-center justify-center bg-white">
                <p className="text-gray-500 mb-6 text-lg">Tu portafolio aún no tiene proyectos. Agrega tu primer proyecto.</p>
                <button 
                  id="btn-add-first-project"
                  onClick={() => openModal()}
                  className="bg-[#003A6C] text-white text-sm px-5 py-2 rounded-lg flex items-center gap-2 font-normal shadow-md hover:scale-105 transition-transform"
                >
                  <Plus size={20} /> Agregar primer proyecto
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {projects.map((p, index) => (
                  <ProjectCard
                    key={index}
                    project={p}
                    onEdit={() => handleEdit(index)}
                    onDelete={() => handleDelete(index)}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-[#C2DBED] rounded-xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 pb-0">
            <div>
              <h2 className="text-[#003A6C] text-lg font-semibold">Nuevo proyecto</h2>
              <p className="text-[#4982AD] text-sm">Agrega la información de tu proyecto</p>
            </div>

            <button
              id="btn-close-modal"
              onClick={() => {
                closeModal();
                setSelectedTechs([]);
                setTechSearch("");
              }}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              &times;
            </button>  
              
            </div>

            <form onSubmit={(e) => handleSubmit(e, selectedTechs)} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div>
                <label className="block text-sm font-normal text-[#003A6C] mb-1">Nombre del proyecto *</label>
                <input id="nombre" name="nombre" maxLength={60} defaultValue={editingIndex !== null ? projects[editingIndex].nombre : ""} type="text" className="w-full px-3 py-1.5 rounded-lg border border-[#4982AD] bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
                {errors.nombre && (
                  <p id="error-nombre" className="text-red-500 text-xs mt-1">{errors.nombre}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-normal text-[#003A6C] mb-1">Descripción</label>
                <textarea id="descripcion" name="descripcion" onChange={handleChange} maxLength={250} defaultValue={editingIndex !== null ? projects[editingIndex].descripcion : ""} rows={3} className="w-full px-3 py-1.5 rounded-lg border border-[#4982AD] bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
                {errors.descripcion && (
                <p id="error-descripcion" className="text-red-500 text-xs mt-1">{errors.descripcion}</p>
              )}
              </div>
              
              <div ref={dropdownRef} className="relative">
                <label className="block text-sm font-normal text-[#003A6C] mb-1">
                  Tecnologías
                </label>

                {/* Buscador */}
                <div className="flex flex-wrap items-center gap-2 border border-[#4982AD] rounded-lg px-2 py-1 bg-white mb-2">
  
                {selectedTechs.map(t => (
                  <span
                    key={t.id}
                    className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs"
                  >
                    {t.name}
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedTechs(prev => prev.filter(s => s.id !== t.id))
                      }
                    >
                      ✕
                    </button>
                  </span>
                ))}

                <input
                  type="text"
                  placeholder="Buscar o agregar tecnología..."
                  value={techSearch}
                  onChange={(e) => setTechSearch(e.target.value)}
                  onFocus={() => setShowDropdown(true)}
                  className="flex-1 outline-none text-sm"
                />
              </div>

                {/* Lista filtrada */}
                {showDropdown && (
                <div className="max-h-32 overflow-y-auto border rounded-lg bg-white mb-2">
                  {(() => {
                    const filtered = techList.filter(t => 
                      t.name.toLowerCase().includes(techSearch.toLowerCase()) &&
                      !selectedTechs.some(s => s.id === t.id)
                    );

                    return (
                      <>
                        {filtered.map(t => (
                          <div
                            key={t.id}
                            onClick={() => {
                              setSelectedTechs(prev => [...prev, t]);
                              setTechSearch("");
                              setShowDropdown(false);
                            }}
                            className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                          >
                            {t.name}
                          </div>
                        ))}

                        {filtered.length === 0 && (
                          <p className="text-xs text-gray-400 px-3 py-2">
                            No hay resultados
                          </p>
                        )}
                      </>
                    );
                  })()}
                </div>
                )}
                {/* Crear nueva tecnología */}
                {techSearch && !techList.some(t => t.name.toLowerCase() === techSearch.toLowerCase()) && (
                  <button
                    type="button"
                    onClick={async () => {
                    try {
                      const newTech = await createLanguage(techSearch);

                      setTechList(prev => [...prev, newTech]);
                      setSelectedTechs(prev => [...prev, newTech]);
                      setTechSearch("");
                    } catch (error) {
                      console.error(error);
                    }
                  }}
                    className="text-blue-600 text-xs mb-2"
                  >
                    + Agregar "{techSearch}"
                  </button>
                )}

                {errors.tecnologias && (
                  <p className="text-red-500 text-xs mt-1">{errors.tecnologias}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-normal text-[#003A6C] mb-1">Tu rol en el proyecto</label>
                <input id="rol" name="rol" onChange={handleChange} maxLength={50} defaultValue={editingIndex !== null ? projects[editingIndex].rol : ""} type="text" placeholder="Full Stack Developer" className="w-full px-3 py-1.5 rounded-lg border border-[#4982AD] bg-white text-[#003A6C] text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                {errors.rol && (
                  <p id="error-rol" className="text-red-500 text-xs mt-1">{errors.rol}</p>
                )}
              </div>
              <div>
                <div className="flex gap-3">
                  
                  {/* FECHA INICIO */}
                  <div className="w-1/2">
                    <label className="block text-sm font-normal text-[#003A6C] mb-1">
                      Fecha de inicio
                    </label>
                    <input
                      id="fechaInicio"
                      name="fechaInicio"
                      type="date"
                      max={new Date().toISOString().split("T")[0]}
                      onChange={handleChange}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#4982AD] bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    
                  </div>

                  {/* FECHA FIN */}
                  <div className="w-1/2">
                    <label className="block text-sm font-normal text-[#003A6C] mb-1">
                      Fecha de finalización
                    </label>
                    <input
                      id="fechaFin"
                      name="fechaFin"
                      type="date"
                      max={new Date().toISOString().split("T")[0]}
                      onChange={handleChange}
                      disabled={isCurrent}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#4982AD] bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  
                  </div>

                </div>
                {errors.fechaError && (
                  <p className="text-red-500 text-xs mt-1 text-left w-full">
                    {errors.fechaError}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id="is_current"
                  name="is_current"
                  checked={isCurrent}
                  onChange={(e) => {
                    setIsCurrent(e.target.checked);

                    if (e.target.checked) {
                      const fechaFinInput = document.getElementById("fechaFin") as HTMLInputElement;
                      if (fechaFinInput) fechaFinInput.value = "";
                    }
                  }}
                  className="w-4 h-4"
                />
                <label htmlFor="is_current" className="text-sm text-[#003A6C]">
                  Actualmente trabajo en este proyecto
                </label>
              </div>
              <div>
                <label className="block text-sm font-normal text-[#003A6C] mb-1">Enlace a GitHub</label>
                <input id="github" name="github" maxLength={50} defaultValue={editingIndex !== null ? projects[editingIndex].github : ""} type="text" placeholder="https://github.com/usuario/proyecto" className="w-full px-3 py-1.5 rounded-lg border border-[#4982AD] bg-white text-[#003A6C] text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                {errors.github && (
                  <p id="error-github" className="text-red-500 text-xs mt-1">{errors.github}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-normal text-[#003A6C] mb-1">Enlace a la demo</label>
                <input id="demo" name="demo" maxLength={100} defaultValue={editingIndex !== null ? projects[editingIndex].demo : ""} type="text" placeholder="https://demo.com" className="w-full px-3 py-1.5 rounded-lg border border-[#4982AD] bg-white text-[#003A6C] text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                {errors.demo && (
                  <p id="error-demo" className="text-red-500 text-xs mt-1">{errors.demo}</p>
                )}
              </div>
              <div>
              <label className="block text-sm font-normal text-[#003A6C] mb-1">Imagen del proyecto</label>
              </div>
              {preview && (
                <img 
                  src={preview} 
                  className="w-full h-40 object-cover rounded-lg mb-2"
                />
              )}

              {preview && (
                <button 
                  type="button"
                  onClick={() => setPreview(null)}
                  className="text-red-500 text-sm hover:underline mb-2"
                >
                  Eliminar imagen
                </button>
              )}

              <div className="flex items-center gap-3">
              <label className="cursor-pointer bg-[#003A6C] text-white px-4 py-1.5 text-sm rounded-lg hover:bg-[#002d54] transition">
                Seleccionar archivo
                <input 
                  id = "image"
                  name = "image"
                  type="file" 
                  accept="image/png, image/jpeg, image/gif"
                  className="hidden"
                  onChange={(e) => {
                  const file = e.target.files?.[0];

                  // Mostrar nombre archivo
                  const fileName = file?.name || "Ningún archivo seleccionado";
                  const label = document.getElementById("file-name");
                  if (label) label.textContent = fileName;

                  
                  if (file) {
                    setPreview(URL.createObjectURL(file));
                  }
                }}
                />
              </label>

              <span id="file-name" className="text-sm text-gray-600">
                Ningún archivo seleccionado
              </span>
            </div>

            <p className="text-gray-600 text-xs mt-2 text-left">
              Formatos: JPG, PNG, GIF (máx. 2MB)
            </p>
            {errors.image && (
              <p id="error-image" className="text-red-500 text-xs mt-1">{errors.image}</p>
            )}

              <div className="flex gap-3 pt-4 justify-start">
                
                <button 
                  id="btn-submit"
                  type="submit" 
                  className="bg-[#003A6C] text-white px-4 py-2 text-sm rounded-lg font-medium hover:bg-[#1a4f85]"
                >
                  Guardar proyecto
                </button>

                <button 
                  id="btn-cancel"
                  type="button" 
                  onClick={() => {
                    closeModal();
                    setSelectedTechs([]);
                    setTechSearch("");
                  }}
                  className="bg-[#C2DBED] text-[#003A6C] px-4 py-2 text-sm rounded-lg border border-[#4982AD] font-medium hover:bg-[#C4A57C]"
                >
                  Cancelar
                </button>
              </div>
              {success && (
                <p id="success-message" className="text-green-600 text-sm mt-2">
                  {success}
                </p>
              )}
            </form>
          </div>
        </div>
      )}
      {success && ( 
      <div className="fixed inset-0 z-110 flex items-center justify-center p-4 bg-black/30 backdrop-blur-[2px]">
        <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-8 text-center">
          
          <h3 className="text-[#003A6C] text-xl font-bold mb-2">
            El proyecto ha sido registrado exitosamente.
          </h3>

          <p className="text-gray-600 text-sm">
            {success}
          </p>

          <button 
            onClick={() => setSuccess("")}
            className="mt-4 px-4 py-2 bg-[#003A6C] text-white rounded-lg"
          >
            Cerrar
          </button>

        </div>
      </div>
    )}
    </div>
  );
};

export default CreateProyect;