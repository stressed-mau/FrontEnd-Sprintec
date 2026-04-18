import Header from '../components/HeaderUser';
import Sidebar from '../components/Sidebar';
import { Footer } from '@/components/Footer';
import ProjectCard from '../components/ProjectCard';
import { Plus } from 'lucide-react';
import { useCreateProyect } from "../hooks/useCreateProyect";
import { useEffect, useState, useRef  } from 'react';
import { getLanguages } from "@/services/ProjectService";
import ConfirmationModal from '../components/ConfirmationModal';
const FIXED_ROLES = [
  "Frontend Developer", "Backend Developer", "Fullstack Developer", 
  "Mobile Developer", "Software Architect", "Tech Lead", 
  "QA Engineer", "Project Manager", "Product Manager", "Data Scientist"
];
const CreateProyect = () => {
  const {
    projects,
    isModalOpen,
    editingIndex,
    errors,
    isCurrent, 
    setIsCurrent,
    selectedTechs, 
    setSelectedTechs,
    selectedRole, 
    setSelectedRole,
    techSearch, 
    setTechSearch,
    roleSearch, 
    setRoleSearch,
    success,
    setSuccess, 
    preview,
    setPreview,
    handleDelete,
    handleEdit,
    handleSubmit,
    handleChange,
    openModal,
    closeModal,
    isSubmitting
  } = useCreateProyect();

  const [techList, setTechList] = useState<{ id: number; name: string }[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const roleDropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
  if (editingIndex !== null) {
    const project = projects[editingIndex];
      setSelectedTechs(project.tecnologias || []);
      setIsCurrent(project.is_current || false);
      const roleName = project.rol || "";
      setSelectedRole(roleName);
      setRoleSearch(""); 
    }
  }, [editingIndex, projects]);

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
        console.error("Error al cargar tecnologías:", error);
      }
    };
    fetchTechs();
    // Se eliminó fetchRoles()
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(e.target as Node)) {
        setShowRoleDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  

  return (
    <div className="min-h-screen bg-[#F7F0E1] flex flex-col">
      <Header />
      <div className="flex flex-col md:flex-row flex-1">
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
      <Footer />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-[#C2DBED] rounded-xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-[#4982AD]/20">
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
                setSelectedRole(null);
                setRoleSearch("");
              }}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              &times;
            </button>  
              
            </div>

            <form
              onSubmit={(e) => handleSubmit(e, selectedTechs, selectedRole, isCurrent)}
              className="flex flex-col flex-1 min-h-0"
            >
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-normal text-[#003A6C] mb-1">Nombre del proyecto *</label>
                <input id="nombre" name="nombre" onChange={handleChange} maxLength={60} defaultValue={editingIndex !== null ? projects[editingIndex].nombre : ""} type="text" className="w-full px-3 py-1.5 rounded-lg border border-[#4982AD] bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
                {errors.nombre && (
                  <p id="error-nombre" className="text-red-500 text-xs mt-1">{errors.nombre}</p>
                )}
              </div>
              <div >
                <label className="block text-sm font-normal text-[#003A6C] mb-1">Descripción</label>
                <textarea id="descripcion" name="descripcion" onChange={handleChange} maxLength={250} defaultValue={editingIndex !== null ? projects[editingIndex].descripcion : ""} rows={3} className="w-full px-3 py-1.5 rounded-lg border border-[#4982AD] bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
                {errors.descripcion && (
                <p id="error-descripcion" className="text-red-500 text-xs mt-1">{errors.descripcion}</p>
              )}
              </div>
              
              {/* --- SECCIÓN DE TECNOLOGÍAS --- */}
              <div ref={dropdownRef} className="relative">
                <label className="block text-sm font-normal text-[#003A6C] mb-1">
                  Tecnologías*
                </label>

                {/* Contenedor del Buscador y Tags */}
                <div className="flex flex-wrap items-center gap-2 border border-[#4982AD] rounded-lg px-2 py-1 bg-white mb-2 focus-within:ring-1 focus-within:ring-[#003A6C]">
                  {selectedTechs.map((t) => (
                    <span
                      key={t.id}
                      className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {t.name}
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedTechs((prev) => prev.filter((s) => s.id !== t.id))
                        }
                        className="hover:text-blue-900 ml-1"
                      >
                        ✕
                      </button>
                    </span>
                  ))}

                  <input
                    type="text"
                    placeholder={
                      selectedTechs.length >= 10
                        ? "Límite alcanzado (máx 10)"
                        : "Buscar tecnología..."
                    }
                    value={techSearch}
                    onChange={(e) => setTechSearch(e.target.value)}
                    onFocus={() => setShowDropdown(true)}
                    disabled={selectedTechs.length >= 10}
                    className={`flex-1 outline-none text-sm py-1 ${
                      selectedTechs.length >= 10 ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                  />
                </div>

                {/* Dropdown de Resultados (Solo Selección) */}
                {showDropdown && techSearch.trim() !== "" && (
                  <div className="absolute z-20 w-full max-h-40 overflow-y-auto border border-gray-200 rounded-lg bg-white shadow-xl">
                    {(() => {
                      const filtered = techList.filter(
                        (t) =>
                          t.name.toLowerCase().includes(techSearch.toLowerCase()) &&
                          !selectedTechs.some((s) => s.id === t.id)
                      );

                      return (
                        <>
                          {filtered.map((t) => (
                            <div
                              key={t.id}
                              onClick={() => {
                                if (selectedTechs.length >= 10) return;
                                setSelectedTechs((prev) => [...prev, t]);
                                setTechSearch("");
                                setShowDropdown(false);
                              }}
                              className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm transition-colors"
                            >
                              {t.name}
                            </div>
                          ))}

                          {filtered.length === 0 && (
                            <p className="text-xs text-gray-400 px-3 py-3 text-center">
                              No hay resultados (Si no la encuentras, selecciona "Otro")
                            </p>
                          )}
                        </>
                      );
                    })()}
                  </div>
                )}

                {/* Errores de Tecnologías */}
                {errors.tecnologias && (
                  <p className="text-red-500 text-xs mt-1 italic">{errors.tecnologias}</p>
                )}
              </div>

              {/* --- SECCIÓN DE ROL EN EL PROYECTO --- */}
              <div ref={roleDropdownRef} className="relative mt-4">
                <label className="block text-sm font-normal text-[#003A6C] mb-1">
                  Tu rol en el proyecto*
                </label>

                <div className="flex flex-wrap items-center gap-2 border border-[#4982AD] rounded-lg px-2 py-1 bg-white mb-1 focus-within:ring-1 focus-within:ring-[#003A6C]">
                  {/* Visualización del Rol Seleccionado como Tag */}
                  {selectedRole && (
                    <span className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                      {selectedRole}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRole("");
                          handleChange({ target: { name: "role", value: "" } } as any);
                        }}
                        className="hover:text-blue-900 ml-1"
                      >
                        ✕
                      </button>
                    </span>
                  )}

                  {/* Input Buscador de Roles */}
                  {!selectedRole && (
                    <input
                      type="text"
                      placeholder="Ej: Frontend Developer..."
                      value={roleSearch}
                      onChange={(e) => {
                        setRoleSearch(e.target.value);
                        setShowRoleDropdown(true);
                      }}
                      onFocus={() => setShowRoleDropdown(true)}
                      className="flex-1 outline-none text-sm py-1"
                    />
                  )}
                </div>

                {/* Dropdown de Roles Predefinidos */}
                {showRoleDropdown && (
                  <div className="absolute z-20 w-full max-h-40 overflow-y-auto border border-gray-200 rounded-lg bg-white shadow-xl mt-1">
                    {FIXED_ROLES.filter((r) =>
                      r.toLowerCase().includes(roleSearch.toLowerCase())
                    ).map((roleName) => (
                      <div
                        key={roleName}
                        onClick={() => {
                          setSelectedRole(roleName); // Guardamos el nombre como texto
                          setRoleSearch("");
                          setShowRoleDropdown(false);
                          // Sincronizamos con el hook pasando el valor como texto
                          handleChange({ target: { name: "role", value: roleName } } as any);
                        }}
                        className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm transition-colors"
                      >
                        {roleName}
                      </div>
                    ))}
                    {FIXED_ROLES.filter((r) =>
                      r.toLowerCase().includes(roleSearch.toLowerCase())
                    ).length === 0 && (
                      <p className="text-xs text-gray-400 px-3 py-2">No se encontró el rol</p>
                    )}
                  </div>
                )}

                {/* Errores de Rol */}
                {errors.role && (
                  <p className="text-red-500 text-xs mt-1 italic">{errors.role}</p>
                )}
              </div>
              <div>
                <div className="flex gap-3">
                  
                  {/* FECHA INICIO */}
                  <div className="w-1/2">
                    <label className="block text-sm font-normal text-[#003A6C] mb-1">
                      Fecha de inicio*
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
                      Fecha de finalización*
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
              <label className="block text-sm font-normal text-[#003A6C] mb-1">
                Enlace a GitHub
              </label>
              <input 
                id="github" 
                name="github" 
                maxLength={50} 
                onChange={handleChange} 
                defaultValue={editingIndex !== null ? projects[editingIndex].github : ""} 
                type="text" 
                placeholder="https://github.com/usuario/proyecto" 
                className="w-full px-3 py-1.5 rounded-lg border border-[#4982AD] bg-white text-[#003A6C] text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
              />
              {errors.github && (
                <p id="error-github" className="text-red-500 text-xs mt-1">
                  {errors.github}
                </p>
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
                  onClick={() => {
                    setPreview(null);
                    const label = document.getElementById("file-name");
                    if (label) label.textContent = "Ningún archivo seleccionado";
                    const fileInput = document.getElementById("image") as HTMLInputElement;
                    if (fileInput) fileInput.value = "";
                  }}
                  className="bg-[#C2DBED] text-[#003A6C] px-4 py-2 text-sm rounded-lg border border-[#4982AD] font-medium hover:bg-[#C4A57C]"
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
                  accept="image/png, image/jpeg"
                  className="hidden"
                  onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && !["image/jpeg", "image/png"].includes(file.type)) {
                    alert("El sistema solo permite subir archivos en formato JPG o PNG");
                    e.target.value = ""; 
                    return;
                  }
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
              Formatos: JPG, PNG (máx. 2MB)
            </p>
            {errors.image && (
              <p id="error-image" className="text-red-500 text-xs mt-1">{errors.image}</p>
            )}

              {errors.form && (
                <p id="error-form-submit" className="text-red-600 text-sm" role="alert">
                  {errors.form}
                </p>
              )}

              <div className="flex gap-3 pt-4 justify-start">
                
                <button 
                  id="btn-submit"
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#003A6C] text-white px-4 py-2 text-sm rounded-lg font-medium hover:bg-[#1a4f85] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Guardando…" : "Guardar proyecto"}
                </button>

                <button 
                  id="btn-cancel"
                  type="button" 
                  onClick={() => {
                    closeModal();
                    setSelectedTechs([]);
                    setTechSearch("");
                    setSelectedRole(null);
                    setRoleSearch("");
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
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal de Éxito */}
      <ConfirmationModal
        isOpen={!!success}
        title="Éxito"
        message={success || "Proyecto registrado correctamente."}
        buttonText="Continuar"
        onClose={() => setSuccess("")}
      />
    </div>
  );
};

export default CreateProyect;
