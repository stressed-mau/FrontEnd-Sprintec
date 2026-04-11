import Header from "../components/HeaderUser";
import Sidebar from "../components/Sidebar";
import { usePortfolio } from "@/hooks/usePortfolio";
import { Mail, Globe, MapPin, Briefcase, Code } from "lucide-react";

const MyPortfolio = () => {
  const { portfolio, loading } = usePortfolio();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando portafolio...
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        No hay datos disponibles
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F0E1]">
      <Header />

      <div className="flex flex-col md:flex-row">
        <Sidebar />

        <main className="flex-1 p-4 md:p-10">
          <div className="max-w-6xl mx-auto bg-white shadow-lg border-t-8 border-[#003A6C] p-8 md:p-10">

            {/* HEADER */}
            {/* HEADER */}
              <header className="text-center border-b pb-6 mb-8">

                {/* FOTO DE PERFIL */}
                <div className="flex justify-center mb-4">
                  {portfolio.user.image_url ? (
                    <img
                      src={portfolio.user.image_url}
                      alt={portfolio.user.fullname}
                      className="w-28 h-28 rounded-full object-cover border-4 border-[#003A6C]"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                      Sin foto
                    </div>
                  )}
                </div>

                <h1 className="text-4xl font-serif font-bold uppercase">
                  {portfolio.user.fullname}
                </h1>

                <p className="text-[#003A6C] mt-2 font-medium">
                  {portfolio.user.occupation}
                </p>

                <div className="flex flex-wrap justify-center gap-6 mt-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Mail size={16} /> {portfolio.user.public_email}
                  </span>

                  <span className="flex items-center gap-1">
                    <MapPin size={16} /> {portfolio.user.nationality}
                  </span>

                  {portfolio.socialNetworks.map((sn, index) => (
                    <span key={index} className="flex items-center gap-1">
                      <Globe size={16} /> {sn.name}
                    </span>
                  ))}
                </div>
              </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

              {/* SOBRE MÍ + SKILLS */}
              <aside className="space-y-8">

                <div>
                  <h3 className="font-bold uppercase border-b pb-2">
                    Sobre mí
                  </h3>

                  <p className="text-sm text-gray-600 mt-3">
                    {portfolio.user.biography}
                  </p>
                </div>

                <div>
                  <h3 className="font-bold uppercase border-b pb-2">
                    Habilidades
                  </h3>

                  <div className="mt-3 flex flex-col gap-2">
                    {portfolio.skills.map((skill, index) => (
                      <div
                        key={index}
                        className="text-sm text-gray-700 flex items-center gap-2"
                      >
                        <div className="w-1.5 h-1.5 bg-[#003A6C] rounded-full" />
                        <span className="font-medium">{skill.name}</span>

                        {/* opcional: nivel si existe */}
                        {"level" in skill && skill.level && (
                          <span className="text-xs text-gray-400">
                            ({skill.level})
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </aside>

              {/* EXPERIENCIA + PROYECTOS */}
              <section className="md:col-span-2 space-y-10">

                {/* EXPERIENCIA */}
                <div>
                  <h3 className="flex items-center gap-2 text-xl font-bold uppercase">
                    <Briefcase size={18} /> Experiencia
                  </h3>

                  <div className="mt-6 space-y-6">
                    {portfolio.experiences.map((exp, index) => (
                      <div key={index} className="border-l-2 pl-4">

                        <p className="font-bold">{exp.position}</p>

                        <p className="text-[#003A6C] text-sm">
                          {exp.company}
                        </p>

                        {/* opcional si tienes fechas */}
                        {"startDate" in exp && (
                          <p className="text-xs text-gray-500 mt-1">
                            {exp.startDate} - {exp.current ? "Actualidad" : exp.endDate}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* PROYECTOS */}
                <div>
                  <h3 className="flex items-center gap-2 text-xl font-bold uppercase">
                    <Code size={18} /> Proyectos
                  </h3>

                  <div className="mt-6 grid gap-4">
                    {portfolio.projects.map((project, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 border-l-4 border-[#003A6C] p-4"
                      >
                        <h4 className="font-bold text-sm uppercase">
                          {project.nombre || project.nombre}
                        </h4>

                        <p className="text-sm text-gray-600 mt-1">
                          {project.descripcion || project.descripcion}
                        </p>

                        {/* tecnologías si existen */}
                        {"tecnologias" in project && project.tecnologias?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {project.tecnologias.map((t: any) => (
                              <span
                                key={t.id}
                                className="text-xs bg-gray-200 px-2 py-1 rounded"
                              >
                                {t.name}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* rol opcional */}
                        {"rol" in project && (
                          <p className="text-xs text-gray-500 mt-2">
                            Rol: {project.rol}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyPortfolio;