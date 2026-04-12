import { MapPin } from "lucide-react";

interface Props {
  name: string;
  role: string;
  location: string;
  description: string;
  projectsCount: number;
  skillsCount: number;
  technologies: string[];
  image: string;
  portfolioUrl: string;
}

const PortfolioCard = ({
  name,
  role,
  location,
  description,
  projectsCount,
  skillsCount,
  technologies,
  image,
  portfolioUrl
}: Props) => {
  return (
    <div className="bg-white rounded-2xl border border-[#C9E1F0] p-6 shadow-sm hover:shadow-md transition-all">
      
      {/* Foto */}
      <div className="flex justify-center mb-4">
        <img
          src={image}
          alt={name}
          className="w-20 h-20 rounded-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="text-center mb-4">
        <h3 className="text-[#003A6C] font-bold text-lg">{name}</h3>
        <p className="text-[#4982ad] text-sm">{role}</p>

        <div className="flex items-center justify-center gap-1 text-gray-500 text-sm mt-1">
          <MapPin size={14} />
          <span>{location}</span>
        </div>
      </div>

      {/* Descripción */}
      <p className="text-gray-600 text-sm text-center mb-4 line-clamp-2">
        {description}
      </p>

      {/* Stats */}
      <div className="flex justify-between text-sm text-[#4982ad] mb-4">
        <span>💻 {projectsCount} proyectos</span>
        <span>🧠 {skillsCount} habilidades</span>
      </div>

      {/* Tecnologías */}
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {technologies.slice(0, 4).map((tech, i) => (
          <span
            key={i}
            className="text-xs bg-gray-100 px-2 py-1 rounded-md"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Botón */}
      <a
        href={portfolioUrl}
        target="_blank"
        className="block text-center bg-[#C2DBED] text-[#003A6C] py-2 rounded-lg font-semibold text-sm hover:bg-[#b0cfeb] transition-all"
      >
        Ver portafolio
      </a>
    </div>
  );
};

export default PortfolioCard;