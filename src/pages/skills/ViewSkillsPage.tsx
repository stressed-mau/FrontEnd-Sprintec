import Header from '../../components/HeaderUser';
import Sidebar from '../../components/Sidebar';
import { Footer } from '@/components/Footer';
import { Code2, Lightbulb, Search } from 'lucide-react';
import { useSkillsManager } from '@/hooks/useSkillsManager';
import ConfirmationModal from '../../components/ConfirmationModal';

const LEVEL_LABELS: Record<string, string> = {
  experto: 'Experto',
  avanzado: 'Avanzado',
  intermedio: 'Intermedio',
  basico: 'Básico',
};

const LEVEL_COLORS: Record<string, string> = {
  experto: 'bg-purple-100 text-purple-700',
  avanzado: 'bg-pink-100 text-pink-600',
  intermedio: 'bg-blue-100 text-blue-600',
  basico: 'bg-gray-100 text-gray-600',
};

const ViewSkillsPage = () => {
  const {
    filteredTechnicalSkills, filteredSoftSkills, pageError, setPageError,isLoading, searchQuery, setSearchQuery,
  } = useSkillsManager();

  return (
    <div className="min-h-screen bg-[#F7F0E1] flex flex-col">
      <Header />
      <div className="flex flex-col lg:flex-row flex-1">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 md:p-10">
          <div className="max-w-5xl mx-auto">

            {/* Encabezado */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#003A6C] md:text-4xl mb-2">
                Habilidades
              </h1>
              <p className="text-sm text-[#4B778D] md:text-base">
                Gestiona tus habilidades técnicas y blandas
              </p>
            </div>

            {/* Buscador */}
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#4B778D]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre o nivel..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#0E7D96]/20 bg-white text-[#003A6C] placeholder:text-[#4B778D]/60 outline-none focus:ring-2 focus:ring-[#0E7D96]/30 shadow-sm"  />
            </div>

            {/* Sección Técnicas */}
            <section className="mb-10">
              <div className="flex items-center gap-2 mb-4 text-[#003A6C]">
                <Code2 className="size-5" />
                <h2 className="text-xl font-bold sm:text-2xl">Habilidades Técnicas</h2>
              </div>

              {isLoading ? (
                <div className="rounded-2xl border border-[#6dacbf]/30 bg-white py-10 text-center shadow-sm">
                  <p className="text-sm text-[#4B778D]">Cargando habilidades...</p>
                </div>
              ) : filteredTechnicalSkills.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-[#6dacbf] bg-[#F7F0E1] py-14 text-center shadow-sm">
                  <p className="text-sm text-[#4B778D]">
                    {searchQuery
                      ? 'No hay habilidades técnicas que coincidan con la búsqueda'
                      : 'No hay habilidades técnicas registradas'}
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-[#6dacbf]/30 bg-white shadow-sm overflow-hidden">
                  {/* Cabecera de tabla */}
                  <div className="grid grid-cols-2 px-5 py-3 border-b border-[#6dacbf]/20">
                    <span className="text-xs font-bold text-[#4B778D] uppercase tracking-wider">
                      Habilidad
                    </span>
                    <span className="text-xs font-bold text-[#4B778D] uppercase tracking-wider">
                      Nivel
                    </span>
                  </div>
                  {/* Filas */}
                  {filteredTechnicalSkills.map((skill, idx) => (
                    <div
                      key={skill.id}
                      className={`grid grid-cols-2 px-5 py-4 items-center ${
                        idx !== filteredTechnicalSkills.length - 1
                          ? 'border-b border-[#6dacbf]/10'
                          : ''
                      }`}
                    >
                      <span className="font-semibold text-[#003A6C]">{skill.name}</span>
                      {skill.level ? (
                        <span
                          className={`inline-flex w-fit px-3 py-1 rounded-full text-xs font-medium ${
                            LEVEL_COLORS[skill.level.toLowerCase()] ?? 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {LEVEL_LABELS[skill.level.toLowerCase()] ?? skill.level}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Sección Blandas */}
            <section>
              <div className="flex items-center gap-2 mb-4 text-[#003A6C]">
                <Lightbulb className="size-5" />
                <h2 className="text-xl font-bold sm:text-2xl">Habilidades Blandas</h2>
              </div>

              {isLoading ? (
                <div className="rounded-2xl border border-[#6dacbf]/30 bg-white py-10 text-center shadow-sm">
                  <p className="text-sm text-[#4B778D]">Cargando habilidades...</p>
                </div>
              ) : filteredSoftSkills.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-[#6dacbf] bg-[#F7F0E1] py-14 text-center shadow-sm">
                  <p className="text-sm text-[#4B778D]">
                    {searchQuery
                      ? 'No hay habilidades blandas que coincidan con la búsqueda'
                      : 'No hay habilidades blandas registradas'}
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-[#6dacbf]/30 bg-white shadow-sm overflow-hidden">
                  {/* Cabecera de tabla */}
                  <div className="px-5 py-3 border-b border-[#6dacbf]/20">
                    <span className="text-xs font-bold text-[#4B778D] uppercase tracking-wider">
                      Habilidad
                    </span>
                  </div>
                  {/* Filas */}
                  {filteredSoftSkills.map((skill, idx) => (
                    <div
                      key={skill.id}
                      className={`px-5 py-4 ${
                        idx !== filteredSoftSkills.length - 1
                          ? 'border-b border-[#6dacbf]/10'
                          : ''
                      }`}
                    >
                      <span className="font-semibold text-[#003A6C]">{skill.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>

          </div>
        </main>
      </div>
      <ConfirmationModal
         isOpen={!!pageError}
         title="Error"
          message={pageError}
          buttonText="Cerrar"
          onClose={() => setPageError('')}/>
      <Footer />
    </div>
  );
};

export default ViewSkillsPage;