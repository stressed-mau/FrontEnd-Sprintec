import Header from '../../components/HeaderUser';
import Sidebar from '../../components/Sidebar';
import { Footer } from '@/components/Footer';
import { Code2, Lightbulb } from 'lucide-react';
import { useSkillsManager } from '@/hooks/skills/useSkillsManager';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import SkillsSearchBar from '@/components/skills/skillsSearchBar';
import SkillsLoading from '@/components/skills/SkillsLoading';
import SkillsEmptyState from '@/components/skills/SkillsEmptyState';
import SkillLevelBadge from '@/components/skills/SkillLevelBadge';

const ViewSkillsPage = () => {
  const {
    filteredTechnicalSkills, filteredSoftSkills, pageError, setPageError,isLoading, searchQuery, setSearchQuery,
  } = useSkillsManager();

  return (
    <div className="min-h-screen bg-[#F7F0E1] flex flex-col">
      <Header />
      <div className="flex flex-col lg:flex-row flex-1">
        <Sidebar />
        <main className="flex-1 px-4 py-6 md:px-8 lg:px-10">
          <div className="mx-auto max-w-6xl space-y-6">

            {/* Encabezado */}
              <h1 className="mb-2 text-3xl font-bold text-[#003A6C]">
                Ver Habilidades
              </h1>
              <p className="text-sm text-[#4B778D] md:text-base">
                Gestiona tus habilidades técnicas y blandas
              </p>

            {/* Buscador */}
            <SkillsSearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Buscar por nombre o nivel..." />

            {/* Sección Técnicas */}
            <section className="mb-10">
              <div className="flex items-center gap-2 mb-4 text-[#003A6C]">
                <Code2 className="size-5" />
                <h2 className="text-xl sm:text-2xl">Habilidades Técnicas</h2>
              </div>

              {isLoading ? (
                <SkillsLoading />
              ) : filteredTechnicalSkills.length === 0 ? (
                <SkillsEmptyState
                  searchQuery={searchQuery}
                  emptyMessage="No hay habilidades técnicas registradas"
                  searchMessage="No hay habilidades técnicas que coincidan con la búsqueda"
                />
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
                      <SkillLevelBadge  level={skill.level}/>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Sección Blandas */}
            <section>
              <div className="flex items-center gap-2 mb-4 text-[#003A6C]">
                <Lightbulb className="size-5" />
                <h2 className="text-xl sm:text-2xl">Habilidades Blandas</h2>
              </div>

              {isLoading ? (
                <div className="rounded-2xl border border-[#6dacbf]/30 bg-white py-10 text-center shadow-sm">
                  <p className="text-sm text-[#4B778D]">Cargando habilidades...</p>
                </div>
              ) : filteredSoftSkills.length === 0 ? (
                <SkillsEmptyState
                  searchQuery={searchQuery}
                  emptyMessage="No hay habilidades blandas registradas"
                  searchMessage="No hay habilidades blandas que coincidan con la búsqueda"
                />
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