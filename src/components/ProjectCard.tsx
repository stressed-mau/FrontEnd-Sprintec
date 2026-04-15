import { GitBranch, ExternalLink, Pencil, Trash2 } from 'lucide-react';

interface ProjectProps {
  project: any;
  onEdit: () => void;
  onDelete: () => void;
}

const ProjectCard = ({ project, onEdit, onDelete }: ProjectProps) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col h-full">
      
      {project.image && (
        <div className="h-48 bg-gray-100 relative">
          <img src={project.image} alt={project.nombre} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-[#003A6C] font-bold text-xl mb-1 flex items-center justify-between">
          {project.nombre}

          <span
            className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
              project.is_current
                ? "bg-green-50 text-green-600"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                project.is_current ? "bg-green-500" : "bg-gray-400"
              }`}
            ></span>

            {project.is_current ? "Activo" : "Finalizado"}
          </span>
        </h3>
        {project.is_current && (
          <p className="text-green-600 text-sm mb-2 font-medium">
            Actualmente trabajo en este proyecto
          </p>
        )}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.descripcion}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {(Array.isArray(project.tecnologias) ? project.tecnologias : []).map(
            (tech: string | { name?: string }, idx: number) => (
            <span key={idx} className="bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full border border-blue-100">
              {typeof tech === "string" ? tech : tech?.name ?? "—"}
            </span>
          ))}
        </div>

        <div className="text-sm text-gray-700 space-y-1 mb-6">
          <p><span className="font-bold">Rol:</span> {project.rol}</p>
          {project.fechaInicio && (
            <p>
              <span className="font-bold">Período:</span>{" "}
              {new Date(project.fechaInicio).toLocaleDateString("es-ES", {
                month: "short",
                year: "numeric"
              })}

              {" - "}

              {project.is_current
                ? "Actualidad"
                : project.fechaFin
                  ? new Date(project.fechaFin).toLocaleDateString("es-ES", {
                      month: "short",
                      year: "numeric"
                    })
                  : "—"}
            </p>
          )}
        </div>

        {(project.github || project.demo) && (
          <div className="flex gap-3 mb-4">
            {project.github && (
              <a href={project.github} target="_blank" className="flex items-center gap-2 text-sm">
                <GitBranch size={16}/> GitHub
              </a>
            )}
            {project.demo && (
              <a href={project.demo} target="_blank" className="flex items-center gap-2 text-sm">
                <ExternalLink size={16}/> Demo
              </a>
            )}
          </div>
        )}

        <hr className="mb-4" /> 
      </div>
    </div>
  );
};

export default ProjectCard;