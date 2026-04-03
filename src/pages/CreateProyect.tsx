import { useState } from 'react';
import Header from '../components/HeaderUser';
import Sidebar from '../components/Sidebar';
import ProjectCard from '../components/ProjectCard';
import { Plus } from 'lucide-react';

interface Project {
  nombre: string;
  descripcion: string;
  tecnologias: string[];
  rol: string;
  fecha: string;
  github?: string;
  demo?: string;
  image?: string;
}

const CreateProyect = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [errors, setErrors] = useState<any>({});
  const [success, setSuccess] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  // ✅ ELIMINAR
  const handleDelete = (index: number) => {
    const updated = projects.filter((_, i) => i !== index);
    setProjects(updated);
  };

  // ✅ EDITAR
  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  // ✅ SUBMIT
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);

  const file = formData.get('image') as File;
  const github = formData.get('github') as string;
  const demo = formData.get('demo') as string;

  const nombre = formData.get('nombre') as string;
  const descripcion = formData.get('descripcion') as string;
  const tecnologiasRaw = formData.get('tecnologias') as string;
  const rol = formData.get('rol') as string;
  const fecha = formData.get('fecha') as string;

  const urlRegex = /^https?:\/\/.+/;

  let newErrors: any = {};

  // =========================
  // VALIDACIONES
  // =========================

  // Nombre
  if (!nombre || !nombre.trim()) {
    newErrors.nombre = "El nombre del proyecto es obligatorio.";
  } else if (nombre.length > 100) {
    newErrors.nombre = "Máximo 100 caracteres.";
  }

  // Descripción
  if (descripcion && descripcion.length > 300) {
    newErrors.descripcion = "La descripción no puede exceder 300 caracteres.";
  }

  // Tecnologías
  const tecnologias = tecnologiasRaw
    ?.split(',')
    .map(t => t.trim())
    .filter(t => t.length > 0);

  if (!tecnologias || tecnologias.length === 0) {
    newErrors.tecnologias = "Debes ingresar al menos una tecnología.";
  }

  // Rol
  if (rol && rol.length > 80) {
    newErrors.rol = "El rol no puede exceder 80 caracteres.";
  }

  // Fecha
  if (!fecha) {
    newErrors.fecha = "La fecha es obligatoria.";
  }

  // URLs
  if (github && !urlRegex.test(github)) {
    newErrors.github = "El enlace de GitHub no es válido.";
  }

  if (demo && !urlRegex.test(demo)) {
    newErrors.demo = "El enlace de la demo no es válido.";
  }

  // Imagen
  if (file && file.size > 0) {
    if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
      newErrors.image = "Formato de imagen no válido.";
    }

    if (file.size > 2 * 1024 * 1024) {
      newErrors.image = "La imagen no debe superar los 2MB.";
    }
  }

  // =========================
  // SETEAR ERRORES
  // =========================
  setErrors(newErrors);

  if (Object.keys(newErrors).length > 0) return;

  // =========================
  // CREAR OBJETO
  // =========================
  const newProject: Project = {
    nombre,
    descripcion,
    tecnologias,
    rol,
    fecha,
    github,
    demo,

    image:
      file && file.size > 0
        ? URL.createObjectURL(file)
        : editingIndex !== null
        ? projects[editingIndex].image
        : undefined
  };

  // =========================
  // EDITAR O CREAR
  // =========================
  if (editingIndex !== null) {
    const updated = [...projects];
    updated[editingIndex] = newProject;
    setProjects(updated);
  } else {
    setProjects([...projects, newProject]);
  }

  // =========================
  // FEEDBACK + RESET
  // =========================
  setSuccess("Proyecto guardado correctamente.");

  setTimeout(() => {
    setSuccess("");
  }, 3000);

  (e.target as HTMLFormElement).reset();
  setPreview(null);
  setEditingIndex(null);
  setIsModalOpen(false);
};


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
                onClick={() => {
                  setEditingIndex(null);
                  setIsModalOpen(true);
                }}
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
                  onClick={() => setIsModalOpen(true)}
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
              <button id="btn-close-modal" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div>
                <label className="block text-sm font-normal text-[#003A6C] mb-1">Nombre del proyecto *</label>
                <input required id="nombre" name="nombre" defaultValue={editingIndex !== null ? projects[editingIndex].nombre : ""} type="text" className="w-full px-3 py-1.5 rounded-lg border border-[#4982AD] bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
                {errors.nombre && (
                  <p id="error-nombre" className="text-red-500 text-xs mt-1">{errors.nombre}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-normal text-[#003A6C] mb-1">Descripción</label>
                <textarea id="descripcion" name="descripcion" defaultValue={editingIndex !== null ? projects[editingIndex].descripcion : ""} rows={3} className="w-full px-3 py-1.5 rounded-lg border border-[#4982AD] bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
                {errors.descripcion && (
                <p id="error-descripcion" className="text-red-500 text-xs mt-1">{errors.descripcion}</p>
              )}
              </div>
              <div>
                <label className="block text-sm font-normal text-[#003A6C] mb-1">Tecnologías (separadas por comas)</label>
                <input id="tecnologias" name="tecnologias" defaultValue={editingIndex !== null ? projects[editingIndex].tecnologias.join(', ') : ""} type="text" placeholder="React, Node.js, PostgreSQL" className="w-full px-3 py-1.5 rounded-lg border border-[#4982AD] bg-white text-[#003A6C] text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                {errors.tecnologias && (
                  <p id="error-tecnologias" className="text-red-500 text-xs mt-1">{errors.tecnologias}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-normal text-[#003A6C] mb-1">Tu rol en el proyecto</label>
                <input id="rol" name="rol" defaultValue={editingIndex !== null ? projects[editingIndex].rol : ""} type="text" placeholder="Full Stack Developer" className="w-full px-3 py-1.5 rounded-lg border border-[#4982AD] bg-white text-[#003A6C] text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                {errors.rol && (
                  <p id="error-rol" className="text-red-500 text-xs mt-1">{errors.rol}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-normal text-[#003A6C] mb-1">Enlace a GitHub</label>
                <input id="github" name="github" defaultValue={editingIndex !== null ? projects[editingIndex].github : ""} type="text" placeholder="https://github.com/usuario/proyecto" className="w-full px-3 py-1.5 rounded-lg border border-[#4982AD] bg-white text-[#003A6C] text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                {errors.github && (
                  <p id="error-github" className="text-red-500 text-xs mt-1">{errors.github}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-normal text-[#003A6C] mb-1">Enlace a la demo</label>
                <input id="demo" name="demo" defaultValue={editingIndex !== null ? projects[editingIndex].demo : ""} type="text" placeholder="https://demo.com" className="w-full px-3 py-1.5 rounded-lg border border-[#4982AD] bg-white text-[#003A6C] text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                {errors.demo && (
                  <p id="error-demo" className="text-red-500 text-xs mt-1">{errors.demo}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-normal text-[#003A6C] mb-1">Fecha de realización</label>
                  <input id="fecha" name="fecha" defaultValue={editingIndex !== null ? projects[editingIndex].fecha : ""} type="date" className="w-full px-3 py-1.5 rounded-lg border border-[#4982AD] bg-white text-[#003A6C] text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                  {errors.fecha && (
                    <p id="error-fecha" className="text-red-500 text-xs mt-1">{errors.fecha}</p>
                  )}
                </div>
              </div>
              {preview && (
                <img 
                  src={preview} 
                  className="w-full h-40 object-cover rounded-lg mb-2"
                />
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

                  // 🔥 PREVIEW
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
                  className="bg-[#003A6C] text-white px-4 py-2 text-sm rounded-lg font-medium hover:bg-[#002d54]"
                >
                  Guardar proyecto
                </button>

                <button 
                  id="btn-cancel"
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
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
    </div>
  );
};

export default CreateProyect;